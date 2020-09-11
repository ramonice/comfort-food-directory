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
        resultHeading.innerHTML = `<h4>Results for <em>"${term}"<em></h4>`;

        if(data.meals === null) {
          resultHeading.innerHTML =  `<h4>Nothing found for <em>"${term}"<em>.</h4>`
        } else {
          meals.innerHTML = data.meals.map(meal => `
            <div class="meal" draggable="true">
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

  console.log("ing = " + ingredients);

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
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




