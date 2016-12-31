(function( sns, $, undefined ) 
{
  "use strict";

  /*
   * constants, global to the app
   */
  sns.maxPotDis = 50; // maximum number of potions to display

  // DLCs
  sns.objDlcBS  = 0;    // Base Skyrim
  sns.objDlcDB  = 1;    // Dragonborn
  sns.objDlcDG  = 2;    // Dawnguard
  sns.objDlcHS  = 3;    // Homestead
  sns.objDlcLen = 4;    // length of object

  sns.objDlcNam = [
    "Base Skyrim",
    "Dragonborn",
    "Dawnguard",
    "Homestead"
  ];

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
  sns.objDisjQr = 3;  // jQuery list objects 
  sns.objDisCnt = 4;  // jQuery object for the count of objects
  sns.objDisLen = 5;  // length of object

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

}( window.sns = window.sns || {}, jQuery ));

// vim:set tabstop=2 shiftwidth=2 expandtab:
