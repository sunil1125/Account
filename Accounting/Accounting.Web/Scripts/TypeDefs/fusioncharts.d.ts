/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/*
** <changeHistory>
** <id>US19763 </id> <by>SHREESHA ADIGA</by> <date>01-12-2015</date> <description>Added optional id field to the constructor</description>
** </changeHistory >
*/
declare class FusionCharts {
	public static items: {};
	public addEventListener: (eventName: string, event: () => void) => any;
	public removeEventListener: (eventName: string, event: () => void) => any;

	//#region Constructor

	constructor(ChartType: string, ChartName: string, width: string, height: string);
	constructor(ChartType: string, ChartName: string, width: string, height: string, other: string);
	constructor(type: string, renderAt: string, width: string, height: string, dataFormat: string, dataSource?: any, events?: any, id?: any); //US19763
	constructor(object: any);

	//#endregion

	//#region Static Method

	public static setCurrentRenderer(renderName: string): any;

	//#endregion

	//#region Public Methods

	public setXMLData(ChartValues: string): any;
	public setJSONData(ChartValues: string): any;
    public render(renderId?: string): any;
	public hasRendered(): boolean;

	public configure(messageType: string, messageValue: string): any;
	public configure(messageSet: Object): any;
	public setTransparent(isTransparent: boolean): any;
	public dispose(): any;
	//#endregion
}