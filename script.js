.cart-list {
  list-style: none;
  padding: 0;
  margin: 1rem auto;
  max-width: 600px;
}
.cart-list li {
  background: linear-gradient(90deg, #0f2027, #2c5364);
  color: #ffe082;
  font-weight: 500;
  margin-bottom: 8px;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cart-list li button {
  background: #ff4d6d;
  border: none;
  color: white;
  font-weight: bold;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.cart-list li button:hover {
  background: #ff1f4d;
}

// -------------------- Floating Cart Scroll --------------------
function scrollToCart() {
  document.getElementById("cart").scrollIntoView({ behavior: "smooth" });
}
