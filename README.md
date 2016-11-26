# SPOT2
### Skyr*m Potion Optimizing Tool (version 2)

New pure javascript version of the Skyrim Potion Optimizer Tool (SPOT)


# Implementation Details

## Index Structure

Creating all required potions based on the current selection critera on the client side is 
processor heavy and also quite slow, as such, as much as possible of computing is done before hand,
stored in index files and then retrieved at page load.


* the following conventions are observed for field names in structures to minimize space
	1. `a` - *after* - represents an array of booleans indicating if this object should be displayed after this processing
	1. `b` - *before* - represents an array of booleans indicating if this object is currently displayed
	1. `d` - *display* - represents an array of jQuery objects that can be addressed directly
	1. `e` - *effect* - represents an 'effect' related structure
	1. `i` - *ingredient* - represents an 'ingredient' related structure
	1. `l` - *list* - represents an ordered list of objects
	1. `n` - *name* - represents the full name of the object
	1. `p` - *potion* - represents a 'potion' releated structure
	1. `s` - *size* - represents the size structure (typically the number of elements in *list*)
	1. `x` - *index* - represents the index of this object within it's primary list

``` javascript
var ingredient = {
	x: "DEPRECIATED: index value in ingredient list", // DO NOT USE
	n: "full name of ingredient",
	e: [ // list of effects this ingredient causes - odered by game list (exactly 4)
	]    // these attributes of the effects are ingredient specific
};

var effect = {
	x: "DEPRECIATED: index value in effect list", // DO NOT USE
	n: "full name of ingredient",
	i: [] // list of ingredients that cause this effect - odered by game list
};

var potion = {
	x = "DEPRECIATED: index value in potion list", // DO NOT USE
	i = [], // ordered list of indexes for each ingredient
	e = []  // ordered list of indexes for each effect
};

function getIdx() {  // mechanism for accessing root of the index
	return( {
		i = { // SECTION: all _ingredient_ related nodes
			n = 'total number of ingredients in the list',
			i = {}, // pre-created hash of ingredient names pointing to the index values for list 'l'
			l = [], // ordered list pointers to all ingredient objects (sorted by ingredient name)
		},
		e = { // SECTION: all _effect_ related nodes
			n = 'total number of effects in the list',
			i = {}, // pre-created hash of effect names pointing to the index values for list 'l'
			l = [], // ordered list pointers to all effect objects (sorted by ingredient name)
		},
		p = { // SECTION: all _potion_ related nodes
			n = 'total number of potions in the list',
			l = [],   // ordered list pointers to all potion objects (sorted by the string value of concatinating the ordinal values of the contained ingredients)
			i = [     // index of all potions based on the number of ingredients contained in the potion
				null, // there are no potions with '0' ingredients
				null, // there are no potions with '1' ingredients
				[],   // ordered list of all potions with exactly '2' ingredients
				[]    // ordered list of all potions with exactly '3' ingredients
			],
			e = [     // index of all potions based on the number of effects contained in the potion
				null, // there are no potions with '0' effects
				[],   // ordered list of all potions with exactly '1' effects
				[],   // ordered list of all potions with exactly '2' effects
				[],   // ordered list of all potions with exactly '3' effects
				[],   // ordered list of all potions with exactly '4' effects
				[],   // ordered list of all potions with exactly '5' effects
				[],   // ordered list of all potions with exactly '6' effects
				[]    // ordered list of all potions with exactly '7' effects
			] 
		}
	} );
```



