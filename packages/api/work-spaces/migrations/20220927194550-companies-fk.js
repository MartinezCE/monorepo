'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('companies', 'state_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'states',
        key: 'id',
      },
    });
    await queryInterface.changeColumn('companies', 'company_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'company_types',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {},
};
