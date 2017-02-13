window.addEventListener("message", function(event) {
    if (event.source != window) return;
    if (event.data.type && event.data.type == "webpayments-polyfill") {
        chrome.runtime.sendMessage(event.data, function(payload) {
            window.postMessage({type: "webpayments-polyfill-content", payload: payload}, "*");
        });
    }
}, false);
