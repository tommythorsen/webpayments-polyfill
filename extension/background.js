"use strict";

// The implementation of PaymentRequest.show().
//
// BUG: The popup window is not very nice. It might have looked nicer if we
//      could overlay the payment app selection UI (and the payment app UI
//      itself) over the merchant page.
//
function show(paymentRequest, sendResponse) {
    console.log("show: " + paymentRequest);
    // TODO: Handle the case where there is already a pending request
    pendingPaymentRequest = JSON.parse(paymentRequest);
    pendingResponseCallback = sendResponse;
    var identifiers = "";
    for (var methodData of pendingPaymentRequest.methodData) {
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
        paymentTab = tab;
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
    if (message.command == "show") {
        return show(message.param, sendResponse);
    } else if (message.command == "registerPaymentApp") {
        return registerPaymentApp(message.param, sendResponse);
    } else if (message.command == "getRequest") {
        return getRequest(sendResponse);
    } else if (message.command == "submitPaymentResponse") {
        return submitPaymentResponse(message.param, sendResponse);
    } else {
        sendResponse({to: "webpayments-polyfill.js", error: "Unknown command: " + message.command});
    }
});
