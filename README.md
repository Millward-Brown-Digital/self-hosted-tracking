﻿# Millward Brown Digital
## Self-Host JavaScript Tracking

Use our client-based tracking technology hosted in your own servers.

Overview
---
The tracking object allows you to record tracking data in localStorage and then invite respondents from your site without using an external script libraries. All tracking code is editable and hosted on your own server.

Tracking is accomplished by creating an instance of the MBD tracking system with optionally specified default settings and then recording one or more impressions by called 

    .RecordImpression(campaignId, { additional: value, additional: value }).

campaignId will be assigned to your campaign as a unique value so that multiple campaigns can be tracked and so that when invitations are isssued, a record is recorded of which campaigns a respondent has been invited for. 

The invitation can be customized either by editing MBD.js or by passing override settings in the initialization call. 


Sample
---

    <script src="./MBD.js"></script>
    <script>
    	// Call in IIFE to avoid name conflicts
    	(function() {
      	    // this value to be provided by MBD
    		var campaignId = 12345; 
    		
    		var mbd = new MBD({
    			logging: true,
    			randomInvitePercent: 0,
    			remoteTracking: true
    		});
    		
    		// actually record an impression
    		mbd.RecordImpression(campaignId, {
    			creativeId: 'creative-123', 
    			placementId: 'home-page-hero',
    			actionID: 1
    		});
    		
    		// force an invite to show for campaign
    		mbd.ShowInvite(12345);
    	})();	
    </script>


