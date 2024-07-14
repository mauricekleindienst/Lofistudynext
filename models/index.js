const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const Message = sequelize.define('Message', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

sequelize.sync();

module.exports = { sequelize, Message };
