(function( sns, $, undefined ) {
  "use strict";

  QUnit.module( "utils" );
  QUnit.test( "utils", function( assert ) {
    assert.ok( window.hasOwnProperty( 'sns' ), "utils is loading correctly" );
    debugger;
    assert.ok( sns.hasOwnProperty( 'extHashCode' ), "sns is loading correctly" );
  });

  QUnit.test( "hashcode", function( assert ) {
    assert.equal( sns.extHashCode( "foobar" ), -1268878963, "hashCode for 'foobar'" );
    assert.equal( sns.extHashify( "foobar" ), "5E7-18D", "hashify for 'foobar'" );

    assert.equal( sns.extHashCode( "" ), 0, "hashCode for ''" );
    assert.equal( sns.extHashify( "" ), "000-000", "hashify for ''" );

    assert.equal( sns.extHashCode( "0" ), 48, "hashCode for '0'" );
    assert.equal( sns.extHashify( "0" ), "000-030", "hashify for '0'" );
  });

  var A = [ 1, 2, 3, 4, 9, 10 ];
  var B = [ 1, 2 ];
  var C = [ 3, 4 ];
  var D = [ 9, 10 ];
  var E = [ 7, 9, 11, 19 ];

  QUnit.test( "intersect", function( assert ) {
    assert.deepEqual( sns.intersect( A, B ), [ 1, 2 ], "intersect A and B" );
    assert.deepEqual( sns.intersect( A, C ), [ 3, 4 ], "intersect A and C" );
    assert.deepEqual( sns.intersect( A, D ), [ 9, 10 ], "intersect A and D" );
    assert.deepEqual( sns.intersect( A, E ), [ 9 ], "intersect A and E" );
    assert.deepEqual( sns.intersect( B, E ), [  ], "intersect B and E" );

    assert.deepEqual( sns.intersect( null, B ), B, "intersect null and B" );
    assert.deepEqual( sns.intersect( B, null ), B, "intersect B and null" );
  });

  QUnit.test( "join", function( assert ) {
    assert.deepEqual( sns.join( A, B ), A, "join A and B" );
    assert.deepEqual( sns.join( A, C ), A, "join A and C" );
    assert.deepEqual( sns.join( A, D ), A, "join A and D" );
    assert.deepEqual( sns.join( A, E ), [ 1, 2, 3, 4, 7, 9, 10, 11, 19 ], "join A and E" );
    assert.deepEqual( sns.join( B, E ), [ 1, 2, 7, 9, 11, 19 ], "join B and E" );

    // no null tests for the joins
  });


}( window.sns = window.sns || {}, jQuery ));
// vim:set tabstop=2 shiftwidth=2 expandtab:
