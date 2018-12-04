/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/

/*
** <summary>
** Interace for dashboard on the Welcome page
** </summary>
** <createDetail>
** <id>US25144</id> <by>Dhaval Tamhane</by><date>06-10-2016</date>
** </createDetail>
*/
interface IARDashboardDetails {
	BOLNumber: string;
	Amount: number;
	Cost: number;
	Revenue: number;
	CreditAmount: number;
	FinalMargin: number;
	CreditType: string;
}

/*
** <summary>
** Interace for  Dashboard Container, which has data related to the tabs
** </summary>
** <createDetail>
** <id>US25143</id> <by>Shreesha Adiga</by><date>06-10-2016</date>
** </createDetail>
*/
interface IDashboardContainerDetails {
	HasAccessToARDashboard: boolean;
}