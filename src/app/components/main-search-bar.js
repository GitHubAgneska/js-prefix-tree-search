/* ================================================== */
/* TEMPLATE FOR MAIN SEARCHBAR */
/* ================================================== */
import {RecipeModule} from '../modules/recipes';


export class SearchBar extends HTMLElement {
    constructor() {
        super();
        const placeholder = 'Rechercher un ingrédient, appareil, ustensile ou une recette';

        this.setAttribute('class', 'main-search');
        this.innerHTML = 
            `<div class="input-group d-inline m-0">
                <div class="form-outline d-flex flex-row">
                    <input type="search" id="main-search-input" class="form-control rounded" placeholder="${placeholder}" aria-label="Search" aria-describedby="search-addon"/>
                    <label class="form-label visuallyHidden" for="main-search-input">Search</label>
                    <span class="icon-search input-group-text border-0" id="search-addon">
                        <i class="fas fa-search"></i>
                    </span>
                    <span class="icon-search input-group-text border-0" id="reset-search-icon">
                        <i class="fa fa-times-circle-o"></i>
                    </span>
                </div>
            </div>`;

        const mainInputSearch = this.querySelector('#main-search-input');
        let searchIcon = this.querySelector('#search-addon');
        searchIcon.classList.add('d-inline-block');
        let resetSearchIcon = this.querySelector('#reset-search-icon');
        resetSearchIcon.style.display = 'none'; // default

        resetSearchIcon.addEventListener('click', function(event) { RecipeModule.resetSearch(event); });

        // prepare a wrapper for incoming suggestions: it will be empty and non visible until items come in
        const suggestionsWrapperParent = this.querySelector('.form-outline');
        // create a DIV element that will contain the suggestions
        let suggestionsWrapper = document.createElement('div');
        suggestionsWrapper.setAttribute('id', 'main-suggestions');
        suggestionsWrapper.setAttribute('class', 'main-suggestions');
        // append div to parent
        suggestionsWrapperParent.appendChild(suggestionsWrapper);

        let currentSearchTerm = '';
        let inputFieldTouched = false;

        mainInputSearch.addEventListener('input', function(event){
            currentSearchTerm = event.target.value; // currentSearchTerm is actually a letter
            if ( currentSearchTerm === ' ') { currentSearchTerm = '-'; } // deal with spaces represented in trie with '-' {
            RecipeModule.processCurrentMainSearch(currentSearchTerm);
            inputFieldTouched = true;
            handleManualSearchReset();
        }, false);

        // CASE WHERE USER USES BACKSPACE KEY to delete chars : prevent search to start again
        mainInputSearch.addEventListener('keydown', function(event){
            currentSearchTerm = event.target.value;
            if ( event.key === 'Backspace') {
                console.log('USER IS SUPPRESSING KEYS');
                if ( currentSearchTerm === '') {  
                    handleManualSearchReset();
                }
                return false; 
            }
            if ( event.key === 'Enter' ) { RecipeModule.confirmCurrentChars(); } // allow partial searchterm confirmation
        }, false);


        // case where user deletes chars until field = empty or deletes the whole searchterm
        // when input has been touched + searchterm is empty + focus still on input
        function handleManualSearchReset(){
            if ( inputFieldTouched && !currentSearchTerm && mainInputSearch == document.activeElement ){
                console.log('NEW SEARCH PENDING');
                RecipeModule.resetSearchArray(); // data array
                RecipeModule.resetSuggestedWords(); // data array
                RecipeModule.resetSuggestionsBlock(); // dom
                RecipeModule.removeNoResults(); // remove no results message if needed
                RecipeModule.resetDefaultView();
            }
        }
        
        // case where user confirm searchterm manually instead of choosing a word in suggestions
        // then all current results list for all suggested words are displayed
        // + first word in suggestions is 'sent' to input field
        searchIcon.addEventListener('click', function(){
            
            currentSearchTerm = mainInputSearch.value;
            RecipeModule.confirmCurrentChars();
            // reset search icon replaces serach icon
            searchIcon.classList.remove('d-inline-block'); searchIcon.style.display = 'none';
            resetSearchIcon.style.display = 'inline-block'; // visible
            
            /* let inputField = document.querySelector('#main-search-input');
            inputField.value = currentSearchTerm

             let firstSuggestion = RecipeModule.retrieveFirstSuggestion();
                let inputField = document.querySelector('#main-search-input');
                inputField.value = firstSuggestion;


            // console.log('currentSearchTerm==', currentSearchTerm);
            if (currentSearchTerm) {
                RecipeModule.processCurrentMainSearch(currentSearchTerm);
                RecipeModule.resetSuggestionsBlock();
                RecipeModule.displaySearchResults();
                // display 1st suggestion by default
                let firstSuggestion = RecipeModule.retrieveFirstSuggestion();
                let inputField = document.querySelector('#main-search-input');
                inputField.value = firstSuggestion;
                // reset search icon replaces serach icon
                searchIcon.classList.remove('d-inline-block'); searchIcon.style.display = 'none';
                resetSearchIcon.style.display = 'inline-block'; // visible
            } */
        }, false);
    }
}
// register custom element in the built-in CustomElementRegistry object
customElements.define('searchbar-component', SearchBar);