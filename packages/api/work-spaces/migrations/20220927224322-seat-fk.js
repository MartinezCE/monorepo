'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('seats', 'blueprint_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'blueprints',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('seats', 'space_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'space_types',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
