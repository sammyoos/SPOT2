// window.onload = function () {
//   spot_ns.JSON_dump( '', spot_ns.index );
// }
//
( function( spot_ns, $, undefined ) {
  "use strict";

  spot_ns.qGetScript = function( script ) {
    console.info( 'qGetScript' );
    return new Promise(
      function( resolve, reject )
      {
        let path = '/scripts/' + script + '.js';
        console.log( 'find_min: Loading ' + path );

        $.getScript( path )
          .done( function( contents, textStatus ) {
            console.log( 'find_min: Loaded' );
            resolve();
            spot_ns[ script ]();
          })
          .fail( function( jqxhr, settings, exception ) {
            if( spot_ns.DEBUG ) {
              console.error( 'find_min: Failed' );
              console.error( jqxhr.status );
              console.error( jqxhr );
              console.error( settings );
              console.error( exception );
            }
            reject( exception );
          });
      });
  };

}( window.spot_ns = window.spot_ns || {}, jQuery ));


$(document).ready(function () {
  console.info( 'document is now ready' );
  jQuery.ajaxSetup({ cache: false });

  // spot_ns.qGetScript( [ 'parser' ] );
  spot_ns.qGetScript( 'parser' ).then(
    ( response ) => { // success
      console.log( 'win' );
      console.info( response );

      // spot_ns.parser();
      console.log( spot_ns.index );
      spot_ns.JSON_dump( '', spot_ns.index );
    },
    ( reason ) => { // failure
      console.log( 'fail' );
      console.error( reason );
    }
  );
  
});

// vim: set ts=2 sw=2 et:
