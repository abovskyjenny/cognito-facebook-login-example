var COGNITO_CLIENT_ID = 'COGNITO_CLIENT_ID';
var COGNITO_DOMAIN = 'COGNITO_DOMAIN';
var CALLBACK_URL = 'http://localhost:3000/callback';


const tokenUrl = `${COGNITO_DOMAIN}/oauth2/token`;
const infoUrl = `${COGNITO_DOMAIN}/oauth2/userInfo`;
const redirectUrl = encodeURIComponent(CALLBACK_URL);
const STAGE = { newsletters: true };
const stateParam = encodeURIComponent(JSON.stringify(STAGE));

function getProviderUrl(providerName, redirectUri) {
    var redirect = redirectUri || redirectUrl;
    var scope = 'aws.cognito.signin.user.admin%20email%20openid%20phone%20profile';
    var url;
    if(providerName) {
        url = `${COGNITO_DOMAIN}/oauth2/authorize?identity_provider=${providerName}&redirect_uri=${redirect}&response_type=code&client_id=${COGNITO_CLIENT_ID}&scope=${scope}&state=${stateParam}`;
    } else {
        url = `${COGNITO_DOMAIN}/oauth2/authorize?redirect_uri=${redirect}&response_type=code&client_id=${COGNITO_CLIENT_ID}&scope=${scope}&state=${stateParam}`;
    }
    return url;
}

function facebookLogin() {
    loginProvider(getProviderUrl('Facebook'));
}

function loginProvider(url) {
    openWindow(url, 'socialLogin', window, 600, 500);
}

function googleLogin() {
    loginProvider(getProviderUrl('Google'));
}

function defaultLogin() {
    loginProvider(getProviderUrl());
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
    return {
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
    return {
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
    var user = await response.json();
    return user;
};
