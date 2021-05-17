
// TRIE TREE of PREFIX TREE
// visualisation tool : https://www.cs.usfca.edu/~galles/visualization/Trie.html

// STORE WORDS AND FIND SAME OCCURENCES OF THESE WORDS IN DIFFERENT OBJECTS
// VALIDATE THAT A WORD (searchterm) EXISTS in the current DATA
// 
// -----------------------------------------------------------------------------------------------
// For each incoming recipe from api : each name, ingredient, ustensil, appliance
// will be stored in the tree, with a reference to the recipe object it belongs to, 
// SO when a search term comes in, 
// if it is contained in the tree, this will automatically return all recipe objects containing this word
// Major benefit : from the first letter of search term, and then each letter, 
// the search will either go on if something is matching, or stop right away

// Using Map data structure, allows built-in methods such as 'has(key)', 'get(key), 'set()', 'size', 'delete', 'clear'
// keys in Maps can be of any type ( ≠ Object = strings only)
// iterators = same as Object's : map.keys, map.values, map.entries, 
// spread operator : [ ...myMap ]

class Node {
    constructor() {
        this.keys = new Map(); // with : KEY:letter - VALUE:next letter -> = all first letters of any new word
        this.end = false;  // end of word ?
        this.setEnd = function () { this.end = true; };
        this.isEnd = function () { return this.end; };
        this.parentRecipeObjects = new Map(); // if 'isEnd' ( end of word) : store :  word:KEY + array containing objects:VALUE
        
        // iterate through the parents to get the word - time complexity: O(n) ( n = word length )
        this.getWord == function() {
            var output = [];
            var node = this;

            while (node !== null) {
                output.unshift(node.key);
                node = node.parent;
            }
            return output.join('');
        };
    }
}

class Trie {
    constructor(){
        this.root = new Node();

        // ADD A WORD
        this.add = function(input, recipeObject, node = this.root) {
            if ( input.length === 0 ) { // end of word 
                node.setEnd();
                if( !node.parentRecipeObjects) { // if map containing word and recipes matching word does not exist
                    node.parentRecipeObjects = new Map(input,recipeObject ); // create it
                } else { // if the map exists already
                    // node.parentRecipeObjects.
                    return;
                }
                return;
            } else if (!node.keys.has(input[0])) { // key letter is not a node key yet
                node.keys.set(input[0], new Node()); // create it (= new map entry (key:letter, value: new node)

                return this.add(input.substring(1), node.keys.get(input[0]));  // ---- TO REVIEW : Substring iterates over a string in O(n) time. 2. Substring creates a copy of the string (because it is immutable). So it needs O(n) time for each iteration and O(n - 1) = O(n) space for each iteration, which makes it O(n^2) time and space complexity when adding.
            } else {                                                           // ---  > use instead : array.split('') + iteration ( O(1) )
                return this.add(input.substring(1), node.keys.get(input[0])); 
            }
        };

        // CHECK WORD IS IN TRIE
        this.contains = function(word) {
            let node = this.root;
            while (word.length > 1 ) {
                if (!node.keys.has(word[0])) {
                    return false;
                } else {
                    node = node.keys.get(word[0]);
                    word = word.substr(1);
                }
            }
            return ( node.keys.has(word) && node.keys.get(word).isEnd() ); 
        };

        this.showResults = function() {
            let words = new Array();
            let search = function(node, str) {
                if (node.keys.size !== 0 ) {
                    for (let letter of node.keys.keys()) {
                        search(node.keys.get(letter), str.concat(letter));
                    }
                    if (node.isEnd()) words.push(str);
                } else { str.length > 0 ? words.push(str) : undefined; return;}
            };
            search(this.root, new String());
            return words.length > 0? words: null;
        };
    }
}



/* export function trieTreeSearch(searchTerm, recipes) {

    var trie = new Trie();

    recipes.forEach(recipe => {    // Each recipe : 
        
        trie.add(recipe.name, recipe);
    });
} */

var myMap = new Map();
var myKey = 'test';
var myValue = [];
var myObject = {'id': 1, 'name': 'limonade', 'time':10 };

myMap.set(myKey, myValue);

let arr = myMap.get(myKey);
arr.push(myObject);

console.log(myMap);




debugger;


