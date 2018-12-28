'use strict';
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define(
    'Activity',
    {
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
      TargetUUID: DataTypes.UUID,
      action: DataTypes.STRING,
    },
    {},
  );
  Activity.associate = function(models) {
    // associations can be defined here
  };
  return Activity;
};
