// file: spot.js
// author: samuel oosterhuis
//
// MUST work with older browsers
//
(function( sns, $, undefined ) 
{
  "use strict";

  /*
   * NOTE:
   * after initial setup, never use the prev and next objects from index tree
   * always use: opt.next, never use: index[ sns.idxIng ][ sns.ieDis ][ sns.objDisNxt ]
   */

  var index = sns.index;

  var idxIng = index[ sns.idxIng ];
  var ingDis = idxIng[ sns.ieDis ];
  var ingDisjQr = ingDis[ sns.objDisjQr ];
  var ingLst = idxIng[ sns.ieLst ];
  var ingSiz = idxIng[ sns.ieSiz ];
  var ingPot = idxIng[ sns.iePot ];

  var idxEff = index[ sns.idxEff ];
  var effDis = idxEff[ sns.ieDis ];
  var effDisjQr = effDis[ sns.objDisjQr ];
  var effSiz = idxEff[ sns.ieSiz ];
  var effLst = idxEff[ sns.ieLst ];
  var effPot = idxEff[ sns.iePot ];

  var idxPot = index[ sns.idxPot ];
  var potDis = idxPot[ sns.idxPotDis ];
  var potDisjQr = potDis[ sns.objDisjQr ];
  var potEff = idxPot[ sns.idxPotEff ];
  var potLst = idxPot[ sns.idxPotLst ];
  var potNat = idxPot[ sns.idxPotNat ];
  var potIng = idxPot[ sns.idxPotIng ];
  var potIng2 = potIng[2];
  var potIng3 = potIng[3];

  var iOptions = {
    "idx"       : idxIng,
    "disjQr"    : ingDis[ sns.objDisjQr ],
    "next"      : ingDis[ sns.objDisNxt ],
    "prev"      : ingDis[ sns.objDisPrv ],
    "sel"       : ingDis[ sns.objDisSel ],
    "header"    : "Ingredients",
    "countSel"  : "#ingCount",
    "countTag"  : "tag-primary",
    "countDis"  : null,
    "listSel"   : "#ingredients",
    "selector"  : "p.tIngs",
    "fpSelect"  : clicker,
    "filter"    : null, //filter number of ingredients
    "menuClick" : selectIngMenu,
    "menuSel"   : ".selIng"
  };

  var eOptions = {
    "idx"       : idxEff,
    "disjQr"    : effDis[ sns.objDisjQr ],
    "next"      : effDis[ sns.objDisNxt ],
    "prev"      : effDis[ sns.objDisPrv ],
    "sel"       : effDis[ sns.objDisSel ],
    "header"    : "Effects",
    "countSel"  : "#effCount",
    "countTag"  : "tag-success",
    "countDis"  : null,
    "listSel"   : "#effects",
    "selector"  : "p.tEffs",
    "fpSelect"  : clicker,
    "filter"    : null, //filter number of effects
    "menuClick" : selectEffMenu,
    "menuSel"   : ".selEff"
  };

  var pOptions = {
    "idx"       : idxPot,
    "disjQr"    : potDis[ sns.objDisjQr ],
    "header"    : "Potions",
    "countSel"  : "#potCount",
    "countTag"  : "tag-info",
    "countDis"  : null,
    "selector"  : "p.tPots",
    "listSel"   : "#potions",
    "fpSelect"  : null,
    "filter"    : null, //filter nature of potion (pos,neg,mix)
    "menuClick" : selectPurMenu,
    "menuSel"   : ".purEff"
  };

  function generatePotStr ( node, potion )
  {
    var potionIng = potion[ sns.objPotIng ];
    var potionEff = potion[ sns.objPotEff ];
    var ings = ingLst[ potionIng[ 0 ] ][ sns.objIngNam ];
    var effs = effLst[ potionEff[ 0 ] ][ sns.objEffNam ];

    for( var i=1; i<potionIng.length; i++ ) ings += ", " + ingLst[ potionIng[ i ] ][ sns.objIngNam ];
    for( var e=1; e<potionEff.length; e++ ) effs += ", " + effLst[ potionEff[ e ] ][ sns.objEffNam ];

    node.children( ".potIngs" ).text( ings );
    node.children( ".potEffs" ).text( effs );
  }


  function displayPotions( potions )
  {
    var append = "";
    var max = potions ? potions.length : 0;

    if( max > sns.maxPotDis ) {
      max = sns.maxPotDis;
      pOptions.trunc.show();
    } else {
      pOptions.trunc.hide();
    }

    for( var p=0; p<max; p++ ) {
      // var info = "", mag=1, val=1;
      var node = potDisjQr[p];
      generatePotStr( node, potLst[ potions[p] ] );
      node.show();
    }

    // anything over max hide...
    for( var p=max; p<sns.maxPotDis; p++ ) {
      potDisjQr[p].hide();
    }
  }


  function option_merge( filter, sel, len, pot )
  {
    for( var i=0; i<len; i++ ) { 
      if( sel[i] ) filter = sns.intersect( filter, pot[i] ); 
    }

    return filter;
  }

  function merge_all()
  {
    var filter=null;

    filter = option_merge( filter, iOptions.sel, ingSiz, ingPot );
    filter = option_merge( filter, eOptions.sel, effSiz, effPot );

    filter = sns.intersect( filter, eOptions.filter );
    filter = sns.intersect( filter, iOptions.filter );
    filter = sns.intersect( filter, pOptions.filter );

    return filter;
  }

  function display_list( len, prev, next, sel, jQr )
  {
    var count = 0;

    for( var i=0; i<len; i++ )
    {
      if( next[i] ) {
        ++count;
        if( !prev[i] ) jQr[i].slideDown( "slow" );
      } else {
        if( prev[i] ) {
          if( sel[i] ) jQr[i].next().slideUp("slow");
          jQr[i].slideUp( "slow" );
        }
      }
    }
    return count;
  }

  function setAvail( potions ){
    var iDisp = iOptions.next;
    var eDisp = eOptions.next;

    var iLen = idxIng[ sns.ieSiz ];
    var eLen = idxEff[ sns.ieSiz ];
    var i,e,j,k;

    if( potions === null ){
      for( i=0; i<iLen; i++ ) iDisp[i] = true;
      for( e=0; e<eLen; e++ ) eDisp[e] = true;
      return;
    }

    for( i=0; i<iLen; i++ ) iDisp[i] = false;
    for( e=0; e<eLen; e++ ) eDisp[e] = false;

    var pLen = potions.length;
    for( i=0; i<pLen; i++ ){
      var pot = potLst[ potions[i] ];
      var potIngs = pot[ sns.objPotIng ];
      var potEffs = pot[ sns.objPotEff ];
      for( j=0,k=potIngs.length; j<k; j++ ) iDisp[ potIngs[j] ] = true;
      for( j=0,k=potEffs.length; j<k; j++ ) eDisp[ potEffs[j] ] = true;
    }
  }


  var resetAll = function()
  {
    var iDisp = iOptions.next;
    var eDisp = eOptions.next;

    for( var i=0; i<ingSiz; i++ ) {
      iDisp[i] = true;
      if( iOptions.sel[i] ) {
        iOptions.sel[i]=false;
        ingDisjQr[i].next().slideUp("slow");
        ingDisjQr[i].removeClass( "tag-primary" );
      }
    }
    for( var e=0; e<effSiz; e++ ) {
      eDisp[e] = true;
      if( eOptions.sel[e] ) {
        eOptions.sel[e]=false;
        effDisjQr[e].next().slideUp("slow");
        effDisjQr[e].removeClass( "tag-success" );
      }
    }

    iOptions.filter = null;
    eOptions.filter = null;
    pOptions.filter = null;

    redraw( true );
  };

  var swapPrvNxtDisplay = function( opt ) {
    var prev = opt.prev;
    opt.prev = opt.next;
    opt.next = prev;
  };

  var redraw = function( reset )
  {
    debugger;
    var potions = reset?null:merge_all();
    displayPotions( potions );

    setAvail( potions, idxIng, idxEff );

    var iCnt = display_list( ingSiz, iOptions.prev, iOptions.next, iOptions.sel, ingDisjQr );
    var eCnt = display_list( effSiz, eOptions.prev, eOptions.next, eOptions.sel, effDisjQr );

    swapPrvNxtDisplay( iOptions );
    swapPrvNxtDisplay( eOptions );

    var pLen = potions ? potions.length : 0;
    iOptions.countDis.text( iCnt ? iCnt : "-" );
    eOptions.countDis.text( eCnt ? eCnt : "-" );
    pOptions.countDis.text( pLen ? pLen : "-" );

    return( true );
  };

  function clicker( clicked, opt ) {
    console.log( 'clicking...' );
    console.log( opt );
    var sel = opt.sel;
    var tag = opt.countTag;
    var idx = clicked.data("idx");

    if( sel[idx] ){
      sel[idx] = false;
      clicked.next().slideUp( "slow" );
      clicked.removeClass( tag );
    }else{
      sel[idx] = true;
      clicked.addClass( tag );
      clicked.next().slideDown( "slow" );
    }

    redraw( false );
    return( false );
  }

  function selectIngMenu( hitText, opt )
  {
    if(       hitText.startsWith( "Two" ))  { opt.filter = potIng2; } 
    else if(  hitText.startsWith( "Three" )){ opt.filter = potIng3; } 
    else                                    { opt.filter = null; }

    return( redraw( false )); // always return true???
  };


  function selectEffMenu( hitText, opt )
  {
    if(      hitText.startsWith( "One" )) { opt.filter = potEff[1]; } 
    else if( hitText.startsWith( "Two" )) { opt.filter = potEff[2]; } 
    else if( hitText.startsWith( "Three" )){opt.filter = potEff[3]; } 
    else if( hitText.startsWith( "Four" )){ opt.filter = potEff[4]; } 
    else if( hitText.startsWith( "Five" )){ opt.filter = potEff[5]; } 
    else                                  { opt.filter = null; }

    return( redraw( false )); // always return true???
  };

  function selectPurMenu( hitText, opt )
  {
    if(      hitText.startsWith( "Only Positive" ) ) { opt.filter = potNat[ sns.objEffNatPos ]; } 
    else if( hitText.startsWith( "Only Negative" ) ) { opt.filter = potNat[ sns.objEffNatNeg ]; } 
    // could do an only mixed... but why???
    else                                             { sns.filter = null; }

    return( redraw( false )); // always return true???
  };


  var setDisplayInfo = function( opt ) 
  {
    // counter
    opt.countDis = $( opt.countSel );
    // menu clicks
    $( opt.menuSel ).click( function() { opt.menuClick( $(this).text(), opt ); });
    // ingredient, effect and potion clicks
    
    $( opt.selector ).each( function(){
      var local = $(this);
      opt.disjQr[ local.data( "idx" ) ] = local;
      local.click( function() { 
        console.log( 'click' );
        opt.fpSelect ?  opt.fpSelect( local, opt ) : console.log( this ); 
      });
    });
  };

  sns.runSpotRun = function() {
    setDisplayInfo( iOptions );
    setDisplayInfo( eOptions );
    setDisplayInfo( pOptions );

    pOptions.trunc = $( ".trunc" );

    $("#reset" ).click( function() { resetAll(); });
  };

}( window.sns = window.sns || {}, jQuery ));
/* vim:set tabstop=2 shiftwidth=2 expandtab: */
