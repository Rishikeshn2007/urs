const express=require('express');
const path=require('path');
const router=express.Router();
const {verifyToken}=require('../middlewares/jwt_token');

router.get('/dashboard',verifyToken,(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend','dashboard.html'));
});
router.get('/',(req,res)=>{
    res.send('Users route');
});


module.exports=router;