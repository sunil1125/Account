/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/**
* Interface to define file download options
*/
interface IFileDownloadOptions {
	/**
	* Requires jQuery UI: provide a message to display to the user when the file download is being prepared before the browser's dialog appears
	*/
	preparingMessageHtml?: string;
	/**
	* Requires jQuery UI: provide a message to display to the user when a file download fails
	*/
	failMessageHtml?: string;
	/**
	* the stock android browser straight up doesn't support file downloads initiated by a non GET: http://code.google.com/p/android/issues/detail?id=1780
	* specify a message here to display if a user tries with an android browser
	* if jQuery UI is installed this will be a dialog, otherwise it will be an alert
	* default message is 'Unfortunately your Android browser doesn't support this type of file download. Please try again with a different browser.'
	*/
	androidPostUnsupportedMessageHtml?: string;

	/**
	* Requires jQuery UI: options to pass into jQuery UI Dialog
	*/
	dialogOptions?: DialogOptions;

	/**
	* A function to call while the dowload is being prepared before the browser's dialog appears
	* @param {string} url - the original url attempted
	*/
	prepareCallback?: (url: string) => void;

	/**
	* A function to call after a file download dialog/ribbon has appeared
	* @param {string} url - the original url attempted
	*/
	successCallback?: (url: string) => void;

	/**
	* A function to call after a file download dialog/ribbon has appeared
	* @param {string} responseHtml	-	the html that came back in response to the file download. this won't necessarily come back depending on the browser.
	*									in less than IE9 a cross domain error occurs because 500+ errors cause a cross domain issue due to IE subbing out the
	*									server's error message with a "helpful" IE built in message
	* @param {string} url - the original url attempted
	*/
	failCallback?: (responseHtml: string, url: string) => void;

	/**
	* The HTTP method to use. Defaults to "GET".
	*/
	httpMethod?: string;

	/**
	* if specified will perform a "httpMethod" request to the specified 'fileUrl' using the specified data.
	* data must be an object (which will be $.param serialized) or already a key=value param string
	*/
	data?: any;

	/**
	* a period in milliseconds to poll to determine if a successful file download has occured or not
	* defult will be 100.
	*/
	checkInterval?: number;

	/**
	* the cookie name to indicate if a file download has occured
	* default will be fileDownload
	*/
	cookieName?: string;

	/**
	* the cookie value for the above name to indicate that a file download has occured
	* default will be true
	*/
	cookieValue?: string;

	/**
	* the cookie path for above name value pair
	* default will be /
	 */
	cookiePath?: string;

	/**
	* the title for the popup second window as a download is processing in the case of a mobile browser
	* default will be Initiating file download...
	*/
	popupWindowTitle?: string;

	/**
	* Functionality to encode HTML entities for a POST, need this if data is an object with properties whose values contains strings with quotation marks.
	* HTML entity encoding is done by replacing all &,<,>,',",\r,\n characters.
	* Note that some browsers will POST the string htmlentity-encoded whilst others will decode it before POSTing.
	* It is recommended that on the server, htmlentity decoding is done irrespective.
	* default will be true
	*/
	encodeHTMLEntities?: boolean
}

interface JQueryStatic {
	fileDownload(url: string): JQueryPromise<any>;
	fileDownload(url: string, options: IFileDownloadOptions): JQueryPromise<any>;
}