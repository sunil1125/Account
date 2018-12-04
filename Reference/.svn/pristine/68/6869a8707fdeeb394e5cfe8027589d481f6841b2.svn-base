using GooglemapsClustering.Clustering.Data.Json;
using GooglemapsClustering.Clustering.Service;
using System.Collections.Generic;

namespace GooglemapsClustering.Clustering.Contract
{
	public interface IMapService
	{
		JsonMarkersReply GetMarkers(JsonGetMarkersInput input, IList<MinLeadInfo> leadList);

		JsonMarkerInfoReply GetMarkerInfo(string id);

		JsonInfoReply Info();
	}
}