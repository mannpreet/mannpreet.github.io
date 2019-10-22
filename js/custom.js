$(function(){
  var spinner = $('.loader');
  spinner.addClass('spin');
  var teamArrray = [];
  var paginationObj = {
    currentPage: 0,
    pageSize: 10
  };
  var sortingObj = {
    currentOrder: null,
    columnName: null
  };
  var currentTeam;
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
      changeCricketersList(teamArray);
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
    // Debounce for fast typing
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
      changeCricketersList(searchContentArray);
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
    changeCricketersList(searchAgeArray);
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

  function changeCricketersList(modifiedTeamArray) {
    sortAndPaginate(modifiedTeamArray);
  }

  function resetPageStart() {
    paginationObj.currentPage = 0;
    $('.jump-to-page input').val('');
  }

  function previousPage() {
    if(paginationObj.currentPage !== 0) {
      paginationObj.currentPage -= 1;
      paginateAndAppendToTable();
    }
  }

  function changePageSize(pageSize) {
    if(!isNaN(pageSize) && typeof(pageSize) === "number" && pageSize >= 1){
      paginationObj.pageSize = pageSize;  
      resetPageStart();    
      paginateAndAppendToTable();
    }
  }

  function jumpToPage(pageNumber) {
    if(!isNaN(pageNumber) && typeof(pageNumber) === "number" && pageNumber >= 1 && pageNumber <= Math.ceil(currentTeam.length / paginationObj.pageSize)){
      paginationObj.currentPage = pageNumber - 1;
      paginateAndAppendToTable();
    }
  }

  function goToFirstPage() {
    paginationObj.currentPage = 0;
    paginateAndAppendToTable();
  }

  function goToLastPage() {
    paginationObj.currentPage = Math.ceil(currentTeam.length / paginationObj.pageSize) - 1;
    paginateAndAppendToTable();
  }

  function nextPage() {
    if(paginationObj.currentPage + 1 !== Math.ceil(currentTeam.length / paginationObj.pageSize)) {
      paginationObj.currentPage += 1;
      paginateAndAppendToTable();
    }
  }

  function paginateAndAppendToTable() {
    modifyCricketTeamTable(currentTeam.slice(paginationObj.currentPage * paginationObj.pageSize, (paginationObj.currentPage + 1) * paginationObj.pageSize));
  }

  function modifyCricketTeamTable(paginatedTeam) {
    $('#cricketTeamBoard tbody')[0].innerHTML = 
      paginatedTeam.map(teamTemplate).join('');
      $('.page-view')[0].innerHTML = pageDescription();
  }
  function pageDescription() {
    return `
    page ${paginationObj.currentPage + 1} of ${Math.ceil(currentTeam.length / paginationObj.pageSize)}
    `
  }

  $('#firstPage').click(goToFirstPage);
  $('#lastPage').click(goToLastPage);
  $('#prevPage').click(previousPage);
  $('#nextPage').click(nextPage);
  $('#itemsPerPage').on('change', function(e) {
      var currentPageValue = parseInt(e.currentTarget.value);
      changePageSize(currentPageValue);
  });
  $('.jump-to-page input').keyup(function(e){
    var currentJumpPage = parseInt($(this).val());
    jumpToPage(currentJumpPage);
  });


   // Sorting Implementation
  $('#cricketTeamBoard th').click(function() {
    var currentSortColumn = $(this);
    var currentIcon = currentSortColumn.find('i');
    if(sortingObj.columnName) {
      var previousSortColumn = $('th[data-column="' + sortingObj.columnName + '"]');
      var previousSortIcon = previousSortColumn.children('i');
      // If the same column is clicked
      if(currentSortColumn.data('column') === sortingObj.columnName) {
        if(sortingObj.currentOrder === "ascending") {
          sortingObj.currentOrder = "descending";
          previousSortIcon.removeClass('fa-sort-up').addClass('fa-sort-down');
        } else {
          sortingObj.currentOrder = "ascending";
          previousSortIcon.removeClass('fa-sort-down').addClass('fa-sort-up');
        }
      } else {
        sortingObj.currentOrder = "ascending";
        currentIcon.removeClass('fa-sort').addClass('fa-sort-up');
        previousSortIcon.removeClass('fa-sort-up fa-sort-down').addClass('fa-sort');
      }
    } else {
      // Keep default sort order as ascending
      sortingObj.currentOrder = "ascending";
      currentIcon.removeClass('fa-sort').addClass('fa-sort-up');
    }
    sortingObj.columnName = currentSortColumn.data('column');
    sortAndPaginate(currentTeam);
  });

  function sortCricketers(cricketersList) {
    var sortedTeam = cricketersList;
    if(sortingObj.columnName) {
      sortedTeam = cricketersList.sort(function(a, b) {
        var firstColumn, secondColumn;
        if(typeof a[sortingObj.columnName] === 'string' && typeof b[sortingObj.columnName] === 'string') {
          firstColumn = a[sortingObj.columnName].toUpperCase();
          secondColumn = b[sortingObj.columnName].toUpperCase();
        } else {
          firstColumn = a[sortingObj.columnName];
          secondColumn = b[sortingObj.columnName];
        }
        if(sortingObj.currentOrder === "ascending") {
          return sortAsc(firstColumn, secondColumn);
        } else {
          return sortDesc(firstColumn, secondColumn);
        }      
      });
    }
    return sortedTeam;
  }

  function sortAsc(firstColumn, secondColumn) {
    if(firstColumn < secondColumn) {
      return -1;
    }
    if(firstColumn > secondColumn) {
      return 1;
    }
    return 0;
  }
  function sortDesc(firstColumn, secondColumn) {
    if(firstColumn > secondColumn) {
      return -1;
    }
    if(firstColumn < secondColumn) {
      return 1;
    }
    return 0;
  }

  function sortAndPaginate(modifiedTeamArray) {
    currentTeam = sortCricketers(modifiedTeamArray);
    resetPageStart();
    paginateAndAppendToTable();
  }

})


