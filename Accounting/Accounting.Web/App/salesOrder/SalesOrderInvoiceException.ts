/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import _invoiceRequestParam = require('services/models/salesOrder/SalesOrdernIvoiceExceptionParameter');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refEnums = require('services/models/common/Enums');
//#endregion

/*
** <summary>
** Sales Order Invoice Exception View Model.
** </summary>
** <createDetails>
** <id>US13160</id> <by>Sankesh</by> <date>9th Oct, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id>US21809</id> <by>Janakiram</by> <date>07-06-2016</date> <description>Enable/Disable the ForceInvoice if the user is not authorized to Edit the bill</description>
** </changeHistory>}
*/
export class SalesOrderInvoiceExceptionViewModel {
    //#region Members

    // holds schedule age
    scheduleAge: KnockoutObservable<number> = ko.observable(0);

    // holds exception reason
    exceptionReason: KnockoutObservable<string> = ko.observable('');

    // Holds invoice reason
    invoiceReason: KnockoutObservable<string> = ko.observable('');

    // flag whether to show or hide Invoice reason text box.
    isEnableInvoiceReason: KnockoutObservable<boolean> = ko.observable(false);

    // keeps validation messages list
    errorSalesOrderInvoiceException: KnockoutValidationGroup;

    // holds updated By
    updatedBy: KnockoutObservable<string> = ko.observable('');

    // is force invoice enable??
    isForceInvoiceEnable: KnockoutObservable<boolean> = ko.observable(true);

    // holds batch Id
    batchId: KnockoutObservable<number> = ko.observable(0);

    // holds shipmentId
    ShipmentId: KnockoutObservable<number> = ko.observable(0);

    // holds update time
    UpdateDateTime: KnockoutObservable<number> = ko.observable(0);

    // holds invoice reason visibility
    invoicedReasonVisibility: KnockoutObservable<boolean> = ko.observable(false);

    // holds Sales order invoice status
    invoiceStatus: KnockoutObservable<number> = ko.observable(0);

    // holds progress bar
    listProgress: KnockoutObservable<boolean> = ko.observable(false);

    // Sales Order Client
    salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();

    isEnable: KnockoutObservable<boolean> = ko.observable(true);

    //for tracking change
    getBITrackChange: () => string[];
    isBIDirty: KnockoutComputed<boolean>;
    isNotAtLoadingTime: boolean = false;
    // call while changes occurs
    public onChangesMade: (dirty: boolean) => any;
    returnValue: boolean = false;
    //#endregion

    //#region Constructor
    constructor() {
        var self = this;

        //#region Validation
        self.invoiceReason.extend({
            required: {
                message: ApplicationMessages.Messages.ForceInvoiceReason,
                onlyIf: () => {
                    return (self.isEnableInvoiceReason());
                }
            }
        });

        self.errorSalesOrderInvoiceException = ko.validatedObservable({
            proNumber: self.invoiceReason,
        });
        //#endregion
        //track changes
        self.SetBITrackChange(self);

        self.getBITrackChange = function () {
            return Utils.getDirtyItems(self);
        };

        self.isBIDirty = ko.computed(() => {
            var result = self.invoiceReason();

            // If this from loading data side the return as false
            if (self.isNotAtLoadingTime)
                return false;

            var returnValue = self.getBITrackChange().length > 0 ? true : false;
            self.returnValue = returnValue;
            if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                self.onChangesMade(returnValue);

            return returnValue;
        });

        return self;
    }

    //#endregion

    //#region Internal public Methods

    // Function validated invoice reason on Save Click
    public validateInvoiceReason() {
        var self = this;
        var isInvalid = false;
        if (self.errorSalesOrderInvoiceException.errors().length != 0) {
            self.errorSalesOrderInvoiceException.errors.showAllMessages();
            return true;
        } else {
            return false;
        }
    }

    // Function executes on Save click
    public onSaveClick() {
        var self = this;
        self.listProgress(true);
        if (!self.validateInvoiceReason()) {
            self.saveInvoiceReason();
            self.isForceInvoiceEnable(false);
        }
        else {
            // if validation occurs
            self.isForceInvoiceEnable(true);
            self.listProgress(false)
			return false;
        }
    }

    // Function fetches the invoice reason parameters
    public saveInvoiceReason() {
        var self = this;

        var invoiceRequestParam = new _invoiceRequestParam.Model.SalesOrderInvoiceExceptionParameter();
        invoiceRequestParam.InvoicedReason = self.invoiceReason();
        invoiceRequestParam.BatchId = self.batchId();
        invoiceRequestParam.ShipmentId = self.ShipmentId();
        invoiceRequestParam.BolNumber = self.ShipmentId().toString();
        invoiceRequestParam.UpdateDateTime = self.UpdateDateTime();

        var successCallBack = function (data) {
            self.isEnableInvoiceReason(false);
            self.initializeInvoiceExceptionDetails(data);
            self.listProgress(false);
            var toastrOptions1 = {
                toastrPositionClass: "toast-top-middle",
                delayInseconds: 10,
                fadeOut: 10,
                typeOfAlert: "",
                title: ""
            }
			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ShipmentForceInvoiced, "success", null, toastrOptions1, null);
            $(".invoicereasondiv-none").slideUp('slow');
            $(".invoiceReason").slideDown('slow');
        },
            failurecallBack = function (message) {
                $(".invoiceReason").slideUp('slow');
                $(".invoicereasondiv-none").slideDown('slow');
                self.listProgress(false);
                self.isForceInvoiceEnable(true);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                }

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions, null);
            }
		self.salesOrderClient.forceInvoiceShipment(invoiceRequestParam, successCallBack, failurecallBack);
    }

    // function executes on Force invoice button click
    public onForcePushClick() {
        var self = this;
        self.isEnableInvoiceReason(true);
        // Set the effect type
        var effect = 'slide';

        // Set the options for the effect type chosen
        var options = { direction: 'right' };

        // Set the duration (default: 400 milliseconds)
        var duration = 700;

        if ($(".invreason").hasClass("invoicereasondiv-none")) {
            $(".invoicereasondiv-none").toggle(effect, options, duration);
            $(".invreason").removeClass("invoicereasondiv-none");
        }
        else {
            $(".invreason").addClass("invoicereasondiv-none");
            $(".invoicereasondiv-none").toggle(effect, options, duration);
        }
    }

    // Function initializes the invoice exception details
    public initializeInvoiceExceptionDetails(data: ISalesOrderInvoiceExceptionDetails, enable?: boolean) {
        var self = this;

        self.isEnable(enable);

        self.batchId(data.BatchId);
        self.ShipmentId(data.ShipmentId);
        self.isNotAtLoadingTime = true;
        // ###START: US21809
        if (data.AllowForceInvoice == true) {
            if (data.InvoicedReason !== null && data.InvoicedReason !== '') {
                self.invoicedReasonVisibility(true);
                self.isForceInvoiceEnable(false);
                self.isEnableInvoiceReason(false);
                self.invoiceReason(data.InvoicedReason);
                self.updatedBy(data.UpdatedBy);
                self.scheduleAge(data.ScheduledAge);
                self.exceptionReason(data.ExceptionMessage);
                //assign track change
                self.SetBITrackChange(self);
            }
            else {
                if (enable) {
                    if (self.invoiceStatus() === refEnums.Enums.InvoiceStatus.Pending.ID) {
                        self.isForceInvoiceEnable(false);
                    }
                    else {
                        self.isForceInvoiceEnable(true);
                    }
                }
                else {
                    self.isForceInvoiceEnable(false);
                }
                self.invoicedReasonVisibility(false);
                self.scheduleAge(data.ScheduledAge);
                self.exceptionReason(data.ExceptionMessage);
            }
        } else {
            self.isForceInvoiceEnable(false);
        }

        // ###END: US21809

        self.isNotAtLoadingTime = false;
    }
    //#endregion

    SetBITrackChange(self) {
        //** To detect changes for Vendor Bill
        self.invoiceReason.extend({ trackChange: true });
    }

    public cleanup() {
        var self = this;

        for (var property in self) {
            delete self[property];
        }
    }

    //#region Internal private methods

    //#endregion
}