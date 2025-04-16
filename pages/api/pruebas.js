import sql from 'mssql';

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query('SELECT * FROM Pruebas');
      res.status(200).json(result.recordset);
    } catch (err) {
      res.status(500).json({ error: 'GET failed', details: err.message });
    }
  } else if (req.method === 'POST') {
    const { Nombre, Contraseña, email, tarjeta, monto } = req.body;
    try {
      const pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input('Nombre', sql.NVarChar, Nombre)
        .input('Contraseña', sql.NVarChar, Contraseña)
        .input('email', sql.NVarChar, email)
        .input('tarjeta', sql.NVarChar, tarjeta)
        .input('monto', sql.Float, monto)
        .query(`INSERT INTO Pruebas (Nombre, Contraseña, email, tarjeta, monto)
                VALUES (@Nombre, @Contraseña, @email, @tarjeta, @monto);`);
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'POST failed', details: err.message });
    }
  } else if (req.method === 'PUT') {
    const { Consecutivo, Nombre, Contraseña, email, tarjeta, monto } = req.body;
    try {
      const pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input('Consecutivo', sql.Int, Consecutivo)
        .input('Nombre', sql.NVarChar, Nombre)
        .input('Contraseña', sql.NVarChar, Contraseña)
        .input('email', sql.NVarChar, email)
        .input('tarjeta', sql.NVarChar, tarjeta)
        .input('monto', sql.Float, monto)
        .query(`UPDATE Pruebas SET Nombre=@Nombre, Contraseña=@Contraseña, email=@email, tarjeta=@tarjeta, monto=@monto WHERE Consecutivo=@Consecutivo`);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'PUT failed', details: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
