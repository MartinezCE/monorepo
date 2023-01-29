'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `
      SELECT DISTINCT(user_id), MIN(created_at) AS min_created_at, COUNT(*) AS quantity
      FROM plan_users
      GROUP BY user_id
      HAVING quantity > 1
    `,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    await Promise.all(
      users.map(async u =>
        queryInterface.bulkDelete('plan_users', {
          user_id: u.user_id,
          created_at: { [Sequelize.Op.ne]: u.min_created_at },
        })
      )
    );

    await queryInterface.addConstraint('plan_users', {
      fields: ['user_id'],
      type: 'unique',
      name: 'plan_users_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('plan_users', 'plan_users_unique');
  },
};
