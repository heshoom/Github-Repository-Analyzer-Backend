// db.js

const { Sequelize } = require('sequelize');

const db = new Sequelize('github_repo', 'postgres', 'qazwsx', {
  host: 'localhost',
  dialect: 'postgres',
});

// // Test the connection
(async () => {
  try {
    await db.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = db;
