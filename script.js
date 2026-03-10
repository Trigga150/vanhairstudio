// -------------------- Loading Page --------------------
let progress = 0;
let progressBar = document.getElementById("progress-bar");
let loadingPage = document.getElementById("loading-page");
let mainContent = document.getElementById("main-content");

let interval = setInterval(() => {
  progress += 10;
  progressBar.style.width = progress + "%";
  if (progress >= 100) {
    clearInterval(interval);
    setTimeout(() => {
      loadingPage.classList.add("d-none");
      mainContent.classList.remove("d-none");
    }, 1000); // small delay after full bar
  }
}, 1000); // 10 seconds total

// -------------------- Cart Logic --------------------
let cart = [];

// Add to Cart
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    let quantityInput = button.previousElementSibling;
    let quantity = parseInt(quantityInput.value) || 1;

    let product = {
      name: button.dataset.name,
      length: button.dataset.length,
      price: parseInt(button.dataset.price),
      quantity: quantity
    };

    cart.push(product);
    updateCart();
  });
});

// Update Cart Display
function updateCart() {
  let cartList = document.getElementById("cart-items");
  let total = 0;
  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;

    let li = document.createElement("li");
    li.classList.add("d-flex", "justify-content-between", "align-items-center");

    li.innerHTML = `
      <span>${item.name} - ${item.length} - R${item.price} x ${item.quantity} = R${itemTotal}</span>
      <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Remove</button>
    `;

    cartList.appendChild(li);
  });

  document.getElementById("cart-total").textContent = `Total: R${total}`;
  document.getElementById("cart-count").textContent = cart.length; // navbar badge
  document.getElementById("floating-cart-count").textContent = cart.length; // floating badge

  // Attach remove button events
  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      let index = button.dataset.index;
      cart.splice(index, 1);
      updateCart();
    });
  });
}

// Clear Cart
document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  updateCart();
});

// Checkout via WhatsApp
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  let message = "Hello Hair Van Studio! I'd like to order:\n\n";
  let total = 0;

  cart.forEach(item => {
    let itemTotal = item.price * item.quantity;
    message += `- ${item.name} (${item.length}) x${item.quantity} = R${itemTotal}\n`;
    total += itemTotal;
  });

  message += `\nGrand Total: R${total}\n\nPowered by TechInOp`;
  let whatsappUrl = `https://wa.me/27710872490?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
});

// -------------------- Floating Cart Scroll --------------------
function scrollToCart() {
  document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
}
