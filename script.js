// =====================
// Loading Screen Logic (index.html)
// =====================
document.addEventListener("DOMContentLoaded", () => {
  let loadingPage = document.getElementById("loading-page");
  let mainContent = document.getElementById("main-content");
  let progressBar = document.getElementById("progress-bar");

  if (loadingPage && progressBar) {
    if (!localStorage.getItem("visited")) {
      let progress = 0;
      let interval = setInterval(() => {
        progress += 20;
        progressBar.style.width = progress + "%";
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            localStorage.setItem("visited", "true"); // mark as visited
            window.location.replace("home.html");    // redirect to homepage
          }, 500);
        }
      }, 500);
    } else {
      // Skip loading screen if already visited
      window.location.replace("home.html");
    }
  }
});

// =====================
// Cart Logic
// =====================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to Cart (for product selector buttons)
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    let name = button.dataset.name;
    let length = button.dataset.length;
    let price = parseFloat(button.dataset.price);
    let quantityInput = button.previousElementSibling;
    let quantity = parseInt(quantityInput.value);

    let item = { name, length, price, quantity };

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${quantity} x ${name} added to cart!`);
    updateCartCount();
  });
});

// Update Cart Count (for navbar/floating cart)
function updateCartCount() {
  let count = cart.reduce((sum, item) => sum + item.quantity, 0);
  let cartCount = document.getElementById("cart-count");
  let floatingCount = document.getElementById("floating-cart-count");
  if (cartCount) cartCount.textContent = count;
  if (floatingCount) floatingCount.textContent = count;
}
updateCartCount();

// =====================
// Cart Page Rendering
// =====================
function renderCart() {
  let straightList = document.getElementById("cart-straight");
  let curlyList = document.getElementById("cart-curly");
  let tpartList = document.getElementById("cart-tpart");
  let totalElement = document.getElementById("cart-total");

  if (!straightList || !curlyList || !tpartList || !totalElement) return;

  straightList.innerHTML = "";
  curlyList.innerHTML = "";
  tpartList.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = `${item.quantity} x ${item.name} (${item.length}) - R${item.price * item.quantity}`;

    let removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });

    li.appendChild(removeBtn);

    // Categorize items
    if (item.name.toLowerCase().includes("straight")) {
      straightList.appendChild(li);
    } else if (item.name.toLowerCase().includes("curl")) {
      curlyList.appendChild(li);
    } else if (item.name.toLowerCase().includes("t-part")) {
      tpartList.appendChild(li);
    } else {
      straightList.appendChild(li); // default
    }

    total += item.price * item.quantity;
  });

  totalElement.textContent = `Total: R${total}`;
}
renderCart();

// =====================
// Cart Actions
// =====================
let clearBtn = document.getElementById("clear-cart");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
  });
}

let checkoutBtn = document.getElementById("checkout");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    let message = "Hello, I would like to order:\n";
    cart.forEach(item => {
      message += `${item.quantity} x ${item.name} (${item.length}) - R${item.price * item.quantity}\n`;
    });
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `\nTotal: R${total}`;

    let whatsappUrl = `https://wa.me/27710872490?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  });
}

