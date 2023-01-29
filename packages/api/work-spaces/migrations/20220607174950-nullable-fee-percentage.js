'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('companies', 'fee_percentage', {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
    UPDATE companies AS c
      INNER JOIN companies_users AS cu ON cu.company_id = c.id
      INNER JOIN users AS u ON cu.user_id = u.id
      INNER JOIN user_types AS ut ON ut.id = u.user_type_id
    SET c.fee_percentage = null
    WHERE ut.value = "CLIENT";`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    UPDATE companies AS c
      INNER JOIN companies_users AS cu ON cu.company_id = c.id
      INNER JOIN users AS u ON cu.user_id = u.id
      INNER JOIN user_types AS ut ON ut.id = u.user_type_id
    SET c.fee_percentage = 0.1
    WHERE ut.value = "CLIENT" AND c.fee_percentage IS null;`);

    await queryInterface.changeColumn('companies', 'fee_percentage', {
      type: Sequelize.DECIMAL(3, 2),
      defaultValue: 0.1,
      allowNull: false,
    });
  },
};
