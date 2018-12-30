'use strict';

import * as auth from '../lib/auth';
import libemail from '../lib/email';

module.exports = (sequelize, DataTypes) => {
  const { models, Op } = sequelize;
  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      name: {
        type: DataTypes.VIRTUAL,
        get() {
          if (this.getDataValue('name')) return this.getDataValue('name');
          const nameParts = [];
          if (this.getDataValue('firstName')) nameParts.push(this.getDataValue('firstName'));
          if (this.getDataValue('lastName')) nameParts.push(this.getDataValue('lastName'));
          return nameParts.length > 0 ? nameParts.join(' ') : 'anonymous';
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true, // need that? http://stackoverflow.com/questions/16356856/sequelize-js-custom-validator-check-for-unique-username-password
        set(val) {
          if (val && val.toLowerCase) {
            this.setDataValue('email', val.toLowerCase());
          }
        },
        validate: {
          len: {
            args: [6, 128],
            msg: 'Email must be between 6 and 128 characters in length',
          },
          isEmail: {
            msg: 'Email must be valid',
          },
        },
      },
      image: DataTypes.STRING,
      token: DataTypes.STRING,
      gender: DataTypes.STRING,
      zipcode: DataTypes.STRING,
      country: DataTypes.STRING,
      website: DataTypes.STRING,
      twitter: DataTypes.STRING,
      facebook: DataTypes.STRING,
      preferredLanguage: DataTypes.STRING,
      languages: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      paranoid: true,
      hooks: {
        beforeValidate: user => {
          if (user.name && !user.firstName) {
            const spaceIndex = user.name.indexOf(' ');
            if (spaceIndex === -1) {
              user.firstName = user.name;
            } else {
              user.firstName = user.name.substr(0, spaceIndex);
              user.lastName = user.name.substr(spaceIndex + 1);
            }
          }
        },
      },
    },
  );

  User.findByEmail = email => User.findOne({ where: { email: `${email}`.toLowerCase() } });

  /**
   * Signing in the user
   * If doesn't exist, creates a new user and send short code by email
   * If short code provided, verify it matches then generate token
   */
  User.signin = async userData => {
    let user;
    user = await User.findByEmail(userData.email);
    if (!user) {
      user = await User.create(userData);
    }
    // If the user hasn't provided a token, we send a short code by email
    if (!userData.token) {
      await user.generateShortCode();
      await libemail.sendTemplate(
        'shortcode',
        {
          shortcode: user.token,
        },
        user.email,
      );
      return user;
    }
    // if the token is a short code, we generate a long lived token
    if (userData.token.length === 5) {
      if (userData.token !== user.token) {
        throw new Error('Invalid short code');
      }
      await user.generateToken();
      return user;
    }
  };

  User.findOrCreate = async userData => {
    const user = await User.findByEmail(userData.email);
    if (user) return user;
    try {
      return await User.create(userData);
    } catch (e) {
      console.error('User.findOrCreate: Unable to create User', userData, e);
      throw e;
    }
  };

  /**
   * Instance Methods
   */
  User.prototype.generateToken = async function(redirect) {
    const data = { id: this.id, _salt: Math.floor(Math.random() * 9999999999) };
    this.token = auth.createJwt('login', data, auth.TOKEN_EXPIRATION_SESSION);
    return await this.save();
  };

  User.prototype.generateShortCode = function() {
    const shortcode = Math.floor(Math.random() * 99999) + 10000;
    this.token = shortcode;
    this.save();
    return this;
  };

  /**
   * Create a group and add this user as ADMIN and FOLLOWER
   */
  User.prototype.createGroup = async function(groupData) {
    let group;
    try {
      group = await models.Group.create({ ...groupData, UserId: this.id });
    } catch (e) {
      console.error('user.createGroup: unable to create group', groupData);
      throw e;
    }
    const memberships = [
      {
        GroupId: group.id,
        UserId: this.id,
        role: 'ADMIN',
      },
      {
        GroupId: group.id,
        UserId: this.id,
        role: 'FOLLOWER',
      },
    ];
    try {
      await models.Member.bulkCreate(memberships);
    } catch (e) {
      console.error('user.createGroup: unable to bulk create memberships', memberships);
      throw e;
    }
    return group;
  };

  /**
   * Create a post and add this user as ADMIN and FOLLOWER
   */
  User.prototype.createPost = async function(postData) {
    let post;
    try {
      post = await models.Post.create({ ...postData, UserId: this.id });
    } catch (e) {
      console.error('user.createPost: unable to create post', postData, e);
      throw e;
    }
    const memberships = [
      {
        PostId: post.id,
        UserId: this.id,
        role: 'ADMIN',
      },
      {
        PostId: post.id,
        UserId: this.id,
        role: 'FOLLOWER',
      },
    ];
    await models.Member.bulkCreate(memberships);
    return post;
  };

  /**
   * Join a group
   * @PRE: target { GroupId, PostId, role }
   * @POST: a new Member row is created
   */
  User.prototype.join = function(target) {
    return models.Member.findOrCreate({
      ...target,
      UserId: this.id,
    });
  };

  User.prototype.follow = function(target) {
    return this.join({ ...target, role: 'FOLLOWER' });
  };

  User.prototype.unfollow = function(target) {
    const where = {
      ...target,
      UserId: this.id,
      role: 'FOLLOWER',
    };
    return models.Member.destroy({
      where,
    });
  };

  User.associate = m => {
    // associations can be defined here
    // User.hasMany(m.Post);
    // User.hasMany(m.Group); // a user can create many groups
    // User.belongsToMany(m.Group, {
    //   through: { model: m.Member },
    //   foreignKey: 'UserId',
    // });
  };

  return User;
};
