const router = require('express').Router();
const {Data } = require('../models/data')
const {Client} = require('../models/client')


router.post('/create', async (req, res)=>
{
    
    try {             
        const data = await Data.findOne(req.body)
        if(data)
        {
            return res.status(409).send("Data already exist")
        }
        const result = await new Data(req.body).save()
        res.status(201).send(result)
    } catch (error) {
        res.status(500).send({ message: error });
    }
})


router.get('/getByBroker/:broker',async (req,res)=>
{
    try {
        const data = await Data.find({Broker : req.params.broker})
        return res.status(201).send(data)
    } catch (error) {
        res.status(500).send({message : error})
    }
    
})


router.post('/getByRegion',async (req,res)=>
{
    try {
        const data = await Data.find({Region : req.body.Region})
        return res.status(201).send(data)
    } catch (error) {
        res.status(500).send({message : error})
    }
})
router.post('/test', async (req,res)=>
{
    const result = await Client.find({"BrokerInfo.Region" : req.body.Region})
    res.status(200).send(result)
})
router.get('/fetchAll', async (req,res)=>
{
    
    const result = await Client.find()
    console.log("getting all=>",result)
    res.status(200).send(result)
})

router.get('/getAll',async (req,res)=>
{
    try {
        const data = await Data.find()
        return res.status(201).send(data)
    } catch (error) {
        res.status(500).send({message : error})
    } 
})
router.post('/updateData', async (req,res)=>
{
    try {
        await Data.updateOne({Broker: req.body.Broker},{$set:{
            LocalCurrency : req.body.LocalCurrency,
            AmmountInUSD : req.body.AmmountInUSD
        }
        })
        res.status(201).send("Record updated")
        
    } catch (error) {
        res.status(500).send({message : error})
    }
})
router.post('/getBypolicyNumber',async (req,res)=>
{
    try {
        const result = await Data.findOne({PolicyNumber : req.body.PolicyNumber})
        return res.status(200).send(result)
    } catch (error) {
        
    }
})
module.exports = router