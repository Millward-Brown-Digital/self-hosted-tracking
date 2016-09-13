/* 
	MBD Trackable values for later analysis of respondents and what they've seen. 
	campaignId is REQUIRED and supplied by MBD, the rest are optional: 
	
	bannerId	int (unique numeric id for this creative+placement)
	actionId	int (numeric identifier for type of action to be recorded)
	cell	byte (0=test, 1=control)
	siteId	text
	creativeId	text
	placementId	text 

	inviteHtml should contain <div id="mbd-invite"> as well as an accept and cancel link with id's 
	of mbd-accept and mbd-cancel respectively
	
	USAGE:
	var tmp = new MBD();
	tmp.RecordImpression(campaignId, { 
			creativeId: 'creative-123', 
			placementId: 'home-page-hero',
			actionID: 1
		});	
		
*/

function MBD(settings)
{
	var me = this;
	settings = settings || {};
	
	var defaults = {
		logging: false,
		canInvite: true,
		forceInvite: false,
		remoteTracking: false,
		minutesBetweenInvites: 60,
		hideDelay: 10000,
		randomInvitePercent: 0,
		localStorageKey: 'MBD',
		acceptTarget: '_self',
		acceptUrl: 'http://www.insightexpressai.com/ix/public/LocalTracking',
		remoteTrackingUrl: 'http://core.insightexpressai.com/adserver/adserveresi.aspx',
		
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
		',
		
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
		'
	}
	
	if (location.protocol === 'file:')
	{
		console.warn('MBD tracking may not function correctly when accessed from a file:// URL');
	}
	
	// apply settings or use defaults
	for(var key in defaults)
	{
		this[key] = settings[key] || defaults[key];
	}
		
	this.Log = function(str)
	{
		if (me.logging)
		{
			if (typeof(str) === 'object')
				console.log(str);
			else
				console.log('MBD: ' + str);
		}
	};
	

	this.AddQSParam = function(url, name, value) {
		var re = new RegExp("([?&]" + name + "=)[^&]+", "");
		function add(sep) {
			url += sep + name + "=" + encodeURIComponent(value);
		}
		function change() {
			url = myUrl.replace(re, "$1" + encodeURIComponent(value));
		}
		if (url.indexOf("?") === -1) {
			add("?");
		} else {
			if (re.test(url)) {
				change();
			} else {
				add("&");
			}
		}
		return url;
	}
	
	this.ShouldRandomInvite = function()
	{
		var rand =  Math.random() * 100;
		return rand < me.randomInvitePercent;
	}

	this.RecentlyInvited = function(campaignId)
	{
		return false;
	}
	
	this.AlreadyInvited = function(campaignId)
	{
		return false;
	}
	
	this.SetLastInviteDate = function(campaignId)
	{
		var data = me.GetData()
		data.invitedCampaigns[campaignId] = (new Date()).getTime();
		me.SaveData(data);
		me.Log('data set');
		me.Log(data);
	}
	
	this.GetData = function()
	{	
		var json = '{}';
		if (window.localStorage)
		{
			json = localStorage.getItem(me.localStorageKey) || '{}';
		}
		var data = JSON.parse(json);
		data.impressions = data.impressions || {};
		data.invitedCampaigns = data.invitedCampaigns || {};
		return data;
	}
	
	this.SetData = function(data)
	{
		if (window.localStorage)
			localStorage.setItem(me.localStorageKey, JSON.stringify(data));
	}
		
	this.SetOptOut = function(optout)
	{
		var data = me.GetData();
		data.optout = optout;
		me.SetData(data);
		if (optout)
			me.Log('User has opted out');
	}
		
	this.ClearTrackingData = function()
	{
		me.SetData({});
		me.Log('tracking data cleared');
	}
	
	this.RecordImpression = function(campaignId, details)
	{
		if (!window.localStorage)
		{
			console.warn('localStorage is not available. Cannot track impressions.');
			return;
		}
		
		var data = me.GetData();
		if (data.optout)
		{
			me.Log('user is opted out');
			return;
		}


		details = details || {};
		var impression = {};
		for(var key in details)
		{
			if (details[key])
			{
				impression[key] = details[key];
			}
		}
		impression.date =  new Date().getTime();
		impression.campaignId = campaignId;

		data.impressions[campaignId] = data.impressions[campaignId] || [];
		data.impressions[campaignId].push(impression);
		me.SetData(data);
		
		me.Log('Recorded new impression to campaign ' + campaignId + '. total impressions=' + data.impressions[campaignId].length);
		
		// ping a remote server with the ad impression details for remote logging
		if (me.remoteTracking)
		{
			var img = new Image();
			var url = me.remoteTrackingUrl;
			
			url = me.AddQSParam(url, 'campaignId', campaignId);
			for(var key in details)
			{
				url = me.AddQSParam(url, key, details[key]);
			}		
			img.src = url;
			me.Log('remote tracking url: ' + url);
		}
		
		
		var shouldInvite = false;
		if (me.forceInvite)
		{
			me.Log('forced invite');
			shouldInvite = true;
		}		
		else if (me.ShouldRandomInvite())
		{
			me.Log('random invite');
			shouldInvite = true;
		}
			
		if (shouldInvite)
			me.ShowInvite(campaignId);
	};
	
	
	this.ShowInvite = function(campaignId)
	{
		if (!me.canInvite || !window.localStorage)
			return;
		
		if (!campaignId)
		{
			me.Log('cannot invite - campaignId is not set');
			return;
		}
		
		if (me.RecentlyInvited(campaignId))
		{
			me.Log('Recently invited for campaign ' + campaignId);
			return;
		}
		
		if (me.AlreadyInvited(campaignId))
		{
			me.Log('Already invited for campaign ' + campaignId);
			return;
		}
		
		me.Log('Showing MBD invitation for campaign ' + campaignId);
		
		// append styles to the documentvar css = 'h1 { background: red; }',
		var head = document.head || document.getElementsByTagName('head')[0], style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = me.inviteCss;
		} else {
			style.appendChild(document.createTextNode(me.inviteCss));
		}
		head.appendChild(style);
		
		var div = document.createElement('div');
		div.innerHTML = me.inviteHtml;
		document.body.appendChild(div);
		me.wrapper = div;
		
		var invite = document.getElementById('mbd-invite');
		if (invite)
		{		
			// give the DOM a change to update before modifying classes
			setTimeout(function() {
				invite.classList.add('visible');
		
				var cancelLink = document.getElementById('mbd-cancel');
				if (cancelLink)
				{			
					cancelLink.addEventListener('click', function(e) {
						me.HideInvite();
						e.preventDefault();
					});
				}
				
				var acceptLink = document.getElementById('mbd-accept');
				if (acceptLink)
				{
					acceptLink.addEventListener('click', function(e) {
						me.Accept(campaignId);
						e.preventDefault();
					});
				}
				
			}, 10);
		}
		
		if (me.hideDelay)
		{
			setTimeout(function() { me.HideInvite(); }, me.hideDelay);
		}
	};
	
	this.GetImpressions = function(campaignId)
	{
		var data = me.GetData();
		if (campaignId)
			return data.impressions[campaignId] || [];
		return data.impressions;
	}
	
	this.HideInvite = function()
	{
		var invite = document.getElementById('mbd-invite');
		if (!invite)
			return;

		me.Log('Hiding invite');
		
		if (document.getElementById('mbd-optout'))
		{
			me.SetOptOut(document.getElementById('mbd-optout').checked);
		}
		
		// allow animation to run
		invite.classList.remove('visible');
		
		// remove the div from the DOM
		if (me.wrapper) {
			setTimeout(function() { me.wrapper.parentNode.removeChild(me.wrapper); }, 1000);
		}
	};
	
	this.Accept = function(campaignId) 
	{
		var form = document.createElement('FORM');
		form.method = 'POST';
		form.action = me.acceptUrl;
		form.target = me.acceptTarget;
		document.body.appendChild(form);
		
		var hidden = document.createElement('INPUT');
		hidden.type = 'hidden';
		hidden.name = 'impressions';
		hidden.value = JSON.stringify(me.GetData().impressions[campaignId]);
		form.appendChild(hidden);

		form.submit();
		form.parentNode.removeChild(form);
	};

	
	this.Log('MBD Initalized');
	this.Log(this);
	return this;
}



