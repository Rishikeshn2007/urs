const express=require('express');
const router=express.Router();

router.get('/dashboard',(req,res)=>{
    res.send('Dashboard route');
});
router.get('/',(req,res)=>{
    res.send('Users route');
});


module.exports=router;