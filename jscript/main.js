    var g_pms = [],                   // Array to hold satellite objects
        g_TLE = [],
        g_numOfSats = 0,              // Number of satellites
        g_altitudeMode = false,        // altitude mode: true = absolute,  false = clampToGround
        g_extrudeMode = true,         // extrude:  true = on

        g_updatePeriod = 1000,        // Time between calls to fetchNewData function (in ms)  HBC originally 1000
        g_features,                  // performance hack. Variable to hold ge.getFeatures()
        g_speed = 1,                // set this to 1 to update the satellite in real time
 
        g_curTime,
        g_fetchNew = null,
        g_lastMillis,
        g_lastUpdate,
        position,
        slider,
        xmlHttp;
        resetinProgress = false;
        
        earthradius = 20925524.9    //earth radus in feet

       
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
      
       google.earth.addEventListener(ge.getGlobe(), "mousedown", function(event) { draw(event); }); 
       google.earth.addEventListener(ge.getGlobe(), "mousemove", function(event) { movePMLoc(event); }); 
       }
     }

function my_sat_test(){
    //sat_test_string = 'LO-19&1 20442U 90005G   11187.94329143 -.00000024  00000-0  64087-5 0 01550&2 20442 098.3466 141.1781 0012855 097.5464 262.7179 14.32152423120621';
	//g_TLE = xmlHttp.responseText.split('&');
    g_TLE = sat_test_string.split('&');
    
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
      //if ((name.charAt(0) == "C") && (g_cosmos < 150))
      //{
        g_pms[g_numOfSats] = new Satellite(g_numOfSats,name,g_TLE[1+g_totsatsinfile*3],g_TLE[2+g_totsatsinfile*3]);
        g_numOfSats++;
        g_cosmos++;
      //}         
      //else if ((name.charAt(0) == "I") && (g_iridium < 150))
      //{
      //  g_pms[g_numOfSats] = new Satellite(g_numOfSats,name,g_TLE[1+g_totsatsinfile*3],g_TLE[2+g_totsatsinfile*3]);
      //  g_numOfSats++;
      //  g_iridium++;
      //} 
      g_totsatsinfile++;
    }
    


    //g_numOfSats = 1;
    //resetTime();
    //new version to just get the 24 hour trajectory
    //only works for one satelite for now
    resetTime();

    ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);
    ge.getOptions().setStatusBarVisibility(true);
    updateOptions();

    var la = ge.createLookAt(''); 
    la.set(0, 0, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 20000000); 
    ge.getView().setAbstractView(la);     
   
    google.earth.addEventListener(ge.getGlobe(), "mousedown", function(event) { draw(event); }); 
    google.earth.addEventListener(ge.getGlobe(), "mousemove", function(event) { movePMLoc(event); }); 
	
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
 
  
       ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, form.borders.checked);
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

