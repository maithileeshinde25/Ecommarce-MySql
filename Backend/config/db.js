import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Ecommarce'
});

db.connect((err) => {
    if (err) {
        console.error("Error in DB connection:", err);
    } else {
        console.log("DB connected successfully");
    }
});

export default db;
