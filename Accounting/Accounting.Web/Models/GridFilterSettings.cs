/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

namespace Accounting.Web.Models
{
	/// <summary>
	/// Grid Fileter Settings for Transaction Search
	/// </summary>
	/// <createDetails>
	/// <id>US21085</id> <by>Janakiram</by> <date>31-03-2016</date> <description>Download Transaction SearchSettings.</description>		
	/// </createDetails>
	public class GridFilterSettings
	{
		/// <summary>
		/// SearchText
		/// </summary>
		public string SearchText { get; set; }

		/// <summary>
		/// Operand
		/// </summary>
		public int Operand { get; set; }

		/// <summary>
		/// FieldName
		/// </summary>
		public string FieldName { get; set; }

		/// <summary>
		/// Gets or sets the PageSize This used to get the data from database
		/// </summary>
		public int PageSize { get; set; }
	}
}