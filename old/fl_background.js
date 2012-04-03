var fl_Background = function(database)
{
    this.CHECK_INTERVAL = 1;
    this.database = database;
};

fl_Background.prototype.onTimerTick = function()
{
    if(localStorage["shouldRefreshDatabase"] === "true")
    {
        this.database.refreshCurrentUserStorage();
    }
    
    if(this.database.hasUser() && this.database.getNumberOfOpenTabs() > 0)
    {
        this.database.setRemainingSeconds(this.database.getRemainingSeconds() - this.CHECK_INTERVAL);
    }
};

fl_Background.prototype.onRequest = function(msg, port) 
{
    if (msg.method === "update")
    {
        port.postMessage({
            "remainingSeconds": this.database.getRemainingSeconds(),
            "numberOfVisitsToday": this.database.getNumberOfVisitsToday(),
            "maxVisits": this.database.getMaxAllowedVisitsPerDay(),
            "limitTime": this.database.shouldLimitTime(),
            "limitVisits": this.database.shouldLimitVisits()
        });
    }
    else if(msg.method === "closeTab")
    {
        this.tabWasClosed();
    }
    else if (msg.method === "postUserID")
    {
        this.database.setUserID(msg.userID);
        
        if(this.database.isFirstVisitOfTheDay(new Date()))
        {
            this.database.resetExtensionForCurrentUser();
        }
        this.markVisit();
    }
};

fl_Background.prototype.addExtensionsListener = function()
{
    var instance = this;
    
    chrome.extension.onConnect.addListener(function(port)
    {
        port.onMessage.addListener(function(msg)
        {
            instance.onRequest(msg, port);
        });
        
        port.onDisconnect.addListener(function(msg)
        {
            instance.tabWasClosed();
        });
    });
};

fl_Background.prototype.startTimer = function()
{
    var instance = this;
    setInterval (function() { instance.onTimerTick() }, this.CHECK_INTERVAL * 1000);
};

fl_Background.prototype.markVisit = function()
{
    if(this.database.getNumberOfOpenTabs() === 0)
    {
        this.database.setNumberOfVisitsToday(this.database.getNumberOfVisitsToday() + 1);
    }
    
    this.database.setLastVisit(new Date());
    this.database.setNumberOfOpenTabs(this.database.getNumberOfOpenTabs() + 1);
};

fl_Background.prototype.tabWasClosed = function()
{
    this.database.setNumberOfOpenTabs(this.database.getNumberOfOpenTabs() - 1);
};