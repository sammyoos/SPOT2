# SPOT2
### Skyr*m Potion Optimizing Tool (version 2)

New pure javascript version of the Skyrim Potion Optimizer Tool (SPOT)


# Implementation Details

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
* `h` - *hash* - represents a hash of the name of the current object pointing to its index value
* `i` - *ingredient* - represents an 'ingredient' related structure
* `l` - *list* - represents an ordered list of objects
* `n` - *name* - represents the full name of the object
* `s` - *selected* - represents an array of booleans indicating if this object is currently selected
* `p` - *potion* - represents a 'potion' releated structure
* `x` - *index* - represents the index of this object within it's primary list
* `z` - *size* - represents the size structure (typically the number of elements in *list*)

``` javascript
var ingredient = {

	e: [ // list of effects this ingredient causes - odered by game list (exactly 4)
	]    // these attributes of the effects are ingredient specific
	n: "full name of ingredient",
	x: "DEPRECIATED: index value in ingredient list" // DO NOT USE
};

var effect = {
	x: "DEPRECIATED: index value in effect list", // DO NOT USE
	n: "full name of ingredient",
	i: [] // list of ingredients that cause this effect - odered by game list
};

var potion = {
	x: "DEPRECIATED: index value in potion list", // DO NOT USE
	i: [], // ordered list of indexes for each ingredient
	e: []  // ordered list of indexes for each effect
};

function getIdx() {  // mechanism for accessing root of the index
	return( {
		i: { // SECTION: all _ingredient_ related nodes
			a: [], // ingredients that should be viewable after current processing is complete
			b: [], // ingredients that are currently viewable (before current processing started)
			d: [], // jQuery representation of all the ingredient objects
			n: 'total number of ingredients in the list',
			i: {}, // pre-created hash of ingredient names pointing to the index values for list 'l'
			l: [], // ordered list pointers to all ingredient objects (sorted by ingredient name)
		},
		e: { // SECTION: all _effect_ related nodes
			n: 'total number of effects in the list',
			i: {}, // pre-created hash of effect names pointing to the index values for list 'l'
			l: [], // ordered list pointers to all effect objects (sorted by ingredient name)
		},
		p: { // SECTION: all _potion_ related nodes
			n: 'total number of potions in the list',
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
		}
	} );
```



