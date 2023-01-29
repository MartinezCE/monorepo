'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const roleId = await queryInterface.rawSelect('user_roles', { where: { value: 'ACCOUNT_MANAGER' } }, ['id']);
    const typeId = await queryInterface.rawSelect('user_types', { where: { value: 'CLIENT' } }, ['id']);

    await queryInterface.sequelize.query(`update users set user_role_id = ${roleId} where user_role_id is null and user_type_id = ${typeId}`);

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`update users set user_role_id = null where user_role_id is not null and user_type_id = ${typeId}`);
  },
};
