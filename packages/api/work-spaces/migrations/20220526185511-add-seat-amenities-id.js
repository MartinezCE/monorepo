'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('seats_amenities', 'id', {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      before: 'seat_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('seats_amenities', 'id');
  },
};
