const { Router } = require('express');
const router = Router();

const User = require('../models/user');
const Sensor = require('../models/sensor');
const Sound = require('../models/sound');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
var http = require('http');
var querystring = require('querystring');
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
router.post('/sensor', async (req, res) => {
    try {
        const { light } = req.body;

        if (!light) {
            return res.status(400).json({ error: 'Falta el parámetro: light' });
        }

        const newSensor = new Sensor({ light });
        await newSensor.save();

        res.status(200).json({ message: 'Medición añadida correctamente', data: newSensor });
    } catch (error) {
        console.error('Error al añadir la medición:', error);
        res.status(500).json({ error: 'Error al añadir la medición' });
    }
});

router.get('/get-sensor', async (req, res) => {
    try {
        const sensors = await Sensor.find();
        res.status(200).json(sensors);
    } catch (error) {
        console.error('Error al obtener las mediciones:', error);
        res.status(500).json({ error: 'Error al obtener las mediciones' });
    }
});
//sound
router.post('/sound', async (req, res) => {
    try {
        const { sound } = req.body;

        if (!sound) {
            return res.status(400).json({ error: 'Falta el parámetro: sound' });
        }

        const newSound = new Sound({ sound });
        await newSound.save();

        res.status(200).json({ message: 'Medición añadida correctamente Sound', data: newSound });
    } catch (error) {
        console.error('Error al añadir la medición Sound:', error);
        res.status(500).json({ error: 'Error al añadir la medición Sound' });
    }
});

router.get('/get-sound', async (req, res) => {
    try {
        const sounds = await Sound.find();
        res.status(200).json(sounds);
    } catch (error) {
        console.error('Error al obtener las mediciones sounds:', error);
        res.status(500).json({ error: 'Error al obtener las mediciones sounds' });
    }
});

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