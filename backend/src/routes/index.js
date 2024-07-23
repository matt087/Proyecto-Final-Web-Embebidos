const { Router } = require('express');
const router = Router();

const User = require('../models/user');
const Sensor = require('../models/sensor');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
var http = require('http');
var querystring = require('querystring');
var db = []; // Base de datos para almacenar los datos
var url = require('url');

//LOGIN
router.post('/register', async (req, res) => {
  const { nombre, email, password1, password2, isAdmin, isOperator} = req.body;

  // Verificar si las contraseñas coinciden
  if (password1 !== password2) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  const newUser = new User ({ nombre, email, password1, password2,  isAdmin, isOperator });
  
  try {
      await newUser.save();
      const token = jwt.sign({_id: newUser._id}, 'secretKeyDCICC');
      res.status(200).json({_id: newUser._id});

  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

//SENSOR
function requestHandler(request, response) {

    // Parsear la URL recibida
    var uriData = url.parse(request.url);
    var pathname = uriData.pathname;          // Path de la URL

    //-----------------------------------------------------------------------------------------
    if (request.method === 'POST' && pathname === '/update') {
        var body = '';
        
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            var postData = JSON.parse(body);
            
            // Asegurarse de que se recibió el campo 'light' en el cuerpo del POST
            if (postData.hasOwnProperty('light')) {
                var light = parseFloat(postData.light);
                const newSensor = new Sensor ({ light });
                newSensor.save()
                .then(() => {
                  res.json({ message: 'Medición añadido correctamente' });
                })
                .catch(error => {
                  console.error('Error al añadir la medición:', error);
                  res.status(500).send('Error al añadir la medición');
                });
                
                console.log(newSensor); // Mostrar los datos en la consola del servidor
                response.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify({ status: 'OK' })); // Enviar respuesta de éxito
            } else {
                response.writeHead(400, {
                    'Content-Type': 'application/json'
                });
                response.end(JSON.stringify({ error: 'Missing parameter: light' })); // Enviar error si falta el campo 'light'
            }
        });
    } else if (pathname === '/get') {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        Sensor.find()
        .then(s => {
            res.json(s);
        })
        .catch(error => {
            console.error('Error al obtener las mediciones:', error);
            res.status(500).send('Error al obtener las medicones');
        });
    } else { 
        // Si no se encuentra ninguna ruta válida, servir el archivo index.html
        fs.readFile('./index.html', function(error, content) {
            if (error) {
                response.writeHead(500);
                response.end('Error interno del servidor');
            } else {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.end(content); // Enviar contenido del archivo index.html
            }
        });
    }
}


router.post('/login', async(req, res) =>{
    const {email, password1}= req.body;
    const userFind = await User.findOne({email});
    if(!userFind) return res.status(401).send("El correo no existe")
    if(userFind.password1 !== password1) return res.status(401).send("incorrecta")
    let rol = "usuario";
    if (userFind.isAdmin) {
        rol = "administrador";
    } else if (userFind.isOperator) {
        rol = "operador";
    }
    const token = jwt.sign({ id: userFind._id, role: rol }, 'secretKeyDCICC');    
    return res.status(200).json({token, role: rol});
})

router.put('/update', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const userFind = await User.findOne({ email });
        if (!userFind) return res.status(404).send("Usuario no encontrado");
        userFind.password1 = newPassword;
        await userFind.save();
        res.status(200).send("Contraseña actualizada correctamente");
    } catch (error) {
        res.status(500).send("Error al actualizar la contraseña");
    }
})

router.delete('/delete', async (req, res) =>{
    const {email, password1} = req.body;
    try
    {
        const userFind = await User.findOne({ email });
        if (!userFind) return res.status(401).send("El correo no existe");
        if (userFind.password1 !== password1) return res.status(401).send("Contraseña incorrecta");

        
        await userFind.deleteOne({_id: User._id});
        res.status(200).send("El usuario ha sido eliminado");
    }
    catch(error)
    {
        res.status(500).send("La eliminación ha sido incorrecta");
    }
    
})

module.exports = router;

//En la funcion la cabecera se la debe definir en el postman dando un valor, en este caso se debe dar el token 
function verifyToken(req, res, next){
    if(!req.headers.authorization){
        console.log("1");
        return res.status(401).send('Unathorize Request 1');
    }
    //se coloca por defecto la palabra bearer espacio y el token obtenido
    //dividir el string recibido 
    const token = req.headers.authorization.split(' ')[1]// crea un arreglo ['Bearer', 'token']
     if (token == 'null'){
        console.log("2");
        return res.status(401).send('Unathorize Request');
     }

     const payload = jwt.verify(token, 'secretKeyDCICC') //Contenido del token
     //console.log(payload)// muestra los datos contenidos en el payload deberia ser el id del usuario
     req.userId = payload._id ;
     next();
}