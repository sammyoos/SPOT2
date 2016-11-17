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
		"selector" 	: "span.tIngs",
		"selected" 	: "span.tIngs.label-warning",
		"selClass" 	: "tIngs label label-warning",
		"notClass" 	: "tIngs",
		"global"	 	: getIdx().ingL,
		"list"			: "#ingredient-list",
		// "fpSelect"	: selectIngredient,
	 	"type"			: "i",
	};

	spot_ns.eOptions = {
		"selector"  : "span.tEffs",
		"selected"  : "span.tEffs.label-info",
		"selClass"  : "tEffs label label-info",
		"notClass"  : "tEffs",
		"global"	  : getIdx().effL,
		"list"			: "#effects-list",
		// "fpSelect"	: selectEffect,
	 	"type"			: "e",
	};

	spot_ns.allIngredients 	= new Array();
	spot_ns.allEffects 			= new Array();
	spot_ns.favorites				= null;

	// needs to be reset _every_ pass through...
	var netIndex = null, validEff = null, validIng = null, ingScopeFilter = null, effScopeFilter = null; 

	spot_ns.display_list = function( validList, selected, options )
	{
		$( options.list ).empty();

		for( var i in validList )
		{
			var item = options.global[ validList[ i ]];

			$( options.list ).append( "<p class=\"tag " 
					+ "tag-default" 
					+ "\">" + item.nam + "</p>" );
		}

	}

}( window.spot_ns = window.spot_ns || {}, jQuery ));

$(document).ready( function()
{ 
	var i;

	spot_ns.gi = new Object();
	for( i=0; i<spot_ns.iOptions.global.length; i++ ) spot_ns.gi[i]=i;
	//spot_ns.display_list( [ 0, 1, 2, 3 ] , null, spot_ns.iOptions );
	spot_ns.display_list( spot_ns.gi, null, spot_ns.iOptions );

});

// vim:set tabstop=2 shiftwidth=2 noexpandtab:
