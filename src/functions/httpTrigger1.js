const { app } = require('@azure/functions');
const mysql = require('mysql2');
const fs = require('fs');

var config =
{
    host: 'juniorj-mysql-eus2.mysql.database.azure.com',
    user: 'juniorj',
    password: 'XXXXXXX',
    database: 'wolf',
    port: 3306,
    ssl: {
        rejectUnauthorized: false
        /*ca: fs.readFileSync("/home/DigiCertGlobalRootCA.crt.pem")*/
    }
};

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';
        const conn = new mysql.createConnection(config);
        conn.connect(
            function (err) {
            if (err) {
                console.log("!!! Cannot connect to MySQL!!! Error:");
                throw err;
            }
            else
            {
                console.log("Connection established.");
                queryDatabase();
            }
        });
        
        function queryDatabase()
        {
            conn.query('DROP TABLE IF EXISTS inventory;',
                function (err, results, fields) {
                    if (err) throw err;
                    console.log('Dropped inventory table if existed.');
                }
            )
            conn.query('CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);',
                function (err, results, fields) {
                    if (err) throw err;
                    console.log('Created inventory table.');
                }
            )
            conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['banana', 150],
                function (err, results, fields) {
                    if (err) throw err;
                    else console.log('Inserted ' + results.affectedRows + ' row(s).');
                }
            )
            conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['orange', 250],
                function (err, results, fields) {
                    if (err) throw err;
                    console.log('Inserted ' + results.affectedRows + ' row(s).');
                }
            )
            conn.query('INSERT INTO inventory (name, quantity) VALUES (?, ?);', ['apple', 100],
                function (err, results, fields) {
                    if (err) throw err;
                    console.log('Inserted ' + results.affectedRows + ' row(s).');
                }
            )
            conn.end(function (err) {
                if (err) throw err;
                else  console.log('Done.')
            });
        };

        return { body: `Hello, ${name}!` };
    }
});
