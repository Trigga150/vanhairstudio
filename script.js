// =====================
// Loading Screen Logic (index.html)
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const loadingPage = document.getElementById("loading-page");
  const progressBar = document.getElementById("progress-bar");

  if (loadingPage && progressBar) {
    if (!localStorage.getItem("visited")) {
      let progress = 0;
      let interval = setInterval(() => {
        progress += 20;
        progressBar.style.width = progress + "%";
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            localStorage.setItem("visited", "true");
            window.location.replace("home.html"); // redirect to homepage
          }, 500);
        }
      }, 500);
    } else {
      window.location.replace("home.html"); // skip loading if already visited
    }
  }
});

// =====================
// Price List Data
// =====================
const wigPrices = {
  straight: { "8": 990, "10": 1050, "12": 1150, "14": 1300, "16": 1500,
              "18": 1700, "20": 1800, "22": 2100, "24": 2200, "26": 2800,
              "28": 2800, "30": 3200, "32": 3850 },
  curly:   { "10": 1100, "12": 1200, "14": 1300, "16": 1500, "18": 1700,
              "20": 1900, "22": 2200, "24": 2500, "26": 2800, "28": 3000,
              "30": 3300 },
  tpart:   { "10": 850, "12": 910, "14": 980, "16": 1110, "18": 1250,
              "20": 1370, "22": 1470, "24": 1550 },
  closure: { "8": 850, "10": 950, "12": 1050, "14": 1150, "16": 1270,
              "18": 1450, "20": 1600, "22": 1700, "24": 1800 },
  glueless:{ "10": 950, "12": 1000, "14": 1100, "16": 1350,
              "18": 1450, "20": 1580, "22": 1700 }
};

// =====================
// Cart Logic
// =====================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  let count = cart.reduce((sum, item) => sum + item.quantity, 0);
  let cartCount = document.getElementById("cart-count");
  let floatingCount = document.getElementById("floating-cart-count");
  if (cartCount) cartCount.textContent = count;
  if (floatingCount) floatingCount.textContent = count;
}
updateCartCount();

// =====================
// Product Selector Logic
// =====================
const typeSelect = document.getElementById("wig-type");
const inchSelect = document.getElementById("wig-inch");
const priceDisplay = document.getElementById("wig-price");
const qtyInput = document.getElementById("wig-qty");
const addBtn = document.getElementById("add-to-cart");
const colorCheckbox = document.getElementById("wig-color");

function updateInches() {
  if (!inchSelect || !typeSelect) return;
  inchSelect.innerHTML = "";
  const selectedType = typeSelect.value;
  const lengths = Object.keys(wigPrices[selectedType]);
  lengths.forEach(len => {
    let opt = document.createElement("option");
    opt.value = len;
    opt.textContent = `${len} Inch`;
    inchSelect.appendChild(opt);
  });
  updatePrice();
}

function updatePrice() {
  if (!typeSelect || !inchSelect) return;
  const type = typeSelect.value;
  const inch = inchSelect.value;
  let price = wigPrices[type][inch];
  if (colorCheckbox && colorCheckbox.checked) {
    price += 100;
  }
  if (priceDisplay) priceDisplay.textContent = `Price: R${price}`;
}

if (addBtn) {
  addBtn.addEventListener("click", () => {
    const type = typeSelect.value;
    const inch = inchSelect.value;
    let price = wigPrices[type][inch];
    if (colorCheckbox.checked) {
      price += 100;
    }
    const qty = parseInt(qtyInput.value);

    let item = {
      name: type,
      length: `${inch} Inch`,
      price: price,
      quantity: qty,
      color: colorCheckbox.checked ? "Colored" : "Natural"
    };

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart(); // instantly update cart list
    alert(`${qty} x ${type} (${inch} Inch, ${item.color}) added to cart!`);
  });
}

if (typeSelect) {
  typeSelect.addEventListener("change", updateInches);
  inchSelect.addEventListener("change", updatePrice);
  colorCheckbox.addEventListener("change", updatePrice);
  updateInches();
}

// =====================
// Quick Add Buttons
// =====================
document.querySelectorAll(".quick-add").forEach(button => {
  button.addEventListener("click", () => {
    const type = button.dataset.type;
    const inch = button.dataset.inch;
    const price = parseFloat(button.dataset.price);

    let item = {
      name: type,
      length: `${inch} Inch`,
      price: price,
      quantity: 1,
      color: "Natural"
    };

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart(); // instantly update cart list
    alert(`1 x ${type} (${inch} Inch) added to cart!`);
  });
});

// =====================
// Cart Page Rendering
// =====================
function renderCart() {
  let cartList = document.getElementById("cart-list");
  let totalElement = document.getElementById("cart-total");

  if (!cartList || !totalElement) return;

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = `${item.quantity} x ${item.name} (${item.length}, ${item.color}) - R${item.price * item.quantity}`;

    let removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("btn-remove");
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });

    li.appendChild(removeBtn);
    cartList.appendChild(li);

    total += item.price * item.quantity;
  });

  totalElement.textContent = `Total: R${total}`;
}
renderCart();

// =====================
// Cart Actions
// =====================
const clearBtn = document.getElementById("clear-cart");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
  });
}

const checkoutBtn = document.getElementById("checkout");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    let message = "Hello, I would like to order:\n";
    cart.forEach(item => {
      message += `${item.quantity} x ${item.name} (${item.length}, ${item.color}) - R${item.price * item.quantity}\n`;
    });
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `\nTotal: R${total}`;

    let whatsappUrl = `https://wa.me/27710872490?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  });
}
