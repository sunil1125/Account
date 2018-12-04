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
	/// UserGridSettingsRequest for Transaction Search
	/// </summary>
	/// <createDetails>
	/// <id>US21085</id> <by>Janakiram</by> <date>31-03-2016</date> <description>Download Transaction SearchSettings.</description>		
	/// </createDetails>
	public class UserGridSettingsRequest
	{
		/// <summary>
		/// UserGridSetting
		/// </summary>
		public UserGridSettings UserGridSetting { get; set; }

		/// <summary>
		/// Grid view id
		/// </summary>
		public int GridViewId { get; set; }

		/// <summary>
		/// check is filter is applied
		/// </summary>
		public bool IsFilterApplied { get; set; }

		/// <summary>
		/// page no
		/// </summary>
		public int PageNo { get; set; }

		/// <summary>
		/// Gets or sets the values for SortOrder
		/// </summary>
		public string SortOrder { get; set; }

		/// <summary>
		/// Gets or sets the values for SortCol
		/// </summary>
		public string SortCol { get; set; }

		/// <summary>
		///  Grid Search text
		/// </summary>
		public string GridSearchText { get; set; }

		/// <summary>
		///  FromDate
		/// </summary>
		public DateTime FromDate { get; set; }

		/// <summary>
		///  ToDate
		/// </summary>
		public DateTime ToDate { get; set; }

		/// <summary>
		/// Gets or sets the FromLocalStorage
		/// </summary>
		public bool FromLocalStorage { get; set; }

		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public int PageSize { get; set; }

		/// <summary>
		/// Gets or sets ExceptionRuleId
		/// </summary>
		public int ExceptionRuleId { get; set; }

		/// <summary>
		/// Gets or sets ExceptionRuleId
		/// </summary>
		public bool IsForRexnord { get; set; }		

		/// <summary>
		/// Gets or sets IsForExcel
		/// </summary>
		public bool IsForExcel { get; set; }
	}
}
