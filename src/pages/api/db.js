import mysql from 'mysql';

const pool = mysql.createPool({
  connectionLimit: 10, // Maximum number of connections in the pool
  host: process.env.NEXT_PUBLIC_AWS_DB_URL,
  user: process.env.NEXT_PUBLIC_AWS_DB_USER,
  password: process.env.NEXT_PUBLIC_AWS_DB_PASSWORD,
  database: process.env.NEXT_PUBLIC_AWS_DB_NAME,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
  console.log('Host:', connection.config.host);
  console.log('User:', connection.config.user);
  console.log('Database:', connection.config.database);
  connection.release(); // Release the connection back to the pool
});

export default pool;
