const express=require('express');
require('dotenv').config();
const path=require('path');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');

const user_router=require('./routes/users');
const {login, is_exists,register}=require('./controllers/auth');
const {generateToken,verifyToken}=require('./middlewares/jwt_token');
const Urldb=require('./schema/url');

const app=express();


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully 🌍'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(cookieParser());
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
        return res.status(400).json({success: false, message: 'Name, email and password are required'});
    }

    if(password.length<6)
    {
        return res.status(400).json({success: false, message: 'Password must be at least 6 characters long'});
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    {
        return res.status(400).json({success: false, message: 'Please enter a valid email address'});
    }
    
    if(await is_exists(email))
    {
        return res.status(400).json({success: false, message: 'User with this email already exists'});
    }
    try{
        await register(name,email,password);
        return res.status(201).json({success: true, message: 'Account created successfully! Redirecting to login...', redirect: '/login'});
    } catch(err){
        return res.status(500).json({success: false, message: 'Error creating account. Please try again.'});
    }

});

app.post('/form-submit', async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password)
    {
        return res.status(400).json({success: false, message: 'Email and password are required'});
    }

    const result = await login(email,password);

    if(result)
    {
        const token = generateToken({ email });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'Lax' });
        return res.status(200).json({success: true, message: 'Login successful! Redirecting to dashboard...', redirect: '/users/dashboard'});
    }

    return res.status(401).json({success: false, message: 'Invalid email or password'});
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'frontend','index.html'));
});

app.get('/users/profile',verifyToken,(req,res)=>{
    res.json({email: req.user.email});
});

app.post('/logout',(req,res)=>{
    res.clearCookie('token');
    res.json({success: true, message: 'Logged out successfully'});
});


app.get('/:url',async (req,res)=>{
    const shortUrl=req.params.url;
    try{
        const urlEntry=await Urldb.findOne({shortUrl:shortUrl});
        if(urlEntry)
        {
            await Urldb.findByIdAndUpdate(urlEntry._id,{$inc:{clicks:1}});
            return res.redirect(urlEntry.originalUrl);
        }
        else
        {
            return res.status(404).json({success: false, message: 'Short URL not found'});
        }
    }
    catch(err)
    {
        console.error('Error retrieving URL:', err);
        return res.status(500).json({success: false, message: 'Error retrieving URL. Please try again.'});
    }
});

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully '))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
    console.log(`Server is running on port ${PORT}`);
});