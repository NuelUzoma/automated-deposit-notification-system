'use strict';

// Migration file to establish foreign key constraint between users and wallets
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('wallets', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_user_wallet',
      references: {
        table: 'users',
        fields: ['id'],
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('users', 'fk_user_wallet');
  },
};
