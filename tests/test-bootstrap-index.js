(function( sns, $, undefined ) {
	"use strict";

	QUnit.module( "bootstrap-index" );

	QUnit.test( "loading", function( assert ) {
		assert.ok( window.hasOwnProperty( 'sns' ), "...is loading correctly" );
		assert.ok( sns.hasOwnProperty( 'iOptions' ), "check at least one property" );
	});

  QUnit.test( "create a new index object", function( assert ) {
		assert.ok( sns.hasOwnProperty( 'getTemplateIndex' ), "is the function there" );
    var idx = sns.getTemplateIndex();
    assert.equal( idx[ sns.idxIng ][ sns.ieSiz ]    , 113, "ingredient array size" );
    assert.equal( idx[ sns.idxEff ][ sns.ieSiz ]    ,  55, "effect array size" );
    assert.equal( idx[ sns.idxPot ][ sns.ieSiz ]    ,   0, "potion array size (method 1)" ); // both this and next line are acceptable
    assert.equal( idx[ sns.idxPot ][ sns.idxPotSiz ],   0, "potion array size (method 2)" );

    assert.equal( idx[ sns.idxIng ][ sns.ieRev ][ "Abecean Longfin"         ], 112, "first ingredient (alphabetically)" );
    assert.equal( idx[ sns.idxIng ][ sns.ieRev ][ "Yellow Mountain Flower"  ],   0, "last ingredient (alphabetically)" );
    assert.equal( idx[ sns.idxEff ][ sns.ieRev ][ "Cure Disease"            ],  54, "first effect (alphabetically)" );
    assert.equal( idx[ sns.idxEff ][ sns.ieRev ][ "Weakness to Shock"       ],   0, "last effect (alphabetically)" );
  });

}( window.sns = window.sns || {}, jQuery ));
// vim:set tabstop=2 shiftwidth=2 expandtab:
