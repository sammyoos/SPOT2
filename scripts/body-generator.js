(function( sns, $, undefined ) 
{
  "use strict";

  var index = sns.index;

  var idxIng = index[ sns.idxIng ];
  var ingDis = idxIng[ sns.ieDis ];
  var ingDisSel = ingDis[ sns.objDisSel ];
  var ingLst = idxIng[ sns.ieLst ];
  var ingSiz = idxIng[ sns.ieSiz ];
  var ingPot = idxIng[ sns.iePot ];

  var idxEff = index[ sns.idxEff ];
  var effDis = idxEff[ sns.ieDis ];
  var effDisSel = effDis[ sns.objDisSel ];
  var effSiz = idxEff[ sns.ieSiz ];
  var effLst = idxEff[ sns.ieLst ];
  var effPot = idxEff[ sns.iePot ];

  var idxPot = index[ sns.idxPot ];
  var potDis = idxPot[ sns.idxPotDis ];
  var potDisjQr = potDis[ sns.objDisjQr ];
  var potEff = idxPot[ sns.idxPotEff ];
  var potIng = idxPot[ sns.idxPotIng ];
  var potLst = idxPot[ sns.idxPotLst ];
  var potNat = idxPot[ sns.idxPotNat ];

  var extractIng = function( pTop, pBot, item ) {
    pTop.text( item[ sns.objIngNam ] );

    pBot.append( "<b>Effects:</b>" );
    item[ sns.objIngEff ].forEach( function( eff ) {
      var eNum = eff[ sns.objIngEffPos ];
      pBot.append( "<br> - " + effLst[ eNum ][ sns.objEffNam ] );
    });

    pBot.append( "<br><b>Base Value:</b> " + item[ sns.objIngVal ] );
    pBot.append( "<br><b>Weight:</b> " + item[ sns.objIngWgt ] );
    pBot.append( "<br><b>Location:</b> " + item[ sns.objIngLoc ] );
    pBot.append( "<br><b>Merchants:</b> " + item[ sns.objIngMer ] );
    pBot.append( "<br><b>DLC:</b> " + sns.objDlcNam[ item[ sns.objIngDLC ]] );
  };

  var extractEff = function( pTop, pBot, item ) {
    pTop.text( item[ sns.objEffNam ] );
    pBot.text( "Nature: " + (( item[ sns.objEffNat ] == sns.objEffNatPos ) ? "Positive" : "Negative" ));
  };

  var extractPot = function( pTop, pBot, item ) {
    pTop.append( "<b>Ingredients:</b><br><span class=\"potIngs\"></span><br>" )
    pTop.append( "<b>Effects:</b><br><span class=\"potEffs\"></span>" )

    pBot.append( "...potions specific information..." );
  };


  var iOptions = {
    "header"    : "Ingredients",
    "countSel"  : "ingCount",
    "countTag"  : "tag-primary",
    "listSel"   : "ingredients",
    "selector"  : "tIngs",
    "extract"   : extractIng
  };

  var eOptions = {
    "header"    : "Effects",
    "countSel"  : "effCount",
    "countTag"  : "tag-success",
    "listSel"   : "effects",
    "selector"  : "tEffs",
    "extract"   : extractEff
  };

  var pOptions = {
    "header"    : "Potions",
    "countSel"  : "potCount",
    "countTag"  : "tag-info",
    "listSel"   : "potions",
    "selector"  : "tPots",
    "extract"   : extractPot
  };

  var createColumn = function( opt, list, len ) {
    var anchor = $( "<div/>" );

    var column = $( "<div/>", {
      "class": "col-xs-12 col-sm-6 col-md-4 col-lg-4"
    });

    var heading = $( "<h3/>" ).appendTo( column );

    $( "<span/>", {
      "id": opt.countSel,
      "class": "tag " + opt.countTag + " tag-pill",
      "text": len ? len : " - "
    }).appendTo( heading );

    $( "<span/>", {
      "class": "colHeader",
      "text": opt.header
    }).appendTo( heading );

    var wrapper = $( "<div/>", {
        "id": opt.listSel,
        "class": "tag-list"
    }).appendTo( column );

    var i=0;
    list.forEach( function( item ) {
      var caplet = $( "<div/>", { "class": "caplet" }).appendTo( wrapper );

      var pTop = $( "<p/>", { 
        "class"   : opt.selector + " tag",
        "data-idx": i++
      }).appendTo( caplet );
      var pBot = $( "<p/>", { 
        "class": "descr tag",
      }).appendTo( caplet );

      opt.extract( pTop, pBot, item );
    });

    return( column );
  };

  sns.generate = function(){
    var anchor = $("<div/>");
    var base = $("<div/>", { "class": "row" } ).appendTo( anchor );

    createColumn( iOptions, ingLst, ingLst.length ).appendTo( base );
    createColumn( eOptions, effLst, ingLst.length ).appendTo( base );
    var potCol = createColumn( pOptions, new Array( sns.maxPotDis ).fill( false ), 0 ).appendTo( base );

    potCol.append( "<p class=\"trunc\"><i>&lt; list truncated &gt;</i></p>" );

    var text = anchor.html();
    $( "#fullJSON" ).text( "<!-- checksum: " + sns.extHashify( text ) + " -->\n" + text );


    var dlButton = $("#download");
    dlButton.prop( "href", "data:text/plain;charset=utf-8," + encodeURIComponent( text ));
    dlButton.prop( "download", "body.html" );
  };

}( window.sns = window.sns || {}, jQuery ));
/* vim:set tabstop=2 shiftwidth=2 expandtab: */
