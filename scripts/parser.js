// jshint esversion: 6
(function( sns, $, undefined ) {
  "use strict";

  sns.check_sum = {};

  function parseEffInIng( idxEff, ingEff, td ){
    const TD = $(td);
    let tmpNam = "",
      aCntr = 0,
      size = [];

    TD.find("font").each(function(){
      size.push($(this).find("b").text().trim());
    });
    TD.find("a").each(function () {
      switch (aCntr++) {
        case 0: /* fallthough */
        case 1:
          if( tmpNam === "" ) tmpNam = $(this).text().trim(); 
          break; // usually initial image
        default: // absorb all the rest
          if( $(this).attr("title") === "Magnitude") ingEff[ sns.objIngEffVal ] = size.pop();
          if( $(this).attr("title") === "Value") ingEff[ sns.objIngEffMag ] = size.pop();
          break;
      }
    });

    var pos = idxEff[ sns.ieRev ][ tmpNam ];
    ingEff[ sns.objIngEffPos ] = pos;
    idxEff[ sns.ieLst ][ pos ][ sns.objEffNat ] = TD.hasClass("EffectPos") ? sns.objEffNatPos : sns.objEffNatNeg;
  }

  function parseIngTD( idxIng, idxEff, rowTop, tdCnt, rowContent, propIdx ) {
    const ingLst = idxIng[ sns.ieLst ];
    const ingRev = idxIng[ sns.ieRev ];

    var qText = $(rowContent).text().trim();
    var ingObj = ( propIdx < 0 )? null : ingLst[propIdx];

    if (rowTop) {
      switch (tdCnt) {
        case 0: break; // images two rows high 
        case 1:
          var aFlds = 0;

          $(rowContent).find("a").each(function () {
            var aText = $(this).text().trim();
            switch (aFlds++) {
              case 0:
                propIdx = ingRev[ aText ];
                ingObj = ingLst[ propIdx ];
                break;
              case 1: // origin DLC
                  if( aText == "DB" || aText == "xx" ) {
                    ingObj[ sns.objIngDLC ] = sns.objDlcDB;
                  } else if( aText == "DG" ) {
                    ingObj[ sns.objIngDLC ] = sns.objDlcDG;
                  }else if( aText == "HF" ) {
                    ingObj[ sns.objIngDLC ] = sns.objDlcHF;
                  } else { // need to double check correctness of this...
                    ingObj[ sns.objIngDLC ] = sns.objDlcBS;
                  }
                break;
              default: /* heh */
            }

          });

          if( ingObj[ sns.objIngDLC ] === undefined || ingObj[ sns.objIngDLC ] === "" ) {
            ingObj[ sns.objIngDLC ] = sns.objDlcBS;
          }
          break;

        case 2:
          ingObj[ sns.objIngLoc ] = qText;
          break;

        default: // do nothing
      }
    } else {
      switch (tdCnt) {
        case 0: /* fall through */
        case 1: /* fall through */
        case 2: /* fall through */
        case 3: 
          var ingEff = ingObj[ sns.objIngEff ];
          parseEffInIng( idxEff, ingEff, rowContent ); 
          break;
        case 4: ingObj[ sns.objIngVal ] = qText; break; // value
        case 5: ingObj[ sns.objIngWgt ] = qText; break; // weight
        case 6: ingObj[ sns.objIngMer ] = qText; break; // quantity of merchants selling this ingredient
        default: // do nothing
      }
    }
    
    return propIdx;
  }

  sns.parseIngFile = function(index, fileName) {
      return Promise.resolve( 
        $.ajax({
          url: fileName,
          dataType: 'text',
          success: function (doc) {
            var idxIng = index[ sns.idxIng ];
            var idxEff = index[ sns.idxEff ];
            var topHalf = true;
            var propsIdx = -1;

            // source: http://stackoverflow.com/questions/15150264/jquery-how-to-stop-auto-load-imges-when-parsehtml
            var new_doc = doc.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) { return "<img no_load_src=\"" + capture + "\" />"; });

            $("tr", new_doc).each(function () {
              var iterField = 0;

              $(this).find("td").each(function () {
                propsIdx = parseIngTD( idxIng, idxEff, topHalf, iterField++, this, propsIdx );
              });

              if(iterField === 0){return;} // no fields processed, must be a header row

              if (topHalf) {
                topHalf = false;
              } else {
                // fix: effects were not sorted...
                var ingEffs = idxIng[ sns.ieLst ][ propsIdx ][ sns.objIngEff ];
                ingEffs.sort( function(a,b) { return( b[ sns.objIngEffPos ] - a[ sns.objIngEffPos ] ); });
                // index.i.l[propsIdx].e = index.i.l[propsIdx].e.sort( function(a,b){ return b.x - a.x; });
                topHalf = true;
                propsIdx = -1;
              }
            });
          },
          error: function (jqXHR, textStatus, errorThrown) { 
            console.error( 'wtf' );
          }
        })
      );
    };

  sns.parser = function()
  {
    console.log( 'parser()' );
    var index = sns.getTemplateIndex();

    console.log( 'parseIngFile()' );
    sns.parseIngFile( index, "/source_data/simple_www.uesp.net_wiki_Skyrim_Ingredients.html" )
    .then( function () { 
      sns.JSON_dump( 'index_base', index ); 
    });

    sns.index = index;
    return index;
  };
}( window.sns = window.sns || {}, jQuery ));
/* vim:set tabstop=2 shiftwidth=2 expandtab: */
