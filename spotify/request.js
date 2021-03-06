var tracks = [];
var totalStreams = 0;
var dates = [];
var urlDoc;
var datecounter = 0; //0 == latest
var hitRank;
var lookup = [];


function initialise(){
	requestData("finalurldata.json", loadUrl);

	requestData("http://charts.spotify.com/api/tracks/most_streamed/global/weekly/", loadWeeks);
	
	var script = document.createElement('script');
	script.src = 'http://charts.spotify.com/api/tracks/most_streamed/global/weekly/latest?callback=parseJSON';
	document.head.appendChild(script);
		
	var prev = document.getElementById("prev");
		prev.onclick = function(){
		alert(dates.length);
			if(datecounter<dates.length-1){
				datecounter++;
				var script = document.createElement('script');
				script.src = "http://charts.spotify.com/api/tracks/most_streamed/global/weekly/"+dates[datecounter]+"?callback=parseJSON";
				document.getElementsByTagName('head')[0].appendChild(script);
			}
			}
	var next = document.getElementById("next");
		next.onclick = function(){
			if(datecounter>0){
				datecounter--;
				var script = document.createElement('script');
				script.src = "http://charts.spotify.com/api/tracks/most_streamed/global/weekly/"+dates[datecounter]+"?callback=parseJSON";
				document.head.appendChild(script);
			}
		}
	var home = document.getElementById("home");
		home.style.cursor = "pointer";
		home.onclick = function(){
			datecounter = 0;
			var script = document.createElement('script');
			script.src = "http://charts.spotify.com/api/tracks/most_streamed/global/weekly/"+dates[datecounter]+"?callback=parseJSON";
			document.head.appendChild(script);
		}
}

function loadWeeks(jsonDoc){
	console.log(jsonDoc);
	jsonDoc = JSON.parse(jsonDoc);
	for(var i=0; i<jsonDoc.length; i++){
		dates.push(jsonDoc[i]);
	}
}

function loadUrl(xmlhttp){
	urlDoc = JSON.parse(xmlhttp.responseText);
}

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
	xmlhttp.setRequestHeader('Accept', '*/*');
	// Send the request
	xmlhttp.send();
}

function parseJSON(jsonDoc){
console.log('hello from line 78');
		//reset
		document.getElementById("main").innerHTML = '<div id="overlay"></div>';
		totalStreams = 0;
		tracks = [];

        var jsonContents = jsonDoc.tracks;
       //get info about each track
        for (var i = 0; i < 50; i++) {
            var jc = jsonContents[i];
            hitRank = i;
            //create an object storing this info
            var track = {
                name : jc.track_name,
                artistName: jc.artist_name,
                url: jc.track_url,
                art : jc.artwork_url,
                streams : jc.num_streams,
                album : jc.album_name,
                rank : i + 1
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
    cross.style.clear = "right";

    var container = document.createElement("div");
  
  	var player = document.createElement("div");
  	var urlString = tracks[index].url;
  	var urlArray = [];
  	urlArray = urlString.split("/")
  	var embedString = "https://embed.spotify.com/?uri=spotify:track:" + urlArray[4];
  	var iframe  = "<iframe src="+"'"+embedString+"'"+"width='300' height='380' frameborder='0' allowtransparency='true'></iframe>";
 	//iframe = '<iframe src="https://embed.spotify.com/?uri=spotify%3Atrack%3A4th1RQAelzqgY7wL53UGQt" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'
 	player.innerHTML = iframe;
 	player.style.float="left";
 	player.style.marginLeft = "25px";
 	
 	    var rank = document.createElement("div");
    rank.className = "numberCircle";
    rank.innerHTML = tracks[index].rank;
    rank.style.float = "left";
    rank.style.marginLeft = "-10px";
    rank.zIndex = "1";
 	
 	
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
    details.style.marginLeft = "10px";
    details.style.float = "left";
	details.style.background = "#fff";
	details.style.color= "#666";
	details.style.padding = "0px 10px";
	details.style.marginTop = "25px";
	details.style.marginLeft = "20px";

    container.style.marginTop="50px";
   	container.appendChild(player);
    container.appendChild(details);
       container.appendChild(rank);
    
    setTimeout(function(){
    overlay.appendChild(cross);
    overlay.appendChild(container)

	var con = document.createElement("div");
	con.id = "chartContainer";
	con.style.height= "300px"; 
	con.style.width = "50%";
	con.style.clear = "left";
	con.style.float = "right";
	con.style.marginTop = "-13%";
	con.style.marginRight = "10%";
	overlay.appendChild(con);

	
	var searchterm = tracks[index].url;
	var tr = urlDoc[searchterm];
	var dateNo = count(tr);
	var datesarr = Object.keys(tr);
//function to create array of x's and y's
	
	var datpoints = [];
	var datasort = [];
	for(var i=0; i<datesarr.length; i++){
		var date = datesarr[i];
		var dateformatted = new Date(date);
		datasort.push(dateformatted);
	}
	datasort.sort(function(a, b) {
    return a<b ? -1 : a>b ? 1 : 0;
	});
	
	for(var i=0; i<datesarr.length; i++){
	var date = datesarr[i];
	var streams = tr[date].num_streams;
		var point = { x: datasort[i], y: streams };
		datpoints.push(point);
	}

    var chart = new CanvasJS.Chart(con,
    {

      title:{
      text: "Streams per Week (Popularity)"
      },
       data: [
      {
        type: "line",

        dataPoints: datpoints
      }
      ]
    });

    chart.render();

;} , 500);

} 

function hideSong(){
    var overlay = document.getElementById("overlayfront");
    overlay.id = "overlay";
    overlay.innerHTML = '';

}

function count(obj) { return Object.keys(obj).length; }