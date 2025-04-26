document.addEventListener('DOMContentLoaded', function () {
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
    daylightBtn.addEventListener('click', function () {
        setTheme('daylight');
    });

    nightHowlBtn.addEventListener('click', function () {
        setTheme('night-howl');
    });

    nightMindBtn.addEventListener('click', function () {
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
        anchor.addEventListener('click', function (e) {
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

// Create code highlight
document.addEventListener('DOMContentLoaded', function () {
    // Only process code blocks when in a blog post
    if (!document.querySelector('.blog-post')) return;

    // Find all code blocks
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((codeBlock, index) => {
        // Wrap in a container for styling
        const container = document.createElement('div');
        container.className = 'code-container';

        // Get the language from the class if available (e.g., "language-javascript")
        const codeClassNames = Array.from(codeBlock.classList);
        const languageClass = codeClassNames.find(className => className.startsWith('language-'));
        const language = languageClass ? languageClass.replace('language-', '') : 'plaintext';

        // Create language label
        const languageLabel = document.createElement('div');
        languageLabel.className = 'code-language';
        languageLabel.textContent = language;

        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');

        // Header container for language and copy button
        const headerContainer = document.createElement('div');
        headerContainer.className = 'code-header';
        headerContainer.appendChild(languageLabel);
        headerContainer.appendChild(copyButton);

        // Copy functionality
        copyButton.addEventListener('click', function () {
            // Get text content
            const textToCopy = codeBlock.textContent;

            // Use Clipboard API if available
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => {
                            copyButton.textContent = 'Copy';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        copyButton.textContent = 'Error';
                        setTimeout(() => {
                            copyButton.textContent = 'Copy';
                        }, 2000);
                    });
            } else {
                // Fallback for browsers without Clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                    copyButton.textContent = 'Error';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                }

                document.body.removeChild(textArea);
            }
        });

        // Add line numbers
        const codeLines = codeBlock.innerHTML.split('\n');
        let numberedCode = '';

        codeLines.forEach((line, lineIndex) => {
            if (lineIndex === codeLines.length - 1 && line.trim() === '') return;
            numberedCode += `<span class="code-line">${line}</span>`;
        });

        codeBlock.innerHTML = numberedCode;

        // Rearrange the DOM
        const preElement = codeBlock.parentNode;
        container.appendChild(headerContainer);

        // Move the code block to our new container
        preElement.parentNode.insertBefore(container, preElement);
        container.appendChild(preElement);
    });
});

// Create mobile nav
document.addEventListener('DOMContentLoaded', function () {
    // Create the hamburger menu button
    const header = document.querySelector('header');
    const nav = document.querySelector('header nav');

    if (!header || !nav) return;

    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.className = 'hamburger-menu';
    hamburgerBtn.setAttribute('aria-label', 'Toggle navigation menu');
    hamburgerBtn.innerHTML = `
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
    `;

    // Insert the hamburger button into the header
    header.insertBefore(hamburgerBtn, nav);

    // Add mobile nav class to help with styling
    nav.classList.add('desktop-nav');

    // Create mobile nav container
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.appendChild(nav.querySelector('ul').cloneNode(true));
    document.body.appendChild(mobileNav);

    // Toggle menu on click
    hamburgerBtn.addEventListener('click', function () {
        hamburgerBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Close menu when clicking anywhere else
    document.addEventListener('click', function (event) {
        if (mobileNav.classList.contains('active') &&
            !mobileNav.contains(event.target) &&
            !hamburgerBtn.contains(event.target)) {
            hamburgerBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    // Close menu when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburgerBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });

    // Update nav display on window resize
    function checkWindowSize() {
        if (window.innerWidth >= 768) {
            hamburgerBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }

    window.addEventListener('resize', checkWindowSize);
    checkWindowSize(); // Initial check
});

// Create footer
document.addEventListener('DOMContentLoaded', function () {
    // Handle subscription form
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email) {
                // Show success message
                const button = this.querySelector('button');
                const originalText = button.textContent;

                button.textContent = 'Subscribed!';
                emailInput.disabled = true;
                button.disabled = true;

                // Here you would typically send the email to your backend
                console.log('Email subscription:', email);

                // Reset form after 3 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    emailInput.value = '';
                    emailInput.disabled = false;
                    button.disabled = false;
                }, 3000);
            }
        });
    }

    // Generate dynamic tag cloud (in a real implementation, this would use actual tag data)
    const tagCloud = document.querySelector('.tag-cloud');
    if (tagCloud) {
        // This example just uses the existing tags, but in a real app
        // you would generate this based on your actual tag frequency
        const tags = Array.from(tagCloud.querySelectorAll('.footer-tag'));

        // Add some visual weight variation to simulate popularity
        tags.forEach((tag, index) => {
            // Alternate between slightly different sizes for visual interest
            if (index % 3 === 0) {
                tag.style.fontSize = '0.9rem';
            } else if (index % 3 === 1) {
                tag.style.fontSize = '0.8rem';
            } else {
                tag.style.fontSize = '0.75rem';
            }
        });
    }
});