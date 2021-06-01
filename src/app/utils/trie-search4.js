
import {checkString, processIfSeveralWords} from '../utils/process-api-data';

// SET-UP LOCAL STORAGE FOR - all recipes array
const myStorage = window.localStorage;

let id = 0;
class Node {
    constructor() {
        this.id = id++;
        this.keys = new Map(); // with : KEY:letter - VALUE:next node containing letter -> = all first letters of any new word
        this.parent = null;// we keep a reference to parent
        
        this.wordIsComplete = false;  // end of A word - but might be more chars after it
        this.setEndOfAword = function () { this.wordIsComplete = true; };
        this.isEndOfAword = function () { return this.wordIsComplete; };
        
        this.isASubtree = false; // => this.keys.size > 1;
        this.setIsASubtree = function() { this.isASubtree = true;  this.isALeaf = false;};
        this.IsASubtree = function() { return this.isASubtree; };

        this.isALeaf = function() { return this.keys.size === 0; };  // => last node of a branch : node.keys.size === 0
        
        this.visited = false; // keep track of path when inspecting trie
        this.parentRecipeObjects = new Map(); // if 'isEnd' ( end of a word) : store :  word:KEY + array containing objects:VALUE

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

        // store objectsRecipe attached to nodes when retrieved
        let recipesForWord = [];
        let suggestions = [];

        // --------------------------------------------------
        // store current incoming word
        let fullWord = '';
        this.setCurrentWord = function(input) { fullWord = input; };
        this.getCurrentWord = function() { return fullWord; };

        // store current recipe object
        let currentRecipeObject;
        this.setCurrentRecipeObject = function(recipeObject) { currentRecipeObject = recipeObject; };
        this.getCurrentRecipeObject = function() { return currentRecipeObject; };
        
        // --------------------------------------------------
        // ADD A WORD - ( here, as iterating through all recipes to add words to the tree, also pass current recipe as param)
        this.add = function(input, node = this.root) {
            
            // NO MORE CHAR TO PROCESS : end of this WORD in trie
            if ( input.length === 0 ) { // end of word - fullWord must be complete
                node.setEndOfAword();
                let fullWord = this.getCurrentWord(); //  - ex : 'poudre' (from 'poudre d'amandes') -> mapped to recipe 'frangipane' 

                // case 1 : first time this word is added to tree:
                // parentRecipeObjects map has been created but is empty
                if ( !node.parentRecipeObjects.has(fullWord)){ // (fullword should be the key in this map)
                    // console.log('parentRecipeObjects does NOT have this key yet !==');
                    let arrOfRecipes = []; // set up array value to store recipes this word comes from
                    node.parentRecipeObjects.set(fullWord,arrOfRecipes); // set up map with : key:word - value: array of object recipes
                    // console.log('CURRENT WORD JUST ADDED==', fullWord);
                    let currentRecipe = this.getCurrentRecipeObject(); // console.log('RECIPE THIS WORD COMES FROM ==: ', currentRecipe);
                    arrOfRecipes.push(currentRecipe); // push recipe object word stems from
                    // console.log('NOW IN NODE RECIPES FOLDER ==:', node.parentRecipeObjects);
                
                // case 2 : the word does already exist in tree : parentRecipeObjects contains key with this word
                } else if (node.parentRecipeObjects.has(fullWord)){ // (check anyway)
                    // console.log('parentRecipeObjects DOES have this key !');
                    let folderOfRecipesKey = node.parentRecipeObjects.get(fullWord);

                    let currentRecipe = this.getCurrentRecipeObject();
                    folderOfRecipesKey.push(currentRecipe); // only push current recipe Object to array
                    // console.log('NOW IN NODE RECIPES FOLDER ==:', node.parentRecipeObjects);
                }
                return;

            // MORE CHAR TO PROCESS : each letter of input
            } else if (!node.keys.has(input[0])) { // key letter is not a node key yet
                node.keys.set(input[0], new Node()); // create it (= new map entry (key:letter, value: new node)
                // then add recursively all following letters to this node key
                return this.add(input.substring(1), node.keys.get(input[0]));  // ---- TO REVIEW : Substring iterates over a string in O(n) time. 2. Substring creates a copy of the string (because it is immutable). So it needs O(n) time for each iteration and O(n - 1) = O(n) space for each iteration, which makes it O(n^2) time and space complexity when adding.
                                                                               // ---  > use instead : array.split('') + iteration ( O(1) )
            
            } else { // key letter IS a node key already (node.keys.has(input[0])
            
                // if letter is a 'bifurcation' ( = root of a SUBTREE ) : retrieve current recipe object before going further => for suggestions
                if (node.keys.size > 1) {
                    node.setIsASubtree();
                    let currentRecipe = this.getCurrentRecipeObject();
                    let arrOfRecipes = []; // set up array value to store recipes this word is part of
                    
                    let currentInput = this.getCurrentWord();
                    // console.log('PARTIAL WORD ? ==', currentInput);
                    node.parentRecipeObjects.set(currentInput,arrOfRecipes);
                    arrOfRecipes.push(currentRecipe); // push recipe object word stems from
                }
                return this.add(input.substring(1), node.keys.get(input[0])); // add each following letter to existing node
            } 
        };

        // --------------------------------------------------
        // CHECK WORD IS IN TRIE -> used to map data into tree ONLY
        this.contains = function(word) {
            let node = this.root;
            while (word.length > 1 ) {
                if (!node.keys.has(word[0])) {
                    return false;
                } else {
                    node = node.keys.get(word[0]); // place cursor on matching (map) letter of root
                    word = word.substr(1); // next letter of word to check
                }
            }
            return ( node.keys.has(word) && node.keys.get(word).isEndOfAword() ); // true || false
        };

        // -------------------------------------------------
        // HELPER function : SHOW all words entered in tree
        this.print = function() {
            let allwordsOfTree = new Array();
            let search = function(node, str) {
                if (node.keys.size !== 0 ) {
                    for (let letter of node.keys.keys()) { // node's letter child
                        search(node.keys.get(letter), str.concat(letter)); // check each node letter - and retrieve
                    }
                    if (node.isEndOfAword()) allwordsOfTree.push(str); allwordsOfTree.push(node.parentRecipeObjects);

                } else { str.length > 0 ? allwordsOfTree.push(str) : undefined; return; }
            };
            search(this.root, new String());
            return allwordsOfTree.length > 0? allwordsOfTree: null;
        };
                
        // --------------------------------------------------
        // SEARCH term in trie
        this.searchElementInTrie = function(searchterm) {
            console.log('we are looking for==,', searchterm);
            let node;
            let lastMatchingNode;
            let currentlyFound = '';
            let completeWords = [];
            let suggestions = [];

            if (node === undefined) { node = this.root; }

            let arrFromSearchterm = searchterm.split('');
            for ( let i=0; i < arrFromSearchterm.length; i++ ) {

                let currentLetterSearching = arrFromSearchterm[i];
                
                if (node.keys.has(currentLetterSearching)) {
                    node = node.keys.get(currentLetterSearching);
                    currentlyFound += currentLetterSearching; console.log('CURRENTLY FOUND==', currentlyFound);

                    if ( i >= 2 ) { 
                        if (node.parentRecipeObjects.size > 0) { completeWords.push(node.parentRecipeObjects); }  // only COMPLETE WORDS : 'coco' => won't get 'cocotte'
                        console.log('CURRENT completeWords==', completeWords);
                        this.setTrieResults(completeWords);

                        lastMatchingNode = node; 
                        suggestions = this.goToLastNode(lastMatchingNode); // inspect different endings: 'coco' => should get 'cocotte'
                        this.setTrieSuggestions(suggestions);
                        console.log('SUGGESTIONS WOULD BE ===', suggestions); 
                    }
                }
                else { return 'sorry no match for ' + searchterm;  }
            }
            searchterm = '';
        };

        // --------------------------------------------------
        // Match in tree is found : go to branch end or endS ===>  retrieve recipe(s) 
        let nextNode, nextLetter;
        this.goToLastNode = function goToLastNode(node) {
            // console.log(' LAST MATCHING NODE===', node);// node is : a MAP Object { keys: Map(3), parent: null, end: false, setEnd: setEnd(), isEnd: isEnd(), parentRecipeObjects: Map(1), getWord: getWord(node) }
            
            // NODE cases:
            // node.wordIsComplete => get recipesParentMap AND go to next node
            // node.isALeaf => get recipesParentMap
            // node.isASubtree => for each key of keys : go to end ( end is : node === isALeaf  OR  === wordIsComplete )
            if (node.keys.size >= 1 ) {
                // console.log('THIS NODE IS A SUBTREE, PARENT recipes OBJ ===',node.parentRecipeObjects );
                for (const [key, value] of node.keys) {
                    nextNode = value; nextLetter = key;
                    // console.log('NEXT LETTER: ', nextLetter, 'NEXT NODE: ',nextNode );
                    goToLastNode(nextNode);
                }
            }
                
            if (node.parentRecipeObjects.size > 0) { 
                if ( !suggestions.includes(node.parentRecipeObjects.has(node.parentRecipeObjects.key)) ) {  //----- WORKS ?
                    suggestions.push(node.parentRecipeObjects); 
                }
            }
            console.log('suggestions FOR THIS WORD==',suggestions );
            return suggestions;
        };

        // --------------------------------------------------
        // STORE results of search
        this.setTrieResults = function(results) { this.results = results; };
        this.resetTrieResults = function () { return this.results = []; };
        this.getTrieResults = function () { return this.results; };

        this.setTrieSuggestions = function(suggestions) { this.suggestions = suggestions; };
        this.resetTrieSuggestions = function () { return this.suggestions = []; };
        this.getTrieSuggestions = function () { return this.suggestions; };
    }
}



// MAPPING ALL INCOMING DATA TO TREE
// --------------------------------------------------
export function mapDataToTree(recipes) {

    let recipesTrie = new Trie();

    recipes.forEach(recipe => {
        
        let node;
        let wordToProcessToTree;  // --------------------------------- | TO DO : optimize following using these
        let isArray = wordToProcessToTree instanceof Array; // ------- | <<--
        
        // process NAME and add to tree
        let recipeName = recipe.name;
        recipeName = checkString(recipeName);                       // remove punctuation/ accents/ make lowercase   
        let recipeNameWords = processIfSeveralWords(recipeName);    // => [ 'mousse', 'au', 'chocolat', 'mousse-au-chocolat' ]
        recipesTrie.setCurrentWord(recipeName);                     // stored to be used when adding to trie last node
        recipesTrie.setCurrentRecipeObject(recipe);                 // same
        // add each word of name if several words length + hyphened version
        recipeNameWords.forEach( word => { recipesTrie.add(word, node); // console.log(word, ':ADDED!***************');
        });
        

        // process each INGREDIENT and add to tree
        let recipeIngredients = recipe.ingredients;
        recipeIngredients.forEach(item => {
            let ingredientName = item.ingredient; // = ingredient.name
            ingredientName = checkString(ingredientName);           
            let ingredientNameWords = processIfSeveralWords(ingredientName); // console.log('ingredientNameWords=', ingredientNameWords);
            recipesTrie.setCurrentWord(ingredientName);
            recipesTrie.setCurrentRecipeObject(recipe);
            ingredientNameWords.forEach(word => {recipesTrie.add(word, node); // console.log(word, ':ADDED!***************');
            });
        });

        // process APPLIANCE and add to tree
        let recipeAppliance = recipe.appliance;
        recipeAppliance = checkString(recipeAppliance);
        let recipeApplianceWords = processIfSeveralWords(recipeAppliance);
        recipesTrie.setCurrentWord(recipeAppliance);
        recipesTrie.setCurrentRecipeObject(recipe);
        recipeApplianceWords.forEach(word => { recipesTrie.add(word, node); // console.log(word, ':ADDED!***************');
        });

        // process each USTENSILS and add to tree
        let recipeUstensils = recipe.ustensils;
        recipeUstensils.forEach( ustensil => {
            ustensil = checkString(ustensil);
            let ustensilWords = processIfSeveralWords(ustensil);
            recipesTrie.setCurrentWord(ustensil);
            recipesTrie.setCurrentRecipeObject(recipe);
            ustensilWords.forEach( word => {  recipesTrie.add(word, node); // console.log(word, ':ADDED!***************');
            });
        });
        // console.log('recipesTrie root=', recipesTrie.root);
    });
    // console.log('TRIE PRINT===',recipesTrie.print());
    setCurrentTrie(recipesTrie);
    return recipesTrie;
}

let currentTrie;
function setCurrentTrie(trie) { currentTrie = trie; myStorage.setItem('recipesTrie', currentTrie); }
function getCurrentTrie() { return currentTrie; }


export function searchInTree(searchTerm) {

    let recipesTrie = getCurrentTrie();
    recipesTrie.searchElementInTrie(searchTerm);
}

export function getTrieResults() {
    let recipesTrie = getCurrentTrie();
    return recipesTrie.getTrieResults();
}
export function getTrieSuggestions() {
    let recipesTrie = getCurrentTrie();
    return recipesTrie.getTrieSuggestions();
}

