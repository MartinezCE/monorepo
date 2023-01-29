'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'UNIQUE',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
