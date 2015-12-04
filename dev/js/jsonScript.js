/**
 * Created by Vilhelm on 15-12-02.
 */
var container = document.getElementsByClassName("adress-container")[0];
var popUpContainer = document.getElementsByClassName("pop-up-container")[0];
var popUpContainerInner = document.getElementsByClassName("pop-up-container-inner")[0];
var row = document.createElement("div");
row.className = "gtr-row";
var studArr = [];
var xmlhttp = new XMLHttpRequest();
var url = "js/students.JSON";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
    {
        var students = JSON.parse(xmlhttp.responseText);
        for(var student in students)
        {
            var gtrDiv = document.createElement("div");
            gtrDiv.className = "gtr col-3-desk col-4-tab col-6-ml col-12-ms";
            var centerDiv = document.createElement("div");
            if(students[student].man == true)
            {
                centerDiv.className = "flex-center boy";
            }
            else
            {
                centerDiv.className = "flex-center girl";
            }
            centerDiv.innerHTML = students[student].firstName+" ";
            centerDiv.innerHTML += students[student].lastName+"<br> ";
            centerDiv.innerHTML += students[student].address+"<br> ";
            centerDiv.innerHTML += students[student].postalNumber+"<br> ";
            centerDiv.innerHTML += students[student].city+"<br> ";
            centerDiv.innerHTML += "Favoritfilm "+students[student].favoriteMovie+"<br> ";
            centerDiv.innerHTML += "Tel "+students[student].phoneNumber+"<br> ";
            gtrDiv.appendChild(centerDiv);
            row.appendChild(gtrDiv);
            //  studArr.push(students[student].firstName+students[student].lastName+students[student].address+students[student].postalNumber+students[student].city+students[student].phoneNumber);
            var concatenatedProps = "";
            for(var props in students[student])
            {
                concatenatedProps = concatenatedProps+students[student][props]+" ";

            }
            studArr.push(concatenatedProps);
        }

        for(var i=0;i<studArr.length;i++)
        {
           // studArr[i] = studArr[i].replace(/\s/g, '');
            studArr[i] = studArr[i].toLowerCase();
        }
       // console.log(studArr);
        /*  START SEARCH  */
        var searchBtn = document.getElementsByClassName("btn")[0];
        var searchResContainer = document.getElementsByClassName("search-result-container")[0];

        searchBtn.addEventListener("click",findAddress);
        var searchStatus = document.getElementsByTagName("h3")[0];

        var input2 = document.getElementsByClassName("input")[0];
        input2.addEventListener("input",findAddress);

        function findAddress()
        {
            var hits = "träffar";
            var hitIndex = [];

            var inputSmall = document.getElementsByClassName("input")[0].value;
            searchResContainer.innerHTML = "";
            var foundHits = 0;
           // console.log(inputSmall);
            //inputSmall = inputSmall.replace(/\s/g, '');
            inputSmall = inputSmall.toLowerCase();
            for (var j = 0; j<studArr.length;j++)
            {
                if(studArr[j].indexOf(inputSmall) >= 0 && inputSmall != "")
                {
                    hitIndex.push(j);
                }
            }
            if(hitIndex.length == 1)
            {
                hits = "träff"
            }
            for (var k = 0;k<hitIndex.length;k++)
            {
                var searchResult = document.createElement("div");
                searchResult.className = "search-result";
                searchResult.innerHTML = students[hitIndex[k]].firstName+ " ";
                searchResult.innerHTML += students[hitIndex[k]].lastName+"<br>";
                searchResult.innerHTML += students[hitIndex[k]].address+"<br>";
                searchResult.innerHTML += students[hitIndex[k]].postalNumber+"<br>";
                searchResult.innerHTML += students[hitIndex[k]].city+"<br>";
                searchResult.innerHTML += students[hitIndex[k]].favoriteMovie+"<br>";
                searchResult.innerHTML += students[hitIndex[k]].phoneNumber+"<br>";
                foundHits++;
                searchResContainer.appendChild(searchResult);
            }
            searchStatus.innerHTML = "Din sökning på <span class='underline'>"+input2.value+"</span> gav "+foundHits+" "+hits;
            var searchResults = document.getElementsByClassName("search-result");
            var spanStart = "<span class='highlight'>";
            var spanEnd = "</span>";
            var regex = new RegExp(inputSmall,"g");

            for(var h = 0; h<searchResults.length;h++)
            {
                searchResults[h].innerHTML = searchResults[h].innerHTML.toLowerCase().replace(regex, spanStart+inputSmall+spanEnd);
                searchResults[h].addEventListener("click",hoverHighlight)

            }


            function hoverHighlight()
            {
                console.log(this);
            }




        }
        var highLightCounter = -1; // Räknaren som håller koll på vilken av sökresultaten som vi tabbar mellan.
        var allSearches = document.getElementsByClassName("search-result");

        document.onkeydown = checkKey;

        function checkKey(e) {
            var numberOfHits = allSearches.length;
            console.log(numberOfHits+" Träffar!");

            e = e || window.event;

            if (e.keyCode == '38')
            {
                if(highLightCounter>=-1)
                {
                    highLightCounter--;
                }
            }
            else if (e.keyCode == '40')
            {
                if(highLightCounter<numberOfHits-1)
                {
                    highLightCounter++;
                }
            }
            else if (e.keyCode == '13') //Enter
            {
                if(popUpContainer.style.display != "block")
                {
                    popUpAddress();
                }
            }
            console.log(highLightCounter);
            highLightSearch();
        }
        function highLightSearch()
        {
            for(var n=0;n<allSearches.length;n++)
            {
                allSearches[n].className = "search-result";
            }
            allSearches[highLightCounter].className = "search-result search-result-active";
        }
        function popUpAddress()
        {
             for(var popUp = 0;popUp<allSearches.length;popUp++)
             {
                 if(allSearches[popUp].className == "search-result search-result-active")
                 {
                        var popUpAddressContainer = document.createElement("div");
                        popUpAddressContainer.className = "pop-up-address-container";
                        popUpAddressContainer.innerHTML = allSearches[popUp].innerHTML;
                        popUpContainerInner.appendChild(popUpAddressContainer);
                        popUpContainer.style.display = "block";
                 }
             }
        }
        document.getElementsByClassName("close-pop-up")[0].addEventListener("click",function()
        {
            popUpContainer.style.display = "none";
            popUpContainerInner.innerHTML = "";
        });
        document.getElementsByTagName("body")[0].addEventListener("click",function(){
            document.getElementsByTagName("input")[0].value = "";
         //   document.getElementsByClassName("search-result-container")[0].innerHTML = "";
            searchStatus.innerHTML = "&nbsp;";
        });






    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
container.appendChild(row);





