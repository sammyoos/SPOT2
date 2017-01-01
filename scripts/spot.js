// file: spot.js
// author: samuel oosterhuis
//
// MUST work with older browsers
//
(function( sns, $, undefined ) 
{
  "use strict";

  var index = sns.index;

  var idxIng = index[ sns.idxIng ];
  var ingDis = idxIng[ sns.ieDis ];
  var ingLst = idxIng[ sns.ieLst ];
  var ingSiz = idxIng[ sns.ieSiz ];
  var ingPot = idxIng[ sns.iePot ];

  var idxEff = index[ sns.idxEff ];
  var effDis = idxEff[ sns.ieDis ];
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
  var potIng2 = potIng[2];
  var potIng3 = potIng[2];

  var iOptions = {
    "idx"       : idxIng,
    "disjQr"    : ingDis[ sns.objDisjQr ],
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

  /*
  sns.iOptions = {
    "selected"  : "p.tIngs.tag-primary",
    "selClass"  : "tIngs tag-primary",
    "notClass"  : "tIngs",
    "idx"       : sns.index.i,
    "list"      : "#ingredient-list",
    "fpSelect"  : clicker,
    "descrStr"  : createIngDescrStr
  };

  sns.eOptions = {
    "selected"  : "p.tEffs.tag-success",
    "selClass"  : "tEffs tag-success",
    "notClass"  : "tEffs",
    "idx"       : sns.index.e,
    "list"      : "#effect-list",
    "fpSelect"  : clicker,
    "descrStr"  : createEffDescrStr
  };
  */

  sns.ingCount        = null;
  sns.effCount        = null;
  sns.potCount        = null;
  // sns.scroll          = null;

  function potionString ( potion )
  {
    var potionIng = potion[ sns.objPotIng ];
    var potionEff = potion[ sns.objPotEff ];
    var ings = ingLst[ potionIng[ 0 ] ][ sns.objIngNam ];
    var effs = effLst[ potionEff[ 0 ] ][ sns.objEffNam ];

    for( var i=1; i<potionIng.length; i++ ) ings += ", " + ingLst[ potionIng[ i ] ][ sns.objIngNam ];
    for( var e=1; e<potionEff.length; e++ ) effs += ", " + effLst[ potionEff[ i ] ][ sns.objEffNam ];

    return( "<b>Ingredients :</b><br>" + ings + "<br><b>Effects :</b><br>" + effs + "" );
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
      node.text( potionString( potLst[ potions[p] ] ));
      node.show();
    }

    // anything over max hide...
    for( var p=max; p<sns.maxPotDis; p++ ) {
      potDisjQr[p].hide();
    }
  }


  function option_merge( filter, optionsIdx )
  {
    var sel = optionsIdx.s, len = optionsIdx.z;

    for( var i=0; i<len; i++ ) { 
      if( sel[i] ) filter = sns.intersect( filter, idxPot[i] ); 
    }

    return filter;
  }

  function merge_all()
  {
    var filter=null;

    filter = option_merge( filter, iOptions.idx );
    filter = option_merge( filter, eOptions.idx );

    filter = sns.intersect( filter, eOptions.filter );
    filter = sns.intersect( filter, iOptions.filter );
    filter = sns.intersect( filter, pOptions.filter );

    return filter;
  }


  function createEffDescrStr( eff ) {
    var str = "<b>Nature:</b> ";
    str += eff.f ? "favorable" : "unfavorable";

    str += "<br>";
    return( str );
  }

  function createIngDescrStr( ing ) {
    var str = "<b>Effects:</b>";
    var eList = sns.index.e.l;

    for( var e=0; e<4; e++ ) {
      var effect = ing.e[ e ];
      str += "<br> - " + eList[ effect.x ].n;
      if( effect.v != 1 ) str += " :  <b>&euro; &times; " + effect.v + "</b>";
      if( effect.m != 1 ) str += " :  <b>&primes; &times; " + effect.m + "</b>";
    }

    return( str );
  }

  function display_list( idx )
  {
    var count = 0;

    for( var i=0; i<idx.z; i++ )
    {
      if( idx.b[i] ) {
        if( !idx.a[i] ) {
          idx.d[i].slideUp( "slow" );
          if( idx.s[i] ) idx.d[i].next().slideUp("slow");
        }
      }else{
        if( idx.a[i] ) idx.d[i].slideDown( "slow" );
      }
      if( idx.a[i] ) ++count;
    }
    return count;
  }

  function setAvail( potions ){
    var iDisp = ingDis[ sns.objDisNxt ]
    var eDisp = effDis[ sns.objDisNxt ]

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
      for( j=0,k=pot.i.length; j<k; j++ ) iDisp[ pot.i[j] ] = true;
      for( j=0,k=pot.e.length; j<k; j++ ) eDisp[ pot.e[j] ] = true;
    }
  }


  var resetAll = function()
  {
    var iIdx = sns.iOptions.idx;
    var eIdx = sns.eOptions.idx;

    var iDisp = iIdx.a;
    var eDisp = eIdx.a;

    var iLen = iIdx.z;
    var eLen = eIdx.z;

    var i;

    for( i=0; i<iLen; i++ ) {
      iDisp[i] = true;
      if( iIdx.s[i] ) {
        iIdx.s[i]=false;
        iIdx.d[i].next().slideUp("slow");
        iIdx.d[i].removeClass( "tag-primary" );
      }
    }
    for( i=0; i<eLen; i++ ) {
      eDisp[i] = true;
      if( eIdx.s[i] ) {
        eIdx.s[i]=false;
        eIdx.d[i].next().slideUp("slow");
        eIdx.d[i].removeClass( "tag-success" );
      }
    }

    sns.iOptions.filter = null;
    sns.eOptions.filter = null;
    sns.pOptions.filter = null;

    redraw( true );
  };

  var redraw = function( reset )
  {
    debugger;
    var potions = reset?null:merge_all();
    displayPotions( potions );

    var iIdx = sns.iOptions.idx;
    var eIdx = sns.eOptions.idx;
    setAvail( potions, iIdx, eIdx );

    var iCnt = display_list( iIdx );
    var eCnt = display_list( eIdx );

    var iTmp = iIdx.a;
    var eTmp = eIdx.a;

    iIdx.a = iIdx.b;
    eIdx.a = eIdx.b;

    iIdx.b = iTmp;
    eIdx.b = eTmp;

    var pLen = potions ? potions.length : 0;
    iOptions.countDis.text( iCnt ? iCnt : "-" );
    eOptions.countDis.text( eCnt ? eCnt : "-" );
    pOptions.countDis.text( pLen ? pLen : "-" );
    // sns.scroll.animate({ scrollTop: 0 }, "slow");

    return( true );
  };

  function clicker( clicked, opt ) {
    console.log( 'clicking...' );
    console.log( opt );
    var sel = opt.idx[ sns.ieDis ][ sns.objDisSel ];
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

  var selectIngMenu = function( hitText, opt )
  {
    if(       hitText.startsWith( "Two" ))  { opt.filter = potIng2; } 
    else if(  hitText.startsWith( "Three" )){ opt.filter = potIng3; } 
    else                                    { opt.filter = null; }

    return( redraw( false )); // always return true???
  };


  var selectEffMenu = function( hitText, opt )
  {
    if(      hitText.startsWith( "One" )) { opt.filter = potEff[1]; } 
    else if( hitText.startsWith( "Two" )) { opt.filter = potEff[2]; } 
    else if( hitText.startsWith( "Three" )){opt.filter = potEff[3]; } 
    else if( hitText.startsWith( "Four" )){ opt.filter = potEff[4]; } 
    else if( hitText.startsWith( "Five" )){ opt.filter = potEff[5]; } 
    else                                  { opt.filter = null; }

    return( redraw( false )); // always return true???
  };

  var selectPurMenu = function( hitText, opt )
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

    pOptions.trunc = $( "<p/>" );
    $( "<i/>", { "text": "&lt; list truncated &gt;" } ).appendTo( pOptions.trunc );
    pOptions.trunc.appendTo( $( "#potions" ));
    $("#reset" ).click( function() { resetAll(); });
  };

}( window.sns = window.sns || {}, jQuery ));

  // sns.create_display_list( sns.iOptions );
  // sns.create_display_list( sns.eOptions );

  // sns.scroll = $("html, body");

  // redraw( false );

/* vim:set tabstop=2 shiftwidth=2 expandtab: */
