/* ================================================== */
/* RECIPE TEMPLATE  */
/* ================================================== */
export class CardTemplate extends HTMLElement {
    constructor(recipe) {
        super();

        this.setAttribute('class', 'col');
        this.innerHTML = 
            `
            <div class="card recipe-card col col m-0 p-0">
                <img src="" class="card-img-top" alt="">
                <div class="card-body">
                    <div class="card-header-recipe row">
                        <h5 class="card-title col-10 m-0 p-0">${recipe.name}</h5>
                        <div class="card-time col-2 m-0 p-0">
                            <i class="far fa-clock m-0 p-0"></i>
                            <h5 class="time m-0 p-0">${recipe.time}min</h5>
                        </div>
                    </div>
                    <div class="recipe-description row">
                        <ul id="ingredients-list" class="ingredients-list col m-0 p-0">
                        </ul>
                        <div class="recipe-txt col m-0 p-0">
                            <p class="m-0">${recipe.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;

            const ingredientsList = this.querySelector('#ingredients-list');

            recipe.ingredients.forEach(ingredient => {
    
                let newListItem = document.createElement('li');
                let newListItemContent = document.createTextNode(ingredient.ingredient);
                if (ingredient.quantity) { newListItemContent.textContent+= ': ' + ingredient.quantity; }
                if (ingredient.unit) {
                    if (ingredient.unit === 'g' || ingredient.unit === 'ml') { // skip space if unit is 'grammes' / 'g' or ml
                        newListItemContent.textContent+= '' + ingredient.unit;
                    } else {
                        newListItemContent.textContent+= ' ' + ingredient.unit; }
                    }

                newListItem.appendChild(newListItemContent);
                ingredientsList.appendChild(newListItem);
            });
    }
}
// register custom element in the built-in CustomElementRegistry object
customElements.define('card-component', CardTemplate);


