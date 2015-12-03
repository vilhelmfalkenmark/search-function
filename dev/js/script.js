function studentPrototype(firstName, lastName, address,postalNumber,city, phoneNumber)
{
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.postalNumber = postalNumber;
    this.city = city;
    this.phoneNumber = phoneNumber;
}
var students = {};
var i = 1;
function addStudent(firstName, lastName, address,postalNumber,city, phoneNumber)
{
    students["student" + i] = new studentPrototype(firstName, lastName, address,postalNumber,city, phoneNumber);
    i++;
}
addStudent(
    "Ville",
    "Falkenmark",
    "Körsbärsvägen 8",
    "114 23",
    "Stockholm",
    "0705580198"
);
addStudent(
    "Kalle",
    "Andersson",
    "Risvägen 23",
    "133 76",
    "Täby",
    "0773929373"
);
addStudent(
    "Hanna",
    "Larsson",
    "ST Eriksgatan 118",
    "112 44",
    "Stockholm",
    "0708178749"
);
addStudent(
    "Lasse",
    "Nilsson",
    "Riddarvägen 34",
    "412 24",
    "Örby",
    "0708736381"
);
addStudent(
    "Pelle",
    "Karlsson",
    "Åvägen 34",
    "416 24",
    "Fruängen",
    "0708820381"
);
addStudent(
    "Charles Dickens",
    "Restys",
    "Åsögatan 34",
    "212 23",
    "Uppsala",
    "0706383891"
);
addStudent(
    "Lasse",
    "Åström",
    "Bågvägen 14",
    "114 27",
    "Stockholm",
    "0735186528"
);
addStudent(
    "Ina",
    "Hertzel",
    "Nygatan 1",
    "873 21",
    "Sundsvall",
    "0458-471947"
);


var container = document.getElementsByClassName("adress-container")[0];
var row = document.createElement("div");
row.className = "gtr-row";

for(var student in students)
{
  var gtrDiv = document.createElement("div");
  gtrDiv.className = "gtr col-3-desk col-4-tab col-6-ml col-12-ms";

  var centerDiv = document.createElement("div");
  centerDiv.className = "flex-center";
  centerDiv.innerHTML = students[student].firstName+" ";
  centerDiv.innerHTML += students[student].lastName+"<br> ";
  centerDiv.innerHTML += students[student].address+"<br> ";
  centerDiv.innerHTML += students[student].postalNumber+"<br> ";
  centerDiv.innerHTML += students[student].city+"<br> ";
  centerDiv.innerHTML += "Tel "+students[student].phoneNumber+"<br> ";
  gtrDiv.appendChild(centerDiv);
  row.appendChild(gtrDiv);
}
container.appendChild(row);

/*  START SEARCH  */
var searchBtn = document.getElementsByClassName("btn")[0];
var searchResContainer = document.getElementsByClassName("search-result-container")[0];

var input = document.getElementsByClassName("input")[0];

searchBtn.addEventListener("click",findAddress);

function findAddress()
{
    var searchResult = document.createElement("div");
    searchResContainer.innerHTML = "";
    for (var student in students)
    {
        if((input.value == (students[student].firstName)) || (input.value == (students[student].lastName)) || (input.value == (students[student].address)) || (input.value == (students[student].phoneNumber))  )
        {
            searchResult.innerHTML = students[student].firstName+ " ";
            searchResult.innerHTML += students[student].lastName+"<br>";
            searchResult.innerHTML += students[student].address+"<br>";
            searchResult.innerHTML += students[student].postalNumber+"<br>";
            searchResult.innerHTML += students[student].city+"<br>";
            searchResult.innerHTML += students[student].phoneNumber+"<br>";
            break;
        }
        else
        {
            searchResult.innerHTML = "Din sökning matchar tyvärr inte någon i vårt medlemsregister";
        }
    }
    searchResContainer.appendChild(searchResult);
}








