'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('floors', 'location_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: 'locations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('floors', 'location_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
  },
};
