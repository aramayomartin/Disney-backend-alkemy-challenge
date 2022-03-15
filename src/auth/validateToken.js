const jwt = require('jsonwebtoken');
require('dotenv').config();

function validateToken(req,res,next){
    const accesToken = req.headers['authorization'];
    if(!accesToken) res.send('Acces denied');
    jwt.verify(accesToken,process.env.SECRET,(err,user)=>{
        if(err){
            res.send('Acces denied, token expired or incorrect.');
        }else{
            next();
        }
    })
}

module.exports = validateToken;