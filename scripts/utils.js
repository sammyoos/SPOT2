(function( spot_ns, $, undefined ) {
  "use strict";

  if( spot_ns.DEBUG == undefined ) { spot_ns.DEBUG = false; }
	spot_ns.DEBUG = true;

	spot_ns.check_sum = spot_ns.check_sum || {};

	// used for testing...
	spot_ns.extHashCode = function( b ){ return hashCode( b ); }
	spot_ns.extHashify = function( b ){ return hashify( b ); }

	var hashCode = function( big ) {
		var hash = 0, i, chr, len;

		if( big.length === 0 ) return hash;
		for( i = 0, len = big.length; i < len; i++ ) {
			chr   = big.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};

	var hashify = function( big ) {
		var a = ( hashCode( big ) & 0xFFFFFF ).toString( 16 ).toUpperCase();
		var b = "000000" + a;
		var c = b.substr( -6 );
		return( c.substr( 0, 3 ) + "-" + c.substr( 3, 3 ) );
	};

	spot_ns.JSON_dump = function( cs_tag, myj ) {
		if( spot_ns.DEBUG ) console.info( 'JSON_dump()' );
		var space = cs_tag==='min'?null:' ';
		var myJSON = JSON.stringify( myj, null, space );
		spot_ns.check_sum[cs_tag] = hashify( myJSON );

    $("#fullJSON").text(
				"// autogenerated content -- DO NOT MODIFY\n"
			+ "(function( spot_ns, \$, undefined ) {\n\n"
			+ "spot_ns.check_sum = " + JSON.stringify( spot_ns.check_sum, null, space ) + ";\n\n"
			+ "spot_ns.index = \n"
			+  myJSON
			+ ";\n}( window.spot_ns = window.spot_ns || {}, jQuery ));\n"
		);

		if( spot_ns.DEBUG ) console.info( '<- JSON_dump' );
	}

	// function: merge
	// provide a "safe" intersection of two sorted arrays
	// http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
	spot_ns.intersect = function(a, b) {
		// this next line was my own addition
		if( !a ) { return( b ); } // case where filter has not been initialized yet
		if( !b ) { return( a ); } // case where there is no filter set for b

		var ai=0, bi=0, result = new Array();
		var aLen = a.length, bLen = b.length;

		while( ai < aLen && bi < bLen )
		{
			if      (a[ai] < b[bi] ){ ai++; }
			else if (a[ai] > b[bi] ){ bi++; }
			else { result.push(a[ai]); ai++; bi++; }
		}

		return result;
	}

	// function: join
	spot_ns.join = function(a, b)
	{
		// if( a == null || b == null ) debugger;
		const aLen = a.length, bLen = b.length;
		var ai=0, bi=0, result = new Array( aLen + bLen );
		var idx = 0;

		while( ai < aLen && bi < bLen )
		{
			const A = a[ai];
			const B = b[bi];

			if      (A < B ){ result[idx++] = A; ai++; }
			else if (A > B ){ result[idx++] = B; bi++; }
			else { result[idx++] = A; ai++; bi++; }
		}

		while( ai < aLen ) { result[idx++] = a[ai++]; }
		while( bi < bLen ) { result[idx++] = b[bi++]; }

		result.length = idx;

		return result;
	}

	spot_ns.timer = function( f ) {
		let start = performance.now();
		f();
		return( performance.now() - start );
	}

}( window.spot_ns = window.spot_ns || {}, jQuery ));

// vim:set tabstop=2 shiftwidth=2 noexpandtab:
