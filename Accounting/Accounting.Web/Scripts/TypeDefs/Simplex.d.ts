/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="jquery.d.ts" />
declare module Simplex {
	class ContentTypes {
		static json: string;
		static form: string;
		static xml: string;
	}
	class AjaxConnection {
		public uri: string;
		private baseUri;
		public username: string;
		public password: string;
		constructor(uri: string);
		public get(uri: string, acceptType?: string, beforeSend?: (jqXHR: JQueryXHR, settings: JQueryAjaxSettings) => any): JQueryPromise<any>;
		public post(uri: string, data: any, contentType?: string): JQueryPromise<any>;
		private invoke(uri, verb, acceptType, content?, contentType?);
		private handleSuccess(data, textStatus, jqXHR, deferred);
		private handleError(data, textStatus, jqXHR, deferred);
		private prepareContent(content, contentType);
	}

	class AjaxHeaders {
		public static ensureHeaderSet(jqXhr?: any);
	}
}
