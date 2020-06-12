const express = require('express')
const path = require('path')
const axios = require('axios');
var AWS = require("aws-sdk");
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

const app = express();
const port = 3000;
AWS.config.region = 'us-east-1';
var IdentityPoolId = 'us-east-1:87458b11-7054-4ef3-83c9-4b2fe328fd9b';

// hide powered by express
app.disable('x-powered-by');


var poolData = {
    UserPoolId : 'us-east-1_uWpV8PNOc', // your user pool id here
    ClientId : '58k8ptc6lot749m4ujh0g3av27' // your client id here
};

// var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
//     Logins: {
//         'cognito-idp.us-east-1.amazonaws.com/us-east-1_XXXXXXXXX': result.getIdToken().getJwtToken()
//     }
// });

// Serving static files
app.use('/public', express.static(path.resolve(__dirname, 'test')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log('__dirname ', __dirname)
    res.sendFile(__dirname + '/public/facebook.html');
});

app.get('/callback', (req, res) => {
    console.log('__dirname ', __dirname)
    res.sendFile(__dirname + '/public/callback.html');
});

app.get('/user', (req, res) => {

    var accessToken = req.query.accessToken || ' EAAJNN8sX2OgBAOltGkFkZC6jH413f2O2w3ixfRXwZCJ9cZBGPRjcjGsUPuCsUqr3pQLgnZCiL4PQoh2YB7fyeuQF5mjKXS1g6qzlqJdSwgy5Mty54beZCszZCFrrGav8QPmmn29fhCTlJojYcy5AXLx5F9WZBDUezXsJKSus1yO7mmCOOoIl06cOapbKa5DTgeJ94mRNThwnOtXxShiBh6D';
    console.log('got accessToken  ', accessToken);

    // var u = userPool.getCurrentUser();



    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId,
        Logins: {
            'graph.facebook.com': accessToken
        }
    });

    AWS.config.credentials.get(function() {

    });


    var response = {};
    var provider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', ...poolData });
    provider.getUser({
        AccessToken: accessToken
    }, function(err, obj) {
        console.log('got user  ', obj);
        console.log('got err  ', err);

        response = obj;
    });
    if(response) {
        res.json(response);
    } else {
        res.json({});
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

