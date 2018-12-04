using GooglemapsClustering.Clustering.Data.Geometry;
using GooglemapsClustering.Clustering.Extensions;
using System;
using System.Collections.Generic;
using System.IO;

namespace GooglemapsClustering.Clustering.Utility
{
	/// <summary>
	/// Author: Kunuk Nykjaer
	/// </summary>
	public class Dataset
	{
		// Database simulation
		public static List<P> LoadDataset(string websitepath)
		{
			return LoadDatasetFromCsv(websitepath);
		}

		private static List<P> LoadDatasetFromCsv(string websitepath)
		{
			var filepath = websitepath;
			var fileInfo = new FileInfo(websitepath);
			if (!fileInfo.Exists)
			{
				throw new ApplicationException(string.Concat("File does not exists: ", fileInfo.FullName));
			}

			var lines = FileUtil.ReadFile(filepath);
			var dataset = new List<P>();

			for (int i = 0; i < lines.Count; i++)
			{
				var lines1 = lines[i];
				if (string.IsNullOrWhiteSpace(lines1)) continue;
				if (lines1.TrimStart().StartsWith("#")) continue;

				var arr = lines1.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries);
				if (arr.Length != 4) continue;

				var x = arr[0].ToDouble(); // lon
				var y = arr[1].ToDouble(); // lat
				var id = i;
				var type = i;

				var p = new P { X = x, Y = y, I = id, T = type };
				p.Normalize();
				dataset.Add(p);
			}
			return dataset;
		}
	}
}