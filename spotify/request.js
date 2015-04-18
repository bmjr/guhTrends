var tracks = [];
var totalStreams = 0;
var dates = [];
var datecounter = 0; //0 == latest

function initialise(){
	requestData("http://charts.spotify.com/api/tracks/most_streamed/global/weekly", loadweeks);
	var prev = document.getElementById("prev");
		prev.onclick = function(){
			if(datecounter<dates.length-1){
				datecounter++;
				requestData("http://charts.spotify.com/api/tracks/most_streamed/global/weekly/"+dates[datecounter], parseJSON);
			}
			}
	var next = document.getElementById("next");
		next.onclick = function(){
			if(datecounter>0){
				datecounter--;
				requestData("http://charts.spotify.com/api/tracks/most_streamed/global/weekly/"+dates[datecounter], parseJSON);
			}
		}
}

//standard function for requesting data
function requestData(url, callBack)
{
	// Create a new XMLHttpRequest object
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			callBack(xmlhttp);
		}
	}
	// Open the object with the filename
	xmlhttp.open("GET", url, true);
	// Send the request
	xmlhttp.send(null);
}

function loadweeks(xmlhttp){
	var jsonDoc = JSON.parse(xmlhttp.responseText);
	for(var i=0; i<jsonDoc.length; i++){
		dates.push(jsonDoc[i]);
	}
	requestData("http://charts.spotify.com/api/tracks/most_streamed/global/weekly/latest", parseJSON);
}



function parseJSON(xmlhttp){
		//reset
		document.getElementById("main").innerHTML = '<div id="overlay"></div>';
		totalStreams = 0;
		tracks = [];

        // Extract the list of teams from JSON
        var jsonDoc = JSON.parse(xmlhttp.responseText);
        var jsonContents = jsonDoc.tracks;
       //get info about each track
        for (var i = 0; i < 50; i++) {
            var jc = jsonContents[i];
            //create an object storing this info
            var track = {
                name : jc.track_name,
                artistName: jc.artist_name,
                url: jc.track_url,
                art : jc.artwork_url,
                streams : jc.num_streams
            };

            //add to the global list of teams
            tracks.push(track);
            totalStreams = totalStreams + track.streams;
            
        }

        sortAlpha();
		
        for (var i = 0; i < 50; i++) {

        var elem = document.createElement("div");
        var img = document.createElement("img");
        img.src = tracks[i].art;

        
        var size = ((tracks[i].streams / totalStreams) * 5000) + "px";
        img.style.height = size;
        img.style.width = size;

        elem.className = "item";
        img.style.display = "block";
        var main = document.getElementById("main");

        //transparent element for on hover effect
        var tra = document.createElement("div");
        tra.className = "transparent";
        tra.style.height = size;
        tra.style.width = size;
        tra.onmouseover = function(){this.className = "transparentHover"};
        tra.onmouseout = function(){this.className = "transparent"};
        tra.onclick = (function(){
            var count = i; 
            return function(){showSong(count); this.className = "transparent"};
        })();

        elem.appendChild(tra);

        elem.appendChild(img);
        main.appendChild(elem);
        }
      
      
        //init packery
        var pckry = new Packery('#main', {
            "itemSelector": ".item",

        });

    }



function sortAlpha(){
   tracks.sort(function(a,b){
           var x = a.name.toLowerCase(), y = b.name.toLowerCase();
       return x < y ? -1 : x > y ? 1 : 0;    
   });
}

function showSong(index){
    var overlay = document.getElementById("overlay");
    overlay.id = "overlayfront";

    var cross = document.createElement("div");
    cross.style.float="right";
    cross.innerHTML = '<i class="fa fa-times"></i>';
    cross.style.color="white";
    cross.style.fontSize="50px";
    cross.style.margin="10px 20px";
    cross.style.cursor="pointer";
    cross.onclick = function(){hideSong()};

    var container = document.createElement("div");
  
  	var player = document.createElement("div");
  	var urlString = tracks[index].url;
  	var urlArray = [];
  	urlArray = urlString.split("/")
  	var embedString = "https://embed.spotify.com/?uri=spotify:track:" + urlArray[4];
  	var iframe  = "<iframe src="+"'"+embedString+"'"+'width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'
 	//iframe = '<iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%3A4th1RQAelzqgY7wL53UGQt" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'
 	player.innerHTML = iframe;
 	player.style.float="left";
 	
    var details = document.createElement("div");

    var songName = document.createElement("h2");
    songName.innerHTML = tracks[index].name;

    var artist = document.createElement("h3");
    artist.innerHTML = tracks[index].artistName;

    var songStreams = document.createElement("h3");
    songStreams.innerHTML = tracks[index].streams + " streams";

    details.appendChild(songName);
    details.appendChild(artist);
    details.appendChild(songStreams);
    details.style.paddingLeft = "20%";

  

    container.style.marginTop="50px";

   	container.appendChild(player);
    container.appendChild(details);
    
    
    setTimeout(function(){
     overlay.appendChild(cross);
    overlay.appendChild(container);} , 500);

    

} 

function hideSong(){
    var overlay = document.getElementById("overlayfront");
    overlay.id = "overlay";
    overlay.innerHTML = "";

}