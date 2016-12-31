// jshint esversion: 6
(function( sns, $, undefined ) {
  "use strict";

  sns.processEffects = function( index, ingEff, potPos )
  {
    const idxEff = index[ sns.idxEff ];
    const effLst = idxEff[ sns.ieLst ];
    const effPot = idxEff[ sns.iePot ];

    const idxPot = index[ sns.idxPot ];
    const potNat = idxPot[ sns.objPotNat ];

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
    }

    if( effPos === 0 ) {
      potNat[ sns.objEffNatNeg ].push( potPos );
      return 1;
    }
    
    potNat[ sns.objEffNatMix ].push( potPos );
    return 2;
  };

  /* check_viable returns a viable potion or null
   * idx = base index
   * X = 1st ingredient
   * Y = 2nd ingredient
   */
  function check_viable( index, x, y )
  {
    const idxIng = index[ sns.idxIng ];
    const ingSiz = idxIng[ sns.ieSiz ];
    const ingLst = idxIng[ sns.ieLst ];
    const X = ingLst[x];
    const Xeff = X[ sns.objIngEff ];
    const Y = ingLst[y];
    const Yeff = Y[ sns.objIngEff ];

    const idxIngPot = idxIng[ sns.iePot ];
    const idxPot = index[ sns.idxPot ];
    const idxPotLst = idxPot[ sns.idxPotLst ];
    const idxPotIng = idxPot[ sns.idxPotIng ];
    const idxPotEff = idxPot[ sns.idxPotEff ];
    const pos = idxPot[ sns.idxPotSiz ];

    var effect = [];
    var viable = false;

    var effPos = 0, effNeg = 0;

    // all ingredients have 4 effects
    for(var a=0; a<4; ++a )
    {
      if( false ) {
        console.info( 'Check Viable: ' + a );
        console.log( 'x: ' + x + ', y: ' + y );
        console.log( index );
        console.log( '   X: ' + X );
        console.log( '   X.e: ' + Xeff );
        console.log( '   X.e[a]: ' + Xeff[a] );
        console.log( '   X.e[a].x: ' + Xeff[a][ sns.objIngEffPos ] );
        // debugger;
      }

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
    pot[ sns.objPotNat ] = sns.processEffects( index, effect, pos );

    idxPotLst.push( pot );
    idxPotIng[2].push( pos );
    idxPotEff[ effect.length ].push( pos );

    console.log( x );
    console.log( y );
    console.log( idxIngPot );

    idxIngPot[x].push( pos );
    idxIngPot[y].push( pos );
    idxIng[ sns.ieSiz ]++;
    return pot;
  }

  // function buildPotions(idx)
  sns.buildPotions = function( index )
  {
    const idxIng = index[ sns.idxIng ];
    const ingLst = idxIng[ sns.ieLst ];
    const ingSiz = idxIng[ sns.ieSiz ];
    var tmp = {};

    for( var a=0; a<ingSiz-1; a++ )
    {
      for( var b=a+1; b<ingSiz; b++ )
      {
        var AB = ingLst[a][ sns.objIngNam ] + ":" + ingLst[b][ sns.objIngNam ];
        if( AB in tmp ) continue;
        tmp[ AB ] = check_viable( index, a, b );
      }
    }
  };

  sns.find_small_potions = function() {
    var index = sns.index;
    console.log( 'find_small_potions()' );
    sns.buildPotions(index);
    sns.JSON_dump( 'index_small', index );
  };

}( window.sns = window.sns || {}, jQuery ));

/* vim:set tabstop=2 shiftwidth=2 expandtab: */
