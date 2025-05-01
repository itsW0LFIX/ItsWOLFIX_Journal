document.addEventListener('DOMContentLoaded', function () {

    const daylightBtn = document.getElementById('daylight');
    const nightHowlBtn = document.getElementById('night-howl');
    const nightMindBtn = document.getElementById('night-mind');

    const savedTheme = localStorage.getItem('wolfix-theme') || 'daylight';

    document.body.className = savedTheme;
    updateActiveButton(savedTheme);

    daylightBtn.addEventListener('click', function () {
        setTheme('daylight');
    });

    nightHowlBtn.addEventListener('click', function () {
        setTheme('night-howl');
    });

    nightMindBtn.addEventListener('click', function () {
        setTheme('night-mind');
    });

    function setTheme(themeName) {
        document.body.className = themeName;
        localStorage.setItem('wolfix-theme', themeName);
        updateActiveButton(themeName);
    }

    function updateActiveButton(activeTheme) {

        daylightBtn.classList.remove('active');
        nightHowlBtn.classList.remove('active');
        nightMindBtn.classList.remove('active');

        if (activeTheme === 'daylight') {
            daylightBtn.classList.add('active');
        } else if (activeTheme === 'night-howl') {
            nightHowlBtn.classList.add('active');
        } else if (activeTheme === 'night-mind') {
            nightMindBtn.classList.add('active');
        }
    }

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
    if (!document.querySelector('.blog-post')) return;

    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((codeBlock, index) => {
        const container = document.createElement('div');
        container.className = 'code-container';

        const codeClassNames = Array.from(codeBlock.classList);
        const languageClass = codeClassNames.find(className => className.startsWith('language-'));
        const language = languageClass ? languageClass.replace('language-', '') : 'plaintext';

        const languageLabel = document.createElement('div');
        languageLabel.className = 'code-language';
        languageLabel.textContent = language;

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');

        const headerContainer = document.createElement('div');
        headerContainer.className = 'code-header';
        headerContainer.appendChild(languageLabel);
        headerContainer.appendChild(copyButton);

        copyButton.addEventListener('click', function () {
            const textToCopy = codeBlock.textContent;

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

        const codeLines = codeBlock.innerHTML.split('\n');
        let numberedCode = '';

        codeLines.forEach((line, lineIndex) => {
            if (lineIndex === codeLines.length - 1 && line.trim() === '') return;
            numberedCode += `<span class="code-line">${line}</span>`;
        });

        codeBlock.innerHTML = numberedCode;

        const preElement = codeBlock.parentNode;
        container.appendChild(headerContainer);

        preElement.parentNode.insertBefore(container, preElement);
        container.appendChild(preElement);
    });
});

// Create mobile nav
document.addEventListener('DOMContentLoaded', function () {
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

    header.insertBefore(hamburgerBtn, nav);

    nav.classList.add('desktop-nav');

    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.appendChild(nav.querySelector('ul').cloneNode(true));
    document.body.appendChild(mobileNav);

    hamburgerBtn.addEventListener('click', function () {
        hamburgerBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    document.addEventListener('click', function (event) {
        if (mobileNav.classList.contains('active') &&
            !mobileNav.contains(event.target) &&
            !hamburgerBtn.contains(event.target)) {
            hamburgerBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburgerBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });

    function checkWindowSize() {
        if (window.innerWidth >= 768) {
            hamburgerBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }

    window.addEventListener('resize', checkWindowSize);
    checkWindowSize();
});

// Create footer
document.addEventListener('DOMContentLoaded', function () {
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email) {
                const button = this.querySelector('button');
                const originalText = button.textContent;

                button.textContent = 'Subscribed!';
                emailInput.disabled = true;
                button.disabled = true;

                console.log('Email subscription:', email);

                setTimeout(() => {
                    button.textContent = originalText;
                    emailInput.value = '';
                    emailInput.disabled = false;
                    button.disabled = false;
                }, 3000);
            }
        });
    }

    const tagCloud = document.querySelector('.tag-cloud');
    if (tagCloud) {
        const tags = Array.from(tagCloud.querySelectorAll('.footer-tag'));

        tags.forEach((tag, index) => {
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