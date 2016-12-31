(function( sns, $, undefined ) {
	"use strict";

	QUnit.module( "constants" );

	QUnit.test( "loading", function( assert ) {
		assert.ok( window.hasOwnProperty( 'sns' ), "...is loading correctly" );
		assert.ok( sns.hasOwnProperty( 'maxPotDis' ), "check at least one property" );
	});

}( window.sns = window.sns || {}, jQuery ));
/* vim:set tabstop=2 shiftwidth=2 expandtab: */
