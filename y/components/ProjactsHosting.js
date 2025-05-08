document.addEventListener('DOMContentLoaded', function () {
    const headerPlaceholder = document.getElementById('Projacts-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = `
            <div class="post-grid" id="posts-container">

                <!-- Discord Clone -->
                <div class="post-card" data-categories="ui design firebase" data-title="Firebase Hosting"
                    data-tags="firebase hosting deployment">

                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(59, 130, 246, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #3b82f6;">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                    </div>

                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Discord Clone - Chat Interface Design</h3>
                            <p class="post-description">A UI/UX design project recreating Discord's chat interface with
                                server navigation, channel organization,
                                and responsive design</p>
                        </div>
                        <div class="post-footer">
                            <a href="1.1Projects-discord-clone/discord-clone.html" class="post-action">Open</a>
                        </div>
                    </div>

                </div>

                <!-- Events Gaming Platform -->
                <div class="post-card" data-categories="ui firebase " data-title="Firebase Hosting"
                    data-tags="firebase hosting deployment">

                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(14, 165, 233, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #0ea5e9;">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                        </div>
                    </div>

                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Events Gaming Platform - Community Tournament Management</h3>
                            <p class="post-description">A full-stack web application for organizing gaming tournaments,
                                managing teams, and fostering community engagement</p>
                        </div>
                        <div class="post-footer">
                            <a href="1.2Projects-events-gaming-platform/events-gaming-platform.html"
                                class="post-action">Open</a>
                        </div>
                    </div>

                </div>

                <!-- Random Numbers Guessing Game -->
                <div class="post-card" data-categories="programming" data-title="Random Numbers Guessing Game" 
    data-tags="c algorithms game-development">
    <div class="post-icon-container">
        <div class="post-icon" style="background-color: rgba(255, 118, 36, 0.1);">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" style="color: #ff7624;">
                <path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <circle cx="15.5" cy="8.5" r="1.5"></circle>
            </svg>
        </div>
    </div>
    <div class="post-content">
        <div class="post-header">
            <h3 class="post-title">Random Numbers Guessing Game</h3>
            <p class="post-description">A C programming challenge with customizable difficulty levels, smart feedback, and a persistent leaderboard system.</p>
        </div>
        <div class="post-footer">
            <a href="1.3Projects-Random-Numbers-Guessing-Game/random-numbers-guessing-game.html" class="post-action">Open</a>
        </div>
    </div>
</div>

      `;
    }
});