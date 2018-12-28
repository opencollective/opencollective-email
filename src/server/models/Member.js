'use strict';
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      GroupId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Groups',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true, // we can follow only a Post
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
      role: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {},
  );
  Member.findOrCreate = async memberData => {
    const membership = await Member.findOne({ where: { ...memberData } });
    if (membership) return membership;
    try {
      return await Member.create(memberData);
    } catch (e) {
      console.error('Member.findOrCreate: unable to create a new membership', memberData);
      throw e;
    }
  };
  Member.associate = function(m) {
    // associations can be defined here
  };
  return Member;
};
