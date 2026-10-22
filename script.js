    //  alert('Welcome to Handcraft | Home Decor!  Explore our unique collection of handmade home decor items. Enjoy your shopping experience!');

     const nav = document.getElementById('mainNav');
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.getElementById('navLinks');

        if (menuToggle && nav && navLinks) {
            menuToggle.addEventListener('click', () => {
                const isOpen = nav.classList.toggle('open');
                menuToggle.setAttribute('aria-expanded', String(isOpen));
                menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
            });

            navLinks.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', () => {
                    nav.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.setAttribute('aria-label', 'Open menu');
                });
            });
        }

        const checkoutForm = document.getElementById('checkout-form');
        const productChoices = document.querySelectorAll('input[name="products"]');
        const selectedProducts = document.getElementById('selected-products');
        const checkoutTotal = document.getElementById('checkout-total');
        const checkoutStatus = document.getElementById('checkout-status');
        const checkoutReview = document.getElementById('checkout-review');
        const reviewOrderDetails = document.getElementById('review-order-details');
        const confirmOrder = document.getElementById('confirm-order');
        const editOrder = document.getElementById('edit-order');
        const closeOrderReview = document.getElementById('close-order-review');
        const orderSendOptions = document.getElementById('order-send-options');
        const whatsappOrderLink = document.getElementById('whatsapp-order-link');
        const emailOrderLink = document.getElementById('email-order-link');
        const orderNumber = `HC-${Date.now().toString(36).toUpperCase()}`;

        if (
            checkoutForm &&
            selectedProducts &&
            checkoutTotal &&
            checkoutStatus &&
            checkoutReview &&
            reviewOrderDetails &&
            confirmOrder &&
            editOrder &&
            closeOrderReview &&
            orderSendOptions &&
            whatsappOrderLink &&
            emailOrderLink
        ) {
            const updateOrderSummary = () => {
                const selected = Array.from(productChoices).filter((choice) => choice.checked);
                selectedProducts.replaceChildren();

                if (selected.length === 0) {
                    const emptyItem = document.createElement('li');
                    emptyItem.className = 'empty-selection';
                    emptyItem.textContent = 'No collections selected yet.';
                    selectedProducts.append(emptyItem);
                    checkoutTotal.value = '₹0';
                    return;
                }

                const total = selected.reduce((sum, choice) => {
                    const price = Number(choice.dataset.price);
                    return sum + (Number.isFinite(price) ? price : 0);
                }, 0);

                selected.forEach((choice) => {
                    const item = document.createElement('li');
                    item.textContent = `${choice.value} — From ₹${choice.dataset.price}`;
                    selectedProducts.append(item);
                });
                checkoutTotal.value = `From ₹${total}`;
            };

            const resetReview = () => {
                checkoutStatus.textContent = '';
                if (checkoutReview.open) {
                    checkoutReview.close();
                }
                orderSendOptions.hidden = true;
            };

            productChoices.forEach((choice) => {
                choice.addEventListener('change', () => {
                    resetReview();
                    updateOrderSummary();
                });
            });

            checkoutForm.querySelectorAll('input:not([name="products"]), textarea, select').forEach((field) => {
                field.addEventListener('input', resetReview);
                field.addEventListener('change', resetReview);
            });

            checkoutForm.addEventListener('submit', (event) => {
                event.preventDefault();

                if (!Array.from(productChoices).some((choice) => choice.checked)) {
                    checkoutStatus.textContent = 'Select at least one collection to review your order.';
                    productChoices[0].focus();
                    return;
                }

                if (!checkoutForm.reportValidity()) {
                    return;
                }

                const formData = new FormData(checkoutForm);
                const customer = {
                    name: formData.get('customerName').trim(),
                    email: formData.get('customerEmail').trim(),
                    phone: formData.get('customerPhone').trim(),
                    address: formData.get('deliveryAddress').trim(),
                    location: formData.get('deliveryLocation').trim(),
                    contactMethod: formData.get('contactMethod')
                };
                const items = Array.from(productChoices)
                    .filter((choice) => choice.checked)
                    .map((choice, index) => {
                        const price = Number(choice.dataset.price);
                        return {
                            number: index + 1,
                            name: choice.value,
                            description: choice.closest('.products').querySelector('.demopara p').textContent.trim(),
                            price
                        };
                    });
                const total = items.reduce((sum, item) => sum + item.price, 0);
                const currency = (amount) => `₹${amount.toLocaleString('en-IN')}`;
                const orderMessage = [
                    'HANDCRAFT | HANDMADE PRODUCTS',
                    `Order No.: ${orderNumber}`,
                    '',
                    '1. CUSTOMER & DELIVERY DETAILS',
                    `Customer Name: ${customer.name}`,
                    `Email Address: ${customer.email}`,
                    `Contact Number: ${customer.phone}`,
                    `Delivery Address: ${customer.address}`,
                    `City / State / PIN Code: ${customer.location}`,
                    `Preferred Contact Method: ${customer.contactMethod}`,
                    '',
                    '2. ORDERED ITEMS',
                    'No. | Product / Collection | Description | Qty. | Est. Unit Price | Est. Line Total',
                    ...items.map((item) =>
                        `${item.number} | ${item.name} | ${item.description} | 1 | ${currency(item.price)} | ${currency(item.price)}`
                    ),
                    '',
                    `Estimated Subtotal: ${currency(total)}`,
                    'Final prices and availability to be confirmed by the seller.',
                    'Please confirm this order with me.'
                ].join('\n');
                const encodedMessage = encodeURIComponent(orderMessage);

                reviewOrderDetails.textContent = orderMessage;
                whatsappOrderLink.href = `https://wa.me/918972029588?text=${encodedMessage}`;
                emailOrderLink.href = `mailto:aniketsonai309@gmail.com?subject=${encodeURIComponent(`HandCraft Order ${orderNumber}`)}&body=${encodedMessage}`;
                orderSendOptions.hidden = true;
                checkoutStatus.textContent = 'Check your details and order below, then confirm to prepare your WhatsApp and email messages.';
                checkoutReview.showModal();
            });

            const closeReviewForEditing = () => {
                resetReview();
                checkoutStatus.textContent = 'You can edit your details or selected collections before reviewing again.';
                checkoutForm.querySelector('input[name="customerName"]').focus();
            };

            editOrder.addEventListener('click', closeReviewForEditing);
            closeOrderReview.addEventListener('click', () => checkoutReview.close());

            confirmOrder.addEventListener('click', () => {
                orderSendOptions.hidden = false;
                checkoutStatus.textContent = 'Your order details are ready. Choose WhatsApp or email in the order review to send them to the seller.';
                orderSendOptions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });

            emailOrderLink.addEventListener('click', () => {
                checkoutStatus.textContent = 'Your email app should open with the order addressed to the seller. Press Send in that app to submit it.';
            });

            checkoutReview.addEventListener('close', () => {
                orderSendOptions.hidden = true;
            });

            updateOrderSummary();
        }