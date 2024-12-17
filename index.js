const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const routes = require('./routes');
require('./connectdb')

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: ['http://localhost:5173'], // Array of allowed origins
    credentials: true, // Allow credentials
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});