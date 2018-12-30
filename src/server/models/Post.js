'use strict';
import config from 'config';
import slugify from 'limax';
import { omit, get } from 'lodash';
import libemail from '../lib/email';
import { extractNamesAndEmailsFromString, isEmpty } from '../lib/utils';

module.exports = (sequelize, DataTypes) => {
  const { models } = sequelize;

  const Post = sequelize.define(
    'Post',
    {
      // Canonical post id since a post can have multiple versions
      PostId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Posts',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true,
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      GroupId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Groups',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      ParentPostId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Posts',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        set(slug) {
          if (slug && slug.toLowerCase) {
            this.setDataValue(
              'slug',
              slug
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/\./g, ''),
            );
          }
        },
      },
      uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      EmailThreadId: DataTypes.STRING,
      title: DataTypes.STRING,
      html: DataTypes.TEXT,
      text: DataTypes.TEXT,
    },
    {
      paranoid: true,
      hooks: {
        beforeValidate: post => {
          post.slug = post.slug || slugify(post.title);
        },
        afterCreate: async post => {
          let action = 'CREATE';
          if (post.PostId) {
            action = 'EDIT';
          } else {
            post.PostId = post.id;
            await post.update({ PostId: post.id, slug: `${post.slug}-${post.PostId}` });
          }
          const activityData = {
            action,
            UserId: post.UserId,
            GroupId: post.GroupId,
            PostId: post.PostId,
            TargetUUID: post.uuid,
          };
          models.Activity.create(activityData);
        },
      },
    },
  );
  Post.findBySlug = slug => Post.findOne({ where: { slug }, order: [['version', 'DESC']] });
  Post.findByEmailThreadId = EmailThreadId => {
    const matches = EmailThreadId.match(/\/posts\/([0-9]+)\/([0-9]+)@/);
    if (matches) {
      return Post.findById(matches[1]);
    } else {
      return Post.findOne({ where: { EmailThreadId }, order: [['version', 'DESC']] });
    }
  };

  /**
   * Create a post from an email object returned by mailgun
   * If the group doesn't exist, we create it and add the sender as the admin
   * @POST:
   *   - create new user / new group if needed
   *   - new Post created and sent to all followers of the group and all recipients
   *   - sender and all recipients (To, Cc) added as followers of the Post
   */
  Post.createFromEmail = async email => {
    const { groupSlug, tags, recipients } = libemail.parseHeaders(email);

    const groupEmail = `${groupSlug}@${get(config, 'collective.domain')}`;
    const userData = extractNamesAndEmailsFromString(email.From)[0];
    const user = await models.User.findOrCreate(userData);

    let group = await models.Group.findBySlug(groupSlug);

    // If the group doesn't exist, we create it and add the recipients as admins and followers
    if (!group) {
      group = await user.createGroup({ slug: groupSlug, name: groupSlug, tags });
      await group.addMembers(recipients, { role: 'ADMIN' });
      await group.addFollowers(recipients);
      const followers = await group.getFollowers();
      await libemail.sendTemplate('groupCreated', { group, followers }, userData.email);
    } else {
      // If the group exists and if the email is empty,
      if (isEmpty(email.subject) || isEmpty(email['stripped-text'])) {
        // we add the sender and recipients as followers of the group
        await group.addFollowers([...recipients, userData]);
        // we send an update about the group info
        const followers = await group.getFollowers();
        await libemail.sendTemplate('groupInfo', { group, followers }, userData.email);
      }
    }

    // if the content of the email is empty, we don't create any post
    if (isEmpty(email['stripped-text'])) {
      return;
    }

    let EmailThreadId, parentPost;
    // if it's a reply to a thread
    if (email['In-Reply-To']) {
      EmailThreadId = email['In-Reply-To'];
      parentPost = await models.Post.findByEmailThreadId(EmailThreadId);
    } else {
      EmailThreadId = email['Message-Id'];
    }
    const postData = {
      GroupId: group.GroupId,
      title: email.subject,
      html: email['stripped-html'],
      text: email['stripped-text'],
      EmailThreadId,
      ParentPostId: parentPost && parentPost.PostId,
    };
    const post = await user.createPost(postData);

    const thread = parentPost ? parentPost : post;
    // We always add people explicitly mentioned in To or Cc as followers of the thread
    await thread.addFollowers(recipients);

    const headers = {
      'Message-Id': `${groupSlug}/posts/${thread.PostId}/${post.PostId}@${get(config, 'collective.domain')}`,
      References: `${groupSlug}/posts/${thread.PostId}@${get(config, 'collective.domain')}`,
      'Reply-To': `${group.name} <${groupSlug}+post:${post.PostId}@${get(config, 'collective.domain')}>`,
    };

    let data;
    // If it's a new thread, we reply to the sender to confirm that the topic has been created
    if (!parentPost) {
      const followers = await group.getFollowers();
      data = { groupSlug, followersCount: followers.length };
      await libemail.sendTemplate('threadCreated', data, user.email);
      // We send the new post to followers of the group + the recipients
      const unsubscribeLabel = `Click here to stop receiving new emails sent to ${group.slug}@${get(
        config,
        'collective.domain',
      )}`;
      data = { post: post.dataValues, unsubscribe: { label: unsubscribeLabel, data: { GroupId: group.id } } };
      await libemail.sendTemplate('post', data, groupEmail, {
        exclude: [user.email],
        from: `${userData.name} <${groupSlug}@${get(config, 'collective.domain')}>`,
        cc: [...followers.map(u => u.email), ...recipients.map(r => r.email)],
        headers,
      });
    } else {
      // if it's part of a thread, we send the post to the followers of the parent post + recipients
      const followers = await thread.getFollowers();
      const unsubscribeLabel = `Click here to stop receiving new replies to this thread`;
      data = { post: post.dataValues, unsubscribe: { label: unsubscribeLabel, data: { PostId: thread.PostId } } };
      await libemail.sendTemplate('post', data, groupEmail, {
        exclude: [user.email],
        from: `${userData.name} <${groupSlug}@${get(config, 'collective.domain')}>`,
        cc: [...followers.map(u => u.email), ...recipients.map(r => r.email)],
        headers,
      });
    }
    return post;
  };
  /**
   * Edits a post and saves a new version
   */
  Post.prototype.edit = function(postData) {
    const newVersionData = {
      ...omit(this.dataValues, ['id']),
      ...postData,
      version: this.version + 1,
    };
    return Post.create(newVersionData);
  };

  /**
   * Add followers
   * @PRE: recipients: array({ name, email });
   */
  Post.prototype.addFollowers = async function(recipients) {
    const promises = recipients.map(recipient => models.User.findOrCreate(recipient));
    const users = await Promise.all(promises);
    return Promise.all(users.map(user => user.follow({ PostId: this.PostId })));
  };

  Post.associate = m => {
    // post.getFollowers();
    Post.belongsToMany(m.User, {
      through: { model: m.Member, unique: false, scope: { role: 'FOLLOWER' } },
      as: 'followers',
      foreignKey: 'PostId',
    });
  };
  return Post;
};
