document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = `
        <header>
          <a href="/index.html" class="logo">
            <img style="width: 25px; margin: -6px;" src="/icon2.png" alt="icon logo">
            ItsWOLFIX.Journal
          </a>
          <nav aria-label="Main navigation">
            <ul>
              <a href="/index.html">Home</a>
              <a href="/Posts.html">Posts</a>
              <a href="/projects.html">Projects</a>
              <li><a href="https://github.com/itsW0LFIX">About</a></li>
            </ul>
          </nav>
        </header>
        
        <div class="theme-toggle">
          <button id="daylight" class="theme-button active">🌞 Daylight</button>
          <button id="night-howl" class="theme-button">🐺 Night Howl</button>
          <button id="night-mind" class="theme-button">🧠 Night Mind</button>
        </div>
      `;
    }
  });