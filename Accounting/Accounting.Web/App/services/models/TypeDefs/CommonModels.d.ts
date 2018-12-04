/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: April 4, 2013 */
/* Created By Sankesh Poojari*/
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

/*
** <summary>
** Common model interface to set interface for all common method
** </summary>
** <createDetails>
** <id></id> <by></by> <date></date>
** </createDetails>
** <changeHistory>
** <id>US20352</id> <by>Chandan Singh Bajetha</by> <date>14-01-2016</date> <description>Acct: Adjust UI for Dispute Notes Tab in Vendor Bill</description>
** <id>US21085</id> <by>Janakiram</by> <date>31-03-2016</date> <description>Added csv, Excel Download for sales order, Invoices, Bills, Truck Load Quote</description>
** <id>US23631</id> <by>Shreesha Adiga</by> <date>04-08-2016</date> <description>Added HasAccessToManagersReportInDashboard to IUser</description>
** <id>US25313</id> <by>Dhaval Tamhane</by> <date>25-10-2016</date> <description>Changes to export functionality of transaction grid</description>
** </changeHistory>
*/
interface IButtonControlOption {
	name: string;
	id: number;
	selected: boolean;
	enabled?: boolean;
	iconClassName?: string;
	isIconButton?: boolean;
	showTooltip?: boolean;
	tooltip?: KnockoutTooltip;
}

interface IEnumValue {
	ID: number;
	Value: string;
}

interface IKeyValue {
	Key: string;
	Value: string;
}

interface IKeyValueContainer {
	key: string;
	value: {};
}

interface ICustomer {
	UserId: number;
	UserName: string;
	CustomerId: number;
	IsDeleted: boolean;
	ChatUserName: string;
	ChatPassword: string;
	ContactName: string;
	Logo: string;
	CompanyName: string;
	IsAccountAdmin: boolean;
	IsOfficeAdmin: boolean;
	IsFinancialUser: boolean;
	IsStandardUser: boolean;
}

interface IUser {
	UserId: number;
	GlobalOSUserId: number;
	GlobalNetUserId: number;
	PartnerCompanyId: number;
	AgencyName: string;
	UserName: string;
	Password: string;
	Email: string;
	FirstName: string;
	MiddleName: string;
	LastName: string;
	FullName: string;
	MessagingEmailAddress: string;
	IsRexnordManager: boolean;
	// ##START: US23631
	HasAccessToManagersReportInDashboard: boolean;
	// ##END: US23631
}

interface IOptionButtonModel {
	name: KnockoutObservable<string>;
	id: number;
	selected: KnockoutObservable<boolean>;
	enabled: KnockoutObservable<boolean>;
	isIconButton: KnockoutObservable<boolean>;
	iconClassName: KnockoutObservable<string>;
	html: KnockoutComputed<string>;
	showTooltip: KnockoutObservable<boolean>;
	tooltip: KnockoutObservable<KnockoutTooltip>;
	getTrackChange: () => string[];
	isDirty: () => boolean;
}

/**
* Defined argument types, used for date filter control creation.
*/
interface IDateFilterOption {
	/**
	* Flag to set custom date range picker or default date filter.
	* Default value will be true[shows default date filter template control]
	*/
	useCustomDateRangePicker?: boolean;
	/**
	* Time frame collection from DateFilterTimeFrame enum.
	*/
	timeframeList?: Array<IEnumValue>;
	/**
	* Aging time frame collection from DateFilterAgingTimeFrame enum.
	*/
	agingtimeframeList?: Array<IKeyValue>;
	/**
	* Date type collection from DateFilterDateType enum.
	*/
	datetypeList?: Array<IEnumValue>;
	/**
	* Set true or false to show or hide time frame option control.
	*/
	showTimeframeOption?: boolean;
	/**
	* Set true or false to show or hide single date option control.
	*/
	showSingleDateOption?: boolean;
	/**
	* Set true or false to show or hide date range option control.
	*/
	showDateRangeOption?: boolean;
	/**
	* Set true or false to show or hide aging option control.
	*/
	showAgingOption?: boolean;
	/**
	* Set true or false to show or hide date type option control.
	*/
	showDateTypeOption?: boolean;
	/**
	* Set true or false to show or hide Go/Submit button.
	*/
	showGoButton?: boolean;
	/**
	* Button name to show in the date filter control.
	*/
	buttonName?: string;
	/**
	* To set the default time frame to selected.
	*/
	defaultTimeFrameSelected?: IEnumValue;
	/**
	* Set the default aging to selected.
	*/
	defaultAgingTimeframe?: IKeyValue;
	/**
	* To set the default date type to selected.
	*/
	defaultDateTypeSelected?: IEnumValue;
	/**
	* To set true to handle smart insertions of alternate timeframes like when current date is on 1st day of WTD, remove WTD add Last WTD
	*/
	enableSmartTimeFrames?: boolean;
}

interface IDateFilterType {
	None: number;
	Timeframe: number;
	SingleDate: number;
	DateRange: number;
	AgingTimeframe: number;
	DateRangePicker: number;
}

/**
* Defined argument types, used for date filter control selection change or on click callback events.
*/
interface IDateFilterArguments {
	/**
	* Selected from date.
	*/
	fromDate: string;
	/**
	* Selected to date.
	*/
	toDate: string;
	/**
	* Selected aging id.
	*/
	selectedAging: string;
	/**
	* Selected date type id.
	*/
	selectedDateType: number;
	/**
	* Selected filter type id.
	*/
	selectedFilterType: number;
	/**
	* Selected enum's id value .
	* Assign the enum's id of IEnumValue type object.[like AgingTimeframe]
	*/
	selectedValueId?: number;
	/**
	* Selected enum's key value .
	* Assign the enum's key of IKeyValue type object.[like AgingTimeframe]
	*/
	selectedValueKey?: string;
}

interface KnockoutTooltip {
	/**
	* Title value for the control
	*/
	title: string;
	/**
	* How to position the tooltip --> top | bottom | left | right
	*/
	placement?: string;
	/**
	* How tooltip is triggered --> click | hover | focus | manual.
	* Note: You can pass multiple trigger types, separated by space (E.g. click hover).
	*/
	trigger?: string;
}

interface IOptionButtonControlArgs {
	options: Array<IButtonControlOption>;
	useHtmlBinding: boolean;
	isMultiCheck?: boolean;
	isVerticalView?: boolean;
	isOnOffRadioButton?: boolean;
	verticalControlSpace?: string;
	isIconButton?: boolean;
	allowTrackChange?: boolean;
}

//Interface for Top Carrier Template
interface ITopCarrierWidgetOptions {
	/**
	* Name of the Caption to be visible on the Template
	*/
	Caption: string;
	/**
	* Name of the Sub-Caption to be visible on the Template
	*/
	SubCaption: string;
	/**
	* Whether the Total Spend is visible ot not
	*/
	IsSpendVisible: boolean;
	/**
	* Whether the ShipmentCount is visible ot not
	*/
	IsShipmentCountVisible: boolean;
	/**
	* Whether the CarrierName is visible ot not
	*/
	IsCarrierNameVisible: boolean;
	/**
	* Whether the Ranking is visible ot not
	*/
	IsRankingVisible: boolean;
}

//Interface for Top Carrier Template
interface ITopCarrierTemplateDataOptions {
	/**
	* Name of the Logo to be visible on the Template
	*/
	LogoFileName: string;
	/**
	* Name of the Carrier to be visible on the Template
	*/
	CarrierName: string;
	/**
	* Total Spend
	*/
	TotalSpend: string;
	/**
	* ShipmentCount
	*/
	ShipmentCount: string;
}

//Interface for common DialogBox
interface IMessageBoxButtonOption {
	/**
	* Name of the Button to be visible on the dialog box
	*/
	name: string;
	/**
	* Id of the Button on the dialog box . This should be in the incremental order.
	*/
	id: number;
	/**
	* CallBack Method : can perform the actions here when a button on the Dialog Box is clicked.
	* It returns boolean value . Return 'True' to the close the dialog after the callback functionalities are performed.
	*/
	callback?: (data: any) => boolean;
}

//Interface for common DialogBox
interface IMessageBoxOption {
	/**
	* Button Options for the Dialog Box
	*/
	options?: Array<IMessageBoxButtonOption>;
	/**
	* Dialog Box message to be displayed
	*/
	message: string;
	/**
	* Dialog Box Title
	*/
	title: string;
	/**
	* Dialog Box binding type
	*/
	ishtmlBinding?: boolean;
	/**
	* Dialog Box binding object
	*/
	bindingObject?: any;
	/**
	* Dialog Box margin messaget
	*/
	marginPrecentageMessage?: string;
	/**
	* Dialog Box header message
	*/
	headerMessage?: string;
}

interface IWidgetPopupOption {
	/**
	* Dialog Box message to be displayed
	*/
	message: string;
	/**
	* Dialog Box binding object
	*/
	bindingObject?: any;
	/**
	* Route name to navigate from dialog box.
	*/
	navigateTo?: string;
}

interface IMapLocation {
	Street: string;
	City: string;
	StateCode: string;
	State: string;
	Zip: string;
	CountryCode: number;
	Country: string;
	Zone: string;
	CountyAbbreviation: string;
	Latitude: number;
	Longitude: number;
	Display: string;
	IsEmpty?: () => boolean;
}

// Define interface for Shipment types
interface IShipmentItemType {
	ItemId: string;
	LongDescription: string;
	ShortDescription: string;
	AccessorialId: number;
	AccessorialDescription: string;
	ItemClassId: string
}

// ###START: US20352
// Define interface for Shipment types
interface IDisputeStatus {
	ID: number;
	DisputedStatus: string;
}
// ###END: US20352

//#region Enum Models
interface ICountryCode {
	USA: IEnumValue;
	Canada: IEnumValue;
	China: IEnumValue;
	Mexico: IEnumValue;
}

interface IGuaranteedTime {
	By5PM: IEnumValue;
	BY530PM: IEnumValue;
	BY600PM: IEnumValue;
	BY630PM: IEnumValue;
	BY700PM: IEnumValue;
	BY730PM: IEnumValue;
	BY800PM: IEnumValue;
	BY830PM: IEnumValue;
	BY900PM: IEnumValue;
	BY600AM: IEnumValue;
	BY630AM: IEnumValue;
	BY700AM: IEnumValue;
	BY730AM: IEnumValue;
	BY800AM: IEnumValue;
	BY830AM: IEnumValue;
	BY900AM: IEnumValue;
	BY930AM: IEnumValue;
	BY1000AM: IEnumValue;
	BY1030AM: IEnumValue;
	BY1100AM: IEnumValue;
	BY1130AM: IEnumValue;
	BY1200PM: IEnumValue;
	BY1230PM: IEnumValue;
	BY100PM: IEnumValue;
	BY130PM: IEnumValue;
	BY200PM: IEnumValue;
	BY230PM: IEnumValue;
	BY300PM: IEnumValue;
	BY330PM: IEnumValue;
	BY400PM: IEnumValue;
	BY430PM: IEnumValue;
}

interface IVendorBillOptionConstant {
	/**
	*Make Inactive
	*/
	MakeInactive: number;

	/**
	*FroceAttach
	*/
	FroceAttach: number;

	/**
	*Quickpay
	*/
	Quickpay: number;

	/**
  *HoldVendorBill
  */
	HoldVendorBill: number;

	/**
  *PoToSoCreation
  */
	PoToSoCreation: number;

	/**
  *IsReviewed
  */
	Reviewed: number;

	/**
  *FAKMapping
  */
	FAKMapping: number;

	/**
 *ForeignBolMapping
 */
	ForeignBolMapping: number;
}

interface IOnlinePaymentOptionConstant {
	/**
	*AllowCC
	*/
	AllowCC: number;

	/**
	*AllowECheck
	*/
	AllowECheck: number;

	/**
	*AllowDebitCard
	*/
	AllowDebitCard: number;
}

interface IForeignBolOptionConstant {
	/**
	*ShipperAddress
	*/
	ShipperConsigneeAddress: number;

	/**
	*BillToAddress
	*/
	BillToAddress: number;

	/**
	*EDIBOLLength
	*/
	EDIBOLLength: number;

	/**
	*BOLStartsWithCharacter
	*/
	BOLStartsWithCharacter: number;
}

interface INoteType {
	UserNotes: number;
	ShipmentDispatchNotes: number;
	ShipmentCancelNotes: number;
	Communication: number;
	Dispute: number;
	Information: number;
	Invoice: number;
	TruckloadDispatchNotes: number;
	Quotes: number;
	ReceipentQuotes: number;
	Shipper: number;
	Consignee: number;
	Transit: number;
	Agent: number;
	Internal: number;
	RateConfirmation: number;
	BOL: number;
	Problem: number;
	Miscellaneous: number;
	Driver_Dispatcher_Information: number;
	Transit_Internal: number;
	From_Agent: number;
	From_CarrierRate: number;
}

interface IPackageType {
	Pallet40x48: IEnumValue;
	PalletNonStandard: IEnumValue;
	Bags: IEnumValue;
	Bales: IEnumValue;
	Boxes: IEnumValue;
	Bunches: IEnumValue;
	Carpets: IEnumValue;
	Coils: IEnumValue;
	Crates: IEnumValue;
	Cylinder: IEnumValue;
	Drums: IEnumValue;
	Pails: IEnumValue;
	Reels: IEnumValue;
	Rolls: IEnumValue;
	TubesPipes: IEnumValue;
	Loose: IEnumValue;
	Bundles: IEnumValue;
	Tote4x4: IEnumValue;
}

interface IRecordType {
	User: IEnumValue;
	Roles: IEnumValue;
	Securables: IEnumValue;
	Customers: IEnumValue;
	Carriers: IEnumValue;
	Invoices: IEnumValue;
	SalesOrder: IEnumValue;
	VendorBill: IEnumValue;
	PalletCarrier: IEnumValue;
	Truckload: IEnumValue;
	Claim: IEnumValue;
	PurchaseOrder: IEnumValue;
	PLCVendorBill: IEnumValue;
	PLC: IEnumValue;
	TruckloadCarriers: IEnumValue;
	LTLQuote: IEnumValue;
}

interface ICarrierRateNoteType {
	UserNotes: IEnumValue;
	ShipmentDispatchNotes: IEnumValue;
	ShipmentCancelNotes: IEnumValue;
	Communication: IEnumValue;
	Dispute: IEnumValue;
	Information: IEnumValue;
	Invoice: IEnumValue;
	TruckloadDispatchNotes: IEnumValue;
	Quotes: IEnumValue;
	RecipientQuotes: IEnumValue;
	Shipper: IEnumValue;
	Consignee: IEnumValue;
	Transit: IEnumValue;
	Agent: IEnumValue;
	Internal: IEnumValue;
	RateConfirmation: IEnumValue;
	BOL: IEnumValue;
	Problem: IEnumValue;
	Miscellaneous: IEnumValue;
	DriverDispatcherInformation: IEnumValue;
	TransitInternal: IEnumValue;
	FromAgent: IEnumValue;
	FromCarrierRate: IEnumValue;
	ProblemResolution: IEnumValue;
	CarrierOffer: IEnumValue;
	TransitExternal: IEnumValue;
	DispatchDriver: IEnumValue;
	PickupRemark: IEnumValue;
	DeliveryRemark: IEnumValue;
}

interface IAccessibility {
	Private: number;
	SharedAll: number;		// DEFAULT value
	ReadOnlyAll: number;
	SharedOffice: number;
	ReadOnlyOffice: number;
}

interface ICustomerTransactionType {
	Open: IEnumValue;
	Closed: IEnumValue;
	PastDue: IEnumValue;
	All: IEnumValue;
}

interface IDateFilterTimeFrame {
	Today: IEnumValue;
	WTD: IEnumValue;
	LastWeek: IEnumValue;
	MTD: IEnumValue;
	Last4Weeks: IEnumValue;
	Last30Days: IEnumValue;
	LastMonth: IEnumValue;
	Quarter4: IEnumValue;
	Quarter3: IEnumValue;
	Quarter2: IEnumValue;
	Quarter1: IEnumValue;
	LastQuarter4: IEnumValue;
	LastQuarter3: IEnumValue;
	LastQuarter2: IEnumValue;
	LastQuarter1: IEnumValue;
	YTD: IEnumValue;
	Last12Months: IEnumValue;
	LastYear: IEnumValue;
}

interface IDateFilterAgingTimeFrame {
	All: IKeyValue;
	Current: IKeyValue;
	ThirtyOneToSixtyDays: IKeyValue;
	SixtyOneT0NintyDays: IKeyValue;
	NintyOnePlusDays: IKeyValue;
}

interface IDateFilterDateType {
	DefaultDate: IEnumValue;
	RequestedPUDate: IEnumValue;
	ActualPUDate: IEnumValue;
	EstimatedDeliveryDate: IEnumValue;
	ActualDeliveryDate: IEnumValue;
	InvoicedDate: IEnumValue;
}

interface IAlternateTimeFrame {
	fromDate: Date;
	toDate: Date;
	daysBetweenTodayAndFromDate: number;
	daysBetweenFromAndToDates: number;
}

interface IReportModeOptions {
	modeList: Array<IEnumValue>;
	/**
	 *To set the default mode as selected
	 */
	defaultModeSelected?: number;
}

/*
<changeHistory>
<id>US25144</id> <by>Shreesha Adiga</by><date>13-10-2016</date><description>Added CenterAlignCurrencyTemplate</description>
</changeHistory>
*/
interface IGridCellFormatType {
	DefaultTemplate: IEnumValue;
	LeftAlignPercentTemplate: IEnumValue;
	LeftAlignTemplate: IEnumValue;
	LeftAlignCurrencyTemplate: IEnumValue;
	RightAlignPercentTemplate: IEnumValue;
	RightAlignTemplate: IEnumValue;
	RightAlignCurrencyTemplate: IEnumValue;
	RightAlignAndNegativeCurrencyTemplate: IEnumValue;
	RightAlignPoundTemplate: IEnumValue;
	CenterAlignTemplate: IEnumValue;
	CenterAlignBooleanTemplate: IEnumValue;
	// ##START: US25144
	CenterAlignCurrencyTemplate: IEnumValue;
	// ##END: US25144
	BillStatusTextTemplate: IEnumValue;
	MasClearanceStatusTemplate: IEnumValue;
	ModeTextTemplate: IEnumValue;
	DateFormatTemplate: IEnumValue;
}

interface IFinancialTranType {
	All: IKeyValue;
	CreditMemo: IKeyValue;
	Invoice: IKeyValue;
	DebitMemo: IKeyValue;
	Payments: IKeyValue;
	UnappliedAmount: IKeyValue;
}

interface IFinancialTranStatus {
	Open: IKeyValue;
	Closed: IKeyValue;
	PastDue: IKeyValue;
	ALL: IKeyValue;
}

interface IPaymentOption {
	ExistingCredit: IEnumValue;
	UnappliedFunds: IEnumValue;
	CreditCard: IEnumValue;
	ECheck: IEnumValue;
}

interface IPaymentType {
	FullPay: IEnumValue;
	ShortPay: IEnumValue;
}

interface IShortPayReasonCode {
	OpenDispute: IEnumValue;
	OpenClaim: IEnumValue;
	InvalidCharges: IEnumValue;
}

/**
* Defined argument types, used for date filter control creation.
*/
interface IDateRangeFilterOption {
	/**
	* Time frame collection from DateFilterTimeFrame enum.
	*/
	timeframeList?: Array<IEnumValue>;
	/**
	* Set true or false to show or hide time frame option control.
	*/
	showTimeframeOption?: boolean;
	/**
	* To set the default time frame to selected.
	*/
	defaultTimeFrameSelected?: IEnumValue;
	/**
	* To set true to handle smart insertions of alternate timeframes like when current date is on 1st day of WTD, remove WTD add Last WTD
	*/
	enableSmartTimeFrames?: boolean;
	/**
	* To set true to handle enabling to accept the dates by the user.
	*/
	enableDateSelection?: boolean;
}

/**
* Defined argument types, used for date filter control selection change or on click callback events.
*/
interface IDateRangeFilterArguments {
	/**
	* Selected from date.
	*/
	fromDate: string;
	/**
	* Selected to date.
	*/
	toDate: string;
	/**
	* Selected filter type id.
	*/
	selectedFilterType: number;
	/**
	* Selected enum's id value .
	* Assign the enum's id of IEnumValue type object.[like AgingTimeframe]
	*/
	selectedValueId?: number;
	/**
		* Selected enum's key value .
		* Assign the enum's key of IKeyValue type object.[like AgingTimeframe]
		*/
	selectedValueKey?: string;
}

interface IReportAgingTimeFrameOptions {
	/**
	* Aging time frame collection from DateFilterAgingTimeFrame enum.
	*/
	agingtimeframeList?: Array<IKeyValue>;
	/**
	 *To set the default Aging Time Frame as selected
	 */
	defaultAgingTimeFrameSelected?: string;
}

interface IReportDateTypeOptions {
	/**
	* Date type collection from DateFilterDateType enum.
	*/
	datetypeList?: Array<IEnumValue>;
	/**
	 *To set the default Date Type as selected
	 */
	defaultDateTypeSelected?: IEnumValue;
}

interface IReportDimensionEnumListOptions {
	dimensionItemList?: any;
	/**
	 *To set the default item as selected
	 */
	defaultDimensionSelected?: number;
	dimensionLabel?: string;
	dimensionWatermark?: string;
	resetOtherDimensions?: boolean;
	isCustomColumnHeader?: boolean;
}

interface IReportFilterEnumListOptions {
	filterList?: any;
	/**
	 *To set the default item as selected
	 */
	defaultItemSelected?: number;
	filterDisplayLabel?: string;
	filterWatermark?: string;
	resetOtherFilters?: boolean;
	isCustomColumnHeader?: boolean;
}
interface IReportFilterKeyListOptions {
	filterList?: Array<IKeyValue>;
	/**
	 *To set the default item as selected
	 */
	defaultItemSelected?: string;
	filterDisplayLabel?: string;
	filterWatermark?: string;
	resetOtherFilters?: boolean;
}

//declaration for ko - grid paging option
interface IpagingOptions {
	pageSizes: KnockoutObservableArray<number>
	pageSize: KnockoutObservable<number>
	totalServerItems: KnockoutObservable<number>
	currentPage: KnockoutObservable<number>
}

interface IFilterOptions {
	filterText: KnockoutObservable<string>;
	useExternalFilter: boolean;
}

interface IReportActionButtonOptions {
	buttonName: KnockoutObservable<string>;
	enableOnSingleSelection?: boolean;
	enableOnMultiSelection?: boolean;
	hideWhenUnselected?: boolean;
	isButtonClicked?: boolean;
	enableDisableCallBack?: Function;
	buttonclicked?: void;
	resetselectionOnAction?: boolean;
	isslideButton?: boolean;
}

interface IgridOptions {
	data: KnockoutObservableArray<any>;
	showGroupPanel: boolean;
	enablePaging?: KnockoutObservable<boolean>;
	pagingOptions?: IpagingOptions
	filterOptions?: IFilterOptions
	columnDefs: Array<any>[];
	canSelectRows?: KnockoutObservable<boolean>;
	keepLastSelected?: KnockoutObservable<boolean>;
	displaySelectionCheckbox?: KnockoutObservable<boolean>;
	selectWithCheckboxOnly?: KnockoutObservable<boolean>;
	footerVisible?: KnockoutObservable<boolean>;
	displayFooter?: KnockoutObservable<boolean>;
	showFilter?: boolean;
	triggerRestore?: KnockoutObservable<boolean>;
	resetGridSettingsVisibility?: KnockoutObservable<boolean>;
	showColumnMenu?: boolean;
	enableSaveGridSettings?: KnockoutObservable<boolean>;
	selectedItems: KnockoutObservableArray<any>;
	multiSelect?: boolean;
	footerRowHeight?: KnockoutObservable<string>;
	disableTextSelection?: KnockoutObservable<boolean>;
	isColMenuDisabled?: boolean;
	UIGridID: KnockoutObservable<string>;
	sortInfo: KnockoutObservable<any>;
	enableSelectiveDisplay?: KnockoutObservable<boolean>;
	showPageSize?: KnockoutObservable<boolean>;
	fullDataObject: KnockoutObservableArray<any>;
}

interface IOption {
	title: string;
	selected: boolean;
	visible: boolean;
}

interface IDimensionValue {
	ID: number;
	Value: string;
	DatabaseMapping: string;
}

interface IOutboundDimensions {
	none: IDimensionValue;
	LocationNameOrigin: IDimensionValue;
	ConsigneeName: IDimensionValue;
	CityStateOrigin: IDimensionValue;
	CityStateConsignee: IDimensionValue;
	Mode: IDimensionValue;
	ShipmentClass: IDimensionValue;
	CarrierName: IDimensionValue;
}

interface ITabValues {
	Id: number;
	imageUrl: string;
}
interface ITabType {
	RateTab: ITabValues;
	GridTab: ITabValues;
	DocumentTab: ITabValues;
}

interface IOrderStatus {
	Pending: IEnumValue;
	AutoDispatch: IEnumValue;
	ManualDispatch: IEnumValue;
	ManuallyFinalized: IEnumValue;
	AutoFinalized: IEnumValue;
	WaitingForVB: IEnumValue;
	ReQuote: IEnumValue;
	Canceled: IEnumValue;
	Dispute: IEnumValue;
	Manager_Approval_Needed: IEnumValue;
	Rep_Approval_Needed: IEnumValue;
	Delivered: IEnumValue;
	Delayed: IEnumValue;
	Pickup: IEnumValue;
	Accept: IEnumValue;
	Deny_1: IEnumValue;
	Deny_2: IEnumValue;
	Force_Deny: IEnumValue;
	Shipment_Finalized: IEnumValue;
	InTransit: IEnumValue;
	Dispatch: IEnumValue;
	Booked: IEnumValue;
	Dispatched: IEnumValue;
	OnHandDestination: IEnumValue;
	OutForDelivery: IEnumValue;
	PickupConfirmed: IEnumValue;
	RecoveredfromCarrier: IEnumValue;
	ShipmentCancelled: IEnumValue;
	TenderedtoCarrier: IEnumValue;
	WebEntered: IEnumValue;
}

/// Address Type interface
interface IAddressTypeOption {
	Origin: IEnumValue;
	Destination: IEnumValue;
	BillTo: IEnumValue;
	ThirdPartyBillTo: IEnumValue;
	TerminalOrigin: IEnumValue;
	TerminalDestination: IEnumValue;
	ExelFreightForwarder: IEnumValue;
	OceanFreightForwarder: IEnumValue;
	LTLFreightForwarder: IEnumValue;
}

// Vendor BIll Status
interface IVendorBillStatus {
	Pending: IEnumValue;
	Cleared: IEnumValue;
	Dispute: IEnumValue;
	Requote: IEnumValue;
	LostDispute: IEnumValue;
	ShortPaid: IEnumValue;
	DisputeWon: IEnumValue;
	DisputeLost: IEnumValue;
	DisputeShortPaid: IEnumValue;
	ManualAudit: IEnumValue;
	WaitingForFinalization: IEnumValue;
	OverchargeClaim: IEnumValue;
	OverchargeWon: IEnumValue;
	OverchargeLose: IEnumValue;
}

interface ISaveStatus {
	NoChangesDetected: IEnumValue;
	ChangesDetected: IEnumValue;
	SavingChanges: IEnumValue;
	ChangesSaved: IEnumValue;
}

//** Date range filter. */
interface IDateRange {
	//** Date range for all. */
	All: IEnumValue;

	//** Date range for to day. */
	Today: IEnumValue;

	//** Date range for lastweek. */
	Last_Week: IEnumValue;

	//** Date range for last month. */
	Last_Month: IEnumValue;

	//** Date range for three months. */
	Last_Three_Months: IEnumValue;

	//** Date range for last year. */
	Last_Year: IEnumValue;

	//** Date range for custom. */
	Custom: IEnumValue;
}

interface ISearchResponse {
	VendorBillSearchResults: Array<IVendorBillSearchResult>;
	SalesOrderSearchResults: Array<ISalesOrderSearchResult>;
	Edi210SearchResults: Array<IEdi210SearchResult>;
	// ###START: DE23350
	IsRexnord: boolean;

	// ###END: DE23350
}

interface IVendorBillSearchResult {
	VendorBillId: number;
	PRONumber: string;
	BOLNumber: string;
	BillDateDisplay: string;
	BillStatusDisplay: string;
	Amount: string;
}

interface ISalesOrderSearchResult {
	ShipmentId: number;
	BOLNumber: string;
	PRONumber: string;
	ShipmentType: string;
	OrderStatusDisplay: string;
}

interface IEdi210SearchResult {
	EDIDetailID: number;
	ProNumber: string;
	ExceptionRuleId: number;
	ExceptionDescription: string;
	ProcessAge: number;
	BatchId: number;
}

interface IAgentNotifictionAlertMessageType {
	ID: number;
	Value: string;
}

interface IAgentNotifictionType {
	ID: number;
	Value: string;
}

interface IDataTypes {
	String;
	DateTime;
	Numeric
}

interface IColumnDefinition {
	field: string;
	displayName: string;
	width: number;
	height: number;
	cellTemplate: string;
	type: IDataTypes
}

interface IDocumentRequestModel {
	BolNumber: string;
	InvoiceNumber: string;
	CustomerBolNumber: string;
	PdfHeight: number;
	PdfWidth: number;
}

interface ISearchModel {
	SearchValue: string;
	PageSize: number;
	PageNumber: number;
	SortOrder: string;
	SortCol: string;
	SearchFilterItems: Array<any>;
	VendorName: string;
	ProNumber: string;
	GridViewId: number;
	FromDate: Date;
	ToDate: Date;
	SelectedExceptionRule: number
	ExportType: number;
	CustomerId: number;
	RebillRepName: string;
	ExportURL: string;
	UploadedItem: any;

	// ###STRAT: US21085

	TransactionSearchRequest: any;
	SearchFilterModel: any;

	// ###END: US21085
}

interface IUVBOwnership {
	ID: number;
	Ownership: string;
}

// ###START: US25313
interface IExportJQueryPromise {
	/**
	* Parameter list needed for component service call.
	* Leave is empty if no parameters needed.
	*/
	searchModel: string;

	/**
	* Component service Url.
	*/
	componentUrl?: string;

	/**
	* Exported File name.
	*/
	fileName: string;
}
// ###END: US25313

//#endregion Enum Models