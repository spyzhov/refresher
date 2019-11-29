"use strict";

(function () {
    let el_start = document.getElementById('start'),
        el_stop  = document.getElementById('stop'),
        el_count  = document.getElementById('count');

    function toggle(data) {
        if (data) {
            el_start.classList.add('d-none');
            el_stop.classList.remove('d-none');
            el_count.value = data.ttl / 60000;
        } else {
            el_stop.classList.add('d-none');
            el_start.classList.remove('d-none');
        }
    }

    function current() {
        return new Promise(resolve =>
            chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
                resolve(tabs[0]);
            }));
    }

    function start(tab) {
        let val = parseInt(el_count.value);
        if (val > 0) {
            let ttl = val * 60 * 1000;
            chrome.runtime.sendMessage({
                command: "refresh.start",
                tabId: tab.id,
                ttl,
            });
            toggle({ttl});
        }
    }

    function stop(tab) {
        chrome.runtime.sendMessage({
            command: "refresh.stop",
            tabId: tab.id,
        });
        toggle();
    }

    el_start.onclick = function () {
        current().then((tab) => start(tab));
    };

    el_stop.onclick = function () {
        current().then((tab) => stop(tab));
    };

    current().then(tab => storage.get(`${tab.id}`).then(data => {
        toggle(data);
    }));
})();
