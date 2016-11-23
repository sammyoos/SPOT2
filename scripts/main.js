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

	function selectIngredient()
	{
		$(this).toggleClass( "tag-primary" );
		redraw();
		return( false );
	}

	function selectEffect()
	{
		$(this).toggleClass( "tag-success" );
		redraw();
		return( false );
	}

	spot_ns.create_display_list = function( options )
	{
		$( options.list ).empty();

		for( var i=0; i<options.idx.lab.length; i++ )
		{
			var item = options.idx.lab[ i ];
			options.idx.display[i] =
				$( options.list ).append( "<p" 
						+ " data-idx=\"" + i + "\""
						+ " class=\"" + options.notClass + "\">" 
						+ item.nam + "</p>" ).show( 'slow' );

		}

		$( options.list ).children( 'p' ).each( function(){ options.idx.display[ $(this).data( 'idx' ) ] = $(this); } );
		$( options.selector ).click( options.fpSelect );
	}

	spot_ns.display_list = function( options )
	{
		for( var i=0; i<options.idx.display.length; i++ )
		{
			if( options.idx.prevDisplay[i] ) {
				if( !options.idx.nextDisplay[i] ) {
					console.log( "hiding " + i );
					options.idx.display[i].hide( 'slow' );
				}
			}else{
				if( options.idx.nextDisplay[i] ) {
					console.log( "showing " + i );
					console.log( options.idx.display[i] );
					options.idx.display[i].show( 'slow' );
				}
			}
		}
	}

	spot_ns.redraw = function( )
	{
		spot_ns.display_list( spot_ns.iOptions );
		spot_ns.display_list( spot_ns.eOptions );

		var tmp = options.idx.nextDisplay;
		options.idx.nextDisplay = options.idx.prevDisplay;
		options.idx.prevDisplay = tmp;
	}

}( window.spot_ns = window.spot_ns || {}, jQuery ));

$(document).ready( function()
{ 
	spot_ns.create_display_list( spot_ns.iOptions );
	spot_ns.create_display_list( spot_ns.eOptions );

	spot_ns.redraw();
});

// vim:set tabstop=2 shiftwidth=2 noexpandtab:
