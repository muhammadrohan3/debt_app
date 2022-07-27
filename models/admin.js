const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


const adminSchema = new mongoose.Schema({
	name: {type: String, required:true},
    email: {type: String, required:true},
    phone: {type: String, required:true},
    super: {type: Boolean, default: false},
    username: {type: String, required:true, unique: true},
    password: {type: String, required:true},
    ReportingUnit:{type: [String], required:true},
    manager: {type: String, required:true},
});

adminSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({name : this.name , type : "admin" , super : this.super , username : this.username , email : this.email , phone : this.phone , ReportingUnit : this.ReportingUnit, Manager : this.manager }, process.env.SECRETKEY, {
		expiresIn: "1d",
	});
	return token;
};

const Admin = mongoose.model("admin", adminSchema);

const validate = (data) => {
	const schema = Joi.object({
		name: Joi.string().required().label("Name"),
        email: Joi.string().email().required().label("Email"),
        phone: Joi.string().required().label("Phone"),
		username: Joi.string().required().label("username"),
		password: passwordComplexity().required().label("Password"),
        ReportingUnit : Joi.string().required().label("Reporting Unit"),
        manager: Joi.string().required().label("Manager")
	});
	return schema.validate(data);
};

module.exports = { Admin, validate };
