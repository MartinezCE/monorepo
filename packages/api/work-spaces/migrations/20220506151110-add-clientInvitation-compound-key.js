'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const invitations = await queryInterface.sequelize.query(
      `
      SELECT id
        FROM \`client-invitations\` AS a
        JOIN (
          SELECT max(id) as lastId, company_id, to_email
            FROM \`client-invitations\`
            GROUP BY company_id, to_email
            HAVING count(*) > 1
        ) AS b
        WHERE a.company_id = b.company_id
        AND a.to_email = b.to_email
        AND a.id < b.lastId
      `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkDelete('client-invitations', {
      id: {
        [Sequelize.Op.in]: invitations.map(invitation => invitation.id),
      },
    });

    await queryInterface.addConstraint('client-invitations', {
      fields: ['company_id', 'to_email'],
      type: 'unique',
      name: 'company_id__to_email__unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('client-invitations', 'company_id__to_email__unique');
  },
};
