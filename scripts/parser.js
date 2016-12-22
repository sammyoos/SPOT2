(function( spot_ns, $, undefined ) {
  "use strict";

  spot_ns.check_sum = {};

  function getEffIdx( index, effNam, favourable ){
    const effects = index.e,
      effIdx = effects.h[ effNam ],
      eff = effects.l[  effIdx ];

    if( eff.n === "" ) {
      eff.x = effIdx;
      eff.n = effNam;
      eff.f = favourable;
    }

    return( effIdx );
  }

  function parseEffInIng(idx,td,ing){
    const eff = { x: -1, v: 1, m: 1 };
    let tmpNam = "",
      aCntr = 0,
      size = [],
      TD = $(td);

    TD.find("font").each(function(){size.push($(this).find("b").text().trim());});
    TD.find("a").each(function () {
      switch (aCntr++) {
        case 0: /* fallthough */
        case 1:
          if( tmpNam.length == "" ) tmpNam = $(this).text().trim(); 
          break; // usually initial image
        default: // absorb all the rest
          if( $(this).attr("title") === "Magnitude") { eff.m = size.pop(); }
          if( $(this).attr("title") === "Value") { eff.v = size.pop(); }
          break;
      }
    });

    eff.x = getEffIdx( idx, tmpNam, TD.hasClass("EffectPos") );
    return( eff );
  }

  function parseIngTD( index, rowTop, tdCnt, rowContent, propIdx ) {
    var qText = $(rowContent).text().trim();
    var props = ( propIdx < 0 )? null : index.i.l[propIdx];

    if (rowTop) {
      switch (tdCnt) {
        case 0: break; // images two rows high 
        case 1:
          var aFlds = 0;

          $(rowContent).find("a").each(function () {
            var aText = $(this).text().trim();
            switch (aFlds++) {
              case 0:
                propIdx = index.i.h[ aText ];
                props = index.i.l[ propIdx ];
                // if( props == null ) debugger;
                props.n = aText;
                props.e = [];
                break;
              case 1: // origin DLC
                  if(aText=="xx"){  
                    props.o = "DB";
                  } else {
                    props.o = aText;
                  }
                break;
              default: /* heh */
            }

          });
          // could also extract ID from here
          if( !( 'o' in props ) || ( props.o === undefined ) || props.o === "" ) props.o = "BS";
          index.m.o[ props.o ]++;
          break;

        case 2:
          // if( props == null ) debugger;
          props.r = qText; // in what region is this found
          break;

        default: // do nothing
      }
    } else {
      switch (tdCnt) {
        case 0: /* fall through */
        case 1: /* fall through */
        case 2: /* fall through */
        case 3: props.e.push( parseEffInIng( index, rowContent, props.idx )); break;
        case 4: props.v = qText; break; // value
        case 5: props.w = qText; break; // weight
        case 6: props.q = qText; break; // quantity of merchants selling this ingredient
        default: // do nothing
      }
    }
    
    return propIdx;
  }

  spot_ns.parseIngFile_old = function(index, fn) {
    return (
        $.ajax({
          url: fn,
          dataType: 'text',
          success: function (doc) {

            // source: http://stackoverflow.com/questions/15150264/jquery-how-to-stop-auto-load-imges-when-parsehtml
            var new_doc = doc.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) { return "<img no_load_src=\"" + capture + "\" />"; });
            var topHalf = true;
            var propsIdx = -1;
            //var skipper = 0;

            $("tr", new_doc).each(function () {
              var iterField = 0;

              $(this).find("td").each(function () {
                //if (skipper++ > 200)return; // TODO: remove this line
                propsIdx = parseIngTD(index,topHalf, iterField++, this, propsIdx );
              });

              if(iterField === 0){return;} // no fields processed, must be a header row

              if (topHalf) {
                topHalf = false;
              } else {
                // props.idx = index.ing.num[props.nam];
                // index.ing.lab[props.idx] = props;
                topHalf = true;
                propsIdx = -1;
              }
            });
          },
          error: function (jqXHR, textStatus, errorThrown) { alert(textStatus); }
        })
    );
  }

  spot_ns.parseIngFile = function(index, fn) {
      return Promise.resolve( 
        $.ajax({
          url: fn,
          dataType: 'text',
          success: function (doc) {

            // source: http://stackoverflow.com/questions/15150264/jquery-how-to-stop-auto-load-imges-when-parsehtml
            var new_doc = doc.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) { return "<img no_load_src=\"" + capture + "\" />"; });
            var topHalf = true;
            var propsIdx = -1;
            //var skipper = 0;

            $("tr", new_doc).each(function () {
              var iterField = 0;

              $(this).find("td").each(function () {
                //if (skipper++ > 200)return; // TODO: remove this line
                propsIdx = parseIngTD(index,topHalf, iterField++, this, propsIdx );
              });

              if(iterField === 0){return;} // no fields processed, must be a header row

              if (topHalf) {
                topHalf = false;
              } else {
                // props.idx = index.ing.num[props.nam];
                // index.ing.lab[props.idx] = props;
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

  spot_ns.setIngEffIdx = function( idx, template, hash ) {
    idx.h = hash;
    var z = Object.keys( idx.h ).length;
    idx.z = z;

    idx.a = new Array( z );
    idx.b = new Array( z );
    idx.d = new Array( z );
    idx.l = new Array( z );
    idx.p = new Array( z );
    idx.s = new Array( z );

    for( var i=0; i<z; i++ ) {
      var elem = {}; // clone the template
      for( var p in template ) {
        if( template.hasOwnProperty( p ) ) {
          elem[p] = template[p];
        }
      }

      idx.a[i] = true; // everything needs to be visible after the first redraw
      idx.b[i] = false; // nothing is visible before the first redraw
      idx.d[i] = null; // *cannot* cache the jQuery display objects before they are generated client side
      idx.l[i] = elem; // 
      idx.p[i] = [];
      idx.s[i] = false;
    }

    return idx;
  }

  spot_ns.parser = function()
  {
    var index = {};
    console.log( 'parser()' );

    index.i = {};
    spot_ns.setIngEffIdx( index.i, 
      { n:"", v: -1, w: -1, r: "", o: "", q: "", e: null },
      { "Abecean Longfin": 0, "Ancestor Moth Wing": 1, "Ash Creep Cluster": 2, "Ash Hopper Jelly": 3, "Ashen Grass Pod": 4, "Bear Claws": 5, "Bee": 6, "Beehive Husk": 7, "Berit's Ashes": 8, "Bleeding Crown": 9, "Blisterwort": 10, "Blue Butterfly Wing": 11, "Blue Dartwing": 12, "Blue Mountain Flower": 13, "Boar Tusk": 14, "Bone Meal": 15, "Briar Heart": 16, "Burnt Spriggan Wood": 17, "Butterfly Wing": 18, "Canis Root": 19, "Charred Skeever Hide": 20, "Chaurus Eggs": 21, "Chaurus Hunter Antennae": 22, "Chicken's Egg": 23, "Creep Cluster": 24, "Crimson Nirnroot": 25, "Cyrodilic Spadetail": 26, "Daedra Heart": 27, "Deathbell": 28, "Dragon's Tongue": 29, "Dwarven Oil": 30, "Ectoplasm": 31, "Elves Ear": 32, "Emperor Parasol Moss": 33, "Eye of Sabre Cat": 34, "Falmer Ear": 35, "Farengar's Frost Salt": 36, "Felsaad Tern Feathers": 37, "Fine-Cut Void Salts": 38, "Fire Salts": 39, "Fly Amanita": 40, "Frost Mirriam": 41, "Frost Salts": 42, "Garlic": 43, "Giant's Toe": 44, "Giant Lichen": 45, "Gleamblossom": 46, "Glow Dust": 47, "Glowing Mushroom": 48, "Grass Pod": 49, "Hagraven Claw": 50, "Hagraven Feathers": 51, "Hanging Moss": 52, "Hawk's Egg": 53, "Hawk Beak": 54, "Hawk Feathers": 55, "Histcarp": 56, "Honeycomb": 57, "Human Flesh": 58, "Human Heart": 59, "Ice Wraith Teeth": 60, "Imp Stool": 61, "Jarrin Root": 62, "Jazbay Grapes": 63, "Juniper Berries": 64, "Large Antlers": 65, "Lavender": 66, "Luna Moth Wing": 67, "Moon Sugar": 68, "Mora Tapinella": 69, "Mudcrab Chitin": 70, "Namira's Rot": 71, "Netch Jelly": 72, "Nightshade": 73, "Nirnroot": 74, "Nordic Barnacle": 75, "Orange Dartwing": 76, "Pearl": 77, "Pine Thrush Egg": 78, "Poison Bloom": 79, "Powdered Mammoth Tusk": 80, "Purple Mountain Flower": 81, "Red Mountain Flower": 82, "River Betty": 83, "Rock Warbler Egg": 84, "Sabre Cat Tooth": 85, "Salmon Roe": 86, "Salt Pile": 87, "Scaly Pholiota": 88, "Scathecraw": 89, "Silverside Perch": 90, "Skeever Tail": 91, "Slaughterfish Egg": 92, "Slaughterfish Scales": 93, "Small Antlers": 94, "Small Pearl": 95, "Snowberries": 96, "Spawn Ash": 97, "Spider Egg": 98, "Spriggan Sap": 99, "Swamp Fungal Pod": 100, "Taproot": 101, "Thistle Branch": 102, "Torchbug Thorax": 103, "Trama Root": 104, "Troll Fat": 105, "Tundra Cotton": 106, "Vampire Dust": 107, "Void Salts": 108, "Wheat": 109, "White Cap": 110, "Wisp Wrappings": 111, "Yellow Mountain Flower": 112 } 
    );

    index.e = {};
    spot_ns.setIngEffIdx( index.e, 
      { n: "", f: false },
      { "Cure Disease": 0, "Damage Health": 1, "Damage Magicka Regen": 2, "Damage Magicka": 3, "Damage Stamina Regen": 4, "Damage Stamina": 5, "Fear": 6, "Fortify Alteration": 7, "Fortify Barter": 8, "Fortify Block": 9, "Fortify Carry Weight": 10, "Fortify Conjuration": 11, "Fortify Destruction": 12, "Fortify Enchanting": 13, "Fortify Health": 14, "Fortify Heavy Armor": 15, "Fortify Illusion": 16, "Fortify Light Armor": 17, "Fortify Lockpicking": 18, "Fortify Magicka": 19, "Fortify Marksman": 20, "Fortify One-handed": 21, "Fortify Pickpocket": 22, "Fortify Restoration": 23, "Fortify Smithing": 24, "Fortify Sneak": 25, "Fortify Stamina": 26, "Fortify Two-handed": 27, "Frenzy": 28, "Invisibility": 29, "Lingering Damage Health": 30, "Lingering Damage Magicka": 31, "Lingering Damage Stamina": 32, "Paralysis": 33, "Ravage Health": 34, "Ravage Magicka": 35, "Ravage Stamina": 36, "Regenerate Health": 37, "Regenerate Magicka": 38, "Regenerate Stamina": 39, "Resist Fire": 40, "Resist Frost": 41, "Resist Magic": 42, "Resist Poison": 43, "Resist Shock": 44, "Restore Health": 45, "Restore Magicka": 46, "Restore Stamina": 47, "Slow": 48, "Waterbreathing": 49, "Weakness to Fire": 50, "Weakness to Frost": 51, "Weakness to Magic": 52, "Weakness to Poison": 53, "Weakness to Shock": 54 } 
    );

    index.m = {};
    index.m.o = { 'BS': 0, 'DB': 0, 'DG': 0, 'HF': 0 };

    // fullJSON.text( JSON.stringify( index ));
    // source: http://stackoverflow.com/questions/3709597/wait-until-all-jquery-ajax-requests-are-done
    console.log( 'parseIngFile()' );
    spot_ns.parseIngFile( index, "source_data/simple_www.uesp.net_wiki_Skyrim_Ingredients.html" )
    .then( function () { spot_ns.JSON_dump( 'index_base', index ); });

    spot_ns.index = index;
    return index;
  }
}( window.spot_ns = window.spot_ns || {}, jQuery ));
// vim: set ts=2 sw=2 et:
