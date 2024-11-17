import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOSTNAME}:5432/${process.env.DB_NAME}`, {
  dialect: 'postgres',
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};