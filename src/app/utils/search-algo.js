import {RecipeModule} from '../modules/recipes';
import {checkString} from '../utils/process-api-data';

let resultsList = []; // list of recipes matching search
let suggestions = []; // list of suggested words matching search
let advancedSearchResults = []; // list of recipes matching advanced search

// MAIN SEARCH ======================================================================================================
// search term in recipes list
export function search(recipes, searchterm) {
    resultsList = [];suggestions = []; // reset these 2 at every new keystroke
    RecipeModule.resetSuggestions(); // reset displayed suggestions list

    recipes.forEach( recipe => {
        searchInName(recipe, recipe.name, searchterm); // search term in each recipe name
        searchInDescription(recipe, recipe.description, searchterm); // search term in each recipe description
        searchInIngredients(recipe, recipe.ingredients, searchterm); // search term in each recipe ingredients
    });
    // console.log('results=====',resultsList );
    // console.log('CURRENT suggestions for word ==', suggestions);
    if (resultsList.length > 0) {
        RecipeModule.setResults(resultsList); // return updated results array to Module
    } else { 
        RecipeModule.displayNoResults();
        return; // stop search
    }
    if ( suggestions.length > 0 ) {
        RecipeModule.setSuggestions(suggestions); // return updated suggestions list array to Module
        } else { return;
    }
}

// search in each recipe name
function searchInName(recipe, name, searchterm){

    let arrayFromName = name.toLowerCase().split(' ');  // 'Soupe de concombre' => [ 'soupe', 'de', 'concombre' ]
    // search match in each word of the name (or in word if name = one word)
    arrayFromName.filter(word => { 
        // if part of a word in array matches current searchterm 
        // ex : searchterm = 'soup' - => should match 'soupe' in [ 'soupe', 'de', 'concombre' ]
            if (word.includes(searchterm)) { 
                // console.log(' searching for ==', searchterm, 'match in name is==', word);

                // (if not there already) store suggestion in array : all words beginning with these letters
                if ( !suggestions.includes(word)) {
                    // CASE ONE - suggest word : search 'soup' will suggest 'soupe', not 'soupe de concombre' 
                    suggestions.push(word);

                    // CASE 2 - - suggest whole name : search 'soup' will suggest 'soupe de concombre', 'soupe de radis' etc
                    // suggestions.push(name);

                    // delegate suggestion to module to display it
                    RecipeModule.addSuggestionInList(word);
                }
                if ( !resultsList.includes(recipe)){  // prevents multiple addings when user continues typing word that has already been found - ideally, search should stop if matches are found?
                    resultsList.push(recipe); // store recipes in array: all recipes names  containing these letters
                }
            }
    });
    return resultsList;
}

// in description, we need to retrieve matching ingredients, and skip verbs
// ex : 'poi' => should find 'poivre' and skip 'poivrez'
// + skip ',' in 'poivre,'
function searchInDescription(recipe, description, searchterm){

    let arrayFromDesc = description.toLowerCase().split(' ');  // 'Eplucher les concombres, poivrez, ' => [ 'eplucher', 'les', 'concombres', 'poivrez,' ,  ]
    // search match in each word of the description
    arrayFromDesc.filter(word => {
        // identify verbs to skip ( words ending with 'er' or 'ez' + eventually comma/period )
        let isAverbRegex = /e(z|r)+(\.?|,?)$/i;
        // identify other words ending with comma/period = NOT to skip
        let endsWithCommaOrPeriodRegex = /\.|,$/i;

        // if part of a word in array matches current searchterm 
        // ex : searchterm = 'concomb' - => should match 'concombre' in [ 'eplucher', 'les', 'concombres' ]
        
        // if word includes searchterm and is not a verb
        if ( word.includes(searchterm) && !(isAverbRegex.test(word))) {
            // console.log(' searching for ==', searchterm, 'match in description is==', word);
            // if matching word ends with comma/period : remove them ()
            if ( endsWithCommaOrPeriodRegex.test(word) ) {
                // console.log('should be corrected: ', word);
                return word.substring(0, word.length-1); 
            }
            // (if not there already) store suggestion in array : all words beginning with these letters
            if ( !suggestions.includes(word)) {
                // CASE ONE - suggest word : search 'soup' will suggest 'soupe', not 'soupe de concombre' 
                suggestions.push(word);
                // delegate suggestion to module to display it
                RecipeModule.addSuggestionInList(word);
            }
            // prevent multiple addings when user continues typing word that has already been found - ideally, search should stop if matches are found?
            if ( !resultsList.includes(recipe)){
                resultsList.push(recipe); // store recipes in array: all recipes whose description contain serach term
            }
        }
    });
    return resultsList;
}

function searchInIngredients(recipe, recipeIngredients, searchterm){
    // recipe ingredients is an array of objects
    // match search occurs in 1st key/value of each object (ignoring rest of ingredients key/values : 'unit' and 'quantity')  
    // ex : recipe.ingredients :[ { 'ingredient':'concombre'}, { 'ingredient':'citron'} ]
    recipeIngredients.forEach( item => {  // for each ingredient object of ingredients array
        for (const [key, value] of Object.entries(item) ) { // for each key:value of ingredient object
            if (key === 'ingredient') {
                let ingredientName = value.toLowerCase();
                // ingredientName can be one word or several words
                if ( ingredientName.includes(searchterm) ) {
                    if ( !suggestions.includes(ingredientName)) {
                        // CASE ONE - suggest word : search 'lait' will not suggest 'chocolat au lait' 
                        suggestions.push(ingredientName);
                        // delegate suggestion to module to display it
                        RecipeModule.addSuggestionInList(ingredientName);
                    }
                    // prevent multiple addings when user continues typing word that has already been found - ideally, search should stop if matches are found?
                    if ( !resultsList.includes(recipe)){
                        resultsList.push(recipe); // store recipes in array: all recipes whose description contain serach term
                    }
                }
            }
        }
    });
    return resultsList;
}

// ADVANCED SEARCH ======================================================================================================

// after a search via main search bar is completed and a list of recipes is displayed OR main search was not used so displayed list = all recipes,
// the advanced search in the 3 categories will apply a NEW SEARCH but this time ON THE CURRENT LIST of results

// - ex : main search was 'chocolat' => results = all recipes containing 'chocolat'  => categories display: results' category elements 
// THEN:  user selects 'fraise' in the ingredients category => 'fraise' is then searched within the current results list of recipes
// BUT : here, match needs to accept several words
// => UI displays only recipes containing both 'chocolat' and 'fraise'
// THEN: everytime user selects a new word in the remaining elements of catogories => a new search occurs on the current list of results

export function advancedSearch(currentResults, searchTerm, currentCategoryName){

    console.log('AVDVANCED SEARCH: SEARCHTERM ====> ', searchTerm);
    searchTerm = checkString(searchTerm);
    advancedSearchResults = []; // reset results
    // console.log('currentResults where to search===', currentResults);
    // console.log('currentCategoryName===', currentCategoryName);
    if (currentCategoryName === 'appareils') { currentCategoryName = 'appliance'; }
    // in the array of current recults, 
    currentResults.forEach( currentRecipe => {
        for (const key of Object.keys(currentRecipe)) { // iterate over each key of recipe object
            if (key === currentCategoryName ) {   //  find the category current searchterm comes from
                // console.log('currently SEARCHING IN ===', key);
                // SEARCH IN INGREDIENTS  = array of objects
                if (key === 'ingredients') {
                    let recipeIngredients = currentRecipe.ingredients;
                    recipeIngredients.forEach( item => {  // for each ingredient object of ingredients array     
                        for (const [key, value] of Object.entries(item) ) { // for each key:value of ingredient object
                            if (key === 'ingredient') { // console.log('key====', key );
                                let ingredientName = checkString(value);  // console.log('value====', ingredientName ); console.log('searchTerm====', searchTerm );   
                                
                                if ( ingredientName === searchTerm  || ingredientName.includes(searchTerm)  ) {
                                    // prevent multiple addings when user continues typing word that has already been found - ideally, search should stop if matches are found?
                                    if ( !advancedSearchResults.includes(currentRecipe)){
                                        advancedSearchResults.push(currentRecipe); // store recipes in array: all recipes whose description contain serach term
                                    }
                                }
                            }
                        }
                    });
                    return advancedSearchResults;
                }
                // SEARCH IN APPLIANCES = strings
                if (key === 'appliance') {
                    let recipeAppliance = currentRecipe.appliance;
                    recipeAppliance = checkString(recipeAppliance);  // console.log('value====', ingredientName ); console.log('searchTerm====', searchTerm );   
                    // console.log('appliance VALUE ==', recipeAppliance);
                    if ( recipeAppliance === searchTerm || recipeAppliance.includes(searchTerm)) {
                        if ( !advancedSearchResults.includes(currentRecipe)){
                            advancedSearchResults.push(currentRecipe); // store recipes in array: all recipes whose description contain serach term
                        }
                    }
                    return advancedSearchResults;
                }
                // SEARCH IN USTENSILS = array of strings
                if (key === 'ustensils') {
                    let recipeUstensils = currentRecipe.ustensils;
                    // console.log('ustensil VALUE ==', recipeUstensils);
                    recipeUstensils.forEach( item => {  // for each ustensil string of ustensils array
                        item = checkString(item);
                        if ( item === searchTerm || item.includes(searchTerm)){
                            if ( !advancedSearchResults.includes(currentRecipe)){
                                advancedSearchResults.push(currentRecipe); // store recipes in array: all recipes whose description contain serach term
                            }
                        }
                    });
                    return advancedSearchResults;
                }
            }
        }
    });
    // console.log('results of ADVANCED SEARCH =====',advancedSearchResults );
    RecipeModule.setResults(advancedSearchResults);
}



// ADVANCED SEARCH - MANUAL INPUT : search in current category items to make suggestions
// this methods takes as arguments : a list of currently displayed list items / category name / search term
export function searchIntoCurrentList(searchTerm, currentCategoryName, currentItems) {
    let currentSuggestions = []; // reset
    // identify list items ending with comma/period
    let endsWithCommaOrPeriodRegex = /\.|,$/i;

    currentItems.forEach(item => {    
        item = item.toLowerCase(); // console.log('ITEM==', item);
        // if matching word ends with comma/period : remove them ()
        if ( endsWithCommaOrPeriodRegex.test(item) ) {
            // console.log('should be corrected: ', word);
            return item.substring(0, item.length-1); 
        }
        if ( item.includes(searchTerm.toLowerCase()) ) {

            if ( !currentSuggestions.includes(item)) {
                currentSuggestions.push(item);
            }
        }
    });
    return currentSuggestions;
}
