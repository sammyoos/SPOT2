(function( sns, $, undefined ) 
{
  "use strict";

  var extractIng = function( lines, obj ) {
    if( !obj ) debugger;
    lines[ 0 ] = "";  // for later use
    lines[ 1 ] = obj[ sns.objIngNam ];
    lines[ 2 ] = "<b>Effects:</b><br>foobar";
  };

  var extractEff = function( lines, obj ) {
    lines[ 0 ] = "";  // for later use
    lines[ 1 ] = obj[ sns.objEffNam ];
    lines[ 2 ] = "<b>Number of Ingredients:</b><br>foobar";
  };

  var extractPot = function( lines, obj ) {
    lines[ 0 ] = "";  // for later use
    lines[ 1 ] = "";
    lines[ 2 ] = "";
  };


  sns.iOptions = {
    "header"    : "Ingredients",
    "countSel"  : "ingCount",
    "countTag"  : "tag-primary",
    "listSel"   : "ingredients",
    "selector"  : "tIngs",
    "extract"   : extractIng
  };

  sns.eOptions = {
    "header"    : "Effects",
    "countSel"  : "effCount",
    "countTag"  : "tag-success",
    "listSel"   : "effects",
    "selector"  : "tEffs",
    "extract"   : extractEff
  };

  sns.pOptions = {
    "header"    : "Potions",
    "countSel"  : "potCount",
    "countTag"  : "tag-info",
    "listSel"   : "potions",
    "selector"  : "tPots",
    "extract"   : extractPot
  };

  sns.createColumn = function( opt, list ) {
    var anchor = $( "<div/>" );

    var column = $( "<div/>", {
      "class": "col-xs-12 col-sm-6 col-md-4 col-lg-4"
    });

    var heading = $( "<h3/>" ).appendTo( column );

    $( "<span/>", {
      "id": opt.countSel,
      "class": "tag " + opt.countTag + " tag-pill",
      "text": list ? list.length : " - "
    }).appendTo( heading );

    $( "<span/>", {
      "class": "colHeader",
      "text": opt.header
    }).appendTo( heading );

    var wrapper = $( "<div/>", {
        "id": opt.listSel,
        "class": "tag-list"
    }).appendTo( column );

    var max = list ? list.length : sns.maxPotDis;
    var lines = [];
    for( var i=0; i<max; i++ ) {
      opt.extract( lines, list[i] );
      var caplet = $( "<div/>", { "class": "caplet" }).appendTo( wrapper );
      $( "<p/>", { 
        "class"   : opt.selector + " tag",
        "data-idx": i,
        "text"    : lines[1]
      }).appendTo( caplet );
      $( "<p/>", { 
        "class": "descr tag",
        "text" : lines[2]
      }).appendTo( caplet );
    }

    console.log( column );
    return( column );
  };

}( window.sns = window.sns || {}, jQuery ));

$(document).ready( function()
{
  "use strict";

  var anchor = $("<div/>");
  var base = $("<div/>", { "class": "row" } ).appendTo( anchor );

  sns.createColumn( sns.iOptions, sns.index[ sns.idxIng ][ sns.ieLst ] ).appendTo( base );
  sns.createColumn( sns.eOptions, sns.index[ sns.idxEff ][ sns.ieLst ] ).appendTo( base );
  sns.createColumn( sns.pOptions, sns.index[ sns.idxPot ][ sns.ieLst ] ).appendTo( base );

  var text = anchor.html();
  $( "#fullJSON" ).text( "<!-- checksum: " + sns.extHashify( text ) + " -->\n" + text );

  var dlButton = $("#download");
  dlButton.prop( "href", "data:text/plain;charset=utf-8," + encodeURIComponent( text ));
  dlButton.prop( "download", "body.html" );
});

/* vim:set tabstop=2 shiftwidth=2 expandtab: */
