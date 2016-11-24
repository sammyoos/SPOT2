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
	"fpSelect"	: selectIngredient,
	"type"			: "i",
};

spot_ns.eOptions = {
	"selector"  : "p.tEffs",
	"selected"  : "p.tEffs.tag-success",
	"selClass"  : "tEffs tag tag-success",
	"notClass"  : "tEffs tag",
	"idx"				: getIdx().eff,
	"list"			: "#effect-list",
	"fpSelect"	: selectEffect,
	"type"			: "e",
};

spot_ns.favorites				= null;

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

function option_merge( option )
{
	var filter=false;
	var sel = options.idx.selected;
	var len = sel.length;

	for( var i=0; i<len; i++ )
	{
		if( sel[i] ) filter = merge( merge, options.idx.pot[i] );
	}
}

function merge_all( iOptions, eOptions )
{
	var filter=null;

	filter = option_merge( filter, spot_ns.iOptions );
	filter = option_merge( filter, spot_ns.eOptions );

	return filter;
}

function selectIngredient()
{
	var ing = $(this);
	var idx = ing.data('idx');
	var sel = spot_ns.iOptions.idx.selected;

	if( sel[idx] ){
		sel[idx] = false;
		ing.removeClass( "tag-primary" );
	}else{
		sel[idx] = true;
		ing.addClass( "tag-primary" );
	}

	spot_ns.redraw();
	return( false );
}

function selectEffect()
{
	var eff = $(this);
	var idx = ing.data('idx');
	eff.toggleClass( "tag-success" );
	console.log( idx );
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

display_list = function( options )
{
	for( var i=0; i<options.idx.display.length; i++ )
	{
		if( options.idx.prevDisplay[i] ) {
			if( !options.idx.nextDisplay[i] ) {
				options.idx.display[i].hide( 'slow' );
			}
		}else{
			if( options.idx.nextDisplay[i] ) {
				options.idx.display[i].show( 'slow' );
			}
		}
	}
}

spot_ns.redraw = function( )
{
	display_list( spot_ns.iOptions );
	display_list( spot_ns.eOptions );

	// var tmp = options.idx.nextDisplay;
	// options.idx.nextDisplay = options.idx.prevDisplay;
	// options.idx.prevDisplay = tmp;
}

}( window.spot_ns = window.spot_ns || {}, jQuery ));

$(document).ready( function()
{ 
	spot_ns.create_display_list( spot_ns.iOptions );
	spot_ns.create_display_list( spot_ns.eOptions );

	spot_ns.redraw();
});

// vim:set tabstop=2 shiftwidth=2 noexpandtab:
