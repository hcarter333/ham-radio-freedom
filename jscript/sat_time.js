    function getXMLTime( time ){
    	//first convert date from milliseconds to a date object
    	date = new Date(time);
    	return date.getUTCFullYear() + '-' + fullMonth(date) + '-' + fullDay(date) + 'T' + fullHour(date) + ':' + fullMinute(date) + ':' + fullSecond(date) + 'Z';
    }
    
    function fullDay( date ){
    	var dayend = date.getUTCDate();
    	if(dayend.toString().length == 1){
    		return '0' + dayend;
    	}else{
    		return dayend;
    	}
    }
    
    function fullMonth( date ){
    	var monthend = date.getUTCMonth() + 1;
    	if(monthend.toString().length == 1){
    		return '0' + monthend;
    	}else{
    		return monthend;
    	}
    }
    
    function fullHour( date ){
    	var hourend = date.getUTCHours();
    	if(hourend.toString().length == 1){
    		return '0' + hourend;
    	}else{
    		return hourend;
    	}
    }
    function fullMinute( date ){
    	var minuteend = date.getUTCMinutes();
    	if(minuteend.toString().length == 1){
    		return '0' + minuteend;
    	}else{
    		return minuteend;
    	}
    }
    function fullSecond( date ){
    	var secondend = date.getUTCSeconds();
    	if(secondend.toString().length == 1){
    		return '0' + secondend;
    	}else{
    		return secondend;
    	}
    }
