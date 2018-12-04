/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

namespace Accounting.Web.Models
{
	public class DocumentToViewModel
	{
		#region "Properties"

		/// <summary>
		///
		/// </summary>
		public string FileDescription { get; set; }

		/// <summary>
		///
		/// </summary>
		public string FileLocationURL { get; set; }

		/// <summary>
		///
		/// </summary>
		public string FileType { get; set; }

		/// <summary>
		///
		/// </summary>
		public string FileName { get; set; }

		/// <summary>
		///
		/// </summary>
		public bool isValid { get; set; }

		#endregion "Properties"
	}
}