/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="signalr.d.ts" />
/// <reference path="jquery.d.ts" />

////////////////////
// available hubs //
////////////////////
//#region available hubs

interface SignalR {
	/**
	  * The hub implemented by CarrierRate.Common.MatrixHub
	  */
	matrixHub: MatrixHub;

	/**
	  * The hub implemented by CarrierRate.Common.OPHub
	  */
	opHub: OpHub;
}
//#endregion available hubs

///////////////////////
// Service Contracts //
///////////////////////
//#region service contracts

//#region MatrixHub hub

interface MatrixHub extends HubProxy{
	/**
	  * This property lets you send messages to the MatrixHub hub.
	  */
	server: MatrixHubServer;

	/**
	  * The functions on this property should be replaced if you want to receive messages from the MatrixHub hub.
	  */
	client: any;
}

interface MatrixHubServer {
	/**
	  * Sends a "connect" message to the MatrixHub hub.
	  * Contract Documentation:
	  * @param username {string} chat user name of xmpp server
	  * @param password {string} chat password of xmpp server
	  * @param xmppDomain {string} name of the sever or domain where xmpp server is hosted
	  * @param guid {string} the unique identifier of xmpp client resource. [optional]
	  * @param showState {string} default state to be show in xmpp login. [optional]
	  * @return {JQueryPromise of void}
	  */
	connect(username: string, password: string, xmppDomain: string, guid?: string, showState?: string): JQueryPromise<any>;

	/**
	  * Sends a "close" message to the MatrixHub hub.
	  * Contract Documentation: ---
	  * @return {JQueryPromise of void}
	  */
	close(GUID?: string): JQueryPromise<any>;

	/**
	  * Sends a "sendMessage" message to the MatrixHub hub.
	  * Contract Documentation: ---
	  * @param msgTo {string}
	  * @param msgBody {string}
	  * @return {JQueryPromise of void}
	  */
	sendMessage(msgTo: string, msgBody: string): JQueryPromise<any>;

	/**
	  * Sends a "setStatus" message to the MatrixHub hub.
	  * Contract Documentation: ---
	  * @param status {string}
	  * @return {JQueryPromise of void}
	  */
	setStatus(status: string): JQueryPromise<any>;
}

//#endregion MatrixHub hub

//#region OPHub hub

interface OpHub extends HubProxy {
	/**
	  * This property lets you send messages to the OpHub hub.
	  */
	server: OpHubServer;

	/**
	  * The functions on this property should be replaced if you want to receive messages from the OpHub hub.
	  */
	client: any;
}

interface OpHubServer {
	ShowResult(connectionId: string, rrModel: any): void;
}

//#endregion MatrixHub hub

//#endregion service contracts

////////////////////
// Data Contracts //
////////////////////
//#region data contracts

//#endregion data contracts