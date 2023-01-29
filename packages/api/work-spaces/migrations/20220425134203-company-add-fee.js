'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'fee_percentage', {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('companies', 'fee_percentage');
  },
};
