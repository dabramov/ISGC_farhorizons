// function to return the URL of the tiles
function get_my_url(bounds) {
    var res = this.map.getResolution();
    var x = Math.round ((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round ((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    
    var path = z + "/" + x + "/" + y + "." + this.type;
    var url = this.url;
    if (url instanceof Array) {
        url = this.selectUrl(path, url);
    }
    return url + path;    
}

function startFake() {

    Ajax_Send("POST","fake_track.php","user="+logID+"&oper=checkID",doNothing);
    //    location.reload(true);
}

function doNothing(res) {
    response_msg.innerHTML=res;
}

function refreshTrack() {
    // erase the datacontents of the tracks. 
    // Have to erase the position arrays, the track markers, the landing markers, 
    // the graph series etc.
    //erase the position arrays
this.track
}

function parse_trackfile(data) {

    /* have to get the "track variable back into the callsignTrack object */ 


    // Seperate each line into an array
    var lines = data.split("\n"); 

    for (var i=0;i<lines.length-1;i++){
	// split up the lines into lat, long, altitude, etc. and put into track array
	var line_elements = lines[i].split(",");		    
	this.track[i]=line_elements;
    }
}


// this is a core function that requests a data file. When the file is ready it runs 
// the routines to parse, plot, and graph the new data
function do_trackUpdate() {
   
    //    alert(this.name +" is visible?: "+this.layer.visibility);
    //console.log(this.layer.id);
    // start by reading the track file on the server. Date stuff to avoid caching.
    //this.txtFile = new XMLHttpRequest();
    //this.txtFile.open("POST", "./"+this.layer.id+"track.txt"+"?"+(new Date()).getTime(), true);
    var self  = this;
    //    alert("this is "+self.name);


    //	}
    //}
    //    alert("loading from "+"./"+self.layer.id+"track.txt"+"?"+(new Date()).getTime());

    $.ajax({
	    url: "./"+self.layer.id+"track.txt"+"?"+(new Date()).getTime(),
	    method:"POST",
	    success: function(data){
		self.parse_trackfile(data);                                                             
		self.plot();                                                                      
		self.update_graph();
		self.e_land(95000);

	    },
	    error:function(){
		//		$('body').append("failed "+self.name);
	    },
	    
     });
    //this.txtFile.send(null);
}

function pausecomp(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
} 


// this function does all of the work in plotting the tracks
function plot_track2() {
    //    temp=this.track;
    N_old=this.layer.markers.length;
    // document.write(temp);
    //	document.writeln(this.track.length);
    // only continue if there is new data
    if ((this.track.length)>N_old) {
	var i=0;
	// do only the new lines
	for (i=N_old;i<this.track.length;i++){
	    
	    // add a marker onto the map
	    addMarker(this.layer,this.track[i]);

	}
	
	// set the visibility of the points to reflect the "current point only" toggle 
	setCurrent();

	N=this.track.length;
	
	// update the onscreen current balloon location text 
	document.getElementById('BalloonStats').innerHTML="Current Dynamics: "+this.track[N-1][4]+" ft, "+this.track[N-1][3]+" mph, "+this.track[N-1][2]+"&deg; heading";
	
    }
}

function update_graph()
{   
    // update sidebar graphs 
    //          if (this.layer.id=="wb9sky") 

    if (chart1.series[this.series].data.length<this.track.length) {
	for (i=chart1.series[this.series].data.length;i<this.track.length;i++) {
	    {chart1.series[this.series].addPoint([eval(i),
						  eval(this.track[i][4])],false,false);}
	    {chart2.series[this.series].addPoint([eval(this.track[i][3]),
						  eval(this.track[i][4])],false,false);}
	}            
	
	// now redraw sidebar graphs
	{ chart1.redraw();chart2.redraw();}
    }
    //    alert(chart1.series[this.series].data.length);
}
      
function estimate_landing(maxalt)
{
    var ground=700;

    var N=this.track.length;
    if (N>2) {
	if (this.track[N-1][4]<1000) {
	    this.landing.display(false);
	    return; 
	}
	this.landing.display(true);
	var alt=eval(this.track[N-1][4]);


    var dhdt=this.track[N-1][4]-this.track[N-2][4];

    var height=alt;
    var dpos={x:0.0,y:0.0};

    // if not there yet, walk the balloon up to max alt
    if (dhdt>0) {
	while (height<maxalt) {
	    dpos.x+=wind(height).x;
	    dpos.y+=wind(height).y;
	    height+=dhdt;
	}
	// now set a descent rate for the rest of the calculcation adjusting for the current altitude
	dhdt=-1000*Math.sqrt(rho(0.0)/rho(alt));
    }
    // now walk it down to the ground
    while (height>ground) {
	dpos.x+=wind(height).x;
	dpos.y+=wind(height).y;
	height+=dhdt*Math.sqrt(rho(alt)/rho(height));
    }


        landingLayer.removeMarker(this.landing);

	this.landing.lonlat.lon=eval(this.track[N-1][1])+(dpos.x/60.0)/53.48;
	this.landing.lonlat.lat=eval(this.track[N-1][0])+(dpos.y/60.0)/69.81;

	this.landing.lonlat.transform(proj, map.getProjectionObject());
	this.landing.display(document.getElementById("predict-toggle").checked);
        landingLayer.addMarker(this.landing);


    }
}

function rho(alt)
{
    return Math.exp(-alt/23000.0);
}

function wind(altitude)
{
    // find correct location in chart
    var i=Math.floor(altitude/2000);
    return { x:wind_table.x[i], y:wind_table.y[i]};
}

function readWinds()
{
    // initialize wind_table
    for (i=0;i<60;i++) {
	wind_table.x[i]=0.0;
	wind_table.y[i]=0.0;
	wind_table.w[i]=0.0;
    }
    //    alert("start readWinds");
    var wind_elements=[];   
    $.ajax({url: "./windfile.txt",method:"POST",success: function(data){
		var lines = data.split("\n"); 
		for (i=0;i<(lines.length-1);i++){
		    // split up the lines into altitude, speed and direction
		    wind_elements[i] = lines[i].split(",");		    
		    var n=Math.floor(wind_elements[i][4]/2000);
		    wind_table.x[n]+=wind_elements[i][3]*Math.sin(wind_elements[i][2]*0.01745329);
		    wind_table.y[n]+=wind_elements[i][3]*Math.cos(wind_elements[i][2]*0.01745329);
		    wind_table.w[n]++;
		    
		}
		//make sure there aren't any holes
		for (i=1;i<58;i++) {
		    if (wind_table.w[i]==0)
			{
			    wind_table.x[i]=(wind_table.x[i-1]+wind_table.x[i+1]);
			    wind_table.y[i]=(wind_table.y[i-1]+wind_table.y[i+1]);
			    wind_table.w[i]=wind_table.w[i-1]+wind_table.w[i+1];
			}
		}
		for (i=0;i<58;i++) {
		    wind_table.x[i]/=wind_table.w[i];
		    wind_table.y[i]/=wind_table.w[i];
		}
	    },
	    error:function(){
		//		$('body').append("failed "+self.name);
	    }    
	});
}

function setPredict()
{
    kc9lhwTrack.landing.display(document.getElementById("predict-toggle").checked);
    kc9ligTrack.landing.display(document.getElementById("predict-toggle").checked);
    wb9skyTrack.landing.display(document.getElementById("predict-toggle").checked);

}

function setCurrent()
{
    var onlyCurrent = document.getElementById("current-toggle").checked;

    for (i=0;i<kc9lig_markerLayer.markers.length-1;i++) {
	kc9lig_markerLayer.markers[i].display(!onlyCurrent);}
    for (i=0;i<kc9lhw_markerLayer.markers.length-1;i++) {
	 kc9lhw_markerLayer.markers[i].display(!onlyCurrent);}
    for (i=0;i<wb9sky_markerLayer.markers.length-1;i++) {
	 wb9sky_markerLayer.markers[i].display(!onlyCurrent);}
    
}

function addMarker(markerLayer,lineE) {
    
    longit=lineE[1];
    latit=lineE[0];
    altitude=lineE[4];
    speed=lineE[3];
    direction=lineE[2];
  
    if (markerLayer.id=="kc9lig") var icon=iconpurple.clone();
    if (markerLayer.id=="kc9lhw") var icon=icongreen.clone();
    if (markerLayer.id=="wb9sky") var icon=iconblue.clone();
    
    var ll=(new OpenLayers.LonLat(longit,latit)).transform(proj, map.getProjectionObject());
    var popupContentHTML="<div style=\"background-color:white;\">"+"Altitude: "+altitude+" ft<br>Speed: "+speed+" mph<br> Direction: "+direction+"</div>";


    var feature = new OpenLayers.Feature(markerLayer, ll); 
    feature.closeBox = true;
    feature.popupClass = AutoSizeFramedCloud;
    feature.data.popupContentHTML = popupContentHTML;
    feature.data.overflow = "auto";
    feature.data.icon = icon;        
    feature.data.display = false;        
    
    var marker = feature.createMarker();
    
    var markerClick = function (evt) {
	if (this.popup == null) {
	    this.popup = this.createPopup(this.closeBox);
	    map.addPopup(this.popup);
	    this.popup.show();
	} else {
	    this.popup.toggle();
	}
	currentPopup = this.popup;
	OpenLayers.Event.stop(evt);
    };
    
    marker.events.register("mousedown", feature, markerClick);
    
    markerLayer.addMarker(marker);
}
