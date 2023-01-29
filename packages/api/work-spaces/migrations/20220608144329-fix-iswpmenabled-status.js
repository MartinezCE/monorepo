'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    UPDATE users AS u
      INNER JOIN user_types AS ut ON ut.id = u.user_type_id
    SET u.is_wpm_enabled = null
    WHERE ut.value = "PARTNER";`);

    await queryInterface.sequelize.query(`
    UPDATE users AS u
      INNER JOIN user_types AS ut ON ut.id = u.user_type_id
    SET u.status = null
    WHERE ut.value = "PARTNER";`);

    await queryInterface.sequelize.query(`
    UPDATE users AS u
      INNER JOIN user_types AS ut ON ut.id = u.user_type_id
    SET u.status = "PENDING"
    WHERE ut.value = "CLIENT" AND u.status IS null;`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    UPDATE users AS u
      INNER JOIN user_types AS ut ON ut.id = u.user_type_id
    SET u.is_wpm_enabled = true
    WHERE ut.value = "PARTNER";`);

    await queryInterface.sequelize.query(`
    UPDATE users AS u
      INNER JOIN user_types AS ut ON ut.id = u.user_type_id
    SET u.status = "APPROVED"
    WHERE ut.value = "PARTNER";`);
  },
};
