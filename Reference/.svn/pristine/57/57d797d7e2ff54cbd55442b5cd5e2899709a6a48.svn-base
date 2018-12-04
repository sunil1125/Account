namespace GooglemapsClustering.Clustering.Service
{
	public class MinLeadInfo
	{
        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="leadId">leadId</param>
        /// <param name="accountName">accountName</param>
        /// <param name="latitude">latitude</param>
        /// <param name="longitude">longitude</param>
        /// <param name="leadType">leadType</param>
        /// <param name="isFlagged">isFlagged</param>
        /// <param name="accountId">isFlagged</param>
        /// <param name="isHiddenByMe">isFlagged</param>
        public MinLeadInfo(int leadId, string accountName, decimal latitude, decimal longitude, int leadType, bool isFlagged, int accountId,int leadTypeCount,bool isHiddenByMe, string enLeadId = "")
		{
			LeadId = leadId;
			AccountName = accountName;
			Latitude = latitude;
			Longitude = longitude;
			LeadType = leadType;
			IsFlagged = isFlagged;
			AccountId = accountId;
            LeadTypeCount=leadTypeCount;
            IsHiddenByMe = isHiddenByMe;
            EnLeadId = enLeadId;
        }

		/// <summary>
		/// Constructor
		/// </summary>
		public MinLeadInfo()
		{

		}

		/// <summary>
		/// Gets or sets LeadId
		/// </summary>
		public int LeadId { get; set; }

        /// <summary>
		/// Gets or sets EnLeadId
		/// </summary>
		public string EnLeadId { get; set ; }

        /// <summary>
        /// Gets or sets AccountName
        /// </summary>
        public string AccountName { get; set; }

		/// <summary>
		/// Gets or sets Latitude
		/// </summary>
		public decimal Latitude { get; set; }

		/// <summary>
		/// Gets or sets Longitude
		/// </summary>
		public decimal Longitude { get; set; }

		/// <summary>
		/// Gets or sets LeadType
		/// </summary>
		public int LeadType { get; set; }

		/// <summary>
		/// Gets or sets the ID of the Country
		/// </summary>
		public bool IsFlagged { get; set; }

		/// <summary>
		/// Gets or sets the ID of the Country
		/// </summary>
		public int AccountId { get; set; }

        /// <summary>
        /// Gets or sets the lead type count.
        /// </summary>
        /// <value>
        /// The lead type count.
        /// </value>
        public int LeadTypeCount { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is hidden by me.
        /// </summary>
        /// <value>
        /// <c>true</c> if this instance is hidden by me; otherwise, <c>false</c>.
        /// </value>
        public bool IsHiddenByMe { get; set; }
    }
}