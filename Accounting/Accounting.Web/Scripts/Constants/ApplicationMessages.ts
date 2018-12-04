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
module ApplicationMessages {
	//#region UI Constants
	//Constants class to hold all the static constant values used in the UI.
	//All the Message box related constants will be present in this class.
	export class Messages {
		//#region Page Title display values

		//Application title name.
		public static VendorBillNotesValidationMessage: string = "You have not yet submitted vendor bill notes. Do you wish to continue without saving the vendor bill notes?";

		// PROAlreadyExists
		public static PROAlreadyExists: string = "Entered PRO# already exist for this Vendor";

		// The title of the application message
		public static ApplicationMessageTitle: string = "GlobalTranz Enterprise";

		// Saved successfully message
		public static SavedSuccessfullyMessage: string = "VendorBill saved successfully";

		// Saved successfully message
		public static SalesOrderSavedSuccessfullyMessage: string = "Sales Order created successfully with BOL# :";

		// Saved successfully message
		public static SalesOrderCopiedSuccessfullyMessage: string = "Sales Order saved successfully with BOL# :";

		public static CostIsNotMoreThanRevenueMessage: string = "Current Revenue can not be accepted as it is resulting in negative margin for this shipment";

		//EmptyDeliveryDate
		public static EmptyDeliveryDate: string = "Delivery Date should be empty";

		//GreaterDeliveryDate
		public static GreaterDeliveryDate: string = "Delivery Date should be greater than Pickup Date";

		// Saved successfully message
		public static MappingsSavedSuccessfullyMessage: string = "Mapping Details saved successfully";

		// Saved successfully message
		public static ContactSavedSuccessfullyMessage: string = "Contact Details saved successfully";

		// BOL validation message
		public static BOLValidationMessage: string = "Entered BOL Number is either Cancelled/Invalid. Do you want to create a UVB with this BOL Number?";

		// Message for PRO validation
		public static PROValidationMessage: string = "This given Sales Order does not have a PRO#.  Do you want to force attach this VB to the Order?";

		// Message which required some of the other words as well
		public static ForceAttachInputeMessage: string = "Please Note:  You are attaching a Vendor Bill to a Sales Order.  The Sales Order does not have a matching PRO#.  Would you like to update the Sales Order PRO# :";

		// Message for date time validation
		public static DateTimeValidation: string = "Please Select Date Time frame ...";

		// Message for valid PRO number
		public static ValidPRORequired: string = "A valid PRO Number is required";

		// Valid date required
		public static ValidDateRequired: string = " A valid Bill Date is required";

		// Valid time required
		public static ValidTimeRequired: string = " A valid Bill Date is required";

		// Valid time required
		public static ValidPickupReadyTimeRequired: string = " A Valid Pickup Ready Time is required";

		// Valid time required
		public static ValidPickupCloseTimeRequired: string = " A Valid Pickup Close Time is required";

		// Valid origin required
		public static ValidOriginZIPRequired: string = "A valid Origin ZIP is required";

		// Valid destination required
		public static ValidDestinationZIPRequired: string = "A valid Destination ZIP is required";

		// bill data is required
		public static BillDateIsRequired: string = 'Bill date is required.';

		// pickup date is required
		public static PickupDateIsRequired: string = 'Pickup date is required.';

		// requested pickup date is required
		public static RequestedPickupDateIsRequired: string = 'Requested Pickup date is required.';

		// Not a valid date
		public static NotAValidDate: string = 'Not a valid date';

		// Not a valid To Pick Up Date
		public static ToValidPickUpDateNotLessThenFromDate: string = 'To PickUp Date should be greater than or equal to From PickUp Date and till today date';

		// Delivery date required
		public static DeliveryDateRequired: string = 'Delivery  date is required.'

		// Force attach required
		public static ForceAttachRequired: string = "Force Attach Required PRO# as well as BOL#"

		// Vendor bill amount should not be negative
		public static BillAmountShouldNotbeNegative: string = "Vendor bill amount should not be negative."

		// When hold vendor bill is checked and try to bill send into mas forcefully.
		public static ForcePushToMasValidationMessage: string = "Vendor bill is on hold. Please uncheck hold vendor bill in vendor bill form before force push";

		// Enter Dispute Amount
		public static EnterDisputeAmount: string = "Please enter dispute amount";

		// Dispute date cannot be blank or empty.
		public static EnterDisputeDate: string = "Dispute date cannot be blank or empty";

		// Dispute Notes cannot be blank
		public static EnterDisputeNotes: string = "Dispute Notes cannot be blank."

		// User changed VB status to pending from any other status.
		public static VendorBillStatusChangedToPending: string = "Bill will be converted to Unmatched Vendor Bill and order will no longer be attached.Do you want to continue?";

		// If Negative margin is there and customer not want to save and status is changed
		public static ChangePreviousStatusOnNegativeMargin: string = "The current bill's status has been set to its previous value";

		// Negative margin validation message
		public static NegativeMarginValidation_1: string = "Clearing the bill will cause a reduction in margin of $ ";
		public static NegativeMarginValidation_2: string = "\nTotal Profit will now be $ ";
		public static NegativeMarginValidation_3: string = "\nDo you want to continue?";

		// used to show the message when any changes are detect in the existing bill
		public static ChangesMadeMessage: string = "You have not yet submitted the changes you made to this record. Do you want to move on without saving your changes?";

		// If bol having spaces in between
		public static SubOrderBOL: string = "Sub order BOL# cannot be given for attaching";

		// Message for valid Dispute Amount
		public static ValidDisputeAmountRequired: string = "A valid Dispute Amount is required";

		// Message for valid Dispute Date
		public static ValidDisputeDateRequired: string = "A valid Dispute Date is required";

		// Message for valid Dispute notes
		public static ValidDisputeNotesRequired: string = "A valid Dispute Notes is required";

		// Message for create lost sub bill amount
		public static LostAmountValidation_1: string = "Sub bill with lost amount ";
		public static LostAmountValidation_2: string = " will be created . Do you want to continue?";

		// ##START: US21132
		// Validation message to be shown on the toastr when create lost bill is clicked
		public static ContinueWithLostBillCreationToastrMessage: string = "Sub bill with lost amount ${0} will be created. Do you want to continue?";

		// Validation message to be shown on the toastr when create lost bill is clicked
		public static DoYouWantToCreateLostBill: string = "Do you want to create a Lost Bill?";
		// ##END: US21132

		// Message for when there is no dispute lost amount and trying to create lost bill
		public static NoDisputeLostAmountValidation: string = "At least one dispute lost amount should be there for the line items";

		// Message when Sub order and sub bill is created
		public static CreateSubOrderAndSubBillSuccessFullMessage: string = "Sub Bill and Sub Order is successfully created";

		// ###START: US22471
		// Saved successfully message
		public static SendSuccessfullyMail: string = "Mail sent successfully!";
		// ###END: US22471

		// Message when selected carrier is not valid
		public static CarrierValidationMessage: string = "Save Failed: Please select a valid carrier";

		// Invalid cost
		public static InvalidCost: string = "Total Dispute amount of Shipping item cannot be more than Total Cost of Shipping item."

		// Invalid total cost
		public static InvalidTotalCost: string = "Total Dispute amount(Shipping + Discount item) cannot be more than Total Cost(Shipping + Discount item)";

		// Negative line item cost
		public static NegativeLineItemCostValidation: string = "Line item cost cannot be negative";

		// Negative line item dispute amount
		public static NegativeLineItemDisputeCostValidation: string = "Line item Cost cannot be less than Dispute amount";

		// 	DisputeCostValidation
		public static DisputeCostValidation: string = "Total Dispute Lost Amount can not be more than Total Dispute Amount";

		// Purchase order Saved successfully message
		public static POSavedSuccessfullyMessage: string = "Unmatched Vendor Bill saved successfully";

		// Purchase order Force Attached successfully message
		public static POForceAttachedSuccessfullyMessage: string = "Converted to Bill successfully";

		// Purchase order Force Attached saved successfully message
		public static POForceAttachedSavedSuccessfullyMessage: string = "Result saved as UVB Possibility";

		// CanNotChangeStatusToDisputeWonMessage
		public static CanNotChangeStatusToDisputeWonMessage: string = "Suborder has been invoiced,so you cannot change the status to Dispute Won";

		//Please Select Date Time frame
		public static PleaseSelectDateTimeFrame: string = "Please Select Date Time frame .";

		//Records uploaded Message
		public static RecordsUploadedMessage: string = " Records uploaded successfully";

		//Record(s) moved to the GlobalTranz Board
		public static RecordsMovedToTheGlobalTranzBoard: string = "Record(s) moved to the GlobalTranz Board";

		//Error in add/modify rexnord company
		public static ErrorinAddModifyRexnordCompany: string = "Error in add/modify rexnord company";

		//Please Select Mode from the list ...
		public static PleaseSelectModeFromTheList: string = "Please Select Mode from the list .";

		//Only Files with type Image, Pdf and Word document are allowed to be uploaded.
		public static OnlyFilesWithTypeImagePdfAndWordDocumentAreAllowedToBeUploaded: string = "Only Files with type Image, Pdf and Word document are allowed to be uploaded";

		//Error occurred while fetching shipment list.
		public static ErrorOccurredWhileFetchingShipmentList: string = "Error occurred while fetching shipment list";

		// error occured while fetching carrier details
		public static ErrorOccurredWhileFetchingCarrierDetails: string = "Error occurred while fetching Carrier details";

		//Error occurred while fetching dispute board details
		public static ErrorOccurredWhileFetchingDisputeBoardDetails: string = "Error occurred while fetching Dispute Board Details";

		// Error occured while fetching Rexnord Board Details
		public static ErrorOccurredWhileFetchingRexnordList: string = "Error occurred while fetching Rexnord Board Details";

		//error occured while fetching vendor bill exception details
		public static ErrorOccurredWhileFetchingVendorBillException: string = "Error occurred while fetching Vendor Bill Exception Details";

		// error occured while fetching vendor bill tracking list
		public static ErrorOccurredWhileFetchingVendorBillTrackingList: string = "Error occurred while fetching Vendor Bill Tracking Details";

		//Error occurred while fetching Requote list.
		public static ErrorOccurredWhileFetchingRequoteList: string = "Error occurred while fetching Requote Board Details";

		//Error occurred while fetching Invoice Exception list.
		public static ErrorOccurredWhileFetchingInvoiceExceptionList: string = "Error occurred while fetching Invoice Exception Details";

		//Error occurred while fetching Dispute Board Details list.
		public static ErrorOccurredWhileFetchingDisputeBoardList: string = "Error occurred while fetching Dispute Board Details";

		//Error occurred while fetching Dispute Won/Loss Details list.
		public static ErrorOccurredWhileFetchingDisputeWonLossList: string = "Error occurred while fetching Dispute Won/Loss Details";

		//Error occurred while fetching shipment list.
		public static ErrorOccurredWhileFetchingPurchaseOrderList: string = "Error occurred while fetching Unmatched Vendor Bill list";

		//Maximum limit 10 uploads reached.
		public static MaximumLimit10UploadsReached: string = "Maximum limit of 10 uploads reached";

		//Record(s) moved to the Rexnord Board
		public static RecordsMovedToTheRexnordBoard: string = "Record(s) moved to Rexnord Board";

		//There should be at least one line item.
		public static ThereShouldBeAtLeastOneLineItem: string = "There should be at least one line item";

		//Error occurred while fetching Sales Order list.
		public static ErrorOccurredWhileFetchingSalesOrderList: string = "Error occurred while fetching Sales Order list";

		//The maximum number of tabs has been reached. Close an existing tab to view more
		public static MaxTab: string = "The maximum number of tabs have been reached. Close an existing tab to view more...";

		//Please select the customer to get Billto
		public static PleaseSelectTheCustomerToGetBillto: string = "Please select the customer to get Billto";

		//No records to download.
		public static NoRecordsToDownload: string = "No records to download";

		//Report generate data has not been set.
		public static ReportGenerateDataHasNotBeenSet: string = "Data to generate Report has not been set";

		//There are no records present to be downloaded.
		public static ThereAreNoRecordsPresentToBeDownloaded: string = "There are no records present to be downloaded";

		//Report generate url has not been set.
		public static ReportGenerateUrlHasNotBeenSet: string = "URL to generate Report has not been set";

		// Provide UI Grid ID, it is Missing...
		public static ProvideUIGridIDItIsMissing: string = " Provide UI Grid ID, it is Missing.";

		//Please select the customer to get Billto.
		public static PleaseSelecttheCustomerToGetBillTo: string = "Please select the customer to get Bill To";

		//Do you really want to delete this Attached File?
		public static DoYouReallyWantToDeleteThisAttachedFile: string = "Do you really want to delete this Attached File?";

		//Do you really want to remove this Attached File?
		public static DoYouReallyWantToRemoveThisAttachedFile: string = "Do you really want to remove this Attached File?";

		//Do you really want to delete this vendor bill item?
		public static DoYouReallyWantToDeleteThisvendorBillItem: string = "Do you really want to delete this Vendor Bill item?";

		//Do you really want to delete this Purchase Order Item?
		public static DoYouReallyWantToDeleteThisPurchaseOrderItem: string = "Do you really want to delete this Unmatched Vendor Bill Item?";

		//Do you really want to delete this sales Order item?
		public static DoYouReallyWantToDeleteThisSalesOrderItem: string = "Do you really want to delete this Sales Order item?";

		//Upload File Only for Image And PDF
		public static MessageForOnlyImageAndPdfFile: string = "Only Files with type Image and Pdf document are allowed to be uploaded";

		//Upload File Only for Image And PDF
		public static MessageForOnlyCSVAndXLSFile: string = "Only Files with type CSV and EXCEL document are allowed to be uploaded";

		//Upload File Only For Images
		public static MessageForOnlyImagesFile: string = "Only Files with type Image are allowed to be uploaded";

		//Upload File only for PDF and Word Document
		public static MessageForOnlyPDFandWordDocument: string = "Only Files with type pdf and word document are allowed to be uploaded";

		//Do you really want to delete this sales Order item?
		public static AreYouSureWantToRemoveThis: string = "Are you sure want to remove this?";

		//Do you really want to delete this sales Order item?
		public static DeleteThisSalesOrderPodDocList: string = "Deleted Sales Order POD/DOC List Items";

		//Upload SuccessFully
		public static UplodedSuccessFully: string = "Document have uploaded successfully";

		//Are you sure you want to delete this record
		public static AreYouSureYouWantToDeleteThisRecord: string = "Are you sure you want to delete this record";

		//Changing The Shipment To International Will Result In Shipper And Consignee Details Being Reset.  Would you like to continue?
		public static ChaningInternationalShipment: string = "Changing The Shipment To International Will Result In Shipper And Consignee Details Being Reset.  Would you like to continue?";

		// Valid from date required
		public static ValidFromDateRequired: string = " A valid From Date is required";

		// Valid to date required
		public static ValidToDateRequired: string = " A valid To Date is required";

		// Cost required
		public static CostRequired: string = "Cost is required";

		// Revenue required
		public static RevenueRequired: string = "Revenue is required";

		// Description Required
		public static DescriptionRequired: string = "Description is required";

		// ###START: US25117
		// packingGroup
		public static PackingGroupRequired: string = "Please choose Packing Group";

		// ###END: US25117
		// hazmatClass
		public static HazmatClassRequired: string = "HazmatClass is required";

		// ###START: DE24699
		// hazardousClass value should be between 0 and 9
		public static HazmatClassMinMax: string = "HazmatClass value should be between 1 and 9";

		// ###END: DE24699

		// hazmatUnNumber
		public static HazmatUnNumberRequired: string = "HazmatUNNo is required";

		// Choose Item Type
		public static ChooseItemType: string = "Please Choose Item Type";

		// Choose Class Type
		public static ChooseClass: string = "Please Choose Class";

		// Choose Class Type
		public static ChoosePackageType: string = "Please Choose Package Type";

		// Choose Class Type
		public static weight: string = "Please Choose Weight";

		// Choose Class Type
		public static pieceCount: string = "Please Choose Piece Count";

		// Choose Class Type
		public static palletCount: string = "Please Choose Pallet Count";

		// EnterCompanyName
		public static EnterCompanyName: string = "Enter Company Name";

		//Record Updated Successfully
		public static RecordUpdatedSuccessfully: string = "Record Updated Successfully";

		//Record Saved Successfully
		public static RecordSavedSuccessfully: string = "Record Saved Successfully";

		// Minimum Characters Required.
		public static MinimumCharactersRequired: string = "Minimum 3 characters required";

		//Error occurred while fetching Bills list.
		public static ErrorOccurredWhileFetchingBillsList: string = "Error occurred while fetching Bills list";

		//Error occurred while fetching Invoice list.
		public static ErrorOccurredWhileFetchingInvoiceList: string = "Error occurred while fetching Invoice list";

		//Error occurred while fetching TruckLoadQuote# list.
		public static ErrorOccurredWhileFetchingTruckLoadQuoteList: string = "Error occurred while fetching TruckLoadQuote list";

		//For checking this message from server
		public static VendorBillSavedButMatchingProcessNotWorking: string = "Vendor Bill saved successfully but matching process is not working. Please try after some time";
		//Pro Exists
		public static PROExists: string = "PRONo entered in the PO is already used by other Sales order,Order cannot be created.Please change the PRONO and try again";

		// To select the customer
		public static SelectCustomer: string = "Please Select the Customer";

		// Created Sales Order successfully message
		public static CreatedSalesOrderSuccessfullyMessage: string = "Created Sales Order successfully";

		// ###START: US22471
		// Created Sales Order successfully message
		public static MailSentSuccessfullyMessage: string = "Mail sent successfully!";
		// ###END: US22471

		// Error Message For Saving the user theme
		public static ErrorWhileSavingUserTheme: string = "Some error occurred while saving the theme.Please try again";

		//Theme Save Successfully
		public static SavingUserThemeSuccessfully: string = "The information has been updated successfully";

		// To show message before copy the shipment for requested pickup date
		public static ShowRequestedPickupDateMessage: string = "Are you sure you want to make a copy of this Order? The Requested Pickup date will be today. To modify the Requested Pickup date, please update after creating the order";

		//Validation Message For Manually Finalization
		public static ManuallyFinalizedValidation: string = "For Finalization, PRO# and Pick up date should not be empty";

		//Do you want to cancel the sales order
		public static ConfirmCancelSalesOrder: string = "Do you want to cancel the Sales Order?";

		//Cancel Sales Order successfully
		public static CancelSalesOrderSuccessfully: string = "Sales Order has been Cancelled successfully";

		//##START: US20208
		//Sales Order canceled successfully; but the insurance cancellation failed.
		public static CancelSalesOrderSuccessfullyInsuranceCancelFailed: string = "Sales Order canceled successfully; but the insurance cancellation failed.";

		//Sales Order cancellation failed.
		public static CancelSalesOrderFailed: string = "Sales Order cancellation failed.";
		//##END: US20208

		//Do you want to Uncancel the sales order
		public static ConfirmUnCancelSalesOrder: string = "Do you want to Un-Cancel the Sales Order?";

		//Cancel Sales Order successfully
		public static UnCancelSalesOrderSuccessfully: string = "Sales Order has been Un-Cancelled successfully";

		//Cancel Sales Order successfully
		public static SaveSalesOrderNotesSuccessfully: string = "Notes Saved Successfully";

		public static SaveVendorBillNotesSuccessfully: string = "Notes Saved Successfully";

		//Force Invoice Reason
		public static ForceInvoiceReason: string = "Please enter Force Invoice Reason";

		// Shipment Force Invoiced
		public static ShipmentForceInvoiced: string = "Shipment force invoiced";

		// ###START: DE23954
		// Shipment Force Invoice Failed
		public static ShipmentForceInvoiceFailed: string = "Shipment force invoice failed";
		// ###END: DE23954

		//Sales Order Updated
		public static SalesOrderUpdateSuccessful: string = "Sales Order has been Updated successfully";

		//Sales Order Finalixed
		public static SalesOrderFinalizedSuccessful: string = "Sales Order has been Finalized successfully";

		// Please select an item.
		public static PleaseSelectanItem: string = "Please select an item";

		// Please select an PleaseSelectCRRReviewDate.
		public static PleaseSelectCRRReviewDate: string = "CRR Review Date cannot be blank";

		// Rebill saved successfully.
		public static RebillSavedSuccessfully: string = "Rebill saved successfully";

		//Sales Order Saved
		public static SalesOrderSavedSuccessful: string = "Sales Order saved successfully";

		//Sales Order Saved
		public static RecordInsertedSuccessfully: string = "Record inserted successfully";

		//Auto Dispatch Status Message
		public static AutoDispatchMessage: string = "Click Dispatch EDI link to make Auto Dispatch";

		public static SalesOrderNotesValidationMessage = "You have not yet submitted sales order notes. Do you wish to continue without saving the sales order notes?";

		// Valid Credit Charge
		public static ValidCCharge: string = "Invalid credit card charge. Please enter a valid credit card charge";

		// Valid Credit Charge
		public static ValidECharge: string = "Invalid E-Check charge. Please enter a valid E-Check charge";

		//Delete Payment Configuration Details Message
		public static DeletePaymentDetailsMessage: string = "Are you sure you want to remove record from database?";

		// Rebill saved successfully.
		public static AgentDisputeSavedSuccessfully: string = "Agent disputes saved successfully";

		//Error occurred while fetching shipment list.
		public static ErrorOccurredWhileFetchingVBExceptionList: string = "Error occurred while fetching Vendor Bill Exception Details";

		//Error occurred while fetching Finalized Orders With No Vendor Bills.
		public static ErrorOccurredWhileFetchingFinalizedOrders: string = "Error occurred while fetching Finalized Order With No Vendor Bills";

		// To Date should be greater than or equal to From Date
		public static ToValidToDateNotLessThenFromDate: string = 'To Date should be greater than or equal to From Date and till today date';

		//Error occurred while fetching Finalized Orders With No Vendor Bills.
		public static ErrorOccurredWhileFetchingFinalizedNotInvoicedOrders: string = "Error occurred while fetching Sales Orders Finalized Not Invoiced";

		//Error occurred while fetching Rexnord Invoicing Reports.
		public static ErrorOccurredWhileFetchingRexnordInvoicingReport: string = "Error occurred while fetching Rexnord Invoicing Report";

		// ###START: US24323
		//You are creating a Sales Order with cost but no revenue, the Sales Order will be marked as invoiced but it will NOT invoice the customer.
		//public static RevenueIsZeroAndCostIsGreaterThenZero: string = "You are creating a Sales Order with cost but no revenue, the Sales Order will be marked as invoiced but it will NOT be invoiced to customer";
		public static RevenueIsZeroAndCostIsGreaterThenZero: string = "You are creating a SO with cost but no Revenue. The SO will be marked as Scheduled and remain in the same status till Midnight. Post that SO will be invoiced, but it will NOT be Invoiced to Customer. Do you want to continue?";

		// ###END: US24323
		//You are creating a Sales Order with no cost and no revenue, the Sales Order will be Canceled it will NOT invoice the customer.
		public static RevenueIsZeroAndCostIsZero: string = "You are creating a Sales Order with no cost and no revenue, the Sales Order will be Canceled it will NOT be invoiced to customer."

		////##START: DE20749
		//You are creating a Sales Order with cost but no BS Cost, the Sales Order will be marked as invoiced but it will NOT invoice the customer.
		public static BSCostIsZeroAndCostIsGreaterThanZero: string = "You are creating a Sales Order with cost but no BS Cost, the Sales Order will be marked as invoiced but it will NOT be invoiced to customer";
		////##END: DE20749

		//Please enter force invoice reason
		public static selectForceInvoiceReason: string = "Please enter force invoice reason";

		//FAKCannotBeLessThanThreeCharacters
		public static FAKCannotBeLessThanThreeCharacters: string = "FAK Description cannot be less than 3 character";

		//FAKDescriptionRequired
		public static FAKDescriptionRequired: string = "FAK Description is required";

		//FAKDescriptionRequired
		public static FAKItemRequired: string = "Item is required";

		//FAK Mapping Saved Successfully.
		public static FAKSavedSuccessFully: string = "FAK mapping saved successfully";

		//Error occurred while fetching purchase Order list.
		public static ErrorOccurredWhileFetchingPOList: string = "Error occurred while fetching Unmatched Vendor Bill list";

		public static InvoiceStatusRevertBackToPending = "Invoice status reverted to pending";

		//Error occurred while fetching EDI 210 Details.
		public static ErrorOccurredWhileFetchingEDI210CarrierException: string = "Error occurred while fetching EDI 210 Carrier Exception Details";

		//Error occurred while fetching Rebill Summary Report
		public static ErrorOccurredWhileFetchingRebillSummaryReport: string = "Error occurred while fetching Rebill Summary Data";
		//Error occurred while fetching Disputed Vendor Bills.
		public static ErrorOccurredWhileFetchingDisputedVendorBills: string = "Error occurred while fetching Disputed Vendor Bills";

		//Error occurred while fetching Re Bill Reasons Report Data.
		public static ErrorOccurredWhileFetchingReBillReasonsReport: string = "Error occurred while fetching Re Bill Reasons";

		//Error occurred while fetching weekly dashboard details.
		public static ErrorOccurredWhileFetchingWeeklyDashboardReport: string = "Error occurred while fetching Weekly Dashboard details";

		//Error occurred while fetching Lost cost details.
		public static ErrorOccurredWhileFetchingLowestCostReport: string = "Error occurred while fetching lowest cost carrier details";

		//Error occurred while fetching Post Audit Report
		public static ErrorOccurredWhileFetchingRexnordPostAuditReport: string = "Error occurred while fetching Post Audit Data";

		//Error occurred while Order Will Not Be Finalized
		public static OrderWillNotBeFinalized: string = "The current order will not be finalized with a reduction in margin";

		//Toaster message if carrier Not mapped
		public static CarrierNotMapped: string = "Carrier not mapped in MAS";

		//Error occurred while PRO# should not be empty
		public static ProShouldNotBeEmpty: string = "PRO# should not be empty";

		// ###START: US19330
		//Message while exception is resolved
		public static applicationResolved: string = "Record has been updated in EDI Tables";
		// ###END: US19330

		// ###START: US19330
		//Message while exception is not resolved
		public static applicationNoResolved: string = "Entered BOL is Canceled/Invalid. System cannot reprocess it";
		/// ###END: US19330

		//Message EDI successFully changed to inactive
		public static ChangeEDIToInactive: string = "EDI marked as inactive";

		//Message EDI does not successFully changed to inactive
		public static ChangeEDIToInactiveErrorMessage: string = "EDI is not marked as inactive";

		//Message EDI does not successFully changed to inactive
		public static UpdatedEDIForPro: string = "Changes Saved for ProNumber ";

		//Message Total revenue cannot be less than total cost.
		public static TotalRevenueCannotbelessthantotalcost: string = "Total revenue cannot be less than total cost";

		//Message Total BS cost cannot be less than total cost.
		public static TotalBScostcannotbelessthantotalcost: string = "Total BS cost cannot be less than total cost";

		//Message Total PLC cost cannot be less than total cost.
		public static TotalPLCcostcannotbelessthantotalcost: string = "Total PLC cost cannot be less than total cost";

		//Message for confirum vendor Name.
		public static confirmVendorName: string = "Did you confirm the vendor Name?";

		//Message for Bill has sent for Process after create sub bill in EDI210.
		public static billhasSentForProcess: string = "Bill has been sent to Process";

		//Message for Valid Tolerance Amount.
		public static ValidToleranceAmountIsRequired: string = "A valid Tolerance Amount is required";

		//Message for No Original bill found in EDI.
		public static NoOriginalBillFound: string = "No original bill found, so this bill has been sent to process";

		// Message to handle to show a message when dispute amount is negative.
		public static DisputeAmountShouldNotBeNegative: string = "Total dispute amount cannot be negative or zero value";

		// Message to notify the user to convey that association was removed between the SO and PO
		public static VendorBillIsNowPO: string = "VendorBill is no longer associated with a Sales Order. VendorBill is now an Unmatched Vendor Bill";

		// Vendor Bill Updated successfully message
		public static UpdatedSuccessfullyMessage: string = "VendorBill updated successfully.  ";

		//Validation Message Rexnord Manager, If tries to force attach with Non-Rexnord Bol
		public static ValidationForNonRexnordBol: string = "Permission denied. Entered BOL Number either Cancelled/Invalid";

		//Validation Message ForeignBolAddressSuccess
		public static ForeignBolAddressSuccess: string = "Address saved successfully";

		//Validation Message ForeignBolACustomerSettings
		public static ForeignBolCustomerSettingsSuccess: string = "Customer settings saved successfully";

		//Do you really want to delete this Foreign Bol Customer?
		public static AreYouSureWantToRemoveForeignBolCustomer: string = "Choose the action which need to be performed to Disassociate Customer and <br\> ";

		//sucessfull UnMapped
		public static sucessfullUnMapped: string = "Successfully Unmapped customer";

		//sucessfull UnMapped Associated Address and Deleted Customer
		public static sucessfullUnMappedAndDeletedCustomer: string = "Successfully Unmapped customer and Deleted address";

		//Dissociate UVB as Foreign BOL Customer
		public static DissociatePoAsFBOL: string = "Do you want to dissociate the UVB as FBOL?";

		//Associated UVB as FBOL Customer
		public static AssociatedWithFBOL: string = "Do you want to change the customer associated with the FBOL? ";

		//Dissociated Customer After customer selection change
		public static DissociatedPOAsFBOLOnCustomerChanged: string = "Please choose an action that the system needs to perform <br\> <b> Dissociate Customer &: </b>";

		// AreYouSureWantToDisassociateForeignBolCustomer
		public static AreYouSureWantToDisassociateForeignBolCustomer = "Performing the action will delete the Foreign BOL Customer and will unmap all the associated addresses. Do you want to continue?";

		//Disput Lost item shoud be greater then zero.
		public static DisputLostItemShoudBeGreaterThenZero: string = "Disput Lost Amount shoud be greater then zero";

		//ChangeCostAndRevenue
		public static ChangeCostAndRevenue: string = "Changing the value might change Cost & Revenue. Do you want to proceed. ";

		//RevertChanges
		public static RevertChanges: string = "Changes have been reverted to previous values";

		//Changing The Shipment To International Will Result In Shipper And Consignee Details Being Reset.  Would you like to continue?
		public static ChangingBillToInternationalShipment: string = "Changing The Shipment To International Will Result In Bill To Details Being Reset.  Would you like to continue?";

		//##START: US20264
		//Message to be shown after uploading a Valid CSV file
		public static SuccessMessageForSalesOrderUploadPopup: string = "{0} record(s) uploaded successfully and {1} record(s) have error. Please correct the same on UI and reprocess those again";

		//Records uploaded Message for sales order
		public static SuccessMessageForSOUploadToastr: string = " records were uploaded successfully";

		public static ParameterNotFoundForDisputeWithCarrierLink: string = " value not found. Please update the same and try clicking the hyperlink again";
		//##END: US20264

		// ##START: US20961
		//message when a dispute status is changed for VB that has moved to mas already
		public static DisputeStatusSavedSuccessfully: string = "Vendor Bill State was saved successfully";
		// ##ENd: US20961

		// ###START: US20884
		// LostBill Validation
		public static LostBillCostValidation: string = "Total Lost bill cost cannot be more than Revenue of the order.";
		// ###END: US20884

		// ###START: DE21956
		// FinalizedOrdersReport Date Validation
		public static FinalizedOrdersReportDateValidation: string = "Differnce between From Date and To Date cannot be greater than 3 years.";
		// ###END: DE21956

		// ###START: DE22808
		// Saved successfully message When Matching Process is failed
		public static SavedSuccessfullyMessageThoughMatchingProcessFailed: string = "VendorBill saved successfully. But there is some processing lag.";

		// ###END: DE22808

		// ###START: US22471
		public static MailFailureMessage: string = "Mail not sent. Try again in sometime";
		// ###END: US22471

		// ###START: US22955
		// Required message to be shown for the BOLNumber field on the SO Cancel Reason popup
		public static BOLNumberIsRequired: string = "BOL Number is required";

		// Placeholder for "Order Cancelled by Customer" reason
		public static CancelReason_OrderCancelledByCustomer: string = "BOL {0} is canceled by {1} from Accounting Center. Reason: Order canceled by the Customer."

		// Placeholder for "New Sales Order created" reason
		public static CancelReason_NewSalesOrderCreated: string = "BOL {0} is canceled by {1} from Accounting Center. Reason: New Sales Order (BOL# {2}) created."
		// ###END: US22955

        // ###START: US23124
        // Memo and notes Saved successfully message
        public static SavedSuccessfullyMessageNotes: string = "Notes added successfully";
		// ###END: US23124

		// ###START: DE23551
		// Zero Records uploaded Message
		public static ZeroRecordsUploadedMessage: string = " Records uploaded";
		// ###END: DE23551

		// ##START: US24671
		// 'Base Rate' can't be added more than once for TL orders in PO to SO and TL edit
		public static BaseRateCantBeAddedMultipleTimes: string = "TL shipment doesn't support multiple Base Rate";
		// ##END: US24671
		// ###START: DE24438
		// Message to be shown when insurance item is added from ACT
		public static InsuranceItemsCantBeAddedToTLOrdersFromAccounting: string = "Insurance Line Item cannot be added from Accounting";
		// ###END: DE24438

		// ###START: US24647
		// Record has already been changed Message
		public static RecordAlreadyChanged: string = "Record has already been changed while you were working on it. Please give us a moment to Reload the latest saved data";
		// ###END: US24647


		// ###START: US24865
		// Message to be shown when insurance item is added from ACT
		public static DisputeEmailSubject: string = "GlobalTranz Dispute PRO ({proNumber}) BOL ({bolNumber}) ({carrierName})";
		// ###END: US24865

		// ###START: US24865
		// Validation message to be shown when user doesn't select a Dispute Template in Dispute Email popup
		public static PleaseChooseDisputeTemplate: string = "Please select a Dispute Template";
		// ###END: US24865

		// ###START: US24871
		// Sucess message while sending Dispute Email
		public static MailSentSuccessfullyDispute: string = "Mail Sent Successfully";

		// Sucess message while sending Dispute Email
		public static MailFailureMessageDispute: string = "There was problem sending the E-Mail. Please try after sometime";
		// ###END: US24871

		// ###START: US25277
		// Credit Revenue
		public static CreditReasonRequired: string = "Please choose Credit Reason.";

		// Credit Memo DisputeWon SelectSO
		public static CreditMemoDisputeWonSelectSO: string = "Please choose Sales Order.";

		// Success message for saving the Credit Request
		public static CreditMemoRequestSuccessMessage: string = "Your request for Credit Memo is raised.";

		// Failure message for saving the Credit Request
		public static CreditMemoRequestFailureMessage: string = "There was some error processing your request. Please try after some time.";

		// ###END: US25277

		// ###START: US26001
		// Credit Memo Request Cannot be raised for 0$
		public static CreditMemoRequestCanNotBeRaisedMessage: string = "Credit Memo request cannot be raised for $0 value in Customer and Vendor Credit Amount.";
		// ###END: US26001

		// ###START: US25587
		// Header toaster message for Un-Cancell SO  
		public static UnCancelInsuredAmount: string = "Insurance will be removed on Un - Canceling this sales order.If insurance is desired on this shipment, create a new sales order.Would you like to remove insurance and un - cancel this sales order?";
		// ###END: US25587

		// ##START: US25684
		// validation message on vb reassignment popup
		public static ReassignmentReasonRequired: string = "Reassignment reason is required";

		// validation message on vb reassignment popup
		public static ReassignSOIsRequired: string = "SO# is Required";

		// validation message on vb reassignment popup
		public static PleaseSelectRadioCustomerCredit: string = "Please select an option";

		// validation message on vb reassignment popup
		public static PleaseSelectOrderToCredit: string = "Please select an order to credit";

		// validation message on vb reassignment popup
		public static AmountToCreditIsRequired: string = "Amount is required";

		// error message for saving reassignment
		public static ErroWhileSavingReassignment: string = "There was some error in processing your request. Please try again in sometime";

		// message for entering BOL which doesn't exist on reassignment popup
		public static ReassignBOLDoesntExist: string = "BOL entered doesn't exist. Please try again with a valid BOL#";

		// when reassignment is requested for already reassigned vb
		public static PendingReassignmentRequestExistsForVB: string = "The VB you are trying to change has already been edited. Please hold on while we refresh for you.";

		//success  message for saving reassignment
		public static ReassignmentDetailsSavedSuccessfully: string = "Reassignment details saved successfully";

		// message to be shown on toastr if there is a negative margin
		public static ConfirmationMessageToastrReassignment: string = "This Vendor bill is being requested to be moved to a Sales Order which does not contain enough Revenue to cover the Vendor Bill Cost.  This will result in a negative margin of {cost_difference} do you want to proceed?";

		// error message on reassign tooltip when same bol as the bill is entered
		public static ReassignSOCantBeSameAsCurrentSO: string = "Reassign SO# cannot be same as the Current Paired SO#";

		// error message when the entered credit amount is greter than order's revenue
		public static EnterdCreditAmountCantBeMoreThanRevenue: string = 'Entered Amount cannot be greater than SO Revenue';

		// ##END: US25684

		// ###START: DE25057   
		// error message when the empty quote number search in Transaction
		public static ValidTruckLoadQuoteRequired: string = 'QuoteNumber is Required';
		// ###END: DE25057   

		// ###START: US25843
		// Success message for VB Reassignment Process for credit request
		public static CreditMemoRequestSuccessFromVBReassignment: string = "Credit Memo request is raised successfully.";
		// ###END: US25843

		// ###START: US25941   
		// error message when the empty Vendor Credit Amount
		public static VendorCreditAmountRequired: string = 'Vendor Credit Amount is required';


		// error message when the Vendor Credit Amount Zero
		public static VendorCreditAmountZeroRequired: string = 'Vendor Credit Amount must be greater than $0';
		// ###END: US25941   

		// ###START: DE25495
		public static ValidateVendorCreditAmount: string = 'Vendor Credit cannot be greater than Final Cost';

		// ###END: DE25495

		// ###START: US26955
		public static ReassignCanceledOrderToastrMessage: string = 'Entered SO is cancelled. Please try again with a valid SO.';

		public static ReassignedOrderInsufficientCostMessage: string = "Entered SO doesn't have the sufficient cost on it. Please account for the difference and try again. SO#";
		// ###END: US26955

		// ###START: US27159
		public static TLOrderCannotBeScheduledAsOrderNotComplete: string = "TL Order that you are trying to schedule is incomplete. Please complete the order from CC and try scheduling again.";

		// ###END: US27159

		// ###START: US27614
		public static CannotReassignVendorBillToSubSo: string = "VB cannot be attached with a sub-so. Raise the request with main SO# and try again.";

		// ###END: US27614

		public static SONotScheduledForQuickerProcessScheduleTheOrder = "The Sales Order that you are trying to move the Vendor-Bill to is not scheduled. For quicker processing of your request, it is advised to schedule the SO. Please wait while we fetch the Order.";

		// If sub order typed in BOL Number field of Bill or UVB
		public static SubOrderCantBeAttachedBill: string = "Please enter a main order's BOL Number";
	}
	//#endregion UI Constants
}