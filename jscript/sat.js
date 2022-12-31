
// styles

var styleA;
var styleB;
var styleC; 
var styleD; 
var stylemap = [{ground : "styleA" , alt : "styleC"},
                {ground : "styleB" , alt : "styleD"}]
                
function satStyle(name,scale,col)
{
  var styleMap = ge.createStyleMap(name);
  styleMap.setNormalStyle(singleSatStyle(scale,0,col));
  styleMap.setHighlightStyle(singleSatStyle(scale,1,col));
  return styleMap;
}

function singleSatStyle(scale,label,color)
{
  var style = ge.createStyle('');
  var iconStyle = style.getIconStyle();
  var icon = ge.createIcon('');
  var lineStyle = style.getLineStyle();
  var labelStyle = style.getLabelStyle();
  icon.setHref('http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png');
  iconStyle.setScale(scale);
  iconStyle.getColor().set(color); 
  labelStyle.setScale(label);
  iconStyle.setIcon(icon);
  lineStyle.getColor().set('70c0c0c0'); 
  return style;
}


function createStyles()
{
  styleA = satStyle('A',1.3,'ffffffff'); 
  styleB = satStyle('B',1.3,'ffd0d0ff');   
  styleC = satStyle('C',1.3,'ffffffff'); 
  styleD = satStyle('D',1.3,'ffd0d0ff'); 
}



//


function Satellite(num,name,Line1,Line2, mark){  // new satellite object
  this.Icon = new PM(num);
  this.SatPath = new LS(num);
  this.PassArray = [];
  this.PassCArray = [[0, 0, 0], [0, 0, 0]];
  this.Vis = false;
  this.exVis = false;
  this.initData(name,Line1,Line2, mark);
  //Last time the path was updated
  this.PathUpdateTime = 0;
  //How often to update the path measured in seconds
  this.PathUpdateInterval = 5;
  
  this.traj = [[0, 0.0, 0.0, 0.0], [0, 0.0, 0.0, 0.0]];
  this.traj_count = 0;

}

Satellite.prototype.initData = function(name,Line1,Line2, mark) {    // initialize all the parameters associated with this satellite

  this.parseTLE(Line1,Line2);

  this.ltlnal1 = [0,0,0,0,0,0,0,0,0];
  this.pos = [0,0,0,0];
  this.lla = [0,0,0,0];
  this.vel = [0,0,0,0];
  
  this.eqsq   = 0;
  this.siniq  = 0;
  this.cosiq  = 0;
  this.rteqsq = 0;
  this.ao     = 0;
  this.cosq2  = 0;
  this.sinomo = 0;
  this.cosomo = 0;
  this.bsq    = 0;
  this.xlldot = 0;
  this.omgdt  = 0;
  this.xnodot = 0;
  this.xnodp  = 0;
  this.xll    = 0;
  this.omgasm = 0;
  this.xnodes = 0;
  this.xn     = 0;
  this.t      = 0;
  this.em    = 0;
  this.xinc   = 0;

  this.name = name;
  this.style = 0;
  if (this.name == "COSMOS 2251 DEB" || this.name == "COSMOS 2251"){this.style = 1}

  if(mark != 0){
	  this.Icon.setName(name);                      
  }
  this.altMode(true);  
  if(mark != 0){
      this.Icon.placemark.setVisibility(true);         // Performance hack
  }
} 


Satellite.prototype.altMode = function(mode) 
{
  if(mode)
  {
    this.Icon.point.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
    this.Icon.setStyle(eval(stylemap[this.style].alt));
  }
  else
  {
    this.Icon.point.setAltitudeMode(ge.ALTITUDE_CLAMP_TO_GROUND);
    this.Icon.setStyle(eval(stylemap[this.style].ground));
  }
}


Satellite.prototype.getName = function() {return this.name;}


Satellite.prototype.FetchAttr = function(time) {
  var step = (time-this.ltlnal1[4])/(this.ltlnal1[7]);
  var latlon = destination(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal1[5]*step,this.ltlnal1[6]);
  var alt = this.ltlnal1[2]+step*(this.ltlnal1[8]);
  return [latlon[0],latlon[1],alt,this.vel[3]];
}

Satellite.prototype.Move = function(time) { 
  var step = (time-this.ltlnal1[4])/(this.ltlnal1[7]);
  var latlon = destinationr(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal1[5]*step,this.ltlnal1[6]);
  var alt = this.ltlnal1[2]+step*(this.ltlnal1[8]);
  this.Icon.setLoc((latlon[0]*57.2957795),fixLon(latlon[1]*57.2957795),alt.toPrecision(4));
  //Draw a line for the track every 30 seconds of simulation time
  //if((this.PathUpdateTime == 0) || (((time - this.PathUpdateTime)/1000) > this.PathUpdateInterval)){
  //	  this.SatPath.setLoc((latlon[0]*57.2957795),fixLon(latlon[1]*57.2957795),alt.toPrecision(4));
  //    this.PathUpdateTime = time;	  
  //}
}

Satellite.prototype.MoveNoDraw = function(time) { 
	  var step = (time-this.ltlnal1[4])/(this.ltlnal1[7]);
	  var latlon = destinationr(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal1[5]*step,this.ltlnal1[6]);
	  var alt = this.ltlnal1[2]+step*(this.ltlnal1[8]);
	  
	  //Don't draw the satellite.  Just store the location
	  //this.Icon.setLoc((latlon[0]*57.2957795),fixLon(latlon[1]*57.2957795),alt.toPrecision(4));
	  
	  
	  
	  
	  //As a first test, see if the orbit is drawn correctly
	  //Draw a line for the track every 30 seconds of simulation time
	  if((this.PathUpdateTime == 0) || (((time - this.PathUpdateTime)/1000) > this.PathUpdateInterval)){
	  	  this.SatPath.setLoc((latlon[0]*57.2957795),fixLon(latlon[1]*57.2957795),alt.toPrecision(4));
	      this.PathUpdateTime = time;	  
	  }
	}


function PM(num) {      // Create Placemark
  this.placemark = ge.createPlacemark(String(num));
  this.placemark.setVisibility(false);         // Performance hack
  this.point = ge.createPoint('');
  this.placemark.setGeometry(this.point);
  this.point.setExtrude(true);
  g_features.appendChild(this.placemark);
  
}

function LS(num){      //Create LineString
	// Create the placemark
	this.linestringplacemark = ge.createPlacemark('');

	// Create the LineString
	this.linestring = ge.createLineString('');
	
	//Make a plane from the path to the ground
	this.linestring.setExtrude(true);
	// Create a style and set width and color of line
	this.linestringplacemark.setStyleSelector(ge.createStyle(''));
	var linestyle = this.linestringplacemark.getStyleSelector().getLineStyle();
	linestyle.setWidth(5);
	linestyle.getColor().set('9900ffff');  // aabbggrr format
	
	this.linestringplacemark.setGeometry(this.linestring);
	this.linestring.setAltitudeMode(ge.ALTITUDE_RELATIVE_TO_GROUND);

	g_features.appendChild(this.linestringplacemark);
	
}

PM.prototype.setStyle = function(style) {this.placemark.setStyleSelector(style)}

PM.prototype.setName = function(name) {this.placemark.setName(name); this.name = name;}

PM.prototype.setLoc = function(lat,lon,alt) {this.point.setLatLngAlt(lat,lon,alt*1000)}

LS.prototype.setLoc = function(lat,lon,alt) {this.linestring.getCoordinates().pushLatLngAlt(lat,lon,alt*1000)}

LS.prototype.setLocTime = function(lat,lon,alt, start_time, end_time) {
	this.linestring.getCoordinates().pushLatLngAlt(lat,lon,alt*1000);
	
	//now add the time span to this portion of the satellite pass
	var d = new Date(); 
	var timeSpan = ge.createTimeSpan(d.getTime().toString());
	timeSpan.getBegin().set(getXMLTime(start_time));
	//leave the point up for two minutes
	timeSpan.getEnd().set(getXMLTime(end_time));

	this.linestringplacemark.setTimePrimitive(timeSpan);
}

LS.prototype.clear = function() {this.linestring.getCoordinates().clear()}

Satellite.prototype.UpdatePositionData = function(nextTime, jdJulian, refresh)
{
  this.calcSatPosition(jdJulian);
  this.calcLatLonAlt(jdJulian);

  if (!refresh){this.ltlnal1 = this.ltlnal2}
  this.ltlnal2 = [this.lla[0], this.lla[1], this.lla[2], this.vel[3], nextTime];
  this.ltlnal1[5] = distance(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal2[0],this.ltlnal2[1]);
  this.ltlnal1[6] = bearing(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal2[0],this.ltlnal2[1]);
  this.ltlnal1[7] = this.ltlnal2[4]-this.ltlnal1[4];
  this.ltlnal1[8] = this.ltlnal2[2]-this.ltlnal1[2];
}

Satellite.prototype.UpdatePositionDatana = function(nextTime, jdJulian, refresh)
{
  this.calcSatPosition(jdJulian);
  this.calcLatLonAlt(jdJulian);

  if (!refresh){this.ltlnal1 = this.ltlnal2}
  this.ltlnal2 = [this.lla[0], this.lla[1], this.lla[2], this.vel[3], nextTime];
  this.ltlnal1[5] = distance(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal2[0],this.ltlnal2[1]);
  this.ltlnal1[6] = bearing(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal2[0],this.ltlnal2[1]);
  this.ltlnal1[7] = this.ltlnal2[4]-this.ltlnal1[4];
  this.ltlnal1[8] = this.ltlnal2[2]-this.ltlnal1[2];
  
  this.traj[this.traj_count] = [nextTime, (this.lla[0]*57.2957795),fixLon(this.lla[1]*57.2957795),this.lla[2]];
  this.traj_count += 1;
  //this.SatPath.setLoc((latlon[0]*57.2957795),fixLon(latlon[1]*57.2957795),alt.toPrecision(4));
  //this.SatPath.setLoc((this.lla[0]*57.2957795),fixLon(this.lla[1]*57.2957795),this.lla[2].toPrecision(4));

//Create the placemark.
//  var placemark = ge.createPlacemark('');
//  var time = new Date(nextTime);  var date = time.toUTCString();
//  placemark.setName('alt: ' + this.lla[2].toPrecision(4) + ' time: ' + time.toLocaleString());

  // Set the placemark's location.  
//  var point = ge.createPoint('');
//  point.setLatitude(this.lla[0]*57.2957795);
//  point.setLongitude(this.lla[1]*57.2957795);
//  placemark.setGeometry(point);

  // Add the placemark to Earth.
//  ge.getFeatures().appendChild(placemark);
}

//builds a satellite pass trajectory and returns 
//first visibility, last visibility, and maximum elevation angle
Satellite.prototype.BuildPass = function(pi, start_time, end_time, time_step){
	if(this.PassArray[pi] == null){
		this.PassArray[pi] = new LS(pi);
	}
	var step = 0;
    for(var i=start_time; i< end_time; i += time_step){
    	  jd = JDate(i);
    	  this.UpdatePositionDatanaPass(pi,step,i,jd,true);
    	  //Update the status of the calculation
    	  //el('date').innerHTML = 'Working on minute ' + i;
    	  step++;
      }
	//Determine what the minimum and maximum visibility time were and the maximum angle
	//var my_lat = 40.9583819592;
	//var my_lng = -72.9725646973;
	var start_index = end_index = 0;
	var found_first = false;
	var max_angle = 0.0;
	var start_bearing = 0.0;
	var end_bearing = 0.0;
	var max_bearing = 0.0;
    for(var j=0; j<this.PassCArray[pi].length; j++){
		var sdist = edist(my_lat, my_lng, this.PassCArray[pi][j][0], this.PassCArray[pi][j][1]);
		var shrz = sat_horizon(this.PassCArray[pi][j][2]);
    	if(sdist < shrz){
    		if(!found_first){
    			found_first = true;
    			start_index = j;
    			//Calculate the first bearing
    			start_bearing = calculateBearing(my_lat, my_lng, this.PassCArray[pi][j][0], this.PassCArray[pi][j][1]);
    		}
    		end_index = j;
    		//Calculate teh last bearing
    		end_bearing = calculateBearing(my_lat, my_lng, this.PassCArray[pi][j][0], this.PassCArray[pi][j][1]);
    		
    		var elev = elevation(sdist, this.PassCArray[pi][j][2]);
    	    if(elev > max_angle){
    	    	max_angle = elev;
    	    	max_bearing = calculateBearing(my_lat, my_lng, this.PassCArray[pi][j][0], this.PassCArray[pi][j][1]);
    	    }
    	}
    }
    //Assemble the information and return it
    return [(start_time + (start_index*time_step)), (start_time + (end_index*time_step)), max_angle, start_index, end_index, 
            start_bearing, end_bearing, max_bearing]
}

function calculateBearing(alat1, alng1, alat2, alng2){   
	 var lat1 = alat1 * (Math.PI/180);   
	 var lon1 = alng1;   
	 var lat2 = alat2 * (Math.PI/180);   
	 var lon2 = alng2;   
	 var dLon = (lon2-lon1) * (Math.PI/180);   
	 var y = Math.sin(dLon) * Math.cos(lat2);   
	 var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
	    var brng = ((Math.atan2(y, x) * (180/Math.PI))+360)%360;   
	 return brng;
	}


Satellite.prototype.UpdatePositionDatanaDraw = function(nextTime, jdJulian, refresh)
{
  this.calcSatPosition(jdJulian);
  this.calcLatLonAlt(jdJulian);

  if (!refresh){this.ltlnal1 = this.ltlnal2}
  this.ltlnal2 = [this.lla[0], this.lla[1], this.lla[2], this.vel[3], nextTime];
  this.ltlnal1[5] = distance(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal2[0],this.ltlnal2[1]);
  this.ltlnal1[6] = bearing(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal2[0],this.ltlnal2[1]);
  this.ltlnal1[7] = this.ltlnal2[4]-this.ltlnal1[4];
  this.ltlnal1[8] = this.ltlnal2[2]-this.ltlnal1[2];
  
  this.traj[this.traj_count] = [nextTime, (this.lla[0]*57.2957795),fixLon(this.lla[1]*57.2957795),this.lla[2]];
  this.traj_count += 1;
  //this.SatPath.setLoc((latlon[0]*57.2957795),fixLon(latlon[1]*57.2957795),alt.toPrecision(4));
  this.SatPath.setLoc((this.lla[0]*57.2957795),fixLon(this.lla[1]*57.2957795),this.lla[2].toPrecision(4));

//Create the placemark.
  var placemark = ge.createPlacemark('');
  var time = new Date(nextTime);  var date = time.toUTCString();
  placemark.setName('alt: ' + this.lla[2].toPrecision(4) + ' time: ' + time.toLocaleString());

  // Set the placemark's location.  
  var point = ge.createPoint('');
  point.setLatitude(this.lla[0]*57.2957795);
  point.setLongitude(this.lla[1]*57.2957795);
  placemark.setGeometry(point);

  // Add the placemark to Earth.
  //ge.getFeatures().appendChild(placemark);
}

//Gets a position for the satellite pass specified by pi
Satellite.prototype.UpdatePositionDatanaPass = function(pi, step, nextTime, jdJulian, refresh)
{
	  this.calcSatPosition(jdJulian);
	  this.calcLatLonAlt(jdJulian);

	  if (!refresh){this.ltlnal1 = this.ltlnal2}
	  this.ltlnal2 = [this.lla[0], this.lla[1], this.lla[2], this.vel[3], nextTime];
	  this.ltlnal1[5] = distance(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal2[0],this.ltlnal2[1]);
	  this.ltlnal1[6] = bearing(this.ltlnal1[0],this.ltlnal1[1],this.ltlnal2[0],this.ltlnal2[1]);
	  this.ltlnal1[7] = this.ltlnal2[4]-this.ltlnal1[4];
	  this.ltlnal1[8] = this.ltlnal2[2]-this.ltlnal1[2];
	  
	  if(this.PassCArray[pi] == null){
		  this.PassCArray[pi] = [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]];
	  }
	  this.PassCArray[pi][step] = [this.lla[0]*57.2957795, fixLon(this.lla[1]*57.2957795), this.lla[2]];
	  
	  //this.PassArray[pi].setLoc((this.lla[0]*57.2957795),fixLon(this.lla[1]*57.2957795),this.lla[2].toPrecision(4));

}

Satellite.prototype.ClearPasses = function(){
	//first turn off all visible passes
	for(var i=0; i<this.PassArray.length; i++){
		if(this.PassArray[i].linestring.getCoordinates().getLength() != 0){
			this.PassArray[i].clear();
		}
	}
	this.PassCArray.length = 0;
	this.PassArray.length = 0;
}

//start_time is new may embed this inside fo PassCArray instead
//start_time is passed in milliseconds
//made a new setLoc called setLocTime
Satellite.prototype.DrawPass = function(pi, first_step, last_step, start_time, end_time, animate)
{
	if(this.PassArray[pi].linestring.getCoordinates().getLength() == 0){
        for(var i=first_step; i< last_step; i += 1){
    	      if(animate){
        	    this.PassArray[pi].setLocTime((this.PassCArray[pi][i][0]), this.PassCArray[pi][i][1],
                        this.PassCArray[pi][i][2].toPrecision(4), start_time, end_time);
    	      }else{
    	      this.PassArray[pi].setLoc((this.PassCArray[pi][i][0]), this.PassCArray[pi][i][1],
                      this.PassCArray[pi][i][2].toPrecision(4));
    	      }
        }
	}else{
		this.PassArray[pi].clear();
	}
    
    //for(var j=0; j<this.PassCArray[pi].length; j++){
	//	var sdist = edist(my_lat, my_lng, this.PassCArray[pi][j][0], this.PassCArray[pi][j][1]);
}

Satellite.prototype.ClearPass = function(pi)
{
  	  this.PassArray[pi].clear();
}

function edist(lat1, lng1, lat2, lng2){
	var R = 6371; // km
	var d = 0.0;
	d = Math.acos(Math.sin(lat1*(Math.PI/180))*Math.sin(lat2*(Math.PI/180)) + 
	                  Math.cos(lat1*(Math.PI/180))*Math.cos(lat2*(Math.PI/180)) *
	                  Math.cos((lng2-lng1)*(Math.PI/180))) * R;
	return d;
}

function elevation(dist, alt){
	var R =  6371; // km
	var d = dist;
	var a = Math.sqrt((R*R + (R+alt)*(R+alt) - (2*R*(R+alt)*Math.cos(d/R))));
	var B = Math.asin((R*Math.sin(d/R))/a);
	var ele = (Math.PI - (d/R) - B - (Math.PI/2))*(180/Math.PI);
	return ele;
}

function sat_horizon(alt){
	var R = 6371;
	var mcos = R/(R+alt);
	var amcos = Math.acos(mcos);
	var horizon = R*Math.acos(R/(R+alt));
	return horizon;
}


Satellite.prototype.getPosition = function(jdJulian)
{
  this.calcSatPosition(jdJulian);
  this.calcLatLonAlt(jdJulian);
  return [this.lla[0], this.lla[1], this.lla[2]*1000];
}


////////////////////////////////////////////////////////////////////////////////



Satellite.prototype.calcSatPosition = function(jdTime)
{
  var tSince = (jdTime - this.julianEpoch) * 1440;

  if (this.iDeep == 0){this.SGP4(tSince)}	// near earth
  else{this.SDP4(tSince)}	                // deep space

  this.pos[0] *= u_eqradius;      // km
  this.pos[1] *= u_eqradius;      // km
  this.pos[2] *= u_eqradius;      // km
  this.pos[3] = Math.sqrt(this.pos[0]*this.pos[0]+this.pos[1]*this.pos[1]+this.pos[2]*this.pos[2]);
  this.vel[0] *= u_eqradius/60;	// km/s
  this.vel[1] *= u_eqradius/60;	// km/s
  this.vel[2] *= u_eqradius/60;	// km/s
  this.vel[3] = Math.sqrt(this.vel[0]*this.vel[0]+this.vel[1]*this.vel[1]+this.vel[2]*this.vel[2]);
}

Satellite.prototype.calcLatLonAlt = function(jdTime) 
{
  // Reference:  The 1992 Astronomical Almanac, page K12. 
  var lat,lon,alt;
  var theta,r,e2,phi,c;

  theta = Math.atan2(this.pos[1],this.pos[0]);
  lon = mod2pi(theta-ThetaG(jdTime));
	
  r = Math.sqrt(this.pos[0]*this.pos[0] + this.pos[1]*this.pos[1]);
  e2 = u_f*(2 - u_f);
  lat = Math.atan2(this.pos[2],r);
  do {
    phi = lat;
    c = 1.0/Math.sqrt(1 - e2*Math.sin(phi)*Math.sin(phi));
    lat = Math.atan2( this.pos[2] + u_eqradius*c*e2*Math.sin(phi),r);
  }	while (Math.abs(lat - phi) > 1E-10);   // accuracy of iteration
  alt = r/Math.cos(lat) - u_eqradius*c;

  this.lla[0] = lat;   // radians
  this.lla[1] = lon;   // radians
  this.lla[2] = alt; 	// kilometers
  //this.lla[3] = theta; // radians
  
  if(this.lla[1] >u_pi){this.lla[1]-=u_2pi}
}


Satellite.prototype.parseTLE = function(line1,line2)
{
  this.satelliteNumber = line1.substring(2,7);
  var epYear = line1.substring(18,20)*1;
  var epDay = parseFloat(line1.substring(20,32));
  var temp = parseInt(line1.substring(59,61));
  this.radiationCoefficient = parseFloat(line1.substring(53,59))*Math.pow(10,-5+temp);

  this.inclination = deg2Rad(parseFloat(line2.substring(8,16)));
  this.rightAscending = deg2Rad(parseFloat(line2.substring(17,25)));
  this.eccentricity = parseFloat(line2.substring(26,33))*1e-7;
  this.peregee = deg2Rad(parseFloat(line2.substring(34,42)));
  this.meanAnomaly = deg2Rad(parseFloat(line2.substring(43,51)));
  this.meanMotion = parseFloat(line2.substring(52,63))*u_2pi/1440;

  if (epYear < 57){epYear+=2000}
  else {epYear+=1900}
  this.julianEpoch = julianDateOfYear(epYear)+epDay;

  // Deep Space ?

  var a1,a0,del1,del0;
  a1 = Math.pow (u_xke/this.meanMotion, (2/3));
  temp = (1.5*u_ck2*(3*Math.cos(this.inclination)*Math.cos(this.inclination)-1)/Math.pow(1-this.eccentricity*this.eccentricity,1.5));
  del1 = temp /(a1*a1);
  a0 = a1*(1-del1*(0.5*(2/3)+del1*(1+134/81*del1)));
  del0 = temp/(a0*a0);
  this.xnodp = this.meanMotion/(1+del0);
  if (u_2pi/this.xnodp >= 225) {this.SDP4Init()}    // Yes
  else {this.SGP4Init()}
  this.iFlag = 1;
}