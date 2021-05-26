
import {checkString, processIfSeveralWords} from '../utils/process-api-data';


let id = 0;
class Node {
    constructor() {
        this.id = id++;
        this.keys = new Map(); // with : KEY:letter - VALUE:next node containing letter -> = all first letters of any new word
        this.parent = null;// we keep a reference to parent
        
        this.wordIsComplete = false;  // end of A word - but might be more chars after it
        this.setEndOfAword = function () { this.endOfAword = true; };
        this.isEndOfAword = function () { return this.endOfAword; };
        
        this.isASubtree = false; // => this.keys.size > 1;
        this.setIsASubtree = function() { this.isASubtree = true; };
        this.IsASubtree = function() { return this.isASubtree; };

        this.isALeaf = false; // => last node of a branch : node.keys.size === 0
        this.setIsALeaf = function() { this.isALeaf = true; };
        this.IsALeaf = function() { return this.isALeaf; };
        
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
                    console.log('parentRecipeObjects does NOT have this key yet !==');
                    let arrOfRecipes = []; // set up array value to store recipes this word comes from
                    node.parentRecipeObjects.set(fullWord,arrOfRecipes); // set up map with : key:word - value: array of object recipes
                    console.log('CURRENT WORD JUST ADDED==', fullWord);
                    let currentRecipe = this.getCurrentRecipeObject(); console.log('RECIPE THIS WORD COMES FROM ==: ', currentRecipe);
                    arrOfRecipes.push(currentRecipe); // push recipe object word stems from
                    console.log('NOW IN NODE RECIPES FOLDER ==:', node.parentRecipeObjects);
                
                // case 2 : the word does already exist in tree : parentRecipeObjects contains key with this word
                } else if (node.parentRecipeObjects.has(fullWord)){ // (check anyway)
                    console.log('parentRecipeObjects DOES have this key !');
                    let folderOfRecipesKey = node.parentRecipeObjects.get(fullWord);

                    let currentRecipe = this.getCurrentRecipeObject();
                    folderOfRecipesKey.push(currentRecipe); // only push current recipe Object to array
                    console.log('NOW IN NODE RECIPES FOLDER ==:', node.parentRecipeObjects);
                }
                return;

            // MORE CHAR TO PROCESS : each letter of input
            } else if (!node.keys.has(input[0])) { // key letter is not a node key yet
                node.keys.set(input[0], new Node()); // create it (= new map entry (key:letter, value: new node)
                // then add recursively all following letters to this node key
                return this.add(input.substring(1), node.keys.get(input[0]));  // ---- TO REVIEW : Substring iterates over a string in O(n) time. 2. Substring creates a copy of the string (because it is immutable). So it needs O(n) time for each iteration and O(n - 1) = O(n) space for each iteration, which makes it O(n^2) time and space complexity when adding.
                                                                               // ---  > use instead : array.split('') + iteration ( O(1) )
            
            } else { // key letter IS a node key already (node.keys.has(input[0])
            
                // if letter is a 'bifurcation': root of a SUBTREE : should retrieve current recipe object before going further => for suggestions
                if (node.keys.size > 1) {
                    this.setIsASubtree;
                    let currentRecipe = this.getCurrentRecipeObject();
                    let arrOfRecipes = []; // set up array value to store recipes this word is part of
                    
                    let currentInput = this.getCurrentWord();
                    console.log('PARTIAL WORD==', currentInput);
                    // node.getWord(node); console.log('PARTIAL WORD==', currentPartialWord);
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
        // HELPER function : show all words entered in tree
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
        // Search element in trie : term, letter, value, ..
        this.searchElementInTrie = function(searchterm) {
            console.log('el we are looking for==,', searchterm);
            let node;
            let currentNodeLetter;
            let lastMatchingNode;
            let searchingFor = '';

            if (node === undefined) { node = this.root; }

            while (searchterm.length > 1) {
                
                currentNodeLetter = searchterm[0];
                if (!node.keys.has(currentNodeLetter)) {
                    return 'Sorry no match for' + currentNodeLetter ;
                } else {
                    node = node.keys.get(currentNodeLetter); // place cursor on matching (map) letter of root
                    console.log('MATCHING SO FAR:', currentNodeLetter);
                    searchingFor += currentNodeLetter; // store letter
                    if (searchingFor.length > 3) {
                        this.goToLastNode(node, currentNodeLetter); // node = where the 3rd matching letter is : go find end(s) for this match
                    }
                    searchterm = searchterm.substr(1); // next letter of word to check
                }
            }            
        };

       /*  this.goToLastNode = function goToLastNode(node, currentNodeLetter) {
            console.log(' LAST MATCHING NODE===', currentNodeLetter, ':', node);// node is : a MAP Object { keys: Map(3), parent: null, end: false, setEnd: setEnd(), isEnd: isEnd(), parentRecipeObjects: Map(1), getWord: getWord(node) }
            
            // NODE cases:
            // node.wordIsComplete => get recipesParentMap AND go to next node
            // node.isALeaf => get recipesParentMap
            // node.isASubtree => for each key of keys : go to end (node === isALeaf  OR  === wordIsComplete )

            

            let currentNodeKeys = node.keys;
            
            if (currentNodeKeys.size > 1) { 
                this.setIsASubtree = true;
                console.log('THIS NODE IS A SUBTREE:', currentNodeKeys);
                for (const mapNode of currentNodeKeys) {
                    console.log('going there now: ', mapNode);
                    goToLastNode(mapNode);
                }
            } else { console.log('THIS NODE IS NOT A SUBTREE:', currentNodeKeys);
                if ( node.end) {
                    console.log('END of branch');
                    recipesForWord.push(node.parentRecipeObjects); // =  map containing 0 to n objects
                    console.log('recipesForWord==', recipesForWord);
                    return recipesForWord; // = array of maps containing 0 to n objects
                } else { 
                    node = node.keys[0];
                    goToLastNode(node);
                }
            }
            console.log('RECIPES FOR THIS WORD==',recipesForWord );
            return recipesForWord;
        }; */

        // Match in tree is found : go to branch end or endS ===>  retrieve recipe(s) 
        this.goToLastNode = function goToLastNode(node, currentNodeLetter) {
            // node is : a MAP Object { keys: Map(3), parent: null, end: false, setEnd: setEnd(), isEnd: isEnd(), parentRecipeObjects: Map(1), getWord: getWord(node) }
            // console.log('NODE STEM LETTER ==', currentNodeLetter);
            let originalStemNode = node; // where we left off in search: 3rd letter of matching = potential start for different words
            let currentNode = node; // where we left off in search: 3rd letter of matching
            let currentNodeValues = currentNode.keys; // node inner maps : letter : M ->  Object { keys: Map(3): E {} - O{} - .. }

            // NODE cases:
            // node.wordIsComplete => get recipesParentMap AND go to next node
            // node.isALeaf => get recipesParentMap
            // node.isASubtree => for each key of keys : go to end (node === isALeaf  OR  === wordIsComplete )

            // go further for this node letter : M  -> next : E -> next: O
            let goFurther = function goFurther(currentNode) { 
                for (const [key, value] of currentNodeValues.entries()) {
                    goDeeper(currentNodeValues);
                }
            };
            // go deeper for this node letter : E - enter 'E' keys (if any) / then enter 'O' keys ( -> 'N' )
            let goDeeper = function goDeeper(currentNodeValues) {
                for (const [key, value] of currentNodeValues.entries()) { // for each inner map (letter) of node : L-I-M  -e   / - o
                    
                    let currentKey = key; // letter
                    let currentValue = value; // map  // EX: KEY== m VALUE===Object { keys: Map(1), parent: null, end: false, setEnd: setEnd(), isEnd: isEnd(), parentRecipeObjects: Map(0), ...}
                    
                    if (value.end) { // end of branch for this match : L-I-M -- -> E
                        console.log('END of branch');
                        recipesForWord.push(value.parentRecipeObjects); // =  map containing 0 to n objects
                        // console.log('recipesForWord==', recipesForWord);
                        return recipesForWord; // = array of maps containing 0 to n objects
                        
                    } else { // else go deeper until finding end
                        goDeeper(currentValue.keys);
                    }
                }
            };
            goFurther(originalStemNode);
            console.log('RECIPES FOR THIS WORD==',recipesForWord );
            return recipesForWord;
        };
    }
}


// helper preventing adding single chars (follwed or preceded with whitespace) - ex : 'a '
const isASingleChar = function(str) { return (str.length === 2 && (/\s/).test(str)); };
const isAnArticle = /(?:(au|le|la|de|du) +)/g;
// const isAnArticle = /(?:(au|le|la|de|du|[(a|l|d)\s]) +)/g;  // --------------- TO REVIEW to match single char articles

// MAPPING ALL INCOMING DATA TO TREE
// --------------------------------------------------
export function mapDataToTree(recipes) {

    let recipesTrie = new Trie();

    recipes.forEach(recipe => {
        
        let node;
        let wordToProcessToTree;  // --------------------------------- | TO DO : optimize following using these
        let isArray = wordToProcessToTree instanceof Array; // ------- |
        
        // process NAME and add to tree
        let recipeName = recipe.name;
        recipeName = checkString(recipeName);  // remove punctuation/ accents/ make lowercase   
        let recipeNameWords = processIfSeveralWords(recipeName); // => [ 'mousse', 'au', 'chocolat', 'mousse-au-chocolat' ]

        recipesTrie.setCurrentWord(recipeName);     // stored to be used when adding to trie last node
        recipesTrie.setCurrentRecipeObject(recipe);
        // add each word of name if several words length + hyphened version
        recipeNameWords.forEach( word => { recipesTrie.add(word, node); console.log(word, ':ADDED!***************');
            /* if ( !recipesTrie.contains(word) && ( !isAnArticle.test(word) )) { 
                recipesTrie.add(word, node); console.log(word, ':ADDED!***************'); 
            } else { // word is already in trie BUT we still need to add the recipe it comes from
                console.log('word already exist in tree! ', word);
                
            } // less likely to happen */
        });
        

        // process each INGREDIENT and add to tree
        let recipeIngredients = recipe.ingredients;
        recipeIngredients.forEach(item => {
            let ingredientName = item.ingredient; // = ingredient.name
            ingredientName = checkString(ingredientName); console.log('ingredientName=', ingredientName);
            
            let ingredientNameWords = processIfSeveralWords(ingredientName); console.log('ingredientNameWords=', ingredientNameWords);
            recipesTrie.setCurrentWord(ingredientName);
            recipesTrie.setCurrentRecipeObject(recipe);
            
            ingredientNameWords.forEach(word => {recipesTrie.add(word, node); console.log(word, ':ADDED!***************');
                // if ( !recipesTrie.contains(word) && (!isAnArticle.test(word))) { recipesTrie.add(word, node); console.log(word, ':ADDED!***************'); } else { console.log('word already exist in tree!: ', word);} // most likely to happen
            });
        });

        // process APPLIANCE and add to tree
        let recipeAppliance = recipe.appliance;
        recipeAppliance = checkString(recipeAppliance);
        let recipeApplianceWords = processIfSeveralWords(recipeAppliance);
        recipesTrie.setCurrentWord(recipeAppliance);
        recipesTrie.setCurrentRecipeObject(recipe);
        recipeApplianceWords.forEach(word => { recipesTrie.add(word, node);console.log(word, ':ADDED!***************'); 
            // if ( !recipesTrie.contains(word)&& (!isAnArticle.test(word))) { recipesTrie.add(word, node);console.log(word, ':ADDED!***************'); } else { console.log('word already exist in tree!: ', word);} // less likely to happen
        });


        // process each USTENSILS and add to tree
        let recipeUstensils = recipe.ustensils;
        recipeUstensils.forEach( ustensil => {
            ustensil = checkString(ustensil);
            let ustensilWords = processIfSeveralWords(ustensil);
            recipesTrie.setCurrentWord(ustensil);
            recipesTrie.setCurrentRecipeObject(recipe);
            ustensilWords.forEach( word => {  recipesTrie.add(word, node); console.log(word, ':ADDED!***************');
                // if ( !recipesTrie.contains(word)&& (!isAnArticle.test(word))) { recipesTrie.add(word, node); console.log(word, ':ADDED!***************');} else { console.log('word already exist in tree!: ', word);} // most likely to happen
            });
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
    recipesTrie.searchElementInTrie(searchTerm);
}

