/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

var Simplex;
(function (Simplex) {
    var HttpMethod = (function () {
        function HttpMethod() { }
        HttpMethod.get = "GET";
        HttpMethod.post = "POST";
        // Commented out since IE7/8 are having issues with this line
        //HttpMethod.delete = "DELETE";
        return HttpMethod;
    })();
    var ContentTypes = (function () {
        function ContentTypes() { }
        ContentTypes.json = "application/json";
        ContentTypes.form = "x-www-form-urlencoded";
        ContentTypes.xml = "application/xml";
        return ContentTypes;
    })();
    Simplex.ContentTypes = ContentTypes;
    var AjaxConnection = (function () {
        function AjaxConnection(uri) {
            this.uri = uri;
            var hasTrailingSlash = this.uri.lastIndexOf("/") == this.uri.length - 1;
            if (!hasTrailingSlash) {
                uri = uri + "/";
            }
            this.baseUri = uri;
        }
        AjaxConnection.prototype.get = function (uri, acceptType, beforeSend) {
            if (typeof acceptType === "undefined") { acceptType = ContentTypes.json; }
            return this.invoke(uri, HttpMethod.get, acceptType, undefined, undefined, beforeSend);
        };
        AjaxConnection.prototype.post = function (uri, data, contentType) {
            if (typeof contentType === "undefined") { contentType = ContentTypes.json; }
            return this.invoke(uri, HttpMethod.post, contentType, data, contentType);
        };
        AjaxConnection.prototype.invoke = function (uri, verb, acceptType, content, contentType, beforeSend) {
            var _this = this;
            var deferred = $.Deferred();
            var promise = deferred.promise();
            var fullUri = this.baseUri + uri;
            var data;
            if (content != undefined) {
                data = this.prepareContent(content, contentType);
            }
            var ajaxSettings = {
                accepts: acceptType,
                data: data,
                contentType: contentType,
                type: verb,
                beforeSend: function (jqXhr) {
                	Simplex.AjaxHeaders.ensureHeaderSet(jqXhr);
                	if (beforeSend !== undefined && typeof (beforeSend) === 'function') {
                		beforeSend(jqXhr);
                	}
                }
            };
            if (this.username != undefined && this.password != undefined) {
                ajaxSettings.username = encodeURIComponent(this.username);
                ajaxSettings.password = encodeURIComponent(this.password);
            }
            $.ajax(fullUri, ajaxSettings).done(function (data, textStatus, jqXHR) {
                return _this.handleSuccess(data, textStatus, jqXHR, deferred);
            }).fail(function (data, textStatus, jqXHR) {
                return _this.handleError(data, textStatus, jqXHR, deferred);
            });
            return promise;
        };
        AjaxConnection.prototype.handleSuccess = function (data, textStatus, jqXHR, deferred) {
            deferred.resolve(data);
        };
        AjaxConnection.prototype.handleError = function (data, textStatus, jqXHR, deferred) {
			var reason = data.responseText,
                errorCode = data.getResponseHeader('X-Atlas-ErrorCode');

			//// ###START: US23868
			// If it is Unauthorized re-direct to Error / Login page
			if (data.status === 401) {
				if (Utils.Constants.LoginPageURL) {
					window.location.href = Utils.Constants.LoginPageURL;
				}
				deferred.reject(reason, errorCode);
			} else {
				deferred.reject(reason, errorCode);
			}
			//// ###END: US23868
		};
		AjaxConnection.prototype.prepareContent = function (content, contentType) {
			if (contentType === ContentTypes.json) {
                return JSON.stringify(content);
            } else {
                return content;
            }
        };
        return AjaxConnection;
    })();    
	Simplex.AjaxConnection = AjaxConnection;
	 var AjaxHeaders = (function () {
      function AjaxHeaders() {
        };
        AjaxHeaders.prepareCsrfValue = function () {
            var csrfToken = $.cookie('CsrfToken');
            if (csrfToken === undefined)
                return undefined;
            return csrfToken;
        };
        AjaxHeaders.ensureHeaderSet = function (jqXhr) {
            var headerValue = AjaxHeaders.prepareCsrfValue();
            if (headerValue === undefined)
                return;
            jqXhr.setRequestHeader(AjaxHeaders.CsrfHeaderName, headerValue);
        };
        AjaxHeaders.CsrfHeaderName = "X-Csrf-Token";
        return AjaxHeaders;
    })();
    Simplex.AjaxHeaders = AjaxHeaders;
})(Simplex || (Simplex = {}));
