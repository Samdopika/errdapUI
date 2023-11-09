var bottle_lat_range ='';
var bottle_long_range = '';
var bottle_pressure_range ='';
var bottle_date_range ='';

var ctd_lat_range ='';
var ctd_long_range = '';
var ctd_pressure_range ='';
var ctd_date_range ='';

var additional_Col = '';
var additional_Col_bottle = '';
var additional_Col_ctd = '';

var config = {};

// main ERDDAP site URL
var main_erddap_url;

// Fetch configurations when the page loads
$.getJSON('config.json', function(data) {
  config = data;  // Save the fetched configurations

  // Now you can use the configurations
  main_erddap_url = config.main_erddap_url_config;
});

//cchdo dataset URL
var cchdo_bottle_dataset_url;
var cchdo_ctd_dataset_url;

//query links to gete dropdown menu items
var bottle_expocode_array_query;
var bottle_section_id_array_query;
var ctd_expocode_array_query;

//dataset metadata json URL
var cchdo_bottle_metadata;
var cchdo_ctd_metadata;

console.log("JavaScript is connected!");

const checkbox_array = [
  "profile_id",
  "station",
  "cast",
  "sample",
  "bottle_time",
  "bottle_number",
  "bottle_number_qc",
  "depth",
  "ctd_temperature",
  "ctd_salinity",
  "ctd_salinity_qc",
  "bottle_salinity",
  "bottle_salinity_qc",
  "ctd_oxygen",
  "ctd_oxygen_ml_l_qc",
  "oxygen",
  "oxygen_qc",
  "silicate",
  "silicate_qc",
  "nitrate",
  "nitrate_qc",
  "nitrite",
  "nitrite_qc",
  "phosphate",
  "phosphate_qc",
  "cfc_11",
  "cfc_11_l_qc",
  "cfc_12",
  "cfc_12_qc",
  "sulfur_hexifluoride",
  "sulfur_hexifluoride_l_qc",
  "total_carbon",
  "total_carbon_qc",
  "total_alkalinity",
  "total_alkalinity_qc",
  "fco2",
  "fco2_qc",
  "fco2_temperature",
  "ph_total_h_scale",
  "ph_total_h_scale_qc",
  "ph_temperature",
  "dissolved_organic_carbon",
  "dissolved_organic_carbon_qc",
  "ref_temperature",
  "ref_temperature_qc",
  "del_carbon_13_dic",
  "del_carbon_13_dic_qc",
  "del_carbon_14_dic",
  "del_carbon_14_dic_qc",
  "particulate_organic_carbon",
  "particulate_organic_carbon_l_qc",
  "total_dissolved_nitrogen",
  "particulate_organic_nitrogen_l_qc",
  "del_oxygen_18",
  "del_oxygen_18_qc",
  "ctd_fluor_raw",
  "ctd_transmissometer_raw",
  "nitrous_oxide",
  "nitrous_oxide_qc",
  "d15n_nitrite_nitrate",
  "d15n_nitrite_nitrate_qc",
  "d18o_nitrite_nitrate",
  "d18o_nitrite_nitrate_qc",
  "profile_type",
  "geometry_container"
];
const ctd_checkbox_array = [
  "profile_id",
  "station",
  "cast",
  "sample",
  "depth",
  "ctd_temperature",
  "ctd_salinity",
  "ctd_salinity_qc",
  "ctd_oxygen",
  "ctd_fluor_raw",
  "ctd_transmissometer_raw",
  "profile_type",
  "geometry_container",
];
var dropbox_html = '';
var additional_vars_html='';
var bottle_expocode_array = [];
var bottle_section_id_array = [];
var ctd_expocode_array = [];
var ctd_section_id_array = [];

var dataQuery = "";
var dataset_url ='';


function getMetadata(){
  //json index from https://data.pmel.noaa.gov/generic/erddap/info/cchdo_bottle/index.json
  bottle_latMin_index = 9;
  bottle_latMax_index = 8;
  bottle_longMin_index = 12;
  bottle_longMax_index = 11;
  bottle_pressure_range_index = 127;
  bottle_date_start_index = 30;
  bottle_date_end_index = 29;

  ctd_latMin_index = 9;
  ctd_latMax_index = 8;
  ctd_longMin_index = 12;
  ctd_longMax_index = 11;
  ctd_pressure_range_index = 92;
  ctd_date_start_index = 28;
  ctd_date_end_index = 27;

  //min max from bottle_meta
  $.ajax( {
      url: cchdo_bottle_metadata,
      dataType: 'jsonp',
      jsonp: '.jsonp',
      cache: 'true',
      success: function(data) {
        var response = data.table.rows;
          bottle_lat_range=Math.floor(response[bottle_latMin_index][4]) + ' to ' + Math.ceil(response[bottle_latMax_index][4]);
          bottle_long_range = Math.floor(response[bottle_longMin_index][4]) + ' to ' + Math.ceil(response[bottle_longMax_index][4]);
          pressureMinMax = response[bottle_pressure_range_index][4].split(",");
          bottle_pressure_range = Math.floor(pressureMinMax[0]) + ' to ' + Math.ceil(pressureMinMax[1]);
          bottle_date_range = response[bottle_date_start_index][4].split("-")[0] + ' to present' ;

          $('#lat_range').text(bottle_lat_range);
          $('#long_range').text(bottle_long_range);
          $('#pressure_range').text(bottle_pressure_range);
          $('#date_range').text(bottle_date_range);
          console.log($('#lat_range').text);
      },
      error: function(xhr, ajaxOptions, thrownError){
        if (xhr.status==404){
          console.log("failed to get metadata");
        }
      }
   });

   //min max from ctd_meta
   $.ajax( {
       url: cchdo_ctd_metadata,
       dataType: 'jsonp',
       jsonp: '.jsonp',
       cache: 'true',
       success: function(data) {
         var response = data.table.rows;
           ctd_lat_range=Math.floor(response[ctd_latMin_index][4]) + ' to ' + Math.ceil(response[ctd_latMax_index][4]);
           ctd_long_range = Math.floor(response[ctd_longMin_index][4]) + ' to ' + Math.ceil(response[ctd_longMax_index][4]);
           pressureMinMax = response[ctd_pressure_range_index][4].split(",");
           ctd_pressure_range = Math.floor(pressureMinMax[0]) + ' to ' + Math.ceil(pressureMinMax[1]);
           ctd_date_range = response[ctd_date_start_index][4].split("-")[0] + ' to present' ;
       },
       error: function(xhr, ajaxOptions, thrownError){
         if (xhr.status==404){
           console.log("failed to get metadata");
         }
       }
    });

   //get bottle_expo_code dropdownlist
   $.ajax( {
       url: bottle_expocode_array_query,
       dataType: 'jsonp',
       jsonp: '.jsonp',
       cache: 'true',
       success: function(data) {
         var response = data.table.rows;
         var select = document.getElementById("expocode");
           $.each(response, function(key, row) {
                bottle_expocode_array.push(row);
                var el = document.createElement("option");
                el.textContent = row;
                el.value = row;
                select.appendChild(el);
           });
       },
       error: function(xhr, ajaxOptions, thrownError){
         if (xhr.status==404){
           console.log("failed to get metadata");
         }
       }
    });

    //get bottle_section_id dropdownlist

    $.ajax( {
        url: bottle_section_id_array_query,
        dataType: 'jsonp',
        jsonp: '.jsonp',
        cache: 'true',
        success: function(data) {
          var response = data.table.rows;
          var select = document.getElementById("section_id");
            $.each(response, function(key, row) {
                 bottle_section_id_array.push(row);
                 var el = document.createElement("option");
                 el.textContent = row;
                 el.value = row;
                 select.appendChild(el);
            });
        },
        error: function(xhr, ajaxOptions, thrownError){
          if (xhr.status==404){
            console.log("failed to get metadata");
          }
        }
     });

     //get ctd_expo_code dropdownlist
     $.ajax( {
         url: ctd_expocode_array_query,
         dataType: 'jsonp',
         jsonp: '.jsonp',
         cache: 'true',
         success: function(data) {
           var response = data.table.rows;
           var select = document.getElementById("expocode");
             $.each(response, function(key, row) {
                  ctd_expocode_array.push(row);
             });
         },
         error: function(xhr, ajaxOptions, thrownError){
           if (xhr.status==404){
             console.log("failed to get metadata");
           }
         }
      });

      //get ctd_section_id dropdownlist
      /* section_id no long exist in CTD
      $.ajax( {
          url: ctd_section_id_array_query,
          dataType: 'jsonp',
          jsonp: '.jsonp',
          cache: 'true',
          success: function(data) {
            var response = data.table.rows;
            var select = document.getElementById("section_id");
              $.each(response, function(key, row) {
                   ctd_section_id_array.push(row);
              });
          },
          error: function(xhr, ajaxOptions, thrownError){
            if (xhr.status==404){
              console.log("failed to get metadata");
            }
          }
       });
       */

}

function updateMeta(dataset){
  //this function udpates min/max displayed based on dataset selection
  $('#expocode').empty();
  $('#section_id').empty();

  var expocode_select = document.getElementById("expocode");
  var section_id_select = document.getElementById("section_id");

  var el = document.createElement("option");
  el.textContent = "Choose";
  expocode_select.appendChild(el);
  var el1 = document.createElement("option");
  el1.textContent = "Choose";
  section_id_select.appendChild(el1);

  if(dataset =="bottle"){
    additional_Col = additional_Col_bottle;
    dataset_url = cchdo_bottle_dataset_url;

    $('#lat_range').text(bottle_lat_range);
    $('#long_range').text(bottle_long_range);
    $('#pressure_range').text(bottle_pressure_range);
    $('#date_range').text(bottle_date_range);
    $('#section_id_row').show();

    bottle_expocode_array.forEach(function(data){
      var el = document.createElement("option");
      el.textContent = data;
      el.value = data;
      expocode_select.appendChild(el);
    });
    bottle_section_id_array.forEach(function(data){
      var el = document.createElement("option");
      el.textContent = data;
      el.value = data;
      section_id_select.appendChild(el);
    });
  } else if(dataset =="ctd"){
    $('#section_id_row').hide();
    additional_Col = additional_Col_ctd;
    dataset_url = cchdo_ctd_dataset_url;

    ctd_expocode_array.forEach(function(data){
      var el = document.createElement("option");
      el.textContent = data;
      el.value = data;
      expocode_select.appendChild(el);
    });
    ctd_section_id_array.forEach(function(data){
      var el = document.createElement("option");
      el.textContent = data;
      el.value = data;
      section_id_select.appendChild(el);
    });

    $('#lat_range').text(ctd_lat_range);
    $('#long_range').text(ctd_long_range);
    $('#pressure_range').text(ctd_pressure_range);
    $('#date_range').text(ctd_date_range);
  }
  resetAll();
}

function getTable() {
    // in the javascript, where you would ordinarily initialize the datatable
    var newTable = '<thead><tr>'; // start building a new table contents
    var dataCond ='';
    var search_Data = [];
    dataQuery = "";
    search_url = dataset_url+".json?";

    //columns to display
    is_bottle = dataset_url.includes("cchdo_bottle");
    var dataCol = 'latitude%2Clongitude%2Ctime%2Cexpocode%2Cpressure';
    if(is_bottle){
      dataCol += '%2Csection_id';
    }

    var latMin = document.getElementById("lat_min").value;
    var latMax = document.getElementById("lat_max").value;
    if((latMin) && (latMax)){
      search_Data.push(['latitude',latMin,latMax]);
    }

    var longMin = document.getElementById("long_min").value;
    var longMax = document.getElementById("long_max").value;
    if((longMin) && (longMax)){
      search_Data.push(['longitude',longMin,longMax]);
    }

    var pressureMin = document.getElementById("pressure_min").value;
    var pressureMax = document.getElementById("pressure_max").value;
    if((pressureMin) && (pressureMax)){
      search_Data.push(['pressure',pressureMin,pressureMax]);
    }

    var dateMin = document.getElementById("date_min").value;
    var dateMax = document.getElementById("date_max").value;
    if((dateMin) && (dateMax)){
      if(dateMin.length == 4)
      {
        dateMin = dateMin+"-01-01";
      }
      if(dateMax.length == 4)
      {
        dateMax = dateMax+"-12-31";
      }
      search_Data.push(['time',dateMin,dateMax]);
    }

    var expocode = document.getElementById("expocode").value;
    if(expocode != "Choose"){
      search_Data.push(['expocode',expocode,'']);
    }

    var section_id = document.getElementById("section_id").value;
    if(section_id!= "Choose" && section_id!= "" && section_id!= "------"){
      search_Data.push(['section_id',section_id,'']);
    }

    if(search_Data.length > 0){
      //add checked Variables to query
      let allCheckBox = document.querySelectorAll('.additional_var_class')
        for (let i = 0; i < allCheckBox.length; i++) {
            if (allCheckBox[i].checked) {
              item_name = allCheckBox[i].id.split('box_')[1];
              if((item_name =="section_id") || (item_name =="station")||(item_name =="cast")||(item_name =="sample")){
                var item_one_val = document.getElementById(item_name).value;
                if(item_one_val){
                  search_Data.push([item_name,item_one_val,'']);
                }
              }else{
                var item_Min = document.getElementById(item_name+"_min").value;
                var item_Max = document.getElementById(item_name+"_max").value;
                if((item_Min) && (item_Max)){
                  search_Data.push([item_name,item_Min,item_Max]);
                }
              }

              dataCol += "%2C" + item_name;
            }
        }

      for(let i = 0; i< search_Data.length; i++){
        //dataCol += search_Data[i][0];
        if ((search_Data[i][0] != 'expocode') && (search_Data[i][0] != 'section_id')
            && (search_Data[i][0] != 'profile_id') && (search_Data[i][0] != 'station')
            && (search_Data[i][0] != 'cast')&& (search_Data[i][0] != 'sample')){
          dataCond += '&'+search_Data[i][0]+'>='+search_Data[i][1]+'&'+search_Data[i][0]+'<='+search_Data[i][2];
        }
        else{
          if(search_Data[i][0] == 'cast'){
            dataCond+= '&'+search_Data[i][0]+'='+search_Data[i][1];
          } else{
            dataCond+= '&'+search_Data[i][0]+'="'+search_Data[i][1]+'"';
          }

        }
      }

      search_url +=dataCol+dataCond;
      dataQuery += dataCol+additional_Col+dataCond;
      document.getElementById("data_download").style.display = "none";
      console.log(search_url);

      if($.fn.DataTable.isDataTable( '#result_table' )){
        $('#result_table').DataTable().destroy();
      }
      $('#result_table').html("<h2>Fetching data from server...</h2>");
      $("#updateTable_btn").hide();
      $('#result_table_div').show();

      // then call the data using .ajax()
      $.ajax( {
          url: search_url,
          dataType: 'jsonp',
          jsonp: '.jsonp',
          cache: 'true',
          success: function(data) {
            var response = data.table

              //
              //result table
              /*
              // below use the first row to grab all the column names and set them in <th>s
              $.each(response.columnNames, function(key, value) {
                  newTable += "<th>" + value + "</th>";
              });
              newTable += "</tr></thead><tbody>";

              // then load the data into the table
              $.each(response.rows, function(key, row) {
                   newTable += "<tr>";
                    $.each(row, function(key, fieldValue) {
                         newTable += "<td>" + fieldValue + "</td>";
                    });
                   newTable += "</tr>";
              });
             newTable += '<tbody>';

             $('#result_table').html(newTable); // replace the guts of the datatable's table placeholder with the stuff we just created.

             $('#result_table').DataTable({
               scrollY:        "60vh",
               scrollCollapse: true,
               fixedHeader: true,
               paging:         false,
               searching: false,
             }).draw();
              */

             $("#data_download").show();
             $("#updateTable_btn").show();
             getfileType();
             $('#result_table_div').hide();

             var data_found_text = response.rows.length +" profiles found";
             $('#data_found').html(data_found_text);
          },
          error: function(xhr, ajaxOptions, thrownError){
            if (xhr.status==404){
              //$('#result_table').DataTable().destroy();
              $("#data_download").hide();
              $("#updateTable_btn").hide();
              showNoresult();
              console.log("404");
            }
          }
       });
   }
  }
  function resetAll(){
    document.getElementById("lat_min").value = null;
    document.getElementById("lat_max").value = null;

    document.getElementById("long_min").value = null;
    document.getElementById("long_max").value = null;

    document.getElementById("pressure_min").value = null;
    document.getElementById("pressure_max").value = null;

    document.getElementById("date_min").value = null;
    document.getElementById("date_max").value = null;

    document.getElementById("expocode").value = "Choose";
    document.getElementById("section_id").value = "Choose";

    document.getElementById("result_table_div").style.display = "none";
    document.getElementById("data_download").style.display = "none";
    document.getElementById("updateTable_btn").style.display = "none";
  }
  function showNoresult(){
    var result = "<h3>No result found!</h3>";
    try {
      $('#result_table_div').show();
      $('#result_table').html(result);
    } catch (e) {alert(e);}
  }

  function getfileType(){
    var result = "";
    try {
      var d = document;
      var ft = d.getElementById("fileType").value;
      result = dataset_url + ft.substring(0, ft.indexOf(" - ")) + "?" ;
      d.getElementById("tUrl").value = result+dataQuery;
    } catch (e) {alert(e);}
  }
  function getfile(){
    var result = "";
    try {
      var d = document;
      var ft = d.getElementById("fileType").value;
      result = dataset_url + ft.substring(0, ft.indexOf(" - ")) + "?" ;
      window.open(result+dataQuery,"_blank");
    } catch (e) {alert(e);}
  }

  function fileType_onchange(){
    getfileType();
  }
  function updateResultTable(){
    var result_table=document.getElementById("result_table_div");
    var show_result_btn = document.getElementById("updateTable_btn");
    if(show_result_btn.value == 'Hide Result Table'){
      show_result_btn.value = "Show Result Table";
      result_table.style.display = "none";
    }else if (show_result_btn.value == 'Show Result Table'){
      show_result_btn.value = "Hide Result Table";
      result_table.style.display = "block";
    }
  }

  function param_checkbox(check_id_name,search_id_name){
    var checkBox = document.getElementById(check_id_name);
    var searc_param =document.getElementById('search_'+search_id_name);
    var searc_input_field = document.getElementById(search_id_name);

    if (checkBox.checked == true){
      searc_param.style.display = "block";
    } else {
      searc_param.style.display = "none";
      searc_input_field.value = '';
    }
  }

  function create_additonal_dropbox(){
            for(let i = 0; i< checkbox_array.length; i++){
              temp_item = '<input type="checkbox" class="additional_var_class" id="chk_box_'+checkbox_array[i]+'" onclick="param_checkbox(\'chk_box_'+checkbox_array[i]+'\','+'\''+checkbox_array[i]+'\')"/> '+checkbox_array[i]+' <br />';
              dropbox_html += temp_item;

              temp_vars = '<div id= "search_'+checkbox_array[i]+'" style="display:none">'+checkbox_array[i]+'<br>';
              if((checkbox_array[i] != 'profile_id') && (checkbox_array[i] != 'station')
                  && (checkbox_array[i] != 'cast')&& (checkbox_array[i] != 'sample')){
                          temp_vars +='<input id="'+checkbox_array[i]+'_min" type="text" placeholder="'+checkbox_array[i]+
                          ' min"><input id="'+checkbox_array[i]+'_max" type="text" placeholder="'+checkbox_array[i]+' max"><br></br></div>';
              } else{
                    temp_vars +='<input id="'+checkbox_array[i]+'" type="text" placeholder="'+checkbox_array[i]+'"><br></br></div>';
              }
              additional_vars_html += temp_vars;
            }
            $('#additional_checkbox').html(dropbox_html);
            $('#additional_vars').html(additional_vars_html);
  }

// Function to display the size of the file
  function getFileSize(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status >= 200 && xhr.status < 300) {
        var size = xhr.getResponseHeader('Content-Length');
        if(size !== null) {
          var sizeInMegabytes = (size / (1024 * 1024)).toFixed(2);
          document.getElementById('fileSizeValue').textContent = sizeInMegabytes;
          document.getElementById('fileSizeDisplay').style.display = 'block';
        } else {
          document.getElementById('fileSizeValue').textContent = 'Size information not available';
        }
      } else {
        document.getElementById('fileSizeValue').textContent = 'Could not get file size';
      }
    }
  };
  xhr.send();
}


  function init_URLs(){
    //cchdo dataset URL
    cchdo_bottle_dataset_url = main_erddap_url + 'tabledap/cchdo_bottle';
    cchdo_ctd_dataset_url = main_erddap_url+ 'tabledap/cchdo_ctd';

    //query links to gete dropdown menu items
    bottle_expocode_array_query = cchdo_bottle_dataset_url + '.json?expocode&distinct()&orderBy(%22expocode%22)';
    bottle_section_id_array_query = cchdo_bottle_dataset_url + '.json?section_id&distinct()&orderBy(%22section_id%22)';
    ctd_expocode_array_query = cchdo_ctd_dataset_url + '.json?expocode&distinct()&orderBy(%22expocode%22)';

    //dataset metadata json URL
    cchdo_bottle_metadata = main_erddap_url + 'info/cchdo_bottle/index.json';
    cchdo_ctd_metadata = main_erddap_url + 'info/cchdo_ctd/index.json';
  }

  $( document ).ready(function() {

    //extra field for download only
    for(let i = 0; i< checkbox_array.length; i++){
        additional_Col_bottle += "%2C" + checkbox_array[i];
    }
    additional_Col = additional_Col_bottle;
    for(let i = 0; i< ctd_checkbox_array.length; i++){
        additional_Col_ctd += "%2C" + ctd_checkbox_array[i];
    }

    //ini init_URLs
    init_URLs();

    //create_additonal_dropbox();
    getMetadata();

    $("#search_btn").on("click", function() {
    });

    $("#fileType").on('change', function() {
      getfileType();
    });

    $('.btn-toggle').click(function() {
        $(this).find('.btn').toggleClass('active');
        $(this).find('.btn').toggleClass('btn-primary');
        $(this).find('.btn').toggleClass('btn-default');
        if($('.active').prop('id')=="bottle_data"){
          dataset_url = cchdo_bottle_dataset_url;
          updateMeta("bottle");
        } else if($('.active').prop('id')=="ctd_data"){
          dataset_url = cchdo_ctd_dataset_url;
          updateMeta("ctd");
        }
    });

    updateMeta("bottle");
  });
