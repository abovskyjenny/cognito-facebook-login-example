var user = {};
var tokens;

var COGNITO_CLIENT_ID = 'YOUR_APP_CLIENT_ID';
var COGNITO_DOMAIN = 'YOUR_COGNITO_DOMAIN';


const tokenUrl = `${COGNITO_DOMAIN}/oauth2/token`;
const infoUrl = `${COGNITO_DOMAIN}/oauth2/userInfo`;
const redirectUrl = encodeURIComponent('http://localhost:3000/');//'http%3A%2F%2Flocalhost%3A3000';


window.onload = async function load() {
    await initUserWelcomeMessage();
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


async function initUserWelcomeMessage() {
    var params = getUrlVars();

    var codeParam = params['code'];
    if(codeParam) {
        console.log('codeParam ', codeParam);
        await login(codeParam);
        var accessToken = window.localStorage.getItem('accessToken');
        if(accessToken) {
            user = await getInfo(accessToken);
            if(user) {
                var hello = document.getElementById('hello');
                var message = 'Welcome '
                if(user.name) {
                    message += user.name;
                } else {
                    message += user.given_name + (user.family_name ? ` ${user.family_name}` : '') + ' !';
                }
                hello.innerText = message;
            }
        }
    }
}


function getProviderUrl(providerName, redirectUri) {
    var redirect = redirectUri || redirectUrl;
    var scope = 'aws.cognito.signin.user.admin%20email%20openid%20phone%20profile';
    var url;
    if(providerName) {
        url = `${COGNITO_DOMAIN}/oauth2/authorize?identity_provider=${providerName}&redirect_uri=${redirect}&response_type=code&client_id=${COGNITO_CLIENT_ID}&scope=${scope}&state=%7B%20newsletters%3A%201%7D`;
    } else {
        url = `${COGNITO_DOMAIN}/oauth2/authorize?redirect_uri=${redirect}&response_type=code&client_id=${COGNITO_CLIENT_ID}&scope=${scope}&state=%7B%20newsletters%3A%201%7D`;
    }
    return url;
}

function facebookLogin() {
    window.location.href = getProviderUrl('Facebook');
}

function googleLogin() {
    window.location.href = getProviderUrl('Google');
}
function defaultLogin() {
    window.location.href = getProviderUrl();
}

const refreshTokens = async refreshToken => {
    const body = `grant_type=refresh_token&client_id=${COGNITO_CLIENT_ID}`;
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
    if (!response.ok) {
        throw Error();
    }
    const { access_token, id_token } = await response.json();
    window.localStorage.setItem('accessToken', access_token);
    window.localStorage.setItem('idToken', id_token);
    window.localStorage.setItem('refreshToken', refreshToken);
    tokens = {
        accessToken: access_token,
        idToken: id_token,
        refreshToken,
    };
};


const login = async code => {
    const body = `grant_type=authorization_code&client_id=${COGNITO_CLIENT_ID}&code=${code}&redirect_uri=${redirectUrl}`;
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
    if (!response.ok) {
        throw Error();
    }
    const { access_token, id_token, refresh_token } = await response.json();
    window.localStorage.setItem('accessToken', access_token);
    window.localStorage.setItem('idToken', id_token);
    window.localStorage.setItem('refreshToken', refresh_token);
    tokens = {
        accessToken: access_token,
        idToken: id_token,
        refreshToken: refresh_token,
    };
};

const getInfo = async access_token => {
    const response = await fetch(infoUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if (!response.ok) {
        throw Error();
    }
    user = await response.json();
    window.localStorage.setItem('user', user);
    return user;
};
