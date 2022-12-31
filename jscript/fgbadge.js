

var flist = [];
var badge = '';
//var fgreq;
function getBadges( userid ){                      
        //Now send the scores to the db
        if (typeof XMLHttpRequest != "undefined") {
            req = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }

        //update the badges qualifed for
        badgequal();
        var comm_params = "userid=" +
                      encodeURIComponent(userid) + badge;
        
        req.open("POST", '/fgbadges', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.setRequestHeader("Content-length", comm_params.length);
        req.setRequestHeader("Connection", "close");

        
        req.onreadystatechange = badge_cb;
        req.send(comm_params);
}

function badge_cb(){
    if (req.readyState == 4) {
        if (req.status == 200) {
              //alert('Entered badge_cb with ' + req.responseText);
              flist = [];
              var my_html = req.responseText.split('|');
              document.getElementById('badgepics').innerHTML = my_html[0];
              
              //Load the functions to be checked for badge qualification now
              loadquals(req.responseText);
              
              //msg_img = req.responseText;
              //alert('msg_img ' + msg_img);
              //qso_mapped(msg_img);

        }
        else{
          alert('badge_cb Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }

}

//var calldiv_name = '';
function claim_call( ){
	//Grab the callsign from the input and call the FGCallClaim URI
	var call = '';
	var call = document.getElementById('id_call_sign').value;
	call = call.toUpperCase();
	
    //Now send the scores to the db
    if (typeof XMLHttpRequest != "undefined") {
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //update the badges qualifed for
    var comm_params = "userid=" +
                  encodeURIComponent(login_user) + "&callsign=" +
                  encodeURIComponent(call);
    
    req.open("POST", '/fgcallclaim', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Content-length", comm_params.length);
    req.setRequestHeader("Connection", "close");

    
    req.onreadystatechange = call_cb;
    req.send(comm_params);
	
}

function call_cb(){
    if (req.readyState == 4) {
        if (req.status == 200) {
              //alert('Entered call_cb with ' + req.responseText);
              document.getElementById('mycallsign').innerHTML = 
            	  req.responseText;
        }
        else{
          alert('call_cb Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }

}

function get_call( ){
	
    //Now send the scores to the db
    if (typeof XMLHttpRequest != "undefined") {
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //update the badges qualifed for
    var comm_params = "userid=" +
                  encodeURIComponent(login_user) + "&callsign=" +
                  'none';
    
    req.open("POST", '/fgcallclaim', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Content-length", comm_params.length);
    req.setRequestHeader("Connection", "close");

    
    req.onreadystatechange = call_cb;
    req.send(comm_params);
	
}

    
    function test1(){
      alert('test 1');
    }
    
    function test2(){
      alert('test 2');
    }
    
    //flist.push(test1);
    //flist.push(test2);
    
    function loadquals( quals ){
      quals_to_load = quals.split('|');
      flist = [];
      //the first member is the button html.  Skip it
      for( var i = 1; i < quals_to_load.length; i++ ){
        //grab qual data separated by & and load it into an array later
        flist.push(quals_to_load[i]);
      }
      
    }
    
    function badgequal(){
      //clear the badges sent last time
      badge = '';
      for( var i = 0; i < flist.length; i++ ){
        //Right now, each badge updates the badges, lots of overhead potentially, 
        //but cheap to develop
        window[flist[i]](); // Call the function
      }
      //clear the list of badge functions
      //don't do this here in case the callback temporarily fails
      //do it in the callback
      //flist = [];
      
    }
    
  function firstqso_qual(){
    //alert('Checked for first qso');
    badge += '&firstqso=1';
  }
    
