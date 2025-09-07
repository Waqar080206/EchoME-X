document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('createTwinForm');
  const loadingState = document.getElementById('loadingState');
  const twinForm = document.getElementById('twinForm');
  const personaInput = document.getElementById('twinPersona');
  const charCount = document.getElementById('charCount');

  // Character counter
  personaInput.addEventListener('input', function() {
    charCount.textContent = this.value.length;
  });

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name').trim();
    const persona = formData.get('persona').trim();

    // Validation
    if (!name || !persona) {
      showToast('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    if (persona.length < 50) {
      showToast('error', 'Validation Error', 'Persona description must be at least 50 characters');
      return;
    }

    try {
      // Show loading state
      twinForm.classList.add('d-none');
      loadingState.classList.remove('d-none');

      // Create twin
      const response = await window.echoAPI.createTwin(name, persona);

      if (response.success) {
        // Store twin info
        localStorage.setItem('currentTwin', JSON.stringify(response.data));
        
        showToast('success', 'Success!', response.message);
        
        // Redirect to chat after 2 seconds
        setTimeout(() => {
          window.location.href = 'chat.html';
        }, 2000);
      }

    } catch (error) {
      console.error('Creation error:', error);
      showToast('error', 'Creation Failed', error.message || 'Failed to create twin. Please try again.');
      
      // Show form again
      loadingState.classList.add('d-none');
      twinForm.classList.remove('d-none');
    }
  });
});