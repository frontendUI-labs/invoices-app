// import API from "./API.js";
const URL = "/src/data/invoices.json";

const fetchInvoices = async () => {
  const result = await fetch(URL);
  const response = await result.json();
  return response;
};

export const Menu = {
  data: null,
  load: async () => {
    Menu.data = await fetchInvoices();
    console.log(Menu.data);
    Menu.render();
  },
  getProductById: async (id) => {
    if (Menu.data == null) {
      await Menu.load();
    }
    for (let c of Menu.data) {
      for (let p of c.products) {
        if (p.id == id) {
          return p;
        }
      }
    }
    return null;
  },
  render: () => {
    let html = "";
    for (let category of Menu.data) {
      html += `
                <li>
                    <h3>${category.name}</h3>
                    <ul class='category'>
                        ${category.products
                          .map(
                            (p) => `
                                <li>
                                    <article>
                                        <a href="#"
                                            onclick="Router.go('/product-${p.id}');event.preventDefault()">
                                            <img src="/data/images/${p.image}">
                                            <h4>${p.name}</h4>
                                            <p class="price">$${p.price.toFixed(2)}<p>
                                        </a>
                                    </article>
                                </li>
                            `
                          )
                          .join("")}
                    </ul>
                </li>`;
    }
    document.querySelector("#menu").innerHTML = html;
  },
  renderDetails: async (id) => {
    const product = await Menu.getProductById(id);
    if (product == null) {
      console.log(`Product ${id} not found`);
      return;
    }
    document.querySelector("#details article").innerHTML = `
            <header>
                <a href="#" onclick="Router.go('/'); event.preventDefault()">&lt; Back</a>
                <h2>${product.name}</h2>
                <a></a>
            </header>
            <img src="/data/images/${product.image}">
            <p class="description">${product.description}</p>
            <p class="price">$ ${product.price.toFixed(2)} ea</p>
            <button onclick="Order.add(${product.id}); Router.go('/order')">Add to cart</button>
        `;
  },
};

const Router = {
  init: () => {
    document.querySelectorAll("a.navlink").forEach((a) => {
      a.addEventListener("click", (event) => {
        event.preventDefault();
        const href = event.target.getAttribute("href");
        Router.go(href);
      });
    });
    // It listen for history changes
    window.addEventListener("popstate", (event) => {
      Router.go(event.state.route, false);
    });
    // Process initial URL
    Router.go(location.pathname);
  },
  go: (route, addToHistory = true) => {
    if (addToHistory) {
      history.pushState({ route }, "", route);
    }
    document.querySelectorAll("section.page").forEach((s) => (s.style.display = "none"));
    switch (route) {
      case "/":
        document.querySelector("section#home").style.display = "block";
        break;
      case "/order":
        document.querySelector("section#order").style.display = "block";
        break;
      default:
        if (route.startsWith("/product-")) {
          document.querySelector("section#details").style.display = "block";
          Menu.renderDetails(route.substring(route.lastIndexOf("-") + 1));
        }
        break;
    }
    window.scrollX = 0;
  },
};

window.Router = Router; // make it "public"
export default Router;
