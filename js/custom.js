var spinner = $('.loader');
spinner.addClass('spin');
var promise1 = new Promise((resolve,reject) => {
    $.ajax({
        url: 'https://www.json-generator.com/api/json/get/bVPJtfmTxe?indent=0',
        type: 'GET',
        success: function(data) {
            resolve(data)
        },
        error: function(error){
            reject(error)
        },
    })
});
var promise2 = new Promise((resolve,reject) => {
    $.ajax({
        url: 'https://www.json-generator.com/api/json/get/cegcvaSlea?indent=0',
        type: 'GET',
        success: function(data) {
            resolve(data)
        },
        error: function(error){
            reject(error)
        },
    })
});

Promise.all([promise1, promise2]).then(function(values){
    console.log("PromiseAll", values);
    $('.loader').hide();
    var teamArray = values.reduce(function (aggregator, teamInformtaion) {
        return aggregator.concat(teamInformtaion);
    });
    console.log('Team Array',teamArray);
    const distinctAge = [...new Set(teamArray.map(ageArray => ageArray.age))];
    $('#selectByAge').append(
        distinctAge.map(function(ageArraydistinct){
        	return `<option value="${ageArraydistinct}">${ageArraydistinct}</option>`
        })
    )
    $('#cricketTeamBoard tbody').append(
        teamArray.map(teamTemplate)
    )
});
function skillSet(skills) {
  return skills.map(skill => `${skill.primary}, ${skill.secondary}`)  
}
function teamTemplate(teamMember) {
  return `
  <tr>
  <td>${teamMember.firstName}</td>
  <td>${teamMember.lastName}</td>
  <td>${teamMember.age}</td>
  <td>${teamMember.gender}</td>
  <td>${skillSet(teamMember.skills)}</td>
  <td>${teamMember.state}</td>
  </tr>
  `
}

// search by column
var searchContent, searchContentLength;
$('#searchMain').keyup(function(){
    // Search Text
  var search = $(this).val();
  $('table tbody tr').hide();
  searchContent = $('table tbody tr:not(.no-records) td:contains("'+search+'")');
  showFields();
});

// search by age
$('#selectByAge').on('change',function(){
	var selectVal = $(this).val();
	$('table tbody tr').hide();
  searchContent = $('table tbody tr:not(.no-records) td:nth-child(3):contains("'+selectVal+'")');
  showFields();
});

function showFields() {
	searchContentLength = searchContent.length;
  if(searchContentLength > 0){
    searchContent.each(function(){
       $(this).closest('tr').show();
    });
  }else{
    $('.no-records').show();
  }
}



