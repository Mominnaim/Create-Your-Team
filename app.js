const connectDB = require('./config/db');
const express = require('express');
const app = express();
const UserRouter = require('./routes/routing')
require('dotenv').config()

// This serves the html,css static files to the local host.
app.use(express.static('./public')) 
// Handles raw json files
app.use(express.json())

app.use('/user', UserRouter)


const port = 5000;

const start = async () => {
    try{
        await connectDB(process.env.MONGODB_URI)
        app.listen(port, console.log(`Listening to  ${port}`)) 
    } catch(e) {
        console.error(e)

    }
}
start()