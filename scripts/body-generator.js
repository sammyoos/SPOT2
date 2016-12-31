(function( sns, $, undefined ) 
{
  "use strict";

  var iOptions = {
    "header"      : "Ingredients",
    "ingCountSel" : "#ingCount",
    "ingCountTag" : "tag-primary",
    "listSel"     : "#ingredients",

  };

  var eOptions = {
    "header"    : "Effects",
  };

  var pOptions = {
    "header"    : "Potions",
  };

  sns.createColumn = function() {
    var anchor = $( "<div/>" );

    var column = $( "<div/>", {
      "class": "col-xs-12 col-sm-6 col-md-4 col-lg-4"
    }).appendTo( anchor );

    var heading = $( "<h3/>" ).appendTo( column );

    $( "<span/>", {
      "id": "ingCount",
      "class": "tag tag-primary tag-pill",
      "text": "135"
    }).appendTo( heading );

    $( "<span/>", {
      "text": "Ingredient"
    }).appendTo( heading );

    var wrapper = $( "<div/>", {
        "id": "ingredients-list",
        "class": "tag-list",
        "text": "foobar"
    }).appendTo( column );

    return( anchor );
  };

}( window.sns = window.sns || {}, jQuery ));

$(document).ready( function()
{
  "use strict";

  var anchor = $("<div/>");
  sns.createColumn( "Ingredients", "ingredient-list", "ingCount", 135 )
    .appendTo( anchor );

  var text = anchor.html();
  $( "#fullJSON" ).text( text );

  var dlButton = $("#download");
  dlButton.prop( "href", "data:text/plain;charset=utf-8," + encodeURIComponent( text ));
  dlButton.prop( "download", "body.html" );
});

/* vim:set tabstop=2 shiftwidth=2 expandtab: */
