(function () {
  "use strict";

  function check_viable( idx, hash, X, Y )
  {
    var effect = [];
    var viable = false;
    var pos = idx.pot.num;

    for(var a=0; a<4; ++a )
    {
      var ai = X.eff[a].idx;

      for(var b=0; b<4; ++b )
      {
        if( ai == Y.eff[b].idx )
        {
          viable = true;
          effect.push(ai);
          idx.eff.pot[ai].push( pos );
        }
      }
    }

    if( ! viable ) return null;

    idx.pot.num++;
    var pot = {
      n: pos,
      ing: (X.idx<Y.idx)
        ?[ X.idx, Y.idx ]
        :[ Y.idx, X.idx ],
      eff: effect.sort( function(a,b) { return( a-b ); } )
    };

    idx.pot.lab.push( pot );
    idx.pot.ni[2].push( pos );
    idx.pot.ne[effect.length].push( pos );
    idx.ing.pot[X.idx].push( pos );
    idx.ing.pot[Y.idx].push( pos );

    return pot;
  }

  function potHash( idx, hash, X, Y )
  {
    var XY = X.nam + ":" + Y.nam
    if( XY in hash ) return;

    hash[ XY ] = check_viable( idx, hash, X, Y );
    return;
  }


  function buildPotions(idx)
  {
    var tmp = {};
    var A, B, C;
    var len = idx.ing.lab.length;

    for( var a=0; a<len-2; a++ )
    {
      A = idx.ing.lab[a];
      for( var b=a+1; b<len-1; b++ )
      {
        B = idx.ing.lab[b];
        potHash( idx, tmp, A, B );

        for( var c=b+1; c<len; c++ )
        {
          C = idx.ing.lab[c];
          potHash( idx, tmp, A, C );
          potHash( idx, tmp, B, C );
        }
      }
    }
  }

  function newBaseEffect(index,name){
    var e = {};
    e.idx = index;
    e.nam = name;
    e.ing = [];
    
    return(e);
  }
  
  function getEffIdx(idx,effNam,ingIdx){
    var effIdx=idx.eff.num[effNam];
    if( idx.eff.lab[ effIdx ] == undefined || idx.eff.lab[ effIdx ] == null ) {
      idx.eff.lab[effIdx] = newBaseEffect(effIdx,effNam);
    }

    idx.eff.lab[effIdx].ing.push(ingIdx);
    return(effIdx);
  }

  function parseEffInIng(idx,td,ing){
    var eff = {};
    eff.idx = -1;
    eff.nam = "";
    eff.val = 1;
    eff.mag = 1;

    eff.lix = $(td).hasClass("EffectPos");
    var tmpNam = "";
    var aCntr = 0;
    var size = [];
    $(td).find("font").each(function(){size.push($(this).find("b").text().trim());});
    $(td).find("a").each(function () {
      switch (aCntr++) {
        case 0: tmpNam = $(this).text().trim(); break; // usually initial image
        case 1: eff.nam = $(this).text().trim(); break;
        default: // absorb all the rest
          if ($(this).attr("title") === "Magnitude") { eff.mag = size.pop(); }
          if ($(this).attr("title") === "Value") { eff.val = size.pop(); }
          break;
      }
    });

    if(eff.nam===""){eff.nam=tmpNam;}
    eff.idx = getEffIdx(idx,eff.nam,ing);

    return (eff);
  }

  function parseIngTD(idx,rowTop, tdCnt, rowContent, props) {
    var qText = $(rowContent).text().trim();

    if (rowTop) {
      switch (tdCnt) {
        case 0: break; // images two rows high 
        case 1:
          var aFlds = 0;

          $(rowContent).find("a").each(function () {
            var aText = $(this).text().trim();
            switch (aFlds++) {
              case 0:
                props.nam = aText;
                break;
              case 1:
                  if(aText=="xx"){
                    props.dlc = "DB";
                  } else {
                    props.dlc = aText;
                  }
                break;
              default: /* heh */
            }

          });
          // could also extract ID from here
          break;

        case 2:
          props.src = qText;
          break;

        default: // do nothing
      }
    } else {
      switch (tdCnt) {
        case 0: /* fall through */
        case 1: /* fall through */
        case 2: /* fall through */
        case 3: props.eff.push(parseEffInIng(idx,rowContent,props.idx)); break;
        case 4: props.val = qText; break;
        case 5: props.wgt = qText; break;
        case 6: props.plt = qText; break;
        default: // do nothing
      }
    }
  }

  function newBaseIng(idx) {
    var p = {};
    p.idx = idx;
    p.nam = "";
    p.val = -1;
    p.wgt = -1;
    p.plt = -1;
    p.dlc = "none";
    p.eff = [];

    return (p);
  }

  function incMetric(metric,a,b,c){
    if(!metric.hasOwnProperty(a)){metric[a]={};}
    if(!metric[a].hasOwnProperty(b)){metric[a][b]={};}
    if(!metric[a][b].hasOwnProperty(c)){
      metric[a][b][c]=1;
    }else{
      ++metric[a][b][c];
    }
  }

  function parseIngFile(idx, fn) {
    return (
        $.ajax({
          url: fn,
          dataType: 'text',
          success: function (doc) {

            // source: http://stackoverflow.com/questions/15150264/jquery-how-to-stop-auto-load-imges-when-parsehtml
            var new_doc = doc.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) { return "<img no_load_src=\"" + capture + "\" />"; });
            var topHalf = true;
            var ingIdx = 0;
            var props = newBaseIng(ingIdx,0);
            //var skipper = 0;

            $("tr", new_doc).each(function () {
              var iterField = 0;

              $(this).find("td").each(function () {
                //if (skipper++ > 200)return; // TODO: remove this line
                parseIngTD(idx,topHalf, iterField++, this, props);
              });

              if(iterField === 0){return;} // no fields processed, must be a header row

              if (topHalf) {
                topHalf = false;
              } else {
                props.idx = idx.ing.num[props.nam];
                idx.ing.lab[props.idx] = props;
                incMetric(idx.metrics, "ing", "dlc", props.dlc );
                incMetric(idx.metrics, "ing", "plt", props.plt );
                props = newBaseIng(++ingIdx);
                topHalf = true;
              }
            });
          },
          error: function (jqXHR, textStatus, errorThrown) { alert(textStatus); }
        })
    );
  }

  function indexData( idx )
  {
    var len = idx.lab.length;

    idx.prevDisplay = new Array( len );
    idx.nextDisplay = new Array( len );
    idx.selected = new Array( len );
    idx.display = new Array( len );

    for( var i=0; i<len; i++ )
    {
      idx.prevDisplay[i]=false;
      idx.nextDisplay[i]=true;
      idx.selected[i]=false;
      idx.display[i]=null;
    }
  }


  $(document).ready(function () {
    var idx = {};

    idx.ing = {};
    idx.ing.num = { "Abecean Longfin": 0, "Ancestor Moth Wing": 1, "Ash Creep Cluster": 2, "Ash Hopper Jelly": 3, "Ashen Grass Pod": 4, "Bear Claws": 5, "Bee": 6, "Beehive Husk": 7, "Berit's Ashes": 8, "Bleeding Crown": 9, "Blisterwort": 10, "Blue Butterfly Wing": 11, "Blue Dartwing": 12, "Blue Mountain Flower": 13, "Boar Tusk": 14, "Bone Meal": 15, "Briar Heart": 16, "Burnt Spriggan Wood": 17, "Butterfly Wing": 18, "Canis Root": 19, "Charred Skeever Hide": 20, "Chaurus Eggs": 21, "Chaurus Hunter Antennae": 22, "Chicken's Egg": 23, "Creep Cluster": 24, "Crimson Nirnroot": 25, "Cyrodilic Spadetail": 26, "Daedra Heart": 27, "Deathbell": 28, "Dragon's Tongue": 29, "Dwarven Oil": 30, "Ectoplasm": 31, "Elves Ear": 32, "Emperor Parasol Moss": 33, "Eye of Sabre Cat": 34, "Falmer Ear": 35, "Farengar's Frost Salt": 36, "Felsaad Tern Feathers": 37, "Fine-Cut Void Salts": 38, "Fire Salts": 39, "Fly Amanita": 40, "Frost Mirriam": 41, "Frost Salts": 42, "Garlic": 43, "Giant's Toe": 44, "Giant Lichen": 45, "Gleamblossom": 46, "Glow Dust": 47, "Glowing Mushroom": 48, "Grass Pod": 49, "Hagraven Claw": 50, "Hagraven Feathers": 51, "Hanging Moss": 52, "Hawk's Egg": 53, "Hawk Beak": 54, "Hawk Feathers": 55, "Histcarp": 56, "Honeycomb": 57, "Human Flesh": 58, "Human Heart": 59, "Ice Wraith Teeth": 60, "Imp Stool": 61, "Jarrin Root": 62, "Jazbay Grapes": 63, "Juniper Berries": 64, "Large Antlers": 65, "Lavender": 66, "Luna Moth Wing": 67, "Moon Sugar": 68, "Mora Tapinella": 69, "Mudcrab Chitin": 70, "Namira's Rot": 71, "Netch Jelly": 72, "Nightshade": 73, "Nirnroot": 74, "Nordic Barnacle": 75, "Orange Dartwing": 76, "Pearl": 77, "Pine Thrush Egg": 78, "Poison Bloom": 79, "Powdered Mammoth Tusk": 80, "Purple Mountain Flower": 81, "Red Mountain Flower": 82, "River Betty": 83, "Rock Warbler Egg": 84, "Sabre Cat Tooth": 85, "Salmon Roe": 86, "Salt Pile": 87, "Scaly Pholiota": 88, "Scathecraw": 89, "Silverside Perch": 90, "Skeever Tail": 91, "Slaughterfish Egg": 92, "Slaughterfish Scales": 93, "Small Antlers": 94, "Small Pearl": 95, "Snowberries": 96, "Spawn Ash": 97, "Spider Egg": 98, "Spriggan Sap": 99, "Swamp Fungal Pod": 100, "Taproot": 101, "Thistle Branch": 102, "Torchbug Thorax": 103, "Trama Root": 104, "Troll Fat": 105, "Tundra Cotton": 106, "Vampire Dust": 107, "Void Salts": 108, "Wheat": 109, "White Cap": 110, "Wisp Wrappings": 111, "Yellow Mountain Flower": 112 };
    idx.ing.siz = Object.keys( idx.ing.num ).length;
    idx.ing.lab = new Array( idx.ing.siz );
    idx.ing.pot = new Array( idx.ing.siz );
    for( var i=0; i<idx.ing.siz; i++ ) idx.ing.pot[i] = [];

    idx.eff = {};
    idx.eff.num = { "Cure Disease": 0, "Damage Health": 1, "Damage Magicka Regen": 2, "Damage Magicka": 3, "Damage Stamina Regen": 4, "Damage Stamina": 5, "Fear": 6, "Fortify Alteration": 7, "Fortify Barter": 8, "Fortify Block": 9, "Fortify Carry Weight": 10, "Fortify Conjuration": 11, "Fortify Destruction": 12, "Fortify Enchanting": 13, "Fortify Health": 14, "Fortify Heavy Armor": 15, "Fortify Illusion": 16, "Fortify Light Armor": 17, "Fortify Lockpicking": 18, "Fortify Magicka": 19, "Fortify Marksman": 20, "Fortify One-handed": 21, "Fortify Pickpocket": 22, "Fortify Restoration": 23, "Fortify Smithing": 24, "Fortify Sneak": 25, "Fortify Stamina": 26, "Fortify Two-handed": 27, "Frenzy": 28, "Invisibility": 29, "Lingering Damage Health": 30, "Lingering Damage Magicka": 31, "Lingering Damage Stamina": 32, "Paralysis": 33, "Ravage Health": 34, "Ravage Magicka": 35, "Ravage Stamina": 36, "Regenerate Health": 37, "Regenerate Magicka": 38, "Regenerate Stamina": 39, "Resist Fire": 40, "Resist Frost": 41, "Resist Magic": 42, "Resist Poison": 43, "Resist Shock": 44, "Restore Health": 45, "Restore Magicka": 46, "Restore Stamina": 47, "Slow": 48, "Waterbreathing": 49, "Weakness to Fire": 50, "Weakness to Frost": 51, "Weakness to Magic": 52, "Weakness to Poison": 53, "Weakness to Shock": 54 };
    idx.eff.siz = Object.keys( idx.eff.num ).length;
    idx.eff.lab = new Array( idx.eff.siz );
    idx.eff.pot = new Array( idx.eff.siz );
    for( var i=0; i<idx.eff.siz; i++ ) idx.eff.pot[i] = [];

    idx.pot = {};
    idx.pot.num = 0;
    idx.pot.lab = [];
    idx.pot.ni = [ null, null, [], [] ];
    idx.pot.ne = [ null, [], [], [], [], [], [] ];

    idx.metrics = {};

    // fullJSON.text( JSON.stringify( idx ));
    // source: http://stackoverflow.com/questions/3709597/wait-until-all-jquery-ajax-requests-are-done
    $.when(
        parseIngFile(idx, "source_data/simple_www.uesp.net_wiki_Skyrim_Ingredients.html")
    ).done(function (p1) {
      console.info( 'parsing complete' );
      indexData( idx.ing );
      console.info( 'index of ings' );
      indexData( idx.eff );
      console.info( 'index of effs' );
      buildPotions(idx);
      console.info( 'potion building' );
      $("#fullJSON").text("/* autogenerated content -- DO NOT MODIFY\n" +
          " * to change this data you must:\n" +
          " * 1. edit scripts/parser.js\n" +
          " * 2. load parser.html\n" +
          " * 3. paste the content into scripts/index.js\n" +
          " */\n\n" +
          "function getIdx() { return(" +
          JSON.stringify(idx, null, ' ') +
          "\n);}");
    });
  });
}());
// vim: set ts=2 sw=2 et:
