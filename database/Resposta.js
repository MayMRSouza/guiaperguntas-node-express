const Sequelize = require ('sequelize');
const connection = require('./database');

const Resposta=connection.define('respostas', {
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {                    //Resposta ligada ao Id da pergunta (relacionamento cru), relacionando a resposta com a pergunta
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Resposta.sync({force:false});
module.exports=Resposta;