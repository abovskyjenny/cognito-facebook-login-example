var user = {};
var loginResponse = {};
var APP_ID = 'YOUR_FACEBOOK_APP_ID';
var AWSRegion = 'YOUR_AWS_REGION';
var IdentityPoolId = 'YOUR_POOL_IDENTITY';


var facebookAPI = {
    init: function init() {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : APP_ID,
                xfbml      : true,
                autoLogAppEvents : true,
                status: true,
                version: 'v7.0',
            });
        };
    },
    login:  function login(){
        FB.login(function(response){
            facebookAPI.checkLoginState();
        }, {scope: 'email'});
    },
    getInfo: function getInfo() {
        FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id,email'}, function(response) {
            document.getElementById('status').innerHTML = response.id;
            console.log('me ',JSON.stringify(response));
            user = response;
            document.getElementById('hello').innerHTML = 'Welcome ' + user.name;

            var im = document.getElementById("profileImage").setAttribute("src", "https://graph.facebook.com/" + response.id + "/picture?type=normal");

        });
    },
    logout: function logout(){
        FB.logout(function(response) {
            facebookAPI.checkLoginState();
        });
    },
    checkLoginState: function checkLoginState() {
        FB.getLoginStatus(function(response){
            console.log('response checkLoginState ', response);
            loginResponse = response;
            if(response.status === 'connected'){
                document.getElementById('status').innerHTML = 'You are connected';

                console.log("response.authResponse.accessToken ", response.authResponse.accessToken);

                AWS.config.region = AWSRegion;

                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: IdentityPoolId,
                    Logins: {
                        'graph.facebook.com': response.authResponse.accessToken
                    }
                });

                AWS.config.credentials.get(function(err) {
                    if (err) return console.log("Error", err);
                    console.log("Cognito Identity Id", AWS.config.credentials.identityId);
                });


            } else if(response.status === 'not_authorized') {
                document.getElementById('status').innerHTML = 'we are not logged in.'
            } else {
                document.getElementById('status').innerHTML = 'you are not logged in to Facebook';
            }
        });
    }
};

window.onload = async function load() {

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    facebookAPI.init();
}
