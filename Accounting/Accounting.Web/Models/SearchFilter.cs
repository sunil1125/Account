/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

namespace Accounting.Web.Models
{
	public class SearchFilter
	{
		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public string SearchText { get; set; }

		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public int Operand { get; set; }

		/// <summary>
		/// Gets or sets the values for search
		/// </summary>
		public string FieldName { get; set; }
	}
}