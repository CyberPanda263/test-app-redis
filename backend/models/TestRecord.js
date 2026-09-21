import pkg from 'sequelize';
const { DataTypes } = pkg;

export default (sequelize) => {
  return sequelize.define('TestRecord', {
    name: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { timestamps: false });
};