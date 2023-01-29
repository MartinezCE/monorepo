'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate('companies', { fee_percentage: 0.1 }, { fee_percentage: null });
    await queryInterface.changeColumn('companies', 'fee_percentage', {
      type: Sequelize.DECIMAL(3, 2),
      defaultValue: 0.1,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('companies', 'fee_percentage', {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
    });
  },
};
