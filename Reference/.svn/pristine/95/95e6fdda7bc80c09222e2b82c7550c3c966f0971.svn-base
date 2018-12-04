using GooglemapsClustering.Clustering.Algorithm;
using GooglemapsClustering.Clustering.Contract;
using GooglemapsClustering.Clustering.Data;
using GooglemapsClustering.Clustering.Data.Config;
using GooglemapsClustering.Clustering.Data.Geometry;
using GooglemapsClustering.Clustering.Data.Json;
using GooglemapsClustering.Clustering.Extensions;
using GooglemapsClustering.Clustering.Utility;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace GooglemapsClustering.Clustering.Service
{
	public class MapService
	{
		//private readonly IPointsDatabase _pointsDatabase;
		//private readonly IMemCache _memCache;

		public MapService()
		{
		}

		//public MapService(IPointsDatabase pointsDatabase, IMemCache memCache)
		//{
		//	//_pointsDatabase = pointsDatabase;
		//	//_memCache = memCache;
		//}

		/// <summary>
		/// This method is called from client to create marker cluster object
		/// </summary>
		/// <param name="input">viewport</param>
		/// <returns></returns>
		public JsonMarkersReply GetMarkers(JsonGetMarkersInput input, IList<MinLeadInfo> leadList)
		{
			// Decorate with elapsed time
			var sw = new Stopwatch();
			sw.Start();
			var reply = GetMarkersHelper(input, leadList);
			sw.Stop();
			reply.Msec = sw.Elapsed.ToString();
			return reply;
		}

		/// <summary>
		/// Read Through Cache
		/// </summary>
		/// <param name="input"></param>
		/// <returns></returns>
		public JsonMarkersReply GetMarkersHelper(JsonGetMarkersInput input, IList<MinLeadInfo> leadList)
		{
			try
			{
				var nelat = Math.Round(input.nelat.ToDouble(), Numbers.Round);
				var nelon = Math.Round(input.nelon.ToDouble(), Numbers.Round);
				var swlat = Math.Round(input.swlat.ToDouble(), Numbers.Round);
				var swlon = Math.Round(input.swlon.ToDouble(), Numbers.Round);
				var zoomLevel = int.Parse(input.zoomLevel);
				var filter = input.filter ?? "";

				// values are validated there
				var inputValidated = new JsonGetMarkersReceive(nelat, nelon, swlat, swlon, zoomLevel, filter);

				var grid = GridCluster.GetBoundaryExtended(inputValidated);
				var cacheKeyHelper = string.Format("{0}_{1}_{2}", inputValidated.Zoomlevel, inputValidated.FilterHashCode(), grid.GetHashCode());
				//var cacheKey = CacheKeys.GetMarkers(cacheKeyHelper.GetHashCode());

				var reply = new JsonMarkersReply();
				//if (reply != null)
				//{
				//	// return cached data
				//	reply.Cache = true;
				//	return reply;
				//}

				inputValidated.Viewport.ValidateLatLon(); // Validate google map viewport input (should be always valid)
				inputValidated.Viewport.Normalize();
				var dataset = new List<P>();
				foreach (var item in leadList)
				{
					var x = Convert.ToDouble(item.Longitude); // lon
					var y = Convert.ToDouble(item.Latitude); // lat
					var id = item.LeadId;
                    var enId = item.EnLeadId;
					var type = item.LeadType;
					var name = item.AccountName;

					var p = new P { X = x, Y = y, I = id, E = enId, T = type, Name = name };
					p.Normalize();
					dataset.Add(p);
				}
				// Get all points from memory
				IList<P> points = dataset;

				#region fiter

				//Filter points
				points = FilterUtil.FilterByType(
					points,
					new FilterData { TypeFilterExclude = inputValidated.TypeFilterExclude }
					);

				#endregion fiter

				// Create new instance for every ajax request with input all points and json data
				ICluster clusterAlgo = new GridCluster(points, inputValidated);

				var clusteringEnabled = inputValidated.IsClusteringEnabled
					|| GmcSettings.Get.AlwaysClusteringEnabledWhenZoomLevelLess > inputValidated.Zoomlevel;

				// Clustering
				if (clusteringEnabled && inputValidated.Zoomlevel < GmcSettings.Get.ZoomlevelClusterStop)
				{
					#region cluster

					IList<P> markers = clusterAlgo.RunCluster();

					#endregion cluster

					reply = new JsonMarkersReply
					{
						Markers = markers,
						Polylines = clusterAlgo.GetPolyLines(),
					};
				}
				else
				{
					// If we are here then there are no clustering
					// The number of items returned is restricted to avoid json data overflow
					IList<P> filteredDataset = FilterUtil.FilterDataByViewport(points, inputValidated.Viewport);
					IList<P> filteredDatasetMaxPoints = filteredDataset.Take(GmcSettings.Get.MaxMarkersReturned).ToList();

					reply = new JsonMarkersReply
					{
						Markers = filteredDatasetMaxPoints,
						Polylines = clusterAlgo.GetPolyLines(),
						Mia = filteredDataset.Count - filteredDatasetMaxPoints.Count,
					};
				}

				// if client ne and sw is inside a specific grid box then cache the grid box and the result
				// next time test if ne and sw is inside the grid box and return the cached result
				//if (GmcSettings.Get.CacheServices) _memCache.Set(reply, cacheKey, TimeSpan.FromMinutes(10)); // cache data

				return reply;
			}
			catch (Exception ex)
			{
				return new JsonMarkersReply
				{
					Ok = "0",
					EMsg = string.Format("MapService says: exception {0}", ex.Message)
				};
			}
		}

		//public JsonMarkerInfoReply GetMarkerInfo(string input)
		//{
		//	// Decorate with elapsed time
		//	var sw = new Stopwatch();
		//	sw.Start();
		//	var reply = GetMarkerInfoHelper(input);
		//	sw.Stop();
		//	reply.Msec = sw.Elapsed.ToString();
		//	return reply;
		//}

		/// <summary>
		/// Read Through Cache
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		//public JsonMarkerInfoReply GetMarkerInfoHelper(string id)
		//{
		//	if (string.IsNullOrWhiteSpace(id))
		//	{
		//		return new JsonMarkerInfoReply { Ok = "0", EMsg = "MapService says: params is invalid" };
		//	}
		//	try
		//	{
		//		var uid = int.Parse(id);

		//		var cacheKey = CacheKeys.GetMarkerInfo(uid);
		//		var reply = _memCache.Get<JsonMarkerInfoReply>(cacheKey);
		//		if (reply != null)
		//		{
		//			// return cached data
		//			reply.Cache = true;
		//			return reply;
		//		}

		//		P marker = _pointsDatabase.GetPoints().SingleOrDefault(i => i.I == uid);

		//		reply = new JsonMarkerInfoReply { Id = id };
		//		reply.BuildContent(marker);

		//		if (GmcSettings.Get.CacheServices) _memCache.Set(reply, cacheKey, TimeSpan.FromMinutes(10)); // cache data

		//		return reply;
		//	}
		//	catch (Exception ex)
		//	{
		//		return new JsonMarkerInfoReply
		//		{
		//			Ok = "0",
		//			EMsg = string.Format("MapService says: Parsing error param: {0}", ex.Message)
		//		};
		//	}
		//}

		//public JsonInfoReply Info()
		//{
		//	// Decorate with elapsed time
		//	var sw = new Stopwatch();
		//	sw.Start();
		//	var reply = InfoHelper();
		//	sw.Stop();
		//	reply.Msec = sw.Elapsed.ToString();
		//	return reply;
		//}

		//public JsonInfoReply InfoHelper()
		//{
		//	return new JsonInfoReply
		//	{
		//		DbSize = _pointsDatabase.GetPoints().Count,
		//		FirstPoint = _pointsDatabase.GetPoints().FirstOrDefault()
		//	};

		//}

		//private T ReadThroughCache<T>(string key, Func<T> fn, TimeSpan cacheSpan)
		//	where T : class, new()
		//{
		//	var data = _memCache.Get<T>(key);
		//	if (data == null)
		//	{
		//		data = fn.Invoke();
		//		if (data != null) _memCache.Set(data, key, cacheSpan);
		//	}
		//	return data;
		//}
	}
}