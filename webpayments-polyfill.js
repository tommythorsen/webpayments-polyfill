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
    this.show = function() {
        console.log("PaymentRequest.show() called");
        var request = JSON.stringify(this);
        return new Promise(function(resolve, reject) {
            chrome.runtime.sendMessage("iolnngfpnidgodeaeghmnpccfjdhjeej", {request: request},
                function(response) {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response.response);
                    }
                });
        });
    }
}

PaymentRequest.prototype = {
    constructor: PaymentRequest
};

})(typeof window != 'undefined'
    ? window
    : typeof global != 'undefined'
        ? global
        : typeof self != 'undefined'
            ? self
            : this);
