/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

using System.Web.Optimization;

namespace Accounting.Web
{
	public class DurandalConfig
	{
		public static void PreStart()
		{
			// Add your start logic here
			BundleConfig.RegisterBundles(BundleTable.Bundles);
		}
	}
}