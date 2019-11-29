const active = 'icon_active.png';
const inactive = 'icon.png';

function rstop(tabId) {
    return storage.disable(`${tabId}`)
        .then(data => data && data.handler ? clearInterval(data.handler) : undefined);
}

function rupdate(tabId) {
    return storage.get(`${tabId}`)
        .then(data => data ? setIcon(tabId, active) : undefined);
}

function setIcon(tabId, icon) {
    chrome.browserAction.setIcon({
        tabId: tabId,
        path: `/assets/${icon}`,
    })
}

chrome.runtime.onMessage.addListener(function (request) {
    if (!request.tabId || (request.command !== 'refresh.start' && request.command !== 'refresh.stop')) {
        return;
    }
    if (request.command === 'refresh.start') {
        let ttl = request.count * 1000 * (request.units === 'min' ? 60 : 1);
        storage.get(`${request.tabId}`)
            .then(handler => handler ? clearInterval(handler) : undefined)
            .then(() => storage.enable(`${request.tabId}`, {
                handler: setInterval(() => chrome.tabs.reload(request.tabId), ttl),
                count: request.count,
                units: request.units,
            }))
            .then(() => setIcon(request.tabId, active));
    } else if (request.command === 'refresh.stop') {
        rstop(request.tabId)
            .then(() => setIcon(request.tabId, inactive));
    }
});

chrome.tabs.onDetached.addListener(rstop);
chrome.tabs.onUpdated.addListener(rupdate);
