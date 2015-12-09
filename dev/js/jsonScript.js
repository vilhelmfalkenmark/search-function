/**
 * Created by Vilhelm on 15-12-02.
 */
var container = document.getElementsByClassName("adress-container")[0];
var popUpContainer = document.getElementsByClassName("pop-up-container")[0];
var popUpContainerInner = document.getElementsByClassName("pop-up-container-inner")[0];
var highLightCounter = -1; // Räknaren som håller koll på vilken av sökresultaten som vi tabbar mellan.
var resultHeader = document.getElementsByName("result-header")[0];
var popUpIndex;

var row = document.createElement("div");
row.className = "gtr-row";
var studArr = [];
var xmlhttp = new XMLHttpRequest();
var url = "js/students.JSON";

xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    var students = JSON.parse(xmlhttp.responseText);

    var imagePath = "images/student-faces/";

    for (var student in students) {
      var gtrDiv = document.createElement("div");
      gtrDiv.className = "gtr col-3-desk col-4-tab col-6-ml col-12-ms";
      var cardContainer = document.createElement("div");

      if (students[student].man == true) {
        cardContainer.className = "boy card-container";
      } else {
        cardContainer.className = "girl card-container";
      }
      var faceContainer = document.createElement("div");
      faceContainer.className = "face-container";
      //faceContainer.style.backgroundImage = "url(images/nature.jpg)";
      faceContainer.style.backgroundImage = "url(images/students/" + students[student].face + ")";
      var adressTextContainer = document.createElement("div");
      adressTextContainer.className = "adress-text-container";
      adressTextContainer.innerHTML = "<i class='icon flaticon-id17'></i>" + students[student].firstName + " ";
      adressTextContainer.innerHTML += students[student].lastName + "<br> ";
      adressTextContainer.innerHTML += "<i class='icon flaticon-pin71'></i>" + students[student].address + "<br> ";
      adressTextContainer.innerHTML += "<i class='icon placeholder-icon flaticon-pin71'></i>" + students[student].postalNumber + "<br> ";
      adressTextContainer.innerHTML += "<i class='icon placeholder-icon flaticon-pin71'></i>" + students[student].city + "<br> ";
      //adressTextContainer.innerHTML += "Favoritfilm "+students[student].favoriteMovie+"<br> ";
      adressTextContainer.innerHTML += "<i class='icon flaticon-iphone26'></i>" + students[student].phoneNumber + "<br> ";
      adressTextContainer.innerHTML += "<i class='icon flaticon-email5'></i>" + students[student].mail + "<br> ";
      adressTextContainer.innerHTML += "<div class='all-info-link'>Fullständig information</div>";
      cardContainer.appendChild(faceContainer);
      cardContainer.appendChild(adressTextContainer);
      gtrDiv.appendChild(cardContainer);
      row.appendChild(gtrDiv);
      // Anledningen till mellanslaget nedan är så att man kan söka på både för och efternamn och få en highlight.
      studArr.push(students[student].firstName + " " + students[student].lastName + students[student].address + students[student].postalNumber + students[student].city + students[student].phoneNumber);
      console.log(studArr)
    }
    /* FULLSTÄNDIG INFORMATION KNAPP POP-UP FUNKTIONALITET */
    var allInfoLink = document.getElementsByClassName("all-info-link");
    for (var a = 0; a < allInfoLink.length; a++) {
      allInfoLink[a].addEventListener("click", linkPopUp, false)
    }

    function linkPopUp() {
      for (var l = 0; l < allInfoLink.length; l++) {
        if (allInfoLink[l] == this) {
          popUpIndex = l;
          popUpAddress();
        }
      }
    }
    for (var i = 0; i < studArr.length; i++) {
      studArr[i] = studArr[i].toLowerCase();
    }
    var searchResContainer = document.getElementsByClassName("search-result-container")[0];
    var searchStatus = document.getElementsByTagName("h3")[0];
    var input2 = document.getElementsByClassName("input")[0];
    input2.addEventListener("input", findAddress);

    function findAddress() {
      var hits = "träffar";
      var hitIndex = [];
      var inputSmall = document.getElementsByClassName("input")[0].value;
      searchResContainer.innerHTML = "";
      var foundHits = 0;

      inputSmall = inputSmall.toLowerCase();
      for (var j = 0; j < studArr.length; j++) {
        if (studArr[j].indexOf(inputSmall) >= 0 && inputSmall != "") {
          hitIndex.push(j);
        }
      }
      if (hitIndex.length == 1) {
        hits = "träff"
      }
      for (var k = 0; k < hitIndex.length; k++) {
        var searchResult = document.createElement("div");
        searchResult.className = "search-result";
        // searchResult.innerHTML = "<br>";
        searchResult.innerHTML = students[hitIndex[k]].firstName + " " + students[hitIndex[k]].lastName + "<br>";
        //  searchResult.innerHTML += ;
        searchResult.innerHTML += students[hitIndex[k]].address + "<br>";
        searchResult.innerHTML += students[hitIndex[k]].postalNumber + "<br>";
        searchResult.innerHTML += students[hitIndex[k]].city + "<br>";
        searchResult.innerHTML += students[hitIndex[k]].phoneNumber + "<br>";
        foundHits++;
        searchResContainer.appendChild(searchResult);
      }
      searchStatus.innerHTML = "Din sökning på <span class='underline'>" + input2.value + "</span> gav " + foundHits + " " + hits + ".";
      var searchResults = document.getElementsByClassName("search-result");
      var highlightStart = "<span class='highlight'>";
      var highlightEnd = "</span>";
      var regex = new RegExp(inputSmall, "g");
      for (var h = 0; h < searchResults.length; h++) {
        if ((inputSmall != "br") && (inputSmall != "b") && (inputSmall != "r")) // Förhindra att br taggarna skivs ut.
        {
          searchResults[h].innerHTML = searchResults[h].innerHTML.toLowerCase().replace(regex, highlightStart + inputSmall + highlightEnd);
        }
        searchResults[h].addEventListener("mouseover", hoverHighlight)
        searchResults[h].addEventListener("mouseleave", removeHoverHighlight)
      }

      function hoverHighlight() {
        for (var p = 0, l = searchResults.length; p < l; p++) {

          if (searchResults[p].innerHTML == this.innerHTML) {
            searchResults[p].className = "search-result search-result-active";
            for (var index in students) {
              if (searchResults[p].innerHTML.includes(students[index].phoneNumber)) {
                popUpIndex = index;
              }
            }
            document.getElementsByClassName("search-result-active")[0].addEventListener("click", popUpAddress);
          }
        }
      }

      function removeHoverHighlight() {
        for (var p = 0; p < searchResults.length; p++) {
          searchResults[p].className = "search-result"
        }
      }
    }
    var allSearches = document.getElementsByClassName("search-result");
    // console.log(highLightCounter);
    // document.onkeydown = checkKey;
    //
    // function checkKey(e) {
    //   var numberOfHits = allSearches.length;
    //   //console.log(numberOfHits+" Träffar!");
    //   e = e || window.event;
    //
    //   if (e.keyCode == '38') {
    //     if (highLightCounter >= -1) {
    //       highLightCounter--;
    //     }
    //   } else if (e.keyCode == '40') {
    //     if (highLightCounter < numberOfHits - 1) {
    //       highLightCounter++;
    //     }
    //   } else if (e.keyCode == '13') //Enter
    //   {
    //     if (popUpContainer.style.display != "block") {
    //       popUpAddress();
    //     }
    //   }
    // //  highLightSearch();
    // }

    function highLightSearch() {
      for (var n = 0; n < allSearches.length; n++) {
        allSearches[n].className = "search-result";
      }
      allSearches[highLightCounter].className = "search-result search-result-active";
    }

    function popUpAddress() {
      var popUpAddressContainer = document.createElement("div");

      popUpAddressContainer.className = "pop-up-address-container";
      var popUpFaceContainer = document.createElement("div");
      popUpFaceContainer.className = "pop-up-face-container";
      popUpFaceContainer.style.backgroundImage = "url(images/students/" + students[popUpIndex].face + ")";
      popUpAddressContainer.innerHTML = "<i class='icon flaticon-id17'></i>" + students[popUpIndex].firstName + " ";
      popUpAddressContainer.innerHTML += students[popUpIndex].lastName + "<br> ";
      popUpAddressContainer.innerHTML += "<i class='icon flaticon-pin71'></i>" + students[popUpIndex].address + "<br> ";
      popUpAddressContainer.innerHTML += "<i class='icon placeholder-icon flaticon-pin71'></i>" + students[popUpIndex].postalNumber + "<br> ";
      popUpAddressContainer.innerHTML += "<i class='icon placeholder-icon flaticon-pin71'></i>" + students[popUpIndex].city + "<br> ";
      popUpAddressContainer.innerHTML += "<i class='icon flaticon-iphone26'></i>" + students[popUpIndex].phoneNumber + "<br> ";
      popUpAddressContainer.innerHTML += "<i class='icon flaticon-email5'></i>" + students[popUpIndex].mail + "<br> ";

      var popUpQouteContainer = document.createElement("p");
      popUpQouteContainer.innerHTML = "<span class='important-text'>" + students[popUpIndex].firstName + " " + students[popUpIndex].lastName + ":</span>" + " " + students[popUpIndex].quote;

      popUpContainerInner.appendChild(popUpFaceContainer);
      popUpContainerInner.appendChild(popUpAddressContainer);
      popUpContainerInner.appendChild(popUpQouteContainer);

      setTimeout(function() {
        popUpContainerInner.style.opacity = 1
      }, 20);
      popUpContainer.style.display = "block";
      setTimeout(function() {
        popUpContainer.style.opacity = 1
      }, 20);
    }
    document.getElementsByClassName("close-pop-up")[0].addEventListener("click", function() {
      setTimeout(function() {
        popUpContainer.style.opacity = 0
      }, 20);
      setTimeout(function() {
        popUpContainer.style.display = "none";
        popUpContainerInner.innerHTML = "";
      }, 200);
    });
    document.getElementsByTagName("body")[0].addEventListener("click", function() {
      document.getElementsByTagName("input")[0].value = "";
      document.getElementsByClassName("search-result-container")[0].innerHTML = "";
      searchStatus.innerHTML = "&nbsp;";
    });
  }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
container.appendChild(row);
