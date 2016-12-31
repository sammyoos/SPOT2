(function( sns, $, undefined ) 
{
  "use strict";

  sns.iOptions = {
    "selector"  : "p.tIngs",
    "selected"  : "p.tIngs.tag-primary",
    "selClass"  : "tIngs tag-primary",
    "notClass"  : "tIngs",
    "idx"       : null,
    "list"      : "#ingredient-list",
//    "fpSelect"  : clicker,
//    "descrStr"  : createIngDescrStr
  };

  sns.eOptions = {
    "selector"  : "p.tEffs",
    "selected"  : "p.tEffs.tag-success",
    "selClass"  : "tEffs tag-success",
    "notClass"  : "tEffs",
    "idx"       : null,
    "list"      : "#effect-list",
//    "fpSelect"  : clicker,
//    "descrStr"  : createEffDescrStr
  };

  // sns.pot = sns.index.p;
  sns.ingScopeFilter  = null;
  sns.effScopeFilter  = null;
  sns.purScopeFilter  = null;
  sns.favorites       = null;
  sns.ingCount        = null;
  sns.effCount        = null;
  sns.potCount        = null;
  sns.scroll          = null;


  var ingredientNames = [
   "Abecean Longfin",
   "Ancestor Moth Wing",
   "Ash Creep Cluster",
   "Ash Hopper Jelly",
   "Ashen Grass Pod",
   "Bear Claws",
   "Bee",
   "Beehive Husk",
   "Berit's Ashes",
   "Bleeding Crown",
   "Blisterwort",
   "Blue Butterfly Wing",
   "Blue Dartwing",
   "Blue Mountain Flower",
   "Boar Tusk",
   "Bone Meal",
   "Briar Heart",
   "Burnt Spriggan Wood",
   "Butterfly Wing",
   "Canis Root",
   "Charred Skeever Hide",
   "Chaurus Eggs",
   "Chaurus Hunter Antennae",
   "Chicken's Egg",
   "Creep Cluster",
   "Crimson Nirnroot",
   "Cyrodilic Spadetail",
   "Daedra Heart",
   "Deathbell",
   "Dragon's Tongue",
   "Dwarven Oil",
   "Ectoplasm",
   "Elves Ear",
   "Emperor Parasol Moss",
   "Eye of Sabre Cat",
   "Falmer Ear",
   "Farengar's Frost Salt",
   "Felsaad Tern Feathers",
   "Fine-Cut Void Salts",
   "Fire Salts",
   "Fly Amanita",
   "Frost Mirriam",
   "Frost Salts",
   "Garlic",
   "Giant Lichen",
   "Giant's Toe",
   "Gleamblossom",
   "Glow Dust",
   "Glowing Mushroom",
   "Grass Pod",
   "Hagraven Claw",
   "Hagraven Feathers",
   "Hanging Moss",
   "Hawk Beak",
   "Hawk Feathers",
   "Hawk's Egg",
   "Histcarp",
   "Honeycomb",
   "Human Flesh",
   "Human Heart",
   "Ice Wraith Teeth",
   "Imp Stool",
   "Jarrin Root",
   "Jazbay Grapes",
   "Juniper Berries",
   "Large Antlers",
   "Lavender",
   "Luna Moth Wing",
   "Moon Sugar",
   "Mora Tapinella",
   "Mudcrab Chitin",
   "Namira's Rot",
   "Netch Jelly",
   "Nightshade",
   "Nirnroot",
   "Nordic Barnacle",
   "Orange Dartwing",
   "Pearl",
   "Pine Thrush Egg",
   "Poison Bloom",
   "Powdered Mammoth Tusk",
   "Purple Mountain Flower",
   "Red Mountain Flower",
   "River Betty",
   "Rock Warbler Egg",
   "Sabre Cat Tooth",
   "Salmon Roe",
   "Salt Pile",
   "Scaly Pholiota",
   "Scathecraw",
   "Silverside Perch",
   "Skeever Tail",
   "Slaughterfish Egg",
   "Slaughterfish Scales",
   "Small Antlers",
   "Small Pearl",
   "Snowberries",
   "Spawn Ash",
   "Spider Egg",
   "Spriggan Sap",
   "Swamp Fungal Pod",
   "Taproot",
   "Thistle Branch",
   "Torchbug Thorax",
   "Trama Root",
   "Troll Fat",
   "Tundra Cotton",
   "Vampire Dust",
   "Void Salts",
   "Wheat",
   "White Cap",
   "Wisp Wrappings",
   "Yellow Mountain Flower"
  ];

  var effectNames = [
    "Cure Disease",
    "Damage Health",
    "Damage Magicka Regen",
    "Damage Magicka",
    "Damage Stamina Regen",
    "Damage Stamina",
    "Fear",
    "Fortify Alteration",
    "Fortify Barter",
    "Fortify Block",
    "Fortify Carry Weight",
    "Fortify Conjuration",
    "Fortify Destruction",
    "Fortify Enchanting",
    "Fortify Health",
    "Fortify Heavy Armor",
    "Fortify Illusion",
    "Fortify Light Armor",
    "Fortify Lockpicking",
    "Fortify Magicka",
    "Fortify Marksman",
    "Fortify One-handed",
    "Fortify Pickpocket",
    "Fortify Restoration",
    "Fortify Smithing",
    "Fortify Sneak",
    "Fortify Stamina",
    "Fortify Two-handed",
    "Frenzy",
    "Invisibility",
    "Lingering Damage Health",
    "Lingering Damage Magicka",
    "Lingering Damage Stamina",
    "Paralysis",
    "Ravage Health",
    "Ravage Magicka",
    "Ravage Stamina",
    "Regenerate Health",
    "Regenerate Magicka",
    "Regenerate Stamina",
    "Resist Fire",
    "Resist Frost",
    "Resist Magic",
    "Resist Poison",
    "Resist Shock",
    "Restore Health",
    "Restore Magicka",
    "Restore Stamina",
    "Slow",
    "Waterbreathing",
    "Weakness to Fire",
    "Weakness to Frost",
    "Weakness to Magic",
    "Weakness to Poison",
    "Weakness to Shock",
  ];

  var fillTemplateIE = function ( counter, name, ieIdx, length ) {
    var ie = new Array ( length );
    ie[ sns.objIngNam ] = name; // position '0' for both ingredients and effects
    if( length > 4 ) { // what a hack - ingredients have more feilds...
      ie[ sns.objIngEff ] = [];
    }

    ieIdx[ sns.ieLst ][ counter ] = ie;
    ieIdx[ sns.ieRev ][ name ] = counter;
  };

  var fillLocalIEdata = function( ieObj, options, names, tmplLen ) {
    options.idx = ieObj;
    names.sort( function( a, b ){ return b.localeCompare( a ); });

    for( var i=0; i<names.length; i++ ) {
      fillTemplateIE( i, names[ i ], ieObj, tmplLen );

      ieObj[ sns.iePot ][ i ] = [];

      var display = ieObj[ sns.ieDis ];
      display[ sns.objDisPrv ][ i ] = false;
      display[ sns.objDisNxt ][ i ] = true;
      display[ sns.objDisSel ][ i ] = false;
      display[ sns.objDisjQr ][ i ] = null;
    }
  };

  sns.getTemplatePotion = function () {
    var potObj = new Array ( sns.objPotLen );
    return potObj;
  };


  sns.getTemplateIndex = function() {
    var ingLen = ingredientNames.length;
    var effLen = effectNames.length;

    var ingObj = [
        ingLen,               // number of all ingredients
        new Array(ingLen),    // list of all ingredients
        [                     // display properties
          new Array(ingLen),  // prev
          new Array(ingLen),  // next
          new Array(ingLen),  // selected
          new Array(ingLen),  // jQuery
          null
        ],
        new Array(ingLen),    // lists of potions
        [                     // lists of ingredients in DLCs
          [],                 // Base Skyrim
          [],                 // Dragonborn
          [],                 // Dawnguard
          []                  // Homestead
        ],
        {}                    // reverse lookup
      ];

    var effObj = [
        effLen,               // number of all effects
        new Array(effLen),    // list of all effects
        [                     // display properties
          new Array(effLen),  // prev
          new Array(effLen),  // next
          new Array(effLen),  // selected
          new Array(effLen),  // jQuery
          null
        ],
        new Array(effLen),    // lists of potions
        null,                 // lists of DLCs -- NOT USED
        {}                    // reverse lookup
      ];

    var potObj = [
        0,                    // number of all potions
        [],                   // list of all potions
        [                     // display properties
          new Array(sns.maxPotDis), // prev
          new Array(sns.maxPotDis), // next
          new Array(sns.maxPotDis), // selected
          new Array(sns.maxPotDis), // jQuery
          null
        ],
        [                     // lists of potions grouped by number of ingredients
          null,               // no 0 ingredient potions
          null,               // no 1 ingredient potions
          [],                 // all 2 ingredient potions
          []                  // all 3 ingredient potions
        ],
        [                     // lists of potions grouped by number of effects
          null,               // no 0 effect potions
          [],                 // all 1 effect potions
          [],                 // all 2 effect potions
          [],                 // all 3 effect potions
          [],                 // all 4 effect potions
          [],                 // all 5 effect potions
          []                  // all 6 effect potions
        ],
        [                     // lists of potions grouped by nature
        ] 
      ];

    var metObj = [
      ];

    var idxObj = [ 
        ingObj, 
        effObj, 
        potObj, 
        metObj
      ];

    fillLocalIEdata( idxObj[ sns.idxIng ], sns.iOptions, ingredientNames, sns.objIngLen );
    fillLocalIEdata( idxObj[ sns.idxEff ], sns.eOptions, effectNames, sns.objEffLen );

    return idxObj;
  };

}( window.sns = window.sns || {}, jQuery ));

// vim:set tabstop=2 shiftwidth=2 expandtab:
