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
            </div>
            `;

        const mainInputSearch = this.querySelector('#main-search-input');
        
        let searchIcon = this.querySelector('#search-addon');
        searchIcon.classList.add('d-inline-block');
        let resetSearchIcon = this.querySelector('#reset-search-icon');
        resetSearchIcon.style.display = 'none'; // default

        let advSearchIsActive = () => {
            const tagsWrapper = document.querySelector('#tagsWrapper');
            if ( tagsWrapper && tagsWrapper.hasChildNodes() ) { return true; } else { return false; }
        };

        resetSearchIcon.addEventListener('click', function(event) { 
            if ( advSearchIsActive() ) {
                resetInput(event);
            } else { RecipeModule.resetSearch();}
        });

        function resetInput(event) {
            mainInputSearch.value = event.target;
            return mainInputSearch.value = '';
        }

        
        

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

            currentSearchTerm = event.target.value.toLowerCase();
            console.log('currentSearchTerm=>', currentSearchTerm)
            if ( currentSearchTerm === ' ') { currentSearchTerm = '-'; } // deal with spaces represented in trie with '-' {
            RecipeModule.processCurrentMainSearch(currentSearchTerm);
            inputFieldTouched = true;
            handleManualSearchReset();
        }, false);

        // CASE WHERE USER USES BACKSPACE KEY to delete chars
        mainInputSearch.addEventListener('keydown', function(event){
            currentSearchTerm = event.target.value.toLowerCase();
            if ( event.key === 'Backspace') {
                handleManualSearchReset();
            }
            if ( event.key === 'Enter' ) { // allow manual searchterm confirmation
                RecipeModule.confirmCurrentChars();
                searchIcon.classList.remove('d-inline-block'); 
                searchIcon.style.display = 'none';
                resetSearchIcon.style.display = 'inline-block'; // visible
            }
        }, false);


        // case where user deletes chars until field = empty or deletes the whole searchterm
        // when input has been touched + searchterm is empty + focus still on input
        function handleManualSearchReset(){
            RecipeModule.removeNoResults();
            RecipeModule.removeResultsBlock();
            if ( inputFieldTouched && !currentSearchTerm && mainInputSearch == document.activeElement ){
                console.log('NEW SEARCH PENDING');

                // if adv search not active : reset all to default all recipes view
                if ( !advSearchIsActive()) {
                    RecipeModule.resetAllForNewSearch();
                    RecipeModule.resetDefaultView();
                } else { // adv search IS active : reset view to these results
                    RecipeModule.resetToAdvSearchResults();
                }
            }
        }
        
        // case where user confirm searchterm manually instead of choosing a word in suggestions
        // then all current results list for all suggested words are displayed
        // + first word in suggestions is 'sent' to input field
        searchIcon.addEventListener('click', function(){
            currentSearchTerm = mainInputSearch.value;
            RecipeModule.confirmCurrentChars();
            // reset search icon replaces serach icon
            searchIcon.classList.remove('d-inline-block'); 
            searchIcon.style.display = 'none';
            resetSearchIcon.style.display = 'inline-block'; // visible
        }, false);
    }
}
// register custom element in the built-in CustomElementRegistry object
customElements.define('searchbar-component', SearchBar);