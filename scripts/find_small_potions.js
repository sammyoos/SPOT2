(function( spot_ns, $, undefined ) {
  "use strict";

  spot_ns.checkFavorable = function( idx, effs, iPot )
  {
    const iMetFav = idx.m.f, iPotFav = idx.p.f, iEffList = idx.e.l;
    const effMax = effs.length;
    var effPos = 0, effNeg = 0;

    for( var e=0; e<effMax; e++ ) {
      if( iEffList[ effs[ e ]].f ) {
        ++effPos;
      } else {
        ++effNeg;
      }
    }

    const effNet = effPos + effNeg;

    if( effNeg == 0 ) {
      ++iMetFav.pos[ effNet ];
      iPotFav.pos.push( iPot );
      return 0;
    }

    if( effPos == 0 ) {
      ++iMetFav.neg[ effNet ];
      iPotFav.neg.push( iPot );
      return 1;
    }
    
    ++iMetFav.mix[ effNet ];
    iPotFav.mix.push( iPot );
    return 2;
  }

  /* check_viable returns a viable potion or null
   * idx = base index
   * hash = find dups
   * X = 1st ingredient
   * Y = 2nd ingredient
   */
  function check_viable( idx, hash, x, y )
  {
    var effect = [];
    var viable = false;
    var pos = idx.p.z;
    var X = idx.i.l[x];
    var Y = idx.i.l[y];

    var effPos = 0, effNeg = 0;

    // all ingredients have 4 effects
    for(var a=0; a<4; ++a )
    {
      if( false ) {
        console.info( 'Check Viable: ' + a );
        console.log( 'x: ' + x + ', y: ' + y );
        console.log( idx );
        console.log( '   X: ' + X );
        console.log( '   X.e: ' + X.e );
        console.log( '   X.e[a]: ' + X.e[a] );
        console.log( '   X.e[a].x: ' + X.e[a].x );
      }

      var ai = X.e[a].x;

      for(var b=0; b<4; ++b )
      {
        if( ai != Y.e[b].x ) continue;

        viable = true;
        effect.push(ai);
        idx.e.p[ai].push( pos );
      }
    }

    if( ! viable ) return null;

    var pot = {
      x: pos,
      i: (x<y)
        ?[ x, y ]
        :[ y, x ],
      e: effect.sort( function(a,b) { return( a-b ); } ),
      f: spot_ns.checkFavorable( idx, effect, pos )
    };

    idx.p.l.push( pot );
    idx.p.i[2].push( pos );
    idx.p.e[effect.length].push( pos );
    idx.i.p[x].push( pos );
    idx.i.p[y].push( pos );

    idx.m.p[2][ effect.length ]++;

    idx.p.z++;
    return pot;
  }

  function potHash( idx, hash, X, Y )
  {
    var XY = X.n + ":" + Y.n;
    if( XY in hash ) return;

    hash[ XY ] = check_viable( idx, hash, X, Y );
    return;
  }


  // function buildPotions(idx)
  spot_ns.buildPotions = function(idx)
  {
    var tmp = {};
    var ing = idx.i.l;
    var len = idx.i.z;

    for( var a=0; a<len-1; a++ )
    {
      for( var b=a+1; b<len; b++ )
      {
        var AB = ing[a].n + ":" + ing[b].n;
        if( AB in tmp ) continue;
        tmp[ AB ] = check_viable( idx, tmp, a, b );
      }
    }
  };

  function foobar() { return null; }

  spot_ns.find_small_potions = function() {
    var index = spot_ns.index;
    console.log( 'find_small_potions()' );

    index.p = {};
    index.p.z = 0;
    index.p.l = [];
    index.p.i = [ null, null, [], [] ];
    index.p.e = [ null, [], [], [], [], [], [], [] ];
    index.p.f = { 'pos': [], 'neg': [], 'mix': [] };

    index.m.p = [ null, null, [], [], [], [], [], [] ];
    index.m.u = [ null, null, [], [], [], [], [], [] ];
    index.m.f = { 'pos': [], 'neg': [], 'mix': [] };

    for( var e=0; e<7; e++ ) {
      index.m.p[2][e] = 0;
      index.m.p[3][e] = 0;

      index.m.u[2][e] = 0;
      index.m.u[3][e] = 0;

      index.m.f['pos'][e] = 0;
      index.m.f['neg'][e] = 0;
      index.m.f['mix'][e] = 0;
    }
    
    console.info( 'potion building' );
    spot_ns.buildPotions(index);
    spot_ns.JSON_dump( 'index_small', index );
    // spot_ns.JSON_dump( 'index_small', index.m );
  };

}( window.spot_ns = window.spot_ns || {}, jQuery ));

// vim: set ts=2 sw=2 et:
