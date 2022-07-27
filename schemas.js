const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    username: {type: String, required:true, unique: true},
    password: String,
    PaymentPartner: String
})

const adminSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        password: String,
        username: String,
        password: String,
        ReportingUnit:[String],
        manager: String
    }
)

module.exports.clientSchema = clientSchema
module.exports.adminSchema = adminSchema