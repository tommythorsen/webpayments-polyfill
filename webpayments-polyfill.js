(function(global){

// Do nothing if the user agent already supports the PaymentRequest API
if (global['PaymentRequest']) {
    return;
}

global['PaymentRequest'] = PaymentRequest;

function PaymentRequest(methodData, details, options) {
    this.methodData = methodData;
    this.details = details;
    this.options = options;

    this.paymentRequestId = null;
    this.shippingAddress = null;
    this.shippingOption = null;
    this.shippingType = null;

    this.eventListeners = {};
    this.addEventListener = function(eventName, callback) {
        this.eventListeners[eventName] = callback;
    }
}

function waitForContentScript() {
    console.log("waitForContentScript");
    return new Promise(function(resolve) {
        function check() {
            console.log("check");
            if (window.hasOwnProperty("__PaymentRequestInternal")) {
                resolve();
            }

            window.setTimeout(check, 100);
        }
        check();
    });
}

PaymentRequest.prototype = {
    constructor: PaymentRequest,
    show: function() {
        console.log("PaymentRequest.show()");
        var request = JSON.stringify(this);
        return new Promise(function(resolve, reject) {
            waitForContentScript().then(function() {
                return window.__PaymentRequestInternal.show(request)
            })
            .then(function(response) {
                console.log("PaymentRequest.show() response: " + response);
                if (response) {
                    resolve(response);
                } else {
                    reject();
                }
            });
        });
    },
    abort: function() {
        console.log("PaymentRequest.abort()");
        return new Promise(function(resolve, reject) {
            waitForContentScript().then(function() {
                return window.__PaymentRequestInternal.abort()
            })
            .then(function() {
                resolve();
            });
        });
    },
    canMakePayment: function() {
        return new Promise(function(resolve, reject) {
            waitForContentScript().then(function() {
                return window.__PaymentRequestInternal.canMakePayment()
            })
            .then(function() {
                resolve();
            });
        });
    }
};

})(typeof window != 'undefined'
    ? window
    : typeof global != 'undefined'
        ? global
        : typeof self != 'undefined'
            ? self
            : this);
