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

PaymentRequest.prototype = {
    constructor: PaymentRequest,
    show: function() {
        console.log("PaymentRequest.show()");
        var request = JSON.stringify(this);
        return new Promise(function(resolve, reject) {
            chrome.runtime.sendMessage("iolnngfpnidgodeaeghmnpccfjdhjeej", {show: request},
                function(response) {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response.response);
                    }
                });
        });
    },
    abort: function() {
        console.log("PaymentRequest.abort()");
        return new Promise(function(resolve, reject) {
            chrome.runtime.sendMessage("iolnngfpnidgodeaeghmnpccfjdhjeej", {abort: false},
                function(response) {
                    resolve();
                });
        });
    },
    canMakePayment: function() {
        return new Promise.resolve(true);
    }
};

})(typeof window != 'undefined'
    ? window
    : typeof global != 'undefined'
        ? global
        : typeof self != 'undefined'
            ? self
            : this);
