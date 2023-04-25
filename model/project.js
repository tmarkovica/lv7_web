const mongoose = require('mongoose')

// Define a schema
const exampleSchema = new mongoose.Schema({
    naziv_projekta: String,
    opis_projekta: String,
    cijena_projekta: Number,
    obavljeni_poslovi: String,
    datum_pocetka: Date,
    datum_zavrsetka: Date,
    members: [{
        name: String
    }]
});

// Create a model
//const Example = mongoose.model('Project', exampleSchema);

module.exports = mongoose.model('Project', exampleSchema);