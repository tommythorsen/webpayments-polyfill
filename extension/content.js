function show(request, sendResponse) {
    console.log("show()");
    chrome.runtime.sendMessage({command: "getMatchingAppIds", payload: request}, function(appIds) {
        if (appIds.length == 0) {
            sendResponse({error: "NOT_SUPPORTED_ERR"});
            return;
        }

        var url = "select-payment-app.html?ids=" + appIds.join();

        var div = document.createElement("div");
        div.setAttribute("style",
            "display: block; position: fixed; left: 0; right: 0; top: 0; bottom: 0; background: rgba(0, 0, 0, 0.5);");
        document.body.appendChild(div);

        var iframe = document.createElement("iframe");
        iframe.setAttribute("style",
            "position: absolute; left: 20vw; top: 10vh; width: 60vw; height: 80vh; background: white");
        iframe.setAttribute("src", chrome.extension.getURL(url));
        div.appendChild(iframe);
    });
}

// Relay messages from the polyfill to the background script.
window.addEventListener("message", function(event) {
    if (event.source != window) return;
    if (!event.data.type) return;

    console.log(JSON.stringify(event.data));

    if (event.data.type == "webpayments-polyfill") {
        if (event.data.command == "show") {
            show(event.data.payload, function(response) {
                window.postMessage({type: "webpayments-polyfill-content", payload: response}, "*");
            });
        }
    }
}, false);
