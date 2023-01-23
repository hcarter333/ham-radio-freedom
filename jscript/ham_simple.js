  
  var test_help;
  var test_type = 'T';
  
  var nz_header = 'New Zealand Amateur Radio Examination Practice (Question pool published March, 2010)';
  var t_header = 'Technician Class Amateur Radio Practice Exam (Question pool published 3/7/2022)';
  var g_header = 'General Class Amateur Radio Practice Exam (Question pool published 2/23/2007)';
  var gn_header = 'General Class Amateur Radio Practice Exam (Question pool effective 7/1/2011 - 6/30/2015)';
  var c1_header = 'Commercial License Element 1 Question pool';
  var c2_header = 'Commercial License Element 3 Question pool';
  var c5_header = 'Commercial License Element 5 Question pool';
  var c7_header = 'Commercial License Element 7 Question pool';
  var e_header = 'Extra Class Amateur Radio Practice Exam (Question pool published 7/1/2012)';
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

var ld_libs = '{% for lib in libs %}{{lib}}{% endfor %}';

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






var splitter = '!';
//init_groups();

function new_test2( new_test_type ){
  if(new_test_type == test_type){
    return;
  }
  subel_study_enable = false;
  new_test_b = true;
  //If there are scores to be saved, then save them.
  if(questions_answered > 0 && !scores_saved){
    log_scores();
  }
  if(new_test_type == 'T'){
    //Make the tech test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#888888"
    $('Gsel').style.backgroundColor = "#333333"
    $('GNsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#333333"
    $('NZsel').style.backgroundColor = "#333333"
    $('CBsel').style.backgroundColor = "#333333"
    $('CAsel').style.backgroundColor = "#333333"
	    $('C1sel').style.backgroundColor = "#333333"
    $('C2sel').style.backgroundColor = "#333333"
    $('C5sel').style.backgroundColor = "#333333"
        $('C7sel').style.backgroundColor = "#333333"
    //Add the subelement buttons
    add_subel_buttons();
  }
  else if(new_test_type == 'G'){
    //Make the general test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#333333"
    $('Gsel').style.backgroundColor = "#888888"
    $('GNsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#333333"
    $('NZsel').style.backgroundColor = "#333333"
    $('CBsel').style.backgroundColor = "#333333"
    $('CAsel').style.backgroundColor = "#333333"
	    $('C1sel').style.backgroundColor = "#333333"
	        $('C2sel').style.backgroundColor = "#333333"
       $('C5sel').style.backgroundColor = "#333333"
           $('C7sel').style.backgroundColor = "#333333"
        	    add_subel_buttons();
  }
  else if(new_test_type == 'GN'){
	    //Make the general test highlighted, clear the others
	    $('Tsel').style.backgroundColor = "#333333"
	    $('Gsel').style.backgroundColor = "#333333"
        $('GNsel').style.backgroundColor = "#888888"
	    $('Esel').style.backgroundColor = "#333333"
	    $('NZsel').style.backgroundColor = "#333333"
	    $('CBsel').style.backgroundColor = "#333333"
	    $('CAsel').style.backgroundColor = "#333333"
		    $('C1sel').style.backgroundColor = "#333333"
		        $('C2sel').style.backgroundColor = "#333333"
		            $('C5sel').style.backgroundColor = "#333333"
		                $('C7sel').style.backgroundColor = "#333333"
		                    add_subel_buttons();
	  }
  else if(new_test_type == 'E'){
    //Make the extra test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#333333"
    $('Gsel').style.backgroundColor = "#333333"
    $('GNsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#888888"
    $('NZsel').style.backgroundColor = "#333333"
    $('CBsel').style.backgroundColor = "#333333"
    $('CAsel').style.backgroundColor = "#333333"
	    $('C1sel').style.backgroundColor = "#333333"
	        $('C2sel').style.backgroundColor = "#333333"
	            $('C5sel').style.backgroundColor = "#333333"
               $('C7sel').style.backgroundColor = "#333333"
            	    add_subel_buttons();
  }
  else if(new_test_type == 'C1'){
	    //Make the extra test highlighted, clear the others
	    $('Tsel').style.backgroundColor = "#333333"
	    $('Gsel').style.backgroundColor = "#333333"
	    $('GNsel').style.backgroundColor = "#333333"
	    $('Esel').style.backgroundColor = "#333333"
	    $('NZsel').style.backgroundColor = "#333333"
	    $('CBsel').style.backgroundColor = "#333333"
	    $('CAsel').style.backgroundColor = "#333333"
	    $('C1sel').style.backgroundColor = "#888888"
	        $('C2sel').style.backgroundColor = "#333333"
	            $('C5sel').style.backgroundColor = "#333333"
               $('C7sel').style.backgroundColor = "#333333"
      clear_subel_buttons();
  }
  else if(new_test_type == 'C2'){
	    //Make the extra test highlighted, clear the others
	    $('Tsel').style.backgroundColor = "#333333"
	    $('Gsel').style.backgroundColor = "#333333"
	    $('GNsel').style.backgroundColor = "#333333"
	    $('Esel').style.backgroundColor = "#333333"
	    $('NZsel').style.backgroundColor = "#333333"
	    $('CBsel').style.backgroundColor = "#333333"
	    $('CAsel').style.backgroundColor = "#333333"
	    $('C1sel').style.backgroundColor = "#333333"
	        $('C2sel').style.backgroundColor = "#888888"
	            $('C5sel').style.backgroundColor = "#333333"
                $('C7sel').style.backgroundColor = "#333333"
                    clear_subel_buttons();
}
  else if(new_test_type == 'C5'){
	    //Make the extra test highlighted, clear the others
	    $('Tsel').style.backgroundColor = "#333333"
	    $('Gsel').style.backgroundColor = "#333333"
	    $('GNsel').style.backgroundColor = "#333333"
	    $('Esel').style.backgroundColor = "#333333"
	    $('NZsel').style.backgroundColor = "#333333"
	    $('CBsel').style.backgroundColor = "#333333"
	    $('CAsel').style.backgroundColor = "#333333"
	    $('C1sel').style.backgroundColor = "#333333"
	        $('C2sel').style.backgroundColor = "#333333"
	            $('C5sel').style.backgroundColor = "#888888"
                $('C7sel').style.backgroundColor = "#333333"
                    clear_subel_buttons();
}
  else if(new_test_type == 'C7'){
	    //Make the extra test highlighted, clear the others
	    $('Tsel').style.backgroundColor = "#333333"
	    $('Gsel').style.backgroundColor = "#333333"
	    $('GNsel').style.backgroundColor = "#333333"
	    $('Esel').style.backgroundColor = "#333333"
	    $('NZsel').style.backgroundColor = "#333333"
	    $('CBsel').style.backgroundColor = "#333333"
	    $('CAsel').style.backgroundColor = "#333333"
	    $('C1sel').style.backgroundColor = "#333333"
	        $('C2sel').style.backgroundColor = "#333333"
	            $('C5sel').style.backgroundColor = "#333333"
              $('C7sel').style.backgroundColor = "#888888"
                  clear_subel_buttons();
}
  else if(new_test_type == 'NZ'){
    //Make the New Zealand test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#333333"
    $('Gsel').style.backgroundColor = "#333333"
        $('GNsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#333333"
    $('NZsel').style.backgroundColor = "#888888"
    $('CBsel').style.backgroundColor = "#333333"
    $('CAsel').style.backgroundColor = "#333333"
	    $('C1sel').style.backgroundColor = "#333333"
	        $('C2sel').style.backgroundColor = "#333333"
	            $('C5sel').style.backgroundColor = "#333333"
	                $('C7sel').style.backgroundColor = "#333333"
	                    clear_subel_buttons();
  }
  else if(new_test_type == 'CB'){
    //Make the New Zealand test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#333333"
    $('Gsel').style.backgroundColor = "#333333"
        $('GNsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#333333"
    $('NZsel').style.backgroundColor = "#333333"
    $('CBsel').style.backgroundColor = "#888888"
    $('CAsel').style.backgroundColor = "#333333"
	    $('C1sel').style.backgroundColor = "#333333"
	        $('C2sel').style.backgroundColor = "#333333"
	            $('C5sel').style.backgroundColor = "#333333"
	                $('C7sel').style.backgroundColor = "#333333"
	                    clear_subel_buttons();
  }
  else if(new_test_type == 'CA'){
    //Make the New Zealand test highlighted, clear the others
    $('Tsel').style.backgroundColor = "#333333"
    $('Gsel').style.backgroundColor = "#333333"
        $('GNsel').style.backgroundColor = "#333333"
    $('Esel').style.backgroundColor = "#333333"
    $('NZsel').style.backgroundColor = "#333333"
    $('CBsel').style.backgroundColor = "#333333"
    $('CAsel').style.backgroundColor = "#888888"
	    $('C1sel').style.backgroundColor = "#333333"
	        $('C2sel').style.backgroundColor = "#333333"
	            $('C5sel').style.backgroundColor = "#333333"
	                $('C7sel').style.backgroundColor = "#333333"
	                    clear_subel_buttons();
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
  //login_user = '{{ uid }}';
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

var full_question_count = 0;

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
    full_question_count = 60;
    score_row_count = 60;
    element_count = 60;
    subel_prefix = 'NZ';
    splitter = '!';
    $('test_header').innerHTML = nz_header;
    clear_subel_buttons();
  }
  else if(test_type == 'T'){
    test_help = t_test_help;
    test_qs = t_test_qs;
    question_count = 35;
    full_question_count = 35;
    score_row_count = 10;
    subel_prefix = 'T';
    splitter = '&';
    $('test_header').innerHTML = t_header;
    add_subel_buttons();
    setup_subel_count('T');
  }
  else if(test_type == 'G'){
    test_help = g_test_help;
    test_qs = g_test_qs;
    question_count = 35;
    full_question_count = 35;
    score_row_count = 10;
    subel_prefix = 'G';
    splitter = '&';
    $('test_header').innerHTML = g_header;
    add_subel_buttons();
    setup_subel_count('GN');
  }
  else if(test_type == 'GN'){
	    test_help = gn_test_help;
	    test_qs = gn_test_qs;
	    question_count = 35;
	    full_question_count = 35;
	    score_row_count = 10;
	    subel_prefix = 'GN';
	    splitter = '&';
	    $('test_header').innerHTML = gn_header;
	    add_subel_buttons();
	    setup_subel_count('GN');
	  }
  else if(test_type == 'C1'){
	    test_help = c1_test_help;
	    test_qs = c1_test_qs;
	    question_count = 24;
	    score_row_count = 4;
	    element_count = 4;
	    subel_prefix = '1';
	    splitter = '!';
	    $('test_header').innerHTML = c1_header;
	    clear_subel_buttons();
	  }
  else if(test_type == 'C2'){
	    test_help = c2_test_help;
	    test_qs = c2_test_qs;
	    question_count = 100;
	    score_row_count = 17;
	    element_count = 17;
	    subel_prefix = '1';
	    splitter = '!';
	    $('test_header').innerHTML = c2_header;
	    clear_subel_buttons();
	  }
  else if(test_type == 'C5'){
	    test_help = c5_test_help;
	    test_qs = c5_test_qs;
	    question_count = 100;
	    score_row_count = 2;
	    element_count = 2;
	    subel_prefix = '5';
	    splitter = '!';
	    $('test_header').innerHTML = c5_header;
	    clear_subel_buttons();
	  }
  else if(test_type == 'C7'){
	    test_help = c7_test_help;
	    test_qs = c7_test_qs;
	    question_count = 100;
	    score_row_count = 10;
	    element_count = 10;
	    subel_prefix = '7';
	    splitter = '!';
	    $('test_header').innerHTML = c7_header;
	    clear_subel_buttons();
	  }
  else if(test_type == 'E'){
    test_help = e_test_help;
    test_qs = e_test_qs;
    question_count = 50;
    full_question_count = 50;
    score_row_count = 10;
    subel_prefix = 'E';
    splitter = '&';
    $('test_header').innerHTML = e_header;
    add_subel_buttons();
    setup_subel_count('E');
  }
  else if(test_type == 'CB'){
    test_help = cb_test_help;
    test_qs = cb_test_qs;
    question_count = 100;
    score_row_count = 8;
    subel_prefix = 'CB';
    splitter = '&';
    $('test_header').innerHTML = cb_header;
    clear_subel_buttons();
  }
  else if(test_type == 'CA'){
    test_help = ca_test_help;
    test_qs = ca_test_qs;
    question_count = 50;
    score_row_count = 7;
    subel_prefix = 'CA';
    splitter = '&';
    $('test_header').innerHTML = ca_header;
    clear_subel_buttons();
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
      
      toggleTab(1,5);
      
      //new_study_form();
      start_test();
}
    function start_test() {
      questions_done = 0;
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

}


function fb_tech_passed(){
    var app_link = 'http://apps.facebook.com/fcctech';
    var media = [
        	{
        		type: 'image',
        		src: 'img/techprep.png',
        		href: app_link
        	}
        ];
    var attachment = {
        name:  'Just passed the technician class ham radio practice exam',
        href: app_link,
        caption: 'Studying for my ham radio license',
        media: media
    }
FB.ui(
   {
     method: 'stream.publish',
     attachment: attachment
   }
  );
}

function qso_mapped(){
  var qso_message = rx_mirror_call + ' de ' + tx_mirror_call;
  if(mikm == 0){
    qso_message += ' ' + Number(distance/1609.344).toFixed(2) + ' miles '; 
  }else{
    qso_message += ' ' + Number(distance/1000).toFixed(2) + ' kms ';
  }

FB.ui(
   {
     method: 'stream.publish',
     message: qso_message,
     user_message_prompt: 'Nice QSO!  Tell your friends!'
   }
  );
}

function fb_general_passed(){
    var app_link = 'http://apps.facebook.com/fcctech';
    var media = [
        	{
        		type: 'image',
        		src: 'img/genprep.png',
        		href: app_link
        	}
        ];
    var attachment = {
        name:  'Just passed the general class ham radio practice exam',
        href: app_link,
        caption: 'Studying for my ham radio license',
        media: media
    }
FB.ui(
   {
     method: 'stream.publish',
     attachment: attachment
   }
  );
}

function fb_extra_passed(){
    var app_link = 'http://apps.facebook.com/fcctech';
    var media = [
        	{
        		type: 'image',
        		src: 'img/extraprep.png',
        		href: app_link
        	}
        ];
    var attachment = {
        name:  'Just passed the extra class ham radio practice exam',
        href: app_link,
        caption: 'Studying for my ham radio license',
        media: media
    }
FB.ui(
   {
     method: 'stream.publish',
     attachment: attachment
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

//global variables to carry around subelement study information
var subel_study_enable = false;
var subel_study_num = 0;
//use questions_asked to step through the subelement questions
//use subel_offsets to get the first and last question number 
//along with questions.length for the last question for element 0
var subel_study_firstq = 0;
var subel_study_lastq = 0;
var subel_study_qnum = 0;

function subel_button(subel_num){
	//return the string for a button that will start the specified subelement test
	return '<input type="button" value="' + subel_prefix + subel_num + '" onclick="toggleTab(1,5); start_subel(' + subel_num + ')">';
}

function get_sub_labels(){
	if(test_type == 'GN' || test_type == 'G'){
		return gsub_labels;
	}
	if(test_type == 'T'){
		return tsub_labels;
	}
	if(test_type == 'E'){
		return esub_labels;
	}
}

function add_subel_buttons(){
	var stButtons = '';
	//stButtons += '';
	//alert(stButtons);

	//Now display the subelement titles
   	var sub_lab = get_sub_labels();
    for(var i=0; i<10; i+=1){
    	stButtons += '<div style="border-top: 1px solid #666666; ">';
		stButtons+=subel_button(i);
    	stButtons += sub_lab[i] + '</div><br>';
    }
	
	$('subdiv').innerHTML = stButtons;
	
}



function clear_subel_buttons(){
	$('subdiv').innerHTML = '';
}


var tsub_labels = [];
var tgroup_labels = [];
var gsub_labels = [];
var ggroup_labels = [];
var esub_labels = [];
var egroup_labels = [];

tsub_labels[0] = 'SUBELEMENT T0 - AC power circuits, antenna installation, RF hazards';
tsub_labels[1] = 'SUBELEMENT T1 - FCC Rules, descriptions and definitions for the amateur radio service, operator and station license responsibilities';
tsub_labels[2] = 'SUBELEMENT T2 - Operating Procedures';
tsub_labels[3] = 'SUBELEMENT T3 - Radio wave characteristics, radio and electromagnetic properties, propagation modes';
tsub_labels[4] = 'SUBELEMENT T4 - Amateur radio practices and station setup';
tsub_labels[5] = 'SUBELEMENT T5 - Electrical principles, math for electronics, electronic principles, Ohm\'s Law';
tsub_labels[6] = 'SUBELEMENT T6 - Electrical components, semiconductors, circuit diagrams, component functions';
tsub_labels[7] = 'SUBELEMENT T7 - Station equipment, common transmitter and receiver problems, antenna measurements and troubleshooting, basic repair and testing';
tsub_labels[8] = 'SUBELEMENT T8 - Modulation modes, amateur satellite operation, operating activities, non-voice communications';
tsub_labels[9] = 'SUBELEMENT T9 - Antennas, feedlines';


tgroup_labels[0] = 'T1A - Amateur Radio services; purpose of the amateur service, amateur-satellite service, operator/primary station license grant, where FCC rules are codified, basis and purpose of FCC rules, meanings of basic terms used in FCC rules';
tgroup_labels[1] = 'T1B - Authorized frequencies; frequency allocations, ITU regions, emission type, restricted sub-bands, spectrum sharing, transmissions near band edges';
tgroup_labels[2] = 'T1C - Operator classes and station call signs; operator classes, sequential, special event, and vanity call sign systems, international communications, reciprocal operation, station license licensee, places where the amateur service is regulated by the FCC, name and address on ULS, license term, renewal, grace period';
tgroup_labels[3] = 'T1D - Authorized and prohibited transmissions';
tgroup_labels[4] = 'T1E - Control operator and control types; control operator required, eligibility, designation of control operator, privileges and duties, control point, local, automatic and remote control, location of control operator ';
tgroup_labels[5] = 'T1F - Station identification and operation standards; special operations for repeaters and auxiliary stations, third party communications, club stations, station security, FCC inspection';
tgroup_labels[6] = 'T2A - Station operation; choosing an operating frequency, calling another station, test transmissions, use of minimum power, frequency use, band plans';
tgroup_labels[7] = 'T2B - VHF/UHF operating practices; SSB phone, FM repeater, simplex, frequency offsets, splits and shifts, CTCSS, DTMF, tone squelch, carrier squelch, phonetics';
tgroup_labels[8] = 'T2C -Public service; emergency and non-emergency operations, message traffic handling';
tgroup_labels[9] = 'T3A - Radio wave characteristics; how a radio signal travels; distinctions of HF, VHF and UHF; fading, multipath; wavelength vs. penetration; antenna orientation';
tgroup_labels[10] = 'T3B - Radio and electromagnetic wave properties; the electromagnetic spectrum, wavelength vs. frequency, velocity of electromagnetic waves ';
tgroup_labels[11] = 'T3C - Propagation modes; line of sight, sporadic E, meteor, aurora scatter, tropospheric ducting, F layer skip, radio horizon';
tgroup_labels[12] = 'T4A - Station setup; microphone, speaker, headphones, filters, power source, connecting a computer, RF grounding';
tgroup_labels[13] = 'T4B - Operating controls; tuning, use of filters, squelch, AGC, repeater offset, memory channels';
tgroup_labels[14] = 'T5A - Electrical principles; current and voltage, conductors and insulators, alternating and direct current';
tgroup_labels[15] = 'T5B - Math for electronics; decibels, electronic units and the metric system';
tgroup_labels[16] = 'T5C - Electronic principles; capacitance, inductance, current flow in circuits, alternating current, definition of RF, power calculations';
tgroup_labels[17] = 'T5D - Ohm\'s Law';
tgroup_labels[18] = 'T6A - Electrical components; fixed and variable resistors, capacitors, and inductors; fuses, switches, batteries';
tgroup_labels[19] = 'T6B - Semiconductors; basic principles of diodes and transistors';
tgroup_labels[20] = 'T6C - Circuit diagrams; schematic symbols';
tgroup_labels[21] = 'T6D - Component functions';
tgroup_labels[22] = 'T7A - Station radios; receivers, transmitters, transceivers';
tgroup_labels[23] = 'T7B - Common transmitter and receiver problems; symptoms of overload and overdrive, distortion, interference, over and under modulation, RF feedback, off frequency signals; fading and noise; problems with digital communications interfaces';
tgroup_labels[24] = 'T7C - Antenna measurements and troubleshooting; measuring SWR, dummy loads, feedline failure modes';
tgroup_labels[25] = 'T7D - Basic repair and testing; soldering, use of a voltmeter, ammeter, and ohmmeter';
tgroup_labels[26] = 'T8A - Modulation modes; bandwidth of various signals';
tgroup_labels[27] = 'T8B - Amateur satellite operation; Doppler shift, basic orbits, operating protocols';
tgroup_labels[28] = 'T8C - Operating activities; radio direction finding, radio control, contests, special event stations, basic linking over Internet';
tgroup_labels[29] = 'T8D - Non-voice communications; image data, digital modes, CW, packet, PSK31';
tgroup_labels[30] = 'T9A - Antennas; vertical and horizontal, concept of gain, common portable and mobile antennas, relationships between antenna length and frequency';
tgroup_labels[31] = 'T9B - Feedlines; types, losses vs. frequency, SWR concepts, matching, weather protection, connectors';
tgroup_labels[32] = 'T0A - AC power circuits; hazardous voltages, fuses and circuit breakers, grounding, lightning protection, battery safety, electrical code compliance';
tgroup_labels[33] = 'T0B - Antenna installation; tower safety, overhead power lines';
tgroup_labels[34] = 'T0C - RF hazards; radiation exposure, proximity to antennas, recognized safe power levels, exposure to others';

gsub_labels[0] = 'SUBELEMENT G0 - ELECTRICAL AND RF SAFETY';
gsub_labels[1] = 'SUBELEMENT G1 - COMMISSION\'S RULES';
gsub_labels[2] = 'SUBELEMENT G2 - OPERATING PROCEDURES ';
gsub_labels[3] = 'SUBELEMENT G3 - RADIO WAVE PROPAGATION ';
gsub_labels[4] = 'SUBELEMENT G4 - AMATEUR RADIO PRACTICES';
gsub_labels[5] = 'SUBELEMENT G5 - ELECTRICAL PRINCIPLES';
gsub_labels[6] = 'SUBELEMENT G6 - CIRCUIT COMPONENTS';
gsub_labels[7] = 'SUBELEMENT G7 - PRACTICAL CIRCUITS';
gsub_labels[8] = 'SUBELEMENT G8 - SIGNALS AND EMISSIONS';
gsub_labels[9] = 'SUBELEMENT G9 - ANTENNAS AND FEED LINES';

ggroup_labels[0] = 'G1A - General Class control operator frequency privileges; primary and secondary allocations';
ggroup_labels[1] = 'G1B - Antenna structure limitations; good engineering and good amateur practice; beacon operation; restricted operation; retransmitting radio signals';
ggroup_labels[2] = 'G1C - Transmitter power regulations; data emission standards';
ggroup_labels[3] = 'G1D - Volunteer Examiners and Volunteer Examiner Coordinators; temporary identification';
ggroup_labels[4] = 'G1E - Control categories; repeater regulations; harmful interference; third party rules; ITU regions';
ggroup_labels[5] = 'G2A Phone operating procedures; USB/LSB utilization conventions; procedural signals; breaking into a QSO in progress; VOX operation';
ggroup_labels[6] = 'G2B - Operating courtesy; band plans, emergencies, including drills and emergency communications';
ggroup_labels[7] = 'G2C - CW operating procedures and procedural signals, Q signals and common abbreviations; full break in';
ggroup_labels[8] = 'G2D - Amateur Auxiliary; minimizing interference; HF operations';
ggroup_labels[9] = 'G2E - Digital operating: procedures, procedural signals and common abbreviations';
ggroup_labels[10] = 'G3A - Sunspots and solar radiation; ionospheric disturbances; propagation forecasting and indices';
ggroup_labels[11] = 'G3B - Maximum Usable Frequency; Lowest Usable Frequency; propagation';
ggroup_labels[12] = 'G3C - Ionospheric layers; critical angle and frequency; HF scatter; Near Vertical Incidence Sky waves';
ggroup_labels[13] = 'G4A - Station Operation and setup';
ggroup_labels[14] = 'G4B - Test and monitoring equipment; two-tone test';
ggroup_labels[15] = 'G4C - Interference with consumer electronics; grounding; DSP';
ggroup_labels[16] = 'G4D - Speech processors; S meters; sideband operation near band edges';
ggroup_labels[17] = 'G4E - HF mobile radio installations; emergency and battery powered operation';
ggroup_labels[18] = 'G5A - Reactance; inductance; capacitance; impedance; impedance matching';
ggroup_labels[19] = 'G5B - The Decibel; current and voltage dividers; electrical power calculations; sine wave root-mean-square (RMS) values; PEP calculations';
ggroup_labels[20] = 'G5C - Resistors, capacitors and inductors in series and parallel; transformers';
ggroup_labels[21] = 'G6A - Resistors; capacitors; inductors';
ggroup_labels[22] = 'G6B - Rectifiers; solid state diodes and transistors; vacuum tubes; batteries';
ggroup_labels[23] = 'G6C - Analog and digital integrated circuits (IC\'s); microprocessors; memory; I/O devices; microwave IC\'s (MMIC\'s ); display devices';
ggroup_labels[24] = 'G7A - Power supplies; schematic symbols';
ggroup_labels[25] = 'G7B - Digital circuits; amplifiers and oscillators';
ggroup_labels[26] = 'G7C - Receivers and transmitters; filters, oscillators';
ggroup_labels[27] = 'G8A - Carriers and modulation: AM; FM; single and double sideband; modulation envelope; overmodulation';
ggroup_labels[28] = 'G8B - Frequency mixing; multiplication; HF data communications; bandwidths of various modes; deviation';
ggroup_labels[29] = 'G9A - Antenna feed lines: characteristic impedance and attenuation; SWR calculation, measurement and effects; matching networks';
ggroup_labels[30] = 'G9B - Basic antennas';
ggroup_labels[31] = 'G9C - Directional antennas';
ggroup_labels[32] = 'G9D - Specialized antennas';
ggroup_labels[33] = 'G0A - RF safety principles, rules and guidelines; routine station evaluation';
ggroup_labels[34] = 'G0B - Safety in the ham shack: electrical shock and treatment, safety grounding, fusing, interlocks, wiring, antenna and tower safety';

esub_labels[0] = 'SUBELEMENT E0 - Safety';
esub_labels[1] = 'SUBELEMENT E1 -- COMMISSION\'S RULES';
esub_labels[2] = 'SUBELEMENT E2 -- OPERATING PRACTICES AND PROCEDURES';
esub_labels[3] = 'SUBELEMENT E3 -- RADIO WAVE PROPAGATION';
esub_labels[4] = 'SUBELEMENT E4 -- AMATEUR RADIO TECHNOLOGY AND MEASUREMENTS';
esub_labels[5] = 'SUBELEMENT E5 -- ELECTRICAL PRINCIPLE';
esub_labels[6] = 'SUBELEMENT E6 -- CIRCUIT COMPONENTS';
esub_labels[7] = 'SUBELEMENT E7 -- PRACTICAL CIRCUITS';
esub_labels[8] = 'SUBELEMENT E8 -- SIGNALS AND EMISSIONS';
esub_labels[9] = 'SUBELEMENT E9 -- ANTENNAS AND TRANSMISSION LINES';

egroup_labels[0] = 'E1A Operating Standards: frequency privileges for Extra Class amateurs; emission standards; automatic message forwarding; frequency sharing; FCC license actions; stations aboard ships or aircraft ';
egroup_labels[1] = 'E1B Station restrictions and special operations: restrictions on station location; general operating restrictions, spurious emissions, control operator reimbursement; antenna structure restrictions; RACES operations';
egroup_labels[2] = 'E1C Station control: definitions and restrictions pertaining to local, automatic and remote control operation; control operator responsibilities for remote and automatically controlled stations';
egroup_labels[3] = 'E1D Amateur Satellite service: definitions and purpose; license requirements for space stations; available frequencies and bands; telecommand and telemetry operations; restrictions, and special provisions; notification requirements';
egroup_labels[4] = 'E1E Volunteer examiner program: definitions, qualifications, preparation and administration of exams; accreditation; question pools; documentation requirements';
egroup_labels[5] = 'E1F Miscellaneous rules: external RF power amplifiers; Line A; national quiet zone; business communications; compensated communications; spread spectrum; auxiliary stations; reciprocal operating privileges; IARP and CEPT licenses; third party communications with foreign countries; special temporary authority';
egroup_labels[6] = 'E2A Amateur radio in space: amateur satellites; orbital mechanics; frequencies and modes; satellite hardware; satellite operations';
egroup_labels[7] = 'E2B Television practices: fast scan television standards and techniques; slow scan television standards and techniques';
egroup_labels[8] = 'E2C Operating methods, part 1: contest and DX operating; spread-spectrum transmissions; automatic HF forwarding; selecting an operating frequency';
egroup_labels[9] = 'E2D Operating methods, part 2: VHF and UHF digital modes; packet clusters; Automatic Position Reporting System (APRS)  ';
egroup_labels[10] = 'E2E Operating methods, part 3: operating HF digital modes; error correction';
egroup_labels[11] = 'E3A Propagation and technique, part 1: Earth-Moon-Earth communications; meteor scatter';
egroup_labels[12] = 'E3B Propagation and technique, part 2: transequatorial; long path; gray line; multi-path propagation';
egroup_labels[13] = 'E3C Propagation and technique, part 3: Auroral propagation; selective fading; radio-path horizon; take-off angle over flat or sloping terrain; earth effects on propagation; less common propagation modes';
egroup_labels[14] = 'E4A Test equipment: analog and digital instruments; spectrum and network analyzers, antenna analyzers; oscilloscopes; testing transistors; RF measurements ';
egroup_labels[15] = 'E4B Measurement technique and limitations: instrument accuracy and performance limitations; probes; techniques to minimize errors; measurement of "Q"; instrument calibration';
egroup_labels[16] = 'E4C Receiver performance characteristics, part 1: phase noise, capture effect, noise floor, image rejection, MDS, signal-to-noise-ratio; selectivity';
egroup_labels[17] = 'E4D Receiver performance characteristics, part 2: blocking dynamic range, intermodulation and cross-modulation interference; 3rd order intercept; desensitization; preselection';
egroup_labels[18] = 'E4E Noise suppression: system noise; electrical appliance noise; line noise; locating noise sources; DSP noise reduction; noise blankers';
egroup_labels[19] = 'E5A Resonance and Q: characteristics of resonant circuits: series and parallel resonance; Q; half-power bandwidth; phase relationships in reactive circuits';
egroup_labels[20] = 'E5B Time constants and phase relationships: R/L/C time constants: definition; time constants in RL and RC circuits; phase angle between voltage and current; phase angles of series and parallel circuits';
egroup_labels[21] = 'E5C Impedance plots and coordinate systems: plotting impedances in polar coordinates; rectangular coordinates';
egroup_labels[22] = 'E5D AC and RF energy in real circuits: skin effect; electrostatic and electromagnetic fields; reactive power; power factor; coordinate systems';
egroup_labels[23] = 'E6A Semiconductor materials and devices: semiconductor materials (germanium, silicon, P-type, N-type); transistor types: NPN, PNP, junction, power; field-effect transistors: enhancement mode; depletion mode; MOS; CMOS; N-channel; P-channel';
egroup_labels[24] = 'E6B Semiconductor diodes';
egroup_labels[25] = 'E6C Integrated circuits: TTL digital integrated circuits; CMOS digital integrated circuits; gates';
egroup_labels[26] = 'E6D Optical devices and toroids: vidicon and cathode-ray tube devices; charge-coupled devices (CCDs); liquid crystal displays (LCDs); toroids: permeability, core material, selecting, winding';
egroup_labels[27] = 'E6E Piezoelectric crystals and MMICS: quartz crystals (as used in oscillators and filters); monolithic amplifiers (MMICs)';
egroup_labels[28] = 'E6F Optical components and power systems: photoconductive principles and effects, photovoltaic systems, optical couplers, optical sensors, and optoisolators ';
egroup_labels[29] = 'E7A Digital circuits: digital circuit principles and logic circuits: classes of logic elements; positive and negative logic; frequency dividers; truth tables';
egroup_labels[30] = 'E7B Amplifiers: Class of operation; vacuum tube and solid-state circuits; distortion and intermodulation; spurious and parasitic suppression; microwave amplifiers';
egroup_labels[31] = 'E7C Filters and matching networks: filters and impedance matching networks: types of networks; types of filters; filter applications; filter characteristics; impedance matching; DSP filtering ';
egroup_labels[32] = 'E7D Power supplies and voltage regulators';
egroup_labels[33] = 'E7E Modulation and demodulation: reactance, phase and balanced modulators; detectors; mixer stages; DSP modulation and demodulation; software defined radio systems ';
egroup_labels[34] = 'E7F Frequency markers and counters: frequency divider circuits; frequency marker generators; frequency counters';
egroup_labels[35] = 'E7G Active filters and op-amps: active audio filters; characteristics; basic circuit design; operational amplifiers';
egroup_labels[36] = 'E7H Oscillators and signal sources: types of oscillators; ';
egroup_labels[37] = 'E8A AC waveforms: sine, square, sawtooth and irregular waveforms; AC measurements; average and PEP of RF signals; pulse and digital signal waveforms ';
egroup_labels[38] = 'E8B Modulation and demodulation: modulation methods; modulation index and deviation ratio; pulse modulation; frequency and time division multiplexing';
egroup_labels[39] = 'E8C Digital signals: digital communications modes; CW; information rate vs. bandwidth; spread-spectrum communications; modulation methods';
egroup_labels[40] = 'E8D Waves, measurements, and RF grounding: peak-to-peak values, polarization; RF grounding';
egroup_labels[41] = 'E9A Isotropic and gain antennas: definition; used as a standard for comparison; radiation pattern; basic antenna parameters: radiation resistance and reactance, gain, beamwidth, efficiency';
egroup_labels[42] = 'E9B Antenna patterns: E and H plane patterns; gain as a function of pattern; antenna design (computer modeling of antennas); Yagi antennas';
egroup_labels[43] = 'E9C Wire and phased vertical antennas: beverage antennas; terminated and resonant rhombic antennas; elevation above real ground; ground effects as related to polarization; take-off angles';
egroup_labels[44] = 'E9D Directional antennas: gain; satellite antennas; antenna beamwidth; losses; SWR bandwidth; antenna efficiency; shortened and mobile antennas; grounding';
egroup_labels[45] = 'E9E Matching: matching antennas to feed lines; power dividers';
egroup_labels[46] = 'E9F Transmission lines: characteristics of open and shorted feed lines: 1/8 wavelength; 1/4 wavelength; 1/2 wavelength; feed lines: coax versus open-wire; velocity factor; electrical length; transformation characteristics of line terminated in impedance not equal to characteristic impedance ';
egroup_labels[47] = 'E9G The Smith chart';
egroup_labels[48] = 'E9H  Effective radiated power; system gains and losses; radio direction finding antennas';
egroup_labels[49] = 'E0A Safety: amateur radio safety practices; RF radiation hazards; hazardous materials ';


function start_subel(subel_num){
	subel_study_enable = true;
	subel_study_num = subel_num;
	if(subel_num == 0){
		subel_study_firstq = subel_offsets[10];
		subel_study_lastq = questions.length - 2;
	}else{
		subel_study_firstq = subel_offsets[subel_num];
		subel_study_lastq = subel_offsets[subel_num + 1] - 1;
	}
	//set the number of questions equal to the number of quesitons in the 
	//subelement
	question_count = (subel_study_lastq - subel_study_firstq) + 1;
	subel_study_qnum = subel_study_firstq;
	question_getter('New Test');
}


function question_getter(button_value){
      if(button_value == 'New Test'){
        subel_toggling = true;
        questions_done = 0;
        reset_test();
        //if this is a subelement test, then reset the number of questions 
        //to match the number of questions in the subelement
        if(subel_study_enable){
        	question_count = (subel_study_lastq - subel_study_firstq) + 1;
        }
        questions_done = 0;
      }
      else if(button_value == 'New Test Unseen'){
         subel_toggling = true;
         questions_done = 0;
         reset_test();
         cull_unseenpassed(1);    
         questions_done = 0;
         //Turn off the other new test buttons  
      }
      else if(button_value == 'New Test Unpassed'){
         subel_toggling = true;
         questions_done = 0;
         reset_test();
         cull_unseenpassed(2);            
         questions_done = 0;
         //Turn off the other new test buttons  
      }
      else{
        questions_asked = questions_asked + 1;
        first_answer = 1;
        
        //Randomly choose a group and question index if this is not a subelement test
        if(!subel_study_enable){
        group_index = Math.floor(Math.random() * groups_sel.length);
        //Use the index to retrieve the group number from the array of
        //unused groups
        group_num = groups_sel[group_index];
        
        question_index = Math.floor(Math.random() * 
                                     question_sel[group_num].length);
        question_num = question_sel[group_num][question_index];
        q_sel_fields = 
            questions[group_offsets[group_num] + question_num].split('|');
        abs_qnum = group_offsets[group_num] + question_num;
        //This isn't necessary for subelement tests
        //Remove the selected group and question from the random mix
        groups_sel.splice(group_index, 1);
        //This is only necessary later when unseen or unpassed 
        //questions are being selected and more than one question 
        //can be selected from a group
        question_sel[group_num].splice(question_index, 1);
        }else{
        	//This steups up to the next question after getting the current 
        	//question fields
        	//question_count was setup for the subelement already and will end the test
        	//at the right time
        	question_num = subel_study_qnum;
            q_sel_fields = 
                questions[question_num].split('|');
            abs_qnum = question_num;
            subel_study_qnum += 1;
        }
        

        //Record the fact that the question has been seen
        updateps(abs_qnum);

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
        else if(test_type == 'C1' || test_type == 'C2' || test_type == 'C5'){
        	if(q_sel_fields[2] == 'A'){
        		subelement = 0;
        	}
        	if(q_sel_fields[2] == 'B'){
        		subelement = 1;
        	}
        	if(q_sel_fields[2] == 'C'){
        		subelement = 2;
        	}
        	if(q_sel_fields[2] == 'D'){
        		subelement = 3;
        	}
        	if(q_sel_fields[2] == 'E'){
        		subelement = 4;
        	}
        	if(q_sel_fields[2] == 'F'){
        		subelement = 5;
        	}
        	if(q_sel_fields[2] == 'G'){
        		subelement = 6;
        	}
        	if(q_sel_fields[2] == 'H'){
        		subelement = 7;
        	}
        	if(q_sel_fields[2] == 'I'){
        		subelement = 8;
        	}
        	if(q_sel_fields[2] == 'J'){
        		subelement = 9;
        	}
        	if(q_sel_fields[2] == 'K'){
        		subelement = 10;
        	}
        	if(q_sel_fields[2] == 'L'){
        		subelement = 11;
        	}
        	if(q_sel_fields[2] == 'M'){
        		subelement = 12;
        	}
        	if(q_sel_fields[2] == 'N'){
        		subelement = 13;
        	}
        	if(q_sel_fields[2] == 'O'){
        		subelement = 14;
        	}
        	if(q_sel_fields[2] == 'P'){
        		subelement = 15;
        	}
        	if(q_sel_fields[2] == 'Q'){
        		subelement = 16;
        	}
        }
        else{
          subelement = q_sel_fields[2];
        }
        
        
        
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
        var stNewQuestion = '';
        if(!subel_study_enable){
    	    stNewQuestion = 'Question ' + (questions_asked) + ' of ' + question_count + 
                            '  [' + (group_num+1) + '-' + question_num + ']<br>' + q_sel_fields[6];
        }else{
        	stNewQuestion = 'Question ' + (questions_asked) + ' of ' + question_count + 
            ' of subelement ' + subel_study_num + ' <br>' + q_sel_fields[6];
        }
      qIndex = q_sel_fields[0];
      stNewQuestion += '<a class="examhlink" href="javascript:void(0)" onClick="setForumFrame(); "></a> '

      if(test_help[qIndex] != undefined){
        stNewQuestion += ' <a class="examhlink" href="' + test_help[qIndex] + '" target="examhelp"' + 
                         '>Study Material</a>'
      }
      document.getElementById('question_table').innerHTML = stNewQuestion;
      //picture location
      set_figure( stNewQuestion );
      
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
      
      
      //add_forum_entries('qforumdiv');
    }  else{
      document.getElementById('next_question').value = 'New Test';
    }
  }
  
function set_figure( stNewQuestion ){
    if(stNewQuestion.indexOf('T-1') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/figtn1.jpg">';
      }
      else if(stNewQuestion.indexOf('T-2') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/figtn2.jpg">';
      }
      else if(stNewQuestion.indexOf('T-3') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/figtn3.jpg">';
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
      else if(stNewQuestion.indexOf('G7-1') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/G7-1.jpg">';
        }
      else if(stNewQuestion.indexOf('E5-2') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/e5-22.png">';
        }    
      else if(stNewQuestion.indexOf('E6-1') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/e6-1.png">';
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
        document.getElementById('q_figure').innerHTML = '<img src="img/G7-1.jpg">';
      }
      else if(stNewQuestion.indexOf('3B1') > -1){
        document.getElementById('q_figure').innerHTML = '<img src="img/3b1.png">';
      }     
      else if(stNewQuestion.indexOf('3B2') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3b2.png">';
      }     
      else if(stNewQuestion.indexOf('3B3') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3b3.png">';
      }     
      else if(stNewQuestion.indexOf('3C4') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3c4.png">';
      }     
      else if(stNewQuestion.indexOf('3C5') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3c5.png">';
      }     
      else if(stNewQuestion.indexOf('3D6') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3d6.png">';
      }     
      else if(stNewQuestion.indexOf('3D7') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3d6.png">';
      }     
      else if(stNewQuestion.indexOf('3D8') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3d8.png">';
      }     
      else if(stNewQuestion.indexOf('3D9') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3d9.png">';
      }     
      else if(stNewQuestion.indexOf('3D10') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3d10.png">';
      }     
      else if(stNewQuestion.indexOf('3D11') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3d11.png">';
      }     
      else if(stNewQuestion.indexOf('3E12') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3e12.png">';
      }     
      else if(stNewQuestion.indexOf('3E13') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3e13.png">';
      }     
      else if(stNewQuestion.indexOf('3E14') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3e14.png">';
      }     
      else if(stNewQuestion.indexOf('3F15') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3f15.png">';
      }     
      else if(stNewQuestion.indexOf('3F16') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3f16.png">';
      }     
      else if(stNewQuestion.indexOf('3H17') > -1){
          document.getElementById('q_figure').innerHTML = '<img src="img/3h17.png">';
      }     
      else{
        document.getElementById('q_figure').innerHTML = '';
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
   if(test_type == 'GN'){
	     document.getElementById('fquestion_table').innerHTML = 
	     'General Class Amateur Radio Practice Exam (Question pool effective 7/1/2011 - 6/30/2015)';
	   }
   if(test_type == 'C1'){
	     document.getElementById('fquestion_table').innerHTML = 
	     'Element 1 Commercial License Question Pool';
	   }
   if(test_type == 'C2'){
	     document.getElementById('fquestion_table').innerHTML = 
	     'Element 3 Commercial License Question Pool';
	   }
   if(test_type == 'C5'){
	     document.getElementById('fquestion_table').innerHTML = 
	     'Element 5 Commercial License Question Pool';
	   }
   if(test_type == 'C7'){
	     document.getElementById('fquestion_table').innerHTML = 
	     'Element 7 Commercial License Question Pool';
	   }
   if(test_type == 'E'){
     document.getElementById('fquestion_table').innerHTML = 
     'Extra Class Amateur Radio Practice Exam (Question pool published 7/1/2012)';
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
        if((document.getElementById('next_question').value != 'New Test') ||
        	subel_study_enable){
          //partial test results
          if(document.getElementById('next_question').disabled == true){
            score_params += "&partial=" + encodeURIComponent(questions_asked - 1);
          }
          else{
            score_params += "&partial=" + encodeURIComponent(questions_asked);
          }
        }
        if(subel_study_enable){
        	score_params += "&se_score=" + encodeURIComponent('Y');
        }
  
                      
        //Now send the scores to the db
        if (typeof XMLHttpRequest != "undefined") {
            req = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        req.open("POST", '/hamtestscore', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //req.setRequestHeader("Content-length", score_params.length);
        //req.setRequestHeader("Connection", "close");

        
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
                toggleTab(2,5);
              }
              else{
                new_test_b = false;
              }
        }
        else{
          show_results();
          //alert('log_cb Reqeust failed ' + req.status + ' ' + req.responseText);
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

//frames["forumtest"].location.href = 'http://copaseticflows.appspot.com/hamtforum?q_index=' + qIndex + '&t_class=' + test_type;
     
//htoggleTab(5,5);     

}

function add_sub(){
	if(test_type == 'T' || test_type == 'G' || test_type == 'E' || test_type == 'GN'){
		//Add the buttons that will start the subelement tests
		for(var si = 0; si < 10; si += 1){
			
		}
	}
	
	
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
      
      if(test_type == 'T'  && fb_present){
        fb_tech_passed();
      }
      if((test_type == 'G' || test_type == 'GN')  && fb_present){
        fb_general_passed();
      }
      if(test_type == 'E'  && fb_present){
        fb_extra_passed();
      }
      if(test_type == 'CB'){
        //fb_cb_passed();
      }
      if(test_type == 'CA'){
        //fb_ca_passed();
      }
    }
    else{
      document.getElementById('q_correct').innerHTML = 'You did not pass the test.  You might want to study some more.';
    }
    
    sing_test = true;
    //If this is a subelement test, patch up question_count
    if(subel_study_enable){
    	question_count = full_question_count;
    }
    show_results();
  }
	subel_study_enable = false;
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
  chart_url.push(' <img src="http://chart.apis.google.com/chart?chs=400x200');
  chart_url.push(score_colors);  
  chart_url.push('&chg=101,25');
  chart_url.push('&amp;chd=');  chart_url.push(simpleEncode(test_scores, 61));
  //alert(test_scores[0] + ' ' + test_scores[1]);
  chart_url.push('&amp;cht=bvs&amp;chbh=a&amp;chxt=y');
  chart_url.push('&amp;chtt= Test Scores for ' + login_name + '">');
  document.getElementById('tabContent2').innerHTML = table_start + 
                            chart_url.join('') + 
                            '<br><br></td></tr><tr>'+
                            '<td>%Questions Answered<br>'+
                            get_pie_chart(gettotunseen(), total_questions, 130, 100) + 
                            '<br><input id="Unseen" type="button" value="New Test Unseen" onclick="toggleTab(1,5); question_getter(this.value)">' +
                            '</td>'+
                            '<td>%Questions Passed<br>'+
                            get_pie_chart(gettotunpassed(), total_questions, 130, 100) +
                            '<br><input id="Unpassed" type="button" value="New Test Unpassed" onclick="toggleTab(1,5); question_getter(this.value)">' +
                            '</td></tr>';
  }
   //Now graph the per element progress of the student
   //Per element graphing removed
   //Adding it back in
  //Now graph the per element progress of the student
  //Add code to look for the se_score field and divvide by the correct total
  //Only do this for the US tests
  if(test_type == 'T' || test_type == 'G' || test_type == 'GN' || test_type == 'E'){
	  document.getElementById('tabContent2').innerHTML += '<td>'
  var element_scores = [];
  for(var sc_el = 0; sc_el < 10; sc_el += 1){
    //Get the element score form each test and add it to the graph
    for(var test=0; test < datarows.length - 1; test += 1){
      var raw_score = 0;
      var datarow = datarows[test].split('|');
      //alert(datarows[test]);
      raw_score = parseInt(datarow[sc_el]);
      //get partial again in case this is a subelement study score
      partial = false;
      partial_value = 'N';
      if(datarow[score_row_count + 1] != 'None'){
        if(datarow[score_row_count + 1] != ''){
          //alert('Found partial in ' + test + ' ' + datarow[61]);
          partial = true;
          partial_value = datarow[score_row_count + 1];
        }
      }
      //Now get the value for se_score if there is one
      var se_score = 'N';
      if(datarow[score_row_count + 2] != 'None'){
    	  se_score = datarow[score_row_count + 2];
      }
      
      
      //alert(raw_score + 
      if(se_score == 'N'){
    		  test_scores[test] = (raw_score/subel_count[sc_el])*61;
      }else{
    	  test_scores[test] = (raw_score/partial_value)*61;
      }
      if(test == 0){
        score_colors = '&amp;chco=';
      }
      if(test > 0){
        score_colors = score_colors + '|';      
      }
      var color_score = raw_score/subel_count[sc_el];
      if(se_score == 'N'){
    	  color_score = raw_score/subel_count[sc_el];
      }else{
    	  color_score = raw_score/partial_value;
      }
      score_colors = score_colors + getScoreColor(color_score);
    }
    if(datarows.length - 1 != 0){
      for(var pad = datarows.length - 1; pad < 10; pad++){
        test_scores[pad] = 0;
      }
       //alert(test + ' ' + raw_score);
       //Add the graph to the results
       gtitle = 'Element ' + subel_prefix + (sc_el)%10 + ' Scores';
       document.getElementById('tabContent2').innerHTML += '<tr><td>' + 
                          insert_graph(test_scores, gtitle, score_colors) + 
                          '<br>Study only this subelement ' + subel_button(sc_el) +
                          '<br><br></td></tr>';
    }
  }
  } //Conditional to check for T, G, GN, or E and chart subelement progress
   
   
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
  chart_url.push(' <img src="http://chart.apis.google.com/chart?chs=400x200');
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
  
var stspotDate = '';
var stspotTime = '';




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


function hideHelp(){
  document.getElementById('help').style.zIndex=-1;
  document.getElementById('help_inside').style.zIndex=-1;
}

function showHelp(){
  document.getElementById('help').style.zIndex=2;
  document.getElementById('help_inside').style.zIndex=3;
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


function setup_subel_count(subel_type){
	if(subel_type = 'T'){
		subel_count[0] = 3;
		subel_count[1] = 6;
		subel_count[2] = 3;
		subel_count[3] = 3;
		subel_count[4] = 2;
		subel_count[5] = 4;
		subel_count[6] = 4;
		subel_count[7] = 4;
		subel_count[8] = 4;
		subel_count[9] = 2;
	}
	if(subel_type = 'GN'){
		subel_count[0] = 2;
		subel_count[1] = 5;
		subel_count[2] = 5;
		subel_count[3] = 3;
		subel_count[4] = 5;
		subel_count[5] = 3;
		subel_count[6] = 3;
		subel_count[7] = 3;
		subel_count[8] = 2;
		subel_count[9] = 4;
	}
	if(subel_type = 'E'){
		subel_count[0] = 1;
		subel_count[1] = 6;
		subel_count[2] = 5;
		subel_count[3] = 3;
		subel_count[4] = 5;
		subel_count[5] = 4;
		subel_count[6] = 6;
		subel_count[7] = 8;
		subel_count[8] = 4;
		subel_count[9] = 8;
	}
}

var lang = '{{lang}}';
recent = true;




var help_videos = [];
help_videos[0] = '<iframe width="430" height="274" src="http://www.youtube.com/embed/b_V5rfwsXmE" frameborder="0" allowfullscreen></iframe>';
help_videos[1] = '<iframe width="430" height="274" src="http://www.youtube.com/embed/3sQ3PBH6aZk?rel=0" frameborder="0" allowfullscreen></iframe>';
help_videos[2] = '<iframe width="429" height="244" src="http://www.youtube.com/embed/gJ-mH7CdiI0?rel=0" frameborder="0" allowfullscreen></iframe>';
help_videos[3] = '<iframe width="425" height="349" src="http://www.youtube.com/embed/VG1u0X94vGg?rel=0" frameborder="0" allowfullscreen></iframe>';

function setHelpVideo( index ){
	  $('helpvideo').innerHTML = help_videos[index];
}
