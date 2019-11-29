"use strict";

(function () {
    let el_start = document.getElementById('start'),
        el_stop  = document.getElementById('stop'),
        el_count  = document.getElementById('count'),
        el_units  = document.getElementById('units');

    function toggle(data) {
        if (data) {
            el_start.classList.add('d-none');
            el_stop.classList.remove('d-none');
            el_count.value = data.count;
            el_units.value = data.units;
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
        let count = parseInt(el_count.value);
        if (count > 0) {
            let units = el_units.options[el_units.options.selectedIndex].value;
            chrome.runtime.sendMessage({
                command: "refresh.start",
                tabId: tab.id,
                count,
                units,
            });
            toggle({count, units});
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
