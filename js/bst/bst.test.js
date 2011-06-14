
// init the basic filtering engine
var s = bst.stats("#chart");
// the network map
var maplink = bst.view.mapLink(d3.select("#maplink"));

// THE FILTERS

// add a filter
$("#add").click(add)

// the association property/view is now chosen here
function add(event,ui) {

	switch($("#selection")[0].value) {

		case "archive" :
		// the property the filter works on
		s.filter("letter")
		// a title for the filter 
		.title("Archive")
		// the type of view associated
		.view("bubble","archive")

		break;

		case "author" :
		s.filter("author")
		.title("Author")
		.view("bubble")

		break;

		case "recipient" :
		s.filter("recipient")
		.title("Recipient")
		.view("bubble")

		break;

		case "date" :
		s.filter("date")
		.title("Date")
		.view("area")

		break;

		case "source" :
		s.filter("source")
		.title("Source")
		.view("map", "sourcelatlon");

		break;

		case "destination" :
		s.filter("destination")
		.title("Destination")
		.view("map", "destinationlatlon");

		break;

		case "nationality" :
		s.filter("authorid")
		.title("Nationality (A)")
		.view("nationality")

		break;

	}

}

// ajax events for the loading indicator...
$(document).ajaxSend( function() {

	d3.select(".ajaxloading").style("background","url('./style/images/ajax-loader.gif') no-repeat")
})

$(document).ajaxStop( function() {

	d3.select(".ajaxloading").style("background","")

})


// THE MAP VIEW
// add the clear button on the map
d3.select("#maplink")
.append("input")
.attr("type","button")
.attr("value","clear")
.style("float","right")
.on("click", function(){ maplink.clear() })

// some listeners on the map
maplink.clicked = function(d) {
	bst.stats.showData(d,this)
}
// some controls on the map
$( "#maplink" ).droppable({

	drop: function( event, ui ) {
		$( this ).addClass( "ui-state-highlight" )
		$( this ).css("height",800 )
		maplink.update(bst.data.net( $(ui.draggable[0]).data().data, "source", "destination", "sourcelatlon","destinationlatlon"),$(ui.draggable[0]).data().color)
	}
});

