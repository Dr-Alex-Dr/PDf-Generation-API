import mysql from 'mysql2';
import 'dotenv/config';

const pool = mysql
.createPool({
    host: process.env.MYSQL_HOST, 
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE, 
    password: process.env.MYSQL_PASSWORD, 
});
pool.query('select 1 + 1', (err, rows) => { 
    console.log('err' + err)
    console.log('rows' + rows);
});
  
export { pool };
