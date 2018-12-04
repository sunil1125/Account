/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/*
====================================================================================
Created By: Avinash Dubey
Created Date: 12/23/2014
Description: Stores the data in this object for the opened tabs, so that no need
to get the data from the database again, In case of multi user there
there this will throe an exception record already changed, there is
only a problem is that user will not get the latest data if any
thing is changed, and memory point of view we have seen that there
will be only 10 tab at a time do we have biggest is SalesOrder object.
====================================================================================
*/
var LocalStorageDataViewModel = (function () {
    function LocalStorageDataViewModel() {
        this.StoredData = [];
        var self = this;
        self.Set = function (key, value) {
            self.StoredData[key] = value;
        };

        self.Get = function (key) {
            return self.StoredData[key];
        };

        return self;
    }
    return LocalStorageDataViewModel;
})();

var LocalStorageController = new LocalStorageDataViewModel();
