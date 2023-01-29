'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('seats', 'blueprint_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: 'blueprints',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('seats', 'blueprint_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
  },
};
