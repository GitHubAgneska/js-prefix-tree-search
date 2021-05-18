
import {checkString, checkStringIsSeveralWords} from '../utils/process-api-data';

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
        this.keys = new Map(); // with : KEY:letter - VALUE:next node containing letter -> = all first letters of any new word
        this.end = false;  // end of word ?
        this.setEnd = function () { 
            this.end = true;
            this.parentRecipeObjects = new Map(); // if 'isEnd' ( end of word) : store :  word:KEY + array containing objects:VALUE
        };
        this.isEnd = function () { return this.end; };
        
        // iterate through the parents to get the word - time complexity: O(n) ( n = word length )
        this.getWord == function() {
            var output = [];
            var node = this;

            while (node !== null) {
                output.unshift(node.key); // retrieve each letter from branch
                node = node.parent;
            }
            return output.join('');
        };
    }
}


// make it all lowercase
// remove accents, parentheses, ponctuation
// determine if made of sevearl words


class Trie {
    constructor(){
        this.root = new Node();

        // store current word
        let fullWord = '';
        this.setCurrentWord = function(input) { fullWord = input; };
        this.getCurrentWord = function() { return fullWord; };

        // store current recipe object
        let currentRecipeObject;
        this.setCurrentRecipeObject = function(recipeObject) { currentRecipeObject = recipeObject; };
        this.getCurrentRecipeObject = function() { return currentRecipeObject; };

        // ADD A LETTER - ( here, as iterating through all recipes to add words to the tree, also pass current recipe as param)
        this.add = function(input, node = this.root) {

            // NO MORE CHAR TO PROCESS : end of this tree branch
            if ( input.length === 0 ) { // end of word - fullWord must be complete
                node.setEnd();
                let fullWord = this.getCurrentWord(); // console.log('FULLWORD==', fullWord); //

                // case 1 : first time this word is added to tree:
                // parentRecipeObjects map has been created but is empty
                if ( !node.parentRecipeObjects.has(fullWord)){ // (fullword should be the key in this map)
                    console.log('parentRecipeObjects does NOT have this key yet !==');
                    let arrOfRecipes = []; // set up array value to store recipes this word comes from
                    node.parentRecipeObjects.set(fullWord,arrOfRecipes); // set up map with : key:word - value: array of object recipes

                    let currentRecipe = this.getCurrentRecipeObject();
                    arrOfRecipes.push(currentRecipe); // push recipe object word stems from
                    console.log(node.parentRecipeObjects);
                
                    // case 2 : the word does already exist in tree : parentRecipeObjects contains key with this word
                } else if (node.parentRecipeObjects.has(fullWord)){ // (check anyway)
                    console.log('parentRecipeObjects DOES have this key !');
                    let folderOfRecipesKey = node.parentRecipeObjects.get(fullWord);
                    let currentRecipe = this.getCurrentRecipeObject();
                    folderOfRecipesKey.arrOfRecipes.push(currentRecipe); // only push current recipe Object to array
                    console.log(node.parentRecipeObjects);
                }
                return;

            // MORE CHAR TO PROCESS
            } else if (!node.keys.has(input[0])) { // key letter is not a node key yet
                node.keys.set(input[0], new Node()); // create it (= new map entry (key:letter, value: new node)
                // then add recursively all following letters to this node key
                return this.add(input.substring(1), node.keys.get(input[0]));  // ---- TO REVIEW : Substring iterates over a string in O(n) time. 2. Substring creates a copy of the string (because it is immutable). So it needs O(n) time for each iteration and O(n - 1) = O(n) space for each iteration, which makes it O(n^2) time and space complexity when adding.
                                                                               // ---  > use instead : array.split('') + iteration ( O(1) )
            } else {    // key letter IS a node key already
                return this.add(input.substring(1), node.keys.get(input[0])); // add each following letter to existing node
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



export function trieTreeSearch(searchTerm, recipes) {

    var trie = new Trie();

    recipes.forEach(recipe => {
        
        let node;
        let recipeName = recipe.name;
        recipeName = checkString(recipeName);
        recipeName = checkStringIsSeveralWords(recipeName);
        trie.setCurrentWord(recipeName);
        trie.setCurrentRecipeObject(recipe);
        
        if ( !trie.contains(recipeName)) {
            trie.add(recipeName, node);
        } else { console.log('word already exist in tree! ');}
        console.log('trie root=', trie.root);
    });
}



