"use strict";
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: {
        type: DataTypes.STRING
      },
      lastName: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      gender: {
        type: DataTypes.STRING
      },
      zipcode: {
        type: DataTypes.STRING
      },
      preferredLanguage: {
        type: DataTypes.STRING
      },
      languages: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      country: {
        type: DataTypes.STRING
      },
      website: {
        type: DataTypes.STRING
      },
      twitter: {
        type: DataTypes.STRING
      },
      facebook: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable("Users");
  }
};
