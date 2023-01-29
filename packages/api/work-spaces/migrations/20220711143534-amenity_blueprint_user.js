'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('user_amenities', 'users_amenities');

    await queryInterface.addColumn('users_amenities', 'blueprint_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'blueprints',
        key: 'id',
      },
      after: 'amenity_id',
    });

    await queryInterface.sequelize.query(`
      UPDATE users_amenities
      INNER JOIN amenities ON amenities.id = users_amenities.amenity_id
      INNER JOIN seats_amenities ON seats_amenities.amenity_id = amenities.id
      INNER JOIN seats ON seats.id = seats_amenities.seat_id
      INNER JOIN blueprints ON blueprints.id = seats.blueprint_id
      SET users_amenities.blueprint_id = blueprints.id
    `);

    await queryInterface.changeColumn('users_amenities', 'blueprint_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'blueprints',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users_amenities', 'blueprint_id');
  },
};
