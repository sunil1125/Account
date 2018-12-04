/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

using System.Collections.Generic;

namespace Accounting.Web.Models
{
	/// <summary>
	/// User Grid Settings for Transaction Search
	/// </summary>
	/// <createDetails>
	/// <id>US21085</id> <by>Janakiram</by> <date>31-03-2016</date> <description>Download Transaction Search Settings.</description>		
	/// </createDetails>
	public class UserGridSettings
	{
		/// <summary>
		/// PageSize
		/// </summary>
		public int PageSize { get; set; }

		/// <summary>
		/// Filters
		/// </summary>
		public List<GridFilterSettings> Filters { get; set; }
	}
}
