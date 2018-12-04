/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
/*
** <summary>
** Module to hold all the constants used in the application.
** </summary>
** <createDetails>
** <id></id> <by>Avinash Dubey</by> <date>06-07-2014</date>
** </createDetails>
** <changeHistory>
** <id>US19330</id> <by>Baldev Singh Thakur</by> <date>02-11-2015</date>
** <id>US20208</id> <by>Vasanthakumar</by> <date>01-01-2016</date> <description>Modification of SO Cancellation Process for the Insurance on BOLs in Accounting</description>
** <id>US20264</id> <by>Shreesha Adiga</by> <date>11-01-2016</date> <description>Added sales order upload related error/success messages</description>
** <id>US20961</id> <by>Shreesha Adiga</by> <date>08-03-2016</date> <description>Added DisputeStatusSavedSuccessfully</description>
** <id>US20884</id> <by>Baldev Singh Thakur</by> <date>21-03-2016</date> <description>Added LostBillCostValidation</description>
** <id>US21132</id> <by>Shreesha Adiga</by> <date>26-04-2016</date><description>Added ContinueWithLostBillCreationToastrMessage and DoYouWantToCreateLostBill</description>
** <id>DE22808</id> <by>Baldev Singh Thakur</by> <date>13-05-2016</date><description>Error message on saving Bill/UVB even if bill has saved successfully.</description>
** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
** <id>US22955</id> <by>Shreesha Adiga</by> <date>30-06-2016</date> <description>Added messages for SO cancel reason popup</description>
** <id>US23124</id> <by>Janakiram</by> <date>04-07-2016</date><description>Added success Messages memo notes added </description>
** <id>DE23551</id> <by>Janakiram</by> <date>03-08-2016</date><description>Added zero record success Messages for Vendor bill upload</description>
** <id>US24323</id> <by>Baldev Singh Thakur</by> <date>01-09-2016</date><description>Updated the message for Zero Revenue with Cost for Sales Order</description>
** <id>US24671</id> <by>Shreesha Adiga</by> <date>12-09-2016</date> <description>Added BaseRateCantBeAddedMultipleTimes</description>
** <id>DE24438</id> <by>Shreesha Adiga</by> <date>21-09-2016</date><description>Added InsuranceItemsCantBeAddedToTLOrdersFromAccounting</description>
** <id>US24647</id> <by>Janakiram</by> <date>14-09-2016</date><description>Added constant  Record Already Changed Message</description>
** <id>DE23954</id> <by>Vasanthakumar</by> <date>28-09-2016</date> <description>Invoice Exception Board -  Force invoice button is enabled for already force invoiced record</description>
** <id>US24865</id> <by>Shreesha Adiga</by> <date>23-09-2016</date><description>Added DisputeEmailSubject and PleaseChooseDisputeTemplate </description>
** <id>US24871</id> <by>Janakiram</by> <date>14-09-2016</date><description>Added constant for Dispute Mail sucees/failure</description>
** <id>US25117</id> <by>Baldev Singh Thakur</by> <date>30-09-2016</date> <description>Updated the validation message for Packing Group.</description>
** <id>DE24699</id> <by>Baldev Singh Thakur</by> <date>06-10-2016</date> <description>Updated the validation message for Hazmat Class.</description>
** <id>US25277</id> <by>Baldev Singh Thakur</by> <date>19-10-2016</date> <description>Added the validation message for Credit Revenue.</description>
** <id>US25587</id> <by>Janakiram</by> <date>22-11-2016</date> <description>Added Toaster message while doing Un-Cancell</description>
** <id>US25684</id> <by>Shreesha Adiga</by> <date>23-11-2016</date><description>Added messages for VB reassignment popup</description>
** <id>DE25057</id> <by>Janakiram</by> <date>31-11-2016</date> <description>Added required filed for truck load quote</description>
** <id>US25941</id> <by>Janakiram</by> <date>13-12-2016</date> <description>Added required filed Message for Vendor Credit Amount</description>
** <id>DE25495</id> <by>Baldev Singh Thakur</by> <date>03-01-2017</date> <description>Added Validation Message for Vendor Credit Amount</description>
** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date> <description>Added Validation Message for Select SO in dispute won credit reason</description>
** <id>US26955</id> <by>Baldev Singh Thakur</by> <date>15-02-2017</date> <description>Added Validation Message for Select cancelled SO in Vendor Bill Reassignment.</description>
** <id>US27159</id> <by>Baldev Singh Thakur</by> <date>24-02-2017</date> <description>Added information Message for Scheduling TL orders without completed.</description>
** <id>US27614</id> <by>Baldev Singh Thakur</by> <date>21-03-2017</date> <description>Added information Message for not to reassign a vendor bill to sub so.</description>
** <id>US27353</id> <by>Vasanthakumar</by> <date>23-03-2017</date> <description>Added information Message for Navigate the user to SO screen if Reassign so not invoiced or scheduled</description>
** </changeHistory>
*/
var ApplicationMessages;
(function (ApplicationMessages) {
    //#region UI Constants
    //Constants class to hold all the static constant values used in the UI.
    //All the Message box related constants will be present in this class.
    var Messages = (function () {
        function Messages() {
        }
        Messages.VendorBillNotesValidationMessage = "You have not yet submitted vendor bill notes. Do you wish to continue without saving the vendor bill notes?";

        Messages.PROAlreadyExists = "Entered PRO# already exist for this Vendor";

        Messages.ApplicationMessageTitle = "GlobalTranz Enterprise";

        Messages.SavedSuccessfullyMessage = "VendorBill saved successfully";

        Messages.SalesOrderSavedSuccessfullyMessage = "Sales Order created successfully with BOL# :";

        Messages.SalesOrderCopiedSuccessfullyMessage = "Sales Order saved successfully with BOL# :";

        Messages.CostIsNotMoreThanRevenueMessage = "Current Revenue can not be accepted as it is resulting in negative margin for this shipment";

        Messages.EmptyDeliveryDate = "Delivery Date should be empty";

        Messages.GreaterDeliveryDate = "Delivery Date should be greater than Pickup Date";

        Messages.MappingsSavedSuccessfullyMessage = "Mapping Details saved successfully";

        Messages.ContactSavedSuccessfullyMessage = "Contact Details saved successfully";

        Messages.BOLValidationMessage = "Entered BOL Number is either Cancelled/Invalid. Do you want to create a UVB with this BOL Number?";

        Messages.PROValidationMessage = "This given Sales Order does not have a PRO#.  Do you want to force attach this VB to the Order?";

        Messages.ForceAttachInputeMessage = "Please Note:  You are attaching a Vendor Bill to a Sales Order.  The Sales Order does not have a matching PRO#.  Would you like to update the Sales Order PRO# :";

        Messages.DateTimeValidation = "Please Select Date Time frame ...";

        Messages.ValidPRORequired = "A valid PRO Number is required";

        Messages.ValidDateRequired = " A valid Bill Date is required";

        Messages.ValidTimeRequired = " A valid Bill Date is required";

        Messages.ValidPickupReadyTimeRequired = " A Valid Pickup Ready Time is required";

        Messages.ValidPickupCloseTimeRequired = " A Valid Pickup Close Time is required";

        Messages.ValidOriginZIPRequired = "A valid Origin ZIP is required";

        Messages.ValidDestinationZIPRequired = "A valid Destination ZIP is required";

        Messages.BillDateIsRequired = 'Bill date is required.';

        Messages.PickupDateIsRequired = 'Pickup date is required.';

        Messages.RequestedPickupDateIsRequired = 'Requested Pickup date is required.';

        Messages.NotAValidDate = 'Not a valid date';

        Messages.ToValidPickUpDateNotLessThenFromDate = 'To PickUp Date should be greater than or equal to From PickUp Date and till today date';

        Messages.DeliveryDateRequired = 'Delivery  date is required.';

        Messages.ForceAttachRequired = "Force Attach Required PRO# as well as BOL#";

        Messages.BillAmountShouldNotbeNegative = "Vendor bill amount should not be negative.";

        Messages.ForcePushToMasValidationMessage = "Vendor bill is on hold. Please uncheck hold vendor bill in vendor bill form before force push";

        Messages.EnterDisputeAmount = "Please enter dispute amount";

        Messages.EnterDisputeDate = "Dispute date cannot be blank or empty";

        Messages.EnterDisputeNotes = "Dispute Notes cannot be blank.";

        Messages.VendorBillStatusChangedToPending = "Bill will be converted to Unmatched Vendor Bill and order will no longer be attached.Do you want to continue?";

        Messages.ChangePreviousStatusOnNegativeMargin = "The current bill's status has been set to its previous value";

        Messages.NegativeMarginValidation_1 = "Clearing the bill will cause a reduction in margin of $ ";
        Messages.NegativeMarginValidation_2 = "\nTotal Profit will now be $ ";
        Messages.NegativeMarginValidation_3 = "\nDo you want to continue?";

        Messages.ChangesMadeMessage = "You have not yet submitted the changes you made to this record. Do you want to move on without saving your changes?";

        Messages.SubOrderBOL = "Sub order BOL# cannot be given for attaching";

        Messages.ValidDisputeAmountRequired = "A valid Dispute Amount is required";

        Messages.ValidDisputeDateRequired = "A valid Dispute Date is required";

        Messages.ValidDisputeNotesRequired = "A valid Dispute Notes is required";

        Messages.LostAmountValidation_1 = "Sub bill with lost amount ";
        Messages.LostAmountValidation_2 = " will be created . Do you want to continue?";

        Messages.ContinueWithLostBillCreationToastrMessage = "Sub bill with lost amount ${0} will be created. Do you want to continue?";

        Messages.DoYouWantToCreateLostBill = "Do you want to create a Lost Bill?";

        Messages.NoDisputeLostAmountValidation = "At least one dispute lost amount should be there for the line items";

        Messages.CreateSubOrderAndSubBillSuccessFullMessage = "Sub Bill and Sub Order is successfully created";

        Messages.SendSuccessfullyMail = "Mail sent successfully!";

        Messages.CarrierValidationMessage = "Save Failed: Please select a valid carrier";

        Messages.InvalidCost = "Total Dispute amount of Shipping item cannot be more than Total Cost of Shipping item.";

        Messages.InvalidTotalCost = "Total Dispute amount(Shipping + Discount item) cannot be more than Total Cost(Shipping + Discount item)";

        Messages.NegativeLineItemCostValidation = "Line item cost cannot be negative";

        Messages.NegativeLineItemDisputeCostValidation = "Line item Cost cannot be less than Dispute amount";

        Messages.DisputeCostValidation = "Total Dispute Lost Amount can not be more than Total Dispute Amount";

        Messages.POSavedSuccessfullyMessage = "Unmatched Vendor Bill saved successfully";

        Messages.POForceAttachedSuccessfullyMessage = "Converted to Bill successfully";

        Messages.POForceAttachedSavedSuccessfullyMessage = "Result saved as UVB Possibility";

        Messages.CanNotChangeStatusToDisputeWonMessage = "Suborder has been invoiced,so you cannot change the status to Dispute Won";

        Messages.PleaseSelectDateTimeFrame = "Please Select Date Time frame .";

        Messages.RecordsUploadedMessage = " Records uploaded successfully";

        Messages.RecordsMovedToTheGlobalTranzBoard = "Record(s) moved to the GlobalTranz Board";

        Messages.ErrorinAddModifyRexnordCompany = "Error in add/modify rexnord company";

        Messages.PleaseSelectModeFromTheList = "Please Select Mode from the list .";

        Messages.OnlyFilesWithTypeImagePdfAndWordDocumentAreAllowedToBeUploaded = "Only Files with type Image, Pdf and Word document are allowed to be uploaded";

        Messages.ErrorOccurredWhileFetchingShipmentList = "Error occurred while fetching shipment list";

        Messages.ErrorOccurredWhileFetchingCarrierDetails = "Error occurred while fetching Carrier details";

        Messages.ErrorOccurredWhileFetchingDisputeBoardDetails = "Error occurred while fetching Dispute Board Details";

        Messages.ErrorOccurredWhileFetchingRexnordList = "Error occurred while fetching Rexnord Board Details";

        Messages.ErrorOccurredWhileFetchingVendorBillException = "Error occurred while fetching Vendor Bill Exception Details";

        Messages.ErrorOccurredWhileFetchingVendorBillTrackingList = "Error occurred while fetching Vendor Bill Tracking Details";

        Messages.ErrorOccurredWhileFetchingRequoteList = "Error occurred while fetching Requote Board Details";

        Messages.ErrorOccurredWhileFetchingInvoiceExceptionList = "Error occurred while fetching Invoice Exception Details";

        Messages.ErrorOccurredWhileFetchingDisputeBoardList = "Error occurred while fetching Dispute Board Details";

        Messages.ErrorOccurredWhileFetchingDisputeWonLossList = "Error occurred while fetching Dispute Won/Loss Details";

        Messages.ErrorOccurredWhileFetchingPurchaseOrderList = "Error occurred while fetching Unmatched Vendor Bill list";

        Messages.MaximumLimit10UploadsReached = "Maximum limit of 10 uploads reached";

        Messages.RecordsMovedToTheRexnordBoard = "Record(s) moved to Rexnord Board";

        Messages.ThereShouldBeAtLeastOneLineItem = "There should be at least one line item";

        Messages.ErrorOccurredWhileFetchingSalesOrderList = "Error occurred while fetching Sales Order list";

        Messages.MaxTab = "The maximum number of tabs have been reached. Close an existing tab to view more...";

        Messages.PleaseSelectTheCustomerToGetBillto = "Please select the customer to get Billto";

        Messages.NoRecordsToDownload = "No records to download";

        Messages.ReportGenerateDataHasNotBeenSet = "Data to generate Report has not been set";

        Messages.ThereAreNoRecordsPresentToBeDownloaded = "There are no records present to be downloaded";

        Messages.ReportGenerateUrlHasNotBeenSet = "URL to generate Report has not been set";

        Messages.ProvideUIGridIDItIsMissing = " Provide UI Grid ID, it is Missing.";

        Messages.PleaseSelecttheCustomerToGetBillTo = "Please select the customer to get Bill To";

        Messages.DoYouReallyWantToDeleteThisAttachedFile = "Do you really want to delete this Attached File?";

        Messages.DoYouReallyWantToRemoveThisAttachedFile = "Do you really want to remove this Attached File?";

        Messages.DoYouReallyWantToDeleteThisvendorBillItem = "Do you really want to delete this Vendor Bill item?";

        Messages.DoYouReallyWantToDeleteThisPurchaseOrderItem = "Do you really want to delete this Unmatched Vendor Bill Item?";

        Messages.DoYouReallyWantToDeleteThisSalesOrderItem = "Do you really want to delete this Sales Order item?";

        Messages.MessageForOnlyImageAndPdfFile = "Only Files with type Image and Pdf document are allowed to be uploaded";

        Messages.MessageForOnlyCSVAndXLSFile = "Only Files with type CSV and EXCEL document are allowed to be uploaded";

        Messages.MessageForOnlyImagesFile = "Only Files with type Image are allowed to be uploaded";

        Messages.MessageForOnlyPDFandWordDocument = "Only Files with type pdf and word document are allowed to be uploaded";

        Messages.AreYouSureWantToRemoveThis = "Are you sure want to remove this?";

        Messages.DeleteThisSalesOrderPodDocList = "Deleted Sales Order POD/DOC List Items";

        Messages.UplodedSuccessFully = "Document have uploaded successfully";

        Messages.AreYouSureYouWantToDeleteThisRecord = "Are you sure you want to delete this record";

        Messages.ChaningInternationalShipment = "Changing The Shipment To International Will Result In Shipper And Consignee Details Being Reset.  Would you like to continue?";

        Messages.ValidFromDateRequired = " A valid From Date is required";

        Messages.ValidToDateRequired = " A valid To Date is required";

        Messages.CostRequired = "Cost is required";

        Messages.RevenueRequired = "Revenue is required";

        Messages.DescriptionRequired = "Description is required";

        Messages.PackingGroupRequired = "Please choose Packing Group";

        Messages.HazmatClassRequired = "HazmatClass is required";

        Messages.HazmatClassMinMax = "HazmatClass value should be between 1 and 9";

        Messages.HazmatUnNumberRequired = "HazmatUNNo is required";

        Messages.ChooseItemType = "Please Choose Item Type";

        Messages.ChooseClass = "Please Choose Class";

        Messages.ChoosePackageType = "Please Choose Package Type";

        Messages.weight = "Please Choose Weight";

        Messages.pieceCount = "Please Choose Piece Count";

        Messages.palletCount = "Please Choose Pallet Count";

        Messages.EnterCompanyName = "Enter Company Name";

        Messages.RecordUpdatedSuccessfully = "Record Updated Successfully";

        Messages.RecordSavedSuccessfully = "Record Saved Successfully";

        Messages.MinimumCharactersRequired = "Minimum 3 characters required";

        Messages.ErrorOccurredWhileFetchingBillsList = "Error occurred while fetching Bills list";

        Messages.ErrorOccurredWhileFetchingInvoiceList = "Error occurred while fetching Invoice list";

        Messages.ErrorOccurredWhileFetchingTruckLoadQuoteList = "Error occurred while fetching TruckLoadQuote list";

        Messages.VendorBillSavedButMatchingProcessNotWorking = "Vendor Bill saved successfully but matching process is not working. Please try after some time";

        Messages.PROExists = "PRONo entered in the PO is already used by other Sales order,Order cannot be created.Please change the PRONO and try again";

        Messages.SelectCustomer = "Please Select the Customer";

        Messages.CreatedSalesOrderSuccessfullyMessage = "Created Sales Order successfully";

        Messages.MailSentSuccessfullyMessage = "Mail sent successfully!";

        Messages.ErrorWhileSavingUserTheme = "Some error occurred while saving the theme.Please try again";

        Messages.SavingUserThemeSuccessfully = "The information has been updated successfully";

        Messages.ShowRequestedPickupDateMessage = "Are you sure you want to make a copy of this Order? The Requested Pickup date will be today. To modify the Requested Pickup date, please update after creating the order";

        Messages.ManuallyFinalizedValidation = "For Finalization, PRO# and Pick up date should not be empty";

        Messages.ConfirmCancelSalesOrder = "Do you want to cancel the Sales Order?";

        Messages.CancelSalesOrderSuccessfully = "Sales Order has been Cancelled successfully";

        Messages.CancelSalesOrderSuccessfullyInsuranceCancelFailed = "Sales Order canceled successfully; but the insurance cancellation failed.";

        Messages.CancelSalesOrderFailed = "Sales Order cancellation failed.";

        Messages.ConfirmUnCancelSalesOrder = "Do you want to Un-Cancel the Sales Order?";

        Messages.UnCancelSalesOrderSuccessfully = "Sales Order has been Un-Cancelled successfully";

        Messages.SaveSalesOrderNotesSuccessfully = "Notes Saved Successfully";

        Messages.SaveVendorBillNotesSuccessfully = "Notes Saved Successfully";

        Messages.ForceInvoiceReason = "Please enter Force Invoice Reason";

        Messages.ShipmentForceInvoiced = "Shipment force invoiced";

        Messages.ShipmentForceInvoiceFailed = "Shipment force invoice failed";

        Messages.SalesOrderUpdateSuccessful = "Sales Order has been Updated successfully";

        Messages.SalesOrderFinalizedSuccessful = "Sales Order has been Finalized successfully";

        Messages.PleaseSelectanItem = "Please select an item";

        Messages.PleaseSelectCRRReviewDate = "CRR Review Date cannot be blank";

        Messages.RebillSavedSuccessfully = "Rebill saved successfully";

        Messages.SalesOrderSavedSuccessful = "Sales Order saved successfully";

        Messages.RecordInsertedSuccessfully = "Record inserted successfully";

        Messages.AutoDispatchMessage = "Click Dispatch EDI link to make Auto Dispatch";

        Messages.SalesOrderNotesValidationMessage = "You have not yet submitted sales order notes. Do you wish to continue without saving the sales order notes?";

        Messages.ValidCCharge = "Invalid credit card charge. Please enter a valid credit card charge";

        Messages.ValidECharge = "Invalid E-Check charge. Please enter a valid E-Check charge";

        Messages.DeletePaymentDetailsMessage = "Are you sure you want to remove record from database?";

        Messages.AgentDisputeSavedSuccessfully = "Agent disputes saved successfully";

        Messages.ErrorOccurredWhileFetchingVBExceptionList = "Error occurred while fetching Vendor Bill Exception Details";

        Messages.ErrorOccurredWhileFetchingFinalizedOrders = "Error occurred while fetching Finalized Order With No Vendor Bills";

        Messages.ToValidToDateNotLessThenFromDate = 'To Date should be greater than or equal to From Date and till today date';

        Messages.ErrorOccurredWhileFetchingFinalizedNotInvoicedOrders = "Error occurred while fetching Sales Orders Finalized Not Invoiced";

        Messages.ErrorOccurredWhileFetchingRexnordInvoicingReport = "Error occurred while fetching Rexnord Invoicing Report";

        Messages.RevenueIsZeroAndCostIsGreaterThenZero = "You are creating a SO with cost but no Revenue. The SO will be marked as Scheduled and remain in the same status till Midnight. Post that SO will be invoiced, but it will NOT be Invoiced to Customer. Do you want to continue?";

        Messages.RevenueIsZeroAndCostIsZero = "You are creating a Sales Order with no cost and no revenue, the Sales Order will be Canceled it will NOT be invoiced to customer.";

        Messages.BSCostIsZeroAndCostIsGreaterThanZero = "You are creating a Sales Order with cost but no BS Cost, the Sales Order will be marked as invoiced but it will NOT be invoiced to customer";

        Messages.selectForceInvoiceReason = "Please enter force invoice reason";

        Messages.FAKCannotBeLessThanThreeCharacters = "FAK Description cannot be less than 3 character";

        Messages.FAKDescriptionRequired = "FAK Description is required";

        Messages.FAKItemRequired = "Item is required";

        Messages.FAKSavedSuccessFully = "FAK mapping saved successfully";

        Messages.ErrorOccurredWhileFetchingPOList = "Error occurred while fetching Unmatched Vendor Bill list";

        Messages.InvoiceStatusRevertBackToPending = "Invoice status reverted to pending";

        Messages.ErrorOccurredWhileFetchingEDI210CarrierException = "Error occurred while fetching EDI 210 Carrier Exception Details";

        Messages.ErrorOccurredWhileFetchingRebillSummaryReport = "Error occurred while fetching Rebill Summary Data";

        Messages.ErrorOccurredWhileFetchingDisputedVendorBills = "Error occurred while fetching Disputed Vendor Bills";

        Messages.ErrorOccurredWhileFetchingReBillReasonsReport = "Error occurred while fetching Re Bill Reasons";

        Messages.ErrorOccurredWhileFetchingWeeklyDashboardReport = "Error occurred while fetching Weekly Dashboard details";

        Messages.ErrorOccurredWhileFetchingLowestCostReport = "Error occurred while fetching lowest cost carrier details";

        Messages.ErrorOccurredWhileFetchingRexnordPostAuditReport = "Error occurred while fetching Post Audit Data";

        Messages.OrderWillNotBeFinalized = "The current order will not be finalized with a reduction in margin";

        Messages.CarrierNotMapped = "Carrier not mapped in MAS";

        Messages.ProShouldNotBeEmpty = "PRO# should not be empty";

        Messages.applicationResolved = "Record has been updated in EDI Tables";

        Messages.applicationNoResolved = "Entered BOL is Canceled/Invalid. System cannot reprocess it";

        Messages.ChangeEDIToInactive = "EDI marked as inactive";

        Messages.ChangeEDIToInactiveErrorMessage = "EDI is not marked as inactive";

        Messages.UpdatedEDIForPro = "Changes Saved for ProNumber ";

        Messages.TotalRevenueCannotbelessthantotalcost = "Total revenue cannot be less than total cost";

        Messages.TotalBScostcannotbelessthantotalcost = "Total BS cost cannot be less than total cost";

        Messages.TotalPLCcostcannotbelessthantotalcost = "Total PLC cost cannot be less than total cost";

        Messages.confirmVendorName = "Did you confirm the vendor Name?";

        Messages.billhasSentForProcess = "Bill has been sent to Process";

        Messages.ValidToleranceAmountIsRequired = "A valid Tolerance Amount is required";

        Messages.NoOriginalBillFound = "No original bill found, so this bill has been sent to process";

        Messages.DisputeAmountShouldNotBeNegative = "Total dispute amount cannot be negative or zero value";

        Messages.VendorBillIsNowPO = "VendorBill is no longer associated with a Sales Order. VendorBill is now an Unmatched Vendor Bill";

        Messages.UpdatedSuccessfullyMessage = "VendorBill updated successfully.  ";

        Messages.ValidationForNonRexnordBol = "Permission denied. Entered BOL Number either Cancelled/Invalid";

        Messages.ForeignBolAddressSuccess = "Address saved successfully";

        Messages.ForeignBolCustomerSettingsSuccess = "Customer settings saved successfully";

        Messages.AreYouSureWantToRemoveForeignBolCustomer = "Choose the action which need to be performed to Disassociate Customer and <br\> ";

        Messages.sucessfullUnMapped = "Successfully Unmapped customer";

        Messages.sucessfullUnMappedAndDeletedCustomer = "Successfully Unmapped customer and Deleted address";

        Messages.DissociatePoAsFBOL = "Do you want to dissociate the UVB as FBOL?";

        Messages.AssociatedWithFBOL = "Do you want to change the customer associated with the FBOL? ";

        Messages.DissociatedPOAsFBOLOnCustomerChanged = "Please choose an action that the system needs to perform <br\> <b> Dissociate Customer &: </b>";

        Messages.AreYouSureWantToDisassociateForeignBolCustomer = "Performing the action will delete the Foreign BOL Customer and will unmap all the associated addresses. Do you want to continue?";

        Messages.DisputLostItemShoudBeGreaterThenZero = "Disput Lost Amount shoud be greater then zero";

        Messages.ChangeCostAndRevenue = "Changing the value might change Cost & Revenue. Do you want to proceed. ";

        Messages.RevertChanges = "Changes have been reverted to previous values";

        Messages.ChangingBillToInternationalShipment = "Changing The Shipment To International Will Result In Bill To Details Being Reset.  Would you like to continue?";

        Messages.SuccessMessageForSalesOrderUploadPopup = "{0} record(s) uploaded successfully and {1} record(s) have error. Please correct the same on UI and reprocess those again";

        Messages.SuccessMessageForSOUploadToastr = " records were uploaded successfully";

        Messages.ParameterNotFoundForDisputeWithCarrierLink = " value not found. Please update the same and try clicking the hyperlink again";

        Messages.DisputeStatusSavedSuccessfully = "Vendor Bill State was saved successfully";

        Messages.LostBillCostValidation = "Total Lost bill cost cannot be more than Revenue of the order.";

        Messages.FinalizedOrdersReportDateValidation = "Differnce between From Date and To Date cannot be greater than 3 years.";

        Messages.SavedSuccessfullyMessageThoughMatchingProcessFailed = "VendorBill saved successfully. But there is some processing lag.";

        Messages.MailFailureMessage = "Mail not sent. Try again in sometime";

        Messages.BOLNumberIsRequired = "BOL Number is required";

        Messages.CancelReason_OrderCancelledByCustomer = "BOL {0} is canceled by {1} from Accounting Center. Reason: Order canceled by the Customer.";

        Messages.CancelReason_NewSalesOrderCreated = "BOL {0} is canceled by {1} from Accounting Center. Reason: New Sales Order (BOL# {2}) created.";

        Messages.SavedSuccessfullyMessageNotes = "Notes added successfully";

        Messages.ZeroRecordsUploadedMessage = " Records uploaded";

        Messages.BaseRateCantBeAddedMultipleTimes = "TL shipment doesn't support multiple Base Rate";

        Messages.InsuranceItemsCantBeAddedToTLOrdersFromAccounting = "Insurance Line Item cannot be added from Accounting";

        Messages.RecordAlreadyChanged = "Record has already been changed while you were working on it. Please give us a moment to Reload the latest saved data";

        Messages.DisputeEmailSubject = "GlobalTranz Dispute PRO ({proNumber}) BOL ({bolNumber}) ({carrierName})";

        Messages.PleaseChooseDisputeTemplate = "Please select a Dispute Template";

        Messages.MailSentSuccessfullyDispute = "Mail Sent Successfully";

        Messages.MailFailureMessageDispute = "There was problem sending the E-Mail. Please try after sometime";

        Messages.CreditReasonRequired = "Please choose Credit Reason.";

        Messages.CreditMemoDisputeWonSelectSO = "Please choose Sales Order.";

        Messages.CreditMemoRequestSuccessMessage = "Your request for Credit Memo is raised.";

        Messages.CreditMemoRequestFailureMessage = "There was some error processing your request. Please try after some time.";

        Messages.CreditMemoRequestCanNotBeRaisedMessage = "Credit Memo request cannot be raised for $0 value in Customer and Vendor Credit Amount.";

        Messages.UnCancelInsuredAmount = "Insurance will be removed on Un - Canceling this sales order.If insurance is desired on this shipment, create a new sales order.Would you like to remove insurance and un - cancel this sales order?";

        Messages.ReassignmentReasonRequired = "Reassignment reason is required";

        Messages.ReassignSOIsRequired = "SO# is Required";

        Messages.PleaseSelectRadioCustomerCredit = "Please select an option";

        Messages.PleaseSelectOrderToCredit = "Please select an order to credit";

        Messages.AmountToCreditIsRequired = "Amount is required";

        Messages.ErroWhileSavingReassignment = "There was some error in processing your request. Please try again in sometime";

        Messages.ReassignBOLDoesntExist = "BOL entered doesn't exist. Please try again with a valid BOL#";

        Messages.PendingReassignmentRequestExistsForVB = "The VB you are trying to change has already been edited. Please hold on while we refresh for you.";

        Messages.ReassignmentDetailsSavedSuccessfully = "Reassignment details saved successfully";

        Messages.ConfirmationMessageToastrReassignment = "This Vendor bill is being requested to be moved to a Sales Order which does not contain enough Revenue to cover the Vendor Bill Cost.  This will result in a negative margin of {cost_difference} do you want to proceed?";

        Messages.ReassignSOCantBeSameAsCurrentSO = "Reassign SO# cannot be same as the Current Paired SO#";

        Messages.EnterdCreditAmountCantBeMoreThanRevenue = 'Entered Amount cannot be greater than SO Revenue';

        Messages.ValidTruckLoadQuoteRequired = 'QuoteNumber is Required';

        Messages.CreditMemoRequestSuccessFromVBReassignment = "Credit Memo request is raised successfully.";

        Messages.VendorCreditAmountRequired = 'Vendor Credit Amount is required';

        Messages.VendorCreditAmountZeroRequired = 'Vendor Credit Amount must be greater than $0';

        Messages.ValidateVendorCreditAmount = 'Vendor Credit cannot be greater than Final Cost';

        Messages.ReassignCanceledOrderToastrMessage = 'Entered SO is cancelled. Please try again with a valid SO.';

        Messages.ReassignedOrderInsufficientCostMessage = "Entered SO doesn't have the sufficient cost on it. Please account for the difference and try again. SO#";

        Messages.TLOrderCannotBeScheduledAsOrderNotComplete = "TL Order that you are trying to schedule is incomplete. Please complete the order from CC and try scheduling again.";

        Messages.CannotReassignVendorBillToSubSo = "VB cannot be attached with a sub-so. Raise the request with main SO# and try again.";

        Messages.SONotScheduledForQuickerProcessScheduleTheOrder = "The Sales Order that you are trying to move the Vendor-Bill to is not scheduled. For quicker processing of your request, it is advised to schedule the SO. Please wait while we fetch the Order.";

        Messages.SubOrderCantBeAttachedBill = "Please enter a main order's BOL Number";
        return Messages;
    })();
    ApplicationMessages.Messages = Messages;
})(ApplicationMessages || (ApplicationMessages = {}));
