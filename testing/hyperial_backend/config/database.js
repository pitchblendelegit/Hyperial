import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('testing', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
