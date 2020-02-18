// configurando o servidor
const express = require("express")
const server = express()


// configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true}))

//configurar a conexao com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'donation'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, // boolean ou booleano
}) // raiz do projeto (./)

// lista de doadores: Vetor ou Array
/*const donors = [
    {
        name: "Guilherme Soares",
        blood: "AB+"        
    },
    {
        name: "Carlos Henrique",
        blood: "B+"        
    },
    {
        name: "Beatriz Pereira",
        blood: "A-"        
    },
    {
        name: "Gabriel Astolfo",
        blood: "O+"        
    },
]*/

// configurar a apresentacao da página
server.get("/", function(req, res){
    
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de Dados.")
    

        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res){
    //pegar dados do formulário.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // se o name igual a vazio
    // ou o email igual a vazio
    // ou o blood igual a vazio
    // caso ocorra return ele nao continua o programa.
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    //colocar valores dentro do array/vetor
    /*donors.push({
        name: name,
        blood: blood,
    })*/

    //coloco valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`
    
    const values= [name, email, blood]

    db.query(query, values, function(err) {
        //fluxo de erro
        if (err) return res.send("erro no banco de dados.")
        
        //fluxo ideal
        return res.redirect("/")
    })


   })


// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("Started")
})