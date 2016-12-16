(function () {
"use strict";
  
spot_ns.buildBigPotions = function(idx)
{
  var fj = $("#fullJSON");

  // NOTE: every potion # less than max is a two ingredient potion
  var max = idx.p.z;
  var pList = idx.p.l;
  var seen = {};

  for( var i=0; i<max-1; i++ ){
    var A = pList[i];

    for( var j=i+1; j<max; j++ ){
      var B = pList[j];

      // at least one ingredient must be in common to proceed
      if( A.i[0] != B.i[0] && A.i[0] != B.i[1] && A.i[1] != B.i[0] && A.i[1] != B.i[1] ) continue;

      // if an other variant of this potion has already been seen, jump out...
      var ings = spot_ns.join( A.i, B.i );
      var key = ings.join(':');
      if( key in seen ) continue;
      seen[key] = true; // from now on this key has been seen

      // if no new effects are generated, this new potion is viable but useless...
      var mustHit = Math.max(A.e.length,B.e.length);
      var effs = spot_ns.join( A.e, B.e );
      var effLen = effs.length;
      if( effLen <= mustHit ) {
        ++idx.m.u[3][effLen];
        continue;
      }

      if( idx.p.z%100 == 0 ) {
        console.info( "[" + idx.p.z + "] Adding... " + key );
        if( idx.p.z > 35000 ) debugger;
      }
      // if( idx.p.z%100 == 0 ) fj.append( "<br>[" + idx.p.z + "] Adding... " + key );

      var pot = {
        x: idx.p.z++,
        i: ings,
        e: effs
      };

      pList.push( pot );
      idx.p.i[ 3        ].push( pot.x );
      idx.p.e[ effLen   ].push( pot.x );
      idx.i.p[ pot.i[0] ].push( pot.x );
      idx.i.p[ pot.i[1] ].push( pot.x );
      idx.i.p[ pot.i[2] ].push( pot.x );

      var effPos = 0, effNeg = 0;
      for( var i=0; i<effLen; i++ ) {
        idx.e.p[ pot.e[i] ].push( pot.x );
        if( idx.e.l[i].f ) {
          ++effPos;
        } else {
          ++effNeg;
        }
      }
      
      ++idx.m.u[3][effLen];

    }
  }
}
}());

// window.onload = function () {
$(document).ready( function() {
  // debugger; 
  var idx = spot_ns.index;
  spot_ns.buildBigPotions(idx);
  spot_ns.JSON_dump( 'index_big', idx );
} );
// vim: set ts=2 sw=2 et:
