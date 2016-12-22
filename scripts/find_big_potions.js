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
    const A = pList[i], Ai = A.i, Ae = A.e;

    for( var j=i+1; j<max; j++ ){
      var B = pList[j], Bi = B.i, Be = B.e;

      // at least one ingredient must be in common to proceed
      if( Ai[0] != Bi[0] && Ai[0] != Bi[1] && Ai[1] != Bi[0] && Ai[1] != Bi[1] ) continue;

      // if an other variant of this potion has already been seen, jump out...
      var ings = spot_ns.join( Ai, Bi );
      var key = ings.join(':');
      if( key in seen ) { continue; }
      seen[key] = true; // from now on this key has been seen

      // if no new effects are generated, this new potion is viable but useless...
      var mustHit = Math.max(Ae.length,Be.length);
      var effs = spot_ns.join( Ae, Be );
      var effLen = effs.length;
      if( effLen <= mustHit ) {
        ++idx.m.u[3][effLen];
        continue;
      }

      if( idx.p.z%1000 == 0 ) { console.info( "[" + idx.p.z + "] Adding... " + key ); }

      const position = idx.p.z++;
      var pot = {
        x: position,
        i: ings,
        e: effs
      };

      pList.push( pot );
      idx.p.i[ 3        ].push( position );
      idx.p.e[ effLen   ].push( position );
      idx.i.p[ pot.i[0] ].push( position );
      idx.i.p[ pot.i[1] ].push( position );
      idx.i.p[ pot.i[2] ].push( position );

      var effPos = 0, effNeg = 0;
      for( var i=0; i<effLen; i++ ) {
        idx.e.p[ pot.e[i] ].push( position );
        if( idx.e.l[i].f ) {
          ++effPos;
        } else {
          ++effNeg;
        }
      }
      
      ++idx.m.u[3][effLen];

    }
  }
};

spot_ns.find_big_potions = function() {
  var idx = spot_ns.index;
  spot_ns.buildBigPotions(idx);
  spot_ns.JSON_dump( 'index_big', idx );
};

}());

// vim: set ts=2 sw=2 et:
