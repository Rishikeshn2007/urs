const express=require('express');
require('dotenv').config();
const path=require('path');

const user_router=require('./routes/users');
const {login}=require('./controllers/auth');

const app=express();

app.use(express.static(path.join(__dirname,'frontend')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/users',user_router);

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'frontend','login.html'));
});

app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'frontend','register.html'));
});

app.post('/form-register',async (req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email || !password)
    {
        return res.status(400).send('Name, email and password are required');
    }

    if(password.length<6)
    {
        return res.status(400).send('Password must be at least 6 characters long');
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    {
        return res.status(400).send('Please enter a valid email address');
    }
    

});

app.post('/form-submit', async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password)
    {
        return res.status(400).send('Email and password are required');
    }

    const result = await login(email,password);

    if(result)
    {
        return res.redirect('/users/dashboard');
    }

    return res.status(401).send('Invalid email or password');
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'frontend','index.html'));
});



const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});