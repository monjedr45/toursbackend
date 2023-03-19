
import * as dotenv from 'dotenv';
dotenv.config();

import app from './app.js'
import Mongoose from 'mongoose';
import process from 'process'
const DB = process.env.DATABASE



Mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(con => {

})
//! server
const port = 3000
const server = app.listen(port, () => {
    console.log('App listening on port ' + port);
})


// const testTour = new Tour({
//     name: 'Test Tour2',
//     rating: 4.5,
//     price: 100
// })

// testTour.save().then((col) => {
//     console.log(col);
//     console.log('Tour saved')
// }).catch(err => console.log('error 😢:',err))


//! handle unhandledRejection promisees
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! 😢 Shutting down...');
    server.close(() => process.exit(1))
})