// file: spot.js
// author: samuel oosterhuis
(function( spot_ns, $, undefined ) 
{
//
// more global variables...
//

spot_ns.iOptions = {
  "selector"  : "p.tIngs",
  "selected"  : "p.tIngs.tag-primary",
  "selClass"  : "tIngs tag-primary",
  "notClass"  : "tIngs",
  "idx"       : spot_ns.index.i,
  "list"      : "#ingredient-list",
  "fpSelect"  : click,
  "descrStr"  : createIngDescrStr
};

spot_ns.eOptions = {
  "selector"  : "p.tEffs",
  "selected"  : "p.tEffs.tag-success",
  "selClass"  : "tEffs tag-success",
  "notClass"  : "tEffs",
  "idx"       : spot_ns.index.e,
  "list"      : "#effect-list",
  "fpSelect"  : click,
  "descrStr"  : createEffDescrStr
};

spot_ns.pot = spot_ns.index.p;
spot_ns.ingScopeFilter  = null;
spot_ns.effScopeFilter  = null;
spot_ns.purScopeFilter  = null;
spot_ns.favorites       = null;
spot_ns.ingCount        = null;
spot_ns.effCount        = null;
spot_ns.potCount        = null;
spot_ns.scroll          = null;

function potionString ( potion )
{
  var ip = spot_ns.index.i.l;
  var ep = spot_ns.index.e.l;
  var ings = ip[ potion.i[0] ].n;
  var effs = ep[ potion.e[0] ].n;

  for( var i=1; i<potion.i.length; i++ ) ings += ", " + ip[ potion.i[i] ].n;
  for( var e=1; e<potion.e.length; e++ ) effs += ", " + ep[ potion.e[e] ].n;

  return( "<b>Ingredients :</b><br>" + ings + "<br><b>Effects :</b><br>" + effs + "" );
}


function displayPotions( potList )
{
  $("#potion-list").empty();

  var p;
  var max = potList ? Math.min( 50, potList.length ) : 0;
  for( p=0; p<max; p++ )
  {
    var info = "", mag=1, val=1;
    var potNum = potList[p];
    var potion = spot_ns.index.p.l[potNum];

    $("#potion-list").append(
        "<div class=\"caplet\">" + 
          "<p class=\"tPots\" data-potion=\""+potNum+"\">" + potionString( potion ) + "</p>" + 
          "<p class=\"descr\">" + 
            "Potion information..." + 
          "</p>" + 
        "</div>"
          );
  }

  if( p >= 50 ) { $("#potion-list").append( "<p><i>&lt; list truncated &gt;</p>" ); }

  $( "#potion-list" ).children( "p" ).each( function(){ $(this).slideDown(); } );
  $( ".tPots" ).click( function() {
    var click = $(this);
    click.next().slideToggle( "slow" );

    var idx = click.data("potion");
    console.info( "Potion #: " + idx );
  });
}


function option_merge( filter, options )
{
  var sel = options.idx.s;
  var len = options.idx.z;
  var pot = options.idx.p;

  for( var i=0; i<len; i++ )
  {
    if( sel[i] ) filter = spot_ns.intersect( filter, pot[i] );
  }
  return filter;
}

function merge_all()
{
  var filter=null;

  filter = option_merge( filter, spot_ns.iOptions );
  filter = option_merge( filter, spot_ns.eOptions );

  filter = spot_ns.intersect( filter, spot_ns.effScopeFilter );
  filter = spot_ns.intersect( filter, spot_ns.ingScopeFilter );
  filter = spot_ns.intersect( filter, spot_ns.purScopeFilter );

  return filter;
}

function click() {
  var sel,tag;
  var click = $(this);
  var idx = click.data("idx");

  if( click.hasClass( "tIngs" ) ) {
    sel = spot_ns.iOptions.idx.s;
    tag = "tag-primary";
  } else {
    sel = spot_ns.eOptions.idx.s;
    tag = "tag-success";
  }

  if( sel[idx] ){
    sel[idx] = false;
    click.removeClass( tag );
    click.parent().children( ".descr" ).slideUp( "slow" );
  }else{
    sel[idx] = true;
    click.addClass( tag );
    click.parent().children( ".descr" ).slideDown( "slow" );
  }

  spot_ns.redraw( false );
  return( false );
}

function createEffDescrStr( eff ) {
  var str = "<b>Nature:</b> ";
  str += eff.f ? "favorable" : "unfavorable";

  str += "<br>";
  return( str );
}

function createIngDescrStr( ing ) {
  var str = "<b>Effects:</b>";
  var eList = spot_ns.index.e.l;

  for( var e=0; e<4; e++ ) {
    var effect = ing.e[ e ];
    str += "<br> - " + eList[ effect.x ].n;
    if( effect.v != 1 ) str += " :  <b>&euro; &times; " + effect.v + "</b>";
    if( effect.m != 1 ) str += " :  <b>&primes; &times; " + effect.m + "</b>";
  }

  return( str );
}


spot_ns.create_display_list = function( options )
{
  $( options.list ).empty();
  var idx = options.idx;
  var len = idx.z;

  for( var i=0; i<len; i++ )
  {
    var item = idx.l[ i ];

    $( options.list ).append(
        "<div class=\"caplet\">" + 
          "<p class=\"ident tag " + options.notClass + "\"" + " data-idx=\"" + i + "\">" + 
            item.n + 
          "</p>" + 
          "<p class=\"descr\">" + 
            options.descrStr( item ) + 
          "</p>" + 
        "</div>");
  }

  $( options.list ).find( ".ident" ).each( function(){
    var locIng = $(this);
    idx.d[ locIng.data( "idx" ) ] = $(this);
    locIng.click( options.fpSelect );
  });
};

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

function setAvail( potions, iIdx, eIdx ){
  var iDisp = iIdx.a;
  var eDisp = eIdx.a;

  var iLen = iIdx.z;
  var eLen = eIdx.z;
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
    var pot = spot_ns.index.p.l[ potions[i] ];
    for( j=0,k=pot.i.length; j<k; j++ ) iDisp[ pot.i[j] ] = true;
    for( j=0,k=pot.e.length; j<k; j++ ) eDisp[ pot.e[j] ] = true;
  }
}

spot_ns.selectPurMenu_old = function()
{
  var hitText = $(this).text();

  if( hitText.startsWith( "Only Positive" ) ) {
    spot_ns.purScopeFilter = spot_ns.index.p.f.pos;
  } else if( hitText.startsWith( "Only Positive" ) ) {
    spot_ns.purScopeFilter = spot_ns.index.p.f.neg;
  } else {
    spot_ns.purScopeFilter = null;
  }

  spot_ns.redraw( false );
  return( true );
};

spot_ns.selectIngMenu = function()
{
  var hitText = $(this).text();

  if( hitText.startsWith( "Two" )) {
    spot_ns.ingScopeFilter = spot_ns.index.p.i[2];
  } else if( hitText.startsWith( "Three" )){
    spot_ns.ingScopeFilter = spot_ns.index.p.i[3];
  } else {
    spot_ns.ingScopeFilter = null;
  }

  spot_ns.redraw( false );
  return( true );
};


spot_ns.selectEffMenu = function()
{
  var hitText = $(this).text();

  if( hitText.startsWith( "One" )) {
    spot_ns.effScopeFilter = spot_ns.index.p.e[1];
  } else if( hitText.startsWith( "Two" )){
    spot_ns.effScopeFilter = spot_ns.index.p.e[2];
  } else if( hitText.startsWith( "Three" )){
    spot_ns.effScopeFilter = spot_ns.index.p.e[3];
  } else if( hitText.startsWith( "Four" )){
    spot_ns.effScopeFilter = spot_ns.index.p.e[4];
  } else if( hitText.startsWith( "Five" )){
    spot_ns.effScopeFilter = spot_ns.index.p.e[5];
  } else {
    spot_ns.effScopeFilter = null;
  }

  spot_ns.redraw( false );
  return( true );
};

spot_ns.resetAll = function()
{
  var iIdx = spot_ns.iOptions.idx;
  var eIdx = spot_ns.eOptions.idx;

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

  spot_ns.effScopeFilter  = null;
  spot_ns.ingScopeFilter  = null;
  spot_ns.purScopeFilter = null;

  spot_ns.redraw( true );
};

spot_ns.redraw = function( reset )
{
  var potions = reset?null:merge_all();
  displayPotions( potions );

  var iIdx = spot_ns.iOptions.idx;
  var eIdx = spot_ns.eOptions.idx;
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
  spot_ns.ingCount.text( iCnt ? iCnt : "-" );
  spot_ns.effCount.text( eCnt ? eCnt : "-" );
  spot_ns.potCount.text( pLen ? pLen : "-" );
  spot_ns.scroll.animate({ scrollTop: 0 }, "slow");
};

}( window.spot_ns = window.spot_ns || {}, jQuery ));

$(document).ready( function()
{
  spot_ns.create_display_list( spot_ns.iOptions );
  spot_ns.create_display_list( spot_ns.eOptions );

  spot_ns.ingCount = $("#ingCount");
  spot_ns.effCount = $("#effCount");
  spot_ns.potCount = $("#potCount");
  spot_ns.scroll = $("html, body");

  spot_ns.redraw( false );

  $("#reset").click( spot_ns.resetAll );
  $(".selIng").click( spot_ns.selectIngMenu );
  $(".selEff").click( spot_ns.selectEffMenu );
  $(".purEff").click( spot_ns.selectPurMenu );
});

// vim:set tabstop=2 shiftwidth=2 expandtab:
