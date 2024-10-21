const express = require('express')
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const route = require("./src/routes");
require('./connectdb')

const app = express();
app.use(morgan('dev'));
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", route);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});