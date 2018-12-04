using GooglemapsClustering.Clustering.Data.Geometry;
using System.Collections.Generic;

namespace GooglemapsClustering.Clustering.Contract
{
	public interface IPointsDatabase
	{
		IList<P> GetPoints();
	}
}