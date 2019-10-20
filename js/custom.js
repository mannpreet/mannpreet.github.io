var spinner = $('.loader');
spinner.addClass('spin');
var teamArrray = [];
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
    teamArray = values.reduce(function (aggregator, teamInformtaion) {
        return aggregator.concat(teamInformtaion);
    });
    console.log('Team Array',teamArray);
    //Set contains unique values
    const distinctAge = [...new Set(teamArray.map(ageArray => ageArray.age))];
    $('#selectByAge').append(
        distinctAge.map(function(ageArraydistinct) {
        	return `<option value="${ageArraydistinct}">${ageArraydistinct}</option>`
        })
    );
    populateCricketTeamTable(teamArray);
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
var searchContent, searchContentLength, debounceFunction;
$('#searchMain').keyup(function() {
  var search = $(this).val().toLowerCase();
    // Search Text
  if(debounceFunction) {
      clearTimeout(debounceFunction);
  }
  debounceFunction = setTimeout(function() {
    console.time("filteration"); 
    var searchContentArray = teamArray;
    if(search.length) {
      searchContentArray = teamArray.filter((teamMember) => {
        return (teamMember.firstName + teamMember.lastName + teamMember.state + teamMember.gender + skillSet(teamMember.skills).join(' ')).toLowerCase().includes(search);
      });
    }
    console.timeEnd("filteration");   
    console.time("append");
    populateCricketTeamTable(searchContentArray);
    console.timeEnd("append");
  }, 400);
});

// search by age
$('#selectByAge').on('change',function(){
	var selectVal = $(this).val();
  var searchAgeArray = teamArray;
  if(selectVal != "Select By Age") {
    searchAgeArray = teamArray.filter((teamMember) => {
      return teamMember.age == selectVal;
    });
  }
  populateCricketTeamTable(searchAgeArray);
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

function populateCricketTeamTable(modifiedTeamArray) {
  $('#cricketTeamBoard tbody').empty();

  $('#cricketTeamBoard tbody')[0].innerHTML = 
      modifiedTeamArray.map(teamTemplate).join('');
}
