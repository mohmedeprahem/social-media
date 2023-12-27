'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('usersFollowing', {
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      followingUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      }
    });

    await queryInterface.addConstraint('usersFollowing', {
      type: 'unique',
      fields: ['userId', 'followingUserId'],
      name: 'userId_followingUserId_uniqueConstraint',
    });

    await queryInterface.addConstraint('usersFollowing', {
      type: 'check',
      fields: ['userId', 'followingUserId'],
      where: {
        userId: {
          [Sequelize.Op.ne]: Sequelize.col('followingUserId')
        }
      },
      name: 'no_self_following'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('usersFollowing', 'uniqueConstraint');
    await queryInterface.removeConstraint('usersFollowing', 'no_self_following');
    await queryInterface.dropTable('usersFollowing');
  }
};
