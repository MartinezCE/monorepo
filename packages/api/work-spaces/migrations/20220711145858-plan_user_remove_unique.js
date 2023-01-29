'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeConstraint('plan_users', 'plan_users_ibfk_2');
    await queryInterface.removeConstraint('plan_users', 'plan_users_unique');
    await queryInterface.addConstraint('plan_users', {
      fields: ['user_id'],
      type: 'FOREIGN KEY',
      references: {
        table: 'users',
        field: 'id',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.addConstraint('plan_users', {
      fields: ['user_id'],
      type: 'unique',
      name: 'plan_users_unique',
    });
  },
};
