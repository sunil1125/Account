/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../../Scripts/TypeDefs/Simplex.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/toastr.d.ts" />
//#endregion
define(["require", "exports", 'durandal/system', 'durandal/app'], function(require, exports, __refSystem__, ___app__) {
    //#region Import
    var refSystem = __refSystem__;
    var _app = ___app__;

    //#endregion
    // carrier menu client command
    var CarriersClientCommands = (function () {
        function CarriersClientCommands() {
        }
        //#region Public Methods
        /// Loaded the all the types of carrier mapped
        /// parameter: success callback, and failed call back
        CarriersClientCommands.prototype.getAllMappedCarrierDetails = function (searchFilter, successCallBack, failureCallback, PagingData) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            if (PagingData != undefined) {
                ajax.post('Accounting/GetAllMappedCarrierDetails', searchFilter).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    self.failureProxyCallback('GetVendorBillStatusList', arg);
                });
            }
        };

        /// Loaded the CarrierTypes of carrier contact
        /// parameter: success callback, and failed call back
        CarriersClientCommands.prototype.getCarrierTypesDetails = function (ID, successCallBack, failureCallback) {
            var self = this;
            var url = 'Accounting/GetCarrierContactDetail/?carrierId=' + ID;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetCarrierContactDetailList', arg);
            });
        };

        //To save Carrier Mapping Details
        CarriersClientCommands.prototype.SaveCarrierMappingDetail = function (CarrierMappingDetails, successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveUpdateMasCarriers", CarrierMappingDetails).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('SaveCarrierMappingDetail', message);
            });
        };

        //To save Contact Details Accounting/SaveCarrierContactDetails
        CarriersClientCommands.prototype.SaveCarrierContactDetails = function (carrierContactDetail, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveCarrierContactDetails", carrierContactDetail).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('SaveCarrierContactDetail', message);
            });
        };

        // Gets the document details from the service
        CarriersClientCommands.prototype.getCarrierDocumentDetails = function (carrierId, successCallback, failedCallback) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var stringUrl = "Accounting/GetCarrierDocuments?carrierId=" + carrierId;

            ajax.get(stringUrl).done(function (message) {
                successCallback(message);
            }).fail(function (message) {
                if (failedCallback) {
                    failedCallback(message);
                }
                self.failureProxyCallback('getCarrierDocumentDetails', message);
            });
        };

        //To save carrier documents
        CarriersClientCommands.prototype.saveCarrierDocuments = function (carrierDocumentDetail, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveCarrierDocument", carrierDocumentDetail).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('saveCarrierDocuments', message);
            });
        };

        //To delete carrier document Details
        CarriersClientCommands.prototype.deleteCarrierDocuments = function (carrierDocumentDetail, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/RemoveCarrierPackets", carrierDocumentDetail).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('saveCarrierDocuments', message);
            });
        };

        //#endregion
        //#region Private Methods
        // For Log the Error record
        CarriersClientCommands.prototype.failureProxyCallback = function (context, error) {
            if (error.responseText) {
                if (error.responseText.indexOf("HTTP_STATUS_CODE:401") != -1) {
                    refSystem.log(error.responseText, error, context + ' error callback');
                    return;
                }
            }

            try  {
                var errorDetails = JSON.parse(error.responseText);
                if (error) {
                    refSystem.log(errorDetails.Message, error, context + ' error callback');
                    return;
                } else {
                    refSystem.log(errorDetails.responseText, error, context + ' error callback');
                    return;
                }
            } catch (err) {
                var status = error.status;
                var statusText = error.statusText;
                refSystem.log((status ? error.status + ': ' : 'Error : ') + (statusText ? error.statusText : ''), error, context + ' failure/error callback');
                return;
            }
        };
        return CarriersClientCommands;
    })();
    exports.CarriersClientCommands = CarriersClientCommands;

    var SearchModel = (function () {
        function SearchModel(searchValue, sortOrder, sortCol, PageNumber, PageSize, filterItems) {
            this.SearchValue = searchValue;
            this.PageNumber = PageNumber;
            this.PageSize = PageSize;
            this.SortCol = sortCol;
            this.SortOrder = sortOrder;
            this.SearchFilterItems = filterItems;
        }
        return SearchModel;
    })();
});
