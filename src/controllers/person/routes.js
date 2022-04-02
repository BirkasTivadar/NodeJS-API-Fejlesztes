const express = require('express');
const data = require('./data');
const createError = require('http-errors');

const controller = express.Router();

controller.get('/', (req, res) => {
    res.json(data);
});

// Get a person
controller.get('/:id', (req, res, next) => {
    const person = data.find(p => p.id === Number(req.params.id));
    if (!person) {
        return next(
            new createError.BadRequest("Person is not found")
        );
    }
    res.json(person);
});

//  Create a new person
controller.post('/', (req, res, next) => {
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) {
        return next(
            new createError.BadRequest("Missing properties")
        );
    }

    const newPerson = req.body; // ez sztringben adja meg az adatokat, ahhoz, hogy ebből objektum legyen kell a body-parser függőség
    newPerson.id = data[data.length - 1].id + 1; // lekérem a data utolsó elemét, kiolvasom az elem id-jét, és hozzáadok egyet
    data.push(newPerson);

    res.status(201);
    res.json(newPerson);
});

// Update a person
controller.put('/:id', (req, res, next) => {
    const id = req.params.id;
    const index = data.findIndex(p => p.id === Number(id)); // a data-ban az id szám típusú, az url-ből sztringként jön
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) {
        return next(
            new createError.BadRequest("Missing properties")
        );
    }
    data[index] = {
        id,
        // first_name: req.body.first_name // így is lehet, de szebb, ha egy külön változóba kiszervezzük
        first_name,
        last_name,
        email
    };

    res.json(data[index]);
});

// Delete a person
controller.delete('/:id', (req, res, next) => {
    const index = data.findIndex(p => p.id === Number(req.params.id)); // a data-ban az id szám típusú, az url-ből sztringként jön
    if (index < 0) { // a finIndex -1-et ad vissza, ha nem talál feltételnek megfelelőt
        return next(
            new createError.BadRequest("Person is not found")
        );
    }
    data.splice(index, 1);
    res.json({}) // visszaküldhetem a tömb új hosszát, vagy egy üres objektumot
});

module.exports = controller; // ki kell exportálni a controllert