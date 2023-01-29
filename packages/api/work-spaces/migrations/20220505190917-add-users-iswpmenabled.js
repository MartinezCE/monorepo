'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'is_wpm_enabled', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      after: 'company_role',
    });

    const userTypes = await queryInterface.rawSelect('user_types', { where: { value: 'CLIENT' }, plain: false }, [
      'id',
    ]);

    await queryInterface.bulkUpdate(
      'users',
      { is_wpm_enabled: false },
      { user_type_id: { [Sequelize.Op.in]: userTypes.map(u => u.id) } }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'is_wpm_enabled');
  },
};
