require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const dbConnection = require('./config/dbConnection')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV);

dbConnection()

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/tasks', require('./routes/taskRoutes'))

mongoose.connection.once('open', () => {
    console.log('connected to mongoDB');
    app.listen(PORT, () => console.log(`server running on port ${PORT}`))
})

mongoose.connection.once('error', err => {
    console.log(err);
})
