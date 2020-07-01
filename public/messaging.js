function initWindowMessaging() {
    window.addEventListener(
        'message',
        function callback(e) {
            processChildMessage(e.data);
        },
        false
    );

    function processChildMessage(message) {
        var type = message.type;
        if (type !== 'social-login') {
            return;
        }
        var status = message.status;
        var state = getStateObject(message.state);
        if (status === 'finished' && message.code) {
            sendSocialLoginRequest(message.code, state);
        } else {
            showError(message.message);
        }
    }
}

function showError() {
    //TODO
}

function sendSocialLoginRequest() {
    //TODO
}

function checkCognitoCallback() {
    var params = getUrlVars();
    var state = params.state;
    if (!window.opener || !state) {
        return;
    }

    var code = params.code;
    if (code) {
        code = code.split('#')[0];
        window.opener.postMessage(
            {
                type: 'social-login',
                status: 'finished',
                code: code,
                state: state,
            },
            '*'
        );
        window.close();
    } else {
        state = state && state.replace(/\\/g, '');
        var errorDescription = decodeURIComponent(params.error_description);
        var error = decodeURIComponent(params.error);

        if (errorDescription || error) {
            var errorMessage = errorDescription || error;
            window.opener.postMessage(
                {
                    type: 'social-login',
                    status: 'error',
                    message: errorMessage,
                    state: state,
                },
                '*'
            );
            window.close();
        }
    }
}


function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getStateObject(stateParam) {
    var state = stateParam;
    var result = {};
    if (state) {
        state = state.split('#')[0];
        var decoded = decodeURIComponent(state);
        result = JSON.parse(decoded);
    }
    return result;
}

function openWindow(url, title, win, w, h) {
    var y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
    var x = win.top.outerWidth / 2 + win.top.screenX - w / 2;
    var style =
        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
        w +
        ', height=' +
        h +
        ', top=' +
        y +
        ', left=' +
        x;
    return win.open(url, title, style);
}

function init() {
    initWindowMessaging();
}
