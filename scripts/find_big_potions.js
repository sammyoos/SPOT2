(function () {
"use strict";
  
// function: merge
// provide a "safe" intersection of two sorted arrays
// http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
function merge(a, b)
{
  if( a == null || b == null ) debugger;

	var ai=0, bi=0, result = new Array( a.length + b.length );
  var idx = 0;

	while( ai < a.length && bi < b.length )
	{
		if      (a[ai] < b[bi] ){ result[idx++] = a[ai++]; }
		else if (a[ai] > b[bi] ){ result[idx++] = b[bi++]; }
		else { result[idx++] = a[ai++]; bi++; }
	}

  while( ai < a.length ) { result[idx++] = a[ai++]; }
  while( bi < b.length ) { result[idx++] = b[bi++]; }

  result.length = idx;

	return result;
}

spot_ns.buildBigPotions = function(idx)
{
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
      var ings = merge( A.i, B.i );
      var key = ings.join(':');
      if( key in seen ) continue;
      seen[key] = true; // from now on this key has been seen

      // if no new effects are generated, this new potion is viable but useless...
      var mustHit = Math.max(A.e.length,B.e.length);
      var effs = merge( A.e, B.e );
      var effLen = effs.length;
      if( effLen <= mustHit ) continue;

      var pot = {
        x: idx.p.z++,
        i: merge( A.i, B.i ),
        e: effs
      };

      pList.push( pot );
      idx.p.i[ 3        ].push( pot.x );
      idx.p.e[ effLen   ].push( pot.x );
      idx.i.p[ pot.i[0] ].push( pot.x );
      idx.i.p[ pot.i[1] ].push( pot.x );
      idx.i.p[ pot.i[2] ].push( pot.x );
      for( var i=0; i<effLen; i++ ) idx.e.p[ pot.e[i] ].push( pot.x );
      if( idx.p.z%100 == 0 ) console.info( "[" + idx.p.z + "] Adding... " + key );
    }
  }
}
}());

window.onload = function () {
  debugger; 
  var idx = spot_ns.index;
  spot_ns.buildBigPotions(idx);
  spot_ns.JSON_dump( 'index_big', idx );
}
// vim: set ts=2 sw=2 et:
