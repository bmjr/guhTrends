var tracks = [];
var totalStreams = 0;


function initialise(){
	requestData("http://charts.spotify.com/api/tracks/most_streamed/global/daily/latest", parseJSON);
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


function parseJSON(xmlhttp){
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
    cross.onclick = function(){hideSong()};

    var container = document.createElement("div");
  
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

    var albumArt = document.createElement("img");
    albumArt.src=tracks[index].art;
    albumArt.style.float="left";
    var length = 0.2 *document.body.clientWidth;
    albumArt.style.width=length+"px";
    albumArt.style.height=length+"px";
    albumArt.style.margin="0px 50px";

    container.style.marginTop="50px";

   
    container.appendChild(albumArt);
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