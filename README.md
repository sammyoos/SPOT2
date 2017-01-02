# [SPOT2](http://sammyoos.github.io/SPOT2)

### Skyr\*m Potion Optimizing Tool (version 2)

New javascript version of the Skyrim Potion Optimizer Tool (SPOT).
This was originally written to make it easier for friends and family
to build potions in Skyrim.  It turned out to be an interesting problem
to solve and the logistics of keeping the program relatively responsive
when dealing with such large quantities of data was challenging.


# Implementation Details

## Information Sources
* http://www.uesp.net/wiki/Skyrim:Ingredients
* http://www.uesp.net/wiki/Dragonborn:Ingredients

## Index Structure

Creating all required potions based on the current selection critera on the client side is 
processor heavy and also quite slow, as such, as much as possible of computing is done before hand,
stored in index files and then retrieved at page load.

### Variable Naming Conventions (inside of the index)
The following conventions are observed for field names in structures to minimize space, as 
it is transfered to the client side browser as a JSON string and many of these names are repeated
many times.
* `a` - *after* - represents an array of booleans indicating if this object should be displayed after this processing
* `b` - *before* - represents an array of booleans indicating if this object is currently displayed
* `d` - *display* - represents an array of jQuery objects that can be addressed directly
* `e` - *effect* - represents an 'effect' related structure
* `f` - *favourable* - specifically for effects - represents if the effect is positive or negative
* `h` - *hash* - represents a hash of the name of the current object pointing to its index value
* `i` - *ingredient* - represents an 'ingredient' related structure
* `l` - *list* - represents an ordered list of objects
* `m` - *magnitude* - specifically for ingredients - the effect multiplier
* `n` - *name* - represents the full name of the object
* `o` - *origin* - specifically for ingreidents (DLC that adds this ingredient)
	* BS=Base Skyrim, DB=Dragonborn, DG=Dawnguard, HF=Hearthfire
* `p` - *potion* - represents a 'potion' releated structure
* `q` - *quantity* - represents the merchant availability of this ingredient
* `r` - *region* - specifically for ingredients (where it is found)
* `s` - *selected* - represents an array of booleans indicating if this object is currently selected
* `x` - *index* - represents the index of this object within it's primary list
* `v` - *value* - represents the value multiplier (both ingredients and effects)
* `w` - *weight* - specifically for ingredients
* `z` - *size* - represents the size structure (typically the number of elements in *list*)

Other important conventions:
* always use `index` to refer to the base index
* always use `idx` to refer to a primary branch of the base index that is passed into a subroutine

``` javascript
var index = [];		// mechanism for accessing root of the index
	idxIng = [];		// SECTION: all _ingredient_ related nodes
		ieSiz;				// total number of ingredients in the list
		ieLst = [];			// ordered list of all ingredient objects (sorted by ingredient name)
			objIngNam;			// name of ingredient
			objIngVal;			// base value
			objIngWgt;			// weight
			objIngLoc;			// location to find
			objIngDLC;			// DLC containing ingredient
			objIngMer;			// quantity of merchants selling this ingredient
			objIngEff = [];		// effects caused by this ingredient
								// properties that are specific to this ingredient
								// the effects *MUST* be sorted by Pos (reverse order)
				objIngEffPos;		// position in the effect list -> idxEffLst
				objIngEffVal;		// value multiplier
				objIngEffMag;		// effect strength magnitude multiplier
			objIngLen;			// length of object
		ieDis = [];			// display properties of the ingredients
			objDisNxt = [];		// ingredients that should be viewable after current processing is complete
			objDisPrv = [];		// ingredients that are currently viewable (before current processing started)
			objDisjQr = [];		// jQuery representation of all the ingredient objects
			objDisCnt = [];		// number of jQuery objects
		iePot = [];			// list of potions that include this ingredient (must list be sorted)
		ieDLC = [];
			objDlcBS: [], // ingredients that are available in Base Skyrim
			objDlcDB: [], // ingredients that are available in the Dragonborn DLC
			objDlcDG: [], // ingredients that are available in the Dawnguard DLC
			objDlcHS: []  // ingredients that are available in the Headstead DLC
		ieRev: {},	// pre-created hash of ingredient names pointing to the index values for list 'l'

	idxEff: { // SECTION: all _effect_ related nodes
		ieSiz;				// total number of effects in the list
		ieLst = [];			// ordered list of all effect objects (sorted by effect name)
			objEffNam;			// name of effect
			objIngNat;			// nature of effect
		ieDis = [];			// display properties of the effects
			objDisNxt = [];		// effects that should be viewable after current processing is complete
			objDisPrv = [];		// effects that are currently viewable (before current processing started)
			objDisjQr = [];		// jQuery representation of all the effect objects
			objDisCnt = [];		// number of jQuery objects
		iePot = [];			// list of potions that include this effect (must list be sorted)
		ieDLC = null;		// not used for effects
		ieRev: {},	// pre-created hash of effect names pointing to the index values for list 'l'

	idxPot: { // SECTION: all _potion_ related nodes
		ieSiz;				// total number of potionss in the list
		ieLst = [];			// ordered list of all potions objects (sorted by potions name)
			objPotIng = [];		// list of ingredients in the potions
			objPotEff = [];		// list of effects in the potions
			objPotNat;			// nature of the potions
		ieDis = [];			// display properties of the potionss
			objDisNxt = [];		// potionss that should be viewable after current processing is complete
			objDisPrv = [];		// potionss that are currently viewable (before current processing started)
			objDisjQr = [];		// jQuery representation of all the potions objects
			objDisCnt = [];		// number of jQuery objects
		idxPotIng = [];		// lists of potions - grouped by number of ingredients
		idxPotEff = [];		// lists of potions - grouped by number of effects
		idxPotNat = [];		// lists of potions - grouped by their nature
```

# Discussion

## How do potions work in Skyrim?

http://elderscrolls.wikia.com/wiki/Alchemy_(Skyrim)

Important Bits:
- As you play Skyrim you will aquire ingredients
- Each ingredient has exactly four effects
- When you combine two ingredients (in an alchemy lab) and those two ingredients share 1 or more similar effects you will create a potion that has each of the shared effects
- Some ingredients make their effects stronger/weaker or more/less expensive

## How many potions does this application track?

With the three core DLCs installed there are 115 ingredients and a total of 55 effects.  There are close to 40,000 potions possible. This application 
tracks all two ingredient potions (1,814) and only the three ingredient potions that add more effects than when you combine the most productive two
ingredients in a potion (for a total of 34,917).  Other interesting facts:

### Number of Effects
- 1,623 single effect potions
- 28,293 two effect potions
- 6,264 three effect potions
- 539 four effect potions
- 12 five effect potions

### Nature of Effects
- 12,324 potions that have only positive effects
- 6,211 potions that have only negative effects
- all the rest have a mixture of positve and negative effects

## Interesting potions 

### Strictly Positive

> Ingredients: Bear Claws, Charred Skeever Hide, Wheat
> Effects: Fortify Health, Restore Health, Restore Stamina

> Ingredients: Ash Creep Cluster, Ectoplasm, Vampire Dust
> Effects: Fortify Destruction, Invisibility, Restore Magicka

> Ingredients: Bear Claws, Beehive Husk, Hawk Feathers
> Effects: Fortify Light Armor, Fortify One-handed, Fortify Sneak

### Strictly Negative

> Ingredients: Imp Stool, Scathecraw, Skeever Tail
> Effects: Damage Health, Lingering Damage Health, Ravage Health

> Ingredients: Butterfly Wing, Human Heart, Nightshade
> Effects: Damage Health, Damage Magicka, Damage Magicka Regen, Lingering Damage Stamina

> Ingredients: Emperor Parasol Moss, Glow Dust, Human Heart
> Effects: Damage Health, Damage Magicka, Damage Magicka Regen 

## Why not use a Javascript framework

The first version of SPOT was written in javascript (using
 [Bootstrap](http://getbootstrap.com/) and [jQuery](https://api.jquery.com)).  
After the DLCs were released, I tried rewritting using Angular and other
popular frameworks.  Probably due to the fact that I did not know them
well, the page loading and manipulation becames very slow.  I am manipulating
many DOM elements and the communication between objects became a significant
issue.  I was able to get significant performance gains by switching back 
to a more 'pure' javascript implementation - though I still was loath to
give up jQuery or Bootstrap.

## Why does the application not load all the data immediately?

With all the new data that the DLCs introduced, the page load was still
too slow.  By spliting out some of the less used data for manual load
the application returned to better page load times.

## Why does the coding use so many local variables?

The index structure is deep and complex.  Dereferencing into that can 
be expensive when done many times.  Local variables that point to commonly
used areas of the index encourage the compiler to keep those areas in
registers (very fast memory) which *should* result in faster code.
http://jonraasch.com/blog/10-javascript-performance-boosting-tips-from-nicholas-zakas
Not directly related, but a delightful article on performance:
http://www.webreference.com/programming/javascript/jkm3/index.html

## What about browser support?

As much as possible, the end user product (the potion optimizer) has
been developed to usitilize no aspects of JavaScript, CSS, or HTML that
require a new, up-to-date browser.  Minimal testing has been done up-front,
but as more aspects of the system are fully developed, this testing will
become more robust.

For the development aspect (parser and creation of indexes) it is assumed
the developer has access to the latest/greatest/fully patched browsers.
Much of this was built and tested with:
> *Google Chrome :*	55.0.2883.87 (Official Build) m (64-bit)

## Testing... [QUnit](https://qunitjs.com/cookbook/)

The testing currently only covers things that can be easily unit tested.
I'm focusing on providing testing on the things that are most easily
broken.

### Execute Tests
... run `.../tests.html`

### Add Tests
look at the javacript at `.../scripts/tests.js`

## Other References
- HTML Entities: https://dev.w3.org/html5/html-author/charref
- Github Markdown: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
- Namespace mechanisms
	- http://stackoverflow.com/questions/881515/javascript-namespace-declaration
	- http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
- IOS Debugging: http://johnnyzone.com/2016/02/debug-a-website-in-ios-safari-on-windows/
- Dynamic pages for download: http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server

## Commonly used commands
- *GIT*
	- `git checkout -b newbranch` -- create a new branch hear and now
	- make current branch master
		- `git checkout mybranch`
		- `git merge -s ours master`
		- `git checkout master`
		- `git merge mybranch`
