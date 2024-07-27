const { Schema, model }= require('mongoose');

//nuevo esquema como una tabla los elementos de adentro son los campos
const soundSchema = new Schema({
    sound: Number
},{
    timestamps: true //campo adicional del método: createdup y updatedup
 });

module.exports = model('sound', soundSchema); //exportar