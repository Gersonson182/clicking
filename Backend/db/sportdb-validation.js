const obtenerConexion = require ('../db/db');

async function buscarDeportes(page, perPage) {
    const connection = await obtenerConexion();
    // Consulta para obtener la cantidad total de registros
    const [totalCountResult] = await connection.query('SELECT COUNT(*) as total FROM deportes where estado = 1');
    // Obtiene el total de registros del resultado de la consulta
    const totalCount = totalCountResult[0].total;
    // Consulta para obtener los registros paginados
    const [deporteResult] = await connection.query('SELECT * FROM deportes WHERE estado = ? LIMIT ? OFFSET ?', [1,perPage, (page - 1) * perPage]);
    return {
      totalCount: totalCount,
      deporte: deporteResult
    };
  }

  async function insertarDeporte(nombre, estado) {
    console.log(estado);
    const connection = await obtenerConexion();
    return await connection.query(
      'INSERT INTO deportes (nombre_deporte, estado) VALUES (?,?)',
      [nombre, estado]
    );
  }


  async function verificarDeporte(nombre) {
    const connection = await obtenerConexion();
    // Consulta SQL para obtener el usuario por correo
    const [rows] = await connection.query(
        'SELECT * FROM deportes WHERE nombre_deporte = ? LIMIT 1',
        [nombre]
    );
    if (rows.length === 0) {
        return null; // El deporte no existe en la base de datos
    }
    const deporte = rows[0];
    // Verifica si el deporte está activo (estado = 1)
    if (deporte.estado !== 1) {
        return null; // El deporte no está activo
    }
   
}

async function actualizarDeporte(id, nombre, estado) {
    const connection = await obtenerConexion();
    let updateSQL = 'UPDATE deportes SET';
    const updateValues = [];
    
    if (nombre !== undefined) {
        updateSQL += ' nombre_deporte = ?,';
        updateValues.push(nombre);
    }

    if (estado !== undefined) {
        updateSQL += ' estado = ?,';
        updateValues.push(estado);
    }

    // Elimina la coma adicional al final
    updateSQL = updateSQL.slice(0, -1);

    updateSQL += ' WHERE id_deporte = ?';
    updateValues.push(id);

    const [result] = await connection.query(updateSQL, updateValues);
    return result.affectedRows > 0;
}



  async function eliminarDeporte(estado, id) {
    const connection = await obtenerConexion();
    const [result] = await connection.query(
      `UPDATE deportes SET estado = ? WHERE id_deporte = ?`,
      [estado, id]
    );
    return result.affectedRows > 0;
  }

  // async function buscarDeporteID(id_deporte) {
  //   const connection = await obtenerConexion();
  //   const [result] = await connection.query(
  //     `SELECT nombre FROM deporte WHERE id_deporte = ?`,
  //     [id_deporte]
  //   );
  //   return result[0]; // Devuelve el primer resultado, que debe ser el deporte encontrado
  // }
  


  module.exports= {
    buscarDeportes,
    insertarDeporte,
    verificarDeporte,
    actualizarDeporte,
    eliminarDeporte,
   
   
}