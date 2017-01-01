// jshint esversion: 6
(function( sns, $, undefined ) {
  "use strict";

  const index = sns.index;

  const idxIng = index[ sns.idxIng ];
  const ingLst = idxIng[ sns.ieLst ];
  const ingSiz = idxIng[ sns.ieSiz ];
  const ingPot = idxIng[ sns.iePot ];

  const idxEff = index[ sns.idxEff ];
  const effLst = idxEff[ sns.ieLst ];
  const effPot = idxEff[ sns.iePot ];

  const idxPot = index[ sns.idxPot ];
  const potEff = idxPot[ sns.idxPotEff ];
  const potIng = idxPot[ sns.idxPotIng ];
  const potLst = idxPot[ sns.idxPotLst ];
  const potNat = idxPot[ sns.idxPotNat ];

  var processEffects = function( ingEff, potPos )
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

  sns.addPotion = function( ings, effs, pos ) {
    var pot = [
      ings, // should be presorted
      effs,
      processEffects( effs, pos )
    ];

    potLst.push( pot );
    idxPot[ sns.ieSiz ] = potLst.length;

    potIng[ ings.length ].push( pos );
    potEff[ effs.length ].push( pos );

    // var checkDLC = new Array( sns.objDlcLen );
    for( var i=0; i<ings.length; i++ ) { 
      ingPot[ings[i]].push( pos ); 
      // checkDLC[ ings[i][ sns.objIngDLC ] ].push( pos );
    }
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

    if( ! viable ) return;

    sns.addPotion( 
      (x<y) ? [ x, y ] : [ y, x ],
      effect.sort( function(a,b) { return( a-b ); } ),
      pos );

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
        tmp[ AB ] = true;
        check_viable( a, b );
      }
    }
  };

  sns.find_small_potions = function() {
    console.log( 'find_small_potions()' );
    sns.buildPotions();
    /* get rid of the reverse lookups */
    sns.index[ sns.idxIng ].pop();
    sns.index[ sns.idxEff ].pop();
    sns.JSON_dump( 'index_small', index );
  };

}( window.sns = window.sns || {}, jQuery )); 
/* vim:set tabstop=2 shiftwidth=2 expandtab: */
