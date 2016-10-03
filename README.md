# Millward Brown Digital
## Self-Host JavaScript Tracking

Use our client-based tracking technology hosted in your own servers.

### Overview
The tracking object allows you to record tracking data in localStorage and then invite respondents from your site without using an external script libraries. All tracking code is editable and hosted on your own server.

Tracking is accomplished by creating an instance of the MBD tracking system with optionally specified default settings and then recording one or more impressions by called 

    .RecordImpression(campaignId, { additional: value, additional: value }).

campaignId will be assigned to your campaign as a unique value so that multiple campaigns can be tracked and so that when invitations are isssued, a record is recorded of which campaigns a respondent has been invited for. 

The invitation can be customized either by editing MBD.js or by passing override settings in the initialization call. 

###Initial Settings
When initializing a new MBD object, a number of settings can be configured.

Defaults:
```javascript
{
    logging: false, //Enable console logging for debugging purposes
    canInvite: true, //Allow invite notices to be generated
    forceInvite: false, //Automatically show an invite message when recording an impression
    allowRepeatInvites: true, //Allow more than one invite message to show for a given campaign
    remoteTracking: false, //Enable ping to a remote URL for external tracking
    minutesBetweenInvites: 60, //Timespan in minutes to disable next invite from being generated
    hideDelay: 10000, //Timespan in ms to keep an invite notice visible (10 seconds default)
    randomInvitePercent: 0, //Percentage chance to generate an invite notice when an impression is recorded (value 0 - 100)
    localStorageKey: 'MBD', //Unique value to identify MBD impression data in local storage
    acceptTarget: '_self', //Target to where a survey is loaded if a user accepts a survey invite
    acceptUrl: 'http://www.insightexpressai.com/ix/public/LocalTracking', //MBD Routing URL for delivery to a survey
    remoteTrackingUrl: 'http://core.insightexpressai.com/adserver/adserveresi.aspx', //MBD impression tracking URL
    inviteCss: '\
			#mbd-invite { width:340px; padding:20px; font-size:15px; box-sizing:border-box; background:#F4F4F4; position:fixed; bottom: 0; right:8px;    box-shadow: 0 0 5px rgba(0, 0, 0, 0.45); opacity:0; transition: all 1s; }\
			#mbd-invite.visible { opacity:1;  }\
			#mbd-invite div { padding:0.5em 1em; background:#D8D8D8; border-radius:4px; }\
			#mbd-invite p { margin:1em 0; }\
			#mbd-invite a { margin:1em 0; }\
			#mbd-invite button {  margin-left:0;     transition: all .3s ease 0s; background: #6A8012;    color: #fff;    border: none;    font-size: 20px;    padding: 10px 20px; }\
			#mbd-invite button:hover { background: #A2AD00;    }\
			#mbd-invite label { color: #999; }\
			#mbd-cancel { float:right; }\
		', // CSS for the invite message
        inviteHtml: '\
			<div id="mbd-invite">\
				<img itemprop="logo"  src="https://www.millwardbrown.com/Sitefinity/WebsiteTemplates/Basic/App_Themes/MB_Basic/img/design/MB-logo-horizontal.png">\
				<p>Please pardon our interuption</p>\
				<div>\
				<p>You have been randomly selected to participate in a brief online survey. <br><br>Would you take a few minutes and help us before continuing?</p>\
				</div>\
				<p>\
				<button id="mbd-accept">Take a survey</button>\
				<a href="#" id="mbd-cancel">no thanks</a>\
				</p>\
				<p>\
				<label><input id=mbd-optout type=checkbox> don\'t ask me again<label>\
				</p>\
			</div>\
		' // HTML for the invite message
}
```
    
Usage:

```
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
```
Note:   If not using the default, the "inviteHtml" setting should contain <div id="mbd-invite"> as well as
        an accept and cancel link with id's of "mbd-accept" and "mbd-cancel" respectively.
        
        This demo works in all browsers when served from a webserver, but will not function correctly 
        within Internet Explorer when served from a local filesystem due to local strage not being available.


###API Reference

```
void    RecordImpression(campaignId, {detail1: value1, detail2: value2 ... }): 
            Records impression data for a given campaignId. Campaign Id is required. The detail
            data is optional and can be anything you need. Useful details to include:
                bannerId:    int (unique numeric id for this creative+placement)
                actionId:    int (numeric identifier for the type of action recorded)
                cell:        byte (0=test, 1=cotnrol)
                siteId:      text (text identifier for the site serving the impression)
                creativeId:  text (text identifier for the creative)
                placementId: text (text identifier for the placement)
            
                mbd.RecordImpression(12345,
                    {
                        bannerId: 98765,
                        actionId: 1,
                        cell: 1,
                        siteId: 'ESPN.com',
                        creativeId: 'A2133767',
                        placementId: 'P191241'
                    }
                );
            
            If the remote tracking setting is turned on, this function will also ping the URL specified in
            "remoteTrackingUrl" with the supplied details passed as query string values. 
```

```
void    ShowInvite(campaignId): 
        Forces showing of an invite if a user qualifies per the supplied settings:
            minutesBetweenInvites: user cannot have received an invite notice less than x minutes ago.
            allowRepeatInvites: if false, user must have never had a prior invite for this campaign
            canInvite: must be true
            
            Additionally local storage must be enabled on the user's browser. 
```

```
[]      GetImpressions(campaignId): 
            Returns an array of impression objects containing impression data that
            has been recorded for the given campaign.
```

```
[]      GetData(): 
            Returns an array of campaign objects containing impression data that has
            been recorded for each campaign.
```

```
bool    RecentlyInvited(campaignId): 
            Returns whether or not the user has had an invite message shown recently for
            this campaignId, based on the minutesBetweenInvites setting.
```

```
bool    AlreadyInvited(campaignId): 
            Returns whether or not the user has ever seen an invite message for this
            campaignId.
```

```
void    ClearTrackingData(): 
            Resets all impression data recorded in local storage. 
```



