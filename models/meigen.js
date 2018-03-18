'use strict';
const loader = require('./sequelizeLoader');
const Sequelize = loader.Sequelize;

const Meigen = loader.database.define(
  'meigens',
  {
    meigenId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    teller: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    roomId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  },
  {
    freezeTableName: false,
    timestamps: true,
    indexes: [
      {
        fields: ['teller', 'content']
      },
      {
        fields: ['isDeleted']
      }
    ]
  }
);

module.exports = Meigen;