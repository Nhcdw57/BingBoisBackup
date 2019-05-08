function dataTable(input) {
  input.forEach(function(element) {
    var temp = 
    "<div>\
      <article>\
        <position><a href=\"/positions/edit/"+element.id+"\">"+element.title+"</a></position>\
        <other>"+(element.postingexpirationdate || "NA")+"</other>\
        <trash><a href=\"/positions/edit/"+element.id+"\"><img src=\"https://www.freeiconspng.com/uploads/edit-editor-pen-pencil-write-icon--4.png\" alt=\"Edit Job\" style=\"width:20px;height:20px;margin-top: -5px;\"></a></trash>\
        <trash><a style=\"cursor: pointer;\" onclick=\"deleteJob("+element.id+");\"><img src=\"https://www.freeiconspng.com/uploads/trash-can-icon-24.png\" alt=\"Delete Job\" style=\"width:20px;height:20px;margin-top: -5px;\"></a></trash>\
      </article>\
      <br>\
    </div>";

    $("#jobs").append(temp);
  });
}

function update() {
  $("#jobs").empty();
  $("#jobs").append("<br>");

  //needs to specify user
  $.get( "/jobs", function( data ) {
    dataTable(data.jobs);
  });
}

function deleteJob(id) {
  jQuery.post('/positions/delete/'+id, {
    }, function() {
      update();
    });
}

window.onload = function() {
  update();
}
