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
                    <span class="input-group-text border-0 d-inline-block" id="search-addon">
                        <i class="fas fa-search"></i>
                    </span>
                </div>
            </div>`;

        const mainInputSearch = this.querySelector('#main-search-input');
        let currentSearchTerm = '';
        let inputFieldTouched = false;
        let newSearch = false;
        let searchIcon = this.querySelector('#search-addon');

        mainInputSearch.addEventListener('input', function(event){
            currentSearchTerm = event.target.value;
            RecipeModule.processCurrentMainSearch(currentSearchTerm); // process input as it enters field
            inputFieldTouched = true;
            handleManualSearchReset();

        }, false);

        // case where user deletes chars until field = empty
        // when input has been touched + searchterm is empty + focus still on input
        // 
        function handleManualSearchReset(){
            if ( inputFieldTouched && !currentSearchTerm && mainInputSearch == document.activeElement ){
                console.log('NEW SEARCH PENDING');
            }

        }

        // case where user confirm searchterm manually
        searchIcon.addEventListener('click', function(event, currentSearchTerm ){
            currentSearchTerm = mainInputSearch.value;
            console.log('currentSearchTerm==', currentSearchTerm);
            if (currentSearchTerm && currentSearchTerm !== null) {
                RecipeModule.launchMainSearch(currentSearchTerm);
            }
        }, false);

    }
}
// register custom element in the built-in CustomElementRegistry object
customElements.define('searchbar-component', SearchBar);