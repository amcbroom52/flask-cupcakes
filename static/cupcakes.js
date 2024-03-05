"use strict";

const $cupcakeList = $("#cupcake-list");
const $cupcakeForm = $("#cupcake-form");

/**Makes an API call to the cupcake API and fills the cupcake list with html
 * for the cupcakes
 */
async function fillCupcakeList() {
  const resp = await fetch('/api/cupcakes');
  const cupcakeData = await resp.json();
  const cupcakeList = cupcakeData.cupcakes;

  for (let cupcake of cupcakeList) {
    generateCupcakeMarkup(cupcake);
  }
}


/**Creates html for individual cupcake list items */
function generateCupcakeMarkup(cupcake) { //TODO: Rearrange style
  const $cupcakeHtml = $(`
    <li class="mb-2">
      <img src=${cupcake.image_url} style="dislay: inline-block" class="col-3"></img>
      <div style="display: inline-block" class="col-4" >
        <h3>${cupcake.flavor} <i style="font-size: 15px">${cupcake.rating}/10</i></h3>
        <p>${cupcake.size}</p>
      </div>
    </li>
  `);

  $cupcakeList.append($cupcakeHtml);
}

/**Sends cupcake data through the API to create a new cupcake on the server and
 * adds the desired html for that cupcake to the page
 */   //don't need to specify through api || brevity
async function addCupcake(evt) {
  evt.preventDefault();

  const flavor = $("#flavor").val();
  const size = $("#size").val();
  const rating = $("#rating").val();
  const imageUrl = $("#image-url").val();

  const cupcake = { flavor, size, rating, "image_url": imageUrl };

  const resp = await fetch('/api/cupcakes', {
    method: "POST",
    body: JSON.stringify(cupcake),
    headers: { "Content-Type": "application/json" }
  });
  const cupcakeData = await resp.json();

  generateCupcakeMarkup(cupcakeData.cupcake);
}

$cupcakeForm.on("submit", addCupcake);

fillCupcakeList();