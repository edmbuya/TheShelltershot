// TheShelteredShot BnB Website JavaScript

// Initialize EmailJS
(function() {
    emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual EmailJS public key
})();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeDatePickers();
    initializePropertyFilters();
    initializeBookingFlow();
    initializeFormValidation();
    initializeSmoothScrolling();
    initializeAnimations();
    
    console.log('TheShelteredShot website initialized successfully!');
});

// Date Picker Initialization
function initializeDatePickers() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Search form date pickers
    const checkinPicker = flatpickr("#checkin", {
        minDate: "today",
        defaultDate: today,
        onChange: function(selectedDates) {
            checkoutPicker.set('minDate', selectedDates[0] || today);
        }
    });
    
    const checkoutPicker = flatpickr("#checkout", {
        minDate: tomorrow,
        defaultDate: tomorrow
    });
    
    // Booking form date pickers
    const bookingCheckinPicker = flatpickr("#bookingCheckin", {
        minDate: "today",
        defaultDate: today,
        onChange: function(selectedDates) {
            bookingCheckoutPicker.set('minDate', selectedDates[0] || today);
            updateBookingSummary();
        }
    });
    
    const bookingCheckoutPicker = flatpickr("#bookingCheckout", {
        minDate: tomorrow,
        defaultDate: tomorrow,
        onChange: function() {
            updateBookingSummary();
        }
    });
}

// Property Filter System
function initializePropertyFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const propertyItems = document.querySelectorAll('.property-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter properties
            propertyItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Booking Flow Management
function initializeBookingFlow() {
    // Handle property selection buttons
    const bookPropertyButtons = document.querySelectorAll('.book-property-btn');
    bookPropertyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const property = this.getAttribute('data-property');
            const price = this.getAttribute('data-price');
            
            // Set the property in the booking form
            const propertySelect = document.getElementById('selectedProperty');
            propertySelect.value = `${property}|${price}`;
            
            // Scroll to booking section
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            
            // Update summary
            updateBookingSummary();
        });
    });
    
    // Handle property selection change
    document.getElementById('selectedProperty').addEventListener('change', updateBookingSummary);
    document.getElementById('guestCount').addEventListener('change', updateBookingSummary);
}

// Update Booking Summary
function updateBookingSummary() {
    const propertySelect = document.getElementById('selectedProperty');
    const checkinDate = document.getElementById('bookingCheckin').value;
    const checkoutDate = document.getElementById('bookingCheckout').value;
    const guestCount = document.getElementById('guestCount').value;
    
    if (!propertySelect.value || !checkinDate || !checkoutDate) {
        document.getElementById('bookingSummary').style.display = 'none';
        return;
    }
    
    const [propertyName, pricePerNight] = propertySelect.value.split('|');
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * parseInt(pricePerNight);
    
    // Update summary display
    document.getElementById('summaryProperty').textContent = propertyName;
    document.getElementById('summaryDates').textContent = `${checkin.toLocaleDateString()} - ${checkout.toLocaleDateString()}`;
    document.getElementById('summaryNights').textContent = `${nights} night${nights > 1 ? 's' : ''}`;
    document.getElementById('summaryRate').textContent = `$${parseInt(pricePerNight).toLocaleString()}`;
    document.getElementById('summaryTotal').textContent = `$${totalPrice.toLocaleString()}`;
    
    document.getElementById('bookingSummary').style.display = 'block';
}

// Booking Step Navigation
function nextStep(stepNumber) {
    // Validate current step
    const currentStep = document.querySelector('.booking-step.active');
    const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
    
    if (!validateStep(currentStepNumber)) {
        return;
    }
    
    // Hide current step
    currentStep.classList.remove('active');
    
    // Show next step
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Update step indicator
    updateStepIndicator(stepNumber);
    
    // Update final summary if going to step 3
    if (stepNumber === 3) {
        updateFinalSummary();
    }
}

function previousStep(stepNumber) {
    // Hide current step
    document.querySelector('.booking-step.active').classList.remove('active');
    
    // Show previous step
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Update step indicator
    updateStepIndicator(stepNumber);
}

function updateStepIndicator(activeStep) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 <= activeStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function validateStep(stepNumber) {
    switch(stepNumber) {
        case 1:
            const property = document.getElementById('selectedProperty').value;
            const checkin = document.getElementById('bookingCheckin').value;
            const checkout = document.getElementById('bookingCheckout').value;
            const guests = document.getElementById('guestCount').value;
            
            if (!property || !checkin || !checkout || !guests) {
                showAlert('Please fill in all required fields before continuing.', 'warning');
                return false;
            }
            
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            if (checkoutDate <= checkinDate) {
                showAlert('Check-out date must be after check-in date.', 'warning');
                return false;
            }
            
            return true;
            
        case 2:
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            
            if (!firstName || !lastName || !email || !phone) {
                showAlert('Please fill in all required guest details.', 'warning');
                return false;
            }
            
            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address.', 'warning');
                return false;
            }
            
            return true;
            
        default:
            return true;
    }
}

function updateFinalSummary() {
    const propertySelect = document.getElementById('selectedProperty');
    const [propertyName, pricePerNight] = propertySelect.value.split('|');
    const checkin = new Date(document.getElementById('bookingCheckin').value);
    const checkout = new Date(document.getElementById('bookingCheckout').value);
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * parseInt(pricePerNight);
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    const summaryHTML = `
        <div class="summary-item">
            <span>Guest:</span>
            <span>${firstName} ${lastName}</span>
        </div>
        <div class="summary-item">
            <span>Email:</span>
            <span>${email}</span>
        </div>
        <div class="summary-item">
            <span>Phone:</span>
            <span>${phone}</span>
        </div>
        <div class="summary-item">
            <span>Property:</span>
            <span>${propertyName}</span>
        </div>
        <div class="summary-item">
            <span>Dates:</span>
            <span>${checkin.toLocaleDateString()} - ${checkout.toLocaleDateString()}</span>
        </div>
        <div class="summary-item">
            <span>Nights:</span>
            <span>${nights} night${nights > 1 ? 's' : ''}</span>
        </div>
        <div class="summary-item">
            <span>Rate per night:</span>
            <span>$${parseInt(pricePerNight).toLocaleString()}</span>
        </div>
        <div class="summary-item total">
            <span>Total Amount:</span>
            <span>$${totalPrice.toLocaleString()}</span>
        </div>
    `;
    
    document.getElementById('finalSummary').innerHTML = summaryHTML;
}

// Complete Booking
function completeBooking() {
    const termsCheckbox = document.getElementById('termsAgree');
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    
    if (!termsCheckbox.checked) {
        showAlert('Please agree to the Terms and Conditions to continue.', 'warning');
        return;
    }
    
    if (!paymentMethod) {
        showAlert('Please select a payment method.', 'warning');
        return;
    }
    
    const bookingBtn = document.getElementById('completeBookingBtn');
    bookingBtn.classList.add('loading');
    bookingBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    
    // Send booking notification email and process booking
    sendBookingNotificationEmail()
        .then(() => {
            // Get booking details
            const propertySelect = document.getElementById('selectedProperty');
            const [propertyName, pricePerNight] = propertySelect.value.split('|');
            const totalPrice = calculateTotalPrice();
            const paymentMethodText = getPaymentMethodText(paymentMethod.value);
            
            // Show success message
            showSuccessModal(propertyName, totalPrice, paymentMethodText);
            
            // Reset button
            bookingBtn.classList.remove('loading');
            bookingBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>Complete Booking & Pay';
            
            // Reset form after delay
            setTimeout(() => {
                resetBookingForm();
            }, 3000);
        })
        .catch(error => {
            console.error('Error sending notification:', error);
            // Still show success to user, but log the error
            const propertySelect = document.getElementById('selectedProperty');
            const [propertyName, pricePerNight] = propertySelect.value.split('|');
            const totalPrice = calculateTotalPrice();
            const paymentMethodText = getPaymentMethodText(paymentMethod.value);
            
            showSuccessModal(propertyName, totalPrice, paymentMethodText);
            
            // Reset button
            bookingBtn.classList.remove('loading');
            bookingBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>Complete Booking & Pay';
            
            // Reset form after delay
            setTimeout(() => {
                resetBookingForm();
            }, 3000);
        });
}

// Helper Functions
function calculateTotalPrice() {
    const propertySelect = document.getElementById('selectedProperty');
    const [propertyName, pricePerNight] = propertySelect.value.split('|');
    const checkin = new Date(document.getElementById('bookingCheckin').value);
    const checkout = new Date(document.getElementById('bookingCheckout').value);
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    return nights * parseInt(pricePerNight);
}

function getPaymentMethodText(method) {
    switch(method) {
        case 'mpesa': return 'M-Pesa';
        case 'card': return 'Credit/Debit Card';
        case 'bank': return 'Bank Transfer';
        default: return 'Unknown';
    }
}

function generateBookingReference() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'RR-';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function showSuccessModal(propertyName, totalPrice, paymentMethod) {
    const reference = generateBookingReference();
    document.getElementById('successMessage').textContent = 
        `Your booking for ${propertyName} has been confirmed. Total amount: $${totalPrice.toLocaleString()} via ${paymentMethod}.`;
    document.getElementById('bookingReference').innerHTML = 
        `<strong>Booking Reference:</strong><br><span class="reference-number">${reference}</span>`;
    
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

function resetBookingForm() {
    // Reset to step 1
    document.querySelectorAll('.booking-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    updateStepIndicator(1);
    
    // Clear form fields
    document.getElementById('selectedProperty').value = '';
    document.getElementById('guestCount').value = '1';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('specialRequests').value = '';
    document.getElementById('termsAgree').checked = false;
    
    // Clear payment selection
    document.querySelectorAll('input[name="payment"]').forEach(radio => radio.checked = false);
    
    // Hide booking summary
    document.getElementById('bookingSummary').style.display = 'none';
}

// Email Functions
function sendBookingNotificationEmail() {
    return new Promise((resolve, reject) => {
        const propertySelect = document.getElementById('selectedProperty');
        const [propertyName, pricePerNight] = propertySelect.value.split('|');
        const checkin = document.getElementById('bookingCheckin').value;
        const checkout = document.getElementById('bookingCheckout').value;
        const guests = document.getElementById('guestCount').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const specialRequests = document.getElementById('specialRequests').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const totalPrice = calculateTotalPrice();
        const reference = generateBookingReference();
        
        const templateParams = {
            to_email: 'reservations@theshelteredshot.co.ke',
            from_name: `${firstName} ${lastName}`,
            from_email: email,
            phone: phone,
            property: propertyName,
            checkin: checkin,
            checkout: checkout,
            guests: guests,
            total_price: totalPrice,
            payment_method: getPaymentMethodText(paymentMethod),
            special_requests: specialRequests || 'None',
            booking_reference: reference,
            message: `New booking request from ${firstName} ${lastName} for ${propertyName}.`
        };
        
        emailjs.send('default_service', 'booking_template', templateParams)
            .then(function(response) {
                console.log('Booking notification sent successfully:', response);
                resolve(response);
            }, function(error) {
                console.error('Failed to send booking notification:', error);
                reject(error);
            });
    });
}

function sendContactFormEmail(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    if (!name || !email || !subject || !message) {
        showAlert('Please fill in all required fields.', 'warning');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address.', 'warning');
        return;
    }
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    
    const templateParams = {
        to_email: 'info@theshelteredshot.co.ke',
        from_name: name,
        from_email: email,
        subject: subject,
        message: message
    };
    
    emailjs.send('default_service', 'contact_template', templateParams)
        .then(function(response) {
            console.log('Contact form sent successfully:', response);
            showAlert('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
        }, function(error) {
            console.error('Failed to send contact form:', error);
            showAlert('Sorry, there was an error sending your message. Please try again.', 'danger');
            
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
        });
}

// Form Validation
function initializeFormValidation() {
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', sendContactFormEmail);
    
    // Search form
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const location = document.getElementById('location').value;
        const roomType = document.getElementById('roomType').value;
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        
        if (!location || !roomType || !checkin || !checkout) {
            showAlert('Please fill in all search fields.', 'warning');
            return;
        }
        
        // Scroll to properties section
        document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
        
        // Filter properties based on room type
        const filterButton = document.querySelector(`[data-filter="${roomType}"]`);
        if (filterButton) {
            filterButton.click();
        }
        
        showAlert('Search completed! Showing available properties.', 'success');
    });
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();
    
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto remove alert after 5 seconds
    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alertElement);
            bsAlert.close();
        }
    }, 5000);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    // Handle navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .property-card, .contact-info').forEach(el => {
        observer.observe(el);
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    // Optionally show a user-friendly error message
    // showAlert('An unexpected error occurred. Please refresh the page.', 'danger');
});

// WhatsApp Integration
function sendWhatsAppMessage() {
    const name = document.getElementById('contactName').value || 'Customer';
    const email = document.getElementById('contactEmail').value || 'Not provided';
    const subject = document.getElementById('contactSubject').value || 'General Inquiry';
    const message = document.getElementById('contactMessage').value || 'Hello!';
    
    const whatsappMessage = `Hello! I'm ${name} and I'd like to inquire about your vacation rental services.

Subject: ${subject}
Email: ${email}

Message: ${message}

I'm interested in booking with TheShelteredShot. Can you help me?`;
    
    const phoneNumber = '254740062654';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappURL, '_blank');
}

// Console welcome message
console.log(`
🏠 TheShelteredShot - Luxury Vacation Rentals
🌟 Website loaded successfully!
📧 For support: info@theshelteredshot.co.ke
`);
