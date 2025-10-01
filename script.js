// ====== CONFIGURATION ======
// Update the contract address (CA) below to change where the "Buy $HERB" button redirects
const HERB_CONTRACT_ADDRESS = "";
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.code-input');
    const proceedBtn = document.getElementById('proceedBtn');
    const getCodeBtn = document.getElementById('getCodeBtn');
    const buyHerbBtn = document.getElementById('buyHerbBtn');
    const form = document.getElementById('codeForm');

    // Auto-focus first input
    inputs[0].focus();

    // Handle input navigation and validation
    inputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only allow alphanumeric characters
            if (!/^[a-zA-Z0-9]$/.test(value) && value !== '') {
                e.target.value = '';
                return;
            }

            // Convert to uppercase
            e.target.value = value.toUpperCase();

            // Add completed animation
            if (value) {
                e.target.classList.add('completed');
                setTimeout(() => {
                    e.target.classList.remove('completed');
                }, 300);
            }

            // Auto-advance to next input
            if (value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }

            // Check if all inputs are filled
            updateProceedButton();
        });

        input.addEventListener('keydown', function(e) {
            // Handle backspace navigation
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
                inputs[index - 1].value = '';
                updateProceedButton();
            }

            // Handle arrow key navigation
            if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }

            // Handle Enter key
            if (e.key === 'Enter') {
                e.preventDefault();
                if (isCodeComplete()) {
                    handleProceed();
                }
            }
        });

        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            const cleanData = pastedData.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            
            // Fill inputs with pasted data
            for (let i = 0; i < Math.min(cleanData.length, inputs.length - index); i++) {
                inputs[index + i].value = cleanData[i];
            }
            
            // Focus next empty input or last input
            const nextIndex = Math.min(index + cleanData.length, inputs.length - 1);
            inputs[nextIndex].focus();
            
            updateProceedButton();
        });
    });

    function isCodeComplete() {
        return Array.from(inputs).every(input => input.value.trim() !== '');
    }

    function updateProceedButton() {
        proceedBtn.disabled = !isCodeComplete();
    }

    function getCode() {
        return Array.from(inputs).map(input => input.value).join('');
    }

    function handleProceed() {
        if (!isCodeComplete()) {
            // Highlight empty inputs
            inputs.forEach(input => {
                if (!input.value) {
                    input.style.borderColor = '#f44336';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 2000);
                }
            });
            return;
        }

        const code = getCode();
        
        // Add loading state
        proceedBtn.textContent = 'Verifying...';
        proceedBtn.disabled = true;

        // Simulate verification (replace with actual API call)
        setTimeout(() => {
            // For demo purposes, accept any 5-character code
            if (code.length === 5) {
                showSuccess();
            } else {
                showError('Invalid code format');
            }
        }, 1500);
    }

    function showSuccess() {
        proceedBtn.textContent = 'Success!';
        proceedBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)';
        
        // In a real app, you would redirect or proceed to the next step
        setTimeout(() => {
            alert('Welcome to Herb! (This is a demo)');
            resetForm();
        }, 1000);
    }

    function showError(message) {
        proceedBtn.textContent = 'Invalid Code';
        proceedBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
        
        // Shake animation for inputs
        inputs.forEach(input => {
            input.style.animation = 'shake 0.5s ease-in-out';
        });
        
        setTimeout(() => {
            resetForm();
            inputs.forEach(input => {
                input.style.animation = '';
            });
        }, 2000);
    }

    function resetForm() {
        proceedBtn.textContent = 'Proceed';
        proceedBtn.style.background = '';
        proceedBtn.disabled = true;
        inputs[0].focus();
    }

    function clearInputs() {
        inputs.forEach(input => {
            input.value = '';
        });
        updateProceedButton();
        inputs[0].focus();
    }

    // Event listeners
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleProceed();
    });

    getCodeBtn.addEventListener('click', function() {
        // Redirect to Twitter/X to request an invite code
        window.open('https://x.com/intent/post?text=I%20want%20to%20farm%20%24HERB%20on%20playherbone.fun%21%20%40PlayHerbOne%20give%20me%20a%20access%20code%21%20%F0%9F%94%91', '_blank');
    });

    buyHerbBtn.addEventListener('click', function() {
        if (HERB_CONTRACT_ADDRESS === "YOUR_CONTRACT_ADDRESS_HERE") {
            // Show alert if CA hasn't been configured yet
            alert('Contract address not configured yet. Please update HERB_CONTRACT_ADDRESS in script.js');
        } else {
            // Redirect to pump.fun with the configured contract address
            window.open(`https://pump.fun/coin/${HERB_CONTRACT_ADDRESS}`, '_blank');
        }
    });

    // Add shake animation to CSS
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // Initialize button state
    updateProceedButton();
});