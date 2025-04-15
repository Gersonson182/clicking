const obtenerConexion = require ('../db/db');
const bcryptjs = require('bcryptjs');

async function verificarCorreoExistente(correo) {
  const connection = await obtenerConexion();
  try {
      const [result] = await connection.query('SELECT correo FROM usuarios WHERE correo = ?', [correo]);
      return result.length > 0;
  } catch (error) {
      // Manejo de errores (opcional)
      console.error('Error al verificar el correo:', error);
      throw error;
  } finally {
      // Asegurarse de liberar la conexión en todos los casos
      connection.release();
  }
}

  
  async function insertarUsuario_admin(nombre, id_rol, correo, contraseña, edad, google, img, estado) {
    
    const connection = await obtenerConexion();
    return await connection.query(
        'INSERT INTO usuarios (nombre, id_rol, correo, password, edad, google, img, estado) VALUES (?,?,?,?,?,?,?,?)',
        [nombre, id_rol, correo, contraseña, edad, google, img, estado]
      );
  }

  async function insertarUsuario(nombre, correo, contraseña, edad, google, img, estado, genero) {
    const connection = await obtenerConexion();
    try {
      const id_rol = 2;
      return await connection.query(
          'INSERT INTO usuarios (nombre, id_rol, correo, password, edad, google, img,estado, genero) VALUES (?,?,?,?,?,?,?,?,?)',
          [nombre, id_rol, correo, contraseña, edad, google, img, estado, genero]
        );
      
    } catch (error) {
      console.error('Error al registrar', error);
      throw error;
    }finally{
      connection.release();
    }
   
  }

  async function actualizarUsuario(nombre, id_rol, correo, contraseña, edad, google, img, id) {
    const connection = await obtenerConexion();
     const [result] = await connection.query(
        `UPDATE usuarios SET nombre = ?, id_rol = ?, correo = ?, password = ?, edad = ?, google = ?, img = ? WHERE id_usuario = ?`,
        [nombre, id_rol, correo, contraseña, edad, google, img, id]
    );
    return result.affectedRows > 0;
  }

  async function buscarUsuariosAleatorios(cantidad, idExcluir) {
    const connection = await obtenerConexion();
    try {
        // Validación de 'cantidad'
        const cantidadSegura = Number.isInteger(cantidad) && cantidad > 0 ? cantidad : 10;

        // Añade una cláusula WHERE para excluir al usuario autenticado y a los que ya sigue
        const consulta = `
            SELECT * 
            FROM usuarios 
            WHERE estado = 1 
            AND id_usuario NOT IN (
                SELECT following_id 
                FROM followers 
                WHERE follower_id = ?
            )
            AND id_usuario != ? 
            ORDER BY RAND() 
            LIMIT ?`;

        // Ejecuta la consulta con el ID del usuario autenticado y la cantidad segura
        const [usuariosResult] = await connection.query(consulta, [idExcluir, idExcluir, cantidadSegura]);

        return usuariosResult; // Devuelve directamente el resultado
    } catch (error) {
        // Manejo de errores de la consulta
        console.error(error);
        throw error; // Lanza el error para manejarlo en el controlador
    } finally {
        // Asegurarse de liberar la conexión
        connection.release();
    }
}



  

  async function eliminarUsuario(estado, id) {
    const connection = await obtenerConexion();
    const [result] = await connection.query(
      `UPDATE usuarios SET estado = ? WHERE id_usuario = ?`,
      [estado, id]
    );
    return result.affectedRows > 0;
  }



  
  async function verificarUsuario(correo, password) {
      let connection;
  
      try {
          // Obtener una conexión del pool
          connection = await obtenerConexion();
  
          const [rows] = await connection.query(
              'SELECT * FROM usuarios WHERE correo = ? LIMIT 1',
              [correo]
          );
  
          if (rows.length === 0) {
              return null; // El correo no existe en la base de datos
          }
  
          const usuario = rows[0];
  
          // Verifica si el usuario está activo (estado = 1)
         /* if (usuario.estado !== 1) {
              return null; // El usuario no está activo
          }*/
  
          // Verifica si la contraseña coincide utilizando bcryptjs
          const contraseñaValida = await bcryptjs.compare(password, usuario.password);
  
          if (contraseñaValida) {
              return usuario; // Retorna el objeto de usuario si las credenciales son válidas
          } else {
              return null; // Las credenciales no son válidas
          }
      } catch (error) {
          // Manejo de cualquier error que ocurra durante el proceso
          throw error;
      } finally {
          // Asegurarse de que la conexión se libera de vuelta al pool
          if (connection) {
              connection.release();
          }
      }
  }
  


async function obtenerRolUsuarioPorId(usuarioId) {
  const connection = await obtenerConexion();
  try {
    const [result] = await connection.query('SELECT id_rol, nombre, correo FROM usuarios WHERE id_usuario = ? AND estado = 1', [usuarioId]);
    
    if (result.length > 0) {
      return result[0];
    } else {
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }finally{
    connection.release();
  }
}


const insertDeportesFavoritos = async (id_usuario, ids_deportes) => {
  const connection = await obtenerConexion();
  console.log('Estos son los IDs:', id_usuario, ids_deportes);
  const resultados = [];
  for (let i = 0; i < ids_deportes.length; i++) {
    const id_deporte = ids_deportes[i];
    const sql = 'INSERT INTO favoritos (id_usuario, id_deporte) VALUES (?, ?)';
    const values = [id_usuario, id_deporte];

    try {
      const [result] = await connection.query(sql, values);
      resultados.push(result);
      console.log(`Deporte ${id_deporte} agregado a favoritos`);
    } catch (error) {
      console.error(`Error al insertar deporte ${id_deporte} en favoritos:`, error);
      throw error;
    }
    
  }

  // Asegúrate de liberar la conexión a la base de datos
  connection.release();

  return resultados;
};


async function buscarUsuariosPorID(id_usuario) {
  const connection = await obtenerConexion();
  try {
      const [result] = await connection.query(
          `SELECT * FROM usuarios where id_usuario = ?
          `,[id_usuario]);
      return result;
  }catch (error) {
    console.error(error);
    throw error;} 
    finally {
      // Asegurarse de liberar la conexión
      connection.release();
  }
}



async function buscarPerfil(id_usuario) {
  const connection = await obtenerConexion();
  try {
      const [result] = await connection.query(
          `SELECT * FROM usuarios where id_usuario = ?
          `,[id_usuario]);
      return result;
  }catch (error) {
    console.error(error);
    throw error;} 
    finally {
      // Asegurarse de liberar la conexión
      connection.release();
  }
}


async function actualizarUser(id_usuario){
const connection = await obtenerConexion();
try {
    const [result] = await connection.query(
        `UPDATE usuarios 
        SET estado = 1 
        WHERE id_usuario = ?;
        `,[id_usuario]);
    return result;
}catch (error) {
  console.error(error);
  throw error;} 
  finally {
    // Asegurarse de liberar la conexión
    connection.release();
}
}

  

module.exports= {
    verificarCorreoExistente,
    insertarUsuario,
    insertarUsuario_admin,
    actualizarUsuario,
    buscarUsuariosAleatorios,
    eliminarUsuario,
    verificarUsuario,
    obtenerRolUsuarioPorId,
    insertDeportesFavoritos,
    buscarUsuariosPorID,
    actualizarUser,
    buscarPerfil
   
}
