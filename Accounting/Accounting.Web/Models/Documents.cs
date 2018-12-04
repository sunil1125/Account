/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

namespace Accounting.Web.Controllers
{
	public class Documents
	{
		#region Properties

		/// <summary>
		/// Gets or sets the file stream
		/// </summary>
		public byte[] FileContent { get; set; }

		/// <summary>
		/// Gets or sets the file extension
		/// </summary>
		public string FileExtension { get; set; }

		/// <summary>
		/// Gets or sets the file extension
		/// </summary>
		public string FileRelativePath { get; set; }

		/// <summary>
		/// Gets or sets the file Name
		/// </summary>
		public string FileName { get; set; }

		#endregion Properties
	}
}