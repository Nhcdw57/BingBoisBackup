function parsedata(input) {
    input.forEach(function(element) {
      var temp = "";
      if(element.id==manager_id){
        temp=element.email;
        $("#applybtn").attr("onclick","window.location.href = 'mailto:"+temp+"'");
        console.log(temp);
      }
    });
  }
  
  window.onload = function() {
    $.get( "/employees/"+company_id, function( data ) {
        parsedata(data.employees);
    });
  }
  