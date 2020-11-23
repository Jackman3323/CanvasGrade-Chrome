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

chrome.storage.local.set({'urmom':'urmom'},function(){});
