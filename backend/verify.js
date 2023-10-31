const OktaJwtVerifier = require('@okta/jwt-verifier');

const jwt =require('jsonwebtoken')
module.exports = (req, res, next) => {
  console.log(req.headers);

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Split the 'Authorization' header to get the token (remove 'Bearer ')
  const idToken = authHeader.split(' ')[1];

 const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-73460610.okta.com/oauth2/default' // issuer required
  });
try{
  oktaJwtVerifier.verifyAccessToken(idToken,'api://default')
.then( res => {
  // the token is valid 
  let token=jwt.decode(idToken);
  req.user=token;
  next();
  
})
.catch( err => {
  // a validation failed, inspect the error
  console.error('Error while verifying token');
  console.log(err)
  return res.status(403).json(err);
});
   
}catch(error){
    console.error('Error while verifying token');
    console.log(error)
    return res.status(403).json({err});
}

  
};