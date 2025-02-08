document.addEventListener("DOMContentLoaded", function () {
  console.log("Cart.js is loaded!");

  const cartButtons = document.querySelectorAll(".cart-button");

  if (cartButtons.length === 0) {
    console.error("No 'ADD CART' buttons found! Check your HTML.");
  }

  cartButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      let product = event.target.closest("li");

      if (!product) {
        console.error("Could not find product element.");
        return;
      }

      let productName =
        product.querySelector(".product-name")?.innerText || "Unknown Product";
      let productPrice = product.querySelector(".price")?.innerText || "₹0";
      let productImage = product.querySelector("img")?.src || "";

      let numericPrice = parseFloat(productPrice.replace(/[^\d.]/g, "")) || 0;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let existingProduct = cart.find((item) => item.name === productName);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({
          name: productName,
          price: numericPrice,
          image: productImage,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      showNotification(`${productName} added to cart!`);
    });
  });

  function showNotification(message) {
    let notification = document.createElement("div");
    notification.innerText = message;
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.background = "black";
    notification.style.color = "white";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.zIndex = "1000";
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
});

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItemsContainer = document.getElementById("cart-items");
  let cartTotal = 0;
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("cart-total").innerText = "₹0";
    return;
  }

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity; // Fixed calculation
    cartTotal += itemTotal;

    cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" width="80">
                <div>
                    <h4>${item.name}</h4>
                    <p>Price: ₹${item.price.toFixed(2)}</p>
                    <p>Quantity: 
                        <button onclick="updateQuantity(${index}, -1)">-</button> 
                        ${item.quantity} 
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </p>
                    <button onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        `;
  });

  document.getElementById("cart-total").innerText = "₹" + cartTotal.toFixed(2); // Ensures correct decimal format
}

function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1); // Remove if quantity goes to 0
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1); // Remove the item at index
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  loadCart();
}

document.addEventListener("DOMContentLoaded", loadCart);
