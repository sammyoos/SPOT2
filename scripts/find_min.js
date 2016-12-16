// window.onload = function () {
//   spot_ns.JSON_dump( '', spot_ns.index );
// }
//
( function( spot_ns, $, undefined ) {
  "use strict";

  spot_ns.qGetScript = function( scripts ) 
  {
    let script = scripts.shift();
    let path = '/scripts/' + script + '.js';
    console.log( 'find_min: Loading ' + path );

    $.getScript( path )
      .done( function( script, textStatus ) {
        console.log( 'find_min: Loaded' );

        if( scripts.length === 0 ) { 
          // spot_ns.JSON_dump( '', spot_ns.index );
        } else {
          qGetScripts( scripts );
        }
      })
      .fail( function( jqxhr, settings, exception ) {
        console.error( 'find_min: Failed' );
        console.log( jqxhr.status );
        console.log( jqxhr );
        console.log( settings );
        console.log( exception );
      });
  }

}( window.spot_ns = window.spot_ns || {}, jQuery ));


$(document).ready(function () {
  jQuery.ajaxSetup({ cache: false });

  spot_ns.qGetScript( [ 'parser' ] );
  spot_ns.parser();
  console.log( spot_ns.index );
  spot_ns.JSON_dump( '', spot_ns.index );
});

// vim: set ts=2 sw=2 et:
