document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your Public Key
    emailjs.init('DFGGYPJp8CrVi6XXs');

    // Initialize users and cart
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Update navigation based on login status
    const navLinks = document.querySelector('nav ul');
    if (navLinks) {
        const loginLink = navLinks.querySelector('a[href="login.html"]');
        const dashboardLink = navLinks.querySelector('a[href="dashboard.html"]');
        
        if (currentUser) {
            // User is logged in
            if (loginLink) {
                loginLink.parentElement.innerHTML = '<a href="dashboard.html">Dashboard</a>';
            }
        } else {
            // User is not logged in
            if (dashboardLink) {
                dashboardLink.parentElement.innerHTML = '<a href="login.html">Login</a>';
            }
        }
    }

    // Video rotation (from index.html)
    const videos = ['video1.mp4', 'video2.mp4', 'video3.mp4'];
    let currentVideo = 0;
    const videoElement = document.getElementById('heroVideo');
    if (videoElement) {
        setInterval(() => {
            currentVideo = (currentVideo + 1) % videos.length;
            videoElement.src = videos[currentVideo];
        }, 10000);
    }

    // Scroll to top
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Add to cart from products page
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('Please login to add products to your cart.');
                window.location.href = 'login.html';
                return;
            }
            const product = {
                name: e.target.parentElement.querySelector('.card-title').textContent,
                price: parseFloat(e.target.parentElement.querySelector('.card-text').textContent.replace('$', '')),
                quantity: 1
            };
            const existingItem = cart.find(item => item.name === product.name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Product added to cart!');
        });
    });

    // Cart page rendering
    function renderCart() {
        const cartTable = document.getElementById('cartTable');
        const subtotalElement = document.getElementById('subtotal');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        if (!cartTable) return;

        if (cart.length === 0) {
            cartTable.parentElement.classList.add('d-none');
            emptyCartMessage.classList.remove('d-none');
            return;
        }

        cartTable.innerHTML = '';
        let subtotal = 0;

        cart.forEach((item, index) => {
            const total = item.price * item.quantity;
            subtotal += total;
            cartTable.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td><input type="number" class="form-control quantity-input" min="1" value="${item.quantity}" data-index="${index}"></td>
                    <td>$${total.toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm remove-item" data-index="${index}"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
        });

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.dataset.index;
                cart[index].quantity = parseInt(e.target.value);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
    }
    if (document.getElementById('cartTable')) renderCart();

    // Checkout page rendering
    const orderSummary = document.getElementById('orderSummary');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (orderSummary) {
        let subtotal = 0;
        cart.forEach(item => {
            const total = item.price * item.quantity;
            subtotal += total;
            orderSummary.innerHTML += `
                <div class="d-flex justify-content-between mb-2">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            `;
        });
        
        const shipping = 5.00;
        const total = subtotal + shipping;
        
        checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!checkoutForm.checkValidity()) {
                e.stopPropagation();
                checkoutForm.classList.add('was-validated');
                return;
            }

            // Save order to history
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const order = {
                userEmail: currentUser.email,
                items: cart,
                subtotal: parseFloat(checkoutSubtotal.textContent.replace('$', '')),
                shipping: 5.00,
                total: parseFloat(checkoutTotal.textContent.replace('$', '')),
                date: new Date().toISOString().split('T')[0]
            };
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            alert('Order placed successfully!');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = 'dashboard.html';
        });
    }

    // Blog page pagination (basic)
    const blogPagination = document.querySelectorAll('#blogPosts + nav .page-link');
    if (blogPagination.length > 0) {
        blogPagination.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Blog page clicked:', e.target.textContent);
            });
        });
    }

    // Login form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!loginForm.checkValidity()) {
                e.stopPropagation();
                loginForm.classList.add('was-validated');
                return;
            }

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('Login successful!');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password.');
            }
        });
    }

    // Register form validation
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!registerForm.checkValidity()) {
                e.stopPropagation();
                registerForm.classList.add('was-validated');
                return;
            }

            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;

            if (password !== confirmPassword) {
                document.getElementById('regConfirmPassword').setCustomValidity('Passwords do not match');
                registerForm.classList.add('was-validated');
                return;
            }

            const user = {
                fullName: document.getElementById('regFullName').value,
                email: document.getElementById('regEmail').value,
                phone: document.getElementById('regPhone').value,
                dob: document.getElementById('regDob').value,
                country: document.getElementById('regCountry').value,
                address: document.getElementById('regAddress').value,
                deliveryDetails: document.getElementById('regDeliveryDetails').value,
                role: document.getElementById('regRole').value,
                password: password
            };

            if (users.find(u => u.email === user.email)) {
                alert('Email already registered.');
                return;
            }

            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful! Please login.');
            registerForm.reset();
            document.getElementById('login-tab').click();
        });
    }

    // Contact form submission with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;

            // Send email using EmailJS
            emailjs.send('service_xy3c0hf', 'template_q89fubw', {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            })
            .then(() => {
                alert('Thank you for your message! We’ll get back to you soon.');
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            }, (error) => {
                alert('Failed to send message. Please try again later.');
                console.error('EmailJS error:', error);
            });
        });
    }

    // Newsletter subscription with EmailJS
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = form Roshiqa class="form-control" id="newsletterEmail" placeholder="Enter your email" required>
            if (!emailInput.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const email = emailInput.value;

            // Send newsletter subscription email using EmailJS
            emailjs.send('service_xy3c0hf', 'template_q89fubw', {
                from_name: 'Newsletter Subscriber',
                from_email: email,
                subject: 'Newsletter Subscription',
                message: `New newsletter subscription from ${email}`
            })
            .then(() => {
                alert('Thank you for subscribing to our newsletter!');
                form.reset();
                form.classList.remove('was-validated');
            }, (error) => {
                alert('Failed to subscribe. Please try again later.');
                console.error('EmailJS error:', error);
            });
        });
    });

    // Product filtering
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const catChicken = document.getElementById('catChicken');
    const catEggs = document.getElementById('catEggs');
    const applyFilters = document.getElementById('applyFilters');
    const productGrid = document.getElementById('productGrid');

    if (productGrid) {
        const products = Array.from(productGrid.getElementsByClassName('col'));

        priceRange.addEventListener('input', () => {
            priceValue.textContent = priceRange.value;
        });

        function filterProducts() {
            const searchText = searchInput.value.toLowerCase().trim();
            const maxPrice = parseFloat(priceRange.value);
            const chickenChecked = catChicken.checked;
            const eggsChecked = catEggs.checked;

            products.forEach(product => {
                const title = product.querySelector('.card-title').textContent.toLowerCase();
                const priceText = product.querySelector('.card-text').textContent.replace('$', '');
                const price = parseFloat(priceText);

                const isChicken = title.includes('chicken') || title.includes('cock') || title.includes('chicks') || title.includes('thigh') || title.includes('drumstick') || title.includes('breast') || title.includes('gizzar');
                const isEggs = title.includes('egg');

                const matchesSearch = searchText === '' || title.includes(searchText);
                const matchesPrice = price <= maxPrice;
                const matchesCategory = (!chickenChecked && !eggsChecked) || 
                                       (chickenChecked && isChicken) || 
                                       (eggsChecked && isEggs);

                if (matchesSearch && matchesPrice && matchesCategory) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        }

        searchBtn.addEventListener('click', filterProducts);
        applyFilters.addEventListener('click', filterProducts);
        searchInput.addEventListener('keypress', (e) => {
            e.preventDefault();
            if (e.key === 'Enter') {
                filterProducts();
            }
        });
        priceRange.addEventListener('change', filterProducts);
    }

    // Dashboard rendering
    const dashboard = document.getElementById('dashFullName');
    if (dashboard) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('dashFullName').textContent = currentUser.fullName;
        document.getElementById('dashEmail').textContent = currentUser.email;
        document.getElementById('dashPhone').textContent = currentUser.phone;
        document.getElementById('dashDob').textContent = currentUser.dob;
        document.getElementById('dashCountry').textContent = currentUser.country;
        document.getElementById('dashAddress').textContent = currentUser.address;
        document.getElementById('dashDeliveryDetails').textContent = currentUser.deliveryDetails;
        document.getElementById('dashRole').textContent = currentUser.role;

        if (currentUser.role === 'Admin') {
            document.getElementById('adminPanel').classList.remove('d-none');
        }

        const orderHistoryBody = document.getElementById('orderHistoryBody');
        const noOrdersMessage = document.getElementById('noOrdersMessage');
        const userOrders = orders.filter(o => o.userEmail === currentUser.email);

        if (userOrders.length === 0) {
            noOrdersMessage.classList.remove('d-none');
        } else {
            userOrders.forEach(order => {
                order.items.forEach(item => {
                    orderHistoryBody.innerHTML += `
                        <tr>
                            <td>${item.name}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                            <td>${order.date}</td>
                        </tr>
                    `;
                });
            });
        }

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
});