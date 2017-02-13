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

function sendMessage(command, payload) {
    console.log("sendMessage(" + command + ")");
    return new Promise(function(resolve) {
        window.addEventListener("message", listener = function(event) {
            if (event.source != window) return;
            if (event.data.type && event.data.type == "webpayments-polyfill-content") {
                window.removeEventListener("message", listener);
                console.log("event: " + JSON.stringify(event));
                resolve(event.data.payload);
            }
        }, false);
        window.postMessage({type: "webpayments-polyfill", command: "show", payload: payload}, "*");
    });
}

PaymentRequest.prototype = {
    constructor: PaymentRequest,
    show: function() {
        console.log("PaymentRequest.show()");
        var request = JSON.stringify(this);
        return new Promise(function(resolve, reject) {
            sendMessage("show", request)
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
            sendMessage("abort", null)
            .then(function() {
                resolve();
            });
        });
    },
    canMakePayment: function() {
        return new Promise(function(resolve, reject) {
            sendMessage("canMakePayment", null)
            .then(function(result) {
                resolve(result);
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
