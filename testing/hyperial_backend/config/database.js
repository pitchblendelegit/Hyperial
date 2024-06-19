const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('testing', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

return sequelize;
