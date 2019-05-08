google.charts.load('current', {packages:["orgchart"]});
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                $.get('/employees/1', function(jsonData){
                    
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Name');
                    data.addColumn('string', 'Manager');
                    data.addColumn('string', 'Email');
                    $.each(jsonData.employees, function(i,v){
                        var name = v.firstname + " " + v.lastname;
                        data.addRow([{v:v.id.toString(), f:"<div style=\"color:green\">" + name +"</div>"}, (v.manager) == null ? "" : v.manager.toString(), v.email]);
                    });
                    // Create the chart.
                    var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
                    // Draw the chart, setting the allowHtml option to true for the tooltips.
                    chart.draw(data, {allowCollapse:true, allowHtml:true, 'size':'large', 'color':'#fff', 'selectionColor':'#c1c1c1'});
            });
        }