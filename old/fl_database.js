var fl_Database = function()
{   
    this.userID = "-1";
    this.userStorage = {};
    this.initUserStorageIfNecessary();
};

fl_Database.prototype.initUserStorageIfNecessary = function()
{
    if(this.userStorage["numberOfOpenTabs"] === undefined)
    {
        this.initNumberOfOpenTabs();
    }
    
    if(this.userStorage["numberOfVisitsToday"] === undefined)
    {
        this.initNumberOfVisitsToday();
    }
    
    if(localStorage["maxAllowedVisitsPerDay"] === undefined)
    {
        this.initMaxAllowedVisitsPerDay();
    }
    
    if(localStorage["maxAllowedSecondsPerDay"] === undefined)
    {
        this.initMaxAllowedSecondsPerDay();
    }
    
    if(localStorage["limitTime"] === undefined)
    {
        this.setShouldLimitTime(true);
    }
    
    if(localStorage["limitVisits"] === undefined)
    {
        this.setShouldLimitVisits(true);
    }
    
    if(localStorage["userIDs"] === undefined)
    {
        localStorage["userIDs"] = JSON.stringify([]);
    }
};

fl_Database.prototype.hasUser = function()
{
    return this.userID !== "";
};

fl_Database.prototype.setUserID = function(userID)
{
    if(userID !== this.userID)
    {
        this.saveUserStorage();
        this.userID = userID;
        this.userStorage = JSON.parse(localStorage.getItem(userID));
        if(this.userStorage === null)
        {
            this.userStorage = {};
            this.storeUserID(userID);
        }
        this.initUserStorageIfNecessary();
        this.saveUserStorage();
    }
};

//Pre: userID hasn't been stored before
fl_Database.prototype.storeUserID = function(userID)
{
    var userIDs = this.getAllUserIDs();
    userIDs.push(userID);
    localStorage["userIDs"] = JSON.stringify(userIDs);
};

fl_Database.prototype.getAllUserIDs = function()
{
    return JSON.parse(localStorage["userIDs"]);
};

fl_Database.prototype.saveUserStorage = function()
{
    localStorage.setItem(this.userID, JSON.stringify(this.userStorage));
};

fl_Database.prototype.getNumberOfOpenTabs = function()
{
    return this.userStorage["numberOfOpenTabs"];
};

fl_Database.prototype.setNumberOfOpenTabs = function(numberOfOpenTabs)
{
    if(numberOfOpenTabs >= 0)
    {
        this.userStorage["numberOfOpenTabs"] = numberOfOpenTabs;
        this.saveUserStorage();
    }
};

fl_Database.prototype.initNumberOfOpenTabs = function()
{
    this.setNumberOfOpenTabs(0);
};

fl_Database.prototype.initNumberOfVisitsToday = function()
{
    this.setNumberOfVisitsToday(0);
};

fl_Database.prototype.getNumberOfVisitsToday = function()
{
    return this.userStorage["numberOfVisitsToday"];
};

fl_Database.prototype.setNumberOfVisitsToday = function(numberOfVisitsToday)
{
    this.userStorage["numberOfVisitsToday"] = numberOfVisitsToday;
    this.saveUserStorage();
};

fl_Database.prototype.initMaxAllowedVisitsPerDay = function()
{
    this.setMaxAllowedVisitsPerDay(10);
};

fl_Database.prototype.getMaxAllowedVisitsPerDay = function()
{
    return parseInt(localStorage["maxAllowedVisitsPerDay"], 10);
};

fl_Database.prototype.setMaxAllowedVisitsPerDay = function(visitsPerDay)
{
    localStorage["maxAllowedVisitsPerDay"] = visitsPerDay;
};

fl_Database.prototype.initMaxAllowedSecondsPerDay = function()
{
    this.setMaxAllowedSecondsPerDay(60 * 20);
};

fl_Database.prototype.getMaxAllowedSecondsPerDay = function()
{
    return parseInt(localStorage["maxAllowedSecondsPerDay"], 10);
};

fl_Database.prototype.setMaxAllowedSecondsPerDay = function(secondsPerDay)
{
    localStorage["maxAllowedSecondsPerDay"] = secondsPerDay;
};

fl_Database.prototype.getRemainingSeconds = function()
{    
    return this.userStorage["secondsRemaining"];
};

fl_Database.prototype.setRemainingSeconds = function(seconds)
{
    this.userStorage["secondsRemaining"] = seconds;
    this.saveUserStorage();
};

fl_Database.prototype.setShouldLimitVisits = function(shouldLimitVisits)
{
    localStorage["limitVisits"] = shouldLimitVisits;
};

fl_Database.prototype.shouldLimitVisits = function()
{
    return localStorage["limitVisits"] === "true";
};

fl_Database.prototype.setShouldLimitTime = function(shouldLimitTime)
{
    localStorage["limitTime"] = shouldLimitTime;
};

fl_Database.prototype.shouldLimitTime = function()
{
    return localStorage["limitTime"] === "true";
};

fl_Database.prototype.isFirstVisitOfTheDay = function(currentDay)
{
    return this.userStorage["yearOfLastVisit"] !== currentDay.getFullYear() ||
        this.userStorage["monthOfLastVisit"] !== currentDay.getMonth() ||
        this.userStorage["dateOfLastVisit"] !== currentDay.getDate();
};

fl_Database.prototype.setLastVisit = function(dateOfLastVisit)
{
    this.userStorage["yearOfLastVisit"] = dateOfLastVisit.getFullYear();
    this.userStorage["monthOfLastVisit"] = dateOfLastVisit.getMonth();
    this.userStorage["dateOfLastVisit"] = dateOfLastVisit.getDate();
    this.saveUserStorage();
};

fl_Database.prototype.setNumberOfTabsToZeroForAllUsers = function()
{
    var currentUserID = this.userID,
    userIDs = this.getAllUserIDs();
    for(var i = 0; i != userIDs.length; i++)
    {
        var userID = userIDs[i];
        this.setUserID(userID);
        this.setNumberOfOpenTabs(0);
    }
    
    this.setUserID(currentUserID);
};

fl_Database.prototype.resetExtensionForCurrentUser = function()
{
    this.setRemainingSeconds(this.getMaxAllowedSecondsPerDay());    
    this.setNumberOfVisitsToday(0);
};

fl_Database.prototype.resetExtensionForAllUsers = function()
{
    var currentUser = this.userID,
    userIDs = this.getAllUserIDs();

    for(var i = 0; i != userIDs.length; i++)
    {
        var userID = userIDs[i];
        this.setUserID(userID);
        this.resetExtensionForCurrentUser();
    }
    
    this.setUserID(currentUser);
    
    localStorage["shouldRefreshDatabase"] = true;
};

fl_Database.prototype.refreshCurrentUserStorage = function()
{
    this.userStorage = JSON.parse(localStorage[this.userID]);
};