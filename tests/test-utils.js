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

  /*
  var A = [ 1, 2, 3, 4, 9, 10 ];
  var B = [ 1, 2 ];
  var C = [ 3, 4 ];
  var D = [ 9, 10 ];
  var E = [ 7, 9, 11, 19 ];
  */

  var A = [ 10, 9, 4, 3, 2, 1 ];
  var B = [ 2, 1 ];
  var C = [ 4, 3 ];
  var D = [ 10, 9 ];
  var E = [ 19, 11, 9, 7 ];

  QUnit.test( "intersect", function( assert ) {
    assert.deepEqual( sns.intersect( A, B ), B, "intersect A and B" );
    assert.deepEqual( sns.intersect( A, C ), C, "intersect A and C" );
    assert.deepEqual( sns.intersect( A, D ), D, "intersect A and D" );
    assert.deepEqual( sns.intersect( A, E ), [ 9 ], "intersect A and E" );
    assert.deepEqual( sns.intersect( B, E ), [  ], "intersect B and E" );

    assert.deepEqual( sns.intersect( null, B ), B, "intersect null and B" );
    assert.deepEqual( sns.intersect( B, null ), B, "intersect B and null" );
  });

  QUnit.test( "join", function( assert ) {
    assert.deepEqual( sns.join( A, B ), A, "join A and B" );
    assert.deepEqual( sns.join( A, C ), A, "join A and C" );
    assert.deepEqual( sns.join( A, D ), A, "join A and D" );
    assert.deepEqual( sns.join( A, E ), [ 19, 11, 10, 9, 7, 4, 3, 2, 1 ], "join A and E" );
    assert.deepEqual( sns.join( B, E ), [ 19, 11, 9, 7, 2, 1 ], "join B and E" );

    // no null tests for the joins
  });


}( window.sns = window.sns || {}, jQuery ));
// vim:set tabstop=2 shiftwidth=2 expandtab:
