/* eslint-disable quotes */
// Trie.js - super simple JS implementation
// https://en.wikipedia.org/wiki/Trie
// https://github.com/joshjung/trie-search/blob/master/src/TrieSearch.js

// -----------------------------------------
const recipes = [
    { 'id': 1, 'name': 'limonade', 'time':10  },
    { 'id': 2, 'name': 'poisson Cru à la tahitienne', 'time':20 },
    { 'id': 3, 'name': 'mousse au chocolat', 'time':50 },
    { 'id': 2, 'name': 'poisson des iles', 'time':30 },
];



// create  =>  NEW MAP()
let searchTerm = 'lim';

// => make new tree from searchTerm:  
                                //    L 
                                //    |
                                //    I 
                                //    |
                                //    M 
// Each recipe : 
// search term in recipe.name
// search term in recipe.ingredients
// search term in recipe.ustensils


// IF MATCH FOUND :
// ex: MATCH :  'lim' => 'limonade'
// TREE add : 
                                //    O 
                                //    |
                                //    N 
                                //    |
                                //    A 
                                //    |
                                //    D
                                //    |
                                //    E
                        // -------------------        
                        // (end of this tree node) 
                        // -------------------   
        //   INSERT in MAP : { 'limonade' : [ {recipe} ] }

// continue search in each recipe.name
// every new match for word : 
// IF : same word => add recipe to 'limonade' map
// IF : different word 
// ex - 'lim ' => 'lime'
// 'lim' tree insert new node : 
                                //    L 
                                //    |
                                //    I 
                                //    |
                                //    M 
                                //    |
                                //    E <---
                        // -------------------        
                        // (end of this tree node) 
                        // -------------------  
        //   INSERT in MAP : { 'lime' : [ {recipe} ] }


class TrieNode {
    constructor(key) {
        this.key = key;
        this.parent = null;// we keep a reference to parent
        this.children = {};// we have hash of children
        this.end = false; // check to see if the node is at the end
        this.parentRecipeObjects = new Map(); // if 'isEnd' true  ( end of word) : store   word:KEY + array containing objects:VALUE
    }
    // iterate through the parents to get the word - time complexity: O(n) ( n = word length )
    getWord() {
        var output = [];
        var node = this;

        while (node !== null) {
            output.unshift(node.key);
            node = node.parent;
        }
        return output.join('');
    }
}
// -----------------------------------------

// implement Trie with just a simple root with null value.
class Trie {
    constructor() { this.root = new TrieNode(null); }
    // INSERT A WORD IN THE TRIE - time complexity: O(n) ( n = word length )
    insert(word) {
        console.log('WORD==', word);
        var node = this.root; // start at the root
        // for every character in the word
        for (var i = 0; i < word.length; i++) { // check to see if character node exists in children.
            if (!node.children[word[i]]) { // if it doesn't exist, we then create it.
                node.children[word[i]] = new TrieNode(word[i]); console.log('TrieNode word==',  node.children[word[i]]);
                // we also assign the parent to the child node.
                node.children[word[i]].parent = node;
            }
            // proceed to the next depth in the trie.
            node = node.children[word[i]];
            // finally, we check to see if it's the last word.
            if (i == word.length - 1) { // if it is, we set the end flag to true.
                node.end = true;
            }
        }
    }

    insertMore(word, value, node){
        node = this.root; // start at the root

        let wordArr = word.split('');
        let k = wordArr.shift(); // first element of wordArr
        node[k] = node[k] || {};

        for (var i = 0; i < wordArr.length; i++) { // check to see if character node exists in children.
            if (!node.children[wordArr[i]]) { // if it doesn't exist, we then create it.
                node.children[wordArr[i]] = new TrieNode(word[i]); console.log('TrieNode word==',  node.children[word[i]]);
                // we also assign the parent to the child node.
                node.children[wordArr[i]].parent = node;
            }
            // proceed to the next depth in the trie.
            node = node.children[wordArr[i]];
            // finally, we check to see if it's the last word.
            if (i == wordArr.length - 1) { // if it is, we set the end flag to true.
                node.end = true;
                node['value'] = node['value'] || []; // insert recipe object only 
                node['value'].push(value);
            }
        }
    }

    // check if it contains a whole word - time complexity: O(n) ( n = word length )
    contains(word) {
        var node = this.root;
        // for every character in the word
        for (var i = 0; i < word.length; i++) { // check to see if character node exists in children.
            if (node.children[word[i]]) { // if it exists, proceed to the next depth of the trie.
                node = node.children[word[i]];
            } else { // doesn't exist, return false since it's not a valid word.
                return false;
            }
        }
        // we finished going through all the words, but is it a whole word?
        return node.end;
    }
    // returns every word with given prefix - time complexity: O(p + n), p = prefix length, n = number of child paths
    find(prefix) {
        var node = this.root;
        var output = [];
        // for every character in the prefix
        for (var i = 0; i < prefix.length; i++) { // make sure prefix actually has words
            if (node.children[prefix[i]]) {
                node = node.children[prefix[i]];
            } else { // there's none. just return it.
                return output;
            }
        }
        // recursively find all words in the node
        findAllWords(node, output);
        return output;
    }
}

// recursive function to find all words in the given node.
function findAllWords(node, arr) { 
    if (node.end) { // base case, if node is at a word, push to output
        arr.unshift(node.getWord());
    }
    // iterate through each children, call recursive findAllWords
    for (var child in node.children) {
        findAllWords(node.children[child], arr);
    }
}

// -----------------------------------------

// instantiate our trie
// var trie = new Trie();

// trie.insert("hello");
// console.log(trie);
// trie.insert("helium");
// console.log(trie.contains("helium")); // true
//
// console.log(trie.find("hel")); // [ 'helium', 'hello' ]
//console.log(trie.find("hell")); // [ 'hello' ]

// var trie = new Trie();
// recipes.forEach(r => { trie.insert(r.name); console.log('trie======', trie);} );

// console.log(trie.contains("limonade"));
// console.log(trie.find('citron'));


let resultsMap = new Map();

/* export function trieSearch(searchTerm, recipes) {

    var trie = new Trie();
    trie.insert(searchTerm); // => make new tree from searchTerm  

    recipes.forEach(recipe => {    // Each recipe : 
        let recipeName = recipe.name;

        if ( !trie.contains(recipeName)) {      // if recipe name not in trie
            trie.insert(recipeName);            // add it to trie
        } else { 
            trie.find(recipeName);              // else return match
            resultsMap.set(recipeName, recipe); // + store name and recipe object into map
        }
        resultsMap.set(recipeName, recipe);
        console.log('resultsMap==', resultsMap);
        console.log('TRIE==', trie);
        return resultsMap;
    });
} */

var trieTest = new Trie();
let search = 'poi';
let search2 = 'limonade';
let search3 = 'choc';
let value1 = { 'id': 1, 'name': 'limonade', 'time':10  };
let value2 = { 'id': 3, 'name': 'mousse au chocolat', 'time':50 };
let value3 = { 'id': 2, 'name': 'poisson des iles', 'time':30 };

trieTest.insertMore(search,value1);
trieTest.insertMore(search2, value2);
trieTest.insertMore(search3, value3);
console.log('trietest:', trieTest);

console.log('trietest VALUE:', trieTest.root.value);
console.log('trietest Nodes:', trieTest.root);

debugger;



