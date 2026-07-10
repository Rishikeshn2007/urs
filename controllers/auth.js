const express=require('express');
const bcrypt=require('bcryptjs');

const Userdb=require('../schema/user');

async function login(email,password)
{
    const user=await Userdb.findOne({email:email});
    
    if(!user)
        return false;
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
}

async function is_exists(email)
{
    const user=await Userdb.findOne({email:email});
    if(user)
        return true;
    return false;
}

async function register(name,email,password)
{
    const hash=await bcrypt.hash(password,10);
    try{
        const user=new Userdb({
        name: name,
        email: email,
        password: hash
    });
    await user.save();
}
    catch(err)
    {
        console.error('Error registering user:', err);
        throw err;
    }
}

module.exports={login,is_exists,register};