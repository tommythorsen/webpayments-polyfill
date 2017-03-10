var form = document.getElementById("basic-card");
form.addEventListener("submit", function() {
    window.postMessage({
        type: "select-payment-app",
        command: "respond",
        payload: {
            methodName: "basic-card",
            details: {
                cardholderName: form.elements["cardholdername"].value,
                cardNumber: form.elements["cardnumber"].value,
                expiryMonth: form.elements["expirydate"].value.substring(0, 2),
                expiryYear: form.elements["expirydate"].value.substring(3, 5),
                cardSecurityCode: form.elements["securitycode"].value,
            }
        }
    }, "*");
});

function appendPaymentApp(paymentApp) {
    var apps = document.getElementById("apps");
    var div = document.createElement("div");
    div.style.float = "left";
    div.style.clear = "left";
    div.innerHTML = '<h3 style="display: inline">' + paymentApp.name + '</h3>' +
        '<button style="float: right" id="pay">Pay</button>' +
        '<p>' + paymentApp.start_url + '</p>';
    div.querySelector("#pay").addEventListener('click', function() {
        console.log("click");
    });
    apps.appendChild(div);
}

chrome.storage.local.get(null, function(items) {
    var ids = {};
    var idlist = window.location.search.substring(5).split(',');
    for (var id of idlist) {
        ids[id] = true;
    }

    var hasApps = false;
    for (var key in items) {
        var paymentApp = items[key];
        for (var id of paymentApp.enabled_methods) {
            if (ids[id]) {
                appendPaymentApp(paymentApp);
                hasApps = true;
                break;
            }
        }
    }
});
