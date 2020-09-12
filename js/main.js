//#region Search
const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');
const mealsEl = document.getElementById('meals');

// search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // clear single meal
  single_mealEl.innerHTML = '';

  const term = search.value;

  // check submit empty
  if(term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `
          <div class="alert alert-info mt-4" role="alert">
            Search result for keyword: <em class="fw-700">${term}</em>.
          </div>
        `;

        if(data.meals === null) {
          resultHeading.innerHTML =  `
            <div class="alert alert-warning mt-4" role="alert">
              Nothing found for keyword: <em class="fw-700">${term}</em>.
            </div>
          `
        } else {
          meals.innerHTML = data.meals.map(meal => `
            <div class="meal mx-1 my-1" data-toggle="modal" data-target="#mealInfo">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h4>${meal.strMeal}</h4>
              </div>
            </div>
          `)
          .join('');
        }
      });

      // clear search text
      search.value = '';

  } else {
    alert('Enter a keyword');
  }
}

// fetch meal by id
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for(let i = 1; i<=20; i++) {
    if(meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break; 
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">

      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel"><h4 class="merienda">${meal.strMeal}</h4></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body lato pb-5">

        <img class="img-fluid" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
          ${meal.strCategory ? `<p class="mt-3 fw-700">Category: ${meal.strCategory}</p>` : ''}
          ${meal.strArea ? `<p class="fw-700">Origin: ${meal.strArea}</p>` : ''}
        </div>
        <div class="main mb-5">
          <p>${meal.strInstructions}</p>
          <h5 class="merienda">Ingredients:</h5>
          <ul>
            ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
          </ul>
        </div>

      </div>
    </div>
  `;
}

// event listeners
submit.addEventListener('submit', searchMeal);
mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if(item.classList) {
      return item.classList.contains('meal-info')
    } else {
      return false;
    }
  });

  if(mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }

});
//#endregion Search

