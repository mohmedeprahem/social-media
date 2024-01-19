'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      isEmailPrivate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      newEmail: {
        type: Sequelize.STRING,
        required: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gender: {
        type: Sequelize.STRING,
        required: true,
        values: ['male', 'female']
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      otpCode: {
        type: Sequelize.STRING,
        required: false
      },
      otpCreatedAt: {
        type: Sequelize.DATE,
        required: false
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      likeCounter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      commentCounter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('users')
  }
};
