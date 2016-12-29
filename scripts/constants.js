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
    var ctr = 0;
    var ingRev = {}; // if you edit this you *MUST* update the corresponding tests
    ingRev[ "Abecean Longfin" ] = ctr++;
    ingRev[ "Ancestor Moth Wing" ] = ctr++;
    ingRev[ "Ash Creep Cluster" ] = ctr++;
    ingRev[ "Ash Hopper Jelly" ] = ctr++;
    ingRev[ "Ashen Grass Pod" ] = ctr++;
    ingRev[ "Bear Claws" ] = ctr++;
    ingRev[ "Bee" ] = ctr++;
    ingRev[ "Beehive Husk" ] = ctr++;
    ingRev[ "Berit's Ashes" ] = ctr++;
    ingRev[ "Bleeding Crown" ] = ctr++;
    ingRev[ "Blisterwort" ] = ctr++;
    ingRev[ "Blue Butterfly Wing" ] = ctr++;
    ingRev[ "Blue Dartwing" ] = ctr++;
    ingRev[ "Blue Mountain Flower" ] = ctr++;
    ingRev[ "Boar Tusk" ] = ctr++;
    ingRev[ "Bone Meal" ] = ctr++;
    ingRev[ "Briar Heart" ] = ctr++;
    ingRev[ "Burnt Spriggan Wood" ] = ctr++;
    ingRev[ "Butterfly Wing" ] = ctr++;
    ingRev[ "Canis Root" ] = ctr++;
    ingRev[ "Charred Skeever Hide" ] = ctr++;
    ingRev[ "Chaurus Eggs" ] = ctr++;
    ingRev[ "Chaurus Hunter Antennae" ] = ctr++;
    ingRev[ "Chicken's Egg" ] = ctr++;
    ingRev[ "Creep Cluster" ] = ctr++;
    ingRev[ "Crimson Nirnroot" ] = ctr++;
    ingRev[ "Cyrodilic Spadetail" ] = ctr++;
    ingRev[ "Daedra Heart" ] = ctr++;
    ingRev[ "Deathbell" ] = ctr++;
    ingRev[ "Dragon's Tongue" ] = ctr++;
    ingRev[ "Dwarven Oil" ] = ctr++;
    ingRev[ "Ectoplasm" ] = ctr++;
    ingRev[ "Elves Ear" ] = ctr++;
    ingRev[ "Emperor Parasol Moss" ] = ctr++;
    ingRev[ "Eye of Sabre Cat" ] = ctr++;
    ingRev[ "Falmer Ear" ] = ctr++;
    ingRev[ "Farengar's Frost Salt" ] = ctr++;
    ingRev[ "Felsaad Tern Feathers" ] = ctr++;
    ingRev[ "Fine-Cut Void Salts" ] = ctr++;
    ingRev[ "Fire Salts" ] = ctr++;
    ingRev[ "Fly Amanita" ] = ctr++;
    ingRev[ "Frost Mirriam" ] = ctr++;
    ingRev[ "Frost Salts" ] = ctr++;
    ingRev[ "Garlic" ] = ctr++;
    ingRev[ "Giant's Toe" ] = ctr++;
    ingRev[ "Giant Lichen" ] = ctr++;
    ingRev[ "Gleamblossom" ] = ctr++;
    ingRev[ "Glow Dust" ] = ctr++;
    ingRev[ "Glowing Mushroom" ] = ctr++;
    ingRev[ "Grass Pod" ] = ctr++;
    ingRev[ "Hagraven Claw" ] = ctr++;
    ingRev[ "Hagraven Feathers" ] = ctr++;
    ingRev[ "Hanging Moss" ] = ctr++;
    ingRev[ "Hawk's Egg" ] = ctr++;
    ingRev[ "Hawk Beak" ] = ctr++;
    ingRev[ "Hawk Feathers" ] = ctr++;
    ingRev[ "Histcarp" ] = ctr++;
    ingRev[ "Honeycomb" ] = ctr++;
    ingRev[ "Human Flesh" ] = ctr++;
    ingRev[ "Human Heart" ] = ctr++;
    ingRev[ "Ice Wraith Teeth" ] = ctr++;
    ingRev[ "Imp Stool" ] = ctr++;
    ingRev[ "Jarrin Root" ] = ctr++;
    ingRev[ "Jazbay Grapes" ] = ctr++;
    ingRev[ "Juniper Berries" ] = ctr++;
    ingRev[ "Large Antlers" ] = ctr++;
    ingRev[ "Lavender" ] = ctr++;
    ingRev[ "Luna Moth Wing" ] = ctr++;
    ingRev[ "Moon Sugar" ] = ctr++;
    ingRev[ "Mora Tapinella" ] = ctr++;
    ingRev[ "Mudcrab Chitin" ] = ctr++;
    ingRev[ "Namira's Rot" ] = ctr++;
    ingRev[ "Netch Jelly" ] = ctr++;
    ingRev[ "Nightshade" ] = ctr++;
    ingRev[ "Nirnroot" ] = ctr++;
    ingRev[ "Nordic Barnacle" ] = ctr++;
    ingRev[ "Orange Dartwing" ] = ctr++;
    ingRev[ "Pearl" ] = ctr++;
    ingRev[ "Pine Thrush Egg" ] = ctr++;
    ingRev[ "Poison Bloom" ] = ctr++;
    ingRev[ "Powdered Mammoth Tusk" ] = ctr++;
    ingRev[ "Purple Mountain Flower" ] = ctr++;
    ingRev[ "Red Mountain Flower" ] = ctr++;
    ingRev[ "River Betty" ] = ctr++;
    ingRev[ "Rock Warbler Egg" ] = ctr++;
    ingRev[ "Sabre Cat Tooth" ] = ctr++;
    ingRev[ "Salmon Roe" ] = ctr++;
    ingRev[ "Salt Pile" ] = ctr++;
    ingRev[ "Scaly Pholiota" ] = ctr++;
    ingRev[ "Scathecraw" ] = ctr++;
    ingRev[ "Silverside Perch" ] = ctr++;
    ingRev[ "Skeever Tail" ] = ctr++;
    ingRev[ "Slaughterfish Egg" ] = ctr++;
    ingRev[ "Slaughterfish Scales" ] = ctr++;
    ingRev[ "Small Antlers" ] = ctr++;
    ingRev[ "Small Pearl" ] = ctr++;
    ingRev[ "Snowberries" ] = ctr++;
    ingRev[ "Spawn Ash" ] = ctr++;
    ingRev[ "Spider Egg" ] = ctr++;
    ingRev[ "Spriggan Sap" ] = ctr++;
    ingRev[ "Swamp Fungal Pod" ] = ctr++;
    ingRev[ "Taproot" ] = ctr++;
    ingRev[ "Thistle Branch" ] = ctr++;
    ingRev[ "Torchbug Thorax" ] = ctr++;
    ingRev[ "Trama Root" ] = ctr++;
    ingRev[ "Troll Fat" ] = ctr++;
    ingRev[ "Tundra Cotton" ] = ctr++;
    ingRev[ "Vampire Dust" ] = ctr++;
    ingRev[ "Void Salts" ] = ctr++;
    ingRev[ "Wheat" ] = ctr++;
    ingRev[ "White Cap" ] = ctr++;
    ingRev[ "Wisp Wrappings" ] = ctr++;
    ingRev[ "Yellow Mountain Flower" ] = ctr++;
    var ingRevLen = ctr;

    ctr = 0;
    var effRev = {}; // if you edit this you *MUST* update the corresponding tests
    effRev[ "Cure Disease" ] = ctr++;
    effRev[ "Damage Health" ] = ctr++;
    effRev[ "Damage Magicka Regen" ] = ctr++;
    effRev[ "Damage Magicka" ] = ctr++;
    effRev[ "Damage Stamina Regen" ] = ctr++;
    effRev[ "Damage Stamina" ] = ctr++;
    effRev[ "Fear" ] = ctr++;
    effRev[ "Fortify Alteration" ] = ctr++;
    effRev[ "Fortify Barter" ] = ctr++;
    effRev[ "Fortify Block" ] = ctr++;
    effRev[ "Fortify Carry Weight" ] = ctr++;
    effRev[ "Fortify Conjuration" ] = ctr++;
    effRev[ "Fortify Destruction" ] = ctr++;
    effRev[ "Fortify Enchanting" ] = ctr++;
    effRev[ "Fortify Health" ] = ctr++;
    effRev[ "Fortify Heavy Armor" ] = ctr++;
    effRev[ "Fortify Illusion" ] = ctr++;
    effRev[ "Fortify Light Armor" ] = ctr++;
    effRev[ "Fortify Lockpicking" ] = ctr++;
    effRev[ "Fortify Magicka" ] = ctr++;
    effRev[ "Fortify Marksman" ] = ctr++;
    effRev[ "Fortify One-handed" ] = ctr++;
    effRev[ "Fortify Pickpocket" ] = ctr++;
    effRev[ "Fortify Restoration" ] = ctr++;
    effRev[ "Fortify Smithing" ] = ctr++;
    effRev[ "Fortify Sneak" ] = ctr++;
    effRev[ "Fortify Stamina" ] = ctr++;
    effRev[ "Fortify Two-handed" ] = ctr++;
    effRev[ "Frenzy" ] = ctr++;
    effRev[ "Invisibility" ] = ctr++;
    effRev[ "Lingering Damage Health" ] = ctr++;
    effRev[ "Lingering Damage Magicka" ] = ctr++;
    effRev[ "Lingering Damage Stamina" ] = ctr++;
    effRev[ "Paralysis" ] = ctr++;
    effRev[ "Ravage Health" ] = ctr++;
    effRev[ "Ravage Magicka" ] = ctr++;
    effRev[ "Ravage Stamina" ] = ctr++;
    effRev[ "Regenerate Health" ] = ctr++;
    effRev[ "Regenerate Magicka" ] = ctr++;
    effRev[ "Regenerate Stamina" ] = ctr++;
    effRev[ "Resist Fire" ] = ctr++;
    effRev[ "Resist Frost" ] = ctr++;
    effRev[ "Resist Magic" ] = ctr++;
    effRev[ "Resist Poison" ] = ctr++;
    effRev[ "Resist Shock" ] = ctr++;
    effRev[ "Restore Health" ] = ctr++;
    effRev[ "Restore Magicka" ] = ctr++;
    effRev[ "Restore Stamina" ] = ctr++;
    effRev[ "Slow" ] = ctr++;
    effRev[ "Waterbreathing" ] = ctr++;
    effRev[ "Weakness to Fire" ] = ctr++;
    effRev[ "Weakness to Frost" ] = ctr++;
    effRev[ "Weakness to Magic" ] = ctr++;
    effRev[ "Weakness to Poison" ] = ctr++;
    effRev[ "Weakness to Shock" ] = ctr++;
    var effRevLen = ctr;

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
