const express = require('express');
// const data = require('./data'); // az adatbázishoz csatlakozásig kellett csak, amíg modelleztük a valós adatbázist
const Person = require('../../models/person.model');
const createError = require('http-errors');
const data = require('./data');
// const { loggers } = require('winston');
const logger = require('../../config/logger');


const controller = express.Router();

// controller.get('/', (req, res) => {
//     res.json(data);
// });

// MongoDB után:

// controller.get('/', (req, res) => {
//     Person.find()
//         .then(people => {
//             logger.debug(`Get all people, returning ${people.length} items.`);
//             res.json(people);
//         });
// });

// async alkalmazása után:
controller.get('/', async(req, res) => {
    const people = await Person.find();
    logger.debug(`Get all people, returning ${people.length} items.`);
    res.json(people);
});



// Get a person
// controller.get('/:id', (req, res, next) => {
//     const person = data.find(p => p.id === Number(req.params.id));
//     if (!person) {
//         return next(
//             new createError.BadRequest("Person is not found")
//         );
//     }
//     res.json(person);
// });

// MongoDB után:
controller.get('/:id', async(req, res, next) => {
    const person = await Person.findById(req.params.id);
    if (!person) {
        return next(
            new createError.BadRequest("Person is not found")
        );
    }
    res.json(person);
});



//  Create a new person
// controller.post('/', (req, res, next) => {
//     const { first_name, last_name, email } = req.body;
//     if (!first_name || !last_name || !email) {
//         return next(
//             new createError.BadRequest("Missing properties")
//         );
//     }
//     const newPerson = req.body; // ez sztringben adja meg az adatokat, ahhoz, hogy ebből objektum legyen kell a body-parser függőség

//     newPerson.id = data[data.length - 1].id + 1; // lekérem a data utolsó elemét, kiolvasom az elem id-jét, és hozzáadok egyet
//     data.push(newPerson);
//     res.status(201);
//     res.json(newPerson);
// });

// MongoDB után: 
controller.post('/', (req, res, next) => {
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) {
        return next(
            new createError.BadRequest("Missing properties")
        );
    }

    const newPerson = new Person({
        firstName: first_name,
        lastName: last_name,
        email: email
    });

    newPerson.save()
        .then(data => {
            res.status(201);
            res.json(data);
        });
});

// Update a person
// controller.put('/:id', (req, res, next) => {
//     const id = req.params.id;
//     const index = data.findIndex(p => p.id === Number(id)); // a data-ban az id szám típusú, az url-ből sztringként jön
//     const { first_name, last_name, email } = req.body;
//     if (!first_name || !last_name || !email) {
//         return next(
//             new createError.BadRequest("Missing properties")
//         );
//     }
//     data[index] = {
//         id,
//         // first_name: req.body.first_name // így is lehet, de szebb, ha egy külön változóba kiszervezzük
//         first_name,
//         last_name,
//         email
//     };

//     res.json(data[index]);
// });

// MongoDB után:
controller.put('/:id', async(req, res, next) => {
    const id = req.params.id;
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) {
        return next(
            new createError.BadRequest("Missing properties")
        );
    }

    const update = {
        firstName: first_name,
        lastName: last_name,
        email: email
    }

    let person = {}; // ha a try ágon belül hozom létre, nem tudok vele visszatérni az ágon kívül (a const blokk szintű)
    try {
        person = await Person.findByIdAndUpdate(id, update, {
            new: true, // a {new: true} elvileg ha nem létezik, létrehozza
            useFindAndModify: false
        });
    } catch (err) {
        return next(new createError.BadRequest(err))
    }
    return res.json(person);
});

// Delete a person
// controller.delete('/:id', (req, res, next) => {
//     const index = data.findIndex(p => p.id === Number(req.params.id)); // a data-ban az id szám típusú, az url-ből sztringként jön
//     if (index < 0) { // a finIndex -1-et ad vissza, ha nem talál feltételnek megfelelőt
//         return next(
//             new createError.BadRequest("Person is not found")
//         );
//     }
//     data.splice(index, 1);
//     res.json({}) // visszaküldhetem a tömb új hosszát, vagy egy üres objektumot
// });

// MongoDB után:
controller.delete('/:id', async(req, res, next) => {
    const id = req.params.id;
    try {
        const person = await Person.findByIdAndDelete(id);
    } catch (err) {
        return next(new createError.NotFound(err));
    }
    return res.json({}) // visszaküldhetem a tömb új hosszát, vagy egy üres objektumot
});

module.exports = controller; // ki kell exportálni a controllert