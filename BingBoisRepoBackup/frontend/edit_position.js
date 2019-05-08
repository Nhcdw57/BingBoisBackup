function addJobValidate() {
    var title = $("#title").val();
    var start_date = $("#startDate").val();
    var end_date = $("#postExpirationDate").val();
    var job_description = $("#jobDescription").val();
    var public_visible = !($('#exampleCheck1').is(':checked'));
    var location = $("#placeholder").val();
    
    //companyID, managerID should be dependant on who's creating the job posting
    //publicVisible and isAvailible should have checkboxes on the posting page in the future

    jQuery.post('/positions/edit/'+position_id, {
        title: title,
        job_description: job_description,
        companyID: 1,
        managerID: 1,
        publicVisible: public_visible,
        isAvailible: true,
        start_date: start_date,
        end_date: end_date,
        loc: location
        
    }, function() {
        window.location.href='/';
    });
}
