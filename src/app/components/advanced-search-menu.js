/* ================================================== */
/* TEMPLATE FOR A SEARCH MENU : button + collapsible menu body  */
/* ================================================== */
import {MenuListItem} from '../components/menu-listItem';
import {RecipeModule} from '../modules/recipes';
import {searchIntoCurrentList} from '../utils/search-algo';
import {removePunctuation} from '../utils/process-api-data';

export class CollapsingMenu extends HTMLElement{
    constructor(categoryName, categoryElements){
        super();
        this.innerHTML = `
            
            <div class="menu-header closed" id="menu-header-close-${categoryName}" isActive="false">
                <button class="btn"
                        id="btn-${categoryName}" 
                        type="button" 
                        aria-expanded="false"
                        aria-controls="${categoryName}">${categoryName}
                </button>
                <i id="caret-down" class="fas fa-angle-down"></i>
            </div>

            <div class="menu-header open" id="menu-header-open-${categoryName}" isActive="true">
                <input id="searchInto-${categoryName}" class="searchInput" placeholder="rechercher un ${categoryName}">
                <i id="caret-up" class="fas fa-angle-up"></i>
            </div>

            <div class="collapse multi-collapse category-menu" id="menu-${categoryName}" isOpen="false">
                <div class="card card-body" id="body-items">
                    <ul id="${categoryName}-list" class="list">
                    </ul>
                </div>
                <div class="card card-body" id="${categoryName}-input-suggestions">
                    <ul id="${categoryName}-suggestions-list" class="list suggestions-list">
                    </ul>
                </div>
            </div>
        `;

        this.setAttribute('isActive', 'false'); // default component state
        this.setAttribute('id', 'collapsing-'+ categoryName); // default component state
        let currentSibling = this;
        let activeSibling;

        let menuHeaderClose = this.querySelector('#menu-header-close-' + categoryName);
        let menuHeaderOpen = this.querySelector('#menu-header-open-' + categoryName);
        let menuToOpen = this.querySelector('#menu-'+ categoryName);
        let caretUp = this.querySelector('#caret-up');
        let currentTags = [];
        let cardBodyList = this.querySelector('#body-items');
        let cardBodySuggestions = this.querySelector('#'+ categoryName+ '-input-suggestions');

        // BOOTSTRAP RESPONSIVE =====================================================================
        // parent wrapper ('section .adv-search-wrapper') = containing all 3 collapsing menus
        const parentAdvancedSearchWrapper = document.querySelector('.adv-search-wrapper');
        // MOBILE/DESKTOP default width : when all menus closed
        parentAdvancedSearchWrapper.classList.add('row','col-12','col-lg-6');
        // each menu closed = col (mobile: of W100% and desktop: of W50%)
        currentSibling.setAttribute('class', 'col');

        function setUpResponsiveWhenOpen(activeSibling) {
            parentAdvancedSearchWrapper.classList.replace('col-lg-6', 'col-lg-10'); // parent expands to give space to menu
            parentAdvancedSearchWrapper.classList.add('col-lg-offset-2'); // leave empty space at the end of the row
            activeSibling.classList.add('col-12'); // MOBILE : menu width = W100%
            activeSibling.classList.replace('col', 'col-lg-8'); // DESTOP : menu width = W50%
        }

        function setUpResponsiveWhenCLose() {
            parentAdvancedSearchWrapper.classList.replace('col-lg-10', 'col-lg-6'); // parent shrinks bac
            parentAdvancedSearchWrapper.classList.remove('col-lg-offset-2'); // leave empty space at the end of the row
            currentSibling.classList.remove('col-12'); // MOBILE : menu width = W100%
            currentSibling.classList.replace('col-lg-8','col'); // DESTOP : menu width = W50%
        }


        // CATEGORY POPULATION  =====================================================================
        // get UL container for category items 
        const categoryUl = this.querySelector('#' + categoryName + '-list');
        // populate each menu container with category list items - DEFAULT VIEW : all recipes categories
        categoryElements.forEach(el => {
            // generate li item element for each item of each category
            let listELement = new MenuListItem(el);
            // add select event on each item
            listELement.addEventListener('click', function(event){ selectItemInList(event); }, false);
            categoryUl.appendChild(listELement);
        });


        // default: hide menu header open version 
        menuHeaderOpen.style.display = 'none'; 
        // default : suggestions = not visible
        const suggestionsWrapper = this.querySelector('#'+categoryName+'-input-suggestions');
        suggestionsWrapper.style.display = 'none';
        

        // COLLAPSING MENUS METHODS ================================================================
        // By default, click event = on whole menu Header to OPEN ONLY
        // ( cannot use a TOGGLE method here, for open/close events are passed through different elements
        menuHeaderClose.addEventListener('click', function(event){ menuOpen(event),{ once: true }; }, false);
        
        function menuOpen(event) {

            // make sure suggestions = reset from last search
            suggestionsWrapper.style.display = 'none';
            resetSuggestions();
            cardBodyList.style.display = 'flex';

        
            menuHeaderClose = event.currentTarget; // element that handles event
            event.stopPropagation();
            
            RecipeModule.checkWhosOpen(); // checks if any other menu is open already

            currentSibling.removeAttribute('isActive', 'false'); 
            currentSibling.setAttribute('isActive', 'true');// mark collapsing menu as active (for module to avoid multiple openings)
            activeSibling = currentSibling; // mark collapsing menu as active (for responsive method)

            // reset input from previous search
            const inputField = currentSibling.querySelector('input');
            if (inputField.value) { inputField.value = '';  }

            // switch menu header
            menuHeaderClose.style.display = 'none';
            menuHeaderOpen.style.display = 'flex';
            // show list
            menuToOpen.style.display = 'flex';
            // add close event on caret 
            caretUp.addEventListener('click',function(event){ menuClose(event), { once: true }; }, false);    
            // set up responsive
            setUpResponsiveWhenOpen(activeSibling);
        }

        function menuClose(event) {
            caretUp = event.currentTarget; // element that handles event
            event.stopPropagation();

            menuHeaderOpen.style.display = 'none';
            menuHeaderClose.style.display = 'flex';

            menuToOpen.style.display = 'none'; // hide list
            currentSibling.removeAttribute('isActive', 'true');
            currentSibling.setAttribute('isActive', 'false');
            
            setUpResponsiveWhenCLose();
        }


        // HANDLE SEARCH OF ADVANCED SEARCH ==================================================
        let searchInputField = this.querySelector('#searchInto-'+ categoryName);
        let searchTerm = '';
        let inputFieldTouched = false;
        
        // handle manual typing in input field : activated at first keystroke
        searchInputField.addEventListener('input', function(event){ handleManualInput(event); }, false);

        // press ENTER to confirm selected list item or typed in word to search
        searchInputField.addEventListener('keydown', function(event){ handleSelectItemInput(event); }, false);

        // handle select item in list : send it into input field
        function selectItemInList(event) {
            let word = event.target.innerText; // text inside <p> element where event occurs
            let inputField = document.querySelector('#searchInto-'+ categoryName);
            inputField.value = word; // make selected word the current search word of input field
        }

        function handleSelectItemInput(event) {
            searchTerm = event.target.value;
            searchInputField = event.target;
            // retrieve current category from input id  ( ex '#searchInto-ingredients')
            let currentCategoryName = searchInputField.getAttribute('id');
            currentCategoryName = currentCategoryName.slice(11, currentCategoryName.length);
            // console.log('currentCategoryName', currentCategoryName);
            inputFieldTouched = true;
            // and then CONFIRM CHOICE by pressing ENTER:
            if ( event.key === 'Enter') {
                // launch search for term in current results
                RecipeModule.processAdvancedSearch(searchTerm, currentCategoryName);

                // a new tag for search word is generated above menus if term exists in api data
                // ( check first if exists already )
                let currentTags = getTagsList();
                if ( !currentTags.includes(searchTerm) ) {
                    let searchItemTag = createTag(searchTerm);
                    initTagsWrapper();
                    let tagsWrapper = document.querySelector('#tagsWrapper');
                    tagsWrapper.appendChild(searchItemTag);
                    setTagsList(searchTerm); // include current searchterm in tags list
                    // close menu
                    caretUp.click();
                }
            }
        }

        function handleManualInput(event) {
            searchTerm = event.target.value;
            searchInputField = event.target;

            let currentCategoryName = searchInputField.getAttribute('id');
            currentCategoryName = currentCategoryName.slice(11, currentCategoryName.length);
        
            // console.log('currentCategoryName==',currentCategoryName);
            if (searchTerm.length === 3) {
                processManualInputSearchIntoCurrentList(searchTerm, currentCategoryName);
            }
            inputFieldTouched = true;
            handleManualSearchReset();
        }


        function processManualInputSearchIntoCurrentList(searchTerm, currentCategoryName) {
            let currentSuggestions = [];
            let currentItems = [];
            if (currentCategoryName === 'appliance') { currentCategoryName = 'appareils'; }
            // locate list items in dom
            let parentList = document.querySelector('#' + currentCategoryName + '-list');        
            let currentList = parentList.querySelectorAll('a');

            // retrieve items from list (textcontent of each <a> tag)
            currentList.forEach( anchorTag => { currentItems.push(anchorTag.innerText); });
            // search match in current items of category
            currentSuggestions = searchIntoCurrentList(searchTerm, currentCategoryName, currentItems);
            console.log('currentSuggestions==', currentSuggestions);

            displayCurrentSuggestions(currentSuggestions);       
        }

        function displayCurrentSuggestions(currentSuggestions) {
            // first, hide the whole current list
            cardBodyList.style.display = 'none';
            // suggestions wrapper becomes visible
            cardBodySuggestions.style.display = 'flex';

            // populate each menu container with category list items - DEFAULT VIEW : all recipes categories
            currentSuggestions.forEach(el => {
                // generate li item element for each item of each category
                let listELement = new MenuListItem(el);
                // add select event on each item
                listELement.addEventListener('click', function(event){ selectItemInList(event); }, false);
                suggestionsWrapper.appendChild(listELement);
            });
        }

        function resetSuggestions(currentSuggestions) {
            while (suggestionsWrapper.firstChild) {suggestionsWrapper.removeChild(suggestionsWrapper.firstChild); }
            if (currentSuggestions) { 
                while( currentSuggestions.length > 0 ) { currentSuggestions.pop(); } // remove arr items
            } else { return; }
            
        }

        // case where user deletes chars until field = empty or deletes the whole searchterm
        // when input has been touched + searchterm is empty + focus still on input
        function handleManualSearchReset(currentSuggestions){
            if ( inputFieldTouched && !searchTerm && searchInputField == document.activeElement ){
                currentSuggestions = []; // empty previous data
                RecipeModule.removeNoResults(); // remove no results message if needed
                resetSuggestions(currentSuggestions);// remove dom suggestions
                // hide suggestions wrapper
                suggestionsWrapper.style.display = 'none';
                // if input field empty, show default list elements again
                cardBodyList.style.display = 'flex';
            }
        }

        // HANDLE TAGS OF ADVANCED SEARCH ==================================================
        let setTagsList = function(tag) { currentTags.push(tag); }; // keep track of tags to prevent displaying the same one more than once
        let getTagsList = function() { return currentTags; }; // AND is used by search method that needs an up-to-date array of tags
        
        let removeTagFromList = function(tag) {
            
            let currenttags = getTagsList();
            console.log('currenttags==', currenttags);

            let tagIndex = currentTags.indexOf(tag);
            currentTags.splice(tagIndex, 1);
            console.log('currenttags AFTER REMOVE==', currentTags, 'type==', typeof(currentTags));
            return currentTags;
        };

        // create WRAPPER FOR TAGS to come : happens ONCE with 1st list item selection or typed word
        function initTagsWrapper() {
            if (!parentAdvancedSearchWrapper.contains(document.querySelector('#tagsWrapper'))) {
                let tagsWrapper = document.createElement('div');
                tagsWrapper.setAttribute('id', 'tagsWrapper');
                tagsWrapper.setAttribute('class', 'tagsWrapper');
                parentAdvancedSearchWrapper.prepend(tagsWrapper); // insert in 1st position
            }
            else { return; }
        }

        // create new tag
        function createTag(searchTerm) { 
            let searchItemTag = document.createElement('div');
            searchItemTag.setAttribute('class', 'searchTag');
            searchItemTag.setAttribute('id', 'searchTag-' + searchTerm );

            let tagCloseIcon = document.createElement('i');
            tagCloseIcon.setAttribute('class', 'fa fa-times-circle-o');
            tagCloseIcon.setAttribute('id', 'close-'+ searchTerm);

            const containsParenthesesRegex = /\((.*)\)/;

            if ( containsParenthesesRegex.test(searchTerm) ){ // ---------- to review
                console.log('contains parentheses');
                removePunctuation(searchTerm);
            }
            console.log('searchTerm after remove==', searchTerm);
            let tagText = document.createTextNode(searchTerm);
            searchItemTag.appendChild(tagText);
            searchItemTag.appendChild(tagCloseIcon);
            tagCloseIcon.addEventListener('click', function(event) { removeTag(event);}, false);
            return searchItemTag;
        }

        let noTagsRemaining;
        // case where all tags have been removed : inform module :
        // IF there was a main search => reset displaying main search results
        // ELSE => reset default view
        function checkNoRemainingTag() {
            let tagsWrapper = document.querySelector('#tagsWrapper');
            if ( !tagsWrapper.childNodes ) { console.log('ALL TAGS REMOVED !');
                noTagsRemaining = true;
            }
            return noTagsRemaining;
        }

        // delete tag (via icon)
        function removeTag(event) {
            event.stopPropagation();
            let closeIcon = document.querySelector('#close-'+ searchTerm);
            closeIcon = event.currentTarget;
            let tagToRemove = closeIcon.parentNode;
            let tagsWrapper = document.querySelector('#tagsWrapper');
            tagsWrapper.removeChild(tagToRemove);

            // update results list
            removeTagFromList(tagToRemove.textContent);
            currentTags = getTagsList();
            currentTags.forEach(term => {RecipeModule.processAdvancedSearch(term, categoryName); });
            
            checkNoRemainingTag();
            if ( noTagsRemaining ) {
                RecipeModule.handleAdvancedSearchReset();
            }
        }

        
    }
}

// register custom element in the built-in CustomElementRegistry object
customElements.define('collapsing-menu-component', CollapsingMenu);

