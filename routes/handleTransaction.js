const router = require('express').Router();
const {Transaction } = require('../models/transaction')
const {Data} = require('../models/data')
const {LoginLog} = require('../models/loginLog')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage(
    {
        destination: './upload/images',
        filename : (req,file, cb)=>
        {
            return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        }
    }
)

const upload = multer(
    {
        storage : storage, 
        limits : {fileSize : 10000000}
    }
)




router.post('/create',upload.single('Image'), async (req, res)=>
{
    
    try {
        
        
        console.log(req.body)
        const port = process.env.PORT;
        const path = `/TransImage/${req.file.filename}`; 
        const transId = `Trans-${req.body.Region.substring(0,3)}-${Date.now()}`
        
        const result = await new Transaction({
            TransId : transId, 
            Broker : req.body.PaymentPartner,
            Region : req.body.Region,
            LocalCurrency : req.body.LocalCurrency,
            AmmountInUSD : req.body.AmountInUSD,
            MadeBy : req.body.Madeby,
            ImgPath : path, 
            TransactionMethod : req.body.paymentMethod, 
            PolicyNumber : req.body.PolicyNumber
         }).save();
         console.log(2)
        res.status(201).send(result)
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})



router.post('/getTransaction',async (req,res)=>
{
    console.log(req.body)
    if(req.body.Region[0]==='all')
    {
        const transactions = await Transaction.find({HandlerAdmin :  [req.body.HandlerAdmin,"TBD"] })
        console.log(transactions)
        if(transactions.length === 0)
        {
            return res.status(404).send('No Transaction with requested region found')
        }
        return res.status(201).send(transactions)
    }
    else{
        const transactions = await Transaction.find({Region : req.body.Region, HandlerAdmin :  [req.body.HandlerAdmin,"TBD"]})
        if(transactions.length === 0)
        {
            return res.status(404).send('No Transaction with requested region found')
        }
        return res.status(201).send(transactions)
    } 
    return res.status(500).send("Internal server error")
    
})




router.post('/getByPaymentPartner',async (req,res)=>
{
    console.log(req.body)
    const transactions = await Transaction.find({Broker : req.body.Broker, MadeBy : req.body.MadeBy})
    if(transactions.length === 0)
    {
        return res.status(404).send('No Transaction with requested region found')
    }
    return res.status(201).send(transactions)
})




router.post("/getAdminAmmounts",async (req,res)=>
{
    let approved = 0, pending = 0, total = 0, Previous = 0
    console.log(req.body)
    try {
        if(req.body.Region[0] ==='all')
        {
            let result = await Transaction.find()
            result.forEach((item)=>
        {
            if(item.HandlerAdmin===req.body.admin && item.TransactionStatus==='accept')
            {
                approved+=item.AmmountInUSD
            }
            if(item.TransactionStatus==='pending')
            {
                pending+=item.AmmountInUSD
            }
        })
        }
        else
        {
            let result = await Transaction.find({ReportingUnit : req.body.Region})
            result.forEach((item)=>
            {
                if(item.HandlerAdmin===req.body.admin && item.TransactionStatus==='accept')
                {
                    approved+=item.AmmountInUSD
                }
                if(item.TransactionStatus==='pending')
                {
                    pending+=item.AmmountInUSD
                }
            })
        }
        
        let result3 = await Transaction.find({TransactionStatus : 'accept' , HandlerAdmin : req.body.admin })
        let result4 = await Transaction.find({TransactionStatus : 'pending' })
        console.log('result =>',result3.length)
        let result2 = await Data.find({ReportingUnit : req.body.ReportingUnit})
        result2.forEach((item)=>
        {
            total+=item.AmmountInUSD
            Previous+= item.Previous
        })
        res.status(200).send({pending : pending, approved : approved , total : total, Previous : Previous,previousApproved : result3[result3.length-1].AmmountInUSD , previousPending : result4[result4.length-1].AmmountInUSD})
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})




router.post("/getClientAmmounts",async (req,res)=>
{
    console.log("body=>",req.body)
    let approved = 0, pending = 0, total = 0 , previousTotal = 0
    try {
        let result = await Transaction.find({MadeBy : req.body.MadeBy})
        result.forEach((item)=>
        {
            if(item.TransactionStatus==='accept')
            {
                approved+=item.AmmountInUSD
            }
            if(item.TransactionStatus==='pending')
            {
                pending+=item.AmmountInUSD
            }
        })
        let result2 = await Data.find({Broker : req.body.Broker})
        result2.forEach((item)=>
        {
            total+=item.AmmountInUSD
            previousTotal+=item.Previous
        })
        let result3 = await Transaction.find({MadeBy : req.body.MadeBy , TransactionStatus : 'accept'})
        let result4 = await Transaction.find({MadeBy : req.body.MadeBy , TransactionStatus : 'pending'})
        console.log("result=>3",result3)
        res.status(200).send({pending : pending, approved : approved , total : total ,Previous : previousTotal ,previousApproved : result3[result3.length-1].AmmountInUSD , previousPending : result4[result4.length-1].AmmountInUSD})
    } catch (error) {
        res.status(500).send("Internal server error")
    }
})




router.post('/update',upload.single('Image'),async (req, res)=>
{
    console.log(req.body)
    try {
        if(req.body.status==='accept')
        {
            const result = await Data.findOne({PolicyNumber : req.body.PolicyNumber})
            const result2 = await Transaction.findOne({TransId : req.body.transID})
            let Previous = result.AmmountInUSD
            result.AmmountInUSD-= result2.AmmountInUSD
            result.LocalCurrency -= result2.LocalCurrency
            await Data.updateOne({PolicyNumber : req.body.PolicyNumber}, {$set : {
                AmmountInUSD : result.AmmountInUSD,
                LocalCurrency : result.LocalCurrency, 
                Previous : Previous
            }})
        }
        await Transaction.updateOne({TransId : req.body.transID},{ $set:{
            TransactionStatus : req.body.status, 
            HandlerAdmin : req.body.HandledBy 
    
        }})
        return res.status(201).send("Transaction status updated")
    } catch (error) {
        return res.status(500).send(error.message)
    }
})



router.post('/loginLogs', async (req,res)=>
{
    console.log(req.body)
    try {
        console.log('test')
        await new LoginLog(req.body).save();
        console.log('test2')
        return res.status(200).send('result')
    } catch (error) {
        return res.status(500).send({message : error.message})
    }
})




router.post('/getLoginDetails',async (req,res)=>
{
    const result = await LoginLog.find({UserName : req.body.UserName})
    console.log()
    res.status(200).send(result)
})




router.post('/getById',async (req,res)=>
{
    try {
        const result = await Transaction.findOne({TransId : req.body.TransId})
        if(result)
        {
            return res.status(200).send(result)
        }
        else
        {
            return res.status(404).send({message : "Transaction details not found"})
        }
    } catch (error) {
        return res.status(500).send({message : error.message})
    }
})



router.post('/getGraphData',async (req,res)=>
{
    let data = [] , label = [] , label2 = [] , data2=[]
    try {
        const result = await Transaction.find({MadeBy : req.body.username})
        console.log(result)
        result.forEach((item)=>
        {
            if(item.TransactionStatus==='accept')
            {
                if(label.indexOf(item.DateOfTransaction)===-1)
                {
                    console.log(item.TransactionStatus)
                    label[label.length] = item.DateOfTransaction
                    data[label.length-1] = item.AmmountInUSD
                    if(label2.indexOf(item.DateOfTransaction)===-1)
                    {
                        label2[label2.length] = item.DateOfTransaction
                        data2[label2.length-1] = 0
                    }
                    console.log('new',{data : data , label : label})
                }
                else
                {
                    data[label.indexOf(item.DateOfTransaction)]+=item.AmmountInUSD
                    console.log('old',{data : data , label : label})
                }
            }
            else if(item.TransactionStatus==='pending')
            {
                if(label2.indexOf(item.DateOfTransaction)===-1)
                {
                    if(label.indexOf(item.DateOfTransaction)===-1)
                    {
                        label[label.length] = item.DateOfTransaction
                        data[label.length-1] = 0
                    }
                    label2[label2.length] = item.DateOfTransaction
                    data2[label2.length-1] = item.AmmountInUSD
                    console.log('new2',{data2 : data2 , label2 : label2})
                }
                else
                {
                    data2[label2.indexOf(item.DateOfTransaction)]+=item.AmmountInUSD
                    console.log('old2',{data2 : data2 , label2 : label2})
                }
            }
        })
        
        return res.status(200).send({data : data , label : label,data2 : data2 , label2 : label2})
    } catch (error) {
        return res.status(500).send("internal server error")
    }
})


router.post('/getGraphDataAdmin',async (req,res)=>
{
    let data = [] , label = [] , label2 = [] , data2=[]
    console.log(req.body)
    try {
        if(req.body.Region[0] === 'all')
        {
            console.log("here")
            const result = await Transaction.find()
            console.log(result)
            result.forEach((item)=>
            {
                if(item.TransactionStatus==='accept' && item.HandlerAdmin ===req.body.username)
                {
                    if(label.indexOf(item.DateOfTransaction)===-1)
                    {
                        console.log(item.TransactionStatus)
                        label[label.length] = item.DateOfTransaction
                        data[label.length-1] = item.AmmountInUSD
                        if(label2.indexOf(item.DateOfTransaction)===-1)
                        {
                            label2[label2.length] = item.DateOfTransaction
                            data2[label2.length-1] = 0
                        }
                        console.log('new',{data : data , label : label})
                    }
                    else
                    {
                        data[label.indexOf(item.DateOfTransaction)]+=item.AmmountInUSD
                        console.log('old',{data : data , label : label})
                    }
                    
                }
                else if(item.TransactionStatus==='pending')
                {
                    if(label2.indexOf(item.DateOfTransaction)===-1)
                    {
                        if(label.indexOf(item.DateOfTransaction)===-1)
                        {
                            label[label.length] = item.DateOfTransaction
                            data[label.length-1] = 0
                        }
                        label2[label2.length] = item.DateOfTransaction
                        data2[label2.length-1] = item.AmmountInUSD
                        console.log('new2',{data2 : data2 , label2 : label2})
                    }
                    else
                    {
                        data2[label2.indexOf(item.DateOfTransaction)]+=item.AmmountInUSD
                        console.log('old2',{data2 : data2 , label2 : label2})
                    }
                }
                
            })
        }
        else
        {
            const result = await Transaction.find({Region : req.body.Region})
            result.forEach((item)=>
            {
                if(item.TransactionStatus==='accept' && item.HandlerAdmin ===req.body.username)
                {
                    if(label.indexOf(item.DateOfTransaction)===-1)
                    {
                        console.log(item.TransactionStatus)
                        label[label.length] = item.DateOfTransaction
                        data[label.length-1] = item.AmmountInUSD
                        if(label2.indexOf(item.DateOfTransaction)===-1)
                        {
                            label2[label2.length] = item.DateOfTransaction
                            data2[label2.length-1] = 0
                        }
                        console.log('new',{data : data , label : label})
                    }
                    else
                    {
                        data[label.indexOf(item.DateOfTransaction)]+=item.AmmountInUSD
                        console.log('old',{data : data , label : label})
                    }
                }
                else if(item.TransactionStatus==='pending')
                {
                    if(label2.indexOf(item.DateOfTransaction)===-1)
                    {
                        if(label.indexOf(item.DateOfTransaction)===-1)
                        {
                            label[label.length] = item.DateOfTransaction
                            data[label.length-1] = 0
                        }
                        label2[label2.length] = item.DateOfTransaction
                        data2[label2.length-1] = item.AmmountInUSD
                        console.log('new2',{data2 : data2 , label2 : label2})
                    }
                    else
                    {
                        data2[label2.indexOf(item.DateOfTransaction)]+=item.AmmountInUSD
                        console.log('old2',{data2 : data2 , label2 : label2})
                    }
                }
            })
        
        
        }
        return res.status(200).send({data : data , label : label,data2 : data2 , label2 : label2})
    } catch (error) {
        return res.status(500).send("internal server error")
    }
})

module.exports = router