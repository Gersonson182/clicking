
CREATE TABLE usuarios(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    id_rol INT NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    edad VARCHAR(255),
    google BOOLEAN,
    img VARCHAR(255),
    estado INT,
    FOREIGN KEY (id_rol) references roles (id_roles) 
);



CREATE TABLE valorizacion (
    id_valorizacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    valor INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

CREATE TABLE nivel_usuario (
    id_nivel INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nivel VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);




CREATE TABLE chat_rooms (
    id_room INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    id_evento INT NOT NULL,
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento)
);

CREATE TABLE chat_messages (
    id_message INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    id_room INT NOT NULL,
    id_usuario INT NOT NULL,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_room) REFERENCES chat_rooms(id_room),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);


CREATE TABLE followers (
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (following_id) REFERENCES usuarios(id_usuario)
);


CREATE TABLE deportes(
    id_deporte INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre_deporte VARCHAR(255),
    estado INT
);


CREATE TABLE favoritos(
    id_favorito INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    id_usuario INT NOT NULL,
    id_deporte INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_deporte) REFERENCES deportes (id_deporte)
);

CREATE TABLE roles(
    id_roles INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre VARCHAR(255)
);

CREATE TABLE evento (
    id_evento INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre VARCHAR(255),
    id_creador INT NOT NULL,
    participantes INT NO NULL,
    fecha_inicio DATE,
    hora TIME,
    id_deporte INT NOT NULL,
    descripcion VARCHAR(255),
    img VARCHAR(255),
    FOREIGN KEY (id_creador) REFERENCES usuarios (id_usuario),
    FOREIGN KEY (id_deporte) REFERENCES deportes (id_deporte)
);



CREATE TABLE participantes(
    id_participante INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    id_usuario INT NOT NULL,
    id_evento INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_evento) REFERENCES evento (id_evento)
);




CREATE TABLE empresa_deportivas (
    empresa_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE pagos (
    pago_id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_pago DATE,
    empresa_id INT,
    id_organizacion INT,
    id_plan INT,
    FOREIGN KEY (empresa_id) REFERENCES Empresas(empresa_id)
    FOREIGN KEY (id_organizacion) references recintos_deportivos(id_organizacion)
    FOREIGN KEY (id_plan) REFERENCES plan(id_plan)
);



CREATE TABLE plan (
    id_plan int AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    monto int,
);


CREATE TABLE productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    precio int,
    empresa_id INT,
    FOREIGN KEY (empresa_id) REFERENCES Empresas(empresa_id)
);

CREATE TABLE recintos_deportivos(
    id_organizacion INT AUTO_INCREMENT primary key,
    id_usuario INT,
    nombre VARCHAR(250),
    descripcion VARCHAR(250),
    img VARCHAR(250),  
    precio int, 
    deporte int
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);


## DESDE AQUI EMPIEZA REPORTERIA ##

CREATE TABLE click_productos (
    click_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    click_timestamp TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Productos(producto_id)
);

CREATE TABLE clicks_recintos(
    click_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    id_recinto INT,
    click_timestamp TIMESTAMP,
    FOREIGN KEY (id_recinto) REFERENCES recintos_privados(id_organizacion)
);

CREATE TABLE usuarios_conectados(
    conexion_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    id_usuario INT NOT NULL,
    hora_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

