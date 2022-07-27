require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require ('body-parser');
const connection = require("./db");
const clientRoutes = require("./routes/clientAccess");
const clientAuth = require("./routes/clientAuth");
const adminAccess = require('./routes/adminAccess');
const clientData = require('./routes/cllientData');
const adminAuth = require('./routes/adminAuth')
const handleTransaction = require('./routes/handleTransaction')

// database connection
connection();



// middlewares
// app.use (bodyParser.urlencoded ({extended: true}));
app.use(express.json());
app.use(cors());
app.use('/TransImage',express.static('upload/images'))



// routes
app.use("/api/clientAccess", clientRoutes);
app.use("/api/clientAuth", clientAuth);
app.use("/api/adminAccess", adminAccess);
app.use('/api/adminAuth', adminAuth)
app.use('/api/clientData',clientData);
app.use('/api/transaction', handleTransaction);


//deploying the server
const port =  8080;
app.listen(port, console.log(`Listening on port ${port}...`));
