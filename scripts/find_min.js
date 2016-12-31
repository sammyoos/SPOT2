/* 
 * jshint esversion: 6
 */
( function( sns, $, undefined ) {
  "use strict";

  sns.qGetScript = function( script ) {
    if( sns.DEBUG ) console.info( 'qGetScript' );
    return new Promise(
      function( resolve, reject )
      {
        let path = '/scripts/' + script + '.js';
        if( sns.DEBUG ) console.log( 'find_min: Loading ' + path );

        $.getScript( path )
          .done( function( contents, textStatus ) {
            if( sns.DEBUG ) console.log( 'find_min: Loaded ' + script);
            if( sns.DEBUG ) console.log( 'find_min: executing ' + script );
            if( sns.DEBUG ) console.log( sns.index );
            sns[ script ]();
            // what does the index look like now...
            if( sns.DEBUG ) console.log( sns.index );
            if( sns.DEBUG ) console.log( 'find_min: completed ' + script);
            window.setTimeout( resolve, 1000, script );
          })
          .fail( function( jqxhr, settings, exception ) {
            if( sns.DEBUG ) {
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

}( window.sns = window.sns || {}, jQuery ));


$(document).ready(function () {
  if( sns.DEBUG ) console.info( 'document is now ready' );
  sns.JSON_dump( 'min', sns.index );
});

/* vim:set tabstop=2 shiftwidth=2 expandtab: */
