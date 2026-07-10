const express=require('express');
const path=require('path');
const router=express.Router();

const {saveUrl,generateShortUrl,getOriginalUrl}=require('../controllers/url_short');
const {verifyToken}=require('../middlewares/jwt_token');
const Url=require('../schema/url');

router.get('/dashboard',verifyToken,(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend','dashboard.html'));
});

router.get('/url-manager',verifyToken,(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend','url-manager.html'));
});

router.post('/shorten-url',verifyToken,async (req,res)=>{
    const {longurl,email}=req.body;
    if(!longurl || !email)
    {
        return res.status(400).json({success: false, message: 'Long URL and email are required'});
    }

    if(!/^https?:\/\/[^\s$.?#].[^\s]*$/.test(longurl))
    {
        return res.status(400).json({success: false, message: 'Please enter a valid URL starting with http:// or https://'});
    }
    try{
        const shorturl=await generateShortUrl(longurl);

        const savedShortUrl=await saveUrl(longurl,shorturl,email);
        const sendurl=`${req.protocol}://${req.get('host')}/${savedShortUrl}`;
        return res.status(200).json({success: true,origin: shorturl, shortUrl: sendurl});
    }
    catch(err)
    {
        console.error('Error shortening URL:', err);
        return res.status(500).json({success: false, message: 'Error shortening URL. Please try again.'});
    }
});

router.delete('/delete-url/:shortUrl',verifyToken,async (req,res)=>{
    const shortUrl=req.params.shortUrl;
    try{
        const deletedUrl=await Url.findOneAndDelete({shortUrl:shortUrl});
        if(deletedUrl)
            return res.status(200).json({success: true, message: 'URL deleted successfully'});
        else
            return res.status(404).json({success: false, message: 'Short URL not found'});
    }
    catch(err)
    {
        console.error('Error deleting URL:', err);
        return res.status(500).json({success: false, message: 'Error deleting URL. Please try again.'});
    }
});

router.get('/myurls/:email',verifyToken,async (req,res)=>{
    const email=req.params.email;
    try{
        const urls=await Url.find({email:email});
        return res.status(200).json({success: true, urls: urls});
    }
    catch(err)
    {
        console.error('Error retrieving URLs:', err);
        return res.status(500).json({success: false, message: 'Error retrieving URLs. Please try again.'});
    }

});
module.exports=router;