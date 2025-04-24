document.addEventListener('DOMContentLoaded', function() {
    // Get theme buttons
    const daylightBtn = document.getElementById('daylight');
    const nightHowlBtn = document.getElementById('night-howl');
    const nightMindBtn = document.getElementById('night-mind');
    
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('wolfix-theme') || 'daylight';
    
    // Apply the saved theme
    document.body.className = savedTheme;
    updateActiveButton(savedTheme);
    
    // Theme button click handlers
    daylightBtn.addEventListener('click', function() {
        setTheme('daylight');
    });
    
    nightHowlBtn.addEventListener('click', function() {
        setTheme('night-howl');
    });
    
    nightMindBtn.addEventListener('click', function() {
        setTheme('night-mind');
    });
    
    // Function to set theme
    function setTheme(themeName) {
        document.body.className = themeName;
        localStorage.setItem('wolfix-theme', themeName);
        updateActiveButton(themeName);
    }
    
    // Function to update active button state
    function updateActiveButton(activeTheme) {
        // Remove active class from all buttons
        daylightBtn.classList.remove('active');
        nightHowlBtn.classList.remove('active');
        nightMindBtn.classList.remove('active');
        
        // Add active class to the selected theme button
        if (activeTheme === 'daylight') {
            daylightBtn.classList.add('active');
        } else if (activeTheme === 'night-howl') {
            nightHowlBtn.classList.add('active');
        } else if (activeTheme === 'night-mind') {
            nightMindBtn.classList.add('active');
        }
    }
    
    // Add smooth scrolling effect for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});