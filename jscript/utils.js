// global variables,

var u_pi = Math.PI;
var u_2pi = 2*u_pi;

/* WGS72
var u_eqradius = 6378.135;				// Earth equatorial radius - km 
var u_f = 1/298.26;					// Earth flattening
var u_ge = 398600.8;					// Earth gravitational constant
var u_J2 = 1.0826158E-3;				// J2 harmonic
var u_J3 = -2.53881E-6;					// J3 harmonic
var u_J4 = -1.65597E-6;					// J4 harmonic
*/

// WGS84
var u_eqradius = 6378.137;				// Earth equatorial radius - km
var u_f = 1/298.257;					// Earth flattening
var u_ge = 398600.8;					// Earth gravitational constant
var u_J2 = 1.08262999E-3;				// J2 harmonic
var u_J3 = -2.53215E-6;					// J3 harmonic
var u_J4 = -1.61099E-6;					// J4 harmonic

var u_ck2 = u_J2/2;
var u_ck4 = -3*u_J4/8;
var u_xj3 = u_J3;
var u_qo  = 1 + 120/u_eqradius;
var u_s = 1 + 78/u_eqradius;
var u_e6a = 1E-6;

var u_omega_E = 1.00273790934;				// earth rotation per sideral day
var u_xke = Math.sqrt(3600*u_ge/(u_eqradius*u_eqradius*u_eqradius));
var u_qoms2t = (u_qo-u_s)*(u_qo-u_s)*(u_qo-u_s)*(u_qo-u_s);


///////////////////////////////////////

function rad2Deg(num){return (180*num/u_pi)}

function deg2Rad(num){return (u_pi*num/180)}

function mod2pi(num)
{
  var mod = num-Math.floor(num/u_2pi)*u_2pi;
  if (mod >= 0){return mod}
  else {return mod+u_2pi}
}

function modulus(num1,num2)
{
  var mod = num1-Math.floor(num1/num2)*num2;
  if (mod >= 0){return mod}
  else{return mod+num2}
}

function destinationr(lata,lona,dist,brng) { // destination along great circle.  returns values in radians
  var dr = dist/6371;
  var cosdr = Math.cos(dr);
  var sindrcl = Math.cos(lata)*Math.sin(dr);
  var sinl = Math.sin(lata);
  var latb = Math.asin(sinl*cosdr + sindrcl*Math.cos(brng));
  var lonb = lona+Math.atan2(Math.sin(brng)*sindrcl, cosdr-sinl*Math.sin(latb));
  return [latb, lonb]

}

function distance (lata,lona,latb,lonb) {  // great circle distance (km)
  return Math.acos(Math.sin(lata)*Math.sin(latb)+Math.cos(lata)*Math.cos(latb)*Math.cos(lonb-lona))*6371;
}

function fixLon(lon) {  // keep Longitude in range -180 to 180
  if (lon > 180){lon -= 360}
  else if (lon < -180){lon += 360}
  return lon
}

function destination(lata,lona,dist,brng) { // destination along great circle.  returns values in degrees
  var latb = Math.asin(Math.sin(lata)*Math.cos(dist/6371) + Math.cos(lata)*Math.sin(dist/6371)*Math.cos(brng));
  var lonb = lona+Math.atan2(Math.sin(brng)*Math.sin(dist/6371)*Math.cos(lata), Math.cos(dist/6371)-Math.sin(lata)*Math.sin(latb));
  return [180*latb/u_pi, 180*lonb/u_pi]

}

function bearing(lata,lona,latb,lonb) {  // initial great circle bearing (rad)
  return Math.atan2(Math.sin(lonb-lona)*Math.cos(latb), Math.cos(lata)*Math.sin(latb)-Math.sin(lata)*Math.cos(latb)*Math.cos(lonb-lona))
}


// Time and date

function JDate(time) {return(2440587.5+time/86400000)}

function UTime(time) {return((time-2440587.5)*86400000)}

function julianDateOfYear(yr)
{
  var rYr = yr-1;
  var A = Math.floor(rYr/100);
  var B = 2 - A + Math.floor(A/4);
  return (Math.floor(365.25 * rYr) + 428 + 1720994.5 + B)
}


function dayOfYear(yr,mo,dy)
{
  var days = [31,28,31,30,31,30,31,31,30,31,30,31];
  var yday = 0;
  for (var i=0;i<(mo-1);i++){yday += days[i]}
  yday += dy;
  if(((yr%4) == 0) && (((yr%100) != 0) || ((yr%400) == 0)) && (mo>2)) {yday+=1}
  return yday;
}


function fractionOfDay (hr,min,sec){return (60*60*hr+60*min+sec)/(24*60*60)}

function ThetaG(jd)
{
// Reference:  The 1992 Astronomical Almanac, page B6. 
  var tmp	= Math.floor(jd+0.5);
  var UT = (jd+0.5)-tmp;
  jd = tmp;
  var TU = (jd-2451545)/36525;
  var GMST = 24110.54841 + TU * (8640184.812866 + TU * (0.093104 - TU * 6.2E-6));
  GMST = modulus(GMST + 86400*u_omega_E*UT,86400);
  return (u_2pi*GMST/86400);
}


// text parsing

function trim(s){  // remove trailing white space and newline from string 
  s.replace(/[\n\r]/g,'');
  return s.replace(/\s+$/, '')
}
