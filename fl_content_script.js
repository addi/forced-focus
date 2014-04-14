chrome.storage.sync.get({
    urls: new Array(),
    redirect_url: "http://www.arnij.com"
}, function(items)
{
    var blockedSites = items.urls;

    for (var s=0; s < blockedSites.length; s++)
    {
        if(window.location.toString().indexOf(blockedSites[s]) != -1)
        {
            window.location = items.redirect_url
            break;
        }
    }
});