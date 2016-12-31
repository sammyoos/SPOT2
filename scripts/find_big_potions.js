// jshint esversion: 6
(function( sns, $, undefined ) {
  "use strict";

  const index = sns.index;

  const idxIng = index[ sns.idxIng ];
  const ingLst = idxIng[ sns.ieLst ];
  const ingSiz = idxIng[ sns.ieSiz ];
  const ingPot = idxIng[ sns.iePot ];

  const idxEff = index[ sns.idxEff ];
  const effSiz = idxEff[ sns.ieSiz ];
  const effLst = idxEff[ sns.ieLst ];
  const effPot = idxEff[ sns.iePot ];

  const idxPot = index[ sns.idxPot ];
  const potEff = idxPot[ sns.idxPotEff ];
  const potIng = idxPot[ sns.idxPotIng ];
  const potLst = idxPot[ sns.idxPotLst ];
  const potNat = idxPot[ sns.idxPotNat ];
  const potIng2 = potIng[2];
  const potIng3 = potIng[2];

  var cummulativeEffects = function( ing1, ing2, ing3 )
  {
    var effGrp1 = ingLst[ ing1 ][ sns.objIngEff ].map( function(e){ return e[ sns.objIngEffPos ]; });
    var effGrp2 = ingLst[ ing2 ][ sns.objIngEff ].map( function(e){ return e[ sns.objIngEffPos ]; });
    var effGrp3 = ingLst[ ing3 ][ sns.objIngEff ].map( function(e){ return e[ sns.objIngEffPos ]; });

    var effGrp12 = sns.intersect( effGrp1, effGrp2 );
    var effGrp13 = sns.intersect( effGrp1, effGrp3 );
    var effGrp23 = sns.intersect( effGrp2, effGrp3 );

    var effs = sns.join( effGrp12, effGrp13 );
    var effs = sns.join( effs, effGrp23 );

    return( effs );
  }

  
  sns.buildBigPotions = function()
  {
    const numIngs = ingPot.length;
    console.assert( numIngs === 113, "should be the same as the number of ingredients" );

    var seen = new Array( 1<<15 );
    var ingListMax = new Array( numIngs );

    // need to save these values as they will change...
    for( var k=0; k<numIngs; k++ ) ingListMax[k] = ingPot[k].length;

    for( var k=0; k<numIngs; k++ ){
      const max = ingListMax[k];
      const idxPotK = ingPot[k]; // all potions related to this ingredient

      for( var i=0; i<max-1; i++ ){
        const potNumI = idxPotK[i];
        const A = potLst[potNumI], 
              Ai = A[ sns.objPotIng ],
              Ae = A[ sns.objPotEff ];

        for( var j=i+1; j<max; j++ ){
          const potNumJ = idxPotK[j];
          const B = potLst[potNumJ],
              Bi = B[ sns.objPotIng ],
              Be = B[ sns.objPotEff ];

          // if an other variant of this potion has already been seen, jump out...
          const ings = sns.join( Ai, Bi );
          const key = (ings[0]<<14) | (ings[1]<<7) | ings[2];
          if( seen[ key ] ) continue;
          seen[ key ] = 1;

          var effs = cummulativeEffects( ings[0], ings[1], ings[2] );

          // if no new effects are generated, this new potion is viable but useless...
          const effLen = effs.length;
          if( effLen <= Math.max( Ae.length,Be.length )) continue;

          // debugger;

          const position = idxPot[ sns.idxPotSiz ]++;
          if( (position&1023) == 1023 ) console.info( position );

          sns.addPotion( ings, effs, position ); 
        }
      }
    }
  };

  sns.find_big_potions = function() {
    var idx = sns.index;
    sns.buildBigPotions(idx);
    sns.JSON_dump( 'index_big', idx );
  };

}( window.sns = window.sns || {}, jQuery )); 
/* vim:set tabstop=2 shiftwidth=2 expandtab: */
