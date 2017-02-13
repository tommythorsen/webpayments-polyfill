window ['__PaymentRequestInternal'] = {
    show: function() {
        console.log("PaymentRequestInternal.show()");
        var request = JSON.stringify(this);
        return new Promise(function(resolve) {
            chrome.runtime.sendMessage("iolnngfpnidgodeaeghmnpccfjdhjeej", {show: request}, resolve);
        });
    },
    abort: function() {
        console.log("PaymentRequestInternal.abort()");
        return new Promise(function(resolve) {
            chrome.runtime.sendMessage("iolnngfpnidgodeaeghmnpccfjdhjeej", {abort: false}, resolve);
        });
    }
    canMakePayment: function() {
        return new Promise.resolve(true);
    }
};
