    var g_pms = [],                   // Array to hold satellite objects
        g_TLE = [],
        g_numOfSats = 0,              // Number of satellites
        g_altitudeMode = false,        // altitude mode: true = absolute,  false = clampToGround
        g_extrudeMode = true,         // extrude:  true = on

        g_updatePeriod = 1000,        // Time between calls to fetchNewData function (in ms)  HBC originally 1000
        g_features, g_features_l, g_feature_r,                  // performance hack. Variable to hold ge.getFeatures()
        g_speed = 1,                // set this to 1 to update the satellite in real time
 
        g_curTime,
        g_fetchNew = null,
        g_lastMillis,
        g_lastUpdate,
        position,
        slider,
        xmlHttp;
        resetinProgress = false;
        
        earthradius = 20925524.9;    //earth radus in feet
        eradm = 6378100;

       
     function getFile(url)
     {
       xmlHttp=GetXmlHttpObject();
       if (xmlHttp==null)
       {
         alert ("Your browser does not support AJAX!");
         return;
       }
       xmlHttp.onreadystatechange=stateChanged;
       xmlHttp.open("GET",url,true);
       xmlHttp.send(null);
     }
 
 
     function GetXmlHttpObject()
     {
       var xmlHttp=null;
       try
       {
         xmlHttp=new XMLHttpRequest();  // Firefox, Opera 8.0+, Safari
       }
       catch (e)
       {
 
         try  // Internet Explorer
         {
           xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
         }
         catch (e)
         {
           xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
         }
       }
       return xmlHttp;
     }
 
 

     function stateChanged()
     {
       if (xmlHttp.readyState==4)
       {
       g_TLE = xmlHttp.responseText.split('\n');
 
       g_features = ge.getFeatures();
       g_getview = ge.getView();
       createStyles();       
       ge.getWindow().setVisibility(true); 

       var g_totsatsinfile = 0;
       var g_iridium = 0;
       var g_cosmos = 0;

       while (g_TLE[g_totsatsinfile*3])
       {
         var name = trim(g_TLE[g_totsatsinfile*3]);
         if ((name.charAt(0) == "C") && (g_cosmos < 150))
         {
           g_pms[g_numOfSats] = new Satellite(g_numOfSats,name,g_TLE[1+g_totsatsinfile*3],g_TLE[2+g_totsatsinfile*3], 1);
           g_numOfSats++;
           g_cosmos++;
         }         
         else if ((name.charAt(0) == "I") && (g_iridium < 150))
         {
           g_pms[g_numOfSats] = new Satellite(g_numOfSats,name,g_TLE[1+g_totsatsinfile*3],g_TLE[2+g_totsatsinfile*3]);
           g_numOfSats++;
           g_iridium++;
         } 
         g_totsatsinfile++;
       }
       



       resetTime();

       ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);
       ge.getOptions().setStatusBarVisibility(true);
       updateOptions();

       var la = ge.createLookAt(''); 
       la.set(0, 0, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 20000000); 
       ge.getView().setAbstractView(la);     
      
       //google.earth.addEventListener(ge.getGlobe(), "mousedown", function(event) { draw(event); }); 
       //google.earth.addEventListener(ge.getGlobe(), "mousemove", function(event) { movePMLoc(event); }); 
       }
     }

 	var my_lat = 40.9583819592;
	var my_lng = -72.9725646973;
	var cannonball;
	var pm_cnt = 79;
     
function get_munitions(){
	return animal_munitions;
}

function change_munitions(munind){
	munition_index = munind;
	
	//Update the ammunition being used
	var am_html = '<img src="/img/' + munitions[munind][2] + '"></img><input id="get_passes" type="button" value="Armory" onclick="movetoarmory()"></input><br>';
	el('currmunition').innerHTML = am_html;
}

function load_muntitions(){
	//mun_html = '<table>';
	munitions = get_munitions();
	//for(var l = 0; l < munitions.length; l += 1){
	//	mun_html += '<tr><td><img src="/img/' + munitions[l][2] + '"></img></td><td>' + 
	//	            '<a href="javascript:void(0)" onClick="change_munitions(' + l + ')">' +
	//	            munitions[l][3] + '</a></td></tr>';
	//}
	//mun_html += '</table>';
	//el('munitions').innerHTML = mun_html;
}


var req;
function save_hit(){
	hit_fb();
	//Save the basics of the hit so the shot can be recreated
	   //alert('Setting up request');
	   //Remove all mapped calls before indices change	   
	   var shot_params = "op=" + encodeURIComponent('store_shot') +
	             "&clat=" + encodeURIComponent(pm1.point.getLatitude().toPrecision(6)) +
	             "&clng=" + encodeURIComponent(pm1.point.getLongitude().toPrecision(6)) +
	             "&tlat=" + encodeURIComponent(pm2.point.getLatitude().toPrecision(6)) +
	             "&tlng=" + encodeURIComponent(pm2.point.getLongitude().toPrecision(6)) +
	             "&shot_heading=" + encodeURIComponent(shot_heading.toPrecision(6)) +
	             "&shot_angle=" + encodeURIComponent(shot_angle.toPrecision(6)) +
	             "&shot_vel=" + encodeURIComponent(shot_vel.toPrecision(6));
	   //alert('url is ' + url);
       //Now send the scores to the db
       if (typeof XMLHttpRequest != "undefined") {
           req = new XMLHttpRequest();
       } else if (window.ActiveXObject) {
           req = new ActiveXObject("Microsoft.XMLHTTP");
       }
       
       req.open("POST", '/gebang', true);
       req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
       req.setRequestHeader("Content-length", shot_params.length);
       req.setRequestHeader("Connection", "close");

       
       req.onreadystatechange = storegame_cb;
       req.send(shot_params);
	   
	
	
	
	//in the receive code, present the keyed link to the user so they can send it to others
	//who can replay the shot
	
	
}

function storegame_cb(){
    if (req.readyState == 4) {
        if (req.status == 200) {
              //alert('Entered et_cb with ' + req.responseText);
        	  var game_base = 'http://copaseticflows.appspot.com/gebang?game=';
              el('munitions').innerHTML = 'Saved game link:<br><a href="' + game_base + 
                                           req.responseText + '">' + game_base + req.responseText + '</a>';
        }
        else{
          alert('storegame reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }
        
}



function bang_begin(){
    //create the cannonball
    //lat, lng, alt, vel(m/s), elev, bearing, mark
    //cannonball = new Satellite(my_lat,my_lng,100,20,270,1);
    //resetTime();
	
	//setup the munitions list
	load_muntitions();
	
	//setup the default ammunition
	change_munitions(0);
	
	//setup the countdown numbers for replays
	setupcountdown();
	
	pm_cnt += 1;
    pm1 = new PM(pm_cnt);
	pm_cnt += 1;
    pm2 = new PM(pm_cnt);
 // Define a custom icon.
    var icon = ge.createIcon('');
    icon.setHref('http://maps.google.com/mapfiles/ms/micons/red-pushpin.png');
    var style = ge.createStyle(''); //create a new style
    style.getIconStyle().setIcon(icon); //apply the icon to the style
    pm2.setStyle(style); //apply the style to the placemark
	  //var point = ge.createPoint('');
	  //point.setLatitude(my_lat);
	  //point.setLongitude(my_lng);
	  //placemark.setGeometry(point);
	  //placemark.setName('Set Location');
	  
      //ge.getFeatures().appendChild(placemark);
    pm1.placemark.setVisibility(true)
    pm1.setLoc(my_lat, my_lng, ANIM_ALTITUDE);
    
    pm2.placemark.setVisibility(true);
    pm2.setLoc(my_lat - 10, my_lng - 10, ANIM_ALTITUDE);

	  // Look at the placemark we created.
	  var la = ge.createLookAt('');
	  la.set(my_lat, my_lng, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 10000000);
	  ge.getView().setAbstractView(la);
	  
      //setup_marker_move_1();	  
	  
      ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
      ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);
      ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
      ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);    
      ge.getOptions().setScaleLegendVisibility(true);
      
      //Setup the targeting map
      //init_map();
      //center_targeting();
      
      //load the armory
      addHitModel('flower', 'http://copaseticflows.appspot.com/img/flower2.dae', 40.9141, -113.691, 0, .002, .001);      
      addHitModel('bomb', 'http://copaseticflows.appspot.com/img/practicebomb4.dae', 40.9141, -113.6998, 1000, .006, .003);      
      addHitModel('boulder', 'http://copaseticflows.appspot.com/img/verticalboulder.dae', 40.9071, -113.7096, 0, .0025, .005);   
      
      //setup_armory_select();
}

function addHitModel(name, hlink, lat, lng, alt, mlat, mlng){
    var placemark = ge.createPlacemark('');
    placemark.setName(name);

    // Placemark/Model (geometry)
    var model = ge.createModel('');
    placemark.setGeometry(model);

    // Placemark/Model/Link
    var link = ge.createLink('');
    link.setHref(hlink);
    model.setLink(link);        

    var loc = ge.createLocation('');
    loc.setLatitude(lat);
    loc.setLongitude(lng);
    loc.setAltitude(alt);
    model.setLocation(loc);

    // add the model placemark to Earth
    ge.getFeatures().appendChild(placemark);
    
    //add a select button a little in front of it
    var splacemark = ge.createPlacemark('');
    splacemark.setName('tsel' + name);
    var spoint = ge.createPoint('');
    splacemark.setGeometry(spoint);

    // Define a custom icon.
       var icon = ge.createIcon('');
       icon.setHref('http://copaseticflows.appspot.com/img/selectm.png');
       var style = ge.createStyle(''); //create a new style
       style.getIconStyle().setIcon(icon); //apply the icon to the style
       style.getIconStyle().setScale(2.0);
       splacemark.setStyleSelector(style); //apply the style to the placemark

       splacemark.setVisibility(false);
       var sloc = ge.createLocation('');
       spoint.setLatitude(lat - mlat);
       spoint.setLongitude(lng + mlng);
       //spoint.setLocation(sloc);
       ge.getFeatures().appendChild(splacemark);
       
       armory_select.push(splacemark);
       
       //add a munitions selection function to the placemark
       google.earth.addEventListener(splacemark, 'mousedown', munition_select);

}

armory_select = [];

function munition_select(event){
  sel_name = event.getTarget().getName().substr(4);
  el('munitions').innerHTML = sel_name;
  
  //Get the index for this selection
  var munindex = 0;
  for(var i = 0; i < munitions.length; i+= 1){
	  //get the name of the munition
	  if(munitions[i][3] == sel_name){
		  munindex = i;
	  }
  }
  change_munitions(munindex);
  
  //turn off all the munitions select buttons and move back to the cannon
  armory_select_visible(false);
  
  var can_latlng = new GLatLng(pm1.point.getLatitude(), pm1.point.getLongitude());
  setpoint_cannon(can_latlng);
  
  
  event.preventDefault();

}


function setup_armory_select(){
	  // Listen for mousedown on the window (look specifically for point placemarks).
	  google.earth.addEventListener(ge.getWindow(), 'mousedown', armory_hit);
//	  google.earth.addEventListener(ge.getWindow(), 'mousedown', function(event) {
//	    if (event.getTarget().getType() == 'KmlPlacemark' &&
//	        event.getTarget().getGeometry().getType() == 'model') {
//	      var placemark = event.getTarget();
//	      alert('Clicked on ' + placemark.getName());
//	      //dragInfo = {
//	      //  placemark: event.getTarget(),
//	      //  dragged: false
//	      //};
//	    }
//	  });
	
}

function armory_hit(event){
    if (event.getTarget().getType() == 'KmlPlacemark' &&
	        event.getTarget().getGeometry().getType() == 'model') {
	      var placemark = event.getTarget();
	      alert('Clicked on ' + placemark.getName());
	      //dragInfo = {
	      //  placemark: event.getTarget(),
	      //  dragged: false
	      //};
	    }
}


function setup_marker_move_1(){
	  // Listen for mousedown on the window (look specifically for point placemarks).
	  google.earth.addEventListener(ge.getWindow(), 'mousedown', function(event) {
		  el('munitions').innerHTML = event.getTarget().getType();
		  if(event.getTarget().getType() == 'KmlPlacemark'){
	    	  //alert(event.getTarget().getGeometry().getType());
	    	  el('munitions').innerHTML = event.getTarget().getGeometry().getType();
	      }
		  if (event.getTarget().getType() == 'KmlPlacemark' &&
	        event.getTarget().getGeometry().getType() == 'KmlModel') {
	      var placemark = event.getTarget();
	      dragInfo = {
	        placemark: event.getTarget(),
	        dragged: false
	      };
	    }
	  });

	  // Listen for mousemove on the globe.
	  google.earth.addEventListener(ge.getGlobe(), 'mousemove', function(event) {
	    if (dragInfo) {
	      event.preventDefault();
	      var point = dragInfo.placemark.getGeometry();
	      point.setLatitude(event.getLatitude());
	      point.setLongitude(event.getLongitude());
	      my_lat = event.getLatitude();
	      my_lng = event.getLongitude();
	      dragInfo.dragged = true;
	    }
	  });

	  // Listen for mouseup on the window.
	  google.earth.addEventListener(ge.getWindow(), 'mouseup', function(event) {
	    if (dragInfo) {
	      if (dragInfo.dragged) {
	        // If the placemark was dragged, prevent balloons from popping up.
	        event.preventDefault();
	      }

	      dragInfo = null;
	    }
	  });

}



var animRunning = false;
var ANIM_ALTITUDE = 100;
var up_vel = 1000; //m/s
var alt  = ANIM_ALTITUDE;
var tick_cnt = 0;
var camera;
var pm1;
var point;
var shot_heading = 80.0;
var shot_vel = 0.0;
var shot_angle = 0.0;
var shot_cnt = 0;
var across_vel = 1000.0;
var time_step = 0;
var init_time_step = 2;
var slowed = false;

var scamlat;
var scamlng;
var scamalt;
var scamheading;   
var scamtilt;




function startAnimationClick() {
	  if (!animRunning) {
		//determine what size to make the time steps per frame
		//determine the rough x distance,  then use the 
		//across_vel and the number of time steps to figure out the basic 
		//size of the time step
	    ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);
	    animRunning = true;

	    camera = ge.createCamera('');
	    camera.set(my_lat, my_lng, ANIM_ALTITUDE, ge.ALTITUDE_RELATIVE_TO_GROUND,
	    		shot_heading, 80, 0);
	    //ge.getView().setAbstractView(camera);
	    var cam_view = show_field(pm1, pm2, 1.0, 1.5);
		  scamlat = cam_view[0];
		  scamlng = cam_view[1];
		  scamalt = cam_view[2];
    scamheading = (shot_heading+90)%360;   
    scamtilt = 80;
	      pm1.point.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
	    

	        ////////////////////////////////////////////////////////////////////////////////////////
	        //Add a bomb as well
	        //pm_cnt += 1;
	        //This will be used if the camera is in bomb follow view
	        var bombmark = ge.createPlacemark('');
	        bombmark.setName('model' + pm_cnt);

	        // Placemark/Model (geometry)
	        var model = ge.createModel('');
	        bombmark.setGeometry(model);

	        // Placemark/Model/Link
	        var link = ge.createLink('');
	        link.setHref(munitions[munition_index][4]);
	        model.setLink(link);        
	        model.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);

	        var loc = ge.createLocation('');
	        loc.setLatitude(my_lat);
	        loc.setLongitude(my_lng);
	        loc.setAltitude(-100);
	        model.setLocation(loc);

	        // add the model placemark to Earth
	        ge.getFeatures().appendChild(bombmark);
	        curr_bomb = bombmark;
	        //end of the bomb addition code
	        //the addition of the bomb needs to be reomved from bang_hit
	        //the bomb added here will be moved to the hit location
	        
	        ///////////////////////////////////////////////////////////////////////
	        //add a bomb placemark issue to watch in the horizon view
	        ///////////////////////////////////////////////////////////////////////
	        
	    
	    
	    
	    //camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);
	    alt = ANIM_ALTITUDE;
	    tick_cnt = 1;
	    //time_step = 5;
	    google.earth.addEventListener(ge, 'frameend', tickAnimation);

	    // start it off
	    tickAnimation();
	  }
	}

	function stopAnimationClick() {
	  if (animRunning) {
	    google.earth.removeEventListener(ge, 'frameend', tickAnimation);
	    animRunning = false;
	    startLoftAnimationClick();
	  }
	  //Now zoom the view back out to show the hit and the target
	  //show_field(pm2, latest_hit);
	}

	function hit_fb(){
	    if(target_id != ''){  
		FB.ui({
	          method: 'send',
	          to: target_id,
	          name: 'Hit by Cannon',
	          link: 'http://copaseticflows.appspot.com/gebang',
	          });
	    }
		//FB.ui(
		//   {
		//     method: 'stream.publish',
		//     message: 'Just passed the technician class ham radio practice exam on Ham Shack from Copasetic Flows http://copaseticflows.appspot.com/hamtest',
		//     user_message_prompt: 'Congratulations you passed the exam!  Tell your friends!'
		//   }
		//  );
		}
	
	
	var latest_hit;
	function bang_hit(lat, lng){
		//First, fade all the previous shots
		for(var i = 0; i < hacnt; i += 1){
			   hitarray[i].placemark.setVisibility(false);
		       var icon = ge.createIcon('');
		       icon.setHref('http://copaseticflows.appspot.com/img/' + munitions[munitionsarray[i]][1] );
		       var style = ge.createStyle(''); //create a new style
		       style.getIconStyle().setIcon(icon); //apply the icon to the style
		       hitarray[i].setStyle(style); //apply the style to the placemark
			   hitarray[i].placemark.setVisibility(true);
		}
		
		
		// Create the GroundOverlay
		//var groundOverlay = ge.createGroundOverlay('');
		var splat_size = 0.002;

		// Specify the image path and assign it to the GroundOverlay
		//var icon = ge.createIcon('');
		//icon.setHref('http://copaseticflows.appspot.com/img/' + munitions[munition_index][0]);
		//groundOverlay.setIcon(icon);

		// Specify the geographic location
		var latLonBox = ge.createLatLonBox('');
		latLonBox.setBox(lat-splat_size, lat+splat_size, lng-splat_size, lng+splat_size, 0);
		//groundOverlay.setLatLonBox(latLonBox);

		// Add the GroundOverlay to Earth
		//ge.getFeatures().appendChild(groundOverlay);
		
		//Add a new placemark at the location as well
	    pm_cnt += 1;
		var hit_pm = new PM(pm_cnt);
	    // Define a custom icon.
	       var icon = ge.createIcon('');
	       icon.setHref('http://copaseticflows.appspot.com/img/' + munitions[munition_index][0]);
	       var style = ge.createStyle(''); //create a new style
	       style.getIconStyle().setIcon(icon); //apply the icon to the style
	       hit_pm.setStyle(style); //apply the style to the placemark

	       hit_pm.placemark.setVisibility(true);
	       hit_pm.setLoc(lat, lng, ANIM_ALTITUDE);
	       
	       
	       latest_hit = hit_pm;
	       
        hitarray[hacnt] = hit_pm;
        munitionsarray[hacnt] = munition_index;
        
        ////////////////////////////////////////////////////////////////////////////////////////
        //Add a bomb as well
        //pm_cnt += 1;
        var placemark = ge.createPlacemark('');
        placemark.setName('model' + pm_cnt);

        // Placemark/Model (geometry)
        var model = ge.createModel('');
        placemark.setGeometry(model);

        // Placemark/Model/Link
        var link = ge.createLink('');
        link.setHref(munitions[munition_index][4]);
        model.setLink(link);        

        var loc = ge.createLocation('');
        loc.setLatitude(lat);
        loc.setLongitude(lng);
        loc.setAltitude(-100);
        model.setLocation(loc);

        // add the model placemark to Earth
        ge.getFeatures().appendChild(placemark);

        //now update the hit results
        //first find out if the target was hit
		//latLonBox.setBox(lat-splat_size, lat+splat_size, lng-splat_size, lng+splat_size, 0);
        //pm2.point.getLatitude(), pm2.point.getLongitude()
        var tlat = pm2.point.getLatitude();
        var tlng = pm2.point.getLongitude();
        var hittarget = false;
        if((tlat < lat+splat_size) && (tlat > lat-splat_size) && (tlng < lng+splat_size) && 
           (tlng > lng-splat_size)){
        	hittarget = true;
        }
        var hitres_html = '';
        var b_html = '';
        hitres_html += 'Shot number ' +  shot_cnt + '<br>';
        if(hittarget){
        	hitres_html += '<b>Hit!!!<br>You hit the target!</b>'
        }
        else{
        	var missdistance = new geo.Point(tlat, tlng)
            .distance(new geo.Point(lat, lng));
        	b_html += 'missed by ' + missdistance.toFixed(1) + ' meters';
        }
        el('hitresult').innerHTML = hitres_html;
        
        
        
        
        //Add a balloon with details about the shot
       var htmlballoon = b_html + '<br>' + 'angle: ' + shot_angle + '<br>heading: ' + shot_heading + '<br>velocity: ' +
                         shot_vel; 
       hitarray[hacnt].placemark.setDescription(htmlballoon);
 	    //   var balloon = ge.createHtmlStringBalloon('');
	    //   balloon.setFeature(hitarray[hacnt].placemark);
	    //   balloon.setContentString(htmlballoon);
	    //   balloon.setMinWidth(200);
	    //   balloon.setMaxHeight(400);
	    //   balloon.setCloseButtonEnabled(false);	      
        
        
        
        
        hacnt += 1;
        
        
	}

    function show_field(spm1, spm2, aspectRatio, scaleRange){
 	   //now zoom back out to see the hit location and the target in a single view and renorth the map
	       //gex.dom.clearFeatures();
           
	       //var folder = gex.dom.addFolder([
	       //  gex.dom.buildPointPlacemark(latest_hit.point.getLatitude(), latest_hit.point.getLongitude()),
	       //  gex.dom.buildPointPlacemark(pm2.point.getLatitude(), pm2.point.getLongitude())
	       //]);

	       //var bounds = gex.dom.computeBounds(folder);
	       //gex.view.setToBoundsView(bounds, { aspectRatio: 1.0 });
    	
    	//make the bounding box for the view.
    	//it wants a SW and NE coordinate pair
    	//make two new latlngs using the smallest lat and smallest lng
    	//and largest lat and largest lng
    	var swlat = Math.min(spm2.point.getLatitude(), spm1.point.getLatitude());
    	var swlng = Math.min(spm2.point.getLongitude(), spm1.point.getLongitude());
    	var nelat = Math.max(spm2.point.getLatitude(), spm1.point.getLatitude());
    	var nelng = Math.max(spm2.point.getLongitude(), spm1.point.getLongitude());
    	
    	
    	
//        var sw = new GLatLng(spm2.point.getLatitude(), spm2.point.getLongitude());
//        var ne = new GLatLng(spm1.point.getLatitude(), spm1.point.getLongitude());
        var sw = new GLatLng(swlat, swlng);
        var ne = new GLatLng(nelat, nelng);
    	//Get the distance between the two points
        var hd = sw.distanceFrom(ne);
        hd = hd * 2.0;
        //Compensate for points on different sides of the planet
        //if(hd > eradm){
        //	hd = eradm * 0.9;
        //}

        //Calculate the altitude to move to
        var costerm = Math.cos((hd/eradm));
        var intm = (eradm-eradm*costerm);
        var viewalt = (eradm-eradm*costerm)/costerm;
        
        var bounds = new geo.Bounds(sw, ne);
        ////////////////////////////////////////////////////////////////
        //using util code to get altitude only
        ////////////////////////////////////////////////////////////////
        var center = bounds.center();
        //var lookAtRange = options.defaultRange;
        
        var boundsSpan = bounds.span();
        var lookAtRange = 1000;
        //var scaleRange = 1.5;
        if (boundsSpan.lat || boundsSpan.lng) {
          var distEW = new geo.Point(center.lat(), bounds.east())
             .distance(new geo.Point(center.lat(), bounds.west()));
          var distNS = new geo.Point(bounds.north(), center.lng())
             .distance(new geo.Point(bounds.south(), center.lng()));
          
          aspectRatio = Math.min(Math.max(aspectRatio,
                                              distEW / distNS),
                                     1.0);
          
          // Create a LookAt using the experimentally derived distance formula.
          var alpha = (45.0 / (aspectRatio + 0.4) - 2.0).toRadians();
          var expandToDistance = Math.max(distNS, distEW);
          var beta = Math.min((90).toRadians(),
                              alpha + expandToDistance / (2 * geo.math.EARTH_RADIUS));
          
          lookAtRange = scaleRange * geo.math.EARTH_RADIUS *
              (Math.sin(beta) * Math.sqrt(1 + 1 / Math.pow(Math.tan(alpha), 2)) - 1); 
        }
          viewalt = lookAtRange;
        //gex.view.setToBoundsView(bounds, { aspectRatio: 1.0 });
        
        //Make a new point to hover over
        //center the camera
        //var ccent = new gLatLng(swlat + ((nelat - swlat)/2), swlng + ((nelng - swlng)/2));
        
        //Move the camera
   	  //camera.setAltitude(viewalt);
	  //camera.setLatitude(swlat + ((nelat - swlat)/2));
	  //camera.setLongitude(swlng + ((nelng - swlng)/2));
	  //camera.setTilt(0);
      return [swlat + ((nelat - swlat)/2), swlng + ((nelng - swlng)/2), viewalt];
	   
    	
    }
    
   function viewTarget(){
	   //Center the view on the cannon
	    camera = ge.createCamera('');
	   
	   //pm1, pm2, aspectratio, scalerange
	   var area = show_field(pm1, pm2, 1.0, 0.5);
	   var p1 = new geo.Point(pm1.point.getLatitude(), pm1.point.getLongitude());
	   var p2 = new geo.Point(pm2.point.getLatitude(), pm2.point.getLongitude());
	   var viewh = geo.math.heading(p1, p2);
	   
	   //Get the heading to the target and set
	   //it into the camera
	   camera.setHeading(viewh);
	   
	   //Get the altitude from show_field
	   //and set it into the camera
	   
	    camera.set(pm1.point.getLatitude(), pm1.point.getLongitude(), area[2], ge.ALTITUDE_RELATIVE_TO_GROUND,
	    		viewh, 45, 0);
	   
	   //now set the camera back to about 45 degrees
        //camera.setTilt(45);
        
	    ge.getView().setAbstractView(camera);
	   
	   
   }
	
	function tickAnimation() {
	  // an example of some camera manipulation that's possible w/ the Earth API
	  //camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);
		var camlat = camera.getLatitude();
		var camlng = camera.getLongitude();
		var camhd = camera.getHeading();
	  //var dest = bang_destination(camera.getLatitude(), camera.getLongitude(), across_vel*time_step,
	  //                       camera.getHeading());
	  //Never change from original heading
		var dest = bang_destination(my_lat, my_lng, across_vel*tick_cnt,
				                         shot_heading);
		//trajectory details
		var air_time = 2*(up_vel/9.8);
		var max_alt = (up_vel*(air_time/2) + (0.5*(-9.8)*(air_time/2)*(air_time/2)))
		var hz_dist = air_time * across_vel;

	  //var dest = 
	  //var alt = ANIM_ALTITUDE + (up_vel*tick_cnt) + (0.5*(-9.8)*tick_cnt*tick_cnt);
	  var alt = ge.getGlobe().getGroundAltitude(my_lat, my_lng) + (up_vel*tick_cnt) + (0.5*(-9.8)*tick_cnt*tick_cnt);
	  var galt = ge.getGlobe().getGroundAltitude(dest[0], dest[1]);
	  if(alt < galt){
	    //alt = 10;
		//add the hit overlay at the last destination
		bang_hit(dest[0], dest[1]);
	    stopAnimationClick();
	  }else{
	  
	  //message('modified code');
      
	  camera.setAltitude(alt);
	  camera.setLatitude(dest[0]);
	  camera.setLongitude(dest[1]);
	  
	  //the tilt angle is the arctan of the x and y velociy y/x
	  //90 is flat, 180 is straight up, 0 is straight down
	  var vy = (up_vel) + ((-9.8)*tick_cnt);
	  var vx = 1000;
	  var tiltangle = Math.atan2(vy, vx) * 180/Math.PI;
	  
	  
	  //if(tiltangle < 0 && ((shot_angle + tiltangle) < 0.01)){
	  //if(tiltangle < 0 && (alt - galt) < 4000 && !slowed){
	  if(tiltangle < 0 && (alt - galt) < (max_alt/20) && !slowed){
	  //if(tiltangle < 0 && ((across_vel*tick_cnt) > (0.99*hz_dist)) && !slowed){
	      time_step = time_step/200;
		  slowed = true;
		  //alert('slowed now')
	  }
	  
	  
	  //Once the projectile is falling, then start tilting the camers
	  if(tiltangle < 0){
	      camera.setTilt(90.0 + tiltangle);
	  }
	  camera.setTilt(0);
	  

	  //set the placemark location instead
	  ge.getView().setAbstractView(camera);
	  //pm1.setLoc(dest[0], dest[1], alt);
	  
	  
	  
	  
	  tick_cnt += 1*time_step;
	  }
	}

	/* Helper functions, courtesy of
	   http://www.movable-type.co.uk/scripts/latlong.html */
	function distance(lat1, lng1, lat2, lng2) {
	  var a = Math.sin(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180);
	  var b = Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
	      Math.cos((lng2 - lng1) * Math.PI / 180);
	  return 6371000 * Math.acos(a + b);
	}

	function bang_destination(lat, lng, dist, heading) {
	  lat *= Math.PI / 180;
	  lng *= Math.PI / 180;
	  heading *= Math.PI / 180;
	  dist /= 6371000; // angular dist

	  var lat2 = Math.asin(Math.sin(lat) * Math.cos(dist) +
	                       Math.cos(lat) * Math.sin(dist) * Math.cos(heading));
	  var lng2 = 180 / Math.PI *
      (lng + Math.atan2(Math.sin(heading) * Math.sin(dist) * Math.cos(lat2),
              Math.cos(dist) - Math.sin(lat) * Math.sin(lat2)));
	  lat2 = lat2*(180 / Math.PI);
	  
	  if(lng2 > 180){
		  lng2 = -180 + (lng2%180);
	  }
	  else if(lng2 < -180){
		  lng2 = 180 - (Math.abs(lng2)%180);
	  }
	  
	  if(lat2 > 90){
		  lat2 = 90 - (lat2%90)
	  }
	  else if(lat2 < -90){
		  lat2 = -90 + (Math.abs(lat2)%90)
	  }
	  

	  return [
	      lat2,
	      lng2];
	}

//array for holding the hit placemarks
	var hitarray = [];
	var munitionsarray = [];
	var hacnt = 0;

	
function fire_stored_cannon(){
	//set the cannon and target locations first
	setpoint_cannon(new GLatLng(rcannon_lat, rcannon_lng));
	setpoint_target(new GLatLng(rtarget_lat, rtarget_lng));
	
	ge.setBalloon(null);
	shot_angle = rshot_angle;
	shot_vel = rshot_vel;
	up_vel = shot_vel*Math.sin(shot_angle * (Math.PI/180));
	shot_heading = rshot_heading;
	across_vel = shot_vel*Math.cos(shot_angle * (Math.PI/180));
	//new timing experiment
	//time_step = init_time_step;
	rev_dur = 4; 
	rev_fps = 30;
	time_step = rev_dur/rev_fps;
	time_steps = rev_dur*rev_fps;
	var air_time = 2*(up_vel/9.8);
	time_step = air_time/time_steps;
	slowed = false;
	startAnimationClick();
}


function fire_cannon(){
	//get the user input for the shot
	shot_cnt += 1;
	//close any open balloons
	ge.setBalloon(null);
	shot_angle = parseFloat(el('elev1').value);
	up_vel = parseFloat(el('vel1').value)*Math.sin(parseFloat(el('elev1').value) * (Math.PI/180));
	shot_heading = parseFloat(el('head1').value);
	shot_vel = parseFloat(el('vel1').value);
	across_vel = parseFloat(el('vel1').value)*Math.cos(parseFloat(el('elev1').value) * (Math.PI/180));
	//new timing experiment
	//time_step = init_time_step;
	rev_dur = 4; 
	rev_fps = 45;
	time_step = rev_dur/rev_fps;
	time_steps = rev_dur*rev_fps;
	var air_time = 2*(up_vel/9.8);
	time_step = air_time/time_steps;
	slowed = false;
	startAnimationClick();
	
	//Demo of the new distance and position calculation
	//Calculate the maximum height and time and try to get the end location of the trajectory
	//then mark it on the globe
	//for(var i = 0; i < 20000; i += 10){
	//up_vel = i*Math.sin(parseFloat(el('elev1').value) * (Math.PI/180));
	//across_vel = i*Math.cos(parseFloat(el('elev1').value) * (Math.PI/180));
	//var air_time = 2*(up_vel/9.8);
	//var hz_dist = air_time * across_vel;
	//get the location
	//var end_point = bang_destination(my_lat, my_lng, hz_dist, shot_heading);
	//Add the placemark
	//pm_cnt += 1;
	//var hit_pm = new PM(pm_cnt);
    // Define a custom icon.
	//   hit_pm.placemark.setVisibility(true);
	//   hit_pm.setLoc(end_point[0], end_point[1], ANIM_ALTITUDE);
	//}
}


var gex;
function my_sat_test(){
    
    g_features = ge.getFeatures();
    g_getview = ge.getView();
    //createStyles();       
    ge.getWindow().setVisibility(true); 
    
    gex = new GEarthExtensions(ge);

    ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);
    ge.getOptions().setStatusBarVisibility(true);
    //updateOptions();

    var la = ge.createLookAt(''); 
    la.set(0, 0, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 20000000); 
    ge.getView().setAbstractView(la);     
   
    //google.earth.addEventListener(ge.getGlobe(), "mousedown", function(event) { draw(event); }); 
    //google.earth.addEventListener(ge.getGlobe(), "mousemove", function(event) { movePMLoc(event); }); 
    
    bang_begin();
	
}

function bounce_target(){
	gex.fx.bounce(pm2, {
		  duration: 300,
		  repeat: 1,
		  dampen: 0.3
		});	
}

function getserial(){
	el('munitions').innerHTML = gex.view.serialize();
}

function movetoarmory(){
	gex.view.deserialize('0yz05Hvo81VAsndwkG8xBA');
	//turn on all the select buttons for the armory
	armory_select_visible(true);
	//for(var i = 0; i < armory_select.length; i += 1){
	//	armory_select[i].setVisibility(true);
	//}
}

function armory_select_visible(vis){
	for(var i = 0; i < armory_select.length; i += 1){
		armory_select[i].setVisibility(vis);
	}
}

function my_sat_test_l(){
    
    g_features = gel.getFeatures();
    g_getview = gel.getView();
    //createStyles();       
    gel.getWindow().setVisibility(true); 

    gel.getNavigationControl().setVisibility(gel.VISIBILITY_SHOW);
    gel.getOptions().setStatusBarVisibility(true);
    //updateOptions();

    var la = gel.createLookAt(''); 
    la.set(0, 0, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 20000000); 
    gel.getView().setAbstractView(la);     
   
    //google.earth.addEventListener(gel.getGlobe(), "mousedown", function(event) { draw(event); }); 
    //google.earth.addEventListener(gel.getGlobe(), "mousemove", function(event) { movePMLoc(event); }); 
    
	
}

function locate_cannon(player){
	
}

function search_cannon_1(){
		 geocoder = new GClientGeocoder();

		 geocoder.getLatLng(el("cannonloc").value, setpoint_cannon);

}

function setpoint_cannon(latlng){
	 //alert('Entered setpoint');
	 if(latlng == null){
	   alert('address still not found');
	 }
	 else{
		//alert('address found');
	    pm1.setLoc(latlng.lat(), latlng.lng(), ANIM_ALTITUDE);
	    my_lat = latlng.lat();
	    my_lng = latlng.lng();
		 //Get the location of the cannon
		 var cannon_loc = new GLatLng(pm1.point.getLatitude(), pm1.point.getLongitude());
		 var target_loc = new GLatLng(pm2.point.getLatitude(), pm2.point.getLongitude());
	     //calculate the distance between the cannon and the target 	
	     var dkm = cannon_loc.distanceFrom(target_loc).toPrecision(7);
		 var tghtml = '';
		 tghtml += '<table><tr><td></td><td valign="top">';
		 tghtml += el('targetloc').value + '<br>';
		 tghtml += dkm/1000 + ' kilometers from here';
		 el('targeting').innerHTML = tghtml;
		 viewTarget();
	 }
}

function search_target(){
	 geocoder = new GClientGeocoder();

	 geocoder.getLatLng(el("targetloc").value, setpoint_target);

}

function setpoint_target(latlng){
	 //alert('Entered setpoint');
	 if(latlng == null){
	   alert('address still not found');
	 }
	 else{
		//alert('address found');
	    pm2.setLoc(latlng.lat(), latlng.lng(), ANIM_ALTITUDE);
		 //Update the targeting information
		 //Get the location of the cannon
		 var cannon_loc = new GLatLng(pm1.point.getLatitude(), pm1.point.getLongitude());
	     //calculate the distance between the cannon and the target 	
	     var dkm = cannon_loc.distanceFrom(latlng).toPrecision(7);
		 var tghtml = '';
		 tghtml += '<table><tr><td></td><td valign="top">';
		 tghtml += el('targetloc').value + '<br>';
		 tghtml += dkm/1000 + ' kilometers from here';
		 el('targeting').innerHTML = tghtml;
		 viewTarget();
	 }
}

function search_cannon_2(){
		 geocoder = new GClientGeocoder();

		 geocoder.getLatLng(el("address_2").value, setpoint_test_2);

}

var target_id = '';
var target_name = '';
var target_location = '';
function set_target(location, id, name){
	 geocoder = new GClientGeocoder();

	 geocoder.getLatLng(location, setpoint_test_2);
	 target_id = id;
	 target_name = name;
	 target_location = location;
	 
}

function set_cannon(location){
	 geocoder = new GClientGeocoder();

	 geocoder.getLatLng(location, setpoint_cannon);
	 
}


function setpoint_test_2(latlng){
	 //alert('Entered setpoint');
	 if(latlng == null){
	   alert('address not found');
	 }
	 else{
		 //set a new icon for the target
		    var icon = ge.createIcon('');
		    icon.setHref('http://graph.facebook.com/' + target_id + '/picture');
		    var style = ge.createStyle(''); //create a new style
		    style.getIconStyle().setIcon(icon); //apply the icon to the style
		    pm2.setStyle(style); //apply the style to the placemark
	    pm2.setLoc(latlng.lat(), latlng.lng(), ANIM_ALTITUDE);
		 //Update the targeting information
		 //Get the location of the cannon
		 var cannon_loc = new GLatLng(pm1.point.getLatitude(), pm1.point.getLongitude());
	     //calculate the distance between the cannon and the target 	
	     var dkm = cannon_loc.distanceFrom(latlng).toPrecision(7);
		 var tghtml = '';
		 tghtml += '<table><tr><td><img src="http://graph.facebook.com/' + target_id + '/picture' + '"></td><td valign="top">';
		 tghtml += target_name + ' in <br>' + target_location + '<br>';
		 tghtml += dkm/1000 + ' kilometers from here';
		 el('targeting').innerHTML = tghtml;
	 }
	 
	 //Now view them over the earth
	 viewTarget();
	 
	 //Update the targeting flat map
	 //center_targeting();
}


function my_sat_test_r(){
    
    g_features = ger.getFeatures();
    g_getview = ger.getView();
    //createStyles();       
    ger.getWindow().setVisibility(true); 

    ger.getNavigationControl().setVisibility(ger.VISIBILITY_SHOW);
    ger.getOptions().setStatusBarVisibility(true);
    //updateOptions();

    var la = ger.createLookAt(''); 
    la.set(0, 0, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 20000000); 
    ger.getView().setAbstractView(la);     
   
    //google.earth.addEventListener(ger.getGlobe(), "mousedown", function(event) { draw(event); }); 
    //google.earth.addEventListener(ger.getGlobe(), "mousemove", function(event) { movePMLoc(event); }); 
    
	
}


     
     function about() {
      if(ge){
        var balloon = ge.createHtmlStringBalloon('');
        balloon.setMaxWidth(350);
        balloon.setContentString('Real-time Amateur Satellite Tracker.<br /><br />' +
            'Currently tracking ' + g_numOfSats + ' objects.');
        ge.setBalloon(balloon);
      }
    }    
  
     function fetchNewData()
     {
       var next = g_curTime+g_updatePeriod*g_speed;
       var jdNext = JDate(next);
       var refresh;
       
       (next > g_lastUpdate) ? refresh = false: refresh = true;

       for (var i =0; i< g_numOfSats;i++)
       {
         g_pms[i].UpdatePositionData(next,jdNext,refresh);
       }
       
       g_lastUpdate = next;
       g_fetchNew = setTimeout("fetchNewData()", g_updatePeriod);
     }
 
     function fetchNewDatana()
     {
       var next = g_curTime+g_updatePeriod*g_speed;
       var jdNext = JDate(next);
       var refresh;
       
       (next > g_lastUpdate) ? refresh = false: refresh = true;

       for (var i =0; i< g_numOfSats;i++)
       {
         g_pms[i].UpdatePositionData(next,jdNext,refresh);
         g_pms[i].Move(next);
       }
       
       g_lastUpdate = next;
       //No delay, just loop through to calcuate the entire trajectory
       //g_fetchNew = setTimeout("fetchNewData()", g_updatePeriod);
     }
 
 
     function moveSatellites()
     {
       var temp = fetchCurTime();
         g_curTime += (temp-g_lastMillis)*g_speed;
         g_lastMillis = temp;
       

         for (var i =0; i< g_numOfSats;i++)
         {
             g_pms[i].Move(g_curTime);
         }
       
         var time = new Date(g_curTime);  var date = time.toUTCString();
         el('date').innerHTML = time.toLocaleString(); 
    }

     function moveSatellitesna()
     {
       //var temp = fetchCurTime();
    	 //always incrment time by one second
    	 var temp = g_lastMillis + 1000;
         g_curTime += (temp-g_lastMillis)*g_speed;
         g_lastMillis = temp;
       

         for (var i =0; i< g_numOfSats;i++)
         {
             g_pms[i].Move(g_curTime);
         }
       
         var time = new Date(g_curTime);  var date = time.toUTCString();
         el('date').innerHTML = time.toLocaleString(); 
    }

 
      function resetTime()
      {

          g_curTime = g_lastMillis = g_lastUpdate = fetchCurTime();
        
          var jd = JDate(g_curTime);
 
          for (var i =0; i< g_numOfSats;i++)
          {
            g_pms[i].UpdatePositionData(g_curTime,jd,true);

          } 
         
          fetchNewData();
                  
          google.earth.addEventListener(ge, "frameend", moveSatellites);
       
     }
      
    function drawOrbit24(){
    	//Draw the path for 24 hours
    	//Call movesats twice for every fetchNewDatana
    	for(i=0; i < 24*60*60; i++){
    		//if(i!= 0 & i%2 == 0){
    			fetchNewDatana();
    		//}
    		moveSatellitesna();
    	}
    }
      
    function resetTimena()
    {

        //set the number of satellites to just the first one
        g_numOfSats = 1;

        g_curTime = g_lastMillis = g_lastUpdate = fetchCurTime();
      
        var jd = JDate(g_curTime);

        //for (var i =0; i< g_numOfSats;i++)
        //{
          //g_pms[i].UpdatePositionData(g_curTime,jd,true);

        //} 
       
        //fetchNewDatana();
                
        //in this version, there is no event listening
        //we just want to calculate the trajectory for 24 hours
        //google.earth.addEventListener(ge, "frameend", moveSatellites);
        
        //Call the function that will plot all the trajectories at once.
        //set the number of satellites to just the first one
        
        //drawOrbit24();
        
        //Now track all satellites
        for (var j =0; j< g_numOfSats;j++){    
          //Calcultate the position every two minutes of the satellite for the next 24 hours
          alert('Working on satellite ' + j);
          for(var i=0; i< 30*24; i++){
        	  g_curTime = g_curTime + (120*1000);
        	  jd = JDate(g_curTime);
        	  g_pms[j].UpdatePositionDatana(g_curTime,jd,true);
        	  //Update the status of the calculation
        	  //el('date').innerHTML = 'Working on minute ' + i;
          }
    	  el('date').innerHTML = 'Working on satellite ' + j;
        }
        
        //Now draw the entire satellite path to verify it
        //g_pms[0].
     
   }
    

 
     function fetchCurTime()
     {
       var timex = new Date();
       return timex.getTime()
     }
 


     function updateOptions()
     {
       var options = ge.getOptions();
       var form = el("options");
       var mode;

       if (form.altitude.checked != g_altitudeMode)
       {
         g_altitudeMode = form.altitude.checked;
         for (var i =0; i< g_numOfSats;i++){g_pms[i].altMode(g_altitudeMode)}
       }
 
  
       ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
       ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);
       ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
       ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);    
       }
 
     function el(e) { return document.getElementById(e); }




function draw(e) 
{
  if(e.getTarget().getType() == 'KmlPlacemark')
  {
      e.preventDefault(); 
  }
}

//State variables and functions for the lofting animation
//the hit is already stored in latest_hit
//copy the coordinate figuring from show_field
var loft_end;
var loft_tick = 0;
//Take about two seconds to do this assuming 15fps
var rev_dur = 2;
var rev_fps = 15;
var time_steps = 0;
var animLoftRunning = false;
var hitpoint;
var fieldpoint;
//center on the southern most point
var swllat;
var swllng;


function startLoftAnimationClick() {
	  if (!animLoftRunning) {
	    rev_dur = 2;
		rev_fps = 15;
		ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);
	    animLoftRunning = true;
	    
	    //var testpoint = new geo.Point(11.1, 12.3);
	    
	    //get the initial conditions for the lofting
	    loft_end = show_field(pm2, latest_hit, 1.0, 1.5);
	    
	    hitpoint = new geo.Point(latest_hit.point.getLatitude(), latest_hit.point.getLongitude());
	    fieldpoint = new geo.Point(loft_end[0], loft_end[1]);
	    
	    swllat = Math.min(pm2.point.getLatitude(), latest_hit.point.getLatitude());
	    swllng = Math.min(pm2.point.getLongitude(), latest_hit.point.getLongitude());
	    if(pm2.point.getLatitude() < latest_hit.point.getLatitude()){
	    	swllat = pm2.point.getLatitude();
	    	swllng = pm2.point.getLongitude();
	    }
	    else{
	    	swllat = latest_hit.point.getLatitude();
	    	swllng = latest_hit.point.getLongitude();
	    }
	    

	    //camera = ge.createCamera('');
	    //camera.set(loft_end[0], loft_end[1], 0, ge.ALTITUDE_RELATIVE_TO_GROUND,
	    //		0, 0, 0);
		  //camera.setLatitude(loft_end[0]);
		  //camera.setLongitude(loft_end[1]);
	      //camera.setAltitude(loft_end[2]);
		  //  ge.getView().setAbstractView(camera);
	    
	    
	    
	    //camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);
	    //alt = ANIM_ALTITUDE;
	    loft_tick = 0;
	  //simple rise
	    time_step = rev_dur/rev_fps;
	    time_steps = rev_dur*rev_fps;
	    //time_step = 5;
	    google.earth.addEventListener(ge, 'frameend', tickLoftAnimation);

	    // start it off
	    tickLoftAnimation();
	  }
	}

	function stopLoftAnimationClick() {
	  if (animLoftRunning) {
	    google.earth.removeEventListener(ge, 'frameend', tickLoftAnimation);
	    animLoftRunning = false;
	    
	    //Show the latest results balloon
	    ge.setBalloon(hacnt - 1);
	  }
	  //Now zoom the view back out to show the hit and the target
	  //show_field(pm2, latest_hit);
	}

	function tickLoftAnimation() {
		  // an example of some camera manipulation that's possible w/ the Earth API
		  //camera = ge.getView().copyAsCamera(ge.ALTITUDE_RELATIVE_TO_GROUND);

		  //var dest = bang_destination(camera.getLatitude(), camera.getLongitude(), across_vel*time_step,
		  //                       camera.getHeading());
		  //Never change from original heading
	      //Get the next point to move the camera up to
		
		  //var dest = 
		  var alt = loft_end[2]/time_steps * loft_tick;
		  var loftheading = shot_heading - (shot_heading/time_steps * loft_tick);
		  
		  //instead of moving instantly to the center, move from the target location to the center
		  //smoothly
		  var camlatlng = geo.math.midpoint(hitpoint, fieldpoint, loft_tick/time_steps);
		  
		  if(alt > loft_end[2]){
			  //camera.setTilt(70);

			    stopLoftAnimationClick();
		  }
		  else{
		  
		  //message('modified code');
	      
		  //camera.setLatitude(loft_end[0]);
		  //camera.setLongitude(loft_end[1]);
		  //camera.setTilt(34);
		  ctestlat = camlatlng.lat();
		  ctestlng = camlatlng.lng();
		  camera.setLatitude(camlatlng.lat());
		  camera.setLongitude(camlatlng.lng());
		  //backup by 2/60
		  //centers on the most southern object
		  //camera.setLatitude(swllat-((2/60)));// + ((.038743*(loft_end[2] - 46810))/60)));
		  //camera.setLatitude(swllat);
		  //camera.setLongitude(swllng);
	      camera.setAltitude(alt);
	      camera.setHeading(loftheading);
	      camera.setTilt(0);
		  
		  //camera.setTilt(34*(loft_tick/time_steps));
		  

		  //set the placemark location instead
		  ge.getView().setAbstractView(camera);
		  //pm1.setLoc(dest[0], dest[1], alt);
		  
		  
		  
		  
		  loft_tick += time_step;
		  }
		}
	
	var targetmarker;
	function init_map() {
	    //alert('init map');
	    map = new GMap2(document.getElementById("targetmap"), {   size:new GSize(250,250)});
	    //alert('exit init map');
	    var point = new GLatLng(37.71859, 6.679688);
	    map.setCenter(point, 3);
	    //var mapControl = new GMapTypeControl();
	    //map.addControl(mapControl);
	    map.addControl(new GSmallMapControl());    //map = new GMap2( document.getElementById('map_canvas') );
	    map.setMapType(G_PHYSICAL_MAP );
	    
	    //add the targeting placemark
	    targetmarker = new GMarker(point);

	    map.addOverlay(targetmarker);
	    
	}
	
	
	//center the targeting map on the new target
	function center_targeting(){
		//add a pl

	    var tcenter = new GLatLng(pm2.point.getLatitude(), pm2.point.getLongitude());
		targetmarker.setLatLng(tcenter);
	    map.setCenter(tcenter, 8);
		
	}
    
	var so_three;
	var so_two;
	var so_one;
	var so_zero;
	
	function setupcountdown(){
		so_zero = create_countdown_img('so_zero', 'http://copaseticflows.appspot.com/img/count0.png');
		so_one = create_countdown_img('so_one', 'http://copaseticflows.appspot.com/img/count1.png');
		so_two = create_countdown_img('so_two', 'http://copaseticflows.appspot.com/img/count2.png');
		so_three = create_countdown_img('so_three', 'http://copaseticflows.appspot.com/img/count3.png');
	}
	
	function create_countdown_img(soname, sopath){
		var screenOverlay = ge.createScreenOverlay(soname);

		// Specify a path to the image and set as the icon
		var icon = ge.createIcon('icon' + soname);
		icon.setHref(sopath);
		screenOverlay.setIcon(icon);

		// Set the ScreenOverlay's position in the window
		screenOverlay.getOverlayXY().setXUnits(ge.UNITS_PIXELS);
		screenOverlay.getOverlayXY().setYUnits(ge.UNITS_PIXELS);
		screenOverlay.getOverlayXY().setX(250);
		screenOverlay.getOverlayXY().setY(180);

		// Set the overlay's size in pixels
		screenOverlay.getSize().setXUnits(ge.UNITS_PIXELS);
		screenOverlay.getSize().setYUnits(ge.UNITS_PIXELS);
		screenOverlay.getSize().setX(1000);
		screenOverlay.getSize().setY(1000);
		
		return screenOverlay;
	}

	
	function showcountdown(count){
		// Add the ScreenOverlay to Earth
		if(count == 3){
			if(old_countdown){
				ge.getFeatures().replaceChild(so_three, old_countdown);
				old_countdown = so_three;				
			}else{
				ge.getFeatures().appendChild(so_three);
				old_countdown = so_three;				
			}
		}
		if(count == 2){
			if(old_countdown){
				ge.getFeatures().replaceChild(so_two, old_countdown);
				old_countdown = so_two;				
			}else{
				ge.getFeatures().appendChild(so_two);
				old_countdown = so_two;				
			}
		}
		if(count == 1){
			if(old_countdown){
				ge.getFeatures().replaceChild(so_one, old_countdown);
				old_countdown = so_one;				
			}else{
				ge.getFeatures().appendChild(so_one);
				old_countdown = so_one;				
			}
		}
		if(count == 0){
			if(old_countdown){
				ge.getFeatures().replaceChild(so_zero, old_countdown);
				old_countdown = so_zero;				
			}else{
				ge.getFeatures().appendChild(so_zero);
				old_countdown = so_zero;				
			}
		}
			
	}
	
	var countdown_cnt = 0;
	var old_countdown = null;
	function countdown(){
		if(countdown_cnt == 0){
			//setup the cannon and target locations
			//c = new GLatLng();
			//t = new GLatLng();
			
		}
		if(countdown_cnt == 4){
			//remove the countdown number and quit
			//later, start the replay
			ge.getFeatures().removeChild(old_countdown);
			old_countdown = null;
			countdown_cnt = 0;
	        fire_stored_cannon();
			return;
		}
		var newcount = 3 - (countdown_cnt)%4;
		showcountdown(newcount);
		countdown_cnt += 1;
		setTimeout("countdown()", 1000);
	}
	
	
	var munition_index = 0;
    //munitions packs
	animal_munitions = [];
	animal_munitions[0] = ['flower.JPG', 'flowertfade.JPG', 'flowert.JPG', 'flower', 'http://copaseticflows.appspot.com/img/flower2.dae'];
	animal_munitions[1] = ['bombsel.JPG', 'bombtfade.JPG', 'bombt.JPG', 'bomb', 'http://copaseticflows.appspot.com/img/practicebomb4.dae'];
	animal_munitions[2] = ['boulder.JPG', 'bouldertfade.JPG', 'bouldert.JPG', 'boulder', 'http://copaseticflows.appspot.com/img/verticalboulder.dae'];
	
	