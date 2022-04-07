const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./config/logger');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // itt azt állítom be, hogy Promise-okkal szeretném használni a -t
//  Jadnuk7321!

const port = 3000;

// Database connection. A <password> helyére be kell tenni a létrehozáskor megadott jelszót. Jelen esetben: Jadnuk7321!
mongoose
    .connect('mongodb+srv://Malaga21:Jadnuk7321!@cluster0.cnlit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => logger.info('MongoDB connection has been established successfully.'))
    .catch(err => {
        logger.error(err);
        process.exit();
    });


app.use(morgan('combined', { stream: logger.stream }));

// app.use('/images', express.static('./images')); // miután átmozgattam az images mappát a publicba, már elég az alsó sor
app.use(express.static('public'));

app.use(bodyParser.json());
app.use('/person', require('./controllers/person/routes')); // azt állítom be, hogy a /person-tól indul az url-ek viszonyítása, az alap: http://localhost:3000/person

app.use((err, req, res, next) => {
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message
    });
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});