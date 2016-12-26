// file: main.js
// author: samuel oosterhuis

//
// namespace mechanism from:
// http://stackoverflow.com/questions/881515/javascript-namespace-declaration
// 			and
// http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
//
(function( spot_ns, $, undefined ) {

//
// more global variables...
//

spot_ns.iOptions = {
	"selector" 	: "p.tIngs",
	"selected" 	: "p.tIngs.tag-primary",
	"selClass" 	: "tIngs tag tag-primary",
	"notClass" 	: "tIngs tag",
	"idx"				: spot_ns.index.i,
	"list"			: "#ingredient-list",
	"fpSelect"	: click,
};

spot_ns.eOptions = {
	"selector"  : "p.tEffs",
	"selected"  : "p.tEffs.tag-success",
	"selClass"  : "tEffs tag tag-success",
	"notClass"  : "tEffs tag",
	"idx"				: spot_ns.index.e,
	"list"			: "#effect-list",
	"fpSelect"	: click,
};

spot_ns.pot = spot_ns.index.p;
spot_ns.ingScopeFilter 	= null; 
spot_ns.effScopeFilter 	= null;
spot_ns.purScopeFilter 	= null;
spot_ns.favorites				= null;
spot_ns.ingCount				= null;
spot_ns.effCount				= null;
spot_ns.potCount				= null;
spot_ns.scroll					= null;

function potionString ( potion )
{
	var ip = spot_ns.index.i.l;
	var ep = spot_ns.index.e.l;
	var ings = ip[ potion.i[0] ].n;
	var effs = ep[ potion.e[0] ].n;

	for( var i=1; i<potion.i.length; i++ ) ings += ", " + ip[ potion.i[i] ].n;
	for( var i=1; i<potion.e.length; i++ ) effs += ", " + ep[ potion.e[i] ].n;

	return( "<b>Ingredients :</b><br>"
			+ ings
			+ "<br><b>Effects :</b><br>"
			+ effs
			+ "" );
}


function displayPotions( potList )
{
	$("#potion-list").empty();

	var count=0,i;
	for( i in potList )
	{
		$("#potion-list").append( "<p class='tPots tag tag-default' data-potion='"+potList[i]+"'>" + potionString( spot_ns.index.p.l[potList[i]] ) + "</p>" );

		// speed up improvements
		if( ++count > 50 ) 
		{ 
			$("#potion-list").append( "<p><i>&lt; list truncated &gt;</p>" );
			break; 
		}
	}

	$( '#potion-list' ).children( 'p' ).each( function(){ $(this).show() } );
	// $( '#potion-list' ).children( 'p' ).each( function(){ options.idx.display[ $(this).data( 'idx' ) ] = $(this); } );
	$( '.tPots' ).click( function() {
		var click = $(this);
		var idx = click.data('potion');
		console.info( 'Potion #: ' + idx );
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
	var idx = click.data('idx');

	if( click.hasClass( 'tIngs' ) ) {
		sel = spot_ns.iOptions.idx.s;
		tag = 'tag-primary';

		if( true ) { 
			var ing = spot_ns.iOptions.idx.l[ idx ];
			var strEffs = [];

			console.info( "Ingredient: " + ing.n );
			for( var e=0; e<ing.e.length; e++ ) {
				strEffs.push( spot_ns.eOptions.idx.l[ ing.e[e].x ].n );
			}
			console.info( "   - Effects: [ " + strEffs.join( ', ' ) + ' ]' );
		}
	} else {
		sel = spot_ns.eOptions.idx.s;
		tag = 'tag-success';

		if( true ) { 
			var eff = spot_ns.eOptions.idx.l[ idx ];
			console.info( "Effect: " + eff.n );
		}
	}

	if( sel[idx] ){
		sel[idx] = false;
		click.removeClass( tag );
	}else{
		sel[idx] = true;
		click.addClass( tag );
	}

	spot_ns.redraw( false );
	return( false );
}


spot_ns.create_display_list = function( options )
{
	$( options.list ).empty();
	var idx = options.idx;
	var len = idx.z;

	for( var i=0; i<len; i++ )
	{
		var item = idx.l[ i ];
		$( options.list ).append( "<p" 
				+ " data-idx=\"" + i + "\""
				+ " class=\"" + options.notClass + "\">" 
				+ item.n 
				+ "</p>" ); 
	}

	$( options.list ).children( 'p' ).each( function(){ idx.d[ $(this).data( 'idx' ) ] = $(this); } );
	$( options.selector ).click( options.fpSelect );
}

function display_list( idx )
{
	var count = 0;
	for( var i=0; i<idx.z; i++ )
	{
		if( idx.b[i] ) {
			if( !idx.a[i] ) idx.d[i].hide( 'slow' );
		}else{
			if( idx.a[i] ) idx.d[i].show( 'slow' );
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

	if( potions == null ){
		for( var i=0; i<iLen; i++ ) iDisp[i] = true;
		for( var i=0; i<eLen; i++ ) eDisp[i] = true;
		return;
	}

	for( var i=0; i<iLen; i++ ) iDisp[i] = false;
	for( var i=0; i<eLen; i++ ) eDisp[i] = false;

	var pLen = potions.length;
	for( var i=0; i<pLen; i++ ){
		var pot = spot_ns.index.p.l[ potions[i] ];
		for( var j=0,k=pot.i.length; j<k; j++ ) iDisp[ pot.i[j] ] = true;
		// for( var j=0,k=pot.e.length; j<k; j++ ) eDisp[ pot.e[j] ] = true;
		for( var j=0,k=pot.e.length; j<k; j++ ) {
			// if( pot.e[j] == 0 ) debugger;
			eDisp[ pot.e[j] ] = true;
		}
	}
}

spot_ns.selectPurMenu = function()
{
	var hitText = $(this).text();

	switch( true ) {
		case /Positive/.test( hitText ):
			spot_ns.purScopeFilter = spot_ns.index.p.f.pos;
			break;
		case /Negative/.test( hitText ):
			spot_ns.purScopeFilter = spot_ns.index.p.f.neg;
			break;
		case /Any/.test( hitText ):
			spot_ns.purScopeFilter = null;
			break;
		default:
			// alert( "You hit a WTF!" );
			break;
	}

	if( spot_ns.purScopeFilter === null ) {
		console.info( "Purity filter: removed" );
	}else{
		console.info( "Purity filter: " + spot_ns.purScopeFilter.length );
	}

	spot_ns.redraw( false );
	return( true );
}

spot_ns.selectIngMenu = function()
{
	var hitText = $(this).text();

	switch( true ) {
		case /^Two/.test( hitText ):
			spot_ns.ingScopeFilter = spot_ns.index.p.i[2];
			break;
		case /^Three/.test( hitText ):
			spot_ns.ingScopeFilter = spot_ns.index.p.i[3];
			break;
		case /^Any/.test( hitText ):
			spot_ns.ingScopeFilter = null;
			break;
		default:
			// alert( "You hit a WTF!" );
			break;
	}

	spot_ns.redraw( false );
	return( true );
}


spot_ns.selectEffMenu = function()
{
	var hitText = $(this).text();

	switch( true ) {
		case /^One/.test( hitText ):
			spot_ns.effScopeFilter = spot_ns.index.p.e[1];
			break;
		case /^Two/.test( hitText ):
			spot_ns.effScopeFilter = spot_ns.index.p.e[2];
			break;
		case /^Three/.test( hitText ):
			spot_ns.effScopeFilter = spot_ns.index.p.e[3];
			break;
		case /^Four/.test( hitText ):
			spot_ns.effScopeFilter = spot_ns.index.p.e[4];
			break;
		case /^Five/.test( hitText ):
			spot_ns.effScopeFilter = spot_ns.index.p.e[5];
			break;
		case /^Any/.test( hitText ):
			spot_ns.effScopeFilter = null;
			break;
		default:
			// alert( "You hit a WTF!" );
			break;
	}

	spot_ns.redraw( false );
	return( true );
}

spot_ns.resetAll = function()
{
	var iIdx = spot_ns.iOptions.idx;
	var eIdx = spot_ns.eOptions.idx;

	var iDisp = iIdx.a;
	var eDisp = eIdx.a;

	var iLen = iIdx.z;
	var eLen = eIdx.z;

	for( var i=0; i<iLen; i++ ) { 
		iDisp[i] = true; 
		if( iIdx.s[i] ) {
			iIdx.s[i]=false; 
			iIdx.d[i].removeClass( 'tag-primary' );
		}
	}
	for( var i=0; i<eLen; i++ ) { 
		eDisp[i] = true; 
		if( eIdx.s[i] ) {
			eIdx.s[i]=false; 
			eIdx.d[i].removeClass( 'tag-success' );
		}
	}

	spot_ns.effScopeFilter 	= null;
	spot_ns.ingScopeFilter 	= null; 
	spot_ns.purScopeFilter = null;

	spot_ns.redraw( true );
}

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

	pLen = potions ? potions.length : 0;
	spot_ns.ingCount.text( iCnt ? iCnt : '-' );
	spot_ns.effCount.text( eCnt ? eCnt : '-' );
	spot_ns.potCount.text( pLen ? pLen : '-' );
	spot_ns.scroll.animate({ scrollTop: 0 }, 'slow');
}

}( window.spot_ns = window.spot_ns || {}, jQuery ));

$(document).ready( function()
{ 
	spot_ns.create_display_list( spot_ns.iOptions );
	spot_ns.create_display_list( spot_ns.eOptions );

	spot_ns.ingCount = $('#ingCount');
	spot_ns.effCount = $('#effCount');
	spot_ns.potCount = $('#potCount');
	spot_ns.scroll = $('html, body');

	spot_ns.redraw( false );

	$('#reset').click( spot_ns.resetAll );
	$('.selIng').click( spot_ns.selectIngMenu );
	$('.selEff').click( spot_ns.selectEffMenu );
	$('.purEff').click( spot_ns.selectPurMenu );
});

// vim:set tabstop=2 shiftwidth=2 noexpandtab:
