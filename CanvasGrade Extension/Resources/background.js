chrome.tabs.onActivated.addListener(function(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
        var url = tab.url;
        if(url.includes("kentdenver.instructure.com/courses/") && url.includes("grades")){
            chrome.tabs.executeScript({
                file: 'modifier.js'
            });
        }
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    var url = tab.url;
    if(url.includes("kentdenver.instructure.com/courses/") && url.includes("grades")){
        chrome.tabs.executeScript({
            file: 'modifier.js'
        });
    }
});

chrome.browserAction.onClicked.addListener(function(tab){
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