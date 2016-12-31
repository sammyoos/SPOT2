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

  sns.processEffects = function( ingEff, potPos )
  {
    var effPos = 0, effNeg = 0;

    for( var e=0; e<ingEff.length; e++ ) {
      var eff = ingEff[ e ];
      effPot[ eff ].push( potPos );
      if( effLst[ eff ][ sns.objEffNat ] == sns.objEffNatPos ) {
        ++effPos;
      } else {
        ++effNeg;
      }
    }

    const effNet = effPos + effNeg;

    if( effNeg === 0 ) {
      potNat[ sns.objEffNatPos ].push( potPos );
      return 0;
    } else if( effPos === 0 ) {
      potNat[ sns.objEffNatNeg ].push( potPos );
      return 1;
    } 
    potNat[ sns.objEffNatMix ].push( potPos );
    return 2;
  };

  /* check_viable returns a viable potion or null
   * X = 1st ingredient
   * Y = 2nd ingredient
   */
  function check_viable( x, y )
  {
    const X = ingLst[x];
    const Xeff = X[ sns.objIngEff ];
    const Y = ingLst[y];
    const Yeff = Y[ sns.objIngEff ];

    const pos = idxPot[ sns.idxPotSiz ];

    var effect = [];
    var viable = false;

    var effPos = 0, effNeg = 0;

    // all ingredients have 4 effects
    for(var a=0; a<4; ++a )
    {
      var ai = Xeff[a][ sns.objIngEffPos ];

      for(var b=0; b<4; ++b )
      {
        if( ai != Yeff[b][ sns.objIngEffPos ] ) continue;

        viable = true;
        effect.push(ai);
      }
    }

    if( ! viable ) return null;

    var pot = [ [], [], 0 ];
    pot[ sns.objPotIng ] = (x>y) ? [ x, y ] : [ y, x ];
    pot[ sns.objPotEff ] = effect.sort( function(a,b) { return( b-a ); } );
    pot[ sns.objPotNat ] = sns.processEffects( effect, pos );

    potLst.push( pot );
    idxPot[ sns.ieSiz ] = potLst.length;

    potIng2.push( pos );
    potEff[ effect.length ].push( pos );

    ingPot[x].push( pos );
    ingPot[y].push( pos );
    return pot;
  }

  // function buildPotions(idx)
  sns.buildPotions = function()
  {
    var tmp = {};

    for( var a=0; a<ingSiz-1; a++ )
    {
      for( var b=a+1; b<ingSiz; b++ )
      {
        var AB = ingLst[a][ sns.objIngNam ] + ":" + ingLst[b][ sns.objIngNam ];
        if( AB in tmp ) continue;
        tmp[ AB ] = check_viable( a, b );
      }
    }
  };

  sns.find_small_potions = function() {
    console.log( 'find_small_potions()' );
    sns.buildPotions();
    sns.JSON_dump( 'index_small', index );
  };

}( window.sns = window.sns || {}, jQuery )); 
/* vim:set tabstop=2 shiftwidth=2 expandtab: */
