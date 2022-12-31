////////////////////////////////////////////////////////////////////////////////
// 
// SDG4 and SDP4 algorithms
//
////////////////////////////////////////////////////////////////////////////////


Satellite.prototype.SGP4Init = function()
{
  this.iDeep = 0; 
  this.SGP4a1 = 0;
  this.SGP4a3ovk2 = 0;
  this.SGP4ao = 0;
  this.SGP4aodp = 0;
  this.SGP4aycof = 0;
  this.SGP4betao = 0;
  this.SGP4betao2 = 0;
  this.SGP4c1 = 0;
  this.SGP4c1sq = 0;
  this.SGP4c2 = 0;
  this.SGP4c3 = 0;
  this.SGP4c4 = 0;
  this.SGP4c5 = 0;
  this.SGP4coef = 0;
  this.SGP4coef1 = 0;
  this.SGP4cosio = 0;
  this.SGP4d2 = 0;
  this.SGP4d3 = 0;
  this.SGP4d4 = 0;
  this.SGP4del1 = 0;
  this.SGP4delmo = 0;
  this.SGP4delo = 0;
  this.SGP4eeta = 0;
  this.SGP4eosq = 0;
  this.SGP4eta = 0;
  this.SGP4etasq = 0;
  this.SGP4isimp = 0;
  this.SGP4omgcof = 0;
  this.SGP4omgdot = 0;
  this.SGP4perige = 0;
  this.SGP4pinvsq = 0;
  this.SGP4psisq = 0;
  this.SGP4qoms24 = 0;
  this.SGP4s4 = 0;
  this.SGP4sinio = 0;
  this.SGP4sinmo = 0;
  this.SGP4t2cof = 0;
  this.SGP4t3cof = 0;
  this.SGP4t4cof = 0;
  this.SGP4t5cof = 0;
  this.SGP4temp = 0;
  this.SGP4temp1 = 0;
  this.SGP4temp2 = 0;
  this.SGP4temp3 = 0;
  this.SGP4theta2 = 0;
  this.SGP4theta4 = 0;
  this.SGP4tsi = 0;
  this.SGP4x1m5th = 0;
  this.SGP4x1mth2 = 0;
  this.SGP4x3thm1 = 0;
  this.SGP4x7thm1 = 0;
  this.SGP4xhdot1 = 0;
  this.SGP4xlcof = 0;
  this.SGP4xmcof = 0;
  this.SGP4xmdot = 0;
  this.SGP4xnodcf = 0;
  this.SGP4xnodot = 0;
  this.SGP4xnodp = 0;
}


Satellite.prototype.SGP4 = function(tsince)
{
  var i;
  var cosuk,sinuk,rfdotk,vx,vy,vz,ux,uy,uz,xmy,xmx;
  var cosnok,sinnok,cosik,sinik,rdotk,xinck,xnodek,uk,rk;
  var cos2u,sin2u,u,sinu,cosu,betal,rfdot,rdot,r,pl,elsq;
  var esine,ecose,epw,temp6,temp5,temp4,cosepw,sinepw;
  var capu,ayn,xlt,aynl,xll,axn,xn,beta,xl,e,a,tfour;
  var tcube,delm,delomg,templ,tempe,tempa,xnode,tsq,xmp;
  var omega,xnoddf,omgadf,xmdf,x,y,z,xdot,ydot,zdot;
  var ee;

  // Recover original mean motion (xnodp) and semimajor axis (aodp) 
  // from input elements. 
  if (this.iFlag != 0)  {
    this.SGP4a1 = Math.pow(u_xke/this.meanMotion,(2/3));
    this.SGP4cosio = Math.cos(this.inclination);
    this.SGP4theta2 = this.SGP4cosio*this.SGP4cosio;
    this.SGP4x3thm1 = 3*this.SGP4theta2 - 1;
    this.SGP4eosq = this.eccentricity*this.eccentricity;
    this.SGP4betao2 = 1 - this.SGP4eosq;
    this.SGP4betao = Math.sqrt(this.SGP4betao2);
    this.SGP4del1 = 1.5*u_ck2*this.SGP4x3thm1/(this.SGP4a1*this.SGP4a1*this.SGP4betao*this.SGP4betao2);
    this.SGP4ao = this.SGP4a1*(1 - this.SGP4del1*(0.5*(2/3) + this.SGP4del1*(1 + 134/81*this.SGP4del1)));
    this.SGP4delo = 1.5*u_ck2*this.SGP4x3thm1/(this.SGP4ao*this.SGP4ao*this.SGP4betao*this.SGP4betao2);
    this.SGP4xnodp = this.meanMotion/(1 + this.SGP4delo);
    this.SGP4aodp = this.SGP4ao/(1 - this.SGP4delo);

    // Initialization 
    // For perigee less than 220 kilometers, the isimp flag is set and
    //  the equations are truncated to linear variation in sqrt a and
    //  quadratic variation in mean anomaly.  Also, the c3 term, the
    //  delta omega term, and the delta m term are dropped.
    this.SGP4isimp = 0;
    if ((this.SGP4aodp*(1 - this.eccentricity)/1) < (220/u_eqradius + 1))
    {
      this.SGP4isimp = 1;
    }
    
    // For perigee below 156 km, the values of s and qoms2t are altered. 
    this.SGP4s4 = u_s;
    this.SGP4qoms24 = u_qoms2t;
    this.SGP4perige = u_eqradius*(this.SGP4aodp*(1 - this.eccentricity) - 1);
    if (this.SGP4perige < 156)  
    {
      this.SGP4s4 = this.SGP4perige - 78;
      if (this.SGP4perige <= 98) {this.SGP4s4 = 20}
      this.SGP4qoms24 = Math.pow((120 - this.SGP4s4)*1/u_eqradius,4);
      this.SGP4s4 = this.SGP4s4/u_eqradius + 1;
    }
    this.SGP4pinvsq = 1/(this.SGP4aodp*this.SGP4aodp*this.SGP4betao2*this.SGP4betao2); 
    this.SGP4tsi = 1/(this.SGP4aodp - this.SGP4s4);
    this.SGP4eta = this.SGP4aodp*this.eccentricity*this.SGP4tsi;
    this.SGP4etasq = this.SGP4eta*this.SGP4eta;
    this.SGP4eeta = this.eccentricity*this.SGP4eta;
    this.SGP4psisq = Math.abs(1 - this.SGP4etasq);
    this.SGP4coef = this.SGP4qoms24*Math.pow(this.SGP4tsi,4);
    this.SGP4coef1 = this.SGP4coef/Math.pow(this.SGP4psisq,3.5);
    this.SGP4c2 = this.SGP4coef1*this.SGP4xnodp*(this.SGP4aodp*(1 + 1.5*this.SGP4etasq + this.SGP4eeta*(4 + this.SGP4etasq))
     + 0.75*u_ck2*this.SGP4tsi/this.SGP4psisq*this.SGP4x3thm1*(8 + 3*this.SGP4etasq*(8 + this.SGP4etasq)));
    this.SGP4c1 = this.radiationCoefficient*this.SGP4c2;
    this.SGP4sinio = Math.sin(this.inclination);
    this.SGP4a3ovk2 = -u_xj3/u_ck2*Math.pow(1,3);
    this.SGP4c3 = this.SGP4coef*this.SGP4tsi*this.SGP4a3ovk2*this.SGP4xnodp*1*this.SGP4sinio/this.eccentricity;
    this.SGP4x1mth2 = 1 - this.SGP4theta2;
    this.SGP4c4 = 2*this.SGP4xnodp*this.SGP4coef1*this.SGP4aodp*this.SGP4betao2*(this.SGP4eta*(2 + 0.5*this.SGP4etasq)
     + this.eccentricity*(0.5 + 2*this.SGP4etasq) - 2*u_ck2*this.SGP4tsi/(this.SGP4aodp*this.SGP4psisq)
     *(-3*this.SGP4x3thm1*(1 - 2*this.SGP4eeta + this.SGP4etasq*(1.5 - 0.5*this.SGP4eeta))
     + 0.75*this.SGP4x1mth2*(2*this.SGP4etasq - this.SGP4eeta*(1 + this.SGP4etasq))*Math.cos(2*this.peregee)));
    this.SGP4c5 = 2*this.SGP4coef1*this.SGP4aodp*this.SGP4betao2*(1 + 2.75*(this.SGP4etasq + this.SGP4eeta) + this.SGP4eeta*this.SGP4etasq);
    this.SGP4theta4 = this.SGP4theta2*this.SGP4theta2;
    this.SGP4temp1 = 3*u_ck2*this.SGP4pinvsq*this.SGP4xnodp;
    this.SGP4temp2 = this.SGP4temp1*u_ck2*this.SGP4pinvsq;
    this.SGP4temp3 = 1.25*u_ck4*this.SGP4pinvsq*this.SGP4pinvsq*this.SGP4xnodp;
    this.SGP4xmdot = this.SGP4xnodp + 0.5*this.SGP4temp1*this.SGP4betao*this.SGP4x3thm1
     + 0.0625*this.SGP4temp2*this.SGP4betao*(13 - 78*this.SGP4theta2 + 137*this.SGP4theta4);
    this.SGP4x1m5th = 1 - 5*this.SGP4theta2;
    this.SGP4omgdot = -0.5*this.SGP4temp1*this.SGP4x1m5th + 0.0625*this.SGP4temp2*(7 - 114*this.SGP4theta2 +395*this.SGP4theta4)
     + this.SGP4temp3*(3 - 36*this.SGP4theta2 + 49*this.SGP4theta4);
    this.SGP4xhdot1 = -this.SGP4temp1*this.SGP4cosio;
    this.SGP4xnodot = this.SGP4xhdot1 + (0.5*this.SGP4temp2*(4 - 19*this.SGP4theta2)
     + 2*this.SGP4temp3*(3 - 7*this.SGP4theta2))*this.SGP4cosio;
    this.SGP4omgcof = this.radiationCoefficient*this.SGP4c3*Math.cos(this.peregee);
    this.SGP4xmcof = -(2/3)*this.SGP4coef*this.radiationCoefficient*1/this.SGP4eeta;
    this.SGP4xnodcf = 3.5*this.SGP4betao2*this.SGP4xhdot1*this.SGP4c1;
    this.SGP4t2cof = 1.5*this.SGP4c1;
    this.SGP4xlcof = 0.125*this.SGP4a3ovk2*this.SGP4sinio*(3 + 5*this.SGP4cosio)/(1 + this.SGP4cosio);
    this.SGP4aycof = 0.25*this.SGP4a3ovk2*this.SGP4sinio;
    this.SGP4delmo = Math.pow(1 + this.SGP4eta*Math.cos(this.meanAnomaly),3);
    this.SGP4sinmo = Math.sin(this.meanAnomaly);
    this.SGP4x7thm1 = 7*this.SGP4theta2 - 1;
    if (this.SGP4isimp != 1)  
    {
      this.SGP4c1sq = this.SGP4c1*this.SGP4c1;
      this.SGP4d2 = 4*this.SGP4aodp*this.SGP4tsi*this.SGP4c1sq;
      this.SGP4temp = this.SGP4d2*this.SGP4tsi*this.SGP4c1/3;
      this.SGP4d3 = (17*this.SGP4aodp + this.SGP4s4)*this.SGP4temp;
      this.SGP4d4 = 0.5*this.SGP4temp*this.SGP4aodp*this.SGP4tsi*(221*this.SGP4aodp + 31*this.SGP4s4)*this.SGP4c1;
      this.SGP4t3cof = this.SGP4d2 + 2*this.SGP4c1sq;
      this.SGP4t4cof = 0.25*(3*this.SGP4d3 + this.SGP4c1*(12*this.SGP4d2 + 10*this.SGP4c1sq));
      this.SGP4t5cof = 0.2*(3*this.SGP4d4 + 12*this.SGP4c1*this.SGP4d3 + 6*this.SGP4d2*this.SGP4d2 + 15*this.SGP4c1sq*(2*this.SGP4d2 + this.SGP4c1sq));
    } 
    this.iFlag = 0;
  }
  
  // Update for secular gravity and atmospheric drag. 
  xmdf = this.meanAnomaly + this.SGP4xmdot*tsince;
  omgadf = this.peregee + this.SGP4omgdot*tsince;
  xnoddf = this.rightAscending + this.SGP4xnodot*tsince;
  omega = omgadf;
  xmp = xmdf;
  tsq = tsince*tsince;
  xnode = xnoddf + this.SGP4xnodcf*tsq;
  tempa = 1 - this.SGP4c1*tsince;
  tempe = this.radiationCoefficient*this.SGP4c4*tsince;
  templ = this.SGP4t2cof*tsq;
  if (this.SGP4isimp != 1) 
  {
    delomg = this.SGP4omgcof*tsince;
    delm = this.SGP4xmcof*(Math.pow(1 + this.SGP4eta*Math.cos(xmdf),3) - this.SGP4delmo);
    this.SGP4temp = delomg + delm;
    xmp = xmdf + this.SGP4temp;
    omega = omgadf - this.SGP4temp;
    tcube = tsq*tsince;
    tfour = tsince*tcube;
    tempa = tempa - this.SGP4d2*tsq - this.SGP4d3*tcube - this.SGP4d4*tfour;
    tempe = tempe + this.radiationCoefficient*this.SGP4c5*(Math.sin(xmp) - this.SGP4sinmo);
    templ = templ + this.SGP4t3cof*tcube + tfour*(this.SGP4t4cof + tsince*this.SGP4t5cof);
  }
  a = this.SGP4aodp*tempa*tempa;
  e = this.eccentricity - tempe;
  ee = e*e;
  if ( ee > 1) {return false}  // error, no good satellite datas ...
  xl = xmp + omega + xnode + this.SGP4xnodp*templ;
  beta = Math.sqrt(1 - ee);
  xn = u_xke/Math.pow(a,1.5);
  
  // Long period periodics 
  axn = e*Math.cos(omega);
  this.SGP4temp = 1/(a*beta*beta);
  xll = this.SGP4temp*this.SGP4xlcof*axn;
  aynl = this.SGP4temp*this.SGP4aycof;
  xlt = xl + xll;
  ayn = e*Math.sin(omega) + aynl;
  
  // Solve Kepler's Equation 
  capu = mod2pi(xlt - xnode);
  this.SGP4temp2 = capu;
  for (i = 1;i <= 10;i++)  {
    sinepw = Math.sin(this.SGP4temp2);
    cosepw = Math.cos(this.SGP4temp2);
    this.SGP4temp3 = axn*sinepw;
    temp4 = ayn*cosepw;
    temp5 = axn*cosepw;
    temp6 = ayn*sinepw;
    epw = (capu - temp4 + this.SGP4temp3 - this.SGP4temp2)/(1 - temp5 - temp6) + this.SGP4temp2;
    if (Math.abs(epw - this.SGP4temp2) <= u_e6a){break}
    this.SGP4temp2 = epw;
  }; //for i
  
  // Short period preliminary quantities 
  ecose = temp5 + temp6;
  esine = this.SGP4temp3 - temp4;
  elsq = axn*axn + ayn*ayn;
  this.SGP4temp = 1 - elsq;
  pl = a*this.SGP4temp;
  r = a*(1 - ecose);
  this.SGP4temp1 = 1/r;
  rdot = u_xke*Math.sqrt(a)*esine*this.SGP4temp1;
  rfdot = u_xke*Math.sqrt(pl)*this.SGP4temp1;
  this.SGP4temp2 = a*this.SGP4temp1;
  betal = Math.sqrt(this.SGP4temp);
  this.SGP4temp3 = 1/(1 + betal);
  cosu = this.SGP4temp2*(cosepw - axn + ayn*esine*this.SGP4temp3);
  sinu = this.SGP4temp2*(sinepw - ayn - axn*esine*this.SGP4temp3);
  u = Math.atan2(sinu,cosu);
  sin2u = 2*sinu*cosu;
  cos2u = 2*cosu*cosu - 1;
  this.SGP4temp = 1/pl;
  this.SGP4temp1 = u_ck2*this.SGP4temp;
  this.SGP4temp2 = this.SGP4temp1*this.SGP4temp;
  
  // Update for short periodics 
  rk = r*(1 - 1.5*this.SGP4temp2*betal*this.SGP4x3thm1) + 0.5*this.SGP4temp1*this.SGP4x1mth2*cos2u;
  uk = u - 0.25*this.SGP4temp2*this.SGP4x7thm1*sin2u;
  xnodek = xnode + 1.5*this.SGP4temp2*this.SGP4cosio*sin2u;
  xinck = this.inclination + 1.5*this.SGP4temp2*this.SGP4cosio*this.SGP4sinio*cos2u;
  rdotk = rdot - xn*this.SGP4temp1*this.SGP4x1mth2*sin2u;
  rfdotk = rfdot + xn*this.SGP4temp1*(this.SGP4x1mth2*cos2u + 1.5*this.SGP4x3thm1);
  
  // Orientation vectors 
  sinuk = Math.sin(uk);
  cosuk = Math.cos(uk);
  sinik = Math.sin(xinck);
  cosik = Math.cos(xinck);
  sinnok = Math.sin(xnodek);
  cosnok = Math.cos(xnodek);
  xmx = -sinnok*cosik;
  xmy = cosnok*cosik;
  ux = xmx*sinuk + cosnok*cosuk;
  uy = xmy*sinuk + sinnok*cosuk;
  uz = sinik*sinuk;
  vx = xmx*cosuk - cosnok*sinuk;
  vy = xmy*cosuk - sinnok*sinuk;
  vz = sinik*cosuk;
  
  // Position and velocity 
  x = rk*ux;  this.pos[0] = x;
  y = rk*uy;  this.pos[1] = y;
  z = rk*uz;  this.pos[2] = z;

  xdot = rdotk*ux + rfdotk*vx;  this.vel[0] = xdot;
  ydot = rdotk*uy + rfdotk*vy;  this.vel[1] = ydot;
  zdot = rdotk*uz + rfdotk*vz;  this.vel[2] = zdot;
  return true;
}


Satellite.prototype.SDP4Init = function()
{

  this.iDeep = 1; 

  this.SDP4a1     = 0;this.SDP4a3ovk2   = 0;this.SDP4ao     = 0;
  this.SDP4aodp   = 0;this.SDP4aycof  = 0;this.SDP4betao  = 0;
  this.SDP4betao2   = 0;this.SDP4c1     = 0;this.SDP4c2     = 0;
  this.SDP4c4     = 0;this.SDP4coef   = 0;this.SDP4coef1  = 0;
  this.SDP4cosg   = 0;this.SDP4cosio  = 0;this.SDP4del1   = 0;
  this.SDP4delo   = 0;this.SDP4eeta   = 0;this.SDP4eosq   = 0;
  this.SDP4eta    = 0;this.SDP4etasq  = 0;this.SDP4omgdot   = 0;
  this.SDP4perige   = 0;this.SDP4pinvsq   = 0;this.SDP4psisq  = 0;
  this.SDP4qoms24   = 0;this.SDP4s4     = 0;this.SDP4sing   = 0;
  this.SDP4sinio  = 0;this.SDP4t2cof  = 0;this.SDP4temp1  = 0;
  this.SDP4temp2  = 0;this.SDP4temp3  = 0;this.SDP4theta2   = 0;
  this.SDP4theta4   = 0;this.SDP4tsi    = 0;this.SDP4x1m5th   = 0;
  this.SDP4x1mth2   = 0;this.SDP4x3thm1   = 0;this.SDP4x7thm1   = 0;
  this.SDP4xhdot1   = 0;this.SDP4xlcof  = 0;this.SDP4xmdot  = 0;
  this.SDP4xnodcf   = 0;this.SDP4xnodot   = 0;this.SDP4xnodp  = 0;


// Init the static variables ...
this.Deepzns  =  1.19459E-5;   this.Deepc1ss   =  2.9864797E-6;   this.Deepzes  =  0.01675;
this.Deepznl  =  1.5835218E-4;   this.Deepc1l  =  4.7968065E-7;   this.Deepzel  =  0.05490;
this.Deepzcosis =  0.91744867;   this.Deepzsinis =  0.39785416;   this.Deepzsings = -0.98088458;
this.Deepzcosgs =  0.1945905;
/*  this.Deepzcoshs =  1;        this.Deepzsinhs =  0; never used ...*/
this.Deepq22  =  1.7891679E-6;   this.Deepq31  =  2.1460748E-6;   this.Deepq33  =  2.2123015E-7;
this.Deepg22  =  5.7686396;    this.Deepg32  =  0.95240898;   this.Deepg44  =  1.8014998;
this.Deepg52  =  1.0508330;    this.Deepg54  =  4.4108898;    this.Deeproot22 =  1.7891679E-6;
this.Deeproot32 =  3.7393792E-7;   this.Deeproot44 =  7.3636953E-9;   this.Deeproot52 =  1.1428639E-7;
this.Deeproot54 =  2.1765803E-9;   this.Deepthdt   =  4.3752691E-3;
//const  Typed constants to retain values between ENTRY calls 
this.Deepiresfl   = 0;this.Deepisynfl  = 0;
this.Deepiret  = 0;this.Deepiretn  = 0;
this.Deepls  = 0;
this.Deepa1    = 0;this.Deepa2    = 0;this.Deepa3    = 0;
this.Deepa4    = 0;this.Deepa5    = 0;this.Deepa6    = 0;
this.Deepa7    = 0;this.Deepa8    = 0;this.Deepa9    = 0;
this.Deepa10   = 0;this.Deepainv2   = 0;this.Deepalfdp   = 0;
this.Deepaqnv  = 0;this.Deepatime   = 0;this.Deepbetdp   = 0;
this.Deepbfact   = 0;this.Deepc     = 0;this.Deepcc    = 0;
this.Deepcosis   = 0;this.Deepcosok   = 0;this.Deepcosq  = 0;
this.Deepctem  = 0;this.Deepd2201   = 0;this.Deepd2211   = 0;
this.Deepd3210   = 0;this.Deepd3222   = 0;this.Deepd4410   = 0;
this.Deepd4422   = 0;this.Deepd5220   = 0;this.Deepd5232   = 0;
this.Deepd5421   = 0;this.Deepd5433   = 0;this.Deepdalf  = 0;
this.Deepday   = 0;this.Deepdbet  = 0;this.Deepdel1  = 0;
this.Deepdel2  = 0;this.Deepdel3  = 0;this.Deepdelt  = 0;
this.Deepdls   = 0;this.Deepe3    = 0;this.Deepee2   = 0;
this.Deepeoc   = 0;this.Deepeq    = 0;this.Deepf2    = 0;
this.Deepf220  = 0;this.Deepf221  = 0;this.Deepf3    = 0;
this.Deepf311  = 0;this.Deepf321  = 0;this.Deepf322  = 0;
this.Deepf330  = 0;this.Deepf441  = 0;this.Deepf442  = 0;
this.Deepf522  = 0;this.Deepf523  = 0;this.Deepf542  = 0;
this.Deepf543  = 0;this.Deepfasx2   = 0;this.Deepfasx4   = 0;
this.Deepfasx6   = 0;this.Deepft    = 0;this.Deepg200  = 0;
this.Deepg201  = 0;this.Deepg211  = 0;this.Deepg300  = 0;
this.Deepg310  = 0;this.Deepg322  = 0;this.Deepg410  = 0;
this.Deepg422  = 0;this.Deepg520  = 0;this.Deepg521  = 0;
this.Deepg532  = 0;this.Deepg533  = 0;this.Deepgam   = 0;
this.Deepomegaq  = 0;this.Deeppe    = 0;this.Deeppgh   = 0;
this.Deepph    = 0;this.Deeppinc  = 0;this.Deeppl    = 0;
this.Deeppreep   = 0;this.Deeps1    = 0;this.Deeps2    = 0;
this.Deeps3    = 0;this.Deeps4    = 0;this.Deeps5    = 0;
this.Deeps6    = 0;this.Deeps7    = 0;this.Deepsavtsn  = 0;
this.Deepse    = 0;this.Deepse2   = 0;this.Deepse3   = 0;
this.Deepsel   = 0;this.Deepses   = 0;this.Deepsgh   = 0;
this.Deepsgh2  = 0;this.Deepsgh3  = 0;this.Deepsgh4  = 0;
this.Deepsghl  = 0;this.Deepsghs  = 0;this.Deepsh    = 0;
this.Deepsh2   = 0;this.Deepsh3   = 0;this.Deepsh1   = 0;
this.Deepshs   = 0;this.Deepsi    = 0;this.Deepsi2   = 0;
this.Deepsi3   = 0;this.Deepsil   = 0;this.Deepsini2   = 0;
this.Deepsinis   = 0;this.Deepsinok   = 0;this.Deepsinq  = 0;
this.Deepsinzf   = 0;this.Deepsis   = 0;this.Deepsl    = 0;
this.Deepsl2   = 0;this.Deepsl3   = 0;this.Deepsl4   = 0;
this.Deepsll   = 0;this.Deepsls   = 0;this.Deepsse   = 0;
this.Deepssg   = 0;this.Deepssh   = 0;this.Deepssi   = 0;
this.Deepssl   = 0;this.Deepstem  = 0;this.Deepstep2   = 0;
this.Deepstepn   = 0;this.Deepstepp   = 0;this.Deeptemp  = 0;
this.Deeptemp1   = 0;this.Deepthgr  = 0;this.Deepx1    = 0;
this.Deepx2    = 0;this.Deepx2li  = 0;this.Deepx2omi   = 0;
this.Deepx3    = 0;this.Deepx4    = 0;this.Deepx5    = 0;
this.Deepx6    = 0;this.Deepx7    = 0;this.Deepx8    = 0;
this.Deepxfact   = 0;this.Deepxgh2  = 0;this.Deepxgh3  = 0;
this.Deepxgh4  = 0;this.Deepxh2   = 0;this.Deepxh3   = 0;
this.Deepxi2   = 0;this.Deepxi3   = 0;this.Deepxl    = 0;
this.Deepxl2   = 0;this.Deepxl3   = 0;this.Deepxl4   = 0;
this.Deepxlamo   = 0;this.Deepxldot   = 0;this.Deepxli   = 0;
this.Deepxls   = 0;this.Deepxmao  = 0;this.Deepxnddt   = 0;
this.Deepxndot   = 0;this.Deepxni   = 0;this.Deepxno2  = 0;
this.Deepxnodce  = 0;this.Deepxnoi  = 0;this.Deepxnq   = 0;
this.Deepxomi  = 0;this.Deepxpidot  = 0;this.Deepxqncl   = 0;
this.Deepz1    = 0;this.Deepz11   = 0;this.Deepz12   = 0;
this.Deepz13   = 0;this.Deepz2    = 0;this.Deepz21   = 0;
this.Deepz22   = 0;this.Deepz23   = 0;this.Deepz3    = 0;
this.Deepz31   = 0;this.Deepz32   = 0;this.Deepz33   = 0;
this.Deepzcosg   = 0;this.Deepzcosgl  = 0;this.Deepzcosh   = 0;
this.Deepzcoshl  = 0;this.Deepzcosi   = 0;this.Deepzcosil  = 0;
this.Deepze    = 0;this.Deepzf    = 0;this.Deepzm    = 0;
this.Deepzmo   = 0;this.Deepzmol  = 0;this.Deepzmos  = 0;
this.Deepzn    = 0;this.Deepzsing   = 0;this.Deepzsingl  = 0;
this.Deepzsinh   = 0;this.Deepzsinhl  = 0;this.Deepzsini   = 0;
this.Deepzsinil  = 0;this.Deepzx    = 0;this.Deepzy    = 0;

}


Satellite.prototype.Deep = function(ideep)
{
  var DEEP20, DEEP45, DEEP80, DEEP100, DEEP125, DEEP150;
  DEEP20 = false;
  DEEP45 = true;
  DEEP80 = false;
  DEEP100 = true;
  DEEP125 = false;
  DEEP150 = false;

  var  bStopInnerLoop = false;
  if (ideep == 1) 
  { // Entrance for deep space initialization 
    this.Deepthgr = ThetaG(this.julianEpoch);
    this.Deepeq = this.eccentricity;
    this.Deepxnq = this.xnodp;
    this.Deepaqnv = 1/this.ao;
    this.Deepxqncl = this.inclination;
    this.Deepxmao = this.meanAnomaly;
    this.Deepxpidot = this.omgdt + this.xnodot;
    this.Deepsinq = Math.sin(this.rightAscending);
    this.Deepcosq = Math.cos(this.rightAscending);
    this.Deepomegaq = this.peregee;
   
    // Initialize lunar solar terms 
    this.Deepday = this.julianEpoch - 2433281.5 + 18261.5;  //Days since 1900 Jan 0.5
    if (this.Deepday != this.Deeppreep)  
    {
      this.Deeppreep = this.Deepday;
      this.Deepxnodce = 4.5236020 - 9.2422029E-4*this.Deepday;
      this.Deepstem = Math.sin(this.Deepxnodce);
      this.Deepctem = Math.cos(this.Deepxnodce);
      this.Deepzcosil = 0.91375164 - 0.03568096*this.Deepctem;
      this.Deepzsinil = Math.sqrt(1 - this.Deepzcosil*this.Deepzcosil);
      this.Deepzsinhl = 0.089683511*this.Deepstem/this.Deepzsinil;
      this.Deepzcoshl = Math.sqrt(1 - this.Deepzsinhl*this.Deepzsinhl);
      this.Deepc = 4.7199672 + 0.22997150*this.Deepday;
      this.Deepgam = 5.8351514 + 0.0019443680*this.Deepday;
      this.Deepzmol = mod2pi(this.Deepc - this.Deepgam);
      this.Deepzx = 0.39785416*this.Deepstem/this.Deepzsinil;
      this.Deepzy = this.Deepzcoshl*this.Deepctem + 0.91744867*this.Deepzsinhl*this.Deepstem;
      this.Deepzx = Math.atan2(this.Deepzx,this.Deepzy);
      this.Deepzx = this.Deepgam + this.Deepzx - this.Deepxnodce;
      this.Deepzcosgl = Math.cos(this.Deepzx);
      this.Deepzsingl = Math.sin(this.Deepzx);
      this.Deepzmos = 6.2565837 + 0.017201977*this.Deepday;
      this.Deepzmos = mod2pi(this.Deepzmos);
    }
    
    // Do solar terms 
    this.Deepsavtsn = 1E20;
    this.Deepzcosg = this.Deepzcosgs;
    this.Deepzsing = this.Deepzsings;
    this.Deepzcosi = this.Deepzcosis;
    this.Deepzsini = this.Deepzsinis;
    this.Deepzcosh = this.Deepcosq;
    this.Deepzsinh = this.Deepsinq;
    this.Deepcc = this.Deepc1ss;
    this.Deepzn = this.Deepzns;
    this.Deepze = this.Deepzes;
    this.Deepzmo = this.Deepzmos;
    this.Deepxnoi = 1/this.Deepxnq;
    this.Deepls = 30; //assign 30 to ls
    DEEP20 = true;
    while (DEEP20)  
    {
      DEEP20 = false;
      this.Deepa1 = this.Deepzcosg*this.Deepzcosh + this.Deepzsing*this.Deepzcosi*this.Deepzsinh;
      this.Deepa3 = -this.Deepzsing*this.Deepzcosh + this.Deepzcosg*this.Deepzcosi*this.Deepzsinh;
      this.Deepa7 = -this.Deepzcosg*this.Deepzsinh + this.Deepzsing*this.Deepzcosi*this.Deepzcosh;
      this.Deepa8 = this.Deepzsing*this.Deepzsini;
      this.Deepa9 = this.Deepzsing*this.Deepzsinh + this.Deepzcosg*this.Deepzcosi*this.Deepzcosh;
      this.Deepa10 = this.Deepzcosg*this.Deepzsini;
      this.Deepa2 = this.cosiq*this.Deepa7 +  this.siniq*this.Deepa8;
      this.Deepa4 = this.cosiq*this.Deepa9 +  this.siniq*this.Deepa10;
      this.Deepa5 = -this.siniq*this.Deepa7 +  this.cosiq*this.Deepa8;
      this.Deepa6 = -this.siniq*this.Deepa9 +  this.cosiq*this.Deepa10;
      this.Deepx1 = this.Deepa1*this.cosomo + this.Deepa2*this.sinomo;
      this.Deepx2 = this.Deepa3*this.cosomo + this.Deepa4*this.sinomo;
      this.Deepx3 = -this.Deepa1*this.sinomo + this.Deepa2*this.cosomo;
      this.Deepx4 = -this.Deepa3*this.sinomo + this.Deepa4*this.cosomo;
      this.Deepx5 = this.Deepa5*this.sinomo;
      this.Deepx6 = this.Deepa6*this.sinomo;
      this.Deepx7 = this.Deepa5*this.cosomo;
      this.Deepx8 = this.Deepa6*this.cosomo;
      this.Deepz31 = 12*this.Deepx1*this.Deepx1 - 3*this.Deepx3*this.Deepx3;
      this.Deepz32 = 24*this.Deepx1*this.Deepx2 - 6*this.Deepx3*this.Deepx4;
      this.Deepz33 = 12*this.Deepx2*this.Deepx2 - 3*this.Deepx4*this.Deepx4;
      this.Deepz1 = 3*(this.Deepa1*this.Deepa1 + this.Deepa2*this.Deepa2) + this.Deepz31*this.eqsq;
      this.Deepz2 = 6*(this.Deepa1*this.Deepa3 + this.Deepa2*this.Deepa4) + this.Deepz32*this.eqsq;
      this.Deepz3 = 3*(this.Deepa3*this.Deepa3 + this.Deepa4*this.Deepa4) + this.Deepz33*this.eqsq;
      this.Deepz11 = -6*this.Deepa1*this.Deepa5 + this.eqsq*(-24*this.Deepx1*this.Deepx7 - 6*this.Deepx3*this.Deepx5);
      this.Deepz12 = -6*(this.Deepa1*this.Deepa6 + this.Deepa3*this.Deepa5)
       + this.eqsq*(-24*(this.Deepx2*this.Deepx7 + this.Deepx1*this.Deepx8) - 6*(this.Deepx3*this.Deepx6 + this.Deepx4*this.Deepx5));
      this.Deepz13 = -6*this.Deepa3*this.Deepa6 + this.eqsq*(-24*this.Deepx2*this.Deepx8 - 6*this.Deepx4*this.Deepx6);
      this.Deepz21 = 6*this.Deepa2*this.Deepa5 + this.eqsq*(24*this.Deepx1*this.Deepx5 - 6*this.Deepx3*this.Deepx7);
      this.Deepz22 = 6*(this.Deepa4*this.Deepa5 + this.Deepa2*this.Deepa6)
       + this.eqsq*(24*(this.Deepx2*this.Deepx5 + this.Deepx1*this.Deepx6) - 6*(this.Deepx4*this.Deepx7 + this.Deepx3*this.Deepx8));
      this.Deepz23 = 6*this.Deepa4*this.Deepa6 + this.eqsq*(24*this.Deepx2*this.Deepx6 - 6*this.Deepx4*this.Deepx8);
      this.Deepz1 = this.Deepz1 + this.Deepz1 + this.bsq*this.Deepz31;
      this.Deepz2 = this.Deepz2 + this.Deepz2 + this.bsq*this.Deepz32;
      this.Deepz3 = this.Deepz3 + this.Deepz3 + this.bsq*this.Deepz33;
      this.Deeps3 = this.Deepcc*this.Deepxnoi;
      this.Deeps2 = -0.5*this.Deeps3/this.rteqsq;
      this.Deeps4 = this.Deeps3*this.rteqsq;
      this.Deeps1 = -15*this.Deepeq*this.Deeps4;
      this.Deeps5 = this.Deepx1*this.Deepx3 + this.Deepx2*this.Deepx4;
      this.Deeps6 = this.Deepx2*this.Deepx3 + this.Deepx1*this.Deepx4;
      this.Deeps7 = this.Deepx2*this.Deepx4 - this.Deepx1*this.Deepx3;
      this.Deepse = this.Deeps1*this.Deepzn*this.Deeps5;
      this.Deepsi = this.Deeps2*this.Deepzn*(this.Deepz11 + this.Deepz13);
      this.Deepsl = -this.Deepzn*this.Deeps3*(this.Deepz1 + this.Deepz3 - 14 - 6*this.eqsq);
      this.Deepsgh = this.Deeps4*this.Deepzn*(this.Deepz31 + this.Deepz33 - 6);
      this.Deepsh = -this.Deepzn*this.Deeps2*(this.Deepz21 + this.Deepz23);
      if (this.Deepxqncl < 5.2359877E-2){this.Deepsh = 0}
      this.Deepee2 = 2*this.Deeps1*this.Deeps6;
      this.Deepe3 = 2*this.Deeps1*this.Deeps7;
      this.Deepxi2 = 2*this.Deeps2*this.Deepz12;
      this.Deepxi3 = 2*this.Deeps2*(this.Deepz13 - this.Deepz11);
      this.Deepxl2 = -2*this.Deeps3*this.Deepz2;
      this.Deepxl3 = -2*this.Deeps3*(this.Deepz3 - this.Deepz1);
      this.Deepxl4 = -2*this.Deeps3*(-21 - 9*this.eqsq)*this.Deepze;
      this.Deepxgh2 = 2*this.Deeps4*this.Deepz32;
      this.Deepxgh3 = 2*this.Deeps4*(this.Deepz33 - this.Deepz31);
      this.Deepxgh4 = -18*this.Deeps4*this.Deepze;
      this.Deepxh2 = -2*this.Deeps2*this.Deepz22;
      this.Deepxh3 = -2*this.Deeps2*(this.Deepz23 - this.Deepz21);
    
      // Do lunar terms 
      if (this.Deepls == 30)   
      {
        this.Deepsse = this.Deepse;
        this.Deepssi = this.Deepsi;
        this.Deepssl = this.Deepsl;
        this.Deepssh = this.Deepsh/this.siniq;
        this.Deepssg = this.Deepsgh - this.cosiq*this.Deepssh;
        this.Deepse2 = this.Deepee2;
        this.Deepsi2 = this.Deepxi2;
        this.Deepsl2 = this.Deepxl2;
        this.Deepsgh2 = this.Deepxgh2;
        this.Deepsh2 = this.Deepxh2;
        this.Deepse3 = this.Deepe3;
        this.Deepsi3 = this.Deepxi3;
        this.Deepsl3 = this.Deepxl3;
        this.Deepsgh3 = this.Deepxgh3;
        this.Deepsh3 = this.Deepxh3;
        this.Deepsl4 = this.Deepxl4; 
        this.Deepsgh4 = this.Deepxgh4;
        this.Deepzcosg = this.Deepzcosgl;
        this.Deepzsing = this.Deepzsingl;
        this.Deepzcosi = this.Deepzcosil;
        this.Deepzsini = this.Deepzsinil;
        this.Deepzcosh = this.Deepzcoshl*this.Deepcosq + this.Deepzsinhl*this.Deepsinq;
        this.Deepzsinh = this.Deepsinq*this.Deepzcoshl - this.Deepcosq*this.Deepzsinhl;
        this.Deepzn = this.Deepznl;
        this.Deepcc = this.Deepc1l;
        this.Deepze = this.Deepzel;
        this.Deepzmo = this.Deepzmol;
        this.Deepls = 40; //assign 40 to ls
        DEEP20 = true;
      }
      else if (this.Deepls == 40)   
      {
        this.Deepsse = this.Deepsse + this.Deepse;
        this.Deepssi = this.Deepssi + this.Deepsi;
        this.Deepssl = this.Deepssl + this.Deepsl;
        this.Deepssg = this.Deepssg + this.Deepsgh - this.cosiq/this.siniq*this.Deepsh;
        this.Deepssh = this.Deepssh + this.Deepsh/this.siniq;
       
        // Geopotential resonance initialization for 12 hour orbits 
        this.Deepiresfl = 0;
        this.Deepisynfl = 0;
        DEEP80 = false;
        //  if ((xnq < 0.0052359877) and (xnq > 0.0034906585))  {
        if (( this.Deepxnq < 0.0052359877 ) && ( this.Deepxnq > 0.0034906585 ))  
        {
          this.Deepiresfl = 1;
          this.Deepisynfl = 1;
          this.Deepg200 = 1 + this.eqsq*(-2.5 + 0.8125*this.eqsq);
          this.Deepg310 = 1 + 2*this.eqsq;
          this.Deepg300 = 1 + this.eqsq*(-6 + 6.60937*this.eqsq);
          this.Deepf220 = 0.75*(1 + this.cosiq)*(1 + this.cosiq);
          this.Deepf311 = 0.9375*this.siniq*this.siniq*(1 + 3*this.cosiq) - 0.75*(1 + this.cosiq);
          this.Deepf330 = 1 + this.cosiq;
          this.Deepf330 = 1.875*this.Deepf330*this.Deepf330*this.Deepf330;
          this.Deepdel1 = 3*this.Deepxnq*this.Deepxnq*this.Deepaqnv*this.Deepaqnv;
          this.Deepdel2 = 2*this.Deepdel1*this.Deepf220*this.Deepg200*this.Deepq22;
          this.Deepdel3 = 3*this.Deepdel1*this.Deepf330*this.Deepg300*this.Deepq33*this.Deepaqnv;
          this.Deepdel1 = this.Deepdel1*this.Deepf311*this.Deepg310*this.Deepq31*this.Deepaqnv;
          this.Deepfasx2 = 0.13130908;
          this.Deepfasx4 = 2.8843198;
          this.Deepfasx6 = 0.37448087;
          this.Deepxlamo = this.Deepxmao + this.rightAscending + this.peregee - this.Deepthgr;
          this.Deepbfact = this.xlldot + this.Deepxpidot - this.Deepthdt;
          this.Deepbfact = this.Deepbfact + this.Deepssl + this.Deepssg + this.Deepssh;
          DEEP80 = true;
        }
        if (!DEEP80)  
        {
          if (( this.Deepxnq < 8.26E-3 ) || ( this.Deepxnq > 9.24E-3 )){return true}
          if (this.Deepeq < 0.5){return true}
          this.Deepiresfl = 1;
          this.Deepeoc = this.Deepeq*this.eqsq;
          this.Deepg201 = -0.306 - (this.Deepeq - 0.64)*0.440;
          DEEP45 = true;
          if (this.Deepeq <= 0.65)  {
            this.Deepg211 = 3.616 - 13.247*this.Deepeq + 16.290*this.eqsq;
            this.Deepg310 = -19.302 + 117.390*this.Deepeq - 228.419*this.eqsq + 156.591*this.Deepeoc;
            this.Deepg322 = -18.9068 + 109.7927*this.Deepeq - 214.6334*this.eqsq + 146.5816*this.Deepeoc;
            this.Deepg410 = -41.122 + 242.694*this.Deepeq - 471.094*this.eqsq + 313.953*this.Deepeoc;
            this.Deepg422 = -146.407 + 841.880*this.Deepeq - 1629.014*this.eqsq + 1083.435*this.Deepeoc;
            this.Deepg520 = -532.114 + 3017.977*this.Deepeq - 5740*this.eqsq + 3708.276*this.Deepeoc;
            DEEP45 = false;
          }
        } // DEEP80 not set ...
      }
      else  return true;
    } // return to DEEP20 untill DEEP2 == false ...
    if (!DEEP80)  
    {   
      if (DEEP45)  
      {  
        this.Deepg211 = -72.099 + 331.819*this.Deepeq - 508.738*this.eqsq + 266.724*this.Deepeoc;
        this.Deepg310 = -346.844 + 1582.851*this.Deepeq - 2415.925*this.eqsq + 1246.113*this.Deepeoc;
        this.Deepg322 = -342.585 + 1554.908*this.Deepeq - 2366.899*this.eqsq + 1215.972*this.Deepeoc;
        this.Deepg410 = -1052.797 + 4758.686*this.Deepeq - 7193.992*this.eqsq + 3651.957*this.Deepeoc;
        this.Deepg422 = -3581.69 + 16178.11*this.Deepeq - 24462.77*this.eqsq + 12422.52*this.Deepeoc;
      }
      if (this.Deepeq > 0.715){this.Deepg520 = -5149.66 + 29936.92*this.Deepeq - 54087.36*this.eqsq + 31324.56*this.Deepeoc}
      else{this.Deepg520 = 1464.74 - 4664.75*this.Deepeq + 3763.64*this.eqsq}
      if (this.Deepeq < (0.7))  
      {
        this.Deepg533 = -919.2277 + 4988.61*this.Deepeq - 9064.77*this.eqsq + 5542.21*this.Deepeoc;
        this.Deepg521 = -822.71072 + 4568.6173*this.Deepeq - 8491.4146*this.eqsq + 5337.524*this.Deepeoc;
        this.Deepg532 = -853.666 + 4690.25*this.Deepeq - 8624.77*this.eqsq + 5341.4*this.Deepeoc;
      }
      else  
      {
        this.Deepg533 = -37995.78 + 161616.52*this.Deepeq - 229838.2*this.eqsq + 109377.94*this.Deepeoc;
        this.Deepg521 = -51752.104 + 218913.95*this.Deepeq - 309468.16*this.eqsq + 146349.42*this.Deepeoc;
        this.Deepg532 = -40023.88 + 170470.89*this.Deepeq - 242699.48*this.eqsq + 115605.82*this.Deepeoc;
      }
      this.Deepsini2 = this.siniq*this.siniq;
      this.Deepf220 = 0.75*(1 + 2*this.cosiq + this.cosq2);
      this.Deepf221 = 1.5*this.Deepsini2;
      this.Deepf321 = 1.875*this.siniq*(1 - 2*this.cosiq - 3*this.cosq2);
      this.Deepf322 = -1.875*this.siniq*(1 + 2*this.cosiq - 3*this.cosq2);
      this.Deepf441 = 35*this.Deepsini2*this.Deepf220;
      this.Deepf442 = 39.3750*this.Deepsini2*this.Deepsini2;
      this.Deepf522 = 9.84375*this.siniq*(this.Deepsini2*(1 - 2*this.cosiq - 5*this.cosq2)
        + 0.33333333*(-2 + 4*this.cosiq + 6*this.cosq2));
      this.Deepf523 = this.siniq*(4.92187512*this.Deepsini2*(-2 - 4*this.cosiq + 10*this.cosq2)
        + 6.56250012*(1 + 2*this.cosiq - 3*this.cosq2));
      this.Deepf542 = 29.53125*this.siniq*(2 - 8*this.cosiq + this.cosq2*(-12 + 8*this.cosiq + 10*this.cosq2));
      this.Deepf543 = 29.53125*this.siniq*(-2 - 8*this.cosiq + this.cosq2*(12 + 8*this.cosiq - 10*this.cosq2));
      this.Deepxno2 = this.Deepxnq*this.Deepxnq;
      this.Deepainv2 = this.Deepaqnv*this.Deepaqnv;
      this.Deeptemp1 = 3*this.Deepxno2*this.Deepainv2;
      this.Deeptemp = this.Deeptemp1*this.Deeproot22;
      this.Deepd2201 = this.Deeptemp*this.Deepf220*this.Deepg201;
      this.Deepd2211 = this.Deeptemp*this.Deepf221*this.Deepg211;
      this.Deeptemp1 = this.Deeptemp1*this.Deepaqnv;
      this.Deeptemp = this.Deeptemp1*this.Deeproot32;
      this.Deepd3210 = this.Deeptemp*this.Deepf321*this.Deepg310;
      this.Deepd3222 = this.Deeptemp*this.Deepf322*this.Deepg322;
      this.Deeptemp1 = this.Deeptemp1*this.Deepaqnv;
      this.Deeptemp = 2*this.Deeptemp1*this.Deeproot44;
      this.Deepd4410 = this.Deeptemp*this.Deepf441*this.Deepg410;
      this.Deepd4422 = this.Deeptemp*this.Deepf442*this.Deepg422;
      this.Deeptemp1 = this.Deeptemp1*this.Deepaqnv;
      this.Deeptemp = this.Deeptemp1*this.Deeproot52;
      this.Deepd5220 = this.Deeptemp*this.Deepf522*this.Deepg520;
      this.Deepd5232 = this.Deeptemp*this.Deepf523*this.Deepg532;
      this.Deeptemp = 2*this.Deeptemp1*this.Deeproot54;
      this.Deepd5421 = this.Deeptemp*this.Deepf542*this.Deepg521;
      this.Deepd5433 = this.Deeptemp*this.Deepf543*this.Deepg533;
      this.Deepxlamo = this.Deepxmao + this.rightAscending + this.rightAscending - this.Deepthgr - this.Deepthgr;
      this.Deepbfact = this.xlldot + this.xnodot + this.xnodot - this.Deepthdt - this.Deepthdt;
      this.Deepbfact = this.Deepbfact + this.Deepssl + this.Deepssh + this.Deepssh;
      // Synchronous resonance terms initialization 
    } // end not DEEP80
    DEEP80 = false;
    this.Deepxfact = this.Deepbfact - this.Deepxnq;
    // Initialize integrator 
    this.Deepxli = this.Deepxlamo;
    this.Deepxni = this.Deepxnq;
    this.Deepatime = 0;
    this.Deepstepp = 720;
    this.Deepstepn = -720;
    this.Deepstep2 = 259200;
  } //dpinit
  else if (ideep == 2) 
  { // Entrance for deep space secular effects 
    this.xll = this.xll + this.Deepssl*this.t;
    this.omgasm = this.omgasm + this.Deepssg*this.t;
    this.xnodes = this.xnodes + this.Deepssh*this.t;
    this.em = this.eccentricity + this.Deepsse*this.t;
    this.xinc = this.inclination + this.Deepssi*this.t;
    if (this.xinc < 0)  
    {
      this.xinc = -this.xinc;
      this.xnodes = this.xnodes  +  u_pi;
      this.omgasm = this.omgasm - u_pi;
    }
    if (this.Deepiresfl == 0){return true}
    DEEP100 = true;
    while (DEEP100 || DEEP125) 
    {
      DEEP100 = false;
      DEEP125 = false;
      DEEP150 = false;
      if ((this.Deepatime == 0) || ((this.t>= 0) && (this.Deepatime <  0)) || (( this.t<  0 ) && ( this.Deepatime >= 0 )) )  
      {
        if (this.t< 0)  
        {
          this.Deepdelt = this.Deepstepn;
        }
        else   
        {
          this.Deepdelt = this.Deepstepp;
        }
        this.Deepatime = 0;
        this.Deepxni = this.Deepxnq;
        this.Deepxli = this.Deepxlamo;
    }
    else 
    {
      if (Math.abs(this.t) < Math.abs(this.Deepatime))  
      {
        this.Deepdelt = this.Deepstepp;
        if (this.t>= 0){this.Deepdelt= this.Deepstepn}
        this.Deepiret = 100; //assign 100 to iret
        this.Deepiretn = 165; //assign 165 to iretn
        DEEP150 = true;
      }
      else 
      {
        this.Deepdelt = this.Deepstepn;
        if (this.t> 0){this.Deepdelt = this.Deepstepp}
      }
    }
    if (!DEEP150)  
    {
      if (Math.abs(this.t- this.Deepatime) >= this.Deepstepp)   
      {
        this.Deepiret = 125; //assign 125 to iret
        this.Deepiretn = 165; //assign 165 to iretn
      }
      else 
      {
        this.Deepft = this.t- this.Deepatime;
        this.Deepiretn = 140; //assign 140 to iretn
      }
      } // end if (!DEEP150)
      // Dot terms calculated 
      bStopInnerLoop = false;
      while (!bStopInnerLoop)  
      { 
        if (this.Deepisynfl != 0)  
        {
          this.Deepxndot = this.Deepdel1*Math.sin(this.Deepxli - this.Deepfasx2) + this.Deepdel2*Math.sin(2*(this.Deepxli - this.Deepfasx4))
           + this.Deepdel3*Math.sin(3*(this.Deepxli - this.Deepfasx6));
          this.Deepxnddt = this.Deepdel1*Math.cos(this.Deepxli - this.Deepfasx2)
           + 2*this.Deepdel2*Math.cos(2*(this.Deepxli - this.Deepfasx4))
           + 3*this.Deepdel3*Math.cos(3*(this.Deepxli - this.Deepfasx6));
        }
        else 
        {
          this.Deepxomi = this.Deepomegaq + this.omgdt * this.Deepatime;
          this.Deepx2omi = this.Deepxomi + this.Deepxomi;
          this.Deepx2li = this.Deepxli + this.Deepxli;
          this.Deepxndot = this.Deepd2201*Math.sin(this.Deepx2omi + this.Deepxli - this.Deepg22)
           + this.Deepd2211*Math.sin(this.Deepxli - this.Deepg22)
           + this.Deepd3210*Math.sin(this.Deepxomi + this.Deepxli - this.Deepg32)
           + this.Deepd3222*Math.sin(-this.Deepxomi + this.Deepxli - this.Deepg32)
           + this.Deepd4410*Math.sin(this.Deepx2omi + this.Deepx2li - this.Deepg44)
           + this.Deepd4422*Math.sin(this.Deepx2li - this.Deepg44)
           + this.Deepd5220*Math.sin(this.Deepxomi + this.Deepxli - this.Deepg52)
           + this.Deepd5232*Math.sin(-this.Deepxomi + this.Deepxli - this.Deepg52)
           + this.Deepd5421*Math.sin(this.Deepxomi + this.Deepx2li - this.Deepg54)
           + this.Deepd5433*Math.sin(-this.Deepxomi + this.Deepx2li - this.Deepg54);
          xnddt = this.Deepd2201*Math.cos(this.Deepx2omi + this.Deepxli - this.Deepg22)
           + this.Deepd2211*Math.cos(this.Deepxli - this.Deepg22)
           + this.Deepd3210*Math.cos(this.Deepxomi + this.Deepxli - this.Deepg32)
           + this.Deepd3222*Math.cos(-this.Deepxomi + this.Deepxli - this.Deepg32)
           + this.Deepd5220*Math.cos(this.Deepxomi + this.Deepxli - this.Deepg52)
           + this.Deepd5232*Math.cos(-this.Deepxomi + this.Deepxli - this.Deepg52)
           + 2*(this.Deepd4410*Math.cos(this.Deepx2omi + this.Deepx2li - this.Deepg44)
           + this.Deepd4422*Math.cos(this.Deepx2li - this.Deepg44)
           + this.Deepd5421*Math.cos(this.Deepxomi + this.Deepx2li - this.Deepg54)
           + this.Deepd5433*Math.cos(-this.Deepxomi + this.Deepx2li - this.Deepg54));
        }
        this.Deepxldot = this.Deepxni + this.Deepxfact;
        this.Deepxnddt = this.Deepxnddt*this.Deepxldot;
        if (this.Deepiretn == 140)   
        {
          this.xn = this.Deepxni + this.Deepxndot*this.Deepft + this.Deepxnddt*this.Deepft*this.Deepft*0.5;
          this.Deepxl = this.Deepxli + this.Deepxldot*this.Deepft + this.Deepxndot*this.Deepft*this.Deepft*0.5;
          this.Deeptemp = -this.xnodes + this.Deepthgr + this.t*this.Deepthdt;
          this.xll = this.Deepxl - this.omgasm + this.Deeptemp;
          if (this.Deepisynfl == 0){this.xll = this.Deepxl + this.Deeptemp + this.Deeptemp}
          return true;
        }
        else if (this.Deepiretn == 165)   
        {
          this.Deepxli = this.Deepxli + this.Deepxldot*this.Deepdelt + this.Deepxndot*this.Deepstep2;
          this.Deepxni = this.Deepxni + this.Deepxndot*this.Deepdelt + this.Deepxnddt*this.Deepstep2;
          this.Deepatime = this.Deepatime + this.Deepdelt;
          if(this.Deepiret == 100){DEEP100 = true}
          else if(this.Deepiret == 125) {DEEP125 = true}
          else {return true}
          // Got this far means I should loop back to DEEP100 or DEEP125
          bStopInnerLoop = true;
        }
        else {return true}
  
        // Integrator 
        if (!bStopInnerLoop){this.Deepiretn = 165} //assign 165 to iretn
      }  // back to while (!bStopInnerLoop) ...
    } // while (DEEP100 || DEEP125) ...
  } //dpsec
  else if(ideep ==  3) 
  { // Entrance for lunar-solar periodics 
    this.Deepsinis = Math.sin(this.xinc);
    this.Deepcosis = Math.cos(this.xinc);
    if (Math.abs(this.Deepsavtsn - this.t) >= 30)  
    {
      this.Deepsavtsn = this.t;
      this.Deepzm = this.Deepzmos + this.Deepzns*this.t;
      this.Deepzf = this.Deepzm + 2*this.Deepzes*Math.sin(this.Deepzm);
      this.Deepsinzf = Math.sin(this.Deepzf);
      this.Deepf2 = 0.5*this.Deepsinzf*this.Deepsinzf - 0.25;
      this.Deepf3 = -0.5*this.Deepsinzf*Math.cos(this.Deepzf);
      this.Deepses = this.Deepse2*this.Deepf2 + this.Deepse3*this.Deepf3;
      this.Deepsis = this.Deepsi2*this.Deepf2 + this.Deepsi3*this.Deepf3;
      this.Deepsls = this.Deepsl2*this.Deepf2 + this.Deepsl3*this.Deepf3 + this.Deepsl4*this.Deepsinzf;
      this.Deepsghs = this.Deepsgh2*this.Deepf2 + this.Deepsgh3*this.Deepf3 + this.Deepsgh4*this.Deepsinzf;
      this.Deepshs = this.Deepsh2*this.Deepf2 + this.Deepsh3*this.Deepf3;
      this.Deepzm = this.Deepzmol + this.Deepznl*this.t;
      this.Deepzf = this.Deepzm + 2*this.Deepzel*Math.sin(this.Deepzm);
      this.Deepsinzf = Math.sin(this.Deepzf);
      this.Deepf2 = 0.5*this.Deepsinzf*this.Deepsinzf - 0.25;
      this.Deepf3 = -0.5*this.Deepsinzf*Math.cos(this.Deepzf);
      this.Deepsel = this.Deepee2*this.Deepf2 + this.Deepe3*this.Deepf3;
      this.Deepsil = this.Deepxi2*this.Deepf2 + this.Deepxi3*this.Deepf3;
      this.Deepsll = this.Deepxl2*this.Deepf2 + this.Deepxl3*this.Deepf3 + this.Deepxl4*this.Deepsinzf;
      this.Deepsghl = this.Deepxgh2*this.Deepf2 + this.Deepxgh3*this.Deepf3 + this.Deepxgh4*this.Deepsinzf;
      this.Deepsh1 = this.Deepxh2*this.Deepf2 + this.Deepxh3*this.Deepf3;
      this.Deeppe = this.Deepses + this.Deepsel;
      this.Deeppinc = this.Deepsis + this.Deepsil;
      this.Deeppl = this.Deepsls + this.Deepsll;
    }
    this.Deeppgh = this.Deepsghs + this.Deepsghl;
    this.Deepph = this.Deepshs + this.Deepsh1;
    this.xinc = this.xinc + this.Deeppinc;
    this.em = this.em + this.Deeppe;
    if (this.Deepxqncl >= 0.2)  
    {
      
      // Apply periodics directly 
      this.Deepph = this.Deepph/this.siniq;
      this.Deeppgh = this.Deeppgh - this.cosiq*this.Deepph;
      this.omgasm = this.omgasm + this.Deeppgh;
      this.xnodes = this.xnodes + this.Deepph;
      this.xll = this.xll + this.Deeppl;
    }
    else 
    {
      // Apply periodics with Lyddane modification 
      this.Deepsinok = Math.sin(this.xnodes);
      this.Deepcosok = Math.cos(this.xnodes);
      this.Deepalfdp = this.Deepsinis*this.Deepsinok;
      this.Deepbetdp = this.Deepsinis*this.Deepcosok;
      this.Deepdalf = this.Deepph*this.Deepcosok + this.Deeppinc*this.Deepcosis*this.Deepsinok;
      this.Deepdbet = -this.Deepph*this.Deepsinok + this.Deeppinc*this.Deepcosis*this.Deepcosok;
      this.Deepalfdp = this.Deepalfdp + this.Deepdalf;
      this.Deepbetdp = this.Deepbetdp + this.Deepdbet;
      this.Deepxls = this.xll + this.omgasm + this.Deepcosis*this.xnodes;
      this.Deepdls = this.Deeppl + this.Deeppgh - this.Deeppinc*this.xnodes*this.Deepsinis;
      this.Deepxls = this.Deepxls + this.Deepdls;
      this.xnodes = Math.atan2(this.Deepalfdp, this.Deepbetdp);
      this.xll = this.xll + this.Deeppl;
      this.omgasm = this.Deepxls - this.xll - Math.cos(this.xinc)*this.xnodes;
    }
  }; //dpper
  return true;
}


Satellite.prototype.Call_dpinit = function(eosq, sinio, cosio, betao, aodp,
   theta2, sing, cosg, betao2, xmdot,
   omgdot, xnodott, xnodpp)
{
  this.eqsq   = eosq;
  this.siniq  = sinio;
  this.cosiq  = cosio;
  this.rteqsq = betao;
  this.ao   = aodp;
  this.cosq2  = theta2;
  this.sinomo = sing;
  this.cosomo = cosg;
  this.bsq  = betao2;
  this.xlldot = xmdot;
  this.omgdt  = omgdot;
  this.xnodot = xnodott;
  this.xnodp  = xnodpp;
  this.Deep(1);
}


Satellite.prototype.Call_dpsec = function(xmdf, omgadf, xnode, emm, xincc, xnn, tsince)
{
  this.xll  = xmdf;
  this.omgasm = omgadf;
  this.xnodes = xnode;
  this.xn   = xnn;  
  this.t    = tsince;
  this.Deep(2);
}


Satellite.prototype.Call_dpper = function(e, xincc, omgadf, xnode, xmam)
{
  this.em  = e;     
  this.xinc   = xincc;   
  this.omgasm = omgadf;  
  this.xnodes = xnode;
  this.xll  = xmam;
  this.Deep(3);
}


Satellite.prototype.SDP4 = function(tsince )
{
  var i;
  var a,axn,ayn,aynl,beta,betal,capu,cos2u,cosepw,cosik;
  var cosnok,cosu,cosuk,e,ecose,elsq,em,epw,esine,omgadf;
  var pl,r,rdot,rdotk,rfdot,rfdotk,rk,sin2u,sinepw,sinik;
  var sinnok,sinu,sinuk,temp,temp4,temp5,temp6,tempa;
  var tempe,templ,tsq,u,uk,ux,uy,uz,vx,vy,vz,xinc,xinck;
  var xl,xll,xlt,xmam,xmdf,xmx,xmy,xn,xnoddf,xnode,xnodek;
  var x,y,z,xdot,ydot,zdot;
  var ee;

  if (this.iFlag != 0)  
  {
  
    // Recover original mean motion (xnodp) and semimajor axis (aodp) 
    // from input elements. 
    this.SDP4a1 = Math.pow(u_xke/this.meanMotion,(2/3));
    this.SDP4cosio = Math.cos(this.inclination);
    this.SDP4theta2 = this.SDP4cosio*this.SDP4cosio;
    this.SDP4x3thm1 = 3*this.SDP4theta2 - 1;
    this.SDP4eosq = this.eccentricity*this.eccentricity;
    this.SDP4betao2 = 1 - this.SDP4eosq;
    this.SDP4betao = Math.sqrt(this.SDP4betao2);
    this.SDP4del1 = 1.5*u_ck2*this.SDP4x3thm1/(this.SDP4a1*this.SDP4a1*this.SDP4betao*this.SDP4betao2);
    this.SDP4ao = this.SDP4a1*(1 - this.SDP4del1*(0.5*(2/3) + this.SDP4del1*(1 + 134/81*this.SDP4del1)));
    this.SDP4delo = 1.5*u_ck2*this.SDP4x3thm1/(this.SDP4ao*this.SDP4ao*this.SDP4betao*this.SDP4betao2);
    this.SDP4xnodp = this.meanMotion/(1 + this.SDP4delo);
    this.SDP4aodp = this.SDP4ao/(1 - this.SDP4delo);
    
    // Initialization 
    // For perigee below 156 km, the values of s and qoms2t are altered. 
    this.SDP4s4 = u_s;
    this.SDP4qoms24 = u_qoms2t;
    this.SDP4perige = (this.SDP4aodp*(1 - this.eccentricity) - 1)*u_eqradius;
    if (this.SDP4perige < 156)  
    {
      this.SDP4s4 = this.SDP4perige - 78;
      if (this.SDP4perige <= 98) {this.SDP4s4 = 20}
      this.SDP4qoms24 = Math.pow((120 - this.SDP4s4)*1/u_eqradius,4);
      this.SDP4s4 = this.SDP4s4/u_eqradius + 1;
    }
    this.SDP4pinvsq = 1/(this.SDP4aodp*this.SDP4aodp*this.SDP4betao2*this.SDP4betao2);
    this.SDP4sing = Math.sin(this.peregee);
    this.SDP4cosg = Math.cos(this.peregee);
    this.SDP4tsi = 1/(this.SDP4aodp - this.SDP4s4);
    this.SDP4eta = this.SDP4aodp*this.eccentricity*this.SDP4tsi;
    this.SDP4etasq = this.SDP4eta*this.SDP4eta;
    this.SDP4eeta = this.eccentricity*this.SDP4eta;
    this.SDP4psisq = Math.abs(1 - this.SDP4etasq);
    this.SDP4coef = this.SDP4qoms24*Math.pow(this.SDP4tsi,4);
    this.SDP4coef1 = this.SDP4coef/Math.pow(this.SDP4psisq,3.5);
    this.SDP4c2 = this.SDP4coef1*this.SDP4xnodp*(this.SDP4aodp*(1 + 1.5*this.SDP4etasq + this.SDP4eeta*(4 + this.SDP4etasq))
      + 0.75*u_ck2*this.SDP4tsi/this.SDP4psisq*this.SDP4x3thm1*(8 + 3*this.SDP4etasq*(8 + this.SDP4etasq)));
    this.SDP4c1 = this.radiationCoefficient*this.SDP4c2;
    this.SDP4sinio = Math.sin(this.inclination);
    this.SDP4a3ovk2 = -u_xj3/u_ck2*Math.pow(1,3);
    this.SDP4x1mth2 = 1 - this.SDP4theta2;
    this.SDP4c4 = 2*this.SDP4xnodp*this.SDP4coef1*this.SDP4aodp*this.SDP4betao2*(this.SDP4eta*(2 + 0.5*this.SDP4etasq)
      + this.eccentricity*(0.5 + 2*this.SDP4etasq) - 2*u_ck2*this.SDP4tsi/(this.SDP4aodp*this.SDP4psisq)
      *(-3*this.SDP4x3thm1*(1 - 2*this.SDP4eeta + this.SDP4etasq*(1.5 - 0.5*this.SDP4eeta))
      + 0.75*this.SDP4x1mth2*(2*this.SDP4etasq - this.SDP4eeta*(1 + this.SDP4etasq))*Math.cos(2*this.peregee)));
    this.SDP4theta4 = this.SDP4theta2*this.SDP4theta2;
    this.SDP4temp1 = 3*u_ck2*this.SDP4pinvsq*this.SDP4xnodp;
    this.SDP4temp2 = this.SDP4temp1*u_ck2*this.SDP4pinvsq;
    this.SDP4temp3 = 1.25*u_ck4*this.SDP4pinvsq*this.SDP4pinvsq*this.SDP4xnodp;
    this.SDP4xmdot = this.SDP4xnodp + 0.5*this.SDP4temp1*this.SDP4betao*this.SDP4x3thm1
      + 0.0625*this.SDP4temp2*this.SDP4betao*(13 - 78*this.SDP4theta2 + 137*this.SDP4theta4);
    this.SDP4x1m5th = 1 - 5*this.SDP4theta2;
    this.SDP4omgdot = -0.5*this.SDP4temp1*this.SDP4x1m5th + 0.0625*this.SDP4temp2*(7 - 114*this.SDP4theta2 + 395*this.SDP4theta4)
      + this.SDP4temp3*(3 - 36*this.SDP4theta2 + 49*this.SDP4theta4);
    this.SDP4xhdot1 = -this.SDP4temp1*this.SDP4cosio;
    this.SDP4xnodot = this.SDP4xhdot1 + (0.5*this.SDP4temp2*(4 - 19*this.SDP4theta2)
      + 2*this.SDP4temp3*(3 - 7*this.SDP4theta2))*this.SDP4cosio;
    this.SDP4xnodcf = 3.5*this.SDP4betao2*this.SDP4xhdot1*this.SDP4c1;
    this.SDP4t2cof = 1.5*this.SDP4c1;
    this.SDP4xlcof = 0.125*this.SDP4a3ovk2*this.SDP4sinio*(3 + 5*this.SDP4cosio)/(1 + this.SDP4cosio);
    this.SDP4aycof = 0.25*this.SDP4a3ovk2*this.SDP4sinio;
    this.SDP4x7thm1 = 7*this.SDP4theta2 - 1;
    this.iFlag = 0;
    
    this.Call_dpinit(this.SDP4eosq, this.SDP4sinio, this.SDP4cosio, this.SDP4betao, this.SDP4aodp, this.SDP4theta2, this.SDP4sing, this.SDP4cosg, this.SDP4betao2, this.SDP4xmdot, this.SDP4omgdot, this.SDP4xnodot, this.SDP4xnodp);
    
    // and set the local variables to the values returned (global values)
    this.SDP4eosq   = this.eqsq;
    this.SDP4sinio   = this.siniq;
    this.SDP4cosio   = this.cosiq;
    this.SDP4betao   = this.rteqsq;
    this.SDP4aodp   = this.ao;
    this.SDP4theta2   = this.cosq2;
    this.SDP4sing   = this.sinomo;
    this.SDP4cosg   = this.cosomo;
    this.SDP4betao2   = this.bsq;
    this.SDP4xmdot   = this.xlldot;
    this.SDP4omgdot   = this.omgdt;
    this.SDP4xnodot = this.xnodot;
    this.SDP4xnodp   = this.xnodp;
      // Update for secular gravity and atmospheric drag 
  }
  xmdf = this.meanAnomaly + this.SDP4xmdot*tsince;
  omgadf = this.peregee + this.SDP4omgdot*tsince;
  xnoddf = this.rightAscending + this.SDP4xnodot*tsince;
  tsq = tsince*tsince;
  xnode = xnoddf + this.SDP4xnodcf*tsq;
  tempa = 1 - this.SDP4c1*tsince;
  tempe = this.radiationCoefficient*this.SDP4c4*tsince;
  templ = this.SDP4t2cof*tsq;
  xn = this.SDP4xnodp;
  
  this.Call_dpsec(xmdf, omgadf, xnode, em, xinc, xn, tsince);
   
  // and set the local variables to the values returned (global values)
  xmdf  = this.xll;
  omgadf  = this.omgasm;
  xnode  = this.xnodes;
  em = this.em;
  xinc  = this.xinc;
  xn = this.xn;
  tsince  = this.t;
  a = Math.pow(u_xke/xn,(2/3))*tempa*tempa;
  e = em - tempe;
  ee = e*e;
  if ( ee > 1) {return false}  // wrong satellite datas
  xmam = xmdf + this.SDP4xnodp*templ;
    
  this.Call_dpper( e, xinc, omgadf, xnode, xmam);
    
  // and set the local variables to the values returned (global values)
  e    = this.em;
  xincc  = this.xinc;
  omgadf = this.omgasm;
  xnode  = this.xnodes;
  xmam   = this.xll;
  xinc   = this.xinc;
  
  xl = xmam + omgadf + xnode;
  beta = Math.sqrt(1 - ee);
  xn = u_xke/Math.pow(a,1.5);
    
  // Long period periodics 
  axn = e*Math.cos(omgadf);
  temp = 1/(a*beta*beta);
  xll = temp*this.SDP4xlcof*axn;
  aynl = temp*this.SDP4aycof;
  xlt = xl + xll;
  ayn = e*Math.sin(omgadf) + aynl;
    
  // Solve Kepler's Equation 
  capu = mod2pi(xlt - xnode);
  this.SDP4temp2 = capu;
  for (i = 1;i < 10;i++)  
  {
    sinepw = Math.sin(this.SDP4temp2);
    cosepw = Math.cos(this.SDP4temp2);
    this.SDP4temp3 = axn*sinepw;
    temp4 = ayn*cosepw;
    temp5 = axn*cosepw;
    temp6 = ayn*sinepw;
    epw = (capu - temp4 + this.SDP4temp3 - this.SDP4temp2)/(1 - temp5 - temp6) + this.SDP4temp2;
    if (Math.abs(epw - this.SDP4temp2) <= u_e6a){break}
    this.SDP4temp2 = epw;
  }; //for i
  
  // Short period preliminary quantities 
  ecose = temp5 + temp6;
  esine = this.SDP4temp3 - temp4;
  elsq = axn*axn + ayn*ayn;
  temp = 1 - elsq;
  pl = a*temp;
  r = a*(1 - ecose);
  this.SDP4temp1 = 1/r;
  rdot = u_xke*Math.sqrt(a)*esine*this.SDP4temp1;
  rfdot = u_xke*Math.sqrt(pl)*this.SDP4temp1;
  this.SDP4temp2 = a*this.SDP4temp1;
  betal = Math.sqrt(temp);
  this.SDP4temp3 = 1/(1 + betal);
  cosu = this.SDP4temp2*(cosepw - axn + ayn*esine*this.SDP4temp3);
  sinu = this.SDP4temp2*(sinepw - ayn - axn*esine*this.SDP4temp3);
  u = Math.atan2(sinu,cosu);
  sin2u = 2*sinu*cosu;
  cos2u = 2*cosu*cosu - 1;
  temp = 1/pl;
  this.SDP4temp1 = u_ck2*temp;
  this.SDP4temp2 = this.SDP4temp1*temp;

  // Update for short periodics 
  rk = r*(1 - 1.5*this.SDP4temp2*betal*this.SDP4x3thm1) + 0.5*this.SDP4temp1*this.SDP4x1mth2*cos2u;
  uk = u - 0.25*this.SDP4temp2*this.SDP4x7thm1*sin2u;
  xnodek = xnode + 1.5*this.SDP4temp2*this.SDP4cosio*sin2u;
  xinck = xinc + 1.5*this.SDP4temp2*this.SDP4cosio*this.SDP4sinio*cos2u;
  rdotk = rdot - xn*this.SDP4temp1*this.SDP4x1mth2*sin2u;
  rfdotk = rfdot + xn*this.SDP4temp1*(this.SDP4x1mth2*cos2u + 1.5*this.SDP4x3thm1);
  
  // Orientation vectors 
  sinuk = Math.sin(uk);
  cosuk = Math.cos(uk);
  sinik = Math.sin(xinck);
  cosik = Math.cos(xinck);
  sinnok = Math.sin(xnodek);
  cosnok = Math.cos(xnodek);
  xmx = -sinnok*cosik;
  xmy = cosnok*cosik;
  ux = xmx*sinuk + cosnok*cosuk;
  uy = xmy*sinuk + sinnok*cosuk;
  uz = sinik*sinuk;
  vx = xmx*cosuk - cosnok*sinuk;
  vy = xmy*cosuk - sinnok*sinuk;
  vz = sinik*cosuk;
  
  // Position and velocity 
  x = rk*ux;  this.pos[0] = x;
  y = rk*uy;  this.pos[1] = y;
  z = rk*uz;  this.pos[2] = z;
  
  xdot = rdotk*ux + rfdotk*vx;  this.vel[0] = xdot;
  ydot = rdotk*uy + rfdotk*vy;  this.vel[1] = ydot;
  zdot = rdotk*uz + rfdotk*vz;  this.vel[2] = zdot;
  return true;
};  //Procedure SDP4


