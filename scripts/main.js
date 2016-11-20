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
		"global"	 	: getIdx().ingL,
		"list"			: "#ingredient-list",
		"fpSelect"	: selectIngredient,
	 	"type"			: "i",
	};

	spot_ns.eOptions = {
		"selector"  : "p.tEffs",
		"selected"  : "p.tEffs.tag-success",
		"selClass"  : "tEffs tag tag-success",
		"notClass"  : "tEffs tag",
		"global"	  : getIdx().effL,
		"list"			: "#effect-list",
		"fpSelect"	: selectEffect,
	 	"type"			: "e",
	};

	spot_ns.allIngredients 	= new Array();
	spot_ns.allEffects 			= new Array();
	spot_ns.favorites				= null;

	// needs to be reset _every_ pass through...
	var netIndex = null, validEff = null, validIng = null, ingScopeFilter = null, effScopeFilter = null; 

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

	spot_ns.display_list = function( validList, selected, options )
	{
		$( options.list ).empty();

		for( var i in validList )
		{
			var item = options.global[ validList[ i ]];

			$( options.list ).append( "<p class=\""
					+ options.notClass
					+ "\">" + item.nam + "</p>" );
		}

		$( options.selector ).click( options.fpSelect );
	}

}( window.spot_ns = window.spot_ns || {}, jQuery ));

$(document).ready( function()
{ 
	var i;

	spot_ns.gi = new Object();
	for( i=0; i<spot_ns.iOptions.global.length; i++ ) spot_ns.gi[i]=i;
	spot_ns.display_list( spot_ns.gi, null, spot_ns.iOptions );

	spot_ns.ge = new Object();
	for( i=0; i<spot_ns.eOptions.global.length; i++ ) spot_ns.ge[i]=i;
	spot_ns.display_list( spot_ns.ge, null, spot_ns.eOptions );

});

// vim:set tabstop=2 shiftwidth=2 noexpandtab:
