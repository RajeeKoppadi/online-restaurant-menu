let cart = [];
function proceedToPayment() {
  const tableNumber = prompt('🍽️ Please enter your table number:');
  if (!tableNumber || isNaN(tableNumber)) {
    alert('❗ Please enter a valid table number.');
    return;
  }

  const paymentOption = confirm('💳 Would you like to pay via scanner?\nPress OK to pay via scanner or Cancel to pay at the cashier.');

  if (!paymentOption) {
    alert('🪑 Please proceed to the cashier for dine-in payment. Thank you!');
    return;
  }

  let qrWindow = window.open('', 'Scanner', 'height=500,width=400');
  qrWindow.document.write('<html><head><title>Scan to Pay</title>');
  qrWindow.document.write('<style>body{font-family: Arial; text-align: center; padding: 20px;} h2{color:#28a745;} img{max-width: 300px; margin: 20px auto; display: block;} button{padding: 10px 20px; background:#28a745; color:white; border:none; border-radius:5px; cursor:pointer;}</style>');
  qrWindow.document.write('</head><body>');
  qrWindow.document.write('<h2>📱 Scan the QR to Pay</h2>');
  qrWindow.document.write('<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=restaurant@upi&pn=FlavourFusion" alt="Scan QR">');
  qrWindow.document.write(`<button onclick="window.opener.postMessage({ table: '${tableNumber}' }, '*'); window.close();">✅ Payment Done</button>`);
  qrWindow.document.write('</body></html>');
  qrWindow.document.close();
}

function generateBill(tableNumber) {
  let billContent = '<html><head><title>Order Summary</title>';
  billContent += '<style>body{font-family: Arial; padding: 20px;} h1{font-size: 1.5rem; text-align: center;} h2{color:#ff6f61;} ul{list-style:none;padding:0;} li{margin-bottom:5px;} .note{margin-top:1rem;font-style:italic;color:green;} img.logo{width: 100px; display: block; margin: 0 auto 10px;} .final{margin-top:1rem; text-align:center; color:#444;}</style>';
  billContent += '</head><body>';
  billContent += '<img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/FF_logo.png/240px-FF_logo.png" alt="FF Logo">';

  billContent += '<h1>🍴 Flavour Fusion Restaurant</h1>';
  billContent += `<h2>🧾 Order Summary (Table ${tableNumber})</h2>`;

  let total = 0;
  billContent += '<ul>';
  cart.forEach(item => {
    const itemTotal = item.qty * item.price;
    billContent += `<li>• ${item.name} × ${item.qty} = ₹${itemTotal}</li>`;
    total += itemTotal;
  });
  billContent += '</ul>';
  billContent += `<p><strong>Total: ₹${total}</strong></p>`;
  billContent += '<p class="note">✅ Payment confirmed via scanner. Thank you for dining with us!</p>';
  billContent += '<p class="final">⌛ Please wait while your order is being prepared.<br>🙏 Thank you for your patience!</p>';

  const blob = new Blob([billContent + '</body></html>'], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `FlavourFusion_Receipt_Table${tableNumber}.html`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  let summaryWindow = window.open('', 'Print Receipt', 'height=600,width=400');
  summaryWindow.document.write(billContent);
  summaryWindow.document.write('</body></html>');
  summaryWindow.document.close();
  summaryWindow.print();
}

// Updated addToCart to increase quantity if item already exists
function addToCart(name, price) {
  const qtyInput = document.getElementById(`qty-${name}`);
  const qty = parseInt(qtyInput.value);

  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, price, qty });
  }
  updateCart();
  showPopup();
}

// Listen for message from QR popup window
window.addEventListener('message', function(event) {
  if (event.data && event.data.table) {
    generateBill(event.data.table);
  }
});

if (typeof renderMenu === 'function') {
  renderMenu();
}
