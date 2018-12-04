/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

using System;

namespace Accounting.Web.Models
{
	/// <summary>
	/// Transaction Search Parameters for Transaction Search
	/// </summary>
	/// <createDetails>
	/// <id>US21085</id> <by>Janakiram</by> <date>31-03-2016</date> <description>Download Transaction SearchSettings.</description>		
	/// </createDetails>
	public class TransactionSearchRequest
	{
		/// <summary>
		/// Gets or sets TransactionSearchType
		/// </summary>
		public int TransactionSearchType { get; set; }

		/// <summary>
		/// Gets or sets Amount
		/// </summary>
		public decimal Amount { get; set; }

		/// <summary>
		/// Gets or sets Order Status
		/// </summary>
		public int OrderStatus { get; set; }

		/// <summary>
		/// Gets or sets BolNumber
		/// </summary>
		public string BolNumber { get; set; }

		/// <summary>
		/// Gets or sets ShipperCompanyName
		/// </summary>
		public string ShipperCompanyName { get; set; }

		/// <summary>
		/// Gets or sets ConsigneeCompanyName
		/// </summary>
		public string ConsigneeCompanyName { get; set; }

		/// <summary>
		/// Gets or sets VendorName
		/// </summary>
		public string VendorName { get; set; }

		/// <summary>
		/// Gets or sets CarrierServiceMode
		/// </summary>
		public int CarrierServiceMode { get; set; }

		/// <summary>
		/// Gets or sets NewShipmentType
		/// </summary>
		public int NewShipmentType { get; set; }

		/// <summary>
		/// Gets or sets PoNumber
		/// </summary>
		public string PoNumber { get; set; }

		/// <summary>
		/// Gets or sets ShipperCity
		/// </summary>
		public string ShipperCity { get; set; }

		/// <summary>
		/// Gets or sets ConsigneeCity
		/// </summary>
		public string ConsigneeCity { get; set; }

		/// <summary>
		/// Gets or sets SalesRepName
		/// </summary>
		public string SalesRepName { get; set; }

		/// <summary>
		/// Gets or sets SalesRepId
		/// </summary>
		public int SalesRepId { get; set; }

		/// <summary>
		/// Gets or sets ShipperZipCode
		/// </summary>
		public string ShipperZipCode { get; set; }

		/// <summary>
		/// Gets or sets ConsigneeZipCode
		/// </summary>
		public string ConsigneeZipCode { get; set; }

		/// <summary>
		/// Gets or sets CustomerBolNumber
		/// </summary>
		public string CustomerBolNumber { get; set; }

		/// <summary>
		/// Gets or sets ProNumber
		/// </summary>
		public string ProNumber { get; set; }

		/// <summary>
		/// Gets or sets ItemNumbers
		/// </summary>
		public string ItemNumbers { get; set; }

		/// <summary>
		/// Gets or sets CustomerName
		/// </summary>
		public string CustomerName { get; set; }

		/// <summary>
		/// Gets or sets TruckloadQuoteNumber
		/// </summary>
		public string TruckloadQuoteNumber { get; set; }

		/// <summary>
		/// Gets or sets InvoiceStatus
		/// </summary>
		public int InvoiceStatus { get; set; }

		/// <summary>
		/// Gets or sets ReferenceNumber
		/// </summary>
		public string ReferenceNumber { get; set; }

		/// <summary>
		/// Gets or sets TotalWeight
		/// </summary>
		public int TotalWeight { get; set; }

		/// <summary>
		/// Gets or sets TotalPiece
		/// </summary>
		public int TotalPiece { get; set; }

		/// <summary>
		/// Gets or sets DateType
		/// </summary>
		public int DateType { get; set; }

		/// <summary>
		/// Gets or sets FromDate
		/// </summary>
		public DateTime FromDate { get; set; }

		/// <summary>
		/// Gets or sets ToDate
		/// </summary>
		public DateTime ToDate { get; set; }

		/// <summary>
		/// Gets or sets PageSize
		/// </summary>
		public int PageSize { get; set; }

		/// <summary>
		/// Gets or sets PageNumber
		/// </summary>
		public int PageNumber { get; set; }

		/// <summary>
		/// Gets or sets the values for SortOrder
		/// </summary>
		public string SortOrder { get; set; }

		/// <summary>
		/// Gets or sets the values for SortCol
		/// </summary>
		public string SortCol { get; set; }

		/// <summary>
		/// Gets or Sets Purchase order flag
		/// </summary>
		public SearchTransactionType IsPurchaseOrder { get; set; }

		/// <summary>
		/// Gets or sets the values for CompanyName
		/// </summary>
		public string CompanyName { get; set; }
		
		/// <summary>
		/// Search Transaction Type
		/// </summary>
		public enum SearchTransactionType
		{
			/// <summary>
			/// PurchaseOrders
			/// </summary>
			PurchaseOrders,

			/// <summary>
			/// VendorBills
			/// </summary>
			VendorBills,

			/// <summary>
			/// Both
			/// </summary>
			Both
		}
	}
}