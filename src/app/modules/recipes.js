
import {RecipeFactory} from '../utils/recipe-factory';
import {SearchBar} from '../components/main-search-bar';
import {CollapsingMenu} from '../components/advanced-search-menu';
import {MenuListItem} from '../components/menu-listItem';
import {CardTemplate} from '../components/bootstrap-card';
import {HeaderBaseTemplate} from '../components/header';

import {treatUnits, checkDoublonsBeforeAddingToArray, checkString} from '../utils/process-api-data';
import {mapDataToTree, searchInTree, getTrieResults, getTrieSuggestions} from '../utils/trie-search4';
import {advancedSearch} from '../utils/search-algo';


/* ================================================== */
/* MODULE IN CHARGE OF ALL COMPONENTS + LOGIC */
/* ================================================== */

export const RecipeModule = (function() {
    
    // private part of module
    
    // define vars
    const root = document.querySelector('#root'); // where 'main' content will be hosted
    const localUrl = './assets/data.json';
    let localData;
    let recipes = []; // to store fetched data
    let recipesList = []; // to store all recipes (≠ previous)
    let ingredientsList = [];
    let appliancesList = [];
    let ustensilsList = [];
    let arrayOfCategoryElements = []; // to store the 3 previous lists

    let storedResults = [];  // local storage of results
    let storedSuggestions = []; // local storage of suggestions

    let advancedSearchRecipes = [];
    let advancedSearchResults = [];

    // SET-UP LOCAL STORAGE for all recipes array
    const myStorage = window.localStorage;

    // fetch all recipes
    fetch(localUrl)
    .then(response => {
        const contentType = response.headers.get('content-type');
        // console.log('contentType is==', contentType);
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError('no JSON content was found!'); }
            return response.json();
        })
        .then(data => {
            localData = data;
            localData.recipes.map(d => {recipes.push(d); });
            initDefaultView(recipes);
        })
        .catch(error => console.log(error));


    function initDefaultView(recipes) {
        const header = new HeaderBaseTemplate();
        document.body.insertBefore(header, root);
        setUpMainSearchBar();
        initData(recipes);
    }

    // set up main search bar
    function setUpMainSearchBar(){
        const searchBar = new SearchBar();
        root.appendChild(searchBar);
    }

    // cast retrieved data into local recipe model
    // each recipe contains an ingredients array, an appliance string, an ustensils array 
    function initData(recipes) {
        let recipeFactory = new RecipeFactory();

        // for each recipe of data, cast recipe into new recipe object
        recipes.forEach( recipe => {
            let newRecipe = recipeFactory.create(
                recipe.id,
                recipe.name,
                recipe.servings,
                recipe.ingredients,
                recipe.time,
                recipe.description,
                recipe.appliance,
                recipe.ustensils
            );
            // generate view for recipe
            generateRecipeCard(recipe);
            // set up CATEGORY MENU LISTS : DEFAULT ( = all recipes )
            updateCategoryLists(recipes); // returns arrayOfCategoryElements
            // all recipes casted, ordered as coming from api (default)
            recipesList.push(newRecipe);
        });
        // (will be used every time the page needs to display default view)
        myStorage.setItem('allRecipes',JSON.stringify(recipesList));

        // ADD ALL DATA TO TREE 
        mapDataToTree(recipes);

        setResults(recipesList);
        initAdvancedSearchSection();
        setUpAdvancedSearchView(arrayOfCategoryElements); // default == all recipes (= array of arrays [appliancesList, ustensilsList, ingredientsList])
    }

    // generate recipes list section
    const recipesListWrapper = document.createElement('section');
    recipesListWrapper.setAttribute('id', 'recipes-list');
    recipesListWrapper.setAttribute('class', 'row');
    
    function generateRecipeCard(recipe){
        let newRecipeCard = new CardTemplate(recipe);
        recipesListWrapper.appendChild(newRecipeCard);
        root.appendChild(recipesListWrapper);
    }



    // SEARCH FUNCTIONALITY : MAIN SEARCH ==================================================================================================
    // RETRIEVE current search term and call search method
    function processCurrentMainSearch(currentSearchTerm) {

        // resetSuggestionsBlock(); resetSearchArray(); resetSuggestedWords();

        // launch search in trie if 3 chars
        // reset for every new char
        if ( currentSearchTerm.length === 3 ) {

            // resetSuggestionsBlock();
            searchInTree(currentSearchTerm); // launch search in trie
            
            let resultsFromTrie = getTrieResults(); console.log('RESULTS FROM TRIE==', resultsFromTrie);
            let suggestionsFromTrie = getTrieSuggestions(); console.log('SUGGESTIONS FROM TRIE==', suggestionsFromTrie);
            setSuggestions(suggestionsFromTrie); // store suggestions for current searchterm
            setResults(resultsFromTrie);         // store results for current searchterm

            if ( suggestionsFromTrie || resultsFromTrie ) {
                processTrieSuggestions(suggestionsFromTrie);  // suggestionsFromTrie = array of maps (  { key: 'word' -> value: [ { recipe1 }, { recipe2 } ] }, { key: 'word' -> value: [ { recipe1 }, { recipe2 } ] } )
                processTrieResults(resultsFromTrie);                
                displaySearchResults(resultsFromTrie);
            
            } else {  // current 3 chars did not produce matches
                return;
            }
        } else  {return; }


    }

    // as received from trie : = array of nested maps ( where keys = matching words )
    function processTrieResults(results) {  
        let finalArrOfRecipes = [];
        results.forEach(map => {
            for ( let value of map.values() ){

                let recipesArray = value; console.log('MAP VALUE===', recipesArray); // array of objects
                recipesArray.forEach( recipeObj => {
                    if ( !finalArrOfRecipes.includes(recipeObj) ) {
                        finalArrOfRecipes.push(recipeObj);
                    }
                });
            }
        });
        setResults(finalArrOfRecipes);
        console.log('RECIPES ARRAY AS RECEIVED BY MODULE====',finalArrOfRecipes );
    }

    // as received from trie : SUGGESTIONS  = array of nested maps ( where keys = matching words + different endings )  )
    // to display a list of suggested words, each map key is sent to the UI list, 
    // if the word is then selected, its value (recipe(s)) is sent out in the results list to be displayed
    
    let allKeysOfCurrentSuggestions = [];   // keep track of all incoming suggested words
    let allValuesOfCurrentSuggestions = []; // and their linked recipes ( to remove doublons if needed )
    let allSuggestedRecipes = [];

    function processTrieSuggestions(suggestions) {
        
        // console.log('RESETTING KEYS AND VALUES OF SUGGESTIONS: ----  ');
        // allKeysOfCurrentSuggestions = [];
        // allValuesOfCurrentSuggestions = [];

        suggestions.forEach( map => {
            
            for ( let [key, value] of map.entries() ){

                addSuggestionInList(key, value);

                if ( !allKeysOfCurrentSuggestions.includes(key)) { allKeysOfCurrentSuggestions.push(key); }

                value.forEach(val => {  // ( value is an ARRAY of recipes objects )
                
                    // store all recipes for all suggested words : if user confirm word as is, all these recipes will be results
                    if ( !allValuesOfCurrentSuggestions.includes(val) ) {
                        allValuesOfCurrentSuggestions.push(val);
                    }
                });
            }
            console.log('ALL KEYS OF SUGGESTIONS ARE ==',allKeysOfCurrentSuggestions );
            console.log('ALL VALUES OF SUGGESTIONS ARE ==',allValuesOfCurrentSuggestions );
            setSuggestedResults(allValuesOfCurrentSuggestions);
        });
        resetSuggestedWords(); // reset suggestions data
    }
    let storedSuggestedResults;
    let setSuggestedResults = function( suggestedResults) { storedSuggestedResults = suggestedResults; };
    let getSuggestedResults = function() { return storedSuggestedResults; };

    // HANDLE SUGGESTIONS ---------------
    // for each new found suggestion, generate list item in suggestions wrapper
    let currentListOfWords = [];
    function addSuggestionInList(suggestion, suggestedRecipes){
        
        if ( !currentListOfWords.includes(suggestion) ) {

            currentListOfWords.push(suggestion); console.log('CURRENT LIST OF WORDS===',currentListOfWords);

            let newSuggestion = document.createElement('p');
            let newSuggestedWord = document.createTextNode(suggestion);
            newSuggestion.appendChild(newSuggestedWord);
    
            let suggestionsWrapper = document.querySelector('#main-suggestions');
            suggestionsWrapper.appendChild(newSuggestion);
    
            // handle selection of suggested word (both click and keydown)
            newSuggestion.addEventListener('click', function(event){ selectSuggestedWord(event,suggestedRecipes ); }, false);
            newSuggestion.addEventListener('keydown', function(event){ selectSuggestedWord(event, suggestedRecipes); }, false);
        
        } else { console.log('WORD IS IN LLIST ALREADY!'); } // word already is suggestions list
    }

    function selectSuggestedWord(event, suggestedRecipes) {
        let word = event.target.innerText; // text inside <p> element where event occurs
        let inputField = document.querySelector('#main-search-input');
        inputField.value = word; // make selected suggested word the current search word of input field
        
        // order display of list results for this word
        setResults(suggestedRecipes);
        displaySearchResults(suggestedRecipes);

        // reset / close suggestion list
        resetSuggestionsBlock(); //UI
        resetSuggestedWords(); // reset suggestions data
    }

    // case where user presses 'enter' in search bar 
    // -> if searchterm is partial => will display all recipes linked to all suggested words
    // 
    function confirmCurrentChars(event) {
        let suggested = getSuggestedResults();
        setResults(suggested);
        displaySearchResults(suggested);
    }


    // STORE results in the module, until display method needs them
    let setResults = function(results) { storedResults = results; };
    let getResults = function() { return storedResults; };

    // STORE suggestions in the module, until display method needs them
    let setSuggestions = function(suggestions) { storedSuggestions = suggestions; };
    let resetSuggestedWords = function () { return storedSuggestions = []; };
    let getSuggestions = function() { return storedSuggestions; };



    // suggestions list DOM should be reset at each new keystroke
    function resetSuggestionsBlock(parent){
        parent = document.querySelector('#main-suggestions');
        while (parent.firstChild) { parent.removeChild(parent.firstChild); }
        return parent;
    }

    // retrieve first word in suggestions list 
    // (for click event on search icon to update current search term to first suggestion)
    function retrieveFirstSuggestion() {
        let suggestionsList = getSuggestions();
        let firstSuggestion = suggestionsList[0];
        return firstSuggestion;
    }
    
    // reset method for resultsList or/and suggestions
    function resetSearchArray(arr){
        if (arr) { while( arr.length > 0  ) { arr.pop(); } // remove arr items
        } else { return; }
    }

    // reset all search
    function resetSearch(event) {
        window.location.reload();  // ------------- // TO REVIEW : TRIE should be CACHED 
    }

    function resetDefaultView() {
        let allrecipes = JSON.parse(myStorage.getItem('allRecipes' || '[]')); console.log('ALL RECIPES FROM LOCAL STORAGE==', allrecipes);
        setResults(allrecipes);
        displaySearchResults(allrecipes);
    }

    // DISPLAY RECIPE LIST BY SEARCH TERM ----------------
    // when an array of results for the search term is ready to be displayed in UI
        // 'ready' means: a suggestion has been selected
        // OR : user presses 'enter' or clicks 'submit' icon
    function displaySearchResults(results) {
        results = getResults();
        // store current list for advanced search to search into
        advancedSearchRecipes = getResults();
        // reset current list of recipes
        let recipesListWrapper = document.querySelector('#recipes-list');
        //reset recipes list wrapper
        while (recipesListWrapper.firstChild) { recipesListWrapper.removeChild(recipesListWrapper.firstChild); }
        // generate recipe elements to display based on new results
        results.forEach(recipe => { generateRecipeCard(recipe); });
        // set categories elements based on new results
        arrayOfCategoryElements = updateCategoryLists(results); // order advanced search menus update;
        // display categories elements in menus
        updateAdvancedSearchView(arrayOfCategoryElements); // = array of arrays [appliancesList, ustensilsList, ingredientsList]
    }

    // DISPLAY NO RESULTS MESSAGE
    let noResultsBlock = document.createElement('div');
    noResultsBlock.setAttribute('id', 'no-results-message');
    noResultsBlock.setAttribute('class','no-results-message' );
    let noResultsMessage = document.createTextNode('Pas de résultat pour la recherche!');
    noResultsBlock.appendChild(noResultsMessage);

    function displayNoResults() {
        const advancedSearchWrapper = document.querySelector('.adv-search-wrapper');
        root.insertBefore(noResultsBlock, advancedSearchWrapper);
    }
    function removeNoResults() {
        let noResultsBlock = document.querySelector('#no-results-message');
        if (root.contains(noResultsBlock)) { root.removeChild(noResultsBlock);}
    }

    // SEARCH FUNCTIONALITY : ADVANCED SEARCH ====================================================================================================================
    //  = based on DEFAULT OR SORTED LIST of recipes : components are generated accordingly

    // set up HOST SECTION for advanced search
    function initAdvancedSearchSection() {
        // set up wrapper for all 3 collapsing menus
        const advancedSearchWrapper = document.createElement('section');
        advancedSearchWrapper.setAttribute('class', 'adv-search-wrapper');
        root.insertBefore(advancedSearchWrapper, recipesListWrapper);
    }

    // ADVANCED SEARCH : CREATE CATEGORIES WRAPPERS  + CALL  CollapsingMenu COMPONENT TO POPULATE EACH CATEGORY
    // DEFAULT content = all recipes
    function setUpAdvancedSearchView(arrayOfCategoryElements){
        // ( arrayOfCategoryElements = [ingredientsList, appliancesList, ustensilsList] )
        // console.log('===>arrayOfCategoryElements==', arrayOfCategoryElements);
        const categoryNames = [ 'ingredients', 'appareils', 'ustensils'];
        const advancedSearchWrapper = document.querySelector('.adv-search-wrapper');
        // generate advanced search : button + menu CONTAINER for each category
        arrayOfCategoryElements.forEach( (category, index) => {
            let catName = categoryNames[index];
            // generate menu container for each category
            let catComponent = new CollapsingMenu(catName, category); // population of each menu container = done inside CollapsingMenu component
            advancedSearchWrapper.appendChild(catComponent);
        });
    }

    // SET UP or UPDATE CATEGORY LIST ELEMENTS
    // set up : all recipes / update : when search term in main search produces a list of recipes,
    // the categories menus lists are updated with corresponding recipes ingredients/appliances/ustensils
    function updateCategoryLists(recipes) {
        // first, reset menus lists from previous data
        ingredientsList = [];
        appliancesList = [];
        ustensilsList = [];
        arrayOfCategoryElements = [];

        // then for each recipe of results, retrieve elements for each category
        recipes.forEach( recipe => {

            // retrieve category elements : all ingredients
            const recipeIngr = recipe.ingredients;
            recipeIngr.forEach( item => {
                let currentIngredient = item.ingredient;
                currentIngredient = currentIngredient.toLowerCase();
                checkString(currentIngredient);

                treatUnits(item); // checkUnitType(item); ---- to review : exceptions !
                // check doublons before adding
                checkDoublonsBeforeAddingToArray(ingredientsList,currentIngredient);
            });

            // retrieve category elements : all appliances
            let currentAppliance = recipe.appliance;
            currentAppliance = currentAppliance.toLowerCase();
            // remove ponctuation, accents, 
            checkString(currentAppliance);
            // check doublons before adding
            checkDoublonsBeforeAddingToArray(appliancesList,currentAppliance);

    
            // retrieve category elements : all ustensils
            const recipeUst = recipe.ustensils;
            recipeUst.forEach(ust => {
                let currentUstensil = ust;
                currentUstensil = currentUstensil.toLowerCase();
                checkString(currentUstensil);
                // check doublons before adding
                checkDoublonsBeforeAddingToArray(ustensilsList,currentUstensil);
            });
        });
        arrayOfCategoryElements.push(ingredientsList,appliancesList, ustensilsList );
        return arrayOfCategoryElements;
    }

    // DISPLAY UPDATED CATEGORY LIST ELEMENTS
    function updateAdvancedSearchView(arrayOfCategoryElements) { // ( arrayOfCategoryElements = [ingredientsList, appliancesList, ustensilsList] )
        // get each category menu list to update
        const ingredientsListElement = document.querySelector('#ingredients-list');
        const appliancesListElement = document.querySelector('#appareils-list');
        const ustensilsListElement = document.querySelector('#ustensils-list');

        // destroy (reset) their current content
        const allMenus = [ ingredientsListElement, appliancesListElement, ustensilsListElement];
        allMenus.forEach(el => { 
            while (el.firstChild) { el.removeChild(el.firstChild); }
        });
        // inject new content : ingredients list
        arrayOfCategoryElements[0].forEach(el => { 
            let listELement = new MenuListItem(el);
            ingredientsListElement.appendChild(listELement);
            let categoryName = 'ingredients';
            listELement.addEventListener('click', function(event){ selectItemInList(event, categoryName); }, false);
        });
        // inject new content : ingredients list
        arrayOfCategoryElements[1].forEach(el => { 
            let listELement = new MenuListItem(el);
            appliancesListElement.appendChild(listELement);
            let categoryName = 'appareils';
            listELement.addEventListener('click', function(event){ selectItemInList(event, categoryName); }, false);
        });
        // inject new content : ingredients list
        arrayOfCategoryElements[2].forEach(el => { 
            let listELement = new MenuListItem(el);
            ustensilsListElement.appendChild(listELement);
            let categoryName = 'ustensils';
            listELement.addEventListener('click', function(event){ selectItemInList(event, categoryName); }, false);
        });
    }


    //  ======== !! TO REVIEW : REDEFINITION OF EXISTING METHOD in CollapsingMenu component : 
    // ISSUE = init categories lists items DEFAULT = done in component, BUT UPDATING categories lists items = done here in MODULE  ========= TO REVIEW 
    // handle select item in list : send it into input field
    function selectItemInList(event, categoryName) { 
        // console.log('categoryName===', categoryName);
        let word = event.target.innerText; // text inside <p> element where event occurs
        let btn = document.querySelector('#btn-'+categoryName);
        // activate field input 'artificially' via btn
        btn.click(event); 
        let inputField = document.querySelector('#searchInto-'+ categoryName);
        inputField.value = word; // make selected word the current search word of input field
    }

    function processAdvancedSearch(searchTerm, currentCategoryName) {
        // here, results come either from a sorted list (current results) or default api recipes list
        advancedSearchRecipes = RecipeModule.getResults();
        //console.log('currentListofResults IS ====', advancedSearchRecipes);
        advancedSearch(advancedSearchRecipes, searchTerm, currentCategoryName);
        advancedSearchResults = RecipeModule.getResults();
        displaySearchResults(advancedSearchResults);

    }

    // method used to close a menu if another one is called to open
    // everytime user clicks a menu open, checks if any other menu is open already,
    // and calls close if needed    
    function checkWhosOpen(){
        let allmenus = document.querySelectorAll('collapsing-menu-component');

        allmenus.forEach(menu => { 
            if (menu.getAttribute('isActive') === 'true'){
                let activeSibling = menu;
                let menuToCloseBtnClose = activeSibling.querySelector('#caret-up');
                menuToCloseBtnClose.click();
            }
        });
    }

    // PUBLIC PART OF MODULE
    return {
        processCurrentMainSearch: processCurrentMainSearch,
        confirmCurrentChars:confirmCurrentChars,
        addSuggestionInList: addSuggestionInList,
        resetSuggestionsBlock:resetSuggestionsBlock,
        resetSearchArray: resetSearchArray,
        resetSuggestedWords: resetSuggestedWords,

        setResults: setResults,
        getResults: getResults,
        setSuggestions: setSuggestions,
        retrieveFirstSuggestion: retrieveFirstSuggestion,
        displaySearchResults: displaySearchResults,
        processAdvancedSearch: processAdvancedSearch,
        checkWhosOpen:checkWhosOpen,
        resetSearch: resetSearch,
        displayNoResults:displayNoResults,
        removeNoResults:removeNoResults,
        resetDefaultView:resetDefaultView
        };
    
}());
