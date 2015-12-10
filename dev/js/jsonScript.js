  /*===========================================
  =============================================
  ALLMÄNA VARIABLER SOM BEHÖVER DEKLARERAS HÄR
  EFTERSOM DE ANVÄNDS LÄNGRE NER.
  =============================================
  ============================================= */
var container = document.getElementsByClassName("adress-container")[0];
var popUpContainer = document.getElementsByClassName("pop-up-container")[0];
var popUpContainerInner = document.getElementsByClassName("pop-up-container-inner")[0];
var highLightCounter = -1; // Räknaren som håller koll på vilken av sökresultaten som vi tabbar mellan.
var resultHeader = document.getElementsByName("result-header")[0];
var popUpIndex;
var overlay = document.getElementsByClassName('overlay')[0];
var row = document.createElement("div");
row.className = "gtr-row";
var studArr = [];
var xmlhttp = new XMLHttpRequest();
var url = "js/students.JSON";
var imagePath = "images/student-faces/";

    /*===========================================
    =============================================
    VÅRT REQUEST FÖR ATT PLOCKA HEM DATAN
    =============================================
    ============================================= */
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    var students = JSON.parse(xmlhttp.responseText);

    /*===========================================
    =============================================
    LOOPA IGENOM JSON OBJEKTET OCH SKAPA
    VÅRA ADRESSKORT I HTML-STRUKTUREN.
    =============================================
    ============================================= */
    for (var student in students) {
      var gtrDiv = document.createElement("div");
      gtrDiv.className = "gtr col-3-desk col-4-tab col-6-ml col-12-ms";
      var cardContainer = document.createElement("div");
      cardContainer.className = "card-container";
      var faceContainer = document.createElement("div");
      faceContainer.className = "face-container";
      faceContainer.style.backgroundImage = "url(images/students/" + students[student].face + ")";
      var adressTextContainer = document.createElement("div");
      adressTextContainer.className = "adress-text-container";
      adressTextContainer.innerHTML = "<i class='icon flaticon-id17'></i>" + students[student].firstName + " ";
      adressTextContainer.innerHTML += students[student].lastName + "<br> ";
      //adressTextContainer.innerHTML += "<i class='icon flaticon-pin71'></i>" + students[student].address + "<br> ";
      //adressTextContainer.innerHTML += "<i class='icon placeholder-icon flaticon-pin71'></i>" + students[student].postalNumber + "<br> ";
      adressTextContainer.innerHTML += "<i class='icon flaticon-pin71'></i>" + students[student].city + "<br> ";
      //adressTextContainer.innerHTML += "Favoritfilm "+students[student].favoriteMovie+"<br> ";
      adressTextContainer.innerHTML += "<i class='icon flaticon-iphone26'></i>" + students[student].phoneNumber + "<br> ";
      adressTextContainer.innerHTML += "<i class='icon flaticon-email5'></i><a href='mailto:" + students[student].mail + "'>" + students[student].mail + "</a><br> ";
      adressTextContainer.innerHTML += "<div class='all-info-link'>Fullständig information</div>";
      cardContainer.appendChild(faceContainer);
      cardContainer.appendChild(adressTextContainer);
      gtrDiv.appendChild(cardContainer);
      row.appendChild(gtrDiv);
      // Anledningen till mellanslaget nedan är så att man kan söka på både för och efternamn och få en highlight.
      studArr.push(students[student].firstName + " " + students[student].lastName + students[student].address + students[student].postalNumber + students[student].city + students[student].phoneNumber);
    }
    /* FULLSTÄNDIG INFORMATION KNAPP POP-UP FUNKTIONALITET */


    /*===========================================
    =============================================
    ALLA DATA ÄR NU PUSHAT IN I ARRAYEN studArr
    SOM ÄR DEN VI ANVÄNDER SOM UNDERLAG FÖR SÖKET.
    NU GÖR VI ALLT TILL SMÅ BOKSTÄVER FÖR ATT
    KUNNA SÖKA IGENOM DEN LÄTTARE.
    =============================================
    ============================================= */
    for (var i = 0; i < studArr.length; i++) {
      studArr[i] = studArr[i].toLowerCase();
    }

    /*===========================================
    =============================================
    ALLA DATA ÄR NU PUSHAT IN I ARRAYEN studArr
    SOM ÄR DEN VI ANVÄNDER SOM UNDERLAG FÖR SÖKET.
    NU GÖR VI ALLT TILL SMÅ BOKSTÄVER FÖR ATT
    KUNNA SÖKA IGENOM DEN LÄTTARE.
    =============================================
    ============================================= */
    function linkPopUp() {
      for (var l = 0; l < allInfoLink.length; l++) {
        if (allInfoLink[l] == this) {
          popUpIndex = l;
          popUpAddress();
        }
      }
    }

    /*===========================================
    =============================================
    VI PLOCKAR HEM ALLA LÄNKAR SOM LIGGER I KORTEN
    OCH BINDER CLICK-EVENTET TILL DEM. NÄR DE KLICKAS
    KALLAR VI PÅ FUNKTIONEN linkPopUp
    =============================================
    ============================================= */
    var allInfoLink = document.getElementsByClassName("all-info-link");
    for (var a = 0; a < allInfoLink.length; a++) {
      allInfoLink[a].addEventListener("click", linkPopUp)
    }

    /*===========================================
    =============================================
    PLOCKAR HEM DIVEN SOM SÖKRESULTATEN SENARE
    KOMMER HAMNA I. VI PLOCKAR ÄVEN HEM INPUTFÄLTET
    SOM VI SKRIVER I OCH BINDER SÖK-EVENTET SAMT
    OPACITY-EVENTET SOM SKER NÄR MAN SKRIVER EN
    BOKSTAV.
    =============================================
    ============================================= */
    var searchResContainer = document.getElementsByClassName("search-result-container")[0];
    var searchStatus = document.getElementsByTagName("h3")[0];
    var input = document.getElementsByClassName("input")[0];
    input.addEventListener("input", animateOpacity);
    input.addEventListener("input", findAddress);

    /*===========================================
    =============================================
    FUNKTIONEN SOM SKAPAR OPACITYEFFEKTEN NÄR
    MAN SKRIVER NÅGOT I INPUT-FÄLTET.
    =============================================
    ============================================= */
    function animateOpacity() {
      if (document.getElementsByTagName("input")[0].value != "") {
        overlay.style.display = "block";
        overlay.style.opacity = 1;
      } else {
        overlay.style.opacity = 0;
        overlay.style.display = "none";
      }
    }

    /*===========================================
    =============================================
    SÖKFUNKTIONEN SOM SKAPAR DROP-DOWN NÄR NÅGOT
    SOM SKRIVS MATCHAS MOT JSON-OBJEKTEN.
    NOTERA ATT DENNA FUNKTION KÖRS VARJE GÅNG
    MAN SKRIVER ETT TECKEN I INPUTFÄLTET.
    =============================================
    ============================================= */
    function findAddress() {


      highLightCounter = -1; // Räknaren som håller koll på vilken av sökresultaten som vi tabbar mellan.
      var hits = "träffar";
      var hitIndex = []; // Array som kommer kolla vilken plats i studArr-arrayen som träffarna har.
      var inputSmall = document.getElementsByClassName("input")[0].value; // Det vi skriver i inputfältet.
      searchResContainer.innerHTML = "";
      var foundHits = 0; // Räknaren som kollar hur många träffar vi får.

      /*===========================================
      =============================================
      VI GÖR OM ALLT VI SKRIVER TILL SMÅ BOKSTÄVER
      SÅ ATT VI KAN MATCHA DET EXAKT MOT DET SOM
      TIDIGARE BLEV INPUSHAT I studArr. FÅR VI EN
      TRÄFF PUSHAR VI IN DESS INDEX I TIDIGARE
      DEKLARERADE hitIndex.
      =============================================
      ============================================= */
      inputSmall = inputSmall.toLowerCase();
      for (var j = 0; j < studArr.length; j++) {
        if (studArr[j].indexOf(inputSmall) >= 0 && inputSmall != "") {
          hitIndex.push(j);
        }
      }
      if (hitIndex.length == 1) {
        hits = "träff"
      }

      /*===========================================
      =============================================
      FÖR VARJE TRÄFF SKAPAR VI EN DIV SOM HETER
      searchResult SOM LÄGGS TILL I TIDIGARE
      DEKLARERADE VARIABLEN searchResContainer.
      =============================================
      ============================================= */
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
        searchResult.innerHTML += students[hitIndex[k]].mail + "<br>";
        foundHits++;
        searchResContainer.appendChild(searchResult);
      }

      /*===========================================
      =============================================
      HIGHLIGHTNING AV MATCHARNA MOT DET SOM SKRIVS
      OCH DET SOM FINNS I OBJEKTEN.
      =============================================
      ============================================= */
      searchStatus.innerHTML = "Din sökning på <span class='underline'>" + input.value + "</span> gav " + foundHits + " " + hits + ".";
      var searchResults = document.getElementsByClassName("search-result");
      var highlightStart = "<span class='highlight'>";
      var highlightEnd = "</span>";
      var regex = new RegExp(inputSmall, "g");
      for (var h = 0; h < searchResults.length; h++) {
        if ((inputSmall != "br") && (inputSmall != "b") && (inputSmall != "r")) // Förhindra att br taggarna skivs ut.
        {
          searchResults[h].innerHTML = searchResults[h].innerHTML.toLowerCase().replace(regex, highlightStart + inputSmall + highlightEnd);
        }
        /* BIND VARJE SÖKRESULTAT TILL MUSEVENT FÖR ATT KOLLA NÄR VI FÖR MUSEN ÖVER SAMT NÄR LÄMNAR */
        searchResults[h].addEventListener("mouseover", hoverHighlight)
        searchResults[h].addEventListener("mouseleave", removeHoverHighlight)
      }

      /*===========================================
      =============================================
      LOOPA IGENOM ALLA SÖKRESULTAT OCH KOLLA VART
      MATCHEN FINNS. THIS I DET HÄR FALLET BLIR
      JU DEN DIVEN SOM MAN HAR MUSEN ÖVER.
      =============================================
      ============================================= */
      function hoverHighlight() {
        for (var p = 0, l = searchResults.length; p < l; p++) {

          if (searchResults[p].innerHTML == this.innerHTML) {
            searchResults[p].className = "search-result search-result-active";
            highLightCounter = p;
            for (var index in students) {
              if (searchResults[p].innerHTML.includes(students[index].phoneNumber)) {
                popUpIndex = index;
              }
            }
            /* BIND EVENT ENDAST TILL DEN DIVEN SOM HAR KLASSEN ACTIVE EFTERSOM DET BARA ÄR DEN MAN ÄR INTRESSERAD AV*/
            document.getElementsByClassName("search-result-active")[0].addEventListener("click", popUpAddress);
          }
        }
      }
      /*===========================================
      =============================================
      TA BORT HIGHLIGHTNING.
      =============================================
      ============================================= */
      function removeHoverHighlight() {
        for (var p = 0; p < searchResults.length; p++) {
          searchResults[p].className = "search-result"
        }
      }
    }

    /*===========================================
    =============================================
    MAN KAN ÄVEN ANVÄNDA UPP OCH NED TANGENTERNA
    FÖR ATT TABBA SIG IGENOM SÖKRESULTATEN.
    =============================================
    ============================================= */
    var allSearches = document.getElementsByClassName("search-result");
    document.onkeydown = checkKey;

    function checkKey(e) {
      var numberOfHits = allSearches.length;
      if (e.keyCode == '38') // Upp
      {
        if (highLightCounter > 0) {
          highLightCounter--;
        }
      } else if (e.keyCode == '40') // Ner
      {
        if (highLightCounter < numberOfHits-1)
        {
          highLightCounter++;
        }
      } else if (e.keyCode == '13') //Enter
      {
        overlay.style.display = "none";
        if (popUpContainer.style.display != "block") {
          var active = document.getElementsByClassName('search-result-active')[0];
          for (var index in students) {
            if (active.innerHTML.includes(students[index].phoneNumber)) {
              popUpIndex = index;
            }
          }
          popUpAddress();
        }
      }
      highLightSearch();
    }
    /*===========================================
    =============================================
    SÄTT ALLA SÖKRESULTAT TILL INTE AKTIV FÖRRUTOM
    DEN SOM MATCHAR HIGHCOUNTER SOM ALLTSÅ ÄR ETT
    VÄRDE MELLAN 0 OCH SÅ PASS MÅNGA TRÄFFAR MAN
    FÅTT PÅ SIN SÖKNING
    =============================================
    ============================================= */
    function highLightSearch() {
      for (var n = 0; n < allSearches.length; n++) {
        allSearches[n].className = "search-result";
      }
      allSearches[highLightCounter].className = "search-result search-result-active";
    }

    /*===========================================
    =============================================
    POP-UP-MODAL SOM SKER NÄR MAN VILL VETA ALLT
    OM NÅGON PERSON I ANTINGEN SÖKET ELLER
    GENOM ATT KLICKA PÅ allInfoLink. SE OVAN.
    =============================================
    ============================================= */
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
      popUpAddressContainer.innerHTML += "<i class='icon flaticon-email5'></i><a href='mailto:" + students[popUpIndex].mail + "'>" + students[popUpIndex].mail + "</a><br> ";

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
      overlay.style.display = "none";
      setTimeout(function() {
        popUpContainer.style.opacity = 0
      }, 20);

      setTimeout(function() {
        popUpContainer.style.display = "none";
        popUpContainerInner.innerHTML = "";
      }, 400);
    });
    document.getElementsByTagName("body")[0].addEventListener("click", clearBody);

    function clearBody() {
      document.getElementsByTagName("input")[0].value = "";

      overlay.style.opacity = 0;
      overlay.style.display = "none";
      setTimeout(function() {
        //  overlay.style.display = "none";
      }, 100);
      document.getElementsByClassName("search-result-container")[0].innerHTML = "";
      searchStatus.innerHTML = "&nbsp;";
    }
  }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
container.appendChild(row);
