/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

namespace Accounting.Web.Models
{
	public class ResetPassword
	{
		public string NewPassword { get; set; }

		public string Tocken { get; set; }

		public bool IsTokenValid { get; set; }
	}
}