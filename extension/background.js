"use strict";

var activePaymentTab = null;

function getMatchingAppIds(paymentRequest, sendResponse) {
    paymentRequest = JSON.parse(paymentRequest);

    var identifiers = [];
    for (var methodData of paymentRequest.methodData) {
        for (var supportedMethod of methodData.supportedMethods) {
            if (supportedMethod == "basic-card") {
                identifiers.push(supportedMethod);
            }
        }
    }

    sendResponse(identifiers);
}

// Message listener for receiving messages from the polyfill functions via
// content.js.
//
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("onMessage: " + JSON.stringify(message) + ", sender: " + JSON.stringify(sender));
    if (message.command == "getMatchingAppIds") {
        return getMatchingAppIds(message.payload, sendResponse);
    } else if (message.command = "abort") {
        return abort(sendResponse);
    } else {
        sendResponse(new TypeError());
    }
});
