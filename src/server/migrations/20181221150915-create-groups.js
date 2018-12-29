'use strict';
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface
      .createTable(
        'Groups',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          GroupId: {
            type: DataTypes.INTEGER,
            references: {
              model: 'Groups',
              key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
            allowNull: true,
          },
          version: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
          },
          name: {
            type: DataTypes.STRING,
          },
          description: {
            type: DataTypes.STRING,
          },
          image: {
            type: DataTypes.STRING,
          },
          color: {
            type: DataTypes.STRING,
          },
          settings: {
            type: DataTypes.JSON,
          },
          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },
        },
        {
          paranoid: true,
        },
      )
      .then(() =>
        queryInterface.addIndex('Groups', ['slug', 'version'], {
          indicesType: 'UNIQUE',
        }),
      )
      .then(() =>
        queryInterface.addIndex('Groups', ['GroupId', 'version'], {
          indicesType: 'UNIQUE',
        }),
      );
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('Groups');
  },
};
