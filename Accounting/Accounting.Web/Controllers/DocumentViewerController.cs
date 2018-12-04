/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Services;
using Accounting.Web.Common;
using Accounting.Web.Models;
using AmadeusConsulting.Simplex.Base.Net;

namespace Accounting.Web.Controllers
{
	/// <summary>
	/// Document view controller
	/// </summary>
	/// <changeHistory>
	/// <id>DE22054</id> <by>Vasanthakumar</by> <date>08-03-2016</date> <description>User cant view/download the uploaded documents for Truckload Carriers in Carrier > Mapping</description>
	/// <id>US22997</id> <by>Janakiram</by> <date>07-07-2016</date> <description>Added download manager for Invoice View Pdf</description>
	/// <id>DE23945</id> <by>Janakiram</by> <date>31-08-2016</date> <description>if no data found for export, returning null</description>
	/// <id>US25313</id> <by>Dhaval Tamhane</by> <date>25-10-2016</date> <description>Changes to export functionality of transaction grid</description>
	/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
	/// </changeHistory>
	[Authorize]
	public class DocumentViewerController : Controller
	{
		public ActionResult ViewDocument(string FileDescription, string FileType, string FileLocationURL)
		{
			DocumentToViewModel docView = new DocumentToViewModel();

			docView.FileDescription = FileDescription;
			docView.FileType = FileType;
			docView.FileLocationURL = Decrypt(FileLocationURL);
			docView.isValid = true;
			string url = Request.Url.ToString();
			String[] fullDocName = docView.FileLocationURL.Replace('\\', '/').Split('/');

			docView.FileName = fullDocName[fullDocName.Length - 1];

			return View(docView);
		}

		public ActionResult ViewShipmentPodDocument(Int64 shipmentId)
		{
			ShipmentDocModel docView = new ShipmentDocModel();
			docView.ShipmentId = shipmentId;
			return View(docView);
		}

		[HttpGet]
		[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
		public object GetRequestData()
		{
			DocumentToViewModel docView = new DocumentToViewModel();
			string url = Request.UrlReferrer.AbsoluteUri;
			if (!url.Contains("?"))
			{
				docView.isValid = false;
				return docView;
			}
			string[] separateURL = url.Split('?');
			NameValueCollection queryString = System.Web.HttpUtility.ParseQueryString(separateURL[1]);

			if (queryString["FileDescription"] != null && queryString["FileLocationURL"] != null && queryString["FileType"] != null)
			{
				docView.FileDescription = queryString["FileDescription"].ToString();
				docView.FileLocationURL = Decrypt(queryString["FileLocationURL"].ToString());
				docView.FileType = queryString["FileType"].ToString();
				docView.isValid = true;
			}
			return Newtonsoft.Json.JsonConvert.SerializeObject(docView);
		}

		/// <summary>
		/// Call atlas service for pulling report data and pushes it to the browser with proper response headers.
		/// </summary>
		/// <param name="reportURL">report URL</param>
		/// <param name="chartData">chart Data</param>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		[HttpPost]
		[ValidateInput(false)]
		public void DownloadReport(string reportURL, string chartData)
		{
			try
			{
				chartData = HttpUtility.HtmlDecode(chartData);
				byte[] data = null;

				String[] urlParts = reportURL.ToString().Split('/');
				string reportName = urlParts[2];
				string reportType = urlParts[3];

				if (string.IsNullOrEmpty(chartData))
				{
					// ###START: US26457
					string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

					// ###END: US26457
					data = Http.Get<byte[]>(string.Format("{0}/{1}", baseurl, reportURL), CookieHelper.AtlasCookieContainer);
				}
				else
				{
					dynamic parameters = new ExpandoObject();
					parameters.ExportType = reportType;
					parameters.SortingColumn = urlParts[4];
					parameters.SortingOrder = urlParts[5];
					parameters.FilterType = urlParts[6];
					parameters.FromDate = urlParts[7];
					string[] queryString = urlParts[8].Split('?');
					parameters.ToDate = queryString[0];

					if (queryString.Length > 1)
					{
						parameters.CurrentTimestamp = queryString[1].Split('=')[1];
					}

					parameters.ChartData = HttpUtility.UrlDecode(chartData);

					// ###START: US26457
					string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

					// ###END: US26457
					string atlasUrl = string.Format("{0}/{1}/{2}", urlParts[0], urlParts[1], urlParts[2]);

					data = Http.Post<byte[]>(string.Format("{0}/{1}", baseurl, atlasUrl), parameters, "application/json", "application/json", CookieHelper.AtlasCookieContainer);
				}

				string ext = ".txt";
				switch (reportType)
				{
					case "EXCEL":
						ext = ".xls";
						break;

					case "PDF":
						ext = ".pdf";
						break;

					case "CSV":
						ext = ".csv";
						break;
				}

				HttpResponse response = System.Web.HttpContext.Current.Response;

				response.Clear();
				response.ClearContent();
				response.ClearHeaders();

				response.ContentType = DocumentManagementMimeType.GetMIMETypeByFileExtenstion(ext);
				response.AddHeader("Content-Disposition", "attachment; filename=\"" + reportName + ext + "\"");
				response.AddHeader("Content-Length", data.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");

				if (!response.Cookies.AllKeys.Contains("fileDownload"))
				{
					response.Cookies.Add(new HttpCookie("fileDownload", "true"));
				}
				response.BinaryWrite(data);
				response.Flush();
			}
			catch (Exception ex)
			{
				string message = ex.Message;
			}
		}

		/// <summary>
		/// Call atlas service for pulling report data and pushes it to the browser with proper response headers.
		/// </summary>
		/// <param name="collection">Form collection</param>
		/// <param name="componentUrl">Component Url</param>
		/// <param name="fileName">File Name</param>
		/// <createDetail>
		/// <id>US25313</id> <by>Dhaval Tamhane</by> <date>25-10-2016</date>
		/// </createDetail>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		[HttpPost]
		public void DownloadReportWithColumnName(FormCollection collection, string componentUrl, string fileName)
		{
			if (string.IsNullOrWhiteSpace(componentUrl))
			{
				throw new ArgumentNullException("componentUrl");
			}

			SearchModel searchModel = (SearchModel)Newtonsoft.Json.JsonConvert.DeserializeObject(collection.Get(0), typeof(SearchModel));

			try
			{
				byte[] data = null;

				if (searchModel == null)
				{
					DownloadReport(componentUrl, string.Empty);
				}

				// ###START: US26457
				string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

				// ###END: US26457
				data = Http.Post<byte[]>(string.Format("{0}{1}", baseurl, componentUrl), searchModel, "application/json", "application/json", CookieHelper.AtlasCookieContainer);

				string ext = ".txt";
				switch (searchModel.ExportTypeParam)
				{
					case "EXCEL":
						ext = ".xls";
						break;

					case "PDF":
						ext = ".pdf";
						break;

					case "CSV":
						ext = ".csv";
						break;
				}

				HttpResponse response = System.Web.HttpContext.Current.Response;

				response.Clear();
				response.ClearContent();
				response.ClearHeaders();

				response.ContentType = DocumentManagementMimeType.GetMIMETypeByFileExtenstion(ext);
				response.AddHeader("Content-Disposition", "attachment; filename=\"" + fileName + ext + "\"");
				response.AddHeader("Content-Length", data.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");

				if (!response.Cookies.AllKeys.Contains("fileDownload"))
				{
					response.Cookies.Add(new HttpCookie("fileDownload", "true"));
				}

				response.BinaryWrite(data);
			}
			catch (Exception ex)
			{
				string message = ex.Message;
			}
		}

		/// <summary>
		/// DownloadArReport
		/// </summary>
		/// <param name="fileLocationURL"></param>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		public void DownloadARReport(string fileLocationURL)
		{
			try
			{
				// ###START: US26457
				string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

				// ###END: US26457
				byte[] data = Http.Get<byte[]>(string.Format("{0}/{1}", baseurl, fileLocationURL), CookieHelper.AtlasCookieContainer);

				String[] urlParts = fileLocationURL.Split('/');
				string reportName = urlParts[2];
				DateTime reportDate = DateTime.Now;
				DateTime.TryParse(urlParts[3], out reportDate);

				string ext = ".pdf";

				HttpResponse response = System.Web.HttpContext.Current.Response;
				response.Clear();
				response.ClearContent();
				response.ClearHeaders();

				response.ContentType = DocumentManagementMimeType.GetMIMETypeByFileExtenstion(ext);
				response.AddHeader("Content-Disposition", "attachment; filename=\"" + reportName + '-' + reportDate.ToString("MMM-YYYY") + "-" + ext + "\"");
				response.AddHeader("Content-Length", data.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");

				if (!response.Cookies.AllKeys.Contains("fileDownload"))
				{
					response.Cookies.Add(new HttpCookie("fileDownload", "true"));
				}

				response.BinaryWrite(data);
				response.Flush();
			}
			catch { }
		}

		/// <summary>
		/// To Download a File in Browser
		/// </summary>
		/// <param name="fileLocationURL">fileLocationURL</param>
		/// <changeHistory>
		/// <id>DE22054</id> <by>Vasanthakumar</by> <date>08-03-2016</date> <description>User cant view/download the uploaded documents for Truckload Carriers in Carrier > Mapping</description>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory> 
		public void DownloadCarrierMappingFromDocumentManagement(string fileLocationURL)
		{
			try
			{
				//// ###START: DE22054
				// ###START: US26457
				string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("DocumentManagement");

				// ###END: US26457
				//// ###END: DE22054
				var dataAtlas = Http.Get<Documents>(string.Format("{0}/{1}", baseurl, fileLocationURL), CookieHelper.CookiesContainer, "application/json");
				string contentDisposition = string.Format("attachment; filename=\"{0}\"", dataAtlas.FileRelativePath);
				HttpResponse response = System.Web.HttpContext.Current.Response;
				response.ContentType = DocumentManagementMimeType.GetMIMETypeByFileExtenstion(dataAtlas.FileExtension);
				response.AddHeader("Content-Disposition", contentDisposition);
				response.AddHeader("Content-Length", dataAtlas.FileContent.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");
				response.BinaryWrite(dataAtlas.FileContent);
			}
			catch
			{
				Response.Write("File Not found");
			}
		}

		/// <summary>
		/// To Download a File in Browser
		/// </summary>
		/// <param name="fileLocationURL">fileLocationURL</param>
		/// <createDetails>
		/// <id>DE26026</id> <by>Vasanthakumar</by> <date>14-03-2017</date> <description>Not able to see Pod documents</description>
		/// </createDetails> 
		public void DownloadFileFromDocumentManagement(string fileLocationURL)
		{
			try
			{
				string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("DocumentManagement");

				var dataAtlas = Http.Get<Documents>(string.Format("{0}/GetDocumentsInBytes?fileRelativePath={1}", baseurl, fileLocationURL), CookieHelper.CookiesContainer, "application/json");
				string contentDisposition = string.Format("attachment; filename=\"{0}\"", dataAtlas.FileRelativePath);
				HttpResponse response = System.Web.HttpContext.Current.Response;
				response.ContentType = DocumentManagementMimeType.GetMIMETypeByFileExtenstion(dataAtlas.FileExtension);
				response.AddHeader("Content-Disposition", contentDisposition);
				response.AddHeader("Content-Length", dataAtlas.FileContent.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");
				response.BinaryWrite(dataAtlas.FileContent);
			}
			catch
			{
				Response.Write("File Not found");
			}
		}

		/// <summary>
		/// To Open a File in Browser
		/// </summary>
		/// <param name="fileLocationURL">fileLocationURL</param>
		/// <changeHistory>
		/// <id>DE22054</id> <by>Vasanthakumar</by> <date>08-03-2016</date> <description>User cant view/download the uploaded documents for Truckload Carriers in Carrier > Mapping</description>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory> 
		public void OpenCarrierMappingFromDocumentManagement(string fileLocationURL)
		{
			try
			{
				//// ###START: DE22054
				// ###START: US26457
				string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("DocumentManagement");

				// ###END: US26457
				//// ###END: DE22054
				var dataAtlas = Http.Get<Documents>(string.Format("{0}/{1}", baseurl, fileLocationURL), CookieHelper.CookiesContainer, "application/json");
				string contentDisposition = string.Format("inline; filename=\"{0}\"", dataAtlas.FileRelativePath);
				HttpResponse response = System.Web.HttpContext.Current.Response;
				response.ContentType = DocumentManagementMimeType.GetMIMETypeByFileExtenstion(dataAtlas.FileExtension);
				response.AddHeader("Content-Disposition", contentDisposition);
				response.AddHeader("Content-Length", dataAtlas.FileContent.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");
				response.BinaryWrite(dataAtlas.FileContent);
			}
			catch
			{
				Response.Write("File Not found");
			}
		}

		/// <summary>
		/// DownloadElasticReport
		/// </summary>
		/// <param name="searchModel"></param>
		/// <returns>string</returns>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		[HttpPost]
		[ValidateInput(false)]
		public string DownloadElasticReport(SearchModel searchModel)
		{
			try
			{
				////### Start DE21231
				// ###START: US26457
				string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

				// ###END: US26457
				var data = Http.Post<string>(string.Format("{0}/{1}", baseurl, searchModel.ExportURL), searchModel, "application/json", "application/json", CookieHelper.AtlasCookieContainer);

				////### END DE21231

				// ###START: DE23945
				if (!string.IsNullOrWhiteSpace(data))
				{
					if (searchModel.ExportType == 0)
					{
						data = string.Format("DocumentViewer/{0}", "//DownloadCSVExcelFromDocumnetManagment//?fileRelativePath=" + HttpUtility.UrlEncode(data));
					}
					else
					{
						data = string.Format("DocumentViewer/{0}", "//DownloadReportFromDocumnetManagment//?fileRelativePath=" + HttpUtility.UrlEncode(data));
					}
				}
				else
				{
					data = string.Empty;
				}

				// ###END: DE23945
				return data;
			}
			catch (Exception ex)
			{
			}

			return string.Empty;
		}

		/// <summary>
		/// DownloadReportFromDocumnetManagement
		/// </summary>
		/// <param name="fileRelativePath"></param>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		[HttpGet]
		[ValidateInput(false)]
		public void DownloadReportFromDocumnetManagment(string fileRelativePath)
		{
			try
			{
				////### Start DE21231
				// ###START: US26457
				string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("DocumentManagement");

				// ###END: US26457
				////### End DE21231
				//// ###START: US19934
				var dataAtlas = Http.Get<Documents>(string.Format("{0}/{1}", baseurl, "//GetDocumentsInBytes//?fileRelativePath=" + fileRelativePath), CookieHelper.CookiesContainerInternal, "application/json");
				//// ###END: US19934
				var fileName = Path.GetFileName(fileRelativePath);

				HttpResponse response = System.Web.HttpContext.Current.Response;
				response.ContentType = DocumentManagementMimeType.GetMIMETypeByFileExtenstion(".xls");
				response.AddHeader("Content-Disposition", "attachment; filename=\"" + fileName + "");
				response.AddHeader("Content-Length", dataAtlas.FileContent.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");

				if (!response.Cookies.AllKeys.Contains("fileDownload"))
				{
					response.Cookies.Add(new HttpCookie("fileDownload", "true"));
				}

				response.BinaryWrite(dataAtlas.FileContent);
				response.Flush();
				response.End();
			}
			catch (Exception ex)
			{
			}
		}

		/// <summary>
		/// DownloadCSVExcelFromDocumnetManagement
		/// </summary>
		/// <param name="fileRelativePath"></param>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		[HttpGet]
		[ValidateInput(false)]
		public void DownloadCSVExcelFromDocumnetManagment(string fileRelativePath)
		{
			try
			{
				////### Start DE21231
				// ###START: US26457
				string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("DocumentManagement");

				// ###END: US26457
				////### End DE21231
				//// ###START: US19934
				var dataAtlas = Http.Get<Documents>(string.Format("{0}/{1}", baseurl, "//GetDocumentsInBytes//?fileRelativePath=" + fileRelativePath), CookieHelper.DocumentManagementCookieContainer, "application/json");
				//// ###END: US19934
				var fileName = Path.GetFileName(fileRelativePath);

				HttpResponse response = System.Web.HttpContext.Current.Response;
				response.ContentType = DocumentManagementMimeType.GetMIMETypeByFileExtenstion(".csv");
				response.AddHeader("Content-Disposition", "attachment; filename=\"" + fileName + "");
				response.AddHeader("Content-Length", dataAtlas.FileContent.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");

				if (!response.Cookies.AllKeys.Contains("fileDownload"))
				{
					response.Cookies.Add(new HttpCookie("fileDownload", "true"));
				}

				response.BinaryWrite(dataAtlas.FileContent);
				response.Flush();
				response.End();
			}
			catch (Exception ex)
			{
			}
		}

		public void GetMimeType(string FileLocationURL)
		{
			var request = HttpWebRequest.Create(FileLocationURL) as HttpWebRequest;
			if (request != null)
			{
				var response = request.GetResponse() as HttpWebResponse;

				string contentType = "";
				HttpResponse response1 = System.Web.HttpContext.Current.Response;

				if (response != null)
					contentType = response.ContentType;
				response1.ContentType = contentType;
			}
		}

		public string Decrypt(string encrypted)
		{
			byte[] passByteData = Convert.FromBase64String(encrypted);
			string originalPassword = System.Text.Encoding.UTF8.GetString(passByteData);
			return originalPassword;
		}

		/// <summary>
		/// Gets the bol document as PDF.
		/// </summary>
		/// <param name="componentURL">The component URL.</param>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		public void GetBOLDocumentAsPDF(string componentURL)
		{
			if (string.IsNullOrEmpty(componentURL))
			{
				throw new ArgumentNullException("componentURL");
			}

			String[] urlParts = componentURL.ToString().Split('/');

			var documentRequestModel = new DocumentRequestModel
			{
				CustomerBolNumber = urlParts[2],
				PdfHeight = float.Parse(urlParts[3]),
				PdfWidth = float.Parse(urlParts[4]),
				BolNumber = urlParts[5]
			};

			string bolNumber = string.IsNullOrEmpty(urlParts[5]) ? string.Empty : urlParts[5];

			// ###START: US26457
			string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

			// ###END: US26457
			baseurl = baseurl + urlParts[0] + "//" + urlParts[1];

			byte[] pdfByte = Http.Post<byte[]>(baseurl, documentRequestModel, "application/json", "application/json", cookieContainer: CookieHelper.AtlasCookieContainer);

			string filename = string.Format("{0}{1}{2}", "BOL - ", string.IsNullOrEmpty(bolNumber) ? Guid.NewGuid().ToString() : bolNumber, ".pdf");

			HttpResponse response = System.Web.HttpContext.Current.Response;
			response.Clear();
			response.ClearContent();
			response.ClearHeaders();
			response.ContentType = "application/pdf";
			response.AddHeader("Content-Disposition", "filename=\"" + filename + "\"");
			response.AddHeader("Content-Length", pdfByte.Length.ToString());
			response.AddHeader("Content-Description", "File Transfer");
			response.AddHeader("Content-Transfer-Encoding", "binary");
			if (!response.Cookies.AllKeys.Contains("fileDownload"))
			{
				response.Cookies.Add(new HttpCookie("fileDownload", "true"));
			}

			response.BinaryWrite(pdfByte);
			response.Flush();
		}

		/// <summary>
		/// Downloads the bol document as PDF.
		/// </summary>
		/// <param name="componentURL">The component URL.</param>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		public void DownloadBOLDocumentAsPDF(string componentURL)
		{
			if (string.IsNullOrEmpty(componentURL))
			{
				throw new ArgumentNullException("componentURL");
			}

			String[] urlParts = componentURL.ToString().Split('/');

			var documentRequestModel = new DocumentRequestModel
			{
				CustomerBolNumber = urlParts[2],
				PdfHeight = float.Parse(urlParts[3]),
				PdfWidth = float.Parse(urlParts[4]),
				BolNumber = urlParts[5]
			};

			string bolNumber = string.IsNullOrEmpty(urlParts[5]) ? string.Empty : urlParts[5];

			// ###START: US26457
			string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

			// ###END: US26457
			baseurl = baseurl + urlParts[0] + "//" + urlParts[1];

			byte[] pdfByte = Http.Post<byte[]>(baseurl, documentRequestModel, "application/json", "application/json", cookieContainer: CookieHelper.AtlasCookieContainer);

			string filename = string.Format("{0}{1}{2}", "BOL - ", string.IsNullOrEmpty(bolNumber) ? Guid.NewGuid().ToString() : bolNumber, ".pdf");

			HttpResponse response = System.Web.HttpContext.Current.Response;
			response.Clear();
			response.ClearContent();
			response.ClearHeaders();

			response.ContentType = "application/pdf";
			response.AddHeader("content-disposition", "attachment;filename=" + filename);
			response.AddHeader("Content-Length", pdfByte.Length.ToString());
			response.AddHeader("Content-Description", "File Transfer");
			response.AddHeader("Content-Transfer-Encoding", "binary");

			response.BinaryWrite(pdfByte);
			response.Flush();
		}

		/// <summary>
		/// Downloads the document
		/// </summary>
		/// <param name="fileLocationURL">fileLocationURL</param>
		public void DownloadDocumentFromUrl(string fileLocationURL)
		{
			String[] fullDocName = fileLocationURL.Split('\\');

			HttpWebRequest request = (HttpWebRequest)WebRequest.Create(fileLocationURL);
			request.CookieContainer = CookieHelper.CookiesContainer;
			byte[] data = null;

			if (request != null)
			{
				// Send the request to the server and retrieve the
				// WebResponse object
				WebResponse fileResponse = request.GetResponse();
				if (fileResponse != null)
				{
					Stream respStream = fileResponse.GetResponseStream();
					MemoryStream memStream = new MemoryStream();
					byte[] buffer = new byte[2048];

					int bytesRead = 0;
					do
					{
						bytesRead = respStream.Read(buffer, 0, buffer.Length);
						memStream.Write(buffer, 0, bytesRead);
					} while (bytesRead != 0);

					respStream.Close();

					data = memStream.ToArray();
				}
			}

			HttpResponse response = System.Web.HttpContext.Current.Response;
			response.Clear();
			response.ClearContent();
			response.ClearHeaders();
			response.ContentType = DocumentManagementMimeType.GetMIMETypeByFileExtenstion(fileLocationURL); //
			response.AddHeader("Content-Disposition", "attachment; filename=\"" + fullDocName[fullDocName.Length - 1] + "\"");
			response.AddHeader("Content-Length", data.Length.ToString());
			response.AddHeader("Content-Description", "File Transfer");
			response.AddHeader("Content-Transfer-Encoding", "binary");
			if (!response.Cookies.AllKeys.Contains("fileDownload"))
			{
				response.Cookies.Add(new HttpCookie("fileDownload", "true"));
			}
			response.BinaryWrite(data);
			response.Flush();
		}

		/// <summary>
		/// Gets GetInvoiceStatementDocumentAsPDF
		/// </summary>
		/// <param name="componentURL">The component URL.</param>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		public void GetInvoiceStatementDocumentAsPDF(string componentURL)
		{
			if (string.IsNullOrEmpty(componentURL))
			{
				throw new ArgumentNullException("componentURL");
			}

			String[] urlParts = componentURL.ToString().Split('/');

			var documentRequestModel = new DocumentRequestModel
			{
				InvoiceNumber = urlParts[2],
				PdfHeight = float.Parse(urlParts[3]),
				PdfWidth = float.Parse(urlParts[4]),
				BolNumber = urlParts[5]
			};

			string fileName = documentRequestModel.InvoiceNumber;

			// ###START: US26457
			string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

			// ###END: US26457
			string atlasUrl = string.Format("{0}/{1}", urlParts[0], urlParts[1]);

			byte[] pdfByte = Http.Post<byte[]>(string.Format("{0}/{1}", baseurl, atlasUrl), documentRequestModel, "application/json", "application/json", cookieContainer: CookieHelper.AtlasCookieContainer);

			string filename = string.Format("{0}{1}{2}", "Statement - ", string.IsNullOrEmpty(fileName) ? Guid.NewGuid().ToString() : fileName, ".pdf");

			HttpResponse response = System.Web.HttpContext.Current.Response;
			response.Clear();
			response.ClearContent();
			response.ClearHeaders();
			response.ContentType = "application/pdf";
			response.AddHeader("Content-Disposition", "filename=\"" + filename + "\"");
			response.AddHeader("Content-Length", pdfByte.Length.ToString());
			response.AddHeader("Content-Description", "File Transfer");
			response.AddHeader("Content-Transfer-Encoding", "binary");

			if (!response.Cookies.AllKeys.Contains("fileDownload"))
			{
				response.Cookies.Add(new HttpCookie("fileDownload", "true"));
			}
			response.BinaryWrite(pdfByte);
			response.Flush();
		}

		/// <summary>
		/// Gets GetTrnsactionHistoryDocumentAsPDF
		/// </summary>
		/// <param name="componentURL">The component URL.</param>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		[HttpPost]
		public void GetTrnsactionHistoryDocumentAsPDF(FormCollection collection)
		{
			List<object> statementReport = (List<object>)Newtonsoft.Json.JsonConvert.DeserializeObject(collection.Get(0), typeof(List<object>));
			if (statementReport.Count == 0)
			{
				throw new ArgumentNullException("statementReport");
			}
			string componentURL = "CarrierRate/financials/GetTransactionsDetailsPdfUrl";

			string filename = string.Format("{0}{1}", "Customer Transaction " + Guid.NewGuid().ToString(), ".pdf");

			// ###START: US26457
			string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

			// ###END: US26457
			try
			{
				byte[] pdfByte = Http.Post<byte[]>(string.Format("{0}/" + componentURL, baseurl), statementReport, "application/json", "application/json", CookieHelper.CookiesContainer);
				HttpResponse response = System.Web.HttpContext.Current.Response;
				response.Clear();
				response.ClearContent();
				response.ClearHeaders();
				string contentDisposition = string.Format("attachment; filename=\"{0}\"", filename);
				response.ContentType = "application/pdf";
				response.AddHeader("Content-Disposition", contentDisposition);
				response.AddHeader("Content-Length", pdfByte.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");

				if (!response.Cookies.AllKeys.Contains("fileDownload"))
				{
					response.Cookies.Add(new HttpCookie("fileDownload", "true"));
				}
				response.BinaryWrite(pdfByte);
				response.Flush();
			}
			catch (WebServiceServerException ex)
			{
				throw new Exception(ex.Message);
			}
		}

		/// <summary>
		/// Gets the bol document as PDF.
		/// </summary>
		/// <param name="componentURL">The component URL.</param>
		/// <createDetail>
		///  <id>US22997</id> <by>Janakiram</by> <date>07-07-2016</date> <description>Added Get for Invoice View Pdf</description>
		/// </createDetail>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		public void GetInvoiceDocumentAsPDF(string componentURL)
		{
			if (string.IsNullOrEmpty(componentURL))
			{
				throw new ArgumentNullException("componentURL");
			}

			String[] urlParts = componentURL.ToString().Split('/');

			var documentRequestModel = new DocumentRequestModel
			{
				CustomerBolNumber = urlParts[2],
				PdfHeight = float.Parse(urlParts[3]),
				PdfWidth = float.Parse(urlParts[4]),
				BolNumber = urlParts[5]
			};

			string bolNumber = string.IsNullOrEmpty(urlParts[5]) ? string.Empty : urlParts[5];

			// ###START: US26457
			string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

			// ###END: US26457
			baseurl = baseurl + urlParts[0] + "//" + urlParts[1];

			byte[] pdfByte = Http.Post<byte[]>(baseurl, documentRequestModel, "application/json", "application/json", cookieContainer: CookieHelper.AtlasCookieContainer);

			if (pdfByte != null)
			{
				string filename = string.Format("{0}{1}{2}", "INVOICE - ", string.IsNullOrEmpty(bolNumber) ? Guid.NewGuid().ToString() : bolNumber, ".pdf");

				HttpResponse response = System.Web.HttpContext.Current.Response;
				response.Clear();
				response.ClearContent();
				response.ClearHeaders();
				response.ContentType = "application/pdf";
				response.AddHeader("Content-Disposition", "filename=\"" + filename + "\"");
				response.AddHeader("Content-Length", pdfByte.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");
				if (!response.Cookies.AllKeys.Contains("fileDownload"))
				{
					response.Cookies.Add(new HttpCookie("fileDownload", "true"));
				}

				response.BinaryWrite(pdfByte);
				response.Flush();
			}

		}
		/// <summary>
		/// Downloads the bol document as PDF.
		/// </summary>
		/// <param name="componentURL">The component URL.</param>
		/// <createDetail>
		///  <id>US22997</id> <by>Janakiram</by> <date>07-07-2016</date> <description>Added download manager for Invoice View Pdf</description>
		/// </createDetail>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		public void DownloadInvoiceDocumentAsPDF(string componentURL)
		{
			if (string.IsNullOrEmpty(componentURL))
			{
				throw new ArgumentNullException("componentURL");
			}

			String[] urlParts = componentURL.ToString().Split('/');

			var documentRequestModel = new DocumentRequestModel
			{
				CustomerBolNumber = urlParts[2],
				PdfHeight = float.Parse(urlParts[3]),
				PdfWidth = float.Parse(urlParts[4]),
				BolNumber = urlParts[5]
			};

			string bolNumber = string.IsNullOrEmpty(urlParts[5]) ? string.Empty : urlParts[5];

			// ###START: US26457
			string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

			// ###END: US26457
			baseurl = baseurl + urlParts[0] + "//" + urlParts[1];

			byte[] pdfByte = Http.Post<byte[]>(baseurl, documentRequestModel, "application/json", "application/json", cookieContainer: CookieHelper.AtlasCookieContainer);
			if (pdfByte != null)
			{
				string filename = string.Format("{0}{1}{2}", "Invoice - ", string.IsNullOrEmpty(bolNumber) ? Guid.NewGuid().ToString() : bolNumber, ".pdf");

				HttpResponse response = System.Web.HttpContext.Current.Response;
				response.Clear();
				response.ClearContent();
				response.ClearHeaders();

				response.ContentType = "application/pdf";
				response.AddHeader("content-disposition", "attachment;filename=" + filename);
				response.AddHeader("Content-Length", pdfByte.Length.ToString());
				response.AddHeader("Content-Description", "File Transfer");
				response.AddHeader("Content-Transfer-Encoding", "binary");

				response.BinaryWrite(pdfByte);
				response.Flush();
			}

		}
	}
}