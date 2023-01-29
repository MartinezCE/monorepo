'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('locations', 'company_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('locations', 'state_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'states',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('locations', 'currency_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'currencies',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
