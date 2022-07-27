const mongoose = require('mongoose')

const today = new Date();

const date = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`

const date2 = new Date(date)
const loginSchema = new mongoose.Schema(
    {
        LoginDate : { type : String , default : date2},
        UserName : {type : String , required : true},
        IpAddress : { type : String , required : true},
        LoginLocation : {type : String , required : true},
        
    }
)

const LoginLog = mongoose.model("LoginLog", loginSchema)

module.exports = {LoginLog}