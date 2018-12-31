'use strict';
import slugify from 'limax';
import { omit } from 'lodash';

module.exports = (sequelize, DataTypes) => {
  const { models, Op } = sequelize;

  const Group = sequelize.define(
    'Group',
    {
      GroupId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Groups',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true,
        get() {
          return this.getDataValue('GroupId') || this.id;
        },
      },
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.STRING, // PUBLISHED | ARCHIVED | DRAFT | DELETED,
        defaultValue: 'PUBLISHED',
      },
      uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
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
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      color: DataTypes.STRING,
      settings: DataTypes.JSON,
    },
    {
      paranoid: true,
      hooks: {
        beforeValidate: group => {
          group.slug = group.slug || slugify(group.name);
        },
        afterCreate: async group => {
          let action = 'CREATE';
          if (group.getDataValue('GroupId')) {
            action = 'EDIT';
          } else {
            group.GroupId = group.id;
            await group.update({ GroupId: group.id });
          }
          models.Activity.create({
            action,
            UserId: group.UserId,
            GroupId: group.GroupId,
            TargetUUID: group.uuid,
          });
        },
      },
    },
  );

  Group.findBySlug = slug => Group.findOne({ where: { slug }, order: [['version', 'DESC']] });

  /**
   * Edits a group and saves a new version
   */
  Group.prototype.edit = async function(groupData) {
    const newVersionData = {
      ...omit(this.dataValues, ['id']),
      ...groupData,
      version: this.version + 1,
      status: 'PUBLISHED',
    };
    await this.update({ status: 'ARCHIVED' });
    return await Group.create(newVersionData);
  };

  /**
   * Add members
   * @PRE: recipients: array({ name, email });
   */
  Group.prototype.addMembers = async function(recipients, options = {}) {
    const promises = recipients.map(recipient => models.User.findOrCreate(recipient));
    const users = await Promise.all(promises);
    return Promise.all(users.map(user => user.join({ GroupId: this.GroupId, ...options })));
  };

  /**
   * Add followers
   * @PRE: recipients: array({ name, email });
   */
  Group.prototype.addFollowers = async function(recipients) {
    return this.addMembers(recipients, { role: 'FOLLOWER' });
  };

  Group.associate = function(m) {
    // group.getFollowers();
    Group.belongsToMany(m.User, {
      through: { model: m.Member, unique: false, scope: { role: 'FOLLOWER' } },
      as: 'followers',
      foreignKey: 'GroupId',
    });
  };

  return Group;
};
