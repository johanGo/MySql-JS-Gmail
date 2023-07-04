const mysql= require('mysql');
const express=require('express');
const nodemailer=require('nodemailer');
const {google}=require('googleapis');
const router=express.Router();

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


router.post('/send-mail',(req,res)=>{
    const {name,cellphone,mail,description}=req.body;
    const contentHTML=`
    <h3>Formulario de Nodemailer</h3>
    <ul>
        <li>Hola soy ${name} y mis datos son:</li>
        <li>cell:${cellphone}</li>
        <li>email: ${mail}</li>
        <li>mensaje:${description}</li>
    </ul>
    `;

    //insertar los datos enviados del formulario a mi base de datos mysql
    const insertar=`INSERT INTO form(name,cellphone,email,description)VALUES('${name}','${cellphone}','${mail}','${description}')`;
    connection.query(insertar, (err,rows)=>{
        if(err) throw err;
        console.log(`se insertaron los datos correctamente de: ${name}`)
    });


    //enviar los datos del formulario a mi gmail <johansebastiangonzalezormaza@gmail.com>
    const CLIENT_ID='125751719191-vlbu8l26qj35a8hpbpk5e7kt8jbhq5vd.apps.googleusercontent.com';
    const CLIENT_SECRET='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';
    const REDIRECT_URI='https://developers.google.com/oauthplayground';
    const REFRESH_TOKEN='1//04tj7PlMHpa_sCgYIARAAGAQSNwF-L9IrRdrGE5YZvaE8Sm2_ow9-FKULf1GUNkhsiK-S8Q1LbTUp_eqaGYNm5rWRjrHAoSMU_hk';

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);
    oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});

    async function sendMail(){
        try{
            const accessToken = await oAuth2Client.getAccessToken()
            const transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    type:'OAuth2',
                    user:'johansebastiangonzalezormaza@gmail.com',
                    clientId:CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken:REFRESH_TOKEN,
                    accessToken:accessToken
                },
            });
            const mailOptions={
                from:'Pagina web nodemailer <johansebastiangonzalezormaza@gmail.com>',
                to:'josegorm@hotmail.com',
                subject:'Nodemailer prueba',
                html: contentHTML,
            };
            
            const result = await transporter.sendMail(mailOptions);
            return result;
        }catch(err){
            console.log(err)
        }
    }
    sendMail()
        .then((result)=> res.status(200).redirect('/'))
        .catch((error)=>console.log(error.mesage));

    // res.redirect('/')
})

module.exports=router

// const mysql= require('mysql');
// const connection=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'sebas2004',
//     database:'websitetest'
// });
// connection.connect((err)=>{
//     if(err) throw err
//     console.log('conexion establecida exitosamente')
// })


// router.post('/send-mail',(req,res)=>{
//     console.log(req.body);
//     const {name,cellphone,mail,description}=req.body;
//     const insertar=`INSERT INTO myForm(name,cellphone,mail,description)VALUES('${name}','${cellphone}','${mail}','${description}')`;
//     connection.query(insertar, (err,rows)=>{
//         if(err) throw err;
//         console.log(`se insertaron los datos correctamente de: ${name}`)
//     });    
//     res.redirect('/')
// })



// module.exports=router
