/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

using System;
using System.Collections.Generic;

namespace Accounting.Web.Models
{
	/// <changeHistory>
	/// <id>US21085</id> <by>Janakiram</by> <date>31-03-2016</date> <description>Download Transaction Search Settings.</description>		
	/// <id>US25313</id> <by>Dhaval Tamhane</by> <date>25-10-2016</date> <description>Added new properties for transaction search export</description>
	/// </changeHistory>
	public class SearchModel
	{
		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public string SearchValue { get; set; }

		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public int PageNumber { get; set; }

		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public int PageSize { get; set; }

		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public string SortCol { get; set; }

		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public string SortOrder { get; set; }

		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public IList<SearchFilter> SearchFilterItems { get; set; }

		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public string ExportURL { get; set; }

		/// <summary>
		/// Gets or Sets the values for Vendor name in vendor bill tracking report
		/// </summary>
		public string VendorName { get; set; }

		/// <summary>
		/// Gets or sets the values for Pro number in vendor bill tracking report
		/// </summary>
		public string ProNumber { get; set; }

		/// <summary>
		/// Gets or sets values of FromDate
		/// </summary>
		public DateTime FromDate { get; set; }

		/// <summary>
		/// Gets or sets values of ToDate
		/// </summary>
		public DateTime ToDate { get; set; }

		/// <summary>
		/// gets or sets SelectedExceptionRule
		/// </summary>
		public int SelectedExceptionRule { get; set; }

		/// <summary>
		/// gets or sets ExportType
		/// </summary>
		public int ExportType { get; set; }

		/// <summary>
		/// gets or sets ExportType
		/// </summary>
		public int CustomerId { get; set; }

		/// <summary>
		/// Gets or sets RebillRepName
		/// </summary>
		public string RebillRepName { get; set; }

		/// <summary>
		/// Gets or sets Uploaded file details
		/// </summary>
		public UploadedFileDetails UploadedItem { get; set; }

		// ###START: US21085

		/// <summary>
		/// Gets or sets Uploaded file details
		/// </summary>
		public TransactionSearchRequest TransactionSearchRequest { get; set; }

		/// <summary>
		/// Gets or sets the values for SearchModel
		/// </summary>
		public UserGridSettingsRequest SearchFilterModel { get; set; }

		// ###END: US21085

		/// <summary>
		/// Gets or sets export type
		/// </summary>
		public string ExportTypeParam { get; set; }

		/// <summary>
		/// Gets or sets Current Timestamp
		/// </summary>
		public string CurrentTimestamp { get; set; }

		/// <summary>
		/// List of Columns that are visible in UI.
		/// </summary>
		public IList<string> VisibleColList { get; set; }
	}
}