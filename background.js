/*
background.js

This file tells Chrome when to run the extension and what exactly that entails (running either modifier.js or popup.js)/

Authors: Jack Hughes

Date of Creation: 10-5-20

-JBH
 */

//When you switch tabs, check to see if it's a kent grade page
chrome.tabs.onActivated.addListener(function(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
        var url = tab.url;
        if(url.includes("kentdenver.instructure.com/courses/") && url.includes("grades")){
            //OMG IT IS A GRADE PAGE! RUN THE SCRIPT!
            chrome.tabs.executeScript({
                file: 'modifier.js'
            });
        }
    });
});

//runs extension on reloading of current tab to any if its still a legal page to run it on
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    var url = tab.url;
    if(url.includes("kentdenver.instructure.com/courses/") && url.includes("grades")){
        chrome.tabs.executeScript({
            file: 'modifier.js'
        });
    }
});
var popupId;

// When the icon is clicked in Chrome
chrome.browserAction.onClicked.addListener(function(tab) {

    // If popupId is undefined then there isn't a popup currently open.
    if (typeof popupId === "undefined") {

        // Open the popup
        chrome.windows.create({
            "url": chrome.runtime.getURL("popup.html"),
            "type": "popup",
            "focused": true,
            "width": 310,
            "height": 465
        }, function (popup) {
            popupId = popup.id;
            chrome.tabs.executeScript({
                file: 'popup.js'
            });
        });
    }
    // There's currently a popup open
    else {
        // Bring it to the front so the user can see it
        chrome.windows.update(popupId, { "focused": true });
    }

});

// When a window is closed
chrome.windows.onRemoved.addListener(function(windowId) {
    // If the window getting closed is the popup we created
    if (windowId === popupId) {
        // Set popupId to undefined so we know the popups not open
        popupId = undefined;
    }
});