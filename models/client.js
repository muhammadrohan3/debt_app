const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const clientSchema = new mongoose.Schema({
	name: {type: String, required:true},
    email: {type: String, required:true},
    phone: {type: String, required:true},
    username: {type: String, required:true, unique: true},
    password: {type: String, required:true},
	type : {type : String , default: "client"},
    PaymentPartner: {type: String, required:true}, 
	BrokerInfo : {type : Object }
});

clientSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ name : this.name ,  PaymentPartner : this.PaymentPartner, username : this.username , email : this.email , phone : this.phone , type : "client", }, process.env.SECRETKEY, {
		expiresIn: "1d",
	});
	return token;
};

const Client = mongoose.model("client", clientSchema);

const validate = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().label("Name"),
        email: Joi.string().email().required().label("Email"),
        phone: Joi.string().required().label("Phone"),
		username: Joi.string().required().label("username"),
		password: passwordComplexity().required().label("Password"),
        PaymentPartner : Joi.string().required().label("Payment Partner"), 
		// BrokerInfo : Joi.object().required().label("Broker Info")
	});
	return schema.validate(data);
};

module.exports = { Client, validate };
