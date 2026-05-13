/* КОРЗИНА*/
let cartCount = 0;
const cartCountEl = document.getElementById("cartCount");

function updateCart() {
  if (cartCountEl) {
    cartCountEl.textContent = cartCount;
  }
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-add")) {
    cartCount++;
    updateCart();
  }
});

/* ФИЛЬТРЫ КАТАЛОГА*/
const categoryFilter = document.getElementById("categoryFilter");
const brandFilter = document.getElementById("brandFilter");
const applyFilters = document.getElementById("applyFilters");
const resetFilters = document.getElementById("resetFilters");
const catalogGrid = document.getElementById("catalogGrid");

function applyCatalogFilters() {
  const categoryValue = categoryFilter?.value || "all";
  const brandValue = brandFilter?.value.toLowerCase() || "";

  const products = catalogGrid?.querySelectorAll(".card-tovar") || [];

  products.forEach((card) => {
    const cardCategory = card.dataset.category;
    const title = card.querySelector(".card-title")?.textContent.toLowerCase() || "";

    const matchCategory = categoryValue === "all" || cardCategory === categoryValue;
    const matchBrand = brandValue === "" || title.includes(brandValue);

    card.style.display = matchCategory && matchBrand ? "flex" : "none";
  });
}

if (applyFilters) {
  applyFilters.addEventListener("click", applyCatalogFilters);
}

if (resetFilters) {
  resetFilters.addEventListener("click", () => {
    if (categoryFilter) categoryFilter.value = "all";
    if (brandFilter) brandFilter.value = "";
    applyCatalogFilters();
  });
}

/* ЗАГРУЗКА ТОВАРА НА product.html*/

function loadXML(path) {
  return fetch(path)
    .then((res) => res.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"));
}

async function loadProductPage() {
  const container = document.getElementById("productContainer");
  if (!container) return; // мы не на странице товара

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (!productId) {
    container.innerHTML = "<p>Товар не найден.</p>";
    return;
  }

  const xml = await loadXML("/XML/products.xml");
  const products = xml.getElementsByTagName("product");

  let productData = null;

  for (let p of products) {
    if (p.getAttribute("id") === productId) {
      productData = p;
      break;
    }
  }

  if (!productData) {
    container.innerHTML = "<p>Товар не найден.</p>";
    return;
  }

  const name = productData.getElementsByTagName("name")[0].textContent;
  const brand = productData.getElementsByTagName("brand")[0].textContent;
  const category = productData.getElementsByTagName("category")[0].textContent;
  const price = productData.getElementsByTagName("price")[0].textContent;
  const image = productData.getElementsByTagName("image")[0].textContent;
  const description = productData.getElementsByTagName("description")[0].textContent;

  const specs = productData.getElementsByTagName("spec");
   
  const rating = productData.getElementsByTagName("rating")[0]?.textContent || "4.8";
  const reviews = productData.getElementsByTagName("reviews")[0]?.textContent || "100";


  let specsHTML = "";
  for (let s of specs) {
    const specName = s.getAttribute("name");
    const specValue = s.textContent;
    specsHTML += `<li><strong>${specName}:</strong> ${specValue}</li>`;
  }

  container.innerHTML = `
  <div class="product-left">
    <div class="product-image">
      <img src="${image}" alt="${name}">
    </div>
  </div>

  <div class="product-right">

    <h1 class="product-title">${name}</h1>

    <div class="product-rating">
      <span class="stars">⭐ ${rating}</span>
      <span class="rating-count">(${reviews} отзывов)</span>
    </div>

    <div class="product-price">${price} BYN</div>

    <p class="product-description">${description}</p>

    <h3 class="specs-title">Характеристики</h3>
    <ul class="product-specs">
      ${specsHTML}
    </ul>

    <button class="btn-add product-buy-btn">Добавить в корзину</button>
    <a href="catalog.html" class="btn-add product-buy-btn">Вернуться в каталог</a>
  </div>
`;

}

loadProductPage();
