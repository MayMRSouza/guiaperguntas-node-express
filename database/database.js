const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas','root','arnold33',{
    host:'localhost',
    dialect: 'mysql'
});

module.exports = connection; 