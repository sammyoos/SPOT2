/* 
 * jshint esversion: 6
 */
( function( spot_ns, $, undefined ) {
  "use strict";

  spot_ns.qGetScript = function( script ) {
    if( spot_ns.DEBUG ) console.info( 'qGetScript' );
    return new Promise(
      function( resolve, reject )
      {
        let path = '/scripts/' + script + '.js';
        if( spot_ns.DEBUG ) console.log( 'find_min: Loading ' + path );

        $.getScript( path )
          .done( function( contents, textStatus ) {
            if( spot_ns.DEBUG ) console.log( 'find_min: Loaded ' + script);
            if( spot_ns.DEBUG ) console.log( 'find_min: executing ' + script );
            if( spot_ns.DEBUG ) console.log( spot_ns.index );
            spot_ns[ script ]();
            // what does the index look like now...
            if( spot_ns.DEBUG ) console.log( spot_ns.index );
            if( spot_ns.DEBUG ) console.log( 'find_min: completed ' + script);
            window.setTimeout( resolve, 1000, script );
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
  if( spot_ns.DEBUG ) console.info( 'document is now ready' );
  jQuery.ajaxSetup({ cache: false });

  spot_ns.qGetScript( 'parser' )
  .then( function() { 
    return spot_ns.qGetScript( 'find_small_potions' ); 
  }).then( function() { 
    return spot_ns.qGetScript( 'find_big_potions' ); 
  }).then( function() { 
    return spot_ns.JSON_dump( 'min', spot_ns.index );
  });
});

/* vim:set tabstop=2 shiftwidth=2 expandtab: */
