﻿using GooglemapsClustering.Clustering.Contract;
using GooglemapsClustering.Clustering.Extensions;
using GooglemapsClustering.Clustering.Utility;
using System;
using System.Runtime.Serialization;

namespace GooglemapsClustering.Clustering.Data.Geometry
{
	/// <summary>
	/// Point class, overwrite it, modify it, extend it as you like
	/// </summary>
	[Serializable]
	public class P : PBase, ISerializable, IP
	{
		public P()
		{
		}

		public P(double x, double y)
			: this()
		{
			X = x;
			Y = y;
		}

		public virtual P Normalize()
		{
			Lon = Lon.NormalizeLongitude();
			Lat = Lat.NormalizeLatitude();
			return this;
		}

		// Dist between two points on Earth
		public new virtual double Distance(double x, double y)
		{
			return MathTool.Haversine(this.Y, this.X, y, x);
		}

		public override string ToString()
		{
			return string.Format("Uid: {0}, X:{1}, Y:{2}, T:{3}, I:{4}, E:{5}",
				Uid, X, Y, T, I, E);
		}

		// Used for e.g. serialization to file
		public P(SerializationInfo info, StreamingContext ctxt)
		{
			this.C = 1;
			this.I = (int)info.GetValue("I", typeof(int));
            this.E = ((string)info.GetValue("E", typeof(string))).ToString();
			this.T = (int)info.GetValue("T", typeof(int));
			this.X = ((string)info.GetValue("X", typeof(string))).ToDouble();
			this.Y = ((string)info.GetValue("Y", typeof(string))).ToDouble();
		}

		// Data returned as Json
		public virtual void GetObjectData(SerializationInfo info, StreamingContext ctxt)
		{
			info.AddValue("I", this.I);
            info.AddValue("E", this.E);
			info.AddValue("T", this.T);
			info.AddValue("X", this.X);
			info.AddValue("Y", this.Y);
			info.AddValue("C", this.C);
			if (this.C == 1)
			{
				info.AddValue("N", this.Name);
			}
		}

		public int CompareTo(P other, int dimension)
		{
			if (dimension == 0)
				return this.X.CompareTo(other.X);
			if (dimension == 1)
				return this.Y.CompareTo(other.Y);
			throw new ArgumentException("Invalid dimension.");
		}
	}
}