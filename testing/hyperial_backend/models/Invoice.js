import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Order from './Order.js';

const Invoice = sequelize.define('Invoice', {
  OrderId: {
    type: DataTypes.INTEGER,
    references: {
      model: Order,
      key: 'id'
    }
  },
  InvoiceDate: { type: DataTypes.DATE, allowNull: false },
  Amount: { type: DataTypes.FLOAT, allowNull: false },
  Status: { type: DataTypes.STRING, allowNull: false }
});

Invoice.belongsTo(Order, { foreignKey: 'OrderId' });

export default Invoice;
