'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('seats', 'geometry', {
      type: Sequelize.GEOMETRY('POINT'),
      allowNull: true,
    });

    await queryInterface.changeColumn('seats', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('seats', 'is_available', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('seats', 'geometry', {
      type: Sequelize.GEOMETRY('POINT'),
      allowNull: false,
    });

    await queryInterface.changeColumn('seats', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeTable('seats', 'is_available', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
  },
};
