const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const app = express();
const axios =require('axios')
const port = process.env.PORT || 3000;
const qs = require("qs");
const OktaVerify =require('./verify');



// Add middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

app.get('/', (req, res) => {
  res.send('Hello,');
  console.log()
});
app.get('/profile',OktaVerify,(req,res)=>{
  //User is valid send user detail to client
let data=req.user;
res.send(data)
})


//create access token in exchange of autherization code
app.post('/createToken',(req,res)=>{
    const code=req.body.code;
    console.log(code);
    let data = qs.stringify({
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:4200/handle-code",
     
      scope: "openid email profile",
      code: code,
    });

    //get client id and client secret from env
    let client_id = process.env.ClientId;
    let client_Secret =process.env.ClientSecret;
  
    let clientCredentials = `${client_id}:${client_Secret}`;
    let base64ClientCredentials =
      Buffer.from(clientCredentials).toString("base64");
  
   
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://dev-73460610.okta.com/oauth2/default/v1/token",
      headers: {
        Accept: "application/json",
        Authorization: "Basic " + base64ClientCredentials,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    //axios reques for token
    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        res.send(JSON.stringify(response.data));
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again!" });
      });
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
