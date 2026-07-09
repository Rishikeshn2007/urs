const express=require('express');

async function login(email,password)
{
    //const user=await User.findOne({email:email});
    console.log(email,password);
    return true;
}
module.exports={login};