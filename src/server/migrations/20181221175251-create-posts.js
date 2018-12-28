'use strict';
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface
      .createTable('Posts', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        PostId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Posts',
            key: 'id',
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
          allowNull: true, // when we create the post, we don't have the new ID yet, so we need to keep it null before we can update it
        },
        version: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        },
        uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        EmailThreadId: {
          type: DataTypes.STRING,
        },
        title: {
          type: DataTypes.STRING,
        },
        html: {
          type: DataTypes.TEXT,
        },
        text: {
          type: DataTypes.TEXT,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      })
      .then(() =>
        queryInterface.addIndex('Posts', ['slug', 'version'], {
          indicesType: 'UNIQUE',
        }),
      )
      .then(() =>
        queryInterface.addIndex('Posts', ['PostId', 'version'], {
          indicesType: 'UNIQUE',
        }),
      );
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('Posts');
  },
};
