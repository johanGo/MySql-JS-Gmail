const mysql= require('mysql');
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456789',
    database:'website'
});

connection.connect((err)=>{
    if(err) console.log('el error es' + err)
    console.log('conexion establecida exitosamente')
})

const insertar=`INSERT INTO form(name,cellphone,email,description) VALUES('David','3144876952','David@gmail.com','Este mensaje fue enviado desde VSCode')`;
connection.query(insertar, (err,rows)=>{
    if(err) throw err;
    console.log('los datos se insertaron exitosamente y fueron:')
})

connection.query('select * from form', (err, rows)=>{
    if(err) throw err
    console.log('los datos solicitados son:')
    console.log(rows)
})

connection.end();