document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "americano", img: "1.jpg", price: 20000 },
      { id: 2, name: "coffee latte", img: "2.jpg", price: 25000 },
      { id: 3, name: " Avocado Espresso Coffee", img: "3.png", price: 45000 },
      { id: 4, name: "Espresso", img: "4.jpg", price: 40000 },
      { id: 5, name: "Vietnam coffee", img: "5.jpg", price: 60000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,

    add(newItem) {
      const itemCart = this.items.find((item) => item.id == newItem.id);

      if (!itemCart) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(itemId) {
      const itemCart = this.items.find((item) => item.id == itemId);

      if (itemCart) {
        if (itemCart.quantity > 1) {
          this.items = this.items.map((item) => {
            if (item.id !== itemId) {
              return item;
            } else {
              item.quantity--;
              item.total = item.price * item.quantity;
              this.quantity--;
              this.total -= item.price;
              return item;
            }
          });
        } else {
          this.items = this.items.filter((item) => item.id !== itemId);
          this.quantity--;
          this.total -= itemCart.price;
        }
      }
    },
  });
});

const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;
const form = document.querySelector("#checkoutForm");

// Fungsi untuk memeriksa apakah semua input form telah diisi
function checkForm() {
  let allFilled = true;
  for (let i = 0; i < form.elements.length; i++) {
    if (
      form.elements[i].type !== "submit" &&
      form.elements[i].type !== "button" &&
      form.elements[i].value.trim() === ""
    ) {
      allFilled = false;
      break;
    }
  }
  return allFilled;
}

// Event listener untuk setiap input form
form.addEventListener("input", function () {
  if (checkForm()) {
    checkoutButton.disabled = false;
    checkoutButton.classList.remove("disabled");
  } else {
    checkoutButton.disabled = true;
    checkoutButton.classList.add("disabled");
  }
});

// Event listener untuk tombol checkout
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
console.log(data)
  const message = formatMessage(data);

  window.open('http://wa.me/6281347058459?text=' + encodeURIComponent(message))
});

const formatMessage = (obj) => {
  return ` Data Customer
  Nama : ${obj.name}
Email : ${obj.email}
No HP :${obj.phone}

Data Pesanan
${JSON.parse(
  obj.items).map(
    (item) =>
      `${item.name} x ${item.quantity} x ${rupiah(item.total)} \n`
  )
}
  
  TOTAL : ${rupiah(obj.total)}`;
};
//format number

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
