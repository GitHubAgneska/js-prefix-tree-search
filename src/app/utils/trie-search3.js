
import {checkString, checkStringIsSeveralWords} from '../utils/process-api-data';


let id = 0;
class Node {
    constructor() {
        this.id = id++;
        this.keys = new Map(); // with : KEY:letter - VALUE:next node containing letter -> = all first letters of any new word
        this.parent = null;// we keep a reference to parent
        this.end = false;  // end of word ?
        this.setEnd = function () { this.end = true; };
        this.isEnd = function () { return this.end; };
        this.parentRecipeObjects = new Map(); // if 'isEnd' ( end of word) : store :  word:KEY + array containing objects:VALUE
        
        // this.isASubtree = this.keys.size > 1;

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
        // Match in tree is found : go to branch end or endS ===>  retrieve recipe(s) 
        this.goToLastNode = function goToLastNode(node) {
            // node is : a MAP Object { keys: Map(3), parent: null, end: false, setEnd: setEnd(), isEnd: isEnd(), parentRecipeObjects: Map(1), getWord: getWord(node) }
            // console.log('NODE STEM LETTER ==', currentNodeLetter);
            let originalStemNode = node; // where we left off in search: 3rd letter of matching = potential start for different words
            let currentNode = node; // where we left off in search: 3rd letter of matching
            let currentNodeValues = currentNode.keys; // node inner maps : letter : M ->  Object { keys: Map(3): E {} - O{} - .. }

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
        // --------------------------------------------------

        this.checkNextLetterInTrieMatches = function (searchterm, node) { // node = where the 1st matching letter was found

            if (node == undefined) { node = this.root; }
            searchterm = searchterm.substr(1, searchterm.length);
            
            while (searchterm.length > 0 ) {
                if (!node.keys.has(searchterm[0])) {
                    return 'aborting search for this node';
                } else {
                    node = node.keys.get(searchterm[0]); // place cursor on next matching node / letter
                    searchterm = searchterm.substr(1); // next letter of searchterm to check
                }
                return ( node.keys.has(searchterm) );
            }
        };

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
            return ( node.keys.has(word) && node.keys.get(word).isEnd() ); // true || false
        };
        // --------------------------------------------------
        // --------------------------------------------------

        this.findAllOccurencesOfSearchTermInTrie = function (searchterm, node) {
            let isRoot = true;

            if (node == undefined) { node = this.root; } // 1st time around: must start at root
            
            // 1 : FIND ALL OCCURENCES OF FIRST LETTER
            let firstLetter = searchterm[0]; console.log('LOOKING FOR LETTER: ', firstLetter.toUpperCase());
            let matchingNodesForLetter = this.findFirstLetter(firstLetter, node, isRoot);
            console.log('MATCHING NODES HERE:::',matchingNodesForLetter );

            // 2 : STARTING FROM EACH MATCHING NODE FOR 1ST LETTER : CHECK NEXT LETTER OF SEARCHTERM
            // matchingNodesForLetter.forEach( (node) => { for (const [key, value] of node.keys) { console.log(key,':',value)}});
        };


        
        let nodesMatch = [];

        this.goDeeper = function goDeeper(node, letter) {
            console.log('************ PASSED NODE ===', node, '----------------------');
            let currentMap = node; // node inner maps : letter : M ->  Object { keys: Map(3): E {} - O{} - .. }
            
            console.log('----------------------> GOING DEEPER : ');
            for (const [key, value] of currentMap.entries()) { // KEY==  m  :  VALUE===Object { keys: Map(1), parent: null, end: false, setEnd: setEnd(), isEnd: isEnd(), par
                
                console.log('CURRENT NODE KEY =====' , key,':', value, value.keys);
                let currentKey = key; // letter
                let currentValue = value; // map  // EX: KEY== m VALUE===Object { keys: Map(1), parent: null, end: false, setEnd: setEnd(), isEnd: isEnd(), parentRecipeObjects: Map(0), ...}
                
                if (currentKey !== letter) {
                    if (  currentValue.keys.size > 0 ) {
                        if ( currentValue.keys.has(letter)) {
                            let matchNode = currentValue.keys.get(letter);
                            console.log('WE HAVE A MATCH !! ############################ THIS KEY IS A MATCH,', matchNode.key, '===', letter,'PUSHING THIS NODE==>', matchNode);
                            nodesMatch.push(matchNode);
                            
                        } else {
                            console.log('---------------------->  GOING DEEPER AGAIN : ');
                            goDeeper(currentValue.keys);
                        }
                    } else { console.log(' -------- NO MORE KEYS TO CHECK HERE DUDE -----------'); }
                }
                else if (currentKey === letter) {
                    let matchNode = currentValue.keys.get(letter);
                    console.log('WE HAVE A MATCH !! ############################ THIS KEY IS A MATCH,', matchNode.key, '===', letter,'PUSHING THIS NODE==>', matchNode);
                    nodesMatch.push(matchNode);
                }
            }
            return nodesMatch;
        };

        let matchingNodesForLetter =[];
        let recipes = [];

        this.findFirstLetter = function findFirstLetter(firstLetter, node, isRoot) {
            let currentNodeValues = node.keys; // node inner maps : letter : M ->  Object { keys: Map(3): E {} - O{} - .. }
            
            if (currentNodeValues.size > 0) { 
                for (const [key, value] of currentNodeValues.entries()) { 
                    if (isRoot) {console.log('ROOT=================================================================');}else{
                        console.log('NOT ROOT=================================================================');
                    }
                    let currentNode = currentNodeValues, nodeLetter = key, nodeMap = value.keys;
                    
                    if ( nodeLetter !== firstLetter ) {
                        console.log('MAP OF:', nodeLetter,' :THIS LETTER IS NOT AT ROOT, BUT LOOKING IN ITS KEYS ::::::::::::::', nodeMap);
    
                        if (nodeMap.size > 0) {
                            for (const [key, value] of nodeMap.entries() ) {
    
                                let currentNode = nodeMap, nodeLetter = key, nodeMapInner = value.keys;
                                
                                if ( nodeLetter !== firstLetter ) {
                                    console.log('MAP OF:', nodeLetter,' : NOT A MATCH BUT LOOKING INSIDE ITS KEYS ------>');
                                    
                                    node = currentNode;
                                    isRoot = false;
                                    findFirstLetter(firstLetter, node, isRoot);
                                    this.goDeeper(node, firstLetter);

                                    
                                    
                                    continue; // go for the next key of map
    
                                } else if ( nodeLetter === firstLetter ) {
                                    let nodeOfMatchingLetter = currentNode.get(nodeLetter);
                                    console.log('WE HAVE A MATCH !!!!!!! ::::::::::::::THIS KEY IS A MATCH,', nodeLetter, '===', firstLetter, 'PUSHING THIS NODE==>',nodeLetter,':',nodeOfMatchingLetter );
                                    matchingNodesForLetter.push(nodeOfMatchingLetter); // store node where matching 1ST letter
                                    
                                    let res = this.goToLastNode(nodeOfMatchingLetter); // ===============> all words in trie CONTAINING this letter !
                                    console.log('============== /\n/ RES==========', res, '/\n/==================  ');
                                    recipes.concat(res);
                                    continue; // go for the next key of map : continue seacrhing for other occurences
                                }
                            }
                        } else { return; }
    
    
                    } else if ( nodeLetter === firstLetter ) {  // FIRST LETTER IS FOUND AT ROOT
                        let nodeOfMatchingLetter = currentNode.get(nodeLetter);
                        console.log('WE HAVE A MATCH IN ROOT !!!!!!! ******************* THIS KEY IS A MATCH,', nodeLetter, '===', firstLetter, 'PUSHING THIS NODE==>',nodeOfMatchingLetter );
                        matchingNodesForLetter.push(nodeOfMatchingLetter); // store node where matching 1ST letter
                        
                        let res = this.goToLastNode(nodeOfMatchingLetter); // ===============> all words in trie CONTAINING this letter !
                        console.log('******************* /\n/ RES *******************', res, '/\n/*******************  ');
                        recipes.concat(res);    
                        continue; // go for the next key of map : continue seacrhing for other occurences
                    }
                }
                console.log('ALL WORDS STARTING WITH or CONTAINING THIS LETTER===',recipes );// ===============> all WORDS in trie CONTAINING this letter !
                console.log('/\n/--------ALL MATCHING NODES FOR LETTER=====', matchingNodesForLetter); // ===============> all NODES in trie CONTAINING this letter !
                return matchingNodesForLetter;

            } else return; // node.keys === 0;
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
        let wordToProcessToTree;  // --------------------------------- | TO DO : optimize following using these
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


export function searchLetterInTrie(letter, searchterm, node){
    let recipesTrie = getCurrentTrie();
    recipesTrie.inspectWholeTrie(letter, searchterm, node);
}



export function findFirstLetter(searchterm){
    let recipesTrie = getCurrentTrie();
    recipesTrie.findAllOccurencesOfSearchTermInTrie(searchterm);
}