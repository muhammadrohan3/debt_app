const router = require("express").Router();
const { Client } = require("../models/client");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/login", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message1: error.details[0].message });

		const client = await Client.findOne({ email: req.body.email });
		if (!client)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			client.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const token = client.generateAuthToken();
		res.status(200).send({ data: token, message: "logged in successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post('/getByEmail', async (req,res)=>
{
	try {
		const result = await Client.findOne({email : req.body.email})
		res.status(200).send(result)
	} catch (error) {
		res.status(500).send({message : error})
	}
})


const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};
module.exports =  router