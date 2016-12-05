# SPOT2
### Skyr\*m Potion Optimizing Tool (version 2)

New pure javascript version of the Skyrim Potion Optimizer Tool (SPOT)


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
var ingredient = {
	x: "DEPRECIATED: index value in ingredient list" // DO NOT USE
	n: "full name of ingredient",

	v: "value multiplier for the ingredient",
	w: "weight of the ingredient",
	r: "region where the ingredient is found",
	o: "DLC that added this ingredient",
	q: "how many merchants store this ingredient",

	e: [ // list of effects this ingredient causes - odered by game list (exactly 4)
	     // these attributes of the effects are ingredient specific
		{
			x: "index of effect in idx.i.l[]", // note this is NOT the ordinal index!
			n: "DEPRECIATED: full name of ingredient", // this can be obtained by idx.i.l[x].n

			v: "value multiplier of the effect for this ingredient",
			m: "effect magnitude multiplier of the effect for this ingredient",
		}
	]
};

var effect = {
	x: "DEPRECIATED: index value in effect list", // DO NOT USE
	n: "full name of effect",
	f: "is the effect favourable? (true/false)",
	// TODO: is this really required... where is the ingredient list used???
	i: [] // list of ingredients that cause this effect - odered by game list
};

var potion = {
	x: "DEPRECIATED: index value in potion list", // DO NOT USE
	i: [], // ordered list of indexes for each ingredient
	e: []  // ordered list of indexes for each effect
};

var index = { // mechanism for accessing root of the index
	i: { // SECTION: all _ingredient_ related nodes
		a: [], 	// ingredients that should be viewable after current processing is complete
		b: [], 	// ingredients that are currently viewable (before current processing started)
		d: [], 	// jQuery representation of all the ingredient objects
		h: {}, 	// pre-created hash of ingredient names pointing to the index values for list 'l'
		l: [],	// ordered list pointers to all ingredient objects (sorted by ingredient name)
		p: [],  // list of potions that include this ingredient (must list be sorted)
		z: 'total number of ingredients in the list',
	},
	e: { // SECTION: all _effect_ related nodes
		a: [], 	// effects that should be viewable after current processing is complete
		b: [], 	// effects that are currently viewable (before current processing started)
		d: [], 	// jQuery representation of all the effect objects
		h: {}, 	// pre-created hash of effect names pointing to the index values for list 'l'
		l: [],	// ordered list pointers to all effect objects (sorted by effect name)
		p: [],  // list of potions that include this effect (must list be sorted)
		z: 'total number of effects in the list',
	},
	p: { // SECTION: all _potion_ related nodes
		z: 'total number of potions in the list',
		l: [],   // ordered list pointers to all potion objects (sorted by the string value of concatinating the ordinal values of the contained ingredients)
		i: [     // index of all potions based on the number of ingredients contained in the potion
			null, // there are no potions with '0' ingredients
			null, // there are no potions with '1' ingredients
			[],   // ordered list of all potions with exactly '2' ingredients
			[]    // ordered list of all potions with exactly '3' ingredients
		],
		e: [     // index of all potions based on the number of effects contained in the potion
			null, // there are no potions with '0' effects
			[],   // ordered list of all potions with exactly '1' effects
			[],   // ordered list of all potions with exactly '2' effects
			[],   // ordered list of all potions with exactly '3' effects
			[],   // ordered list of all potions with exactly '4' effects
			[],   // ordered list of all potions with exactly '5' effects
			[],   // ordered list of all potions with exactly '6' effects
			[]    // ordered list of all potions with exactly '7' effects
		] 
	},
	m: { // SECTION: all _metrics_ related nodes
		o: { // ingredients - there are no DLC specific effects
			'BS': '# of ingredients that are available in Base Skyrim',
			'DB': '# of ingredients that are available in the Dragonborn DLC',
			'DG': '# of ingredients that are available in the Dawnguard DLC',
			'HS': '# of ingredients that are available in the Headstead DLC',
		},
		p: [ // mapping between number of ingredients and effects for useful potions
			null, // there are no potions with '0' ingredients
			null, // there are no potions with '1' ingredients
			[
				0, // 2 ingredient potions with 0 effects
				x, // 2 ingredient potions with 1 effects
				x, // 2 ingredient potions with 2 effects
				x, // 2 ingredient potions with 3 effects
				x, // 2 ingredient potions with 4 effects
				x, // 2 ingredient potions with 5 effects
				x, // 2 ingredient potions with 6 effects
				x  // 2 ingredient potions with 7 effects
			],
			[
				0, // 3 ingredient potions with 0 effects
				x, // 3 ingredient potions with 1 effects
				x, // 3 ingredient potions with 2 effects
				x, // 3 ingredient potions with 3 effects
				x, // 3 ingredient potions with 4 effects
				x, // 3 ingredient potions with 5 effects
				x, // 3 ingredient potions with 6 effects
				x  // 3 ingredient potions with 7 effects
			]
		],
		u: [ // mapping between number of ingredients and effects for useful potions
			 // this is usually because the there no more effects in the 3 ingredient version
			 // than in the two independent 2 ingredient potions - these are officially viable
			 // but usually not very useful
			null, // there are no potions with '0' ingredients
			null, // there are no potions with '1' ingredients
			[ // 2 ingredient potions
				0, // ... with 0 effects
				x, // ... with 1 effects
				x, // ... with 2 effects
				x, // ... with 3 effects
				x, // ... with 4 effects
				x, // ... with 5 effects
				x, // ... with 6 effects
				x  // ... with 7 effects
			],
			[ // 3 ingredient potions
				0, // ... with 0 effects
				x, // ... with 1 effects
				x, // ... with 2 effects
				x, // ... with 3 effects
				x, // ... with 4 effects
				x, // ... with 5 effects
				x, // ... with 6 effects
				x  // ... with 7 effects
			]
		],
		f: { // mapping between number of effects and pos/neg effect mix
			'pos': [ // purely positive potions
				0, // ... with 0 effects
				x, // ... with 1 effects
				x, // ... with 2 effects
				x, // ... with 3 effects
				x, // ... with 4 effects
				x, // ... with 5 effects
				x, // ... with 6 effects
				x  // ... with 7 effects
			],
			'neg': [ // purely negative potions
				0, // ... with 0 effects
				x, // ... with 1 effects
				x, // ... with 2 effects
				x, // ... with 3 effects
				x, // ... with 4 effects
				x, // ... with 5 effects
				x, // ... with 6 effects
				x  // ... with 7 effects
			],
			'mix': [ // potions with both negative and postive effects
				0, // ... with 0 effects
				x, // ... with 1 effects
				x, // ... with 2 effects
				x, // ... with 3 effects
				x, // ... with 4 effects
				x, // ... with 5 effects
				x, // ... with 6 effects
				x  // ... with 7 effects
			]
		}
	}
};
```

# Discussion

## Why not use a Javascript framework

The first version of SPOT was written in 'pure' javascript (using
 [Bootstrap]http://getbootstrap.com/ and [jQuery]https://api.jquery.com).  
After the DLCs were release, I tried rewritting using Angular and other
popular frameworks.  Probably due to the fact that I did not know them
well the page loading and manipulation becames very slow.  I am manipulating
many DOM elements and the communication between objects became a significant
issue.  I was able to get significant performance gains by switching back 
to a more 'pure' javascript implementation - though I still was loath to
give up jQuery or Bootstrap.

## Why is does the application not load all the data immediately?

With all the new data that the DLCs introduced, the page load was still
too slow.  By spliting out some of the less used data for manual load
the application returned to better page load times.

