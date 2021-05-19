
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
// if it is contained (partial or complete) in the tree, this will automatically return all recipe objects containing this word
// Major benefit : from the first letter of search term, and then each letter, 
// the search will either go on if something is matching, or stop right away

// Using Map data structure, allows built-in methods such as 'has(key)', 'get(key), 'set()', 'size', 'delete', 'clear'
// keys in Maps can be of any type ( ≠ Object = strings only)
// iterators = same as Object's : map.keys, map.values, map.entries,  ( => return an iterable ARRAY )
// spread operator : [ ...myMap ]

class Node {
    constructor() {
        this.keys = new Map(); // with : KEY:letter - VALUE:next node containing letter -> = all first letters of any new word
        this.parent = null;// we keep a reference to parent
        this.end = false;  // end of word ?
        this.setEnd = function () { this.end = true; };
        this.isEnd = function () { return this.end; };
        this.parentRecipeObjects = new Map(); // if 'isEnd' ( end of word) : store :  word:KEY + array containing objects:VALUE
        
        // iterate through the parents to get the word - time complexity: O(n) ( n = word length )
        this.getWord = function(node) {
            var output = [];
            while (node !== null) {
                output.unshift(node.keys.keys); // retrieve each letter from branch
                node = node.parent;
            }
            return output.join('');
        };
    }
}


class Trie {
    constructor(){
        this.root = new Node();

        // store objectsRecipe attached to nodes
        let recipesForWord = [];
        // go to end of node : if search term is partial and match in tree is found : retrieve all possible results (from node end)
        this.goToLastNode = function(node) {
            console.log('CURRENT NODE ==', node);
            let currentNode = node;
            
            while ( currentNode.end === false ) {
                console.log('IS END NODE ==', currentNode.end);

                let nextNode = currentNode.keys; // go to next node
                node = nextNode;
                console.log('NEXT NODE ==', node);
            }      
        };

        this.getRecipesFromNode = function(node) {
            if ( node.parentRecipeObjects.entries ) {
                recipesForWord.push(node.parentRecipeObjects.entries);
            }
            return recipesForWord;
        };

        // store current incoming word
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
            } else {    // key letter IS a node key already (node.keys.has(input[0])
                
                // if letter is a 'bifurcation', should retrieve current recipe object => suggestions
                if (node.keys.size > 1) {
                    let currentRecipe = this.getCurrentRecipeObject();
                    let arrOfRecipes = []; // set up array value to store recipes this word is part of
                    let currentPartialWord = node.getWord(node); console.log('PARTIAL WORD==', currentPartialWord);
                    node.parentRecipeObjects.set(currentPartialWord,arrOfRecipes);
                    arrOfRecipes.push(currentRecipe); // push recipe object word stems from
                }
                return this.add(input.substring(1), node.keys.get(input[0])); // add each following letter to existing node
            } 
        };
        // 

        // CHECK WORD IS IN TRIE -> used to map data into tree ONLY
        this.contains = function(word) {
            let node = this.root;
            while (word.length > 1 ) {
                if (!node.keys.has(word[0])) {
                    return false;
                } else {
                    node = node.keys.get(word[0]); // place cursor on matching letter of root
                    word = word.substr(1); // next letter of word to check
                }
            }
            return ( node.keys.has(word) && node.keys.get(word).isEnd() ); // true || false
        };

        // SEARCH TERM IN TRIE 
        this.searchInTrie = function(searchterm) {

            let node = this.root;
            let recipes;

            while (searchterm.length > 1 ) {
                if (!node.keys.has(searchterm[0])) {
                    return false;
                } else {
                    node = node.keys.get(searchterm[0]); // place cursor on matching letter of root
                    searchterm = searchterm.substr(1); // next letter of searchterm to check

                    // ' if ( node.keys.has(searchterm)' : matching word might be partial : so get all possible word endings
                    // go to end of node (or nodeS if multiple) to get recipe.name / object
                    let lastNode = this.goToLastNode(node);
                    // nrecipes = this.getRecipesFromNode(lastNode);
                    // console.log('RECIPES CORRESP to SEARCH TERM==',recipes);
                }
            }
            return recipes ? recipes : 'no match found!'; 
        };


        // HELPER function : show all words entered in tree
        this.print = function() {
            let allwordsOfTree = new Array();

            let search = function(node, str) {

                if (node.keys.size !== 0 ) {
                    for (let letter of node.keys.keys()) { // node's letter child
                        search(node.keys.get(letter), str.concat(letter)); // check each node letter - and retrieve
                    }
                    if (node.isEnd()) allwordsOfTree.push(str); 

                } else { str.length > 0 ? allwordsOfTree.push(str) : undefined; return;}
            };
            search(this.root, new String());
            return allwordsOfTree.length > 0? allwordsOfTree: null;
        };
    }
}


// MAPPING ALL INCOMING DATA TO TREE
// --------------------------------------------------
export function mapDataToTree(recipes) {

    let recipesTrie = new Trie();

    recipes.forEach(recipe => {
        
        let node;
        let wordToProcessToTree;  // --------------------------------- | TO DO : optimize this current function
        let isArray = wordToProcessToTree instanceof Array; // ------- |
        

        // process NAME and add to tree
        let recipeName = recipe.name;
        recipeName = checkString(recipeName);
        recipeName = checkStringIsSeveralWords(recipeName);
        recipesTrie.setCurrentWord(recipeName);
        recipesTrie.setCurrentRecipeObject(recipe);
        if ( !recipesTrie.contains(recipeName)) { recipesTrie.add(recipeName, node); } else { console.log('word already exist in tree! ');} // less likely to happen

        // process each INGREDIENT and add to tree
        let recipeIngredients = recipe.ingredients;
        recipeIngredients.forEach(item => {
            let ingredientName = item.ingredient; // = ingredient.name
            ingredientName = checkString(ingredientName);
            ingredientName = checkStringIsSeveralWords(ingredientName);
            recipesTrie.setCurrentWord(ingredientName);
            recipesTrie.setCurrentRecipeObject(recipe);
            if ( !recipesTrie.contains(ingredientName)) { recipesTrie.add(ingredientName, node); } else { console.log('word already exist in tree!: ', ingredientName);} // most likely to happen
        });

        // process APPLIANCE and add to tree
        let recipeAppliance = recipe.appliance;
        recipeAppliance = checkString(recipeAppliance);
        recipeAppliance = checkStringIsSeveralWords(recipeAppliance);
        recipesTrie.setCurrentWord(recipeAppliance);
        recipesTrie.setCurrentRecipeObject(recipe);
        if ( !recipesTrie.contains(recipeAppliance)) { recipesTrie.add(recipeAppliance, node); } else { console.log('word already exist in tree!: ', recipeAppliance);} // less likely to happen


        // process each USTENSILS and add to tree
        let recipeUstensils = recipe.ustensils;
        recipeUstensils.forEach( ustensil => {
            
            ustensil = checkString(ustensil);
            ustensil = checkStringIsSeveralWords(ustensil);
            recipesTrie.setCurrentWord(ustensil);
            recipesTrie.setCurrentRecipeObject(recipe);
            if ( !recipesTrie.contains(ustensil)) { recipesTrie.add(ustensil, node); } else { console.log('word already exist in tree!: ', ustensil);} // most likely to happen
        });
        console.log('recipesTrie root=', recipesTrie.root);
    });
    console.log('TRIE PRINT===',recipesTrie.print());
    setCurrentTrie(recipesTrie);
    return recipesTrie;
}

let currentTrie;
function setCurrentTrie(trie) { currentTrie = trie; }
function getCurrentTrie() { return currentTrie; }


export function searchInTree(searchTerm) {

    let recipesTrie = getCurrentTrie();
    recipesTrie.searchInTrie(searchTerm);

}



