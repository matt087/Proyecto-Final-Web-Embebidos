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
    const { nombre, email, password1, password2, isAdmin, isOperator } = req.body;
      if (password1 !== password2) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }
        user = new User({
        nombre,
        email,
        password1, 
        password2,
        isAdmin,
        isOperator
      });
      await user.save();
  
      const token = jwt.sign({ _id: user._id }, 'secretKeyDCICC');
  
      res.status(200).json({ _id: user._id, token });
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

router.get('/get-users', async (req, res) => {
    try {
        const users = await User.find(); // Obtén todos los usuarios
        res.status(200).json(users); 
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

router.delete('/delete-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id); // Elimina el usuario por ID

        if (!result) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

router.put('/update-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Los datos de actualización

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
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