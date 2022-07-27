const mongoose = require('mongoose')
const Joi = require('joi')


//schema declaration 
const dataSchema = new mongoose.Schema
({
    DateOfTransaction : {type: Date , required: true}, 
    Insured : {type: String, required: true}, 
    PolicyNumber : {type : String, required: true}, 
    PeriodFrom : {type : Date , required : true},
    PeriodTo : {type : Date , required : true}, 
    TypeOfBusiness: {type: String, required: true}, 
    Class : {type: String , required: true},
    Broker: {type : String , required: true},
    Cedant : {type : String, required : true}, 
    Region : {type: String, required : true},
    LocalCurrency: {type : Number , required : true}, 
    AmmountInUSD : {type : Number , required : true}, 
    Previous : {type : Number}
})

const Data = mongoose.model('Data ', dataSchema)

const validate = (data)=>
{
    const schema = Joi.object(
        {
            DateOfTransaction : Joi.date().format('YYYY-MM-DD').required().label("Date of Transaction"), 
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
            AmmountInUSD : Joi.number().required().label("Ammount in USD")
        }
    )
    return schema.validate(data);

    
}
module.exports = {Data , validate };