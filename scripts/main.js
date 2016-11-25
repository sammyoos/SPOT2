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
	"idx"				: getIdx().ing,
	"list"			: "#ingredient-list",
	"fpSelect"	: click,
};

spot_ns.eOptions = {
	"selector"  : "p.tEffs",
	"selected"  : "p.tEffs.tag-success",
	"selClass"  : "tEffs tag tag-success",
	"notClass"  : "tEffs tag",
	"idx"				: getIdx().eff,
	"list"			: "#effect-list",
	"fpSelect"	: click,
};

spot_ns.pot = getIdx().pot;

spot_ns.favorites				= null;

function potionString ( potion )
{
	var ip = spot_ns.iOptions.idx.lab;
	var ep = spot_ns.eOptions.idx.lab;
	var ings = ip[ potion.ing[0] ].nam;
	var effs = ep[ potion.eff[0] ].nam;

	for( var i=1; i<potion.ing.length; i++ ) ings += ", " + ip[ potion.ing[i] ].nam;
	for( var i=1; i<potion.eff.length; i++ ) effs += ", " + ep[ potion.eff[i] ].nam;

	return( "<b>Ingredients :</b><br>"
			+ ings
			+ "<br><b>Effects :</b><br>"
			+ effs
			+ "" );
}


function displayPotions( index )
{
	$("#potion-list").empty();

	var count=0,i;
	for( i in index )
	{
		$("#potion-list").append( "<p class='tPots tag tag-default' data-potion='"+index[i]+"'>" + potionString( spot_ns.pot.lab[index[i]] ) + "</p>" );

		// speed up improvements
		if( ++count > 50 ) 
		{ 
			$("#potion-list").append( "<p><i>&lt; list truncated &gt;</p>" );
			break; 
		}
	}

	$( '#potion-list' ).children( 'p' ).each( function(){ $(this).show() } );
	// $( '#potion-list' ).children( 'p' ).each( function(){ options.idx.display[ $(this).data( 'idx' ) ] = $(this); } );
	// $( '.tPots' ).click( addFavorite );
}


// function: merge
// provide a "safe" intersection of two sorted arrays
// http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
function merge(a, b)
{
	// this next line was my own addition
	if( !a ) { return( b ); }

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
	var sel = options.idx.selected;
	var len = sel.length;

	for( var i=0; i<len; i++ )
	{
		if( sel[i] ) {
			filter = merge( filter, options.idx.pot[i] );
		}
	}
	return filter;
}

function merge_all()
{
	var filter=null;

	filter = option_merge( filter, spot_ns.iOptions );
	filter = option_merge( filter, spot_ns.eOptions );

	return filter;
}

function click() {
	var sel,tag;
	var click = $(this);
	var idx = click.data('idx');

	if( click.hasClass( 'tIngs' ) ) {
		sel = spot_ns.iOptions.idx.selected;
		tag = 'tag-primary';
	} else {
		sel = spot_ns.eOptions.idx.selected;
		tag = 'tag-success';
	}

	if( sel[idx] ){
		sel[idx] = false;
		click.removeClass( tag );
	}else{
		sel[idx] = true;
		click.addClass( tag );
	}

	spot_ns.redraw();
	return( false );
}


spot_ns.create_display_list = function( options )
{
	$( options.list ).empty();

	for( var i=0; i<options.idx.lab.length; i++ )
	{
		var item = options.idx.lab[ i ];
		$( options.list ).append( "<p" 
				+ " data-idx=\"" + i + "\""
				+ " class=\"" + options.notClass + "\">" 
				+ item.nam + "</p>" ); 
	}

	$( options.list ).children( 'p' ).each( function(){ options.idx.display[ $(this).data( 'idx' ) ] = $(this); } );
	$( options.selector ).click( options.fpSelect );
}

function display_list( idx )
{
	for( var i=0; i<idx.display.length; i++ )
	{
		if( idx.prevDisplay[i] ) {
			if( !idx.nextDisplay[i] ) {
				idx.display[i].hide( 'slow' );
			}
		}else{
			if( idx.nextDisplay[i] ) {
				idx.display[i].show( 'slow' );
			}
		}
	}
}

function setAvail( potions, iIdx, eIdx ){
	if( potions == null ) return;
	var iDisp = iIdx.nextDisplay;
	var eDisp = eIdx.nextDisplay;

	var iLen = iDisp.length;
	var eLen = eDisp.length;
	var pLen = potions.length;


	for( var i=0; i<iLen; i++ ) iDisp[i] = false;
	for( var i=0; i<eLen; i++ ) eDisp[i] = false;

	for( var i=0; i<pLen; i++ ){
		var pot = spot_ns.pot.lab[ potions[i] ];
		for( var j=0; j<pot.ing.length; j++ ) iDisp[ pot.ing[j] ] = true;
		for( var j=0; j<pot.eff.length; j++ ) eDisp[ pot.eff[j] ] = true;
	}
}

spot_ns.redraw = function( )
{
	var potions = merge_all();
	displayPotions( potions );

	var iIdx = spot_ns.iOptions.idx;
	var eIdx = spot_ns.eOptions.idx;
	setAvail( potions, iIdx, eIdx );

	display_list( iIdx );
	display_list( eIdx );

	var iTmp = iIdx.nextDisplay;
	var eTmp = eIdx.nextDisplay;

	iIdx.nextDisplay = iIdx.prevDisplay;
	eIdx.nextDisplay = eIdx.prevDisplay;

	iIdx.prevDisplay = iTmp;
	eIdx.prevDisplay = eTmp;
}

}( window.spot_ns = window.spot_ns || {}, jQuery ));

$(document).ready( function()
{ 
	spot_ns.create_display_list( spot_ns.iOptions );
	spot_ns.create_display_list( spot_ns.eOptions );

	spot_ns.redraw();
});

// vim:set tabstop=2 shiftwidth=2 noexpandtab:
