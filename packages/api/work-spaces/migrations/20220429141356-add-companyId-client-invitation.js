'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('client-invitations', 'company_id', {
      after: 'id',
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });

    await queryInterface.sequelize.query(`update \`client-invitations\` 
      inner join users u on u.id = \`client-invitations\`.user_id
      inner join \`companies_users\` cu on cu.user_id = u.id
      inner join companies c on c.id = cu.company_id
      set \`client-invitations\`.company_id = c.id;`);

    await queryInterface.addConstraint('client-invitations', {
      fields: ['company_id'],
      type: 'FOREIGN KEY',
      references: {
        table: 'companies',
        field: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('client-invitations', 'company_id');
  },
};
