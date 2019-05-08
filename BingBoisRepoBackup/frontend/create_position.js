function addJobValidate() {
    var title = $("#title").val();
    var start_date = $("#startDate").val();
    var end_date = $("#postExpirationDate").val();
    var job_description = $("#jobDescription").val();
    var public_visible = !($('#exampleCheck1').is(':checked'));
    var location = $("#placeholder").val();
    var username = $("#user").html();
    console.log(username);
    $.get( "/user/"+username, function( data ) {
        var company_id = data.userdata.companyid;
        var user_id = data.userdata.userid;
        console.log(company_id, user_id);
        jQuery.post('/positions/create', {
        title: title,
        job_description: job_description,
        companyID: company_id,
        managerID: user_id,
        publicVisible: public_visible,
        isAvailible: true,
        start_date: start_date,
        end_date: end_date,
        loc: location
        
        }, function() {
         window.location.href='/';
        });
    }); 
}
