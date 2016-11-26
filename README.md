# SPOT2
### Skyr*m Potion Optimizing Tool (version 2)

New pure javascript version of the Skyrim Potion Optimizer Tool (SPOT)


# Implementation Details

## Index Structure

``` javascript
var ingredient = {
};

var effect = {
};

var potion = {
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



