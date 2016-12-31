(function( sns, $, undefined ) {
  "use strict";

  if( sns.DEBUG === undefined ) { sns.DEBUG = false; }
  sns.DEBUG = true;

  sns.check_sum = sns.check_sum || {};

  // used for testing...
  sns.extHashCode = function( b ){ return hashCode( b ); };
  sns.extHashify = function( b ){ return hashify( b ); };

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

  /*
  var text = anchor.html();
  $( "#fullJSON" ).text( text );

  */

  sns.JSON_dump = function( cs_tag, myj ) {
    if( sns.DEBUG ) console.info( 'JSON_dump()' );
    var space = cs_tag==='min'?null:' ';
    var myJSON = JSON.stringify( myj, null, space );
    sns.check_sum[cs_tag] = hashify( myJSON );

    $("#fullJSON").text(
        "// autogenerated content -- DO NOT MODIFY\n" + 
        "(function( sns, \$, undefined ) {\n" + 
        "\"use strict\";\n\n" + 
        "sns.check_sum = " + JSON.stringify( sns.check_sum, null, space ) + ";\n\n" + 
        "sns.index = \n" +  
        myJSON + 
        ";\n}( window.sns = window.sns || {}, jQuery ));\n"
    );

    var dlButton = $("#download");
    dlButton.prop( "href", "data:text/plain;charset=utf-8," + 
        encodeURIComponent( $("#fullJSON").text() ));
    dlButton.prop( "download", cs_tag + ".js" );


    if( sns.DEBUG ) console.info( '<- JSON_dump' );
  };

  // function: merge
  // provide a "safe" intersection of two sorted arrays
  // http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
  sns.intersect = function(a, b) {
    // this next line was my own addition
    if( !a ) { return( b ); } // case where filter has not been initialized yet
    if( !b ) { return( a ); } // case where there is no filter set for b

    var ai=0, bi=0, result = [];
    var aLen = a.length, bLen = b.length;

    while( ai < aLen && bi < bLen )
    {
      if      (a[ai] > b[bi] ){ ai++; }
      else if (a[ai] < b[bi] ){ bi++; }
      else { result.push(a[ai]); ai++; bi++; }
    }

    return result;
  };

  // function: join
  sns.join = function(a, b)
  {
    // if( a == null || b == null ) debugger;
    var aLen = a.length, bLen = b.length;
    var ai=0, bi=0, result = new Array( aLen + bLen );
    var idx = 0;

    while( ai < aLen && bi < bLen )
    {
      var A = a[ai];
      var B = b[bi];

      if      (A > B ){ result[idx++] = A; ai++; }
      else if (A < B ){ result[idx++] = B; bi++; }
      else { result[idx++] = A; ai++; bi++; }
    }

    while( ai < aLen ) { result[idx++] = a[ai++]; }
    while( bi < bLen ) { result[idx++] = b[bi++]; }

    result.length = idx;

    return result;
  };

  sns.timer = function( f ) {
    var start = performance.now();
    f();
    return( performance.now() - start );
  };

}( window.sns = window.sns || {}, jQuery ));

/* vim:set tabstop=2 shiftwidth=2 expandtab: */
