const express = require('express');
const cors = require('cors');
const http = require('http');
const verifySocketToken = require('../middlewares/verifySocketToken');
const { init } = require('../helpers/ioInstance');


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Definición de rutas
        this.authPath = '/clk/auth'; // Autenticación
        this.usersPath = '/clk/user'; // Usuarios
        this.favPath = '/clk/fav'; // Favoritos
        this.depPath = '/clk/sport'; // Deportes
        this.evePath = '/clk/event'; // Eventos
        this.partPath = '/clk/participantes'; // Participantes
        this.follower = '/clk/follow'; // Participantes
        this.posts = '/clk/posts' // Post de informacion

         this.server = http.createServer(this.app);

         // Inicializa Socket.IO
         this.io = init(this.server);
      
        // Configuración de los sockets
        this.configureSockets();

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();
    }

    middlewares() {
        // Cors
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth.routes.js'));
        this.app.use(this.usersPath, require('../routes/user.routes.js'));
        this.app.use(this.favPath, require('../routes/fav.routes.js'));
        this.app.use(this.depPath, require('../routes/sport.routes.js'));
        this.app.use(this.evePath, require('../routes/event.routes.js'));
        this.app.use(this.partPath, require('../routes/participantes.routes.js'));
        this.app.use(this.follower, require('../routes/followers.routes.js'));
        this.app.use(this.posts, require('../routes/posts.routes'));
    }

    configureSockets() {
        this.io.use(verifySocketToken);
        this.io.on('connection', (socket) => {
            console.log('Usuario conectado:', socket.id);
            console.log('Datos del usuario desde el JWT:', socket.usuario);

    
        });
    }

   

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor running on port', this.port);
        });
    }
}

module.exports = Server;

