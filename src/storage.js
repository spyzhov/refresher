"use strict";

const storage = {
    get(key) {
        return new Promise(resolve => chrome.storage.local.get(['enabled'], (list) => {
            let enabled = list.enabled || {};
            resolve(enabled[key] || undefined);
        }));
    },
    enable(key, value) {
        return new Promise(resolve => chrome.storage.local.get(['enabled'], (list) => {
            let enabled = list.enabled || {};
            enabled[key] = value;
            chrome.storage.local.set({enabled});
            resolve();
        }));
    },
    disable(key) {
        return new Promise(resolve => chrome.storage.local.get(['enabled'], (list) => {
            let enabled = list.enabled || {};
            let value = enabled[key];
            delete enabled[key];
            chrome.storage.local.set({enabled});
            resolve(value);
        }));
    },
};
