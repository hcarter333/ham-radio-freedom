  
  var test_help;
  var test_type = 'T';
  
  var nz_header = 'New Zealand Amateur Radio Examination Practice (Question pool published March, 2010)';
  var t_header = 'Technician Class Amateur Radio Practice Exam (Question pool published 2/1/2010)';
  var g_header = 'General Class Amateur Radio Practice Exam (Question pool published 2/23/2007)';
  var e_header = 'Extra Class Amateur Radio Practice Exam (Question pool published 12/20/2008)';
  var cb_header = 'Canada Basic Amateur Radio Practice Exam (Question pool published April, 2007)';
  var ca_header = 'Canada Advanced Amateur Radio Practice Exam (Question pool published April, 2007)';
  
  //login panel location
  element = 'login_top';
  login_msg = 'Login to save scores and track your progress';
  
  //Properties of the question set that don't change after init
  var group_count = 0;
  var group_offsets = [];
  var subel_offsets = [];
  var group_q_count = [];
  var questions = [];
  var total_questions = 0;
  
  var element_count = 10;
  
  //Array to randomly select groups
  //Used to randomly select the group number
  var groups_sel = [];
  var question_sel = [];
  //Fields of the current question
  var q_sel_fields = [];

  //Indicates that the passedseen data has come in for the user and has
  //been added to the local copy
  var psprocessed = 0;
  var passedseen = [];


function clearps(){
  passedseen = new Array(total_questions);
  for(var i = 0; i < total_questions; i += 1){
    passedseen[i] = 0;
  }
  //alert('clearps: total_questions = ' + total_questions + ' passedseen.length = ' + passedseen.length);
}

function logout(){
  //Landed in the outer logout
  //alert('Landed in the outer logout');
  //Clear things that belonged to the current user
  psprocessed = 0;
  clearps();
  norm_logout();
  document.getElementById('tabContent2').innerHTML = 
                              'Login to see saved test scores'
   
}
function hideHelp(){
  document.getElementById('help').style.zIndex=-1;
  document.getElementById('help_inside').style.zIndex=-1;
}

function showHelp(){
  document.getElementById('help').style.zIndex=2;
  document.getElementById('help_inside').style.zIndex=3;
}



function loadclient(){
	  gapi.client.setApiKey('AIzaSyBuXwDMTj4XydjpwxLWXoG7eIfLcmCPLCk');
	  gapi.client.load('urlshortener', 'v1', makeRequest);
	
}

function makeRequest(){
	
}

var splitter = '!';
//init_groups();

function new_test2( new_test_type ){
  if(new_test_type == test_type){
    return;
  }
  new_test_b = true;
  //If there are scores to be saved, then save them.
  if(questions_answered > 0 && !scores_saved){
    log_scores();
  }
  if(new_test_type == 'T'){
    //Make the tech test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#888888"
    $('Gsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#333333"
    $('NZsel').style.backgroundColor = "#333333"
    $('CBsel').style.backgroundColor = "#333333"
    $('CAsel').style.backgroundColor = "#333333"
  }
  else if(new_test_type == 'G'){
    //Make the general test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#333333"
    $('Gsel').style.backgroundColor = "#888888"
    $('Esel').style.backgroundColor = "#333333"
    $('NZsel').style.backgroundColor = "#333333"
    $('CBsel').style.backgroundColor = "#333333"
    $('CAsel').style.backgroundColor = "#333333"
  }
  else if(new_test_type == 'E'){
    //Make the extra test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#333333"
    $('Gsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#888888"
    $('NZsel').style.backgroundColor = "#333333"
    $('CBsel').style.backgroundColor = "#333333"
    $('CAsel').style.backgroundColor = "#333333"
  }
  else if(new_test_type == 'NZ'){
    //Make the New Zealand test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#333333"
    $('Gsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#333333"
    $('NZsel').style.backgroundColor = "#888888"
    $('CBsel').style.backgroundColor = "#333333"
    $('CAsel').style.backgroundColor = "#333333"
  }
  else if(new_test_type == 'CB'){
    //Make the New Zealand test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#333333"
    $('Gsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#333333"
    $('NZsel').style.backgroundColor = "#333333"
    $('CBsel').style.backgroundColor = "#888888"
    $('CAsel').style.backgroundColor = "#333333"
  }
  else if(new_test_type == 'CA'){
    //Make the New Zealand test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#333333"
    $('Gsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#333333"
    $('NZsel').style.backgroundColor = "#333333"
    $('CBsel').style.backgroundColor = "#333333"
    $('CAsel').style.backgroundColor = "#888888"
  }
  test_type = new_test_type;
  test_initialize();
}

function test_click(){
  alert('Clicked');
}

function new_group( qf2, qf3, sbel, subelg){
  if(test_type == 'NZ')
    {
    return (qf3 != subelg);
    }
  else{
    return (qf2 != sbel || qf3 != subelg);
  }
}
   
function init_groups(){
  questions = test_qs.split(splitter);
  //alert(questions.length + ' questions');
  //Walk the question set and record it's propertys
  var group_index = -1;
  var subel_index = 0;
  var q_count = 0;
  var subel = '';
  var subelgroup = '';
  qftest = questions[0].split('|');
  //alert('ql ' + questions.length + ' two ' + qftest[2] + ' three ' + qftest[3]);
  
  for(var j = 0; j < questions.length - 1; j += 1){
    q_fields = questions[j].split('|');
    //if(q_fields[3] != subelgroup){
    if(new_group(q_fields[2], q_fields[3], subel, subelgroup)){
      //alert(questions.length + ' ' + q_fields[2] + ' ' + q_fields[3] + ' ' + group_count);
      group_index += 1;
      //Record the offset
      group_offsets[group_index] = j;
      //Initialize the question count
      group_q_count[group_index] = 1;
      //Increment the group count
      //alert('Last group was ' + subelgroup);
      group_count += 1;
      //Track subelement offsets as well
      if(q_fields[2] != subel){
        subel_index += 1;
        subel_offsets[subel_index] = j;
      }
      //Update placeholders to look for next subelement and group
      subel = q_fields[2];
      subelgroup = q_fields[3];
      total_questions += 1;
    }
    else{
      //another question in the group
      group_q_count[group_index] += 1;
      total_questions += 1;
    }
  }//Closes questions for loop
  //alert('total_q ' + total_questions);
  //alert('group_c ' + group_count);
  //Initilize the passedseen structure
  //alert('tq = ' + total_questions + ' ql ' + questions.length);
  //alert('question count before clearps is ' + total_questions);
  clearps();
  //alert('Found ' + group_count + ' groups with ' +
  //      group_q_count[0] + ' ' + group_q_count[1] + 
  //      ' ' + group_q_count[5] + '...');
}

function init_test_structs(){
      //Setup the random group choser
      groups_sel = new Array(group_count);
      question_sel = new Array(group_count);
      for(var i = 0; i < group_count; i += 1){
        groups_sel[i] = i;
        //Setup the random question choosers
        question_sel[i] = new Array(group_q_count[i]);
          //one entry per question in the group
          for(var k = 0; k < group_q_count[i]; k += 1){
            question_sel[i][k] = k;
          }
      }
}



   var new_test_b = false;
    var r_chosen = []; 
   var question_structure; 
   var questions_done = 0;
   var subelement;
   var group;
   var qnum;
   var rqnum;
    var q2test = 0;
    var correct = 'A';
    var first_answer = 1;
    var questions_answered = 0;
    var raw_test_score = 0;
    var questions_asked = 0;
    var s_test_score = 0.0;
    var s_test_accuracy = 0.0;
    var sing_test = false;
    var subel = [];
    var subel_count = [];         
     var stQuery_qu = 'http://spreadsheets.google.com/pub?key=pvFXGB-79Kl0MiDlVNiUiVQ&gid=0&pub=1';
    var stScoreQuery = 'http://spreadsheets.google.com/pub?key=pvFXGB-79Kl3nEmVhWk5bKw&gid=0&pub=1';
    var stScoreAction = 'http://spreadsheets.google.com/formResponse?key=pvFXGB-79Kl3nEmVhWk5bKw';
    var my_copyright = 'Copyright 2008 Pythagorean Productions';
    var stQuery = 'http://spreadsheets.google.com/pub?key=pvFXGB-79Kl338aI6gFPzJQ&gid=0&pub=1';
      var stAction = 'http://spreadsheets.google.com/formResponse?key=pvFXGB-79Kl338aI6gFPzJQ';
         var login_db = 'http://spreadsheets.google.com/pub?key=pvFXGB-79Kl2JkNT5hLmiJA&gid=0&pub=1';
    var login_form = 'http://spreadsheets.google.com/formResponse?key=pvFXGB-79Kl2JkNT5hLmiJA';
    var question_count = 60;
    var subel_prefix = 'NZ';
    var subel_label = 'T1';
    for(var i = 0; i < 60; i+=1){
      subel_count[i] = 10;
    }
    var in_exam = true;
    
    //Used to track current question number for passedseen tracking
    var abs_qnum = 0;

    //google.load("visualization", "1");
    //google.setOnLoadCallback(test_initialize);
function uiSetup(){
}
  
function test_initialize(){
  //alert('Registerd setup handler');
  //Determine which test we're in and setup accordingly
  //test_help = nz_test_help;
      document.getElementById('next_question').value = 'Next Question';
      document.getElementById('next_question').disabled = true;
  total_questions = 0;
  element_count = 10;
  if(test_type == 'NZ'){
    test_help = nz_test_help;
    test_qs = nz_test_qs;
    question_count = 60;
    score_row_count = 60;
    element_count = 60;
    subel_prefix = 'NZ';
    splitter = '!';
    $('test_header').innerHTML = nz_header;
  }
  else if(test_type == 'T'){
    test_help = t_test_help;
    test_qs = t_test_qs;
    question_count = 35;
    score_row_count = 10;
    subel_prefix = 'T';
    splitter = '&';
    $('test_header').innerHTML = t_header;
  }
  else if(test_type == 'G'){
    test_help = g_test_help;
    test_qs = g_test_qs;
    question_count = 35;
    score_row_count = 10;
    subel_prefix = 'G';
    splitter = '&';
    $('test_header').innerHTML = g_header;
  }
  else if(test_type == 'E'){
    test_help = e_test_help;
    test_qs = e_test_qs;
    question_count = 50;
    score_row_count = 10;
    subel_prefix = 'E';
    splitter = '&';
    $('test_header').innerHTML = e_header;
  }
  else if(test_type == 'CB'){
    test_help = cb_test_help;
    test_qs = cb_test_qs;
    question_count = 100;
    score_row_count = 8;
    subel_prefix = 'CB';
    splitter = '&';
    $('test_header').innerHTML = cb_header;
  }
  else if(test_type == 'CA'){
    test_help = ca_test_help;
    test_qs = ca_test_qs;
    question_count = 50;
    score_row_count = 7;
    subel_prefix = 'CA';
    splitter = '&';
    $('test_header').innerHTML = ca_header;
  }
       
       group_offsets.clear();
       questions_done = 0;
        first_answer = 1;
        correct = 'A';
        q2test = 0;
        questions_answered = 0;
        questions_asked = 0;
        raw_test_score = 0;
        s_test_score = 0.0;
        s_test_accuracy = 0.0; 
        



  group_count = 0;
  group_offsets.clear();
  subel_offsets.clear();
  group_q_count.clear();
  questions.clear();
  total_questions = 0;
  
  
  //Array to randomly select groups
  //Used to randomly select the group number
  groups_sel.clear();
  question_sel.clear();
  //Fields of the current question
  q_sel_fields.clear();





      init_groups();
      //clearps();

  //psprocessed = 0;
  //Indicates that the passedseen data has come in for the user and has
  //been added to the local copy
  //passedseen.clear();
  psprocessed = 0;
  show_results();


      init_test_structs();
      initialize_test_scores();
      init_score();
      
      toggleTab(1,3);
      
      //new_study_form();
      start_test();
}
    function start_test() {

      question_getter('Next Question');
      
      }
      
var group_num = 0;
var group_index = 0;
var question_num = 0;
var quesiton_index = 0;
var scores_saved = false;


function debug_test(){
FB.ui(
   {
     method: 'stream.publish',
     message: 'Just passed the technician class ham radio practice exam on Ham Shack from Copasetic Flows http://copaseticflows.appspot.com/hamtest',
     user_message_prompt: 'Congratulations you passed the exam!  Tell your friends!'
   }
  );
}


function invite_friends(){
  //If there are scores to be saved, then save them.
  if(questions_answered > 0 && !scores_saved){
    log_scores();
  }
  FB.ui(
    {
        method: 'fbml.dialog',
        display: 'dialog',
        fbml: (
                '<fb:fbml>'+
                    '<fb:request-form '+
                        'action="http://copaseticflows.appspot.com/hamtest" '+
                        'method="GET" '+
                        'invite="true" '+
                        'type="Ham Radio Practice Exams" '+
                        'content="You can study for your amateur radio license exam on Facebook!  Track your scores and build customized tests! <fb:req-choice url=\'http://apps.facebook.com/fcctech\' label=\'Accept\'/>" '+
                    '<fb:multi-friend-selector max="20" actiontext="Invite your friends to practice for the amateur radio license exams." rows="4">' +
                    '<fb:request-form-submit import_external_friends="false" />'+
                    '</fb:request-form>'+
                '</fb:fbml>'
                )
    },
    function(response) {
        alert('Thanks and Have Fun!');
    });  

//  FB.ui(
//    {
//        method: 'fbml.dialog',
//        display: 'dialog',
//        fbml: (
//                '<fb:fbml>'+
//                    '<fb:request-form '+
//                        'action="http://copaseticflows.appspot.com/hamtest" '+
//                        'method="GET" '+
//                        'invite="true" '+
//                        'type="Ham Radio Practice Exams" '+
//                        'content="You can study for your amateur radio license exam on Facebook!  Track your scores and build customized tests! <fb:req-choice url=\'http://apps.facebook.com/fcctech\' label=\'Accept\'/>" '+
//                    '<fb:multi-friend-selector  actiontext="Invite your friends to practice for the amateur radio license exams." >' +
//                    '<fb:request-form-submit import_external_friends="false" />'+
//                    '</fb:request-form>'+
//                '</fb:fbml>'
//               )
//   },
//   function(response) {
//        //alert('Thanks and Have Fun!');
//    });

  //htoggleTab(5,5);  
}


function fb_tech_passed(){
FB.ui(
   {
     method: 'stream.publish',
     message: 'Just passed the technician class ham radio practice exam on Ham Shack from Copasetic Flows http://copaseticflows.appspot.com/hamtest',
     user_message_prompt: 'Congratulations you passed the exam!  Tell your friends!'
   }
  );
}

function qso_mapped( img_message ){
  //alert(img_message);
  var qso_message = 'ham radio QSL ' + rx_mirror_call + ' de ' + tx_mirror_call;
  if(mikm == 0){
    qso_message += ' ' + Number(distance/1609.344).toFixed(2) + ' miles '; 
  }else{
    qso_message += ' ' + Number(distance/1000).toFixed(2) + ' kms ';
  }

  var qso_desc = 'Map of ' + qso_message;
  var qso_name = rx_mirror_call + ' de ' + tx_mirror_call;
  //var qso_img_message = img_message.replace(/[\n\r]/, '');
  var qso_img_message = img_message.slice(0, -2);
  var qso_link = 'http://copaseticflows.appspot.com/mapqso?mqso=' + qso_img_message;
  //alert('qso_link = ' + qso_link);
  //alert('img_message length = ' + qso_img_message.length);



   //Setup the sharing buttons
   sh_url = 'http://copaseticflows.appspot.com/mapqso?mqso=Iflsf';
   sh_title = 'Testing title';
   sh_description = 'Testing description';
   
var tbx = document.getElementById("addthis_tb"),
    svcs = {twitter: 'Twitter', facebook: 'Facebook', expanded: 'More'};

tbx.innerHTML = '';
for (var s in svcs) {
    tbx.innerHTML += '<a class="addthis_button_'+s+'">'+'</a>';
}
addthis.toolbox("#addthis_tb", {}, {url: qso_link, description: qso_desc, name: qso_name, title: qso_name});
tbx.innerHTML += '<br><a href="' + qso_link + '">Map Link at FourGrid</a>';

}

function fb_general_passed(){
FB.ui(
   {
     method: 'stream.publish',
     message: 'Just passed the general class ham radio practice exam on Ham Shack from Copasetic Flows http://copaseticflows.appspot.com/hamtest',
     user_message_prompt: 'Congratulations you passed the exam!  Tell your friends!'
   }
  );
}

function fb_extra_passed(){
FB.ui(
   {
     method: 'stream.publish',
     message: 'Just passed the extra class ham radio practice exam on Ham Shack from Copasetic Flows http://copaseticflows.appspot.com/hamtest',
     user_message_prompt: 'Congratulations you passed the exam!  Tell your friends!'
   }
  );
}

function fb_cb_passed(){
FB.ui(
   {
     method: 'stream.publish',
     message: 'Just passed the Canada Basic ham radio practice exam on Ham Shack from Copasetic Flows http://copaseticflows.appspot.com/hamtest',
     user_message_prompt: 'Congratulations you passed the exam!  Tell your friends!'
   }
  );
}

function fb_ca_passed(){
FB.ui(
   {
     method: 'stream.publish',
     message: 'Just passed the Canada Advanced ham radio practice exam on Ham Shack from Copasetic Flows http://copaseticflows.appspot.com/hamtest',
     user_message_prompt: 'Congratulations you passed the exam!  Tell your friends!'
   }
  );
}

function debugqsel(){
  //alert('group_index ' + group_index + ' ' +
  //      'group_num ' + group_num + ' ' +
  //      'question_index ' + question_index + ' ' +
  //      'question_num ' + question_num + ' ');
        
  //alert('goup_offset ' + group_offsets[group_num]);
  
  alert('total_questions ' + total_questions);
  
        var passedseen_str = '';
        for(var i=0; i < total_questions; i+=1){
          passedseen_str += passedseen[i] + '|';
        }
  
        var score_str_d = '';
        for(var k = 0; k < score_row_count; k += 1){
          score_str_d += subel[k] + '|';
        }


  alert('passedseen length = ' + passedseen.length);
  alert(passedseen_str);
  alert('new_test_b ' + new_test_b);
  
  alert('score_row_count = ' + score_row_count + ' subel length ' + subel.length);
  alert(score_str_d);
  
  //alert('test_type ' + test_type + ' total questions ' + total_questions + ' group count ' + group_count);
  //alert('group_offsets length ' + group_offsets.length + ' questions length ' + questions.length);
  //alert('asked ' + questions_asked + ' count ' + question_count);
  //alert('About to log scores');
  //log_scores();
}

function save_score(){
  if(login_user != ''){
    log_scores();
  }
  else{
    alert('You must be logged in to save scores');
  }
}

function cull_unseenpassed( seenpass ){
  //use passedseen array to remove questions from the
  //random selection that have already been seen or passed
  
  //Walk the groups and remove quesitons
  //There are as many entries in group_offsets as there are groups
  for(var i=0; i < group_offsets.length; i += 1){
    //Determine if there are enough questions >1 to populate the test
    unculled = 0;
    for(var k=0; k < group_q_count[i]; k += 1){
      if(passedseen[group_offsets[i] + k] < seenpass){
        unculled += 1;
      }
    }
    if(unculled > 0){
      //Cull the group
      for(var k=0; k < group_q_count[i]; k += 1){
        if(!(passedseen[group_offsets[i] + k] < seenpass)){
          //search the group until the question is found
          //and then splice it out
          for(var m=0; m < question_sel[i].length; m += 1){
            if(questions_sel[i][m] == k){
              questions_sel[i].splice(m, 1);
              //Now that the question is removed, get out and start over
              break;           
            }
          }
        }
      }//Done culling the group      
    }//The group had something to cull
  }//Done stepping through the groups
}

function question_getter(button_value){
      if(button_value == 'New Test'){
        subel_toggling = true;
        reset_test();
      }
      else if(button_value == 'New Test Unseen'){
         subel_toggling = true;
         reset_test();
         cull_unseenpassed(1);    
         //Turn off the other new test buttons  
      }
      else if(button_value == 'New Test Unpassed'){
         subel_toggling = true;
         reset_test();
         cull_unseenpassed(2);            
         //Turn off the other new test buttons  
      }
      else{
        questions_asked = questions_asked + 1;
        first_answer = 1;
        
        //Randomly choose a group and question index
        group_index = Math.floor(Math.random() * groups_sel.length);
        //Use the index to retrieve the group number from the array of
        //unused groups
        group_num = groups_sel[group_index];
        
        question_index = Math.floor(Math.random() * 
                                     question_sel[group_num].length);
        question_num = question_sel[group_num][question_index];
        
        
        q_sel_fields = 
               questions[group_offsets[group_num] + question_num].split('|');

        //Get the subelement
        //subelement = q_sel_fields[2];
        //One group per subelement for NZ
        if(test_type == 'NZ'){
          subelement = group_num;
        }
        else if(test_type == 'CB' || test_type == 'CA'){
          subelement = parseInt(q_sel_fields[2], 10);
          //alert('subelement = ' + subelement);
        }
        else{
          subelement = q_sel_fields[2];
        }
        
        //Record the fact that the question has been seen
        abs_qnum = group_offsets[group_num] + question_num;
        updateps(abs_qnum);
        
        //Remove the selected group and question from the random mix
        groups_sel.splice(group_index, 1);
        //This is only necessary later when unseen or unpassed 
        //questions are being selected and more than one question 
        //can be selected from a group
        question_sel[group_num].splice(question_index, 1);
        
        
      }

    update_questions_asked();
    document.getElementById('next_question').disabled = true;
    question_receiver();
    }

    function reset_test(){
      document.getElementById('next_question').value = 'Next Question';
      if(subel_toggling == false){
        //alert('About to call show_results from reset_test');
        show_results();
      }  else{
        subel_toggling = false;
      }
      test_initialize();
    }
    
  function updateps(qnum){
    //Flag not set if user not logged in
    if(psprocessed == 1){
      passedseen[qnum] += 1;
      if(passedseen[qnum] > 2){
        passedseen[qnum] = 2;
      }
    }
  }
  
  var qIndex = 0;
  function question_receiver(){
    if(questions_done < question_count){
      var stNewQuestion = 'Question ' + (questions_asked) + ' of ' + question_count + 
                            '  [' + (group_num+1) + '-' + question_num + ']<br>' + q_sel_fields[6];
      qIndex = q_sel_fields[0];
      stNewQuestion += '<a class="examhlink" href="javascript:void(0)" onClick="setForumFrame(); ">Forum</a> '

      if(test_help[qIndex] != undefined){
        stNewQuestion += ' <a class="examhlink" href="' + test_help[qIndex] + '" target="examhelp"' + 
                         '>Study Material</a>'
      }
      document.getElementById('question_table').innerHTML = stNewQuestion;
      //picture location
      if(stNewQuestion.indexOf('T1') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/figt1.jpg">';
      }
      else if(stNewQuestion.indexOf('T2') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/figt2.jpg">';
      }
      else if(stNewQuestion.indexOf('T3') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/figt3.jpg">';
      }
      else if(stNewQuestion.indexOf('T4') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/figt4.jpg">';
      }
      else if(stNewQuestion.indexOf('T5') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/figt5.jpg">';
      }
      else if(stNewQuestion.indexOf('T6') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/figt6.jpg">';
      }
      else if(stNewQuestion.indexOf('T7') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/figt7.jpg">';
      }
      else if(stNewQuestion.indexOf('E6-2') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://2.bp.blogspot.com/_F9SL38Tu6gA/SQnqCs6sngI/AAAAAAAAJ24/mpJnzMt07VE/s400/E6-2.png">';
      }    else if(stNewQuestion.indexOf('E6-3') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://3.bp.blogspot.com/_F9SL38Tu6gA/SQnqCj5N1KI/AAAAAAAAJ3A/GxnxZMoWpPg/s400/E6-3.png">';
      }    else if(stNewQuestion.indexOf('E6-5') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://3.bp.blogspot.com/_F9SL38Tu6gA/SQnqC1HQ5hI/AAAAAAAAJ3I/MQnuXQzr7KY/s400/E6-5.png">';
      }    else if(stNewQuestion.indexOf('E7-1') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://2.bp.blogspot.com/_F9SL38Tu6gA/SQnqDM9aRaI/AAAAAAAAJ3Q/WQaRwbUFSxA/s400/E7-1.png">';
      }    else if(stNewQuestion.indexOf('E7-2') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://4.bp.blogspot.com/_F9SL38Tu6gA/SQnqDCC4dQI/AAAAAAAAJ3Y/fTkR2dcfxCQ/s400/E7-2.png">';
      }    else if(stNewQuestion.indexOf('E7-3') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://4.bp.blogspot.com/_F9SL38Tu6gA/SQnqPiTuiLI/AAAAAAAAJ3g/5X5jUkxP-dw/s400/E7-3.png">';
      }    else if(stNewQuestion.indexOf('E7-4') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://3.bp.blogspot.com/_F9SL38Tu6gA/SQnqP6FkqXI/AAAAAAAAJ3o/VIqNi24KfKU/s400/E7-4.png">';
      }    else if(stNewQuestion.indexOf('E9-1') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://4.bp.blogspot.com/_F9SL38Tu6gA/SQnqP64Z0HI/AAAAAAAAJ3w/TZTuXVGxwqU/s400/E9-1.png">';
      }    else if(stNewQuestion.indexOf('E9-2') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://2.bp.blogspot.com/_F9SL38Tu6gA/SQnqQBu-VuI/AAAAAAAAJ34/_7r3Nzl70Mg/s400/E9-2.png">';
      }    else if(stNewQuestion.indexOf('E9-3') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://4.bp.blogspot.com/_F9SL38Tu6gA/SQnqQKT4iaI/AAAAAAAAJ4A/mWcIHdsvPYs/s400/E9-3.png">';
      }    else if(stNewQuestion.indexOf('G7-1') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="http://4.bp.blogspot.com/_F9SL38Tu6gA/SQnBPk3aObI/AAAAAAAAJ2g/8MU4yzbRCk8/s400/G7-1.jpg">';
      }    else{
        document.getElementById('q_figure').innerHTML = '';
      }
      document.getElementById('radio_a').checked=false;
      document.getElementById('radio_b').checked=false;
      document.getElementById('radio_c').checked=false;
      document.getElementById('radio_d').checked=false;
      document.getElementById('answer_a').style.backgroundColor = '#FFFFFF';
      document.getElementById('answer_a').innerHTML = q_sel_fields[7];
      document.getElementById('answer_b').style.backgroundColor = '#FFFFFF';
      document.getElementById('answer_b').innerHTML = q_sel_fields[8];
      document.getElementById('answer_c').style.backgroundColor = '#FFFFFF';
      document.getElementById('answer_c').innerHTML = q_sel_fields[9];
      document.getElementById('answer_d').style.backgroundColor = '#FFFFFF';
      document.getElementById('answer_d').innerHTML = q_sel_fields[10];
      correct = q_sel_fields[5];
      questions_done = questions_done + 1;
    }  else{
      document.getElementById('next_question').value = 'New Test';
    }
  }

function fquestion_receiver(){
  
   //See the proper text into ftest_header       
   if(test_type == 'T'){
     document.getElementById('fquestion_table').innerHTML = 
     'Technician Class Amateur Radio Practice Exam (Question pool published 2/1/2010)';
   }
   if(test_type == 'G'){
     document.getElementById('fquestion_table').innerHTML = 
     'General Class Amateur Radio Practice Exam (Question pool published 2/23/2007)';
   }
   if(test_type == 'E'){
     document.getElementById('fquestion_table').innerHTML = 
     'Extra Class Amateur Radio Practice Exam (Question pool published 12/20/2008)';
   }
   if(test_type == 'CB'){
     document.getElementById('fquestion_table').innerHTML = 
     'Canada Basic Amateur Radio Practice Exam (Question pool published April, 2007)';
   }
   if(test_type == 'CA'){
     document.getElementById('fquestion_table').innerHTML = 
     'Canada Advanced Amateur Radio Practice Exam (Question pool published April, 2007)';
   }
   if(test_type == 'NZ'){
     document.getElementById('fquestion_table').innerHTML = 
     'New Zealand Amateur Radio Examination Practice (Question pool published March, 2010)';
   }

  //Get the comments setup
  document.getElementById('fbfc').innerHTML = 
                 '<fb:comments width="330" notify=true xid=' + test_type + qIndex + '></fb:comments>';
                 alert('<fb:comments width="330" notify=true xid=' + test_type + qIndex + '></fb:comments>');


      var stNewQuestion = 'Question ' + (questions_asked) + ' of ' + question_count + 
                            '  [' + (group_num+1) + '-' + question_num + ']<br>' + q_sel_fields[6];

      if(test_help[qIndex] != undefined){
        stNewQuestion += ' <a class="examhlink" href="' + test_help[qIndex] + '" target="examhelp"' + 
                         '>Study Material</a>'
      }
      document.getElementById('fquestion_table').innerHTML = stNewQuestion;

      var forumAnswer = correct.toUpperCase();
      if(forumAnswer == 'A' || forumAnswer == '1'){ 
        document.getElementById('fanswer_a').style.backgroundColor = '#00FF00';
      }else{  
        document.getElementById('fanswer_a').style.backgroundColor = '#FFFFFF';
      }  
      document.getElementById('fanswer_a').innerHTML = q_sel_fields[7];
      if(forumAnswer == 'B' || forumAnswer == '2'){ 
        document.getElementById('fanswer_b').style.backgroundColor = '#00FF00';
      }else{  
        document.getElementById('fanswer_b').style.backgroundColor = '#FFFFFF';
      }  
      document.getElementById('fanswer_b').innerHTML = q_sel_fields[8];
      if(forumAnswer == 'C' || forumAnswer == '3'){ 
        document.getElementById('fanswer_c').style.backgroundColor = '#00FF00';
      }else{  
        document.getElementById('fanswer_c').style.backgroundColor = '#FFFFFF';
      }  
      document.getElementById('fanswer_c').innerHTML = q_sel_fields[9];
      if(forumAnswer == 'D' || forumAnswer == '4'){ 
        document.getElementById('fanswer_d').style.backgroundColor = '#00FF00';
      }else{  
        document.getElementById('fanswer_d').style.backgroundColor = '#FFFFFF';
      }  
      document.getElementById('fanswer_d').innerHTML = q_sel_fields[10];
      

  }

function update_questions_asked(){
    var test_score = new Number(s_test_score);
    var accuracy = new Number(s_test_accuracy);
    document.getElementById('q_correct').innerHTML = ' Accuracy = ' + accuracy.toFixed(2) + '%' + 'Test Score = ' + test_score.toFixed(2) + '% ';
}

function conv_ans( answer ){
  if(test_type == 'CA' || test_type == 'CB'){
    if(answer == 'a'){
      return '1';
    }
    else if(answer == 'b'){
      return '2';
    }
    else if(answer == 'c'){
      return '3';
    }
    else if(answer == 'd'){
      return '4';
    }
    else{
      return answer;
    }
  }
  else{
    return answer;
  }
}

function check(answer, a_id){  
  //Convert answers that aren't A-D
  answer = conv_ans(answer);
  if(answer.toUpperCase() == correct.toUpperCase()){
    //Record that the question has been passed
    updateps(abs_qnum);
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
    new_test_b = false;
    scores_saved = false;
    update_test_scores();
    first_answer = 0;
  }
}

function update_test_scores(){
    var test_score = new Number((raw_test_score/question_count)*100);
    s_test_score = test_score;
    var accuracy = new Number((raw_test_score/questions_answered)*100);
    s_test_accuracy = accuracy;
    document.getElementById('next_question').disabled = false;
        if(questions_asked == question_count){
      //alert('About to call end test');
      end_test();
    }
}

//Request used to communicate with application
var req;
var map_addr = '';
function get_short_map(){

  map_addr = 'http://maps.google.com/maps/api/staticmap?size=85x85&maptype=hybrid' + 
        '&markers=color:blue|label:T|' + tx_latlng.lat() +  ',' + tx_latlng.lng() + 
        '&markers=color:blue|label:R|' + rx_latlng.lat() +  ',' + rx_latlng.lng() + 
        '&path=color:0xff0000ff|weight:5|' + tx_latlng.lat() +  ',' + tx_latlng.lng() + '|' + 
        rx_latlng.lat() +  ',' + rx_latlng.lng() + '&sensor=false';
  var sm_map_addr = 'http://maps.google.com/maps/api/staticmap?size=100x100&maptype=hybrid' + 
        '&markers=color:blue|size:tiny|' + tx_latlng.lat() +  ',' + tx_latlng.lng() + 
        '&markers=color:blue|size:tiny|' + rx_latlng.lat() +  ',' + rx_latlng.lng() + 
        '&path=color:0xff0000ff|weight:1|' + tx_latlng.lat() +  ',' + tx_latlng.lng() + '|' + 
        rx_latlng.lat() +  ',' + rx_latlng.lng() + '&sensor=false';

  var map_rx = rx_mirror_call;
  var map_tx = tx_mirror_call;

        var map_params = "map=" + encodeURIComponent(map_addr) + "&rx=" + map_rx + "&tx=" + map_tx + 
                         "&sm_map=" + encodeURIComponent(sm_map_addr); 
        //alert('map_params = ' + map_params);

        //Now send the scores to the db
        if (typeof XMLHttpRequest != "undefined") {
            req = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        req.open("POST", '/shm', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.setRequestHeader("Content-length", map_params.length);
        req.setRequestHeader("Connection", "close");

        
        req.onreadystatechange = short_map_cb;
        req.send(map_params);

}



function short_map_cb(){
    if (req.readyState == 4) {
        if (req.status == 200) {
              //alert('Entered log_cb with ' + req.responseText);
              //document.getElementById('logtable').innerHTML = req.responseText;
              msg_img = req.responseText;
              //alert('msg_img ' + msg_img);
              
              //test code to get a link to the map stored in map_addr
  var request = gapi.client.urlshortener.url.insert({
      'resource': {
          'longUrl': map_addr
      }
  });
  request.execute(function(response) {
      var y=3;
      
      if((response.id != null) && fb_present){
    	  //share the map of the qso
    	  //fb_map(response.id);
      }
	  //alert('short url is ' + response)
  });
              
              
              
              //qso_mapped(msg_img);

        }
        else{
          alert('short_map_cb Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }
}

function fb_map(shortened_map){
	  var qso_message = 'Ham radio QSO ' + rx_mirror_call + ' de ' + tx_mirror_call;
	  if(mikm == 0){
	    qso_message += ' ' + Number(distance/1609.344).toFixed(2) + ' miles '; 
	  }else{
	    qso_message += ' ' + Number(distance/1000).toFixed(2) + ' kms ';
	  }

	var app_link = 'http://apps.facebook.com/qsomapper';
	var img_link = 'http://copaseticflows.appspot.com/img/techprep.png';
    var media = [
        	{
        		type: 'image',
        		src: shortened_map,
        		href: app_link
        	}
        ];
    var attachment = {
        name:  qso_message,
        href: app_link,
        caption: 'Playing radios today',
        media: media
    }
FB.ui(
   {
     method: 'stream.publish',
     attachment: attachment
   }, function(response){
	   y=4;
   }
  );
}




function log_scores(){
      //alert('entered log_scores');
      //store the test scores if the user is logged in
      if(login_user != ''){
        //Prep everything to send in the score
        var score_str = '';
        for(var i = 0; i < score_row_count; i += 1){
          score_str += subel[i] + '|';
        }
        //alert('scores are ' + score_str);
        var passedseen_str = '';
        for(var i=0; i < total_questions; i+=1){
          passedseen_str += passedseen[i] + '|';
        }
        //alert('passedseen is ' + passedseen_str);
        //alert('Score is ' + score_str);
        var score_params = "tclass=" +
                      encodeURIComponent(test_type) + 
                      "&name=" + encodeURIComponent(login_user) +
                      "&elementscores=" + encodeURIComponent(score_str) +
                      "&passedseen=" + encodeURIComponent(passedseen_str);
        if(document.getElementById('next_question').value != 'New Test'){
          //partial test results
          if(document.getElementById('next_question').disabled == true){
            score_params += "&partial=" + encodeURIComponent(questions_asked - 1);
          }
          else{
            score_params += "&partial=" + encodeURIComponent(questions_asked);
          }
        }
  
                      
        //Now send the scores to the db
        if (typeof XMLHttpRequest != "undefined") {
            req = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        req.open("POST", '/hamtestscore', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.setRequestHeader("Content-length", score_params.length);
        req.setRequestHeader("Connection", "close");

        
        req.onreadystatechange = log_scores_cb;
        req.send(score_params);

      }

}

function log_scores_cb(){
    if (req.readyState == 4) {
        if (req.status == 200) {
              //alert('Entered log_cb with ' + req.responseText);
              //document.getElementById('logtable').innerHTML = req.responseText;
              scores_saved = true;
              if(!new_test_b){
                show_results();
                toggleTab(2,3);
              }
              else{
                new_test_b = false;
              }
        }
        else{
          alert('log_cb Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }
}

function setForumFrame(){
//fquestion_receiver();
//document.getElementById('forumout').innerHTML = 'If you cannot see the forum below, ' + 
//                             'your browser is unhappy with it ' +
//                             'please <a target="_blank" href="http://copaseticflows.appspot.com/hamtforum?q_index=' + 
//                             qIndex + '&t_class=' + test_type + '">click here</a>.';
//Change the src of the iframe
//document.getElementById('forum2').src=
//     'http://copaseticflows.appspot.com/hamtforum?q_index=' + qIndex + '&t_class=' + test_type;

frames["forumtest"].location.href = 'http://copaseticflows.appspot.com/hamtforum?q_index=' + qIndex + '&t_class=' + test_type;
     
htoggleTab(5,5);     

}

function end_test(){
  document.getElementById('next_question').value = 'New Test';
  if(in_exam == true){
    log_scores();
  }
  if(in_exam == true){
    if(s_test_score >= 75){
      document.getElementById('q_correct').innerHTML = 'You Passed the Test!!! Congratualations!';
      //Update FB status
      
      if(test_type == 'T'){
        fb_tech_passed();
      }
      if(test_type == 'G'){
        fb_general_passed();
      }
      if(test_type == 'E'){
        fb_extra_passed();
      }
      if(test_type == 'CB'){
        fb_cb_passed();
      }
      if(test_type == 'CA'){
        fb_ca_passed();
      }
    }
    else{
      document.getElementById('q_correct').innerHTML = 'You did not pass the test.  You might want to study some more.';
    }
    
    sing_test = true;
    show_results();
  }
}

function welcome_user(){
  norm_welcome_user();
  show_results();
}

var reqc;
function show_results(){
  if(login_user != ''){
        var score_url = "/hamtestscore?tclass=" +
                      encodeURIComponent(test_type) + 
                      "&name=" + encodeURIComponent(login_user);
        //Now get the scores from the db
        if (typeof XMLHttpRequest != "undefined") {
            reqc = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            reqc = new ActiveXObject("Microsoft.XMLHTTP");
        }
        reqc.open("GET", score_url, true);
        reqc.onreadystatechange = show_test_results_resp;
        reqc.send(null);
  }
  else{
    //document.getElementById('show_hide_scores').value = 'Hide Scores';
    //document.getElementById('show_hide_scores').style.backgroundColor = '#43cc43';
    //show_single_test_sec_results_resp();
  }
}

function show_single_test_sec_results_resp(){
  var sec_scores = [];
    for(var x = 0; x < 59; x++){
      var raw_score = subel[x+1];
      sec_scores[x] = (raw_score/(subel_count[x+1]))*61;
    }
      var raw_score = subel[0];
      sec_scores[60] = (raw_score/(subel_count[0]))*61;
        var chart_url = [];
    chart_url.push(' <img src="http://chart.apis.google.com/chart?chs=280x200');
    chart_url.push('&amp;chd=');
    chart_url.push(simpleEncode(sec_scores, 61));
    chart_url.push('&amp;cht=bvs&amp;chbh=a&amp;chxt=x&amp;chl=T1|T2|T3|T4|T5|T6|T7|T8|T9|T0');
    chart_url.push('&amp;chtt=Performance per test subelement for this test">');
    if(sing_test == false){
      //document.getElementById('score_row_user').innerHTML = 'You do not have any saved exam scores.<br><br>To save and display your exam scores and subelement performance please login.  If you do not have an account yet, just enter any name and password and click the Create button.  The name and password are only used to track your scores. Scores are saved after every practice exam.<br><br>The graph below will show how you did on each subelement after you complete a practice test.';
      sing_test = true;
    }
    document.getElementById('tabContent2').innerHTML = chart_url.join('');
}

function show_test_results(){

}


function show_test_results_resp(){
    if (reqc.readyState == 4) {
        if (reqc.status == 200) {
              //alert('Entered log_cb with ' + req.responseText);
              //document.getElementById('logtable').innerHTML = req.responseText;

    var score_colors = ''; 
  var response = reqc.responseText;
  //alert('results ' + response);
  //First, break the accumulated scores away from the passedseen data
  var scoredata = response.split(':');
  //Update the passedseen data if necessary
  if(psprocessed == 0){
    psprocessed = 1;
    var psdata = scoredata[1];
    //alert('psdata ' + psdata);
    if(psdata != ''){
      //alert('going to process ' + psdata.length);
      pssaved = psdata.split('|');
      //load the users passedseen data
      for(var i=0; i < total_questions; i+= 1){
        passedseen[i] = parseInt(pssaved[i]);
      }
    }
  }
  //var datarows = response.split('&');
  var datarows = scoredata[0].split('&');
  //alert(datarows.length + ' scores found');
  //alert(response);
  var test_scores = [];
  //var data = response.getDataTable();
   //Graph progress on complete practice exams
   if(datarows.length - 1 == 0){
     document.getElementById('tabContent2').innerHTML = 'No scores saved yet'
   }
   for(var test=0; test < datarows.length - 1; test += 1){
    var raw_score = 0;
    //alert('datarow[' + test + '] = ' + datarows[test]);
    var datarow = datarows[test].split('|');
    //alert(datarows[test]);
    //If there is a 61st element score, then set the partial flag
    var partial = false;
    var partial_value = 'N';
    if(datarow[score_row_count + 1] != 'None'){
      if(datarow[score_row_count + 1] != ''){
        //alert('Found partial in ' + test + ' ' + datarow[61]);
        partial = true;
        partial_value = datarow[score_row_count + 1];
      }
    }
    for(var x = 0; x < score_row_count; x++){
      raw_score = raw_score + parseInt(datarow[x]);
      //alert(raw_score + 
    }
    //alert(test + ' ' + raw_score);
    
    //The 61 below is a graphic scaling factor and has nothing to do with
    //the 60 questions in the test
    test_scores[test] = (raw_score/question_count)*61;
    if(partial && (partial_value != 'Y')){
      test_scores[test] = (raw_score/partial_value)*61;
    }
      if(test == 0){
        score_colors = '&amp;chco=';
      }
      if(test > 0){
        score_colors = score_colors + '|';      
      }
      var color_score = raw_score/question_count;
      if(partial && (partial_value != 'Y')){
        color_score = raw_score/partial_value;
      }
      
      score_colors = score_colors + getScoreColor(color_score);
      //Make partial test scores transparent
      if(partial){
        score_colors += '77';
      }
  }
  if(datarows.length - 1 != 0){
    for(var pad = datarows.length - 1; pad < 10; pad++){
      test_scores[pad] = 0;
    }


  //Encapsulate this as the progress charting method
  table_start = '<table style="border: 0px solid #666666; text-align:center"><tr><td colspan=2>'
  var chart_url = [];
  chart_url.push(' <img src="http://chart.apis.google.com/chart?chs=280x200');
  chart_url.push(score_colors);  
  chart_url.push('&chg=101,25');
  chart_url.push('&amp;chd=');  chart_url.push(simpleEncode(test_scores, 61));
  //alert(test_scores[0] + ' ' + test_scores[1]);
  chart_url.push('&amp;cht=bvs&amp;chbh=a&amp;chxt=y');
  chart_url.push('&amp;chtt= Test Scores for ' + templ_name + '">');
  document.getElementById('tabContent2').innerHTML = table_start + 
                            chart_url.join('') + 
                            '<br><br></td></tr><tr>'+
                            '<td>%Questions Answered<br>'+
                            get_pie_chart(gettotunseen(), total_questions, 130, 100) + 
                            '<br><input id="Unseen" type="button" value="New Test Unseen" onclick="toggleTab(1,3); question_getter(this.value)">' +
                            '</td>'+
                            '<td>%Questions Passed<br>'+
                            get_pie_chart(gettotunpassed(), total_questions, 130, 100) +
                            '<br><input id="Unpassed" type="button" value="New Test Unpassed" onclick="toggleTab(1,3); question_getter(this.value)">' +
                            '</td></tr>';
  }
   //Now graph the per element progress of the student
   //Per element graphing removed
   
   document.getElementById('tabContent2').innerHTML += '</table>'
        }
        else{
          alert('log_cb Reqeust failed ' + reqc.status + ' ' + reqc.responseText);
        }
    }
}

  //Functions to process unpassed and unseen questions
  function gettotunseen(){
    var totunseen = 0;
    for(var i = 0; i < passedseen.length; i+= 1){
      if(passedseen[i] == 0){
        totunseen += 1;
      }
    }
    return totunseen;
  }
  
  function getunseen( group ){
    //Determine the offset and size of the group
    groupunseen = 0;
    var offset = group_offests[group];
    var count = group_q_count[group];
    
    for(var i = 0; i < group_q_count; i += 1){
      if(passedseen[offset + i] == 0){
        groupunseen += 1;
      }
    }
    return groupunseen;
  }

  function getunpassed( group ){
    //Determine the offset and size of the group
    groupunpassed = 0;
    var offset = group_offests[group];
    var count = group_q_count[group];
    
    for(var i = 0; i < group_q_count; i += 1){
      if(passedseen[offset + i] < 2){
        groupunpassed += 1;
      }
    }
    return groupunpassed;
  }

  function gettotunpassed(){
    var totunpassed = 0;
    for(var i = 0; i < passedseen.length; i+= 1){
      if(passedseen[i] < 2){
        totunpassed += 1;
      }
    }
    return totunpassed;
  }

function get_pie_chart(unseenpassed, total, x, y){
    var piedata = [];
    var pie_url = [];
    piedata[0] = unseenpassed;
    piedata[1] = total - unseenpassed;
    pie_url.push(' <img src="http://chart.apis.google.com/chart?chs=' + x + 'x' + y);
    //chart_url.push(score_colors);
    pie_url.push('&amp;chco=FF0000|00FF00');  
    //pie_url.push('&amp;chl=Untested|Tested');
    pie_url.push('&amp;chd=');
    pie_url.push(simpleEncode(piedata, total));  
    pie_url.push('&amp;cht=p');  
    pie_url.push('">');
    //pie_url.push('&amp;chtt= Question Pool Completion' + '">'); 
    //alert(pie_url.join(''));
    return pie_url.join('');  

}

function insert_graph( graph_scores, title, colors){
  //Encapsulate this as the progress charting method
  var chart_url = [];
  chart_url.push(' <img src="http://chart.apis.google.com/chart?chs=280x200');
  chart_url.push(colors);  
  chart_url.push('&chg=101,25');
  chart_url.push('&amp;chd=');  chart_url.push(simpleEncode(graph_scores, 61));
  //alert(test_scores[0] + ' ' + test_scores[1]);
  chart_url.push('&amp;cht=bvs&amp;chbh=a&amp;chxt=y');
  chart_url.push('&amp;chtt= ' + title + '">');
  return chart_url.join('');
}

  function getScoreColor(color_score){
    var stScore = '000000';
    if(color_score < 0.75){
      stScore = 'FF0000';
    }   
    else if(color_score >= 0.75  && color_score < 0.90){
      stScore = 'FFFF00';
    }   
    else if(color_score >= 0.90){
      stScore = '00FF00';
    } 
    else{
      //alert('Funny score ' + color_score);
    }
    return stScore;  
  }


var simpleEncoding = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function simpleEncode(valueArray,maxValue) {
  var chartData = ['s:'];
  for (var i = 0; i < valueArray.length; i++) {
    var currentValue = valueArray[i];
    if (!isNaN(currentValue) && currentValue >= 0) {
      chartData.push(simpleEncoding.charAt(Math.round((simpleEncoding.length-1) * currentValue / maxValue)));
    }
    else {
      chartData.push('_');
    }
  }
return chartData.join('');
}


function initialize_test_scores(){
  document.getElementById('q_correct').innerHTML = '';
  document.getElementById('q_correct').innerHTML = 'Questions Answered = 1 of ' + question_count + ' Accuracy = 0 Score = 0';
}

function init_score(){
  for(var x = 0; x < element_count; x++){
      subel[x] = 0;
  }
}

/*-----------------------------------------------------------
    Toggles element's display value
    Input: any number of element id's
    Output: none 
    ---------------------------------------------------------*/
function toggleDisp() {
    for (var i=0;i<arguments.length;i++){
        var d = $(arguments[i]);
        if (d.style.display == 'none')
            d.style.display = 'block';
        else
            d.style.display = 'none';
    }
}
/*-----------------------------------------------------------
    Toggles tabs - Closes any open tabs, and then opens current tab
    Input:     1.The number of the current tab
                    2.The number of tabs
                    3.(optional)The number of the tab to leave open
                    4.(optional)Pass in true or false whether or not to animate the open/close of the tabs
    Output: none 
    ---------------------------------------------------------*/
function toggleTab(num,numelems,opennum,animate) {
    if ($('tabContent'+num).style.display == 'none'){
        for (var i=1;i<=numelems;i++){
            if ((opennum == null) || (opennum != i)){
                var temph = 'tabHeader'+i;
                var h = $(temph);
                if (!h){
                    var h = $('tabHeaderActive');
                    h.id = temph;
                }
                var tempc = 'tabContent'+i;
                var c = $(tempc);
                if(c.style.display != 'none'){
                    if (animate || typeof animate == 'undefined')
                        Effect.toggle(tempc,'blind',{duration:0.5, queue:{scope:'menus', limit: 3}});
                    else
                        toggleDisp(tempc);
                }
            }
        }
        var h = $('tabHeader'+num);
        if (h)
            h.id = 'tabHeaderActive';
        h.blur();
        var c = $('tabContent'+num);
        c.style.marginTop = '2px';
        if (animate || typeof animate == 'undefined'){
            Effect.toggle('tabContent'+num,'blind',{duration:0.5, queue:{scope:'menus', position:'end', limit: 3}});
        }else{
            toggleDisp('tabContent'+num);
        }
    }
}

/*-----------------------------------------------------------
    Toggles element's display value
    Input: any number of element id's
    Output: none 
    ---------------------------------------------------------*/
function htoggleDisp() {
    for (var i=0;i<arguments.length;i++){
        var d = $(arguments[i]);
        if (d.style.display == 'none')
            d.style.display = 'block';
        else
            d.style.display = 'none';
    }
}
/*-----------------------------------------------------------
    Toggles tabs - Closes any open tabs, and then opens current tab
    Input:     1.The number of the current tab
                    2.The number of tabs
                    3.(optional)The number of the tab to leave open
                    4.(optional)Pass in true or false whether or not to animate the open/close of the tabs
    Output: none 
    ---------------------------------------------------------*/
function htoggleTab(num,numelems,opennum,animate) {
    if ($('htabContent'+num).style.display == 'none'){
        for (var i=1;i<=numelems;i++){
            if ((opennum == null) || (opennum != i)){
                var temph = 'htabHeader'+i;
                var h = $(temph);
                if (!h){
                    var h = $('htabHeaderActive');
                    h.id = temph;
                }
                var tempc = 'htabContent'+i;
                var c = $(tempc);
                if(c.style.display != 'none'){
                    if (animate || typeof animate == 'undefined')
                        Effect.toggle(tempc,'blind',{duration:0.5, queue:{scope:'menus', limit: 3}});
                    else
                        toggleDisp(tempc);
                }
            }
        }
        var h = $('htabHeader'+num);
        if (h)
            h.id = 'htabHeaderActive';
        h.blur();
        var c = $('htabContent'+num);
        c.style.marginTop = '2px';
        if (animate || typeof animate == 'undefined'){
            Effect.toggle('htabContent'+num,'blind',{duration:0.5, queue:{scope:'menus', position:'end', limit: 3}});
        }else{
            toggleDisp('htabContent'+num);
        }
    }
}


test_initialize();


var map;
  
function init_map() {
    //alert('init map');
    map = new GMap2(document.getElementById("map"), {   size:new GSize(545,350)});
    //alert('exit init map');
    var point = new GLatLng(37.71859, 6.679688);
    map.setCenter(point, 3);
    var mapControl = new GMapTypeControl();
    map.addControl(mapControl);
    map.addControl(new GSmallMapControl());    //map = new GMap2( document.getElementById('map_canvas') );
    map.setMapType(G_HYBRID_MAP);
    //map = new GMap2(  );
}

var stspotDate = '';
var stspotTime = '';
function init_spot(){
  spotDate = new Date();
  stspotDate = '';
  stspotTime = '';
  stspotDate = Number((spotDate.getUTCMonth()+1)).toString() + '/' + spotDate.getUTCDate() + '/' + spotDate.getUTCFullYear();
  if(Number(spotDate.getUTCHours()).toString().length < 2){
    stspotTime = '0';
  }
  stspotTime += spotDate.getUTCHours() + ':';
  if(Number(spotDate.getUTCMinutes()).toString().length < 2){
    stspotTime += '0';
  }
  stspotTime += spotDate.getUTCMinutes()
  //document.getElementById('spotdatetime').innerHTML = 'On the air now? Date: ' + stspotDate +
  //                           ' Time: ' + stspotTime + 'GMT';
  
}


function init_lang(){
  var rxTopDiv = document.getElementById('rx_cs');
  var txTopDiv = document.getElementById('tx_cs');
  var txpwDiv = document.getElementById('txpw');
  var txGetCall = document.getElementById('getcall');
  var rxGetCall = document.getElementById('rx_getcall');
  var distDiv = document.getElementById('id_dist');
  if(lang == 'nl'){
    txTopDiv.innerHTML = 'Eigen call';
    rxTopDiv.innerHTML = 'Call tegenstation';
    txpwDiv.innerHTML = 'Eigen vermogen in watts';
    distanceSt = 'Afstand';
    MilesPerWattSt = 'Miles per Watt';
    KmsPerWattSt = 'Kilometers per Watt';
    alrightSt = 'OK';
    unmappableSt = 'Unmappable address format.';
    plsformatSt = 'Please re-format the address, test, and submit.';
    testSt = 'test';
    submitSt = 'submit';
    plsformatlabSt = 'Please re-format address.';
  }
  else if(lang == 'de'){
    txTopDiv.innerHTML = 'Sender Call';
    rxTopDiv.innerHTML = 'Empf�nger Call';
    txpwDiv.innerHTML = 'Sendeleistung in Watt';
    distanceSt = 'Entfernung';
    MilesPerWattSt = 'Meilen pro Watt';
    KmsPerWattSt = 'Kilometer pro Watt';
    alrightSt = 'OK';
    unmappableSt = 'Nicht darstellbares Adress-Format';
    plsformatSt = 'Bitte  umformatieren, testen, eingeben';
    testSt = 'test';
    submitSt = 'Eingabe';
    plsformatlabSt = 'Bitte  umformatieren.';
  }
  else if(lang == 'es'){
    txTopDiv.innerHTML = 'Indicativo Emisor';
    rxTopDiv.innerHTML = 'Indicativo Receptor';
    txpwDiv.innerHTML = 'Potencia Transmisi�n en vatios';
    distanceSt = 'Distancia';
    MilesPerWattSt = 'Millas por vatio';
    KmsPerWattSt = 'Kil�metro por vatio';
    alrightSt = 'OK';
    unmappableSt = 'Formato de direcci�n no v�lido.';
    plsformatSt = 'Por favor, revisa el formato de la direcci�n, pru�bela y env�ela de nuevo.';
    testSt = 'Prueba';
    submitSt = 'Enviar';
    plsformatlabSt = 'Por favor, revisa el formato de la direcci�n.';
  }
  else if (lang == 'sv'){
    txTopDiv.innerHTML = 'S�ndarens anropssignal';
    rxTopDiv.innerHTML = 'Mottagarens anropssignal';
    txpwDiv.innerHTML = 'S�ndareffekt i watt';
    distanceSt = 'Avst�nd';
    MilesPerWattSt = 'Mil per watt';
    KmsPerWattSt = 'kilometer per watt';
    alrightSt = 'OK';
    unmappableSt = 'Adressformatet ej giltigt.';
    plsformatSt = 'V�nligen omformatera adressen, test, och l�gg till.';
    testSt = 'Prueba';
    submitSt = 'L�gg till';
    plsformatlabSt = 'V�nligen omformatera.';
  }
  else if (lang == 'it'){
    txTopDiv.innerHTML = 'Nominativo di stazione';
    rxTopDiv.innerHTML = 'Nominativo ricevuto';
    txpwDiv.innerHTML = 'Potenza di trasmissione in watt';
    distanceSt = 'Distanza';
    MilesPerWattSt = 'Miglia per watt';
    KmsPerWattSt = 'Chilometro per watt';
    alrightSt = 'OK';
    unmappableSt = 'Adressformatet ej giltigt.';
    plsformatSt = 'Per favore, rivedi il formato dell`indirizzo, provalo ed invialo nuovamente.';
    testSt = 'Prova';
    submitSt = 'Invia';
    plsformatlabSt = 'Formato dell`indirizzo non valido. ';
  }
  else if (lang == 'en'){
    txTopDiv.innerHTML = 'Transmit Call';
    rxTopDiv.innerHTML = 'Receive Call';
    txpwDiv.innerHTML = 'Pwr (W)';
    distanceSt = 'Distance';
    MilesPerWattSt = 'Miles Per Watt';
    KmsPerWattSt = 'Kilometers Per Watt';
    alrightSt = 'OK';
    unmappableSt = 'Unmappable address format.';
    plsformatSt = 'Please re-format the address, test, and submit.';
    testSt = 'test';
    submitSt = 'submit';
    plsformatlabSt = 'Please re-format address.';
  }
  else{
    //Default to English
    txTopDiv.innerHTML = 'Transmit Call';
    rxTopDiv.innerHTML = 'Receive Call';
    txpwDiv.innerHTML = 'Pwr (W)';
    distanceSt = 'Distance';
    MilesPerWattSt = 'Miles Per Watt';
    KmsPerWattSt = 'Kilometers Per Watt';
    alrightSt = 'OK';
    unmappableSt = 'Unmappable address format.';
    plsformatSt = 'Please re-format the address, test, and submit.';
    testSt = 'test';
    submitSt = 'submit';
    plsformatlabSt = 'Please re-format address.';
  
  }
} 


var my_copyright = "Copyright 2008 Pythagorean Productions";
var is_first_mapping = 0;
var both_points_in = 0;
var recent = true;
var first_point;
var rx_addr;
var rx_found_lat;
var rx_found_lng;
var tx_addr;
var tx_found_lat;
var tx_found_lng;
var db_rx_addr;
var db_tx_addr;
var new_test = 0;
var distance;
var mikm = 0;
var inputWatts = '<input size="8" type="text" name="tx_power" value="1" id="id_tx_power" >';
var distanceSt = 'Distance';
var MilesPerWattSt = 'Miles Per Watt';
var KmsPerWattSt = 'Kilometers Per Watt';
var alrightSt = 'OK';
var unmappableSt = 'Unmappable address format.';
var plsformatSt = 'Please re-format the address, test, and submit.';
var testSt = 'test';
var submitSt = 'submit';
var plsformatlabSt = 'Please re-format address.';
//Uncomment for version with date chooser
//var dpck_fieldname = new DatePicker({
//        relative:'fieldid',
//        keepFieldEmpty:true,
//        dateFilter:DatePickerUtils.noDatesBefore(-300000).append(DatePickerUtils.noDatesAfter(60))
//});


  //alert('Entered uiSetup');
google.load("visualization", "1");
  
//Setup all internationalization labels
//_IG_RegisterOnloadHandler(uiSetup);
//uiSetup();
//alert('Registerd setup handler');
  //alert('Otherside uiSetup');
  //alert('About to init map');
  //alert('Done with init map');

var req;
var reqcs;
var reqss;

//values for logger panel collapse and restore
var control_html;
var control_toggle = 0;
var message_toggle = 0;
var hide_id_call_sign;
var hide_id_rx_call_sign;
var hide_fieldid;
var hide_time;
var hide_frequency;
var hide_power;
var hide_rx_lat;
var hide_rx_lng;
var hide_tx_lat;
var hide_tx_lng;
var hide_my_user;
var qsls;
var newqs


//Arrays for storing references to call routes
var arxMarker = new Array();
var atxMarker = new Array();
var acallPoly = new Array();
var callRouteIndex = 0;

var searchGQL = '';
var first_term = 0;

//cValue is the value of the control to be added
//compValue is the comparison that indicates a search is not to include this
//andorValue should be 'and' or 'or'
//cName is the name of the db field
function addStringSearchTerm( cValue, compValue, andorValue, cName){
   if(cValue != compValue){
     if(first_term != 0){
       first_term = 1;
       searchGQL += "WHERE ";
     } else{
       searchGQL += andorValue + " ";
     }
     searchGQL += "cName = ' " + cValue + " ";
   }

}

function showallqsos(){
   if (typeof XMLHttpRequest != "undefined") {
       req = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   }
   req.open("GET", '/fillqso', true);
   req.onreadystatechange = entrytable_callback;
   req.send(null);
   //alert('req Sent specsearch');
}

function specSearchSubmit(searchString){
   if (typeof XMLHttpRequest != "undefined") {
       req = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   }
   req.open("GET", searchString, true);
   req.onreadystatechange = entrytable_callback;
   req.send(null);
   //alert('req Sent specsearch');
}

function specSearch(){
   //alert('Setting up specsearch');
   var first_term = 0;
   var getmode = document.getElementById('search_mode');
   clear_all_map();

   var search_url = "/qslsearch?callsign=" + 
              encodeURIComponent((document.getElementById('tx_search_sign').value).toUpperCase()) +
             "&search_mode=" + 
             encodeURIComponent(getmode.options[getmode.selectedIndex].value) +
             "&search_year=" + encodeURIComponent(document.getElementById('search_year').value);
   //alert('url is ' + url);
   
   //Setup the band indicators
   var bands = 0;
   for(var band_count=1; band_count < 24; band_count += 1){
     if(document.getElementById('band_' + band_count).checked){
     search_url += "&band=" + 
            encodeURIComponent(document.getElementById('band_' + band_count).value);
     }
   }
   
   //alert('url is ' + search_url);
   
   specSearchSubmit(search_url);

}

function hideHelp(){
  document.getElementById('help').style.zIndex=-1;
  document.getElementById('help_inside').style.zIndex=-1;
}

function showHelp(){
  document.getElementById('help').style.zIndex=2;
  document.getElementById('help_inside').style.zIndex=3;
}

//Called when the user enters presses the button to log a QSO 
function map_qso(){
   //HBC TODO Add format check into storeCall
   //if(!checkContact()){
   //  alert('Bad contact format');
   //  return;
   //}
   document.getElementById('id_spot').disabled=false;
          rx_quick = 0;
          tx_quick = 0;
  clear_all_map();
  
  calls_mapped = 0;
  
  tx_mirror_call = (document.getElementById('id_call_sign').value).toUpperCase();
  rx_mirror_call = (document.getElementById('id_rx_call_sign').value).toUpperCase();
  
  getcall( tx_mirror_call );

}

function map_call_s( iCall ){
  //Get the necessary information from the call's row
  var tx_lat = document.getElementById('tx_lat'+iCall).value;
  var tx_lng = document.getElementById('tx_lng'+iCall).value;
  var rx_lat = document.getElementById('rx_lat'+iCall).value;
  var rx_lng = document.getElementById('rx_lng'+iCall).value;
  var txPos = 0;
  var rxPos = 0;
  
  //if the checkbox is checked, continue.  Otherwise, clear the call route
  if(!document.getElementById('callmap'+iCall).checked){
    clear_map(iCall);
    return;
  }
  
  //Set the values of tx_latlng and rx_latlng
  //alert('test ' + tx_lat);
  if(tx_lat != 9000){
    tx_latlng = new GLatLng(tx_lat, tx_lng);
    txPos = 1;
  }
  else{
    alert('No location known for ' + document.getElementById('tx_log_call' + iCall).innerHTML + ' at the time of this log entry');
  }
  if(rx_lat != 9000){
    rx_latlng = new GLatLng(rx_lat, rx_lng);
    rxPos = 1;
  }
  else{
    alert('No location known for ' + document.getElementById('rx_log_call' + iCall).innerHTML + ' at the time of this log entry');
  }
  
  //alert('Created tx_latlng ' + tx_latlng.lat() + ' ' + tx_latlng.lng());
  
  //Set the values of db_tx_address and db_rx_address
  db_tx_addr = document.getElementById('tx_log_call'+iCall).innerHTML;
  db_rx_addr = document.getElementById('rx_log_call'+iCall).innerHTML;
  //alert('Created addresses ' + db_tx_addr + ' ' + db_rx_addr);
  
  //Call the marker drawing functions
  if(txPos == 1 && rxPos == 1){
    atxMarker[iCall] = new GMarker(tx_latlng);
    atxMarker[iCall].bindInfoWindow('<p style="color:#000000"; text-align:left>' +
                                    document.getElementById('tx_log_call' + iCall).innerHTML + 
                                    ' de ' + 
                                    document.getElementById('rx_log_call' + iCall).innerHTML + 
                                    '<br>' + 
                                    document.getElementById('q_date' + iCall).innerHTML + 
                                    ' ' +
                                    document.getElementById('q_time' + iCall).innerHTML + 
                                    '<br>frequency: ' +
                                    document.getElementById('q_freq' + iCall).innerHTML + ' kHz' +
                                    '</p>');
    map.addOverlay(atxMarker[iCall]);
  }

  if(rxPos == 1 && txPos == 1){
    arxMarker[iCall] = new GMarker(rx_latlng);
    //alert('rx_log_call' + iCall.toString(10));
    //alert(document.getElementById('rx_log_call' + iCall.toString(10)).value);
    arxMarker[iCall].bindInfoWindow('<p style="color:#000000"; text-align:left>' +
                                    document.getElementById('rx_log_call' + iCall).innerHTML + 
                                    ' de ' + 
                                    document.getElementById('tx_log_call' + iCall).innerHTML + 
                                    '<br>' + 
                                    document.getElementById('q_date' + iCall).innerHTML + 
                                    ' ' +
                                    document.getElementById('q_time' + iCall).innerHTML + 
                                    '<br>frequency: ' + 
                                    document.getElementById('q_freq' + iCall).innerHTML + ' kHz' +
                                    '</p>');
    map.addOverlay(arxMarker[iCall]);
  }

  //Create the new polyline
  if(rxPos == 1 && txPos == 1){
    acallPoly[iCall] = new GPolyline(new Array(tx_latlng, rx_latlng),  "#ff0000",  5);
    map.addOverlay(acallPoly[iCall]);
  }
  
  //Pan the map to the transmit station
   //Create the new polyline
  if(rxPos == 1 && txPos == 1){
   map.panTo(tx_latlng);
  }
  
}



function map_call( iCall ){
  //Get the necessary information from the call's row
  var tx_lat = document.getElementById('tx_lat').value;
  var tx_lng = document.getElementById('tx_lng').value;
  var rx_lat = document.getElementById('rx_lat').value;
  var rx_lng = document.getElementById('rx_lng').value;
  var txPos = 0;
  var rxPos = 0;
  //iCall = 0;
  //if the checkbox is checked, continue.  Otherwise, clear the call route
  //if(!document.getElementById('callmap'+iCall).checked){
  //  clear_map(iCall);
  //  return;
  //}
  
  //Set the values of tx_latlng and rx_latlng
  //alert('test ' + tx_lat);
  if(tx_lat != 9000){
    tx_latlng = new GLatLng(tx_lat, tx_lng);
    txPos = 1;
  }
  if(rx_lat != 9000){
    rx_latlng = new GLatLng(rx_lat, rx_lng);
    rxPos = 1;
  }
  
  //alert('Created tx_latlng ' + tx_latlng.lat() + ' ' + tx_latlng.lng());
  
  //Set the values of db_tx_address and db_rx_address
  //db_tx_addr = document.getElementById('tx_log_call'+iCall).innerHTML;
  //db_rx_addr = document.getElementById('rx_log_call'+iCall).innerHTML;
  //alert('Created addresses ' + db_tx_addr + ' ' + db_rx_addr);
  



  //Call the marker drawing functions
  if(txPos == 1 && rxPos == 1){
    //alert('tx address is ' + db_tx_addr);
    atxMarker[iCall] = new GMarker(tx_latlng);
    atxMarker[iCall].bindInfoWindow('<p style="color:#000000"; text-align:left>' + tx_mirror_call + 
                                    ' de ' + rx_mirror_call + '<br>' + mirror_call_date + ' ' +
                                    mirror_call_time + '<br>frequency: ' + call_freq + ' kHz' +
                                    '</p>');
    map.addOverlay(atxMarker[iCall]);
  }

  if(txPos == 1 && rxPos == 1){
    //alert('rx address is ' + db_rx_addr);
    arxMarker[iCall] = new GMarker(rx_latlng);
    arxMarker[iCall].bindInfoWindow('<p style="color:#000000"; text-align:left>' + rx_mirror_call + 
                                    ' de ' + tx_mirror_call + '<br>' + mirror_call_date + ' ' +
                                    mirror_call_time + '<br>frequency: ' + call_freq + ' kHz' +
                                    '</p>');
    map.addOverlay(arxMarker[iCall]);
     distance = tx_latlng.distanceFrom(rx_latlng);
     displayDistance();
  }

  //Create the new polyline
  if(txPos == 1 && rxPos == 1){
    acallPoly[iCall] = new GPolyline(new Array(tx_latlng, rx_latlng),  "#F90050",  5);
    map.addOverlay(acallPoly[iCall]);
    
    get_short_map();
    
    calls_mapped += 1;
  }
  
  //Pan the map to the transmit station
   //Create the new polyline
  if(rxPos == 1 && txPos == 1){
   map.panTo(tx_latlng);
  }
  
}

function clear_map( iCall ){
  if(arxMarker[iCall] != null){
      map.removeOverlay(arxMarker[iCall]);
      arxMarker[iCall] = null;
  }
  if(atxMarker[iCall] != null){
      map.removeOverlay(atxMarker[iCall]);
      atxMarker[iCall] = null;
  }
  if(acallPoly[iCall] != null){
      map.removeOverlay(acallPoly[iCall]);
      acallPoly[iCall] = null;
  }
}

function clear_all_map(){
  calls_mapped = 0;
  for(var mapin = 0; mapin < 25; mapin += 1){
    clear_map(mapin);
  }
}

var scontrol_toggle = 0;
function hideSControlNew(){
  if(scontrol_toggle%2 == 0){
  document.getElementById('scontrol_hide').innerHTML =
    '<small><a href="#" onclick="hideSControlNew()">Hide Search Specification Panel...</a></small>';
    Effect.BlindDown('scontrol_panel');
    scontrol_toggle += 1;  
    return false;
  }
  else{
  document.getElementById('scontrol_hide').innerHTML =
    '<small><a href="#" onclick="hideSControlNew()">Search Specification Panel...</a></small>';
    scontrol_toggle += 1;  
    $('scontrol_panel').hide();
    return false;
  }  

}

var search_toggle = 0;
function hideSearchNew(){
  if(search_toggle%2 == 0){
  document.getElementById('search_hide').innerHTML =
    '<small><a href="#" onclick="hideSearchNew()">Hide Search Panel...</a></small>';
    Effect.BlindDown('logtable');
    search_toggle += 1;  
    return false;
  }
  else{
  document.getElementById('search_hide').innerHTML =
    '<small><a href="#" onclick="hideSearchNew()">Search Panel...</a></small>';
    search_toggle += 1;  
    $('logtable').hide();
    return false;
  }  
}

function hideMessageNew(){
  if(message_toggle%2 == 0){
  document.getElementById('message_hide').innerHTML =
    '<small><a href="#" onclick="hideMessageNew()">Hide Messages...</a></small>';
    Effect.BlindDown('message_panel');
    message_toggle += 1;  
    return false;
  }
  else{
  document.getElementById('message_hide').innerHTML =
    '<small><a href="#" onclick="hideMessageNew()">Messages...</a></small>';
    message_toggle += 1;  
    $('message_panel').hide();
    return false;
  }  
}

function hideControlNew(){
  if(control_toggle%2 == 1){
  document.getElementById('logger_hide').innerHTML =
    '<small><a href="#" onclick="hideControlNew()">Hide Logger...</a></small>';
    Effect.BlindDown('cf_control_panel');
    control_toggle += 1;  
    return false;
  }
  else{
  document.getElementById('logger_hide').innerHTML =
    '<small><a href="#" onclick="hideControlNew()">Logger...</a></small>';
    control_toggle += 1;  
    $('cf_control_panel').hide();
    return false;
  }  
}

function hideControl(){
  if(control_toggle%2 == 0){
    control_html = document.getElementById('cf_control_panel').innerHTML;
    //Get control values
    hide_id_call_sign = document.getElementById('id_call_sign').value;
    hide_id_rx_call_sign = document.getElementById('id_rx_call_sign').value;
    //hide_fieldid = document.getElementById('fieldid').value;
    hide_time = document.getElementById('time').value;
    hide_frequency = document.getElementById('frequency').value;
    hide_power = document.getElementById('id_tx_power').value;
    hide_rx_lat = document.getElementById('rx_lat').value;
    hide_rx_lng = document.getElementById('rx_lng').value;
    hide_tx_lat = document.getElementById('tx_lat').value;
    hide_tx_lng = document.getElementById('tx_lng').value;
    hide_my_user = document.getElementById('my_user').value;
    document.getElementById('cf_control_panel').innerHTML = 
           '<div><tr><td><small><a href="#" onclick="hideControl()">Logger...</a></small></td>' +
           '<td align="right"><small>?</small></td></tr></div>';
  }
  else{
    document.getElementById('cf_control_panel').innerHTML = control_html;
    //Set control values
     //document.getElementById('id_call_sign').value = hide_id_call_sign;
     //document.getElementById('id_rx_call_sign').value = hide_id_rx_call_sign;
     //document.getElementById('time').value = hide_time;
     //document.getElementById('frequency').value = hide_frequency;
     //document.getElementById('id_tx_power').value = hide_power;
     //document.getElementById('rx_lat').value = hide_rx_lat;
     //document.getElementById('rx_lng').value = hide_rx_lng;
     //document.getElementById('tx_lat').value = hide_tx_lat;
     //document.getElementById('tx_lng').value = hide_tx_lng;
     //document.getElementById('my_user').value = hide_my_user;
     //re-establish the date chooser
  }
  control_toggle += 1;
}

function logIt(){
   //alert('Setting up request');
   if(!checkContact()){
     alert('Bad contact format');
     return;
   }
   //Remove all mapped calls before indices change
   clear_all_map();
   
   var url = "/dxslogentry?my_user=" + encodeURIComponent(document.getElementById('my_user').value) +
             "&id_call_sign=" + encodeURIComponent((document.getElementById('id_call_sign').value).toUpperCase()) +
             "&id_rx_call_sign=" + encodeURIComponent((document.getElementById('id_rx_call_sign').value).toUpperCase()) +
             "&field_id=" + encodeURIComponent(document.getElementById('fieldid').value) +
             "&time=" + encodeURIComponent(document.getElementById('time').value) +
             "&tx_lat=" + encodeURIComponent(document.getElementById('tx_lat').value) +
             "&tx_lng=" + encodeURIComponent(document.getElementById('tx_lng').value) +
             "&rx_lat=" + encodeURIComponent(document.getElementById('rx_lat').value) +
             "&rx_lng=" + encodeURIComponent(document.getElementById('rx_lng').value) +
             "&frequency=" + encodeURIComponent(document.getElementById('frequency').value) +
             "&id_tx_power=" + encodeURIComponent(document.getElementById('id_tx_power').value) +
             "&rst=" + encodeURIComponent(document.getElementById('rst').value) +
             "&rxrst=" + encodeURIComponent(document.getElementById('rxrst').value) +
             "&mode=" + encodeURIComponent(document.getElementById('mode').value) + 
             "&cf_distance=" + encodeURIComponent(document.getElementById('cf_distance').value) +
             "&band=" + encodeURIComponent(getBand(document.getElementById('frequency').value));
   //alert('url is ' + url);
   if (typeof XMLHttpRequest != "undefined") {
       req = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   }
   //alert('logit posting ' + url);
   req.open("POST", url, true);
   req.onreadystatechange = entrytable_callback;
   req.send(null);
   //alert('Request Sent logit');
   

}

var mirror_count = 0;
var mirror_offset = 0;
var call_freq = 0;
var mirror_call_time = '00:00';
var mirror_call_date = '';
var logged = 0;
var tx_mirror_call = '';
var rx_mirror_call = '';
var cStuff;
var rx_quick = 0;
var tx_quick = 0;
var mirror_done = 0;
var last_tx_call = '';
var last_rx_call = '';
var last_time = '';
var check_tx_call = '';
var check_rx_call = '';
var check_time = '';
var first_call = 0;
var lookaside_count = 0;
var kill = 0;

function entrytable_callback(){
    if (req.readyState == 4) {
        if (req.status == 200) {
              //alert('Entered et_cb with ' + req.responseText);
              document.getElementById('logtable').innerHTML = req.responseText;
              clear_all_map();
              toggleTab(3,3)
        }
        else{
          alert('Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }
        
}

var g_rx = '';
var g_tx = '';
function processcStuff(){
          rx_quick = 0;
          tx_quick = 0;
          logged = 0;
          mirror_done = 0;
          db_tx_addr = '';
          db_rx_addr = '';
          tx_mirror_call = '';
          rx_mirror_call = '';
          //alert('cStuff ' + cStuff);
          mirror_count = cStuff.length;
          //alert('mirror_count ' + mirror_count + ' mirror_offset ' + mirror_offset);
          
          //If 10 calls have been mapped, then quit
          if(calls_mapped == 10){
            return;
          }
          if(mirror_count - mirror_offset > 4 ){
            //Set the frequency
            call_freq = cStuff[mirror_offset+1];
            
            //Set the time and date
            var ctHours = parseInt(cStuff[mirror_offset+3].slice(0,2));
            mirror_call_time = cStuff[mirror_offset+3].slice(0,2) + ':' + 
                        cStuff[mirror_offset+3].slice(2,4);
            //Setup GMT time
            var hereDate = new Date();
            var ctDay = hereDate.getUTCDate();
            var ctMonth = hereDate.getUTCMonth() + 1;
            //alert('day ' + ctDay + ' month ' + ctMonth);	
            var dayPad = ''
            if(ctDay < 10){
              dayPad = '0';
            }
            var monthPad = ''
            if(ctMonth < 10){
              monthPad = '0';
            }
            var ctYear = hereDate.getUTCFullYear();

            mirror_call_date = monthPad + ctMonth + '/' + dayPad + ctDay + '/' + 
                        ctYear;
            //alert('Date is ' + mirror_call_date);
            
            tx_mirror_call = cStuff[mirror_offset];
            rx_mirror_call = cStuff[mirror_offset + 2];
            g_tx = tx_mirror_call;
            g_rx = rx_mirror_call;
            if(first_call == 0){
              last_tx_call = tx_mirror_call;
              last_rx_call = rx_mirror_call;
              last_time = mirror_call_time;
              first_call = 1;
            }
            
            //If the check call from the last iteration is the same as
            //the just found call, then do nothing, quit, and wait for the 
            //next update
            //alert('Comparing ' + tx_mirror_call + ' and ' + rx_mirror_call + 
            //      '\n to ' + check_tx_call + ' and ' + check_rx_call);
            if(tx_mirror_call == check_tx_call && 
               rx_mirror_call == check_rx_call && 
               mirror_call_time == check_time){
              //Update the new check values
              dmessage('Found ' + check_tx_call + ' ' + check_rx_call + ' again ' +
                    'waiting to call again ');
              check_tx_call = last_tx_call;
              check_rx_call = last_rx_call;
              check_time = last_time;
              
              //Setup the process to start again in one minute
              //dmessage('Done in processcstuff waiting one minute');
              //setTimeout("startcall()", 60000);
              
              //end
              catchup();
              return;
            }
               
            //alert(cStuff[mirror_offset] + ' ' + cStuff[mirror_offset+2] + ' ' + 
            //      call_freq + ' ' + call_time + ' ' + cStuff[mirror_offset+3]);
            //Get location for tx
          //document.getElementById('id_rx_callsign_display').innerHTML = '<div style="text-align:center"><b>Processed ' + 
           //             mirror_offset/4 + ' calls using ' + lookaside_count + ' lookasides</b>'+
           //             '<br>Comparing ' + tx_mirror_call + ' and ' + rx_mirror_call + 
           //             '<br> to ' + check_tx_call + ' and ' + check_rx_call +
           //             '</div>';
            getcall(tx_mirror_call);
            //Get location for rx
            //Call this once tx succeeds
            //getcall_rx(rx_mirror_call);
            //Done.  When tx and rx are finished, they will call
            //this function again
          
          }else{
          //DONE
              check_tx_call = last_tx_call;
              check_rx_call = last_rx_call;
              check_time = last_time;
              //dmessage('Worked thhough the list, waiting one minute');
              //Setup the process to start again in one minute
              //setTimeout("startcall()", 60000);
              catchup();
          }          
  mirror_offset += 4;

}

function catchup(){
              //alert('About to check for stored mapping ' + calls_mapped);
              if(calls_mapped != 10){
                var map_start = calls_mapped + 1;
                //alert('Starting stored mapping ' + calls_mapped + ' ' + newqs.length);
                //var all_qso = qsls.split('!');
                for(var idone = 1; calls_mapped != 10 && idone < newqs.length; idone += 1){
                  //alert('mapping ' + idone + ' storing in ' + (parseInt(map_start) + parseInt(idone)));
                  //Load up the contact details
                  var new_qso = newqs[idone].split('|');
                  tx_mirror_call = new_qso[0];
                  rx_mirror_call = new_qso[1];
                  document.getElementById('tx_lat').value = new_qso[7];
                  document.getElementById('tx_lng').value = new_qso[8];
                  document.getElementById('rx_lat').value = new_qso[5];
                  document.getElementById('rx_lng').value = new_qso[6];
                  mirror_call_date = new_qso[2];
                  mirror_call_time = new_qso[3];
                  call_freq = new_qso[4];
                  call_distance = new_qso[9];
                  
                  //Call map_call(parseInt(map_start) + idone)
                  map_call(calls_mapped);
                } 
              }

}

function checkContact(){
  //Set the user value
  //alert('user is ' + get_login_user());
  document.getElementById('my_user').value = login_user;
  logOK = true;
  
  //Check the date format
  if(!validateUSDate(document.getElementById('fieldid').value)){
    alert('Date must be in format mm/dd/yyyy');
    logOK = false;
  }
  
  //Check the time format
  if(!validateTime(document.getElementById('time').value)){
    //alert('Time must be in format hh:mm');
    logOK = false;
  }
  //alert('About to return check value');
  return logOK;
}
                      
function  logtable_callback(){
    if (req.readyState == 4) {
        if (req.status == 200) {
            // update the HTML DOM based on whether or not message is valid
            alert('Called back for logtable ' + req.responseText);
              //document.getElementById('logtable').innerHTML = req.responseText;
        } else{
          //alert('Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }

}


function uiSetup(){
  //alert('Entered uiSetup');
  var rxTopDiv = document.getElementById('rx_cs');
  var txTopDiv = document.getElementById('tx_cs');
  var txpwDiv = document.getElementById('txpw');
  var txGetCall = document.getElementById('getcall');
  var rxGetCall = document.getElementById('rx_getcall');
  var prefs = new _IG_Prefs();
  
  var rx_html = "<b>";
  rx_html += prefs.getMsg("receivecallsign");
  //rx_html += 'Receive Callsign';
  rx_html += "</b>";
  rxTopDiv.innerHTML = rx_html;

  var tx_html = "<b>";
  tx_html += prefs.getMsg("transmitcallsign");
  //tx_html += 'Transmit CAllsign';
  tx_html += "</b>";
  txTopDiv.innerHTML = tx_html;
  
  txGetCall.value = prefs.getMsg("locate");
  rxGetCall.value = prefs.getMsg("locate");
  
  var txpw_html = prefs.getMsg("tx_pwr_in_watts");
  //var txpw_Html = 'INput Power';
  txpw_html += inputWatts;
  txpwDiv.innerHTML = txpw_html;
  
  distanceSt = prefs.getMsg("distance");
  MilesPerWattSt  = prefs.getMsg("miles_per_watt");
  KmsPerWattSt  = prefs.getMsg("kilometers_per_watt");
  alrightSt = prefs.getMsg("alright");
  unmappableSt = prefs.getMsg("unmappable");
  plsformatSt = prefs.getMsg("plsformat");
  testSt = prefs.getMsg("test");
  submitSt = prefs.getMsg("submit");
  plsformatlabSt = prefs.getMsg("plsformatlab");

  //alert('Exited uiSetup');

}

//_IG_FetchContent('http://www.arrl.org/fcc/fcclook.php3?call=kd0fnr&=Submit+Query', receive_call);
  
  function donate(){
    //alert('Donate!');
    //ga.reportPageview('/view/qslMapGadget/donate');
    var donateText = [];
    donateText.push('Keep the Gadgets Coming! <span style="cursor:pointer" onclick="close_donate()"><small>+close</small></span><form action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="1640222"><input type="image" src="https://www.paypal.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt=""><img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1"></form>');
    donateText.push('');
    document.getElementById('id_donate').innerHTML = donateText.join('');
  }
  
  function close_donate(){
    var donateText = [];
    document.getElementById('id_donate').innerHTML = '<span style="cursor:pointer" onclick="donate()"><small>+donate</small></span>';
  }
  
  var rx_address;
  var tx_address;
  //Called second after the Log It! button is pused this will receive the information 
  //from dxslocation on the python side
  function receive_call(){
    ////dmessage('Entering receive_call ');
    if (req.readyState == 4) {
        if (req.status == 200) {
        //dmessage('Entered receive_call with ');
            // update the HTML DOM based on whether or not message is valid
              //alert('Called back for receive_call ' + req.responseText);
              var responseText = req.responseText;
    //////////////////////////////////////////////////////////////////////////
    //Actual work starts here
    //////////////////////////////////////////////////////////////////////////
    clearTimeout(timer);
    //Formatting data that may have come in from an external site
    //alert(responseText);
    stripped = responseText.replace(/\r\n/g, "");
    stripped = stripped.replace(/\n/g, "");
    stripped = stripped.replace(/\r/g, "");
    stripped = stripped.replace(/\t/g, " ");
    //Look for a familiar pattern from an external site
    //myregexp = /style7.*\"\>(.*)\<\/h1.*\<h4\>(.*)\<\/h4\>.*r\"\>(.*)\<\/td.*r\"\>(.*)\<\/div.*r\"\>(.*)\<\/div/;
    myregexp = /style7.*\"\>([^\<]*?)\<\/h1.*\<h4\>(.*)\<\/h4\>.*?r\"\>([^\<]*?)\<\/td.*?r\"\>([^\<]*?)\<\/div.*?r\"\>([^\<]*?)\<\/div/;

    //var myregexp = /csig.*\"\>*([^\<]*)\<\/b\> *\<\/p\> *\<p\>([^\<]*)\<\/p\> *\<p\>([^\<]*)\<\/p\> *\<p\>([^\<]*)\<\/p\> *\<p\>([^\<]*)\<\/p\>/;
    var mymatch = null;
    mymatch = myregexp.exec(stripped);
    var sa = '';
    //If the address isn't from external
    var fexternal = true;
    if(mymatch == null){
      fexternal = false;
      mymatch = stripped.split('<br>');
        //If the address was not correctly formated in the database
        if(mymatch.length != 7){
          //alert(tx_mirror_call + ' not found correctly ' + stripped);
          //mark the callsign as no address, incrment, and exit
          //but, leave an address to store
          db_tx_addr = tx_mirror_call + '<br>' + 'none' + '<br>' + 'none' + 
                         '<br>' + 'none' + '<br>' + 'none' + '<br>';
          document.getElementById('tx_lat').value = '9000';
          document.getElementById('tx_lng').value = '9000';
          document.getElementById('id_callsign_display').innerHTML = 'Address not found';
          //logged += 1;
          //Call the rx callsign
          //dmessage('no tx addr calling getcall_rx' + stripped);
          //alert('no tx addr calling getcall ' + tx_mirror_call);
          getcall_rx(rx_mirror_call);
          //if(logged == 2){
          //  storeCall();
          //}
          log_locations();
          return;
        //Callsign found in database check for correct location format
        //Otherwise, skip this and find the loctaion
        //The actual physical latitude and longitue are found in the database 
        }else if((mymatch[5] < 1000) &&
                 (mymatch[6] < 1000)){
          //Dig the address and location out and use them
          if(mymatch[5] == 9000 && mymatch[6] == 9000){
            //alert('Found lost callsign ' + tx_mirror_call);
          }
          //alert('Found quick tx 0 ' + mymatch[0] + ' 1 ' + mymatch[1] + ' 2 ' + mymatch[2] + ' 3 ' + mymatch[3] + ' 4 ' + mymatch[4] + ' 5 ' + mymatch[5] + ' 6 ' + mymatch[6]);
          db_tx_addr = mymatch[0] + '<br>' + mymatch[1] + '<br>' + mymatch[2] + 
                         '<br>' + mymatch[3] + '<br>' + mymatch[4] + '<br>';
          tx_addr = mymatch[2] + ',' + mymatch[3] + ',' + mymatch[4];
          document.getElementById('tx_lat').value = mymatch[5];
          document.getElementById('tx_lng').value = mymatch[6];
          document.getElementById('id_callsign_display').innerHTML = db_tx_addr;
          //logged += 1;
          tx_quick = 1;
          //Call the rx callsign
          //dmessage('tx quick addr calling getcall_rx');
          
          //Called third to get the address of the receiving station
          //Lands in receive_call_rx
          getcall_rx(rx_mirror_call);
          
          lookaside_count += 1;
          //if(logged == 2){
          //  storeCall();
          //}
          return;
        }else if(mymatch[5] == 9000){
          //The location was not known in the db fall thorugh to geolocate the location 
            //The location was not known in the db fall thorugh to geolocate the location 
            document.getElementById('id_callsign_display').innerHTML = 'Address not found';
            document.getElementById('id_rx_callsign_display').innerHTML = '';
            
            return;        

        }      
    }
    //The call was found externally
    //alert('About to merge address');
    //db_tx_addr = mymatch[1] + '<br>' + mymatch[2] + '<br>' + mymatch[3] + '<br>' + mymatch[4] + '<br>' + mymatch[5] + '<br>';
    db_tx_addr = '';
    var ind_start = 1;
    if(!fexternal){
      ind_start = 0;
    }
    for(var tx_m_cnt = ind_start; tx_m_cnt < 5 + ind_start; tx_m_cnt += 1){
      db_tx_addr += getmatch(mymatch[tx_m_cnt]);
      db_tx_addr += '<br>';
    }
    //Track found calls for now
    document.getElementById('id_callsign_display').innerHTML = db_tx_addr;
    if(mymatch.length == 7){
      //alert('Found ' + tx_mirror_call + ' internally');
      //alert(mymatch[0] + ' ' + mymatch[1] + ' ' + mymatch[2] + ' ' + mymatch[3] + ' ' + mymatch[4] + ' ' + mymatch[5] + ' ' + mymatch[6]);
      lookaside_count += 1;
    }
    //document.getElementById('id_callsign_display').innerHTML = '';
  
  tx_addr = mymatch[2 + ind_start] + ',' + mymatch[3 + ind_start] + ',' + mymatch[4 + ind_start];
  //showAddress("2143 Spruce St, Boulder, CO 80302");
  sa = mymatch[3 + ind_start] + ' ' +  mymatch[4 + ind_start];
  //alert('show ' + sa);
  //dmessage('receive_call calling showAddress');
  showAddress(sa);
  } else{
    //alert('real deal failed ' + req.status);
    }
  }
////////////////////////////////////////////////////////////////////////////////

              //document.getElementById('logtable').innerHTML = req.responseText;
   //alert('Exited real deal');
  }
  
function getmatch(mystr){
    if(mystr == null || mystr == ''){
      return 'none';
    }else{
      //alert(mystr);
      return mystr;
    }
  }

var calls_mapped = 0;

  function startcall(){
    if(kill == 1){
      return;
    }
    //Get the 20 most recent calls then do everything else
    if(recent == true){
      //alert('Getting last 20');
      recent = false;
      
      var call_url = '/lastdxs';
      if (typeof XMLHttpRequest != "undefined") {
          req = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
          req = new ActiveXObject("Microsoft.XMLHTTP");
      }
      req.open("GET", call_url, true);
      req.onreadystatechange = most_recent;
      req.send(null);
      return;
      //alert('Request Sent');
    }
      
    var call_url = '/dxsget';
    //alert(call_sign);
    //document.getElementById('id_callsign_display').innerHTML = '<div style="text-align:center"><b>Loading...</b></div>';
    //_IG_FetchContent(call_url, receive_call);
   //alert('Setting up request');
   if (typeof XMLHttpRequest != "undefined") {
       req = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   }
   req.open("GET", call_url, true);
   req.onreadystatechange = entrytable_callback;
   req.send(null);
   //alert('Request Sent');
  
  }
  
  
  function most_recent(){
    if (req.readyState == 4) {
      if (req.status == 200) {
        most_recent_exec(req.responseText);
      }
      else{
          //alert('Reqeust failed ' + req.status + ' ' + req.responseText);
      }
    }
  }
  
  function most_recent_exec( resp ){
    //Get the calls
    //alert('Loading recent');
    qsls = resp.split('!');
    newqs = resp.split('!');
    //alert(qsls.length + ' qsls');
    
    var qd = qsls[0].split('|');
    //Setup the comparison value
    check_tx_call = qd[0];
    check_rx_call = qd[1];
    //alert('tx to check ' + check_tx_call + ' rx to check ' + check_rx_call);
    //call startcall again
    startcall();
  }
  
  var timer;
  
  //Called first in the chain of calls to get user locations
  function getcall( callsign ){
    var call_sign = callsign;
    var call_url = '/dxslocation?callsign=' + call_sign;
    //dmessage('Entered getcall');
    //alert(call_sign);
    //document.getElementById('id_callsign_display').innerHTML = '<div style="text-align:center"><b>Loading...</b></div>';
   //alert('Setting up request');
   if (typeof XMLHttpRequest != "undefined") {
       req = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   }
   req.open("GET", call_url, true);
   req.onreadystatechange = receive_call;
   req.send(null);
   timer = setTimeout("call_timed_out()",10000);
   //dmessage('Exiting getcall');
   //alert('Request Sent');
  
  }
  
function call_timed_out(){
  req.abort();
  //alert('Timed out with ' + tx_mirror_call + ' and ' + rx_mirror_call + ' skipping');
  //processcStuff();
}

function call_timed_out_rx(){
  reqcs.abort();
  //alert('Timed out with ' + tx_mirror_call + ' and ' + rx_mirror_call + ' skipping');
  //processcStuff();
}


function dmessage(mString){
  //document.getElementById('id_callsign_display').innerHTML = mString;
}

var ready_to_store = 0;

    
  function receive_call_rx(){
    if (reqcs.readyState == 4) {
        if (reqcs.status == 200) {
    //Clear the timer
    clearTimeout(timer);
    //dmessage('Called address reception_rx ' + req.readyState + ' ' + req.status);
    responseText = reqcs.responseText;
    stripped = responseText.replace(/\r\n/g, "");
    stripped = stripped.replace(/\n/g, "");
    stripped = stripped.replace(/\r/g, "");
    stripped = stripped.replace(/\t/g, " ");

    //myregexp = /style7.*\"\>(.*)\<\/h1.*\<h4\>(.*)\<\/h4\>.*r\"\>(.*)\<\/td.*r\"\>(.*)\<\/div.*r\"\>(.*)\<\/div/;
    myregexp = /style7.*\"\>([^\<]*?)\<\/h1.*\<h4\>(.*)\<\/h4\>.*?r\"\>([^\<]*?)\<\/td.*?r\"\>([^\<]*?)\<\/div.*?r\"\>([^\<]*?)\<\/div/;
    //myregexp = /csig.*\"\>*([^\<]*)\<\/b\> *\<\/p\> *\<p\>([^\<]*)\<\/p\> *\<p\>([^\<]*)\<\/p\> *\<p\>([^\<]*)\<\/p\> *\<p\>([^\<]*)\<\/p\>/;
    //myregexp = /csig.*\"\>*([^\<]*)\<\/b\>\<\/p\> *\<p\>([^\<]*)\<\/p\> *\<p\>([^\<]*)\<\/p\> *\<p\>([^\<]*)\<\/p\> *\<p\>([^\<]*)\<\/p\>/;
    //alert('About to check regexp');
    mymatch = null;
    mymatch = myregexp.exec(stripped);
    //alert('Checked regexp for ' + stripped);
    var sa = '';
    var fexternal = true;
    if(mymatch == null){
      fexternal = false;
      mymatch = stripped.split('<br>');
        //alert('stripped is ' + stripped);
        //alert('mymatch.length is ' + mymatch.length);
        if(mymatch.length != 7){
          //mark the callsign as no address, incrment, and exit
          //alert('No location for ' + rx_mirror_call + ' in rcv_call_rx');
          rx_none = 'none';
          db_rx_addr = rx_mirror_call + '<br>' + 'none' + '<br>' + 'none' + 
                         '<br>' + 'none' + '<br>' + 'none' + '<br>';
          document.getElementById('rx_lat').value = '9000';
          document.getElementById('rx_lng').value = '9000';
          //Everything is sequential now
          //logged += 1;
          //if(logged == 2){
          //dmessage('rcall_rx no address calling storecall');
          //alert('rcall_rx no address calling storecall ' + rx_mirror_call);
            //storeCall();
          //}
        document.getElementById('id_rx_callsign_display').innerHTML = 'Address not found';
        //getProperAddressIntro_rx();
          log_locations();
          return;
        }else if((mymatch[5] < 1000) &&
                 (mymatch[6] < 1000)){
          dmessage('string ' + stripped + ' ' + mymatch.length);
          //Dig the address out and use it
          //alert('Found quick rx ' + mymatch[0]);
          db_rx_addr = mymatch[0] + '<br>' + mymatch[1] + '<br>' + mymatch[2] + 
                         '<br>' + mymatch[3] + '<br>' + mymatch[4] + '<br>';
          rx_addr = mymatch[2] + ',' + mymatch[3] + ',' + mymatch[4];
          document.getElementById('rx_lat').value = mymatch[5];
          document.getElementById('rx_lng').value = mymatch[6];
          //logged += 1;
          rx_quick = 1;
          //Everything is sequential now
          lookaside_count += 1;
          //if(logged == 2){
          //dmessage('rcall_rx quick address calling storecall');
          document.getElementById('id_rx_callsign_display').innerHTML = db_rx_addr;
            storeCall();
            ready_to_store = 0;
            log_locations();
            //alert('About to map call');
          //}
          return;
        }else if(mymatch[5] == 9000){
          //The location was not known in the db fall thorugh to geolocate the location 
        
        
        //The address wasn't found anywhere
        //document.getElementById('id_rx_callsign_display').innerHTML = 'Address not found';
        //getProperAddressIntro_rx();
        
        //There is nothing to map, so get out here
        //no location
        document.getElementById('id_rx_callsign_display').innerHTML = 'Address not found';
        
        return;        
        
        
        //return;        
        }
    }

    //db_rx_addr = mymatch[1] + '<br>' + mymatch[2] + '<br>' + mymatch[3] + '<br>' + mymatch[4] + '<br>' + mymatch[5] + '<br>';
    db_rx_addr = '';
    var ind_start = 1;
    if(!fexternal){
      ind_start = 0;
    }
    for(var rx_m_cnt = 0 + ind_start; rx_m_cnt < 5 + ind_start; rx_m_cnt += 1){
      db_rx_addr += getmatch(mymatch[rx_m_cnt]);
      db_rx_addr += '<br>';
    }
    document.getElementById('id_rx_callsign_display').innerHTML = db_rx_addr;
    //Track found calls for now
    if(mymatch.length == 7){
      //alert('rx Found ' + rx_mirror_call + ' internally');
      lookaside_count += 1;
    }
  
    rx_addr = mymatch[2 + ind_start] + ',' + mymatch[3 + ind_start] + ',' + mymatch[4 + ind_start];

    sa = mymatch[3 + ind_start] + ' ' +  mymatch[4 + ind_start];
    //alert('show_rx ' + sa);
    rx_address = sa;
    //dmessage('rcall_rx calling showAddress_rx');
    //alert('Found address on qrz');
    showAddress_rx(sa);
    } else{
    //alert('real deal failed ' + reqcs.status);
    }
  }
  }
    

  function getcall_rx( callsign ){
    //dmessage('Entered getcall_rx');
    var call_sign = callsign;
    //alert('Got callsign');

    var call_url = '/dxslocation?callsign=' + call_sign;
    //document.getElementById('id_rx_callsign_display').innerHTML = '<div style="text-align:center"><b>Loading...</b></div>';

   if (typeof XMLHttpRequest != "undefined") {
       reqcs = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       reqcs = new ActiveXObject("Microsoft.XMLHTTP");
   }
   //alert('About to send rx url ' + call_url);
   reqcs.open("GET", call_url, true);
   reqcs.onreadystatechange = receive_call_rx;
   reqcs.send(null);
   timer = setTimeout("call_timed_out_rx()",10000);
   
   //dmessage('Exit getcall_rx');
  }

    
    
var map;
  
  
var geocoder;
var rx_marker = null;
var tx_marker = null;
var rx_latlng = null;
var tx_latlng = null;
var call_poly = null;

function showAddress(address) {
 //dmessage('Entered showAddress ');
 geocoder = new GClientGeocoder();

   geocoder.getLatLng(address, setpoint);
   //geocoder.getLocations(address, LocTest);

 //alert('called geocoder');
 //alert('Exited showAddress');
}
  
function LocTest(response){
  //alert('Entered LocTest with ' + response.Status.code + ' addresses');
  
} 

function setpoint(latlng){
 if(latlng == null){
   //dmessage("setpoint address not found");
   //enterProperAddress_rx();
   getProperAddressIntro();
   return;
   //document.getElementById('tx_lat').value = '9000';
   //document.getElementById('tx_lng').value = '9000';
   //logged += 1;
 }
 else{
   //alert(latlng);
   //No mapping
   //just set the coordinates and return
   document.getElementById('tx_lat').value = latlng.lat();
   document.getElementById('tx_lng').value = latlng.lng();
   //logged += 1;
 }
//Call the rx callsign
//dmessage('setpoint calling getcall_rx');
getcall_rx(rx_mirror_call);

// if(logged == 2){
   //Call the routine to enter the contact in the database
//   storeCall(); 
// }
}
  
  function setUnit(){
    mikm = (mikm + 1)%2;
    displayDistance();
  }
  
  function displayDistance(){
    if(mikm == 0){
      var milesPerWatt = (distance/1609.344)/Number(document.getElementById('id_tx_power').value);
      document.getElementById('id_dist').innerHTML = distanceSt + ' = ' + Number(distance/1609.344).toFixed(2) + ' miles<br>' + MilesPerWattSt + ' = ' + milesPerWatt.toFixed(2) + '<input id="id_mikm" type="button" value="mi/km" onclick="setUnit()">';
    }
    else{
      var milesPerWatt = (distance/1000)/Number(document.getElementById('id_tx_power').value);
      document.getElementById('id_dist').innerHTML = distanceSt + ' = ' + Number(distance/1000).toFixed(2) + ' kilometers<br>' + KmsPerWattSt + ' = ' + milesPerWatt.toFixed(2) + '<input id="id_mikm" type="button" value="mi/km" onclick="setUnit()">';
    }      
    //Setup the form control to hold the distance
     document.getElementById('cf_distance').value = distance;
  }
  
  
  function setpoint_finish_rx(){
   both_points_in = both_points_in + 1;
 
   //Get distance between points
   if(tx_marker != null && rx_marker != null){
     distance = tx_latlng.distanceFrom(rx_latlng);
     displayDistance();
  
     //If there is already a polyline, erase it
     if(call_poly != null){
       map.removeOverlay(call_poly);
     }
     //Creat the new polyline
     call_poly = new GPolyline(new Array(tx_latlng, rx_latlng),  "#ff0000",  5);
     map.addOverlay(call_poly);
   }
   else{
     first_point = tx_latlng;
   }
  
  
  }

function showAddress_rx(address) {
 //alert('Entered showAddress');
 geocoder = new GClientGeocoder();

          //dmessage('going to setpoint_rx');

   geocoder.getLatLng(address, setpoint_rx);

 //alert('called geocoder');
 //alert('Exited showAddress');
}
  
function setpoint_rx(latlng){
 //dmessage('Entered setpoint');
 //If the address is not found, do not ask for corrections
 //this is on the fly, just set the coordinates to 9000 and return
 if(latlng == null){
   //alert("address not found");
   //enterProperAddress_rx();
   //document.getElementById('rx_lat').value = '9000';
   //document.getElementById('rx_lng').value = '9000';
   //enterProperAddress_rx();
   getProperAddressIntro_rx();
   return;
   //dmessage('sp_rx no location');
   //logged += 1;
 }
 else{
   //alert(latlng);
   //No mapping
   //just set the coordinates and return
   document.getElementById('rx_lat').value = latlng.lat();
   document.getElementById('rx_lng').value = latlng.lng();
   //map_call(calls_mapped);
   //logged += 1;
 }
 //Everyting is sequential now
 //if(logged == 2){
   //Call the routine to enter the contact in the database
   //dmessage('sp_rx calling storecall');
   //https://appengine.google.com/dashboard?&app_id=copaseticflows&version_id=1.344973694923615627();
            storeCall();
            ready_to_store = 0;
            log_locations();
    
 //}
    
}

function debug(){
             alert(document.getElementById('tx_lat').value + ' ' +
             document.getElementById('tx_lng').value + ' ' +
             document.getElementById('rx_lat').value + ' ' +
             document.getElementById('rx_lng').value + ' ');

}


var imapindex = 0;
var call_distance = 0;
function storeCall(){
   //Get the distance between points
   //dmessage('entered storecall');
   var call_distance = 0;
   if(document.getElementById('tx_lat').value != '9000' &&
      document.getElementById('tx_lng').value != '9000' &&
      document.getElementById('rx_lat').value != '9000' &&
      document.getElementById('rx_lng').value != '9000'){
      //map the call first
      map.setZoom(2)
      
      map_call(calls_mapped);
      //imapindex += 1;      
     var call_tx_latlng = 
              new GLatLng(parseFloat(document.getElementById('tx_lat').value),
                          parseFloat(document.getElementById('tx_lng').value));
     var call_rx_latlng = 
              new GLatLng(parseFloat(document.getElementById('rx_lat').value),
                          parseFloat(document.getElementById('rx_lng').value));
     call_distance = call_tx_latlng.distanceFrom(call_rx_latlng)/1000;
   }
     
   if(ready_to_store == 0){
     return;
   }else{
     ready_to_store = 0;
        document.getElementById('id_spot').disabled=true;
     
   }

   var url = "/dxslogentry?";
   var store_params = "my_user=" + encodeURIComponent('fbspot') +
             "&id_call_sign=" + encodeURIComponent(tx_mirror_call.toUpperCase()) +
             "&id_rx_call_sign=" + encodeURIComponent(rx_mirror_call.toUpperCase()) +
             "&field_id=" + encodeURIComponent(stspotDate) +
             "&time=" + encodeURIComponent(stspotTime) +
             "&tx_lat=" + encodeURIComponent(document.getElementById('tx_lat').value) +
             "&tx_lng=" + encodeURIComponent(document.getElementById('tx_lng').value) +
             "&rx_lat=" + encodeURIComponent(document.getElementById('rx_lat').value) +
             "&rx_lng=" + encodeURIComponent(document.getElementById('rx_lng').value) +
             "&rst=" + encodeURIComponent(document.getElementById('tx_rst').value) +
             "&rxrst=" + encodeURIComponent(document.getElementById('rx_rst').value) +
             "&frequency=" + encodeURIComponent(document.getElementById('frequency').value) +
             "&id_tx_power=" + encodeURIComponent(document.getElementById('id_tx_power').value) +
             "&cf_distance=" + encodeURIComponent(distance/1000) +
             "&mode=" + encodeURIComponent('UNK') +
             "&band=" + encodeURIComponent(getBand(document.getElementById('frequency').value));
   url += store_params;
   //alert('storeCall url is ' + url);
   if (typeof XMLHttpRequest != "undefined") {
       req = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   }


   //alert('storecall posting ' + url);


   req.open("POST", '/dxslogentry', true);
   req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   req.setRequestHeader("Content-length", store_params.length);
   req.setRequestHeader("Connection", "close");

   req.onreadystatechange = logged_call;
   req.send(store_params);

  //dmessage('storeCall does something');
}

function submit_rx_info(){
   //dmessage('entered submit_rx_info');
   var url = "/dxscall?callsign=" + encodeURIComponent(rx_mirror_call.toUpperCase()) +
             "&call_lat=" + encodeURIComponent(document.getElementById('rx_lat').value) +
             "&call_lng=" + encodeURIComponent(document.getElementById('rx_lng').value) +
             "&street_addr=" + encodeURIComponent(db_rx_addr);
   var sub_params = "callsign=" + encodeURIComponent(rx_mirror_call.toUpperCase()) +
             "&call_lat=" + encodeURIComponent(document.getElementById('rx_lat').value) +
             "&call_lng=" + encodeURIComponent(document.getElementById('rx_lng').value) +
             "&street_addr=" + encodeURIComponent(db_rx_addr);
   //alert('submitRX url is ' + sub_params);
   if (typeof XMLHttpRequest != "undefined") {
       req = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   }
   //alert('submit_rx_info posting ' + url);
   req.open("POST", '/dxscall', true);
   req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   req.setRequestHeader("Content-length", sub_params.length);
   req.setRequestHeader("Connection", "close");



   req.onreadystatechange = submit_rx_done;
   req.send(sub_params);
  //dmessage('subrxinfo does something');


}

function submit_rx_done(){
    if (req.readyState == 4) {
        if (req.status == 200) {
          //document.getElementById('logtable').innerHTML = req.responseText;
          //mirror_done += 1;
          //dmessage('Back from submit_rx');
          //if(mirror_done == 2){
            //alert('dxmirror all done at submit_rx_done');
            //check_tx_call = last_tx_call;
            //check_rx_call = last_rx_call;
            //check_time = last_time;
            //processcStuff();
            //return;
          //}else{
            //Check to see if tx info needs to be submitted
            //If the location information was submitted by the user, 
            //then remap the entire call
            if(remap == 1){
              remap = 0;
              map_qso();
              return;
            }  
            if(tx_quick == 0){
                //dmessage('Calling sb_tx from sb_rx_done');
                submit_tx_info();
                //tx_info will drive from here
                return;
            }
            //dmessage('submit_rx_done called processcStuff');
            //processcStuff();
          //}
        }
        else{
          //alert('Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }        
}

var remap = 0;
function submit_tx_done(){
    if (req.readyState == 4) {
        if (req.status == 200) {
          //document.getElementById('logtable').innerHTML = req.responseText;
          //dmessage('Back from submit_tx');
          //mirror_done += 1;
          //if(mirror_done == 2){
            //check_tx_call = last_tx_call;
            //check_rx_call = last_rx_call;
            //check_time = last_time;
            //dmessage('dxmirror all done at submit_tx_done');
            
            //If the location information was submitted by the user, 
            //then remap the entire call
            if(remap == 1){
              remap = 0;
              map_qso();
            }  
            //processcStuff();
          //}
        }
        else{
          //alert('Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }        
}

function submit_tx_info(){
   var url = "/dxscall?callsign=" + encodeURIComponent(tx_mirror_call.toUpperCase()) +
             "&call_lat=" + encodeURIComponent(document.getElementById('tx_lat').value) +
             "&call_lng=" + encodeURIComponent(document.getElementById('tx_lng').value) +
             "&street_addr=" + encodeURIComponent(db_tx_addr);
   var tx_params = "callsign=" + encodeURIComponent(tx_mirror_call.toUpperCase()) +
             "&call_lat=" + encodeURIComponent(document.getElementById('tx_lat').value) +
             "&call_lng=" + encodeURIComponent(document.getElementById('tx_lng').value) +
             "&street_addr=" + encodeURIComponent(db_tx_addr);
   //dmessage('submitTX url is ');
   if (typeof XMLHttpRequest != "undefined") {
       req = new XMLHttpRequest();
   } else if (window.ActiveXObject) {
       req = new ActiveXObject("Microsoft.XMLHTTP");
   }
   //alert('submit_tx_info posting ' + tx_params);
   
   
   req.open("POST", '/dxscall', true);
   req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   req.setRequestHeader("Content-length", tx_params.length);
   req.setRequestHeader("Connection", "close");
   req.onreadystatechange = submit_tx_done;
   req.send(tx_params);
   //dmessage('subtxinfo does something');




}

function log_locations(){
            if(rx_quick == 0){
              //dmessage('Calling sb_rx_info');
              submit_rx_info();
              //rx_info will drive from here
              return;
            } else{
              //mirror_done += 1;
            }
            if(tx_quick == 0){
              //dmessage('Calling sb_tx_info from logged_call');
              submit_tx_info();
              //tx_info will drive from here
              return;
            } else{
              //mirror_done += 1;
            }

}

function logged_call(){
    if (req.readyState == 4) {
        if (req.status == 200) {
            // update the HTML DOM based on whether or not message is valid
            //dmessage('Logged new mirror call');
            
            //If there is a facebook user, then publish an action about the QSO
            if(fb_present){
                FB.api(
                        '/me/qsomapper:log',
                        'post',
                        { qso: 'http://copaseticflows.appspot.com/fbapps/qsomapper?fbqso_obj=' + req.responseText },
                        function(response) {
                           if (!response || response.error) {
                              alert('Error occured');
                           } else {
                              //alert('Log was successful! Action ID: ' + response.id);
                           }
                        });
            }
            
            
            
            //Now send in the rx info if necessary
            if(rx_quick == 0){
              //dmessage('Calling sb_rx_info');
              submit_rx_info();
              //rx_info will drive from here
              return;
            } else{
              //mirror_done += 1;
            }
            if(tx_quick == 0){
              //dmessage('Calling sb_tx_info from logged_call');
              submit_tx_info();
              //tx_info will drive from here
              return;
            } else{
              showallqsos();
              //mirror_done += 1;
            }
            //if(mirror_done == 2){
              //check_tx_call = last_tx_call;
              //check_rx_call = last_rx_call;
              //check_time = last_time;
              //dmessage('All done with mirror at logged_call');
              //processcStuff();
            //}
        } else{
          //alert('Reqeust failed ' + req.status + ' ' + req.responseText);
        }
    }

}
  
  function setpoint_finish_rx(){
   //alert('in setpoint');
   both_points_in = both_points_in + 1;
 
   //Get distance between points
   if(tx_marker != null && rx_marker != null){
     distance = tx_latlng.distanceFrom(rx_latlng);
     displayDistance();
     //var milesPerWatt = (distance/1609.344)/Number(document.getElementById('id_tx_power').value);
     //document.getElementById('id_dist').innerHTML = 'Distance = ' + Number(distance/1609.344).toFixed(2) + 'miles<br>Miles Per Watt = ' + milesPerWatt.toFixed(2) + '<input id="id_mikm" type="button" value="mi/km" onclick="setunit()">';

     //If there is already a polyline, erase it
     if(call_poly != null){
       map.removeOverlay(call_poly);
     }
     //Creat the new polyline
     //alert('adding route');
     call_poly = new GPolyline(new Array(tx_latlng, rx_latlng),  "#ff0000",  5);
     map.addOverlay(call_poly);
   }
   else{
     first_point = rx_latlng;
   }
  
  
  }


//Address correction section
  function enterProperAddress(){
    //alert('Entered enterProperAddress');
    //First, find out if the callsign has been mapped already in the spreadsheet
    //if not, then perform getProperAddress from the query response function
    var query_qa = new google.visualization.Query('http://spreadsheets.google.com/pub?key=pvFXGB-79Kl2FK_YCoGmxfw&gid=0&pub=1'); 
    query_qa.setQuery('select B, C, D where B = "' + document.getElementById('id_call_sign').value.toLowerCase() + '"'); 
    query_qa.send(propAddrResp); 
    
  }
  
  function propAddrResp(response){
    //alert('Entered propAddrResp');
    if (response.isError()) {     
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());    
      return;
    }
    var dataTable = response.getDataTable();
    if(dataTable.getNumberOfRows() == 0){
      getProperAddressIntro();
    }
    else{
      //There may be more than one entry for this callsign, get the last one.
      var lastRow = dataTable.getNumberOfRows() - 1;
      var gGoodPoint = new GLatLng(dataTable.getValue(lastRow, 1),  dataTable.getValue(lastRow, 2));
      showAddress(gGoodPoint);
    }
  }
  
  function getProperAddress(){
    //alert('Entered getProperAddress');
    document.getElementById('id_callsign_display').innerHTML = ' ' +
        plsformatlabSt + '<small><a target="_blank" href="http://copaseticflow.blogspot.com/2003/03/qsl-mapper-address-re-formatting-help.html">help</a></small><br>' + 
        '<textarea id="id_prop_address" rows="4" cols="15">' + tx_addr + '</textarea>' + 
        '<input size="15" type="hidden" name="entry.1.single" value="KD0FNR" id="entry_1" >' +
        '<input size="15" type="hidden" name="entry.2.single" value="" id="entry_2" >' +
        '<input size="15" type="hidden" name="entry.3.single" value="" id="entry_3" >' +
        '<br><input id="getcall" type="button" value="' + testSt + '" onclick="clear_test_addr(); mapProperAddress()">' + 
      '<input type="button" onclick="clear_test_addr(); remap = 1; submit_tx_info();" value="' + submitSt + '">';
  
  
  }
  
  function continue_tx(){
      setTimeout("finish_continue_tx()",1250);
  }

  
  function finish_continue_tx(){
    //alert('Entered finish_continue_tx');
    document.getElementById('id_callsign_display').innerHTML = '';
    new_test = 0;
    setpoint_finish_tx();
  }
  
  
  function getProperAddressIntro(){
    document.getElementById('id_callsign_display').innerHTML = '<div style="width:100%; height:200px; border-width:medium; border-style:double; background-color:#93a2e4"> ' +
                                                               unmappableSt + ' ' + plsformatSt + '<small><a target="_blank" href="http://copaseticflow.blogspot.com/2003/03/qsl-mapper-address-re-formatting-help.html">help</a></small>' + 
                                                               '<input id="getcall" type="button" value="' + alrightSt + '" onclick="getProperAddress()">';
  
  
  }
  
  function mapProperAddress(){
    //alert('About to map with ' + document.getElementById('id_prop_address').value);
    showTestAddress(document.getElementById('id_prop_address').value);
  
  }
function showTestAddress(address) {
 //alert('Entered showAddress');
 geocoder = new GClientGeocoder();

   geocoder.getLatLng(address, setpoint_test);

 //alert('called geocoder');
 //alert('Exited showAddress');
}
  
function clear_test_addr(){
   if(rx_marker != null){
      map.removeOverlay(rx_marker);
      rx_marker = null;   
   }
   if(tx_marker != null){
      map.removeOverlay(tx_marker);
      tx_marker = null;   
   }

}
  
function setpoint_test(latlng){
 //alert('Entered setpoint');
 if(latlng == null){
   alert('address still not found');
 }
 else{
   //if(new_test == 0){
   //  new_test = 1;
   //}
   //else{
      //tx_marker.hide();
      //map.removeOverlay(tx_marker);   
   //}
   //Store the new point in the submission form
   document.getElementById('tx_lat').value = latlng.lat();
   document.getElementById('tx_lng').value = latlng.lng();
   //alert(latlng);
    //var point = new GLatLng(Number(mymatch[2]), Number(mymatch[1]));
    
    //var point = new GLatLng(37.42, -122);
   map.panTo(latlng);
   map.setZoom(3)
   //map.checkResize();
   if(tx_marker != null){
      map.removeOverlay(tx_marker);
      tx_marker = null;   
   }
    tx_marker = new GMarker(latlng);
    //tx_marker = marker;
    tx_marker.bindInfoWindow(db_tx_addr);
    tx_latlng = latlng;
    map.addOverlay(tx_marker);
 }
 //alert('Exited setpoint');
}  
  
//Address correction section
  function enterProperAddress_rx(){
    //alert('Entered enterProperAddress');
    //First, find out if the callsign has been mapped already in the spreadsheet
    //if not, then perform getProperAddress from the query response function
    var query_qa = new google.visualization.Query('http://spreadsheets.google.com/pub?key=pvFXGB-79Kl2FK_YCoGmxfw&gid=0&pub=1'); 
    query_qa.setQuery('select B, C, D where B = "' + document.getElementById('id_rx_call_sign').value.toLowerCase() + '"'); 
    query_qa.send(propAddrResp_rx); 
    
  }
  
  function propAddrResp_rx(response){
    //alert('Entered propAddrResp');
    if (response.isError()) {     
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());    
      return;
    }
    var dataTable = response.getDataTable();
    if(dataTable.getNumberOfRows() == 0){
      getProperAddressIntro_rx();
    }
    else{
      //There may be more than one entry for this callsign, get the last one.
      var lastRow = dataTable.getNumberOfRows() - 1;
      var gGoodPoint = new GLatLng(dataTable.getValue(lastRow, 1),  dataTable.getValue(lastRow, 2));
      showAddress_rx(gGoodPoint);
    }
  }
  
  function updateCorrectedRx(){
    document.getElementById('rx_lat').value = rx_latlng.lat();
    document.getElementById('rx_lng').value = rx_latlng.lng();
    return true;
  }
  
  function updateCorrectedTx(){
    document.getElementById('tx_lat').value = tx_latlng.lat();
    document.getElementById('tx_lng').value = tx_latlng.lng();
    return true;
  }
  
  //Change this so that it calls a function to store the address in the 
  //internal database, and not the spreadsheet
  function getProperAddress_rx(){
    //alert('Entered getProperAddress');
    document.getElementById('id_rx_callsign_display').innerHTML = ' ' +
      plsformatlabSt + '<small><a target="_blank" href="http://copaseticflow.blogspot.com/2003/03/qsl-mapper-address-re-formatting-help.html">help</a></small><br>' + 
      '<textarea id="id_prop_address_rx" rows="4" cols="15">' + rx_addr + '</textarea>' + 
      '<input size="15" type="hidden" name="entry.1.single" value="" id="entry_1" >' +
      '<input size="15" type="hidden" name="entry.2.single" value="" id="entry_2" >' +
      '<input size="15" type="hidden" name="entry.3.single" value="" id="entry_3" >' +
      '<br><input id="getcall" type="button" value="' + testSt + '" onclick="clear_test_addr(); mapProperAddress_rx()">' + 
      '<input type="button" onclick="clear_test_addr(); remap = 1; submit_rx_info();" value="' + submitSt + '">';
  
  
  }
  
  function continue_rx(){
    //alert('Entered continue_rx');
    setTimeout("finish_continue_rx()",1250);
  }
  
  function finish_continue_rx(){
    //alert('Entered finish_continue_rx');
    //document.getElementById('id_rx_callsign_display').innerHTML = '';
    new_test = 0;
    setpoint_finish_rx();
  }
  
  function getProperAddressIntro_rx(){
    document.getElementById('id_rx_callsign_display').innerHTML = '<div style="width:100%; height:200px; border-width:medium; border-style:double; background-color:#93a2e4"> ' +
                                                                unmappableSt + ' ' + plsformatSt + '<small><a target="_blank" href="http://copaseticflow.blogspot.com/2003/03/qsl-mapper-address-re-formatting-help.html">help</a></small>' + 
                                                               '<input id="corrcall_rx" type="button" value="' + alrightSt + '" onclick="getProperAddress_rx()">';
  
  
  }
  
  function mapProperAddress_rx(){
    //alert('About to map with ' + document.getElementById('id_prop_address_rx').value);
    showTestAddress_rx(document.getElementById('id_prop_address_rx').value);
  
  }
function showTestAddress_rx(address) {
 //alert('Entered showAddress');
 geocoder = new GClientGeocoder();

   geocoder.getLatLng(address, setpoint_rx_test);

 //alert('called geocoder');
 //alert('Exited showAddress');
}
  
function setpoint_rx_test(latlng){
 //alert('Entered setpoint');
 if(latlng == null){
 alert('address still not found');
 }
 else{
   document.getElementById('rx_lat').value = latlng.lat();
   document.getElementById('rx_lng').value = latlng.lng();
   //alert(latlng);
    //var point = new GLatLng(Number(mymatch[2]), Number(mymatch[1]));
    
    //var point = new GLatLng(37.42, -122);
   map.panTo(latlng);
   map.setZoom(3)
   //map.checkResize();
   if(rx_marker != null){
      map.removeOverlay(rx_marker);
      rx_marker = null;   
   }
    rx_marker = new GMarker(latlng);
    //rx_marker = marker;
    rx_marker.bindInfoWindow(db_rx_addr);
    rx_latlng = latlng;
    map.addOverlay(rx_marker);
 }
 //alert('Exited setpoint');
}  

function validateUSDate( strValue ) {
/************************************************
DESCRIPTION: Validates that a string contains only
    valid dates with 2 digit month, 2 digit day,
    4 digit year. Date separator can be ., -, or /.
    Uses combination of regular expressions and
    string parsing to validate date.
    Ex. mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy

PARAMETERS:
   strValue - String to be tested for validity

RETURNS:
   True if valid, otherwise false.

REMARKS:
   Avoids some of the limitations of the Date.parse()
   method such as the date separator character.
*************************************************/
  var objRegExp = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}$/
 
  //check to see if in correct format
  if(!objRegExp.test(strValue))
    return false; //doesn't match pattern, bad date
  else{
    var strSeparator = strValue.substring(2,3) 
    var arrayDate = strValue.split(strSeparator); 
    //create a lookup for months not equal to Feb.
    var arrayLookup = { '01' : 31,'03' : 31, 
                        '04' : 30,'05' : 31,
                        '06' : 30,'07' : 31,
                        '08' : 31,'09' : 30,
                        '10' : 31,'11' : 30,'12' : 31}
    var intDay = parseInt(arrayDate[1],10); 

    //check if month value and day value agree
    if(arrayLookup[arrayDate[0]] != null) {
      if(intDay <= arrayLookup[arrayDate[0]] && intDay != 0)
        return true; //found in lookup table, good date
    }
    
    //check for February (bugfix 20050322)
    //bugfix  for parseInt kevin
    //bugfix  biss year  O.Jp Voutat
    var intMonth = parseInt(arrayDate[0],10);
    if (intMonth == 2) { 
       var intYear = parseInt(arrayDate[2]);
       if (intDay > 0 && intDay < 29) {
           return true;
       }
       else if (intDay == 29) {
         if ((intYear % 4 == 0) && (intYear % 100 != 0) || 
             (intYear % 400 == 0)) {
              // year div by 4 and ((not div by 100) or div by 400) ->ok
             return true;
         }   
       }
    }
  }  
  return false; //any other values, bad date
}

 function validateTime( strValue ) {
  var errorMsg = "";
  // regular expression to match required time format
  re = /^(\d{1,2}):(\d{2})(:00)?([ap]m)?$/; 
  //alert(strValue);
  if(strValue != '') {
    if(regs = strValue.match(re)) {
      if(regs[4]) {
        // 12-hour time format with am/pm 
        if(regs[1] < 1 || regs[1] > 12) { 
          errorMsg = "Invalid value for hours: " + regs[1]; 
        }
      } else {
        // 24-hour time format 
        if(regs[1] > 23) { 
          errorMsg = "Invalid value for hours: " + regs[1];
        } 
      } 
      if(!errorMsg && regs[2] > 59) {
        errorMsg = "Invalid value for minutes: " + regs[2]; 
        } 
    } 
    else {
      errorMsg = "Invalid time format: " + strValue.value;
    } 
  } 
  if(errorMsg != "") { 
    alert(errorMsg); 
    return false; 
  } 
  return true;
}  

function qslonload(){
  alert('Page loaded');
}

//Place onload handlers here
function addLoadEvent(func) { 
	  var oldonload = window.onload; 
	  if (typeof window.onload != 'function') { 
	    window.onload = func; 
	  } else { 
	    window.onload = function() { 
	      if (oldonload) { 
	        oldonload(); 
	      } 
	      func(); 
	    } 
	  } 
	} 
	 
function getBand( freq ){
  if(freq < 137){
    return 'VLF';
  }
  if(freq < 1800){
    return '137';
  }
  if(freq < 3500){
    return '1.8';
  }
  if(freq < 5000){
    return '3.5';
  }
  if(freq < 7000){
    return '5';
  }
  if(freq < 10000){
    return '7';
  }
  if(freq < 14000){
    return '10';
  }
  if(freq < 18000){
    return '14';
  }
  if(freq < 21000){
    return '18';
  }
  if(freq < 24000){
    return '21';
  }
  if(freq < 28000){
    return '24';
  }
  if(freq < 50000){
    return '28';
  }
  if(freq < 70000){
    return '50';
  }
  if(freq < 144000){
    return '70';
  }
  if(freq < 220000){
    return '144';
  }
  if(freq < 430000){
    return '220';
  }
  if(freq < 1200000){
    return '430';
  }
  if(freq < 2300000){
    return '1200';
  }
  if(freq < 3400000){
    return '2300';
  }
  if(freq < 5600000){
    return '3400';
  }
  if(freq < 10000000){
    return '5600';
  }
  if(freq < 24000000){
    return '10000';
  }
  if(freq < 47000000){
    return '24000';
  }
  else{
    return '47000';
  }
}

init_map();
htoggleTab(4,5);
init_spot();
init_lang();
recent = true;

FB.init({appId: '145334095509460', status: true, cookie: true,
    xfbml: true});

         //Listen for the user to login and then customize
         FB.Event.subscribe('auth.login', function(response) {
           // do something with response
           fb_setup();
         });
         
         //If the user is already logged in and connected, then get rid of the login button
         FB.getLoginStatus(function(response) {
           if (response.authResponse) {
             // logged in and connected user, someone you know
             fb_setup();
             
           } else {
             // no user session available, someone you dont know
           }
         });
         
         var fb_present = false;
         function fb_setup(){
           FB.api('/me', function(user) {
             if(user != null) {
                document.getElementById('fblogin').innerHTML = '';
                //alert(user.name);
                var image = document.getElementById('fbimage');
                //image.src = 'http://graph.facebook.com/' + user.id + '/picture';
                image.innerHTML = '<img src="http://graph.facebook.com/' + user.id + '/picture' + '">'
                var name = document.getElementById('fbname');
                name.innerHTML = user.name
                login_user = user.id;
                fb_present = true;
                
                //test for found qso
                //alert('qso to ' + qsotest);
             }
           });
         }
