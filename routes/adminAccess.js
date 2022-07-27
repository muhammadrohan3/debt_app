const router = require("express").Router();
const { Admin, validate } = require("../models/admin");
const bcrypt = require("bcrypt");
const Joi = require('joi')

router.post("/createAdmin", async (req, res) => {
	try {
		// const { error } = validate(req.body);
		// if (error)
		// 	return res.status(400).send({ message: error.details[0].message });

		const admin = await Admin.findOne({ email: req.body.email });
		if (admin)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		await new Admin({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get('/fetchAll', async (req,res)=>
{
	try {
		const result = await Admin.find()
		res.status(200).send(result)
	} catch (error) {
		res.status(500).send(error);
	}
})
router.post('/delete', async (req,res)=>
{
	try {
		await Admin.deleteOne({username : req.body.username})
		return res.status(200).send("deleted")
	} catch (error) {
		return res.status(500).send("internal server error")
	}
})


module.exports = router;
