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

//runs popup if logo is clicked on
chrome.browserAction.onClicked.addListener(function(tab){
    //window sizing and running
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        height: 465,
        width: 310,
        type: "popup"
    }, function(win){
        chrome.tabs.executeScript({
            file: 'popup.js'
        });
    });
})