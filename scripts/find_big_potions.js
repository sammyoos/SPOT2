(function () {
"use strict";
  
spot_ns.buildBigPotions = function(idx)
{
  const ip = idx.p, ipl = ip.l, ipi3 = ip.i[3], ipe = ip.e;
  const ii = idx.i, iil = ii.l, iip = ii.p, iipMax = iip.length;
  const ie = idx.e, iep = ie.p, iel = ie.l;
  const imu3 = idx.m.u[3];

  var seen = new Array( 1<<15 );
  var ingListMax = new Array( iipMax );

  // need to save these values as they will change...
  for( var k=0; k<iipMax; k++ ) ingListMax[k] = iip[k].length;

  for( var k=0; k<iipMax; k++ ){
    const max = ingListMax[k];
    const iipK = iip[k]; // all potions related to this ingredient

    for( var i=0; i<max-1; i++ ){
      const iPNum = iipK[i];
      const A = ipl[iPNum], Ai = A.i, Ae = A.e;

      for( var j=i+1; j<max; j++ ){
        const jPNum = iipK[j];
        const B = ipl[jPNum], Bi = B.i, Be = B.e;

        // if an other variant of this potion has already been seen, jump out...
        const ings = spot_ns.join( Ai, Bi );
        const key = (ings[0]<<14) | (ings[1]<<7) | ings[2];
        if( seen[ key ] ) continue;
        seen[ key ] = 1;

        var eA = iil[ ings[0] ].e.map( function(e){ return e.x });
        var eB = iil[ ings[1] ].e.map( function(e){ return e.x });
        var eC = iil[ ings[2] ].e.map( function(e){ return e.x });

        var ab = spot_ns.intersect( eA, eB );
        var ac = spot_ns.intersect( eA, eC );
        var bc = spot_ns.intersect( eB, eC );

        var effs = spot_ns.join( ab, ac );
        var effs = spot_ns.join( effs, bc );

        // if no new effects are generated, this new potion is viable but useless...
        // const effs = spot_ns.join( Ae, Be );
        const effLen = effs.length;
        if( effLen <= Math.max( Ae.length,Be.length )) continue;

        debugger;

        const position = ip.z++;
        if( (position&1023) == 1023 ) console.info( position );

        var pot = {
          x: position,
          i: ings,
          e: effs,
          f: spot_ns.checkFavorable( idx, effs, position )
        };

        ipl.push( pot );
        ipi3.push( position );
        ipe[ effLen   ].push( position );
        iip[ pot.i[0] ].push( position );
        iip[ pot.i[1] ].push( position );
        iip[ pot.i[2] ].push( position );

        ++imu3[ effLen ];
      }
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
