/**
 * Created by Vilhelm on 15-12-02.
 */
var container = document.getElementsByClassName("adress-container")[0];
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
            centerDiv.innerHTML += "Tel "+students[student].phoneNumber+"<br> ";
            gtrDiv.appendChild(centerDiv);
            row.appendChild(gtrDiv);
            studArr.push(students[student].firstName+students[student].lastName+students[student].address+students[student].postalNumber+students[student].city+students[student].phoneNumber);
        }

        for(var i=0;i<studArr.length;i++)
        {
            studArr[i] =studArr[i].replace(/\s/g, '');
            studArr[i] = studArr[i].toLowerCase();
        }

        /*  START SEARCH  */
        var searchBtn = document.getElementsByClassName("btn")[0];
        var searchResContainer = document.getElementsByClassName("search-result-container")[0];

        searchBtn.addEventListener("click",findAddress);
        var searchStatus = document.getElementsByTagName("h3")[0];
        function findAddress()
        {
            var hits = "träffar";

            var hitIndex = [];

            var inputSmall = document.getElementsByClassName("input")[0].value;
            searchResContainer.innerHTML = "";
            var foundHits = 0;
            inputSmall = inputSmall.replace(/\s/g, '');
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
                searchResult.innerHTML = students[hitIndex[k]].firstName+ " ";
                searchResult.innerHTML += students[hitIndex[k]].lastName+"<br>";
                searchResult.innerHTML += students[hitIndex[k]].address+"<br>";
                searchResult.innerHTML += students[hitIndex[k]].postalNumber+"<br>";
                searchResult.innerHTML += students[hitIndex[k]].city+"<br>";
                searchResult.innerHTML += students[hitIndex[k]].phoneNumber+"<br>";
                foundHits++;
                searchResContainer.appendChild(searchResult);
            }

            searchStatus.innerHTML = "Din sökning gav "+foundHits+" "+hits;
        }
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
container.appendChild(row);






