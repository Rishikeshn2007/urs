const { models } = require('mongoose');
const Url=require('../schema/url');

function generateShortUrl(longUrl) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortUrl = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        shortUrl += characters[randomIndex];
    }
    return shortUrl;
}

async function saveUrl(longUrl,shorturl,email)
{
    try{
        const url=await Url.findOne({originalUrl:longUrl});
    if(url)
        return url.shortUrl;
    else
    {
        const newUrl=new Url({
            originalUrl:longUrl,
            shortUrl:shorturl,
            email:email
        });
        await newUrl.save();
        return shorturl;
    }
    }
    catch(err)
    {
        console.error('Error saving URL:', err);
        throw err;
    }
}

async function getOriginalUrl(shortUrl)
{
    try{
        const url=await Url.findOne({shortUrl:shortUrl});
    if(url)
        return url.originalUrl;
    else
        return null;
    }
    catch(err)
    {
        console.error('Error retrieving original URL:', err);
        throw err;
    }
}




module.exports={generateShortUrl,saveUrl,getOriginalUrl};