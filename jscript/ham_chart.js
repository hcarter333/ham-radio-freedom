// JavaScript source code
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
