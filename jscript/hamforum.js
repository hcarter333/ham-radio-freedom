//The code for forum entries starts here

function newqforum(one_qnum){
  if(login_user != ''){
    if(login_name == ''){
    	  login_name = login_user;
    }
	//collects the uid, uname, test_type, qnum, and comment and sends them in
    var fe_params = "tclass=" +
    encodeURIComponent(test_type) + 
    "&qnum=" + encodeURIComponent(one_qnum) + 
    "&uid=" + encodeURIComponent(login_user) +
    "&uname=" + encodeURIComponent(login_name) +
   "&comment=" + encodeURIComponent($('cf_forum_post').value);

    //alert('commenting with ' + fe_params);
    //Now get the forum entries
    if (typeof XMLHttpRequest != "undefined") {
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }

    req.open("POST", '/hamforumentry', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Content-length", fe_params.length);
    req.setRequestHeader("Connection", "close");


    req.onreadystatechange = fe_cb;
    req.send(fe_params);

  }else{
	  alert('Please log in to post to the forus')
  }
}
var qfdiv = '';

function add_forum_entries( fdiv ){
      qfdiv = fdiv;
      var fe_params = "tclass=" +
                    encodeURIComponent(test_type) + 
                    "&qnum=" + encodeURIComponent(abs_qnum);

                    
      //Now get the forum entries
      if (typeof XMLHttpRequest != "undefined") {
          req = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
          req = new ActiveXObject("Microsoft.XMLHTTP");
      }
      
      req.open("POST", '/hfeget', true);
      req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      req.setRequestHeader("Content-length", fe_params.length);
      req.setRequestHeader("Connection", "close");

      
      req.onreadystatechange = fe_cb;
      req.send(fe_params);

}

function add_forum_entry( one_qnum, fdiv ){
    qfdiv = fdiv;
    var fe_params = "tclass=" +
                  encodeURIComponent(test_type) + 
                  "&qnum=" + encodeURIComponent(one_qnum);

                  
    //Now get the forum entries
    if (typeof XMLHttpRequest != "undefined") {
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    req.open("POST", '/hfeget', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Content-length", fe_params.length);
    req.setRequestHeader("Connection", "close");

    
    req.onreadystatechange = fe_cb;
    req.send(fe_params);

}


function fe_cb( ){
	//receive the forum entries for the question and display them
    if (req.readyState == 4) {
        if (req.status == 200) {
              //alert('Entered log_cb with ' + req.responseText);
              //document.getElementById('logtable').innerHTML = req.responseText;
              $(qfdiv).innerHTML = req.responseText;
        }
        else{
          alert('fe_cb Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }
	
}

//array to hold the forum entries for all test questions for this test_type
var forum_array = [];

//function to get the list of forum posts for this test and populate the forum array
function get_user_posts(){
	//Call for the list of posts for this post_type

    var fe_params = "tclass=" +
    encodeURIComponent(test_type) + 
    "&uid=" + encodeURIComponent(login_user);
                  
    //Now get the forum entries
    if (typeof XMLHttpRequest != "undefined") {
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    req.open("POST", '/hfuser', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Content-length", fe_params.length);
    req.setRequestHeader("Connection", "close");

    
    req.onreadystatechange = get_user_posts_cb;
    req.send(fe_params);

}

var user_posts = [];
function get_user_posts_cb(){
	//receive the forum entries for the question and display them
    if (req.readyState == 4) {
        if (req.status == 200) {
              //alert('Entered log_cb with ' + req.responseText);
              //document.getElementById('logtable').innerHTML = req.responseText;
              //$('qforumdiv').innerHTML = req.responseText;
        	//load up the forum entries array
        	user_posts = req.responseText.split('|')
            //call the renderer for user posts
        	show_user_posts();
        }
        else{
          alert('get_all_posts_cb Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }
}

function forum_link(one_qnum, post_array, div_base){
	var flink = '';
	//replace fd_ with div_base
	var one_fdiv = div_base + one_qnum;
	if(post_array[one_qnum] != null){
		flink = '<a style="color:#0000FF" href="javascript:void(0)" onClick="add_forum_entry(' + one_qnum + ', \'' + one_fdiv + '\')">';
		//Add post details
		post_details = post_array[one_qnum].split(';')
		flink += post_details[0] + ' posts. Last updated on ' + post_details[1] + '</a><br>';
	}else{
		flink = '<a style="color:#0000FF" href="javascript:void(0)" onClick="add_forum_entry(' + one_qnum + ',' + one_fdiv + ')">';
		//No post details
		//post_details = forum_array[one_qnum].split(';')
		flink += 'Start a post for this exam question</a><br>';
	}
	
	return flink;
}


