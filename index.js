const express = require ('express');
const app = express(); 
const bodyParser = require ('body-parser');
const connection = require ('./database/database');
const Pergunta = require ('./database/Pergunta');
const Resposta = require ('./database/Resposta');

//Database
connection
    .authenticate()
    .then(()=>{
        console.log('Conexão feita com banco de dados!')
    })
    .catch((msgErro)=>{
        console.log(msgErro);
    })

//Estou dizendo para o Express usar o EJS como View Egine
app.set('view engine','ejs');
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Pesquisando pelas perguntas; a lista de perguntas é enviada para variável criada
//Envia a variável para o front-ender através do Render 
app.get('/', (req,res) => {
    Pergunta.findAll({raw:true, order: [
        ['id','DESC']  //ASC = crescente
    ]}).then(perguntas=>{
        res.render('index',{
            perguntas:perguntas
        });
    })
});

app.get('/perguntar', (req,res) =>{
    res.render('perguntar');
});

//Recebo dados do formulário e salvo nas variáveis; faço um INSERT na tabela Perguntas passando dados do formulário
//caso ocorra sucesso o usuário é redirecionado para a página principal 
app.post('/salvarpergunta',(req,res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo:titulo,
        descricao:descricao
    }).then(()=>{
        res.redirect("/");
    })
});


app.get("/pergunta/:id", (req,res)=>{
    var id=req.params.id;
    Pergunta.findOne({              //Pesquiso uma pergunta no bando de dados; se eu achar recebo na variável
        where: {id:id}
    }).then(pergunta=>{
        if (pergunta!=undefined){ //Pergunta encontrada
             Resposta.findAll({             //Pesquiso por respostas com ID dessa pergunta
                where:{perguntaId:pergunta.id},
                order:[
                    ['id', 'DESC']
                ]
             }).then(respostas=>{           //Recebo as respostas e passo para a view
                res.render("pergunta", {
                    pergunta:pergunta,
                    respostas:respostas
                });
             })
        }else{ // Não encontrada
            res.redirect("/");
        }
    })
});

app.post('/responder', (req,res)=>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect('/pergunta/'+perguntaId);
    })
});

app.listen(4040, ()=>{console.log("App rodando!");});
