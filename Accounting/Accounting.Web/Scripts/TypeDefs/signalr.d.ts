/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="jquery.d.ts" />
// Type definitions for SignalR 1.0
// Project: http://www.asp.net/signalr
// Definitions by: Boris Yankov <https://github.com/borisyankov/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface HubMethod {
	(callback: (data: string) => void);
}

interface SignalREvents {
	onStart: string;
	onStarting: string;
	onReceived: string;
	onError: string;
	onConnectionSlow: string;
	onReconnect: string;
	onStateChanged: string;
	onDisconnect: string;
}

interface SignalRStateChange {
	oldState: number;
	newState: number;
}

interface SignalR {
	events: SignalREvents;
	connectionState: any;
	transport: any;

	hub: HubConnection;
	id: string;
	logging: boolean;
	messageId: string;
	url: string;

	(url: string, queryString?: any, logging?: boolean): SignalR;
	hubConnection(url?: string): SignalR;

	log(msg: string, logging: boolean): void;
	isCrossDomain(url: string): boolean;
	changeState(connection: SignalR, expectedState: number, newState: number): boolean;
	isDisconnecting(connection: SignalR): boolean;

	// createHubProxy(hubName: string): SignalR;

	start(): JQueryPromise<any>;
	start(callback: () => void): JQueryPromise<any>;
	start(settings: ConnectionSettings): JQueryPromise<any>;
	start(settings: ConnectionSettings, callback: () => void): JQueryPromise<any>;

	state: number;

	send(data: string): void;
	stop(async?: boolean, notifyServer?: boolean): void;

	starting(handler: () => void): SignalR;
	received(handler: (data: any) => void): SignalR;
	error(handler: (error: string) => void): SignalR;
	stateChanged(handler: (change: SignalRStateChange) => void): SignalR;
	disconnected(handler: () => void): SignalR;
	connectionSlow(handler: () => void): SignalR;
	sending(handler: () => void): SignalR;
	reconnecting(handler: () => void): SignalR;
	reconnected(handler: () => void): SignalR;
}

interface HubProxy {
	(connection: HubConnection, hubName: string): HubProxy;
	state: any;
	connection: HubConnection;
	hubName: string;
	init(connection: HubConnection, hubName: string): void;
	hasSubscriptions(): boolean;
	on(eventName: string, callback: (...msg) => void): HubProxy;
	off(eventName: string, callback: (msg) => void): HubProxy;
	invoke(methodName: string, ...args: any[]): JQueryDeferred<any>;
}

interface HubConnectionSettings {
	queryString?: string;
	logging?: boolean;
	useDefaultPath?: boolean;
}

interface HubConnection extends SignalR {
	//(url?: string, queryString?: any, logging?: boolean): HubConnection;
	proxies;
	received(callback: (data: { Id; Method; Hub; State; Args; }) => void): HubConnection;
	createHubProxy(hubName: string): HubProxy;
}

interface SignalRfn {
	init(url, qs, logging);
}

interface ConnectionSettings {
	transport? ;
	callback? ;
	waitForPageLoad?: boolean;
	jsonp?: boolean;
}

interface JQueryStatic {
	signalR: SignalR;
	connection: SignalR;
	hubConnection(url?: string, queryString?: any, logging?: boolean): HubConnection;
}