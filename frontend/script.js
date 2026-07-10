// Counter animation
const counters = document.querySelectorAll("[data-count]");

counters.forEach((counter) => {
  const target = Number(counter.dataset.count);
  const isPercent = counter.textContent.includes("%");
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);

    counter.textContent = isPercent ? `${value}%` : value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
});

// Copy to clipboard
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const originalText = button.textContent;

    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = "Copied";
    } catch (error) {
      button.textContent = "Copy";
    }

    setTimeout(() => {
      button.textContent = originalText;
    }, 1400);
  });
});

// Form handling for auth forms
document.addEventListener('DOMContentLoaded', function() {
  const authForm = document.querySelector('[data-auth-form]');
  
  if (authForm) {
    authForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const action = this.getAttribute('action');
      const messageElement = this.querySelector('.form-message');
      const submitButton = this.querySelector('button[type="submit"]');
      
      // Disable submit button while processing
      submitButton.disabled = true;
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Processing...';
      
      try {
        const response = await fetch(action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData))
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Show success message
          messageElement.style.color = '#4caf50';
          messageElement.textContent = data.message;
          
          // Redirect after 1.5 seconds
          setTimeout(() => {
            window.location.href = data.redirect;
          }, 1500);
        } else {
          // Show error message
          messageElement.style.color = '#f44336';
          messageElement.textContent = data.message;
          
          // Re-enable button
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      } catch (error) {
        messageElement.style.color = '#f44336';
        messageElement.textContent = 'An error occurred. Please try again.';
        
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }
});


