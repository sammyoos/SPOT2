(function( spot_ns, $, undefined ) {
	"use strict";

	QUnit.module( "utils" );
	QUnit.test( "utils", function( assert ) {
		assert.ok( window.hasOwnProperty( 'spot_ns' ), "utils is loading correctly" );
		assert.ok( spot_ns.hasOwnProperty( 'extHashCode' ), "spot_ns is loading correctly" );
	});

	QUnit.test( "hashcode", function( assert ) {
		assert.equal( spot_ns.extHashCode( "foobar" ), -1268878963, "hashCode for 'foobar'" );
		assert.equal( spot_ns.extHashify( "foobar" ), "5E7-18D", "hashify for 'foobar'" );

		assert.equal( spot_ns.extHashCode( "" ), 0, "hashCode for ''" );
		assert.equal( spot_ns.extHashify( "" ), "000-000", "hashify for ''" );

		assert.equal( spot_ns.extHashCode( "0" ), 48, "hashCode for '0'" );
		assert.equal( spot_ns.extHashify( "0" ), "000-030", "hashify for '0'" );
	});

	var A = [ 1, 2, 3, 4, 9, 10 ];
	var B = [ 1, 2 ];
	var C = [ 3, 4 ];
	var D = [ 9, 10 ];
	var E = [ 7, 9, 11, 19 ];

	QUnit.test( "intersect", function( assert ) {
		assert.deepEqual( spot_ns.intersect( A, B ), [ 1, 2 ], "intersect A and B" );
		assert.deepEqual( spot_ns.intersect( A, C ), [ 3, 4 ], "intersect A and C" );
		assert.deepEqual( spot_ns.intersect( A, D ), [ 9, 10 ], "intersect A and D" );
		assert.deepEqual( spot_ns.intersect( A, E ), [ 9 ], "intersect A and E" );
		assert.deepEqual( spot_ns.intersect( B, E ), [  ], "intersect B and E" );

		assert.deepEqual( spot_ns.intersect( null, B ), B, "intersect null and B" );
		assert.deepEqual( spot_ns.intersect( B, null ), B, "intersect B and null" );
	});

	QUnit.test( "join", function( assert ) {
		assert.deepEqual( spot_ns.join( A, B ), A, "join A and B" );
		assert.deepEqual( spot_ns.join( A, C ), A, "join A and C" );
		assert.deepEqual( spot_ns.join( A, D ), A, "join A and D" );
		assert.deepEqual( spot_ns.join( A, E ), [ 1, 2, 3, 4, 7, 9, 10, 11, 19 ], "join A and E" );
		assert.deepEqual( spot_ns.join( B, E ), [ 1, 2, 7, 9, 11, 19 ], "join B and E" );

		// no null tests for the joins
	});


}( window.spot_ns = window.spot_ns || {}, jQuery ));
// vim:set tabstop=2 shiftwidth=2 expandtab:
