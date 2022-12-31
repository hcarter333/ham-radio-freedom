
//_IG_RegisterOnloadHandler(uiSetup);

var req;
var login_user = '';
var login_name = '';
var login_msg = '';

var element = ''

function get_login_user(){
  return login_user;
};

function log_it_in(){
  var nameField = document.getElementById("user").value;
  login_user = nameField;
  var passwordField = document.getElementById("password").value;
  
  //Setup the login request
   var url = "/login?user=" + encodeURIComponent(nameField) +
             "&password=" + encodeURIComponent(passwordField);
   if (typeof XMLHttpRequest != "undefined") {
       req = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   }
   req.open("GET", url, true);
   req.onreadystatechange = login_callback;
   req.send(null);
  
  //alert('Registerd setup handler ' + nameField + ' ' + passwordField);
}

function create_acct(){
  var nameField = document.getElementById("user").value;
  login_user = nameField;
  var passwordField = document.getElementById("password").value;
  
  //Setup the login request
   var url = "/login?user=" + encodeURIComponent(nameField) +
             "&password=" + encodeURIComponent(passwordField);
   if (typeof XMLHttpRequest != "undefined") {
       req = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   }
   var acct_params = "user=" + encodeURIComponent(nameField) +
             "&password=" + encodeURIComponent(passwordField);
   //req.open("POST", url, true);
   //req.onreadystatechange = create_callback;
   //req.send(null);
  //alert('Registerd setup handler ' + nameField + ' ' + passwordField);
  
   req.open("POST", '/login', true);
   req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   req.setRequestHeader("Content-length", acct_params);
   req.setRequestHeader("Connection", "close");

   req.onreadystatechange = create_callback;
   req.send(acct_params);


}

function create_callback(){
    if (req.readyState == 4) {
        if (req.status == 200) {
            // update the HTML DOM based on whether or not message is valid
            //alert('Called back for create ' + req.responseText);
            var pass = parseInt(req.responseText);
            if(pass == 0){
              alert('The username ' + login_user + ' already exists.  Please choose a different one and click Create to make a new account');
              login_user = '';
            }
            else{
              welcome_user();
            }
        }
    }

}

function login_callback() {
    if (req.readyState == 4) {
        //alert('entered login_callback ' + req.responseText);
        if (req.status == 200) {
            // update the HTML DOM based on whether or not message is valid
            //alert('Called back for login ' + req.responseText);
            var pass = parseInt(req.responseText);
            if(pass == 0){
              alert('The username, password combination does not exist.  Click Create to make a new account');
            }
            else{
              welcome_user();
            }
        }
    }
}

//User must define welcome_user() that calls this function
function norm_welcome_user(  ){
  var login_html = [];
  login_html.push('Welcome ' + login_user);
  login_html.push('<small><input id="my_login_create" type="button" value="Logout" onclick="logout()"></small>');
  document.getElementById(element).innerHTML = login_html.join('');
  //show_results();
  //alert('Done!!!');
}

function norm_logout(  ){
  var logout_html = [];
  logout_html.push(login_msg);
  logout_html.push('<iframe name="login_target" height="0" width="0"></iframe><br>');
  logout_html.push('<form target="login_target" id="login_form" action="/"');
  //alert('Logging out');
  //logout_html.push(login_form);
  logout_html.push(' method="POST">');
  logout_html.push('Name:<input size="10" type="text" name="user" id="user"><br>');
  logout_html.push('Password:<input size="10" type="text" name="password" id="password"><br>');
  logout_html.push('<input id="my_login" type="button" value="Login" onclick="log_it_in()">');
  logout_html.push('<input id="c" type="button" value="Create" onclick="create_acct()"></form>');
  //logout_html.push('<small><a href="#" onclick="hide_login()">Hide...</a></small>');
  login_user = '';
  //login_pass = '';
  document.getElementById(element).innerHTML = logout_html.join('');
}

function hide_login(){
  var logout_html = [];
  logout_html.push('<small><a href="#" onclick="logout()">Login...</a></small>');
  document.getElementById('login_panel').innerHTML = logout_html.join('');

}


function check(answer, a_id){  
  //alert('Registerd setup handler');
  if(answer == correct){
    document.getElementById(a_id).style.backgroundColor = '#00FF00';
    document.getElementById('q_correct').innerHTML = 'Correct!';
    if(first_answer == 1){      
      raw_test_score = raw_test_score + 1;
      subel[subelement] = subel[subelement] + 1;
    }
  }
  else{
    document.getElementById(a_id).style.backgroundColor = '#FF0000';
    document.getElementById('q_correct').innerHTML = 'Wrong';
  }
  if(first_answer == 1){
    questions_answered = questions_answered + 1;
    update_test_scores();    first_answer = 0;
  }
}


