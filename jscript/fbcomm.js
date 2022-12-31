


var req;
function logComm( commentxid ){                      
        //Now send the scores to the db
        if (typeof XMLHttpRequest != "undefined") {
            req = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }

        var comm_params = "xid=" +
                      encodeURIComponent(commentxid);
        
        req.open("POST", '/fbcomm', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.setRequestHeader("Content-length", comm_params.length);
        req.setRequestHeader("Connection", "close");

        
        req.onreadystatechange = comm_cb;
        req.send(comm_params);
}

function comm_cb(){

}

    FB.init({appId: '140851685938025', status: true, cookie: true,
             xfbml: true});
    var li_response;

    //Get the userid
           
    FB.Event.subscribe('comments.add', function(response) {
      //var msession = FB.getSession();
      //alert('Comment usera:' + response.widget._attr.xid);
      logComm(response.widget._attr.xid);
    });    
    
