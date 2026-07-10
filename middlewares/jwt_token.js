const jwt=require('jsonwebtoken');

function generateToken(payload)
{
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'});
}

function verifyToken(req,res,next)
{
    const token=req.cookies.token;
    if(!token)
        return res.redirect('/login');

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        return next();
    }
    catch(err)
    {
        console.error('Error verifying token:', err);
        return res.redirect('/login');
    }
}

module.exports={generateToken,verifyToken};