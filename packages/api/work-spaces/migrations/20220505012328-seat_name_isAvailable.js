'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('seats', 'name', {
      after: 'blueprint_id',
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('seats', 'is_available', {
      after: 'blueprint_id',
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('seats', 'name');
    await queryInterface.removeColumn('seats', 'is_available');
  },
};
