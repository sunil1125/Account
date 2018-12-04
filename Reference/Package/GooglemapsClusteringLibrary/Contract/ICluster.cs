using GooglemapsClustering.Clustering.Data.Geometry;
using System.Collections.Generic;

namespace GooglemapsClustering.Clustering.Contract
{
	public interface ICluster
	{
		IList<P> RunCluster();

		IList<Line> GetPolyLines(); // Google Maps debug lines
	}
}