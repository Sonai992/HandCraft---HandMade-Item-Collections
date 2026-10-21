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

        if (checkoutForm && selectedProducts && checkoutTotal && checkoutStatus) {
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

            productChoices.forEach((choice) => {
                choice.addEventListener('change', () => {
                    checkoutStatus.textContent = '';
                    updateOrderSummary();
                });
            });

            checkoutForm.addEventListener('submit', (event) => {
                event.preventDefault();

                if (!Array.from(productChoices).some((choice) => choice.checked)) {
                    checkoutStatus.textContent = 'Select at least one collection to review your order.';
                    productChoices[0].focus();
                    return;
                }

                checkoutStatus.textContent = 'Order preview is ready. No order has been submitted and no payment has been taken.';
            });
        }