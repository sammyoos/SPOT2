(function( sns, $, undefined ) 
{
  "use strict";

  /*
   * constants, global to the app
   */
  sns.maxPotDis = 50; // maximum number of potions to display

  // DLCs
  sns.objDlcBS  = 0;    // Base Skyrim
  sns.objDlcBS  = 1;    // Dragonborn
  sns.objDlcBS  = 2;    // Dawnguard
  sns.objDlcBS  = 3;    // Homestead
  sns.objDlcLen = 4;    // length of object

  // nature of the effects
  sns.objEffNatPos = 0;  // positive effect
  sns.objEffNatNeg = 1;  // negative effect
  sns.objEffNatMix = 2;  // mixed effects
  sns.objEffNatLen = 3;  // length of object


  // ingredients object
  sns.objIngNam = 0;  // name of ingredient
  sns.objIngVal = 1;  // base value
  sns.objIngWgt = 2;  // weight
  sns.objIngLoc = 3;  // location to find
  sns.objIngDLC = 4;  // DLC containing ingredient
  sns.objIngMer = 5;  // quantity of merchants selling this ingredient
  sns.objIngEff = 6;  // effects caused by this ingredient
                      // properties that are specific to this ingredient
                      // the effects *MUST* be sorted by Pos (reverse order)
                      // Pos in idxEffLst
  sns.objIngLen = 7;  // length of object

  // ingredient specific effects
  sns.objIngEffPos = 0;  // position in the effect list -> idxEffLst
  sns.objIngEffVal = 1;  // value multiplier
  sns.objIngEffMag = 2;  // effect strength magnitude multiplier
  sns.objIngEffLen = 3;  // length of object

  // effects object
  sns.objEffNam = 0;  // name of effect
  sns.objEffNat = 1;  // nature of effect
  sns.objEffLen = 2;  // length of object

  // potions object
  sns.objPotIng = 0;  // list of ingredients contained in this potion
                      // effects *MUST* be sorted by Pos (reverse order)
                      // Pos in idxIngLst
  sns.objPotEff = 1;  // list of effects caused by this potion
                      // effects *MUST* be sorted by Pos (reverse order)
                      // Pos in idxEffLst

  // display properties object
  sns.objDisPrv = 0;  // objects that were viewable before current processing
  sns.objDisNxt = 1;  // objects that were viewable after current processing
  sns.objDisSel = 2;  // objects that are currently selected
  sns.objDisjQr = 3;  // jQuery objects 
  sns.objDisLen = 4;  // length of object

  // root level index
  sns.idxIng = 0;   // ingredients
  sns.idxEff = 1;   // effects
  sns.idxPot = 2;   // potions
  sns.idxMet = 3;   // metrics
  sns.idxLen = 4;   // length of the object

  // index level 1: ingredients/effects
  sns.ieSiz = 0;  // number of ingredients/effects
  sns.ieLst = 1;  // list of all ingredients/effects (reverse order of object name)
  sns.ieDis = 2;  // display properties of ingredients list
  sns.iePot = 3;  // lists of potions - grouped by ingredients/effects they contain
  sns.ieDLC = 4;  // lists of ingredients - grouped by DLCs that contain that ingredient
                  // NOT USED for effects - they are not specific to DLC
  sns.ieRev = 5;  // pre-created reverse lookup (hash) for ingredients
  sns.ieLen = 6;  // length of object

  // index level 1: potions
  sns.idxPotSiz = 0;  // total number of all potions
  sns.idxPotLst = 1;  // list of *ALL* potions
  sns.idxPotDis = 2;  // display properties for potions list
  sns.idxPotIng = 3;  // lists of potions - grouped by number of ingredients
  sns.idxPotEff = 4;  // lists of potions - grouped by number of effects
  sns.idxPotNat = 5;  // lists of potions - grouped by their nature
  sns.idxPotLen = 6;  // length of object

  // TODO: move to parser later...
  sns.getTemplateIndex = function() {
    var ingRev = { "Abecean Longfin": 0, "Ancestor Moth Wing": 1, "Ash Creep Cluster": 2, "Ash Hopper Jelly": 3, "Ashen Grass Pod": 4, "Bear Claws": 5, "Bee": 6, "Beehive Husk": 7, "Berit's Ashes": 8, "Bleeding Crown": 9, "Blisterwort": 10, "Blue Butterfly Wing": 11, "Blue Dartwing": 12, "Blue Mountain Flower": 13, "Boar Tusk": 14, "Bone Meal": 15, "Briar Heart": 16, "Burnt Spriggan Wood": 17, "Butterfly Wing": 18, "Canis Root": 19, "Charred Skeever Hide": 20, "Chaurus Eggs": 21, "Chaurus Hunter Antennae": 22, "Chicken's Egg": 23, "Creep Cluster": 24, "Crimson Nirnroot": 25, "Cyrodilic Spadetail": 26, "Daedra Heart": 27, "Deathbell": 28, "Dragon's Tongue": 29, "Dwarven Oil": 30, "Ectoplasm": 31, "Elves Ear": 32, "Emperor Parasol Moss": 33, "Eye of Sabre Cat": 34, "Falmer Ear": 35, "Farengar's Frost Salt": 36, "Felsaad Tern Feathers": 37, "Fine-Cut Void Salts": 38, "Fire Salts": 39, "Fly Amanita": 40, "Frost Mirriam": 41, "Frost Salts": 42, "Garlic": 43, "Giant's Toe": 44, "Giant Lichen": 45, "Gleamblossom": 46, "Glow Dust": 47, "Glowing Mushroom": 48, "Grass Pod": 49, "Hagraven Claw": 50, "Hagraven Feathers": 51, "Hanging Moss": 52, "Hawk's Egg": 53, "Hawk Beak": 54, "Hawk Feathers": 55, "Histcarp": 56, "Honeycomb": 57, "Human Flesh": 58, "Human Heart": 59, "Ice Wraith Teeth": 60, "Imp Stool": 61, "Jarrin Root": 62, "Jazbay Grapes": 63, "Juniper Berries": 64, "Large Antlers": 65, "Lavender": 66, "Luna Moth Wing": 67, "Moon Sugar": 68, "Mora Tapinella": 69, "Mudcrab Chitin": 70, "Namira's Rot": 71, "Netch Jelly": 72, "Nightshade": 73, "Nirnroot": 74, "Nordic Barnacle": 75, "Orange Dartwing": 76, "Pearl": 77, "Pine Thrush Egg": 78, "Poison Bloom": 79, "Powdered Mammoth Tusk": 80, "Purple Mountain Flower": 81, "Red Mountain Flower": 82, "River Betty": 83, "Rock Warbler Egg": 84, "Sabre Cat Tooth": 85, "Salmon Roe": 86, "Salt Pile": 87, "Scaly Pholiota": 88, "Scathecraw": 89, "Silverside Perch": 90, "Skeever Tail": 91, "Slaughterfish Egg": 92, "Slaughterfish Scales": 93, "Small Antlers": 94, "Small Pearl": 95, "Snowberries": 96, "Spawn Ash": 97, "Spider Egg": 98, "Spriggan Sap": 99, "Swamp Fungal Pod": 100, "Taproot": 101, "Thistle Branch": 102, "Torchbug Thorax": 103, "Trama Root": 104, "Troll Fat": 105, "Tundra Cotton": 106, "Vampire Dust": 107, "Void Salts": 108, "Wheat": 109, "White Cap": 110, "Wisp Wrappings": 111, "Yellow Mountain Flower": 112 };
    var ingRevLen = Object.keys(ingRev).length;

    var effRev = { "Cure Disease": 0, "Damage Health": 1, "Damage Magicka Regen": 2, "Damage Magicka": 3, "Damage Stamina Regen": 4, "Damage Stamina": 5, "Fear": 6, "Fortify Alteration": 7, "Fortify Barter": 8, "Fortify Block": 9, "Fortify Carry Weight": 10, "Fortify Conjuration": 11, "Fortify Destruction": 12, "Fortify Enchanting": 13, "Fortify Health": 14, "Fortify Heavy Armor": 15, "Fortify Illusion": 16, "Fortify Light Armor": 17, "Fortify Lockpicking": 18, "Fortify Magicka": 19, "Fortify Marksman": 20, "Fortify One-handed": 21, "Fortify Pickpocket": 22, "Fortify Restoration": 23, "Fortify Smithing": 24, "Fortify Sneak": 25, "Fortify Stamina": 26, "Fortify Two-handed": 27, "Frenzy": 28, "Invisibility": 29, "Lingering Damage Health": 30, "Lingering Damage Magicka": 31, "Lingering Damage Stamina": 32, "Paralysis": 33, "Ravage Health": 34, "Ravage Magicka": 35, "Ravage Stamina": 36, "Regenerate Health": 37, "Regenerate Magicka": 38, "Regenerate Stamina": 39, "Resist Fire": 40, "Resist Frost": 41, "Resist Magic": 42, "Resist Poison": 43, "Resist Shock": 44, "Restore Health": 45, "Restore Magicka": 46, "Restore Stamina": 47, "Slow": 48, "Waterbreathing": 49, "Weakness to Fire": 50, "Weakness to Frost": 51, "Weakness to Magic": 52, "Weakness to Poison": 53, "Weakness to Shock": 54 };
    var effRevLen = Object.keys(effRev).length;

    var ingObj = [
        ingRevLen,            // number of all ingredients
        new Array(ingRevLen), // list of all ingredients
        [                     // display properties
          new Array(ingRevLen), // prev
          new Array(ingRevLen), // next
          new Array(ingRevLen), // selected
          new Array(ingRevLen)  // jQuery
        ],
        new Array(ingRevLen), // lists of potions
        [                     // lists of ingredients in DLCs
          [],                 // Base Skyrim
          [],                 // Dragonborn
          [],                 // Dawnguard
          []                  // Homestead
        ],
        ingRev                // reverse lookup
      ];

    var effObj = [
        effRevLen,            // number of all effects
        new Array(effRevLen), // list of all effects
        [                     // display properties
          new Array(effRevLen), // prev
          new Array(effRevLen), // next
          new Array(effRevLen), // selected
          new Array(effRevLen)  // jQuery
        ],
        new Array(effRevLen), // lists of potions
        null,                 // lists of DLCs -- NOT USED
        effRev                // reverse lookup
      ];

    var potObj = [
        0,                    // number of all potions
        [],                   // list of all potions
        [                     // display properties
          new Array(sns.maxPotDis), // prev
          new Array(sns.maxPotDis), // next
          new Array(sns.maxPotDis), // selected
          new Array(sns.maxPotDis)  // jQuery
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
          [],                 // all 6 effect potions
        ],
        [                     // lists of potions grouped by nature
        ],
      ];

    var metObj = [
      ];

    var idxObj = [ 
        ingObj, 
        effObj, 
        potObj, 
        metObj
      ];

    return idxObj;
  };


  sns.getTemplateIngredient = function () {
    var ingObj = new Array ( sns.objIngLen );
    ingObj[ sns.objIngEff ] = new Array( sns.objIngEffLen );
    return ingObj;
  };

  sns.getTemplateEffect = function () {
    var effObj = new Array ( sns.objEffLen );
    return effObj;
  };

  sns.getTemplatePotion = function () {
    var potObj = new Array ( sns.objPotLen );
    return potObj;
  };

}( window.sns = window.sns || {}, jQuery ));

// vim:set tabstop=2 shiftwidth=2 expandtab:
