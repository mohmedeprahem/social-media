'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('postsLikes', {
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      postId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'posts',
          key: 'id'
        },
        onDelete: 'CASCADE',
      }
    })

    await queryInterface.addConstraint('postsLikes', {
      type: 'unique',
      fields: ['userId', 'postId'],
      name: 'userId_postId_uniqueConstraint',
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('postsLikes', 'userId_postId_uniqueConstraint');
    await queryInterface.dropTable('postsLikes');
  }
};
