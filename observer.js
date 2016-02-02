var Logger = function () {
    /*
    * Action to be performed when it receives a login result
    */
    this.onReceiveLoginStatus = function(e, sEvent, sJson) {
        var result = $.parseJSON(sJson);
        if(sEvent==LOGIN_STATUS.SUCCESS) {
            console.log('Logger: ' + sEvent + ' User: ' + result.user_id + ' ' + result.user_name);
        } else if (sEvent==LOGIN_STATUS.FAIL) {
            console.log('Logger: ' + sEvent + ' Message: ' + result.message);
        }
    }
}
var Login = function() {
    /* 
    * fire ajax to process login and 
    * call Dispatcher.onReceive to dispatch the result 
    */
    this.processLogin = function() {}

    /*
    * Action to be performed when it receives a login result
    */
    this.onReceiveLoginStatus = function(e, sEvent, sJson) {
        var result = $.parseJSON(sJson);
        if(sEvent==LOGIN_STATUS.SUCCESS) {
            console.log('Login: ' + sEvent + ' User: ' + result.user_id + ' ' + result.user_name);
        } else if (sEvent==LOGIN_STATUS.FAIL) {
            console.log('Login: ' + sEvent + ' Message: ' + result.message);
        }
    }
}
/* Login Status */
LOGIN_STATUS = { SUCCESS: 'LOGIN_SUCCESS', FAIL: 'LOGIN_FAIL' }

var Dispatcher = function() {
    var thisObj = this;
    /*
    * Called upon any state change
    */
    this.onReceive = function(sEvent, sJson) {
        $(thisObj).trigger('Dispatcher.onReceive.'+sEvent, [sEvent, sJson]);
    }
    /*
    * Register an observer to an event
    */
    this.registerOnReceive = function(sEvents, fCallback) {
        $.each(sEvents, function(i, sEvent) {
            $(thisObj).on('Dispatcher.onReceive.'+sEvent, fCallback);
        });
    }
    /*
    * Unregister an observer
    */
    this.unregisterOnReceive = function(sEvents, fCallback) {
        $.each(sEvents, function(i, sEvent) {
            $(thisObj).off('Dispatcher.onReceive.'+sEvent, fCallback);
        });
    }
}
/*
* Main flow
*/
function main() {
    var logger = new Logger();
    var login = new Login();
    var dispatcher = new Dispatcher();
    
    console.log('====================== run 1 ======================');
    dispatcher.registerOnReceive([LOGIN_STATUS.SUCCESS, LOGIN_STATUS.FAIL], logger.onReceiveLoginStatus); // register logger
    dispatcher.registerOnReceive([LOGIN_STATUS.SUCCESS, LOGIN_STATUS.FAIL], login.onReceiveLoginStatus); // register login
    dispatcher.onReceive(LOGIN_STATUS.SUCCESS, '{"user_id":"1","user_name":"Allen"}'); // notify observer about login success
    dispatcher.onReceive(LOGIN_STATUS.FAIL, '{"message":"Incorrect login information."}'); // notify observer about login fail
    
    console.log('====================== run 2 ======================');
    dispatcher.unregisterOnReceive([LOGIN_STATUS.SUCCESS, LOGIN_STATUS.FAIL], logger.onReceiveLoginStatus); // unregister logger
    dispatcher.onReceive(LOGIN_STATUS.SUCCESS, '{"user_id":"1","user_name":"Allen"}'); // notify observer about login success
    dispatcher.onReceive(LOGIN_STATUS.FAIL, '{"message":"Incorrect login information."}'); // notify observer about login fail
}