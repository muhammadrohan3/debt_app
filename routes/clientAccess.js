const router = require("express").Router();
const { Client, validate } = require("../models/client");
const {Data} = require('../models/data')
const bcrypt = require("bcrypt");
const Joi = require('joi')

router.post("/createClient", async (req, res) => {
	try {
		const client = await Client.findOne({ email: req.body.email });
		if (client)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });
		
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		const BrokerInfo = await Data.findOne({Broker : req.body.PaymentPartner})
		await new Client({ ...req.body, password: hashPassword ,BrokerInfo : BrokerInfo}).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});
router.post('/delete', async (req,res)=>
{
	try {
		await Client.deleteOne({username : req.body.username})
		return res.status(200).send("deleted")
	} catch (error) {
		return res.status(500).send("internal server error")
	}
})

module.exports = router;
