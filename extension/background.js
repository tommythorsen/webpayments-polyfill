"use strict";

var activePaymentTab = null;

// The implementation of PaymentRequest.show().
//
// BUG: The popup window is not very nice. It might have looked nicer if we
//      could overlay the payment app selection UI (and the payment app UI
//      itself) over the merchant page.
//
function show(jsonPaymentRequest, sendResponse) {
    console.log("show: " + jsonPaymentRequest);
    var paymentRequest = JSON.parse(jsonPaymentRequest);

    var identifiers = "";
    for (var methodData of paymentRequest.methodData) {
        for (var supportedMethod of methodData.supportedMethods) {
            if (identifiers) identifiers += ",";
            identifiers += supportedMethod;
        }
    }

    var url = "select-payment-app.html";
    if (identifiers) {
        url += "?ids=" + identifiers;
    }

    chrome.tabs.create({url: url, active: false}, function(tab) {
        activePaymentTab = tab;
        chrome.windows.create(
                {
                    tabId: tab.id,
                    type: 'popup',
                    focused: true,
                    width: 400,
                    height: 800
                });
    });
    return true;
}

// Message listener for receiving messages from the polyfill functions via
// content.js.
//
chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
    console.log("messageExternal: " + message);
    if (message.hasOwnProperty("show")) {
        return show(message.show, sendResponse);
    } else if (message.hasOwnProperty("abort")) {
        return abort(sendResponse);
    } else {
        sendResponse();
    }
});
