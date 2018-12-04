/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

// Type definitions for Toastr 1.3.0
// Project: https://github.com/CodeSeven/toastr
// Definitions by: Boris Yankov <https://github.com/borisyankov/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="jquery.d.ts" />

/* Undo interface */
interface IExtToastrOptions {
	showLink?: boolean;
	extData?: any;
	link?: string;
	extTosatrFunc?: (undoData: any) => void;
}

/* Including undo in toastr option */
interface IToastrOptions {
	toastrPositionClass?: string;
	delayInseconds?: number;
	typeOfAlert?: string;
	title?: string;
	extToastrOptions?: IExtToastrOptions;
	actionButtons?: Array<IToastrActionButtonOptions>;
}

interface ToastrOptions {
	/**
	* Should clicking on toast dismiss it?
	*/
	tapToDismiss?: boolean;
	/**
	* CSS class the toast element will be given
	*/
	toastClass?: string;
	/**
	* Id toast container will be given
	*/
	containerId?: string;
	/**
	* Should debug details be outputted to the console
	*/
	debug?: boolean;
	/**
	* Time in milliseconds the toast should take to fade in
	*/
	fadeIn?: number;
	/**
	* OnFadeIn function callback
	**/
	onFadeIn?: () => void;
	/**
	* Time in milliseconds the toast should take to fade out
	*/
	fadeOut?: number;
	/**
	* OnFadeOut function callback
	**/
	onFadeOut?: () => void;
	/**
	* Time in milliseconds the toast should be displayed after mouse over
	*/
	extendedTimeOut?: string;		// updated for version 2.0.1
	iconClasses?: {
		/**
		* Icon to use on error toasts
		*/
		error: string;
		/**
		* Icon to use on info toasts
		*/
		info: string;
		/**
		* Icon to use on success toasts
		*/
		success: string;
		/**
		* Icon to use on warning toasts
		*/
		warning: string;
	};
	/**
	* Icon to use for toast
	*/
	iconClass?: string;
	/**
	* Where toast should be displayed
	*/
	positionClass?: string;
	/**
	* Where toast should be displayed - background
	*/
	backgroundpositionClass?: string;
	/**
	* Time in milliseconds that the toast should be displayed
	*/
	timeOut?: string;		// updated for version 2.0.1
	/**
	* CSS class the title element will be given
	*/
	titleClass?: string;
	/**
	* CSS class the message element will be given
	*/
	messageClass?: string;
	/**
	* Set newest toast to appear on top
	**/
	newestOnTop?: boolean;

	/**
	* Function to execute on toast click
	*/
	onclick?: () => void;

	/* Ankur's code 26th Sept 2013 adding some of the new definitions for version 2.0.1*/
	/* Close button for the toastr */
	closeButton?: boolean;

	/* Show duration for the message*/
	showDuration?: string;

	/* Hide duration for the message */
	hideDuration?: string;

	/* For undo Functionality Extension interface */
	extToastrOptions?: IExtToastrOptions;

	/* This will help to create the action buttons on the Toaster */
	actionButtons: Array<IToastrActionButtonOptions>;
}

interface IToastrActionButtonOptions {
	actionButtonName: string;
	actionClick: Function;
}

interface ToastrDisplayMethod {
	/**
	* Create a toast
	*
	* @param message Message to display in toast
	*/
	(message: string): JQuery;
	/**
	* Create a toast
	*
	* @param message Message to display in toast
	* @param title Title to display on toast
	*/
	(message: string, title: string): JQuery;
	/**
	* Create a toast
	*
	* @param message Message to display in toast
	* @param title Title to display on toast
	* @param overrides Option values for toast
	*/
	(message: string, title: string, overrides: ToastrOptions): JQuery;
}

interface Toastr {
	/**
	* Clear toasts
	*/
	clear: {
		/**
		* Clear all toasts
		*/
		(): void;
		/**
		* Clear specific toast
		*
		* @param toast Toast to clear
		*/
		(toast: JQuery): void;
	};

	/**
	* Create an error toast
	*/
	error: ToastrDisplayMethod;
	/**
	* Create an info toast
	*/
	info: ToastrDisplayMethod;
	/**
	* Create an options object
	*/
	options: ToastrOptions;
	/**
	* Create a success toast
	*/
	success: ToastrDisplayMethod;
	/**
	* Create a warning toast
	*/
	warning: ToastrDisplayMethod;
	/**
	* Get toastr version
	*/
	version: string;
}

declare var toastr: Toastr;