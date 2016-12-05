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
spot_ns.effScopeFilter 	= null;
spot_ns.ingScopeFilter 	= null; 
spot_ns.favorites				= null;

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
	$('.tPots').click( spot_ns.showPot );
}


// function: merge
// provide a "safe" intersection of two sorted arrays
// http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
function merge(a, b)
{
	// this next line was my own addition
	if( !a ) { return( b ); } // case where filter has not been initialized yet
	if( !b ) { return( a ); } // case where there is no filter set for b

	var ai=0, bi=0, result = new Array();

	while( ai < a.length && bi < b.length )
	{
		if      (a[ai] < b[bi] ){ ai++; }
		else if (a[ai] > b[bi] ){ bi++; }
		else { result.push(a[ai]); ai++; bi++; }
	}

	return result;
}

function option_merge( filter, options )
{
	var sel = options.idx.s;
	var len = options.idx.z;
	var pot = options.idx.p;

	for( var i=0; i<len; i++ )
	{
		if( sel[i] ) filter = merge( filter, pot[i] );
	}
	return filter;
}

function merge_all()
{
	var filter=null;

	filter = option_merge( filter, spot_ns.iOptions );
	filter = option_merge( filter, spot_ns.eOptions );

	filter = merge( filter, spot_ns.effScopeFilter );
	filter = merge( filter, spot_ns.ingScopeFilter );

	return filter;
}

function click() {
	var sel,tag;
	var click = $(this);
	var idx = click.data('idx');

	var name = null;
	if( click.hasClass( 'tIngs' ) ) {
		name = spot_ns.iOptions.idx.l[ idx ].n;
		sel = spot_ns.iOptions.idx.s;
		tag = 'tag-primary';
	} else {
		name = spot_ns.eOptions.idx.l[ idx ].n;
		sel = spot_ns.eOptions.idx.s;
		tag = 'tag-success';
	}


	if( sel[idx] ){
		console.log( "unselect [" + idx + ", " + name + "]" );
		sel[idx] = false;
		click.removeClass( tag );
	}else{
		console.log( "select [" + idx + ", " + name + "]" );
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
				+ item.n + "</p>" ); 
	}

	$( options.list ).children( 'p' ).each( function(){ idx.d[ $(this).data( 'idx' ) ] = $(this); } );
	$( options.selector ).click( options.fpSelect );
}

function display_list( idx )
{
	for( var i=0; i<idx.z; i++ )
	{
		if( idx.b[i] ) {
			if( !idx.a[i] ) idx.d[i].hide( 'slow' );
		}else{
			if( idx.a[i] ) idx.d[i].show( 'slow' );
		}
	}
}

function setAvail( potions, iIdx, eIdx ){
	var iDisp = iIdx.a;
	var eDisp = eIdx.a;

	var iLen = iIdx.z;
	var eLen = eIdx.z;

	var qq=47;
	console.log( "(A) display 'Restore Stanima' : " + eDisp[qq] );
	console.log( eDisp[qq] );

	if( potions == null ){
		for( var i=0; i<iLen; i++ ) iDisp[i] = true;
		for( var i=0; i<eLen; i++ ) eDisp[i] = true;

		console.log( "(B) display 'Restore Stanima' : " + eDisp[qq] );
		return;
	}


	for( var i=0; i<iLen; i++ ) iDisp[i] = false;
	for( var i=0; i<eLen; i++ ) eDisp[i] = false;

	console.log( "(C) display 'Restore Stanima' : " + eDisp[qq] );

	var pLen = potions.length;
	for( var i=0; i<pLen; i++ ){
		// if( potions[i] == 556 ) debugger;

		var pot = spot_ns.index.p.l[ potions[i] ];
		for( var j=0,k=pot.i.length; j<k; j++ ) iDisp[ pot.i[j] ] = true;
		for( var j=0,k=pot.e.length; j<k; j++ ) eDisp[ pot.e[j] ] = true;
//		for( var j=0,k=pot.e.length; j<k; j++ ) 
//		{
//			if( potions[i] == 556 ) 
//			{
//				console.log( 'Potion Effect: [' + pot.e[j] + '] ==> [' + spot_ns.e.l[ pot.e[j] ].n + ']' );
//				eDisp[ pot.e[j] ] = true;
//			}
//		}
	}

	console.log( "(D) display 'Restore Stanima' : " + eDisp[qq] );
}

function debug_pot( idx ) 
{
	console.log( 'Selected potion: ' + idx );

	var pot = spot_ns.index.p.l[idx];

	var iNum = pot.i[ 0 ] + "";
	var iStr = spot_ns.index.i.l[ pot.i[ 0 ] ].n + "";
	for( var i=1; i<pot.i.length; i++ )
	{
		var iIdx = pot.i[i];
		iNum += ', ' + iIdx;
		iStr += ', ' + spot_ns.index.i.l[ iIdx ].n;
	}

	console.log( '[' + iNum + '] ==> [' + iStr +']' );

	var eNum = pot.e[ 0 ] + "";
	var eStr = spot_ns.index.e.l[ pot.e[ 0 ] ].n + "";
	for( var e=1; e<pot.e.length; e++ )
	{
		var eIdx = pot.e[e];
		eNum += ', ' + eIdx;
		eStr += ', ' + spot_ns.index.e.l[ eIdx ].n;
	}

	console.log( '[' + eNum + '] ==> [' + eStr +']' );
}

spot_ns.showPot = function()
{
	var disp = $(this);
	var idx = disp.data( 'potion' );

	debug_pot( idx );

	return( false );
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

	spot_ns.redraw( true );
}

spot_ns.redraw = function( reset )
{
	var potions = reset?null:merge_all();
	displayPotions( potions );
	if( potions === null ) {
		console.log( "potion list not created" );
	}else{
		console.log( "# of Potions: " + potions.length );
		console.log( potions.join( ', ' ) );
	}

	var iIdx = spot_ns.iOptions.idx;
	var eIdx = spot_ns.eOptions.idx;
	setAvail( potions, iIdx, eIdx );

	display_list( iIdx );
	display_list( eIdx );

	var iTmp = iIdx.a;
	var eTmp = eIdx.a;

	iIdx.a = iIdx.b;
	eIdx.a = eIdx.b;

	iIdx.b = iTmp;
	eIdx.b = eTmp;

	$('html, body').animate({ scrollTop: 0 }, 'slow');
}

}( window.spot_ns = window.spot_ns || {}, jQuery ));

$(document).ready( function()
{ 
	spot_ns.create_display_list( spot_ns.iOptions );
	spot_ns.create_display_list( spot_ns.eOptions );

	spot_ns.redraw( false );
	$('#reset').click( spot_ns.resetAll );
	$('.selEff').click( spot_ns.selectEffMenu );
	$('.selIng').click( spot_ns.selectIngMenu );
});

// vim:set tabstop=2 shiftwidth=2 noexpandtab:
