'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.ENUM('PENDING', 'APPROVED'),
      allowNull: true,
      after: 'user_type_id',
    });

    await queryInterface.bulkUpdate('users', {
      status: 'APPROVED',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'status');
  },
};
