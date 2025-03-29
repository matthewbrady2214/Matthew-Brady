document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(event) {
        // Optional: Add validation here if needed
        
        // Show sending state
        const submitButton = form.querySelector('.submit-btn');
        const originalText = submitButton.innerText;
        submitButton.innerText = 'Sending...';
        submitButton.disabled = true;
        
        // Form will submit normally to Formspree
        // This code just handles the UI feedback
        
        // You could add AJAX submission instead if preferred
        // In that case, uncomment the following and comment out the above
        /*
        event.preventDefault();
        
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Success
                alert('Thank you! Your message has been sent.');
                form.reset();
            } else {
                // Error
                alert('Oops! There was a problem submitting your form.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Oops! Something went wrong. Please try again later.');
        })
        .finally(() => {
            submitButton.innerText = originalText;
            submitButton.disabled = false;
        });
        */
    });
});