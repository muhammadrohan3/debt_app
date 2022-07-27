const mongoose = require('mongoose')
const Joi = require('joi')

const today = new Date();

const date = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`

//schema declaration 
const transactionSchema = new mongoose.Schema
({
    DateOfTransaction : {type:String ,default : date},
    TransId : {type:String , required: true}, 
    Broker: {type : String , required: true},
    Region : {type: String, required : true},
    LocalCurrency: {type : Number , required : true}, 
    AmmountInUSD : {type : Number , required : true},
    MadeBy : {type: String , required : true},
    HandlerAdmin : {type : String , default : 'TBD'},
    TransactionMethod : {type : String , required : true}, 
    ImgPath : {type : String, required : true }, 
    PolicyNumber : {type : String , required : true}, 
    TransactionStatus : {type: String , default : "pending"}
})

const Transaction = mongoose.model('Transaction', transactionSchema)

const validate = (data)=>
{
    const schema = Joi.object(
        {
            DateOfTransaction : Joi.date().format('YYYY-MM-DD').label("Date of Transaction"), 
            Insured : Joi.string().required().label("Insured"), 
            PolicyNumber : Joi.string().required().label("Policy Number"), 
            PeriodFrom : Joi.date().format('YYYY-MM-DD').required().label("Period From"),
            PeriodTo : Joi.date().format('YYYY-MM-DD').required().label("Period to"), 
            TypeOfBusiness: Joi.string().required().label("Type of business"), 
            Class : Joi.string().required().label("Class"),
            Broker: Joi.string().required().label("Broker"),
            Cedant : Joi.string().required().label("Cedant"), 
            Region : Joi.string().required().label("Region"),
            LocalCurrency: Joi.number().required().label("Local Currency"), 
            AmmountInUSD : Joi.number().required().label("Ammount in USD"), 
            ImgPath : Joi.string().required().label("Image Path"), 
            TransactionStatus: Joi.boolean().label("Transaction Status")
        }
    )
    return schema.validate(data);

    
}
module.exports = {Transaction , validate };