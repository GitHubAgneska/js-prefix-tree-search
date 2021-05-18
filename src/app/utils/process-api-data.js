
/* ================================================== */
/* ALL METHODS USED TO PROCESS INCOMING API DATA
/* ================================================== */
// make it all lowercase
// remove accents, parentheses, ponctuation
// determine if made of several words

const parenthesesRegExp = /[()]/g;
const endsWithCommaOrPeriodRegex = /\.|,$/i;
const containsPunctuationRegex = /[.,/#!$%^&*;:{}=\-_`~()]/g;
const containsApostropheRegex = /'/g;
const containsWhiteSpace = /\s/;
const containsAnyAccentRegex = /[èéêëîâàä]/g;
const eContainsAccentRegex = /[èéêë]/g;
const iContainsAccentRegex = /[î]/g;
const containsWhiteSpaceRegex = /\s/;

// standard string processing
export function checkString(str) {
    str = str.toLowerCase();
    str = replaceAccents(str);
    str = removePunctuation(str);
    return str;
}

// additional processing before adding to PREFIX TRIE
// determine if a string is made of several words
// => replace white space(s) with '-'
// => replace ' apostrophe(s) with '-' as well
export function checkStringIsSeveralWords(str){
    const containsWhiteSpace = /\s/;
    const containsApostropheRegex = /'/g;

    let inputIsSeveralWords = containsWhiteSpace.test(str);
    let containsApostrophe = containsApostropheRegex.test(str);

    if (containsApostrophe) {
        let indexOfApostrophe = str.search(containsApostropheRegex);
        str = str.replace(str.charAt(indexOfApostrophe), '-');
    }

    if (inputIsSeveralWords) {
        // console.log('STRING IS SEVERAL WORDS!');
        let indexOfWhiteSpace = str.search(containsWhiteSpace);
        let result = str.replace(str.charAt(indexOfWhiteSpace), '-');
        
        return checkStringIsSeveralWords(result); // check again
    } else { return str; }
}

// STRINGS --------------------------------------------------------------------------------------------------

// replace accented e', 'a', 'i' char with regular char - ex: 'crême' -> 'creme'
export function replaceAccents(str) {
    const containsAnyAccentRegex = /[èéêëîâàä]/g;
    const eContainsAccentRegex = /[èéêë]/g;
    const iContainsAccentRegex = /[î]/g;
    const aContainsAccentRegex = /[âàä]/g;

    let containsAnyAccent = containsAnyAccentRegex.test(str);
    
    if (containsAnyAccent) {  
        let indexOfAccent = str.search(containsAnyAccentRegex);
        // determine which it is
        // 'e'
        if ( eContainsAccentRegex.test(str.charAt(indexOfAccent))) {
            str =  str.replace(str.charAt(indexOfAccent), 'e');
        // 'i'
        } else if (iContainsAccentRegex.test(str.charAt(indexOfAccent))) {
            str =  str.replace(str.charAt(indexOfAccent), 'i');
        // 'a'
        } else if (aContainsAccentRegex.test(str.charAt(indexOfAccent))) {
            str =  str.replace(str.charAt(indexOfAccent), 'a');
        }
        return replaceAccents(str); // check again

    } else { return str; }
}

// remove ponctuation
export function removePunctuation(str) {
    let punctuationless = str.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,'');
    return str = punctuationless.replace(/\s{2,}/g,' '); // remove additional spaces added in place of punctation
}


// ARRAYS --------------------------------------------------------------------------------------------------
// Prevent adding same word ending with/without 's' in ARRAYS: SUGGESTIONS/CATEGORY lists - ex : 'fraise' + 'fraises' => keep only 'fraises'
export function checkDoublonsBeforeAddingToArray(arr, str) {
        // current item === same exact word : skip
        let exactSame = arr.find(listItem => listItem === str);
        if ( exactSame ) { return; }

        // current item is SINGULAR & word already exists in PLURAL form : skip current
        let pluralSame = arr.find(listItem => listItem === str.concat('s'));
        if ( pluralSame ) { 
            // console.log('MATCHING pluralSame==', pluralSame, ':',str ); 
            return; }
        
        // current item is PLURAL & word already exists in SINGULAR form : remove previous and add current
        let singularSame = arr.find(listItem => listItem === str.substring(0, str.length -1));
        if ( singularSame ) { 
            // console.log('MATCHING singularSame==', singularSame, ':',str );
            let indexOfPrevious = arr.indexOf(singularSame);
            arr.splice(indexOfPrevious, 1, str); // replace previous singular by current plural 
        }
        else {
            str = str.toLowerCase();
            arr.push(str); } // no doublon found : insert new item in array
}

// OBJECTS --------------------------------------------------------------------------------------------------

// replaces 'grammes' with 'g' (string in object)
export function treatUnits(ingredientObject) {
    let ingredientUnit = ingredientObject.unit;
    let objectHasGrammesValue = Object.values(ingredientObject).includes('grammes');
    
    if (objectHasGrammesValue) {
        ingredientUnit = 'g';
        return ingredientObject.unit = ingredientUnit;
    }
    return ingredientObject;
}
// method that checks on ingredients 'quantity' and 'unit'
// so ingredients list displays proper spelling:
// ex: ALL quantifiable ingredients = plural form : if  there's NO 'UNITS' :  then ingredient must be of plural form ('S') : 'quantity' : 2 =>  'ingredient' : 'citronS'
// + inverse : ex: if 'quantity' === 1 , then unit should not take a 'S' -  ex: "quantity": 1,  "unit": "cuillère à soupe" 

// process object to either add or remove 's' at end of the word
export function checkUnitType(ingredientObject) {
    let ingredientName = ingredientObject.ingredient;
    // eslint-disable-next-line no-prototype-builtins
    let objectHasUnitProp = ingredientObject.hasOwnProperty('unit');
    let endsWithS = ingredientName.charAt(ingredientName.length-1) === 's';

    // first, check if object contains a 'unit' key
    if ( !objectHasUnitProp && !endsWithS ) { ingredientObject.ingredient = ingredientName.concat('S'); }

    console.log('ingredientObject corrected==', ingredientName);
    return ingredientObject;
}