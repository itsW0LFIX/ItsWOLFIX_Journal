document.addEventListener('DOMContentLoaded', function () {
    const headerPlaceholder = document.getElementById('Posts-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = `

                  <div class="post-grid" id="posts-container">
                <!-- 2.1 Posts -->
                <div class="post-card" data-categories="design ethics" data-title="Ethical Web Design Principles"
                    data-tags="ethics privacy accessibility">
                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(130, 80, 223, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #8250df;">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Ethical Web Design Principles</h3>
                            <p class="post-description">Exploring privacy-focused design, sustainable web practices, and
                                accessibility as an ethical imperative</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.1Posts-Ethical Web Design Principles/Ethical_Web_Design_Principles.html"
                                class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- 2.2 Posts -->
                <div class="post-card" data-categories="tech tutorials" data-title="Firebase Hosting"
                    data-tags="firebase hosting deployment">
                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(251, 146, 60, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #fb923c;">
                                <path d="m6 9 6-6 6 6"></path>
                                <path d="M12 3v18"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Firebase Hosting</h3>
                            <p class="post-description">Firebase Hosting: Building and Deploying High-Performance Web
                                Applications.</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.2Posts-Firebase Hosting/Firebase-Hosting.html" class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- 2.3 Posts -->
                <div class="post-card" data-categories="design tech"
                    data-title="Modern CSS Features You Should Be Using Today" data-tags="css web-design frontend">
                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(14, 165, 233, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #0ea5e9;">
                                <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z">
                                </path>
                                <path d="m8 10 4 4 4-4"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Modern CSS Features You Should Be Using Today</h3>
                            <p class="post-description">Powerful CSS capabilities that solve complex layout and design
                                challenges with less code.</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.3Posts-Modern CSS Features/Modern_CSS_Features.html" class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- 2.4 Posts -->
                <div class="post-card" data-categories="tech tutorials"
                    data-title="Building Offline-Capable Web Applications" data-tags="progressive-web-apps javascript">
                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(34, 197, 94, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #22c55e;">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Building Offline-Capable Web Applications</h3>
                            <p class="post-description">Create resilient web apps that work regardless of network
                                conditions using service workers and modern APIs.</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.4Posts-Offline Capable Web Applications/Offline_Capable_Web_Applications.html"
                                class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- 2.5 Posts -->
                <div class="post-card" data-categories="design" data-title="Sustainable Digital Product Design"
                    data-tags="sustainability performance green-web">
                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(16, 185, 129, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #10b981;">
                                <path d="M2 22v-5l5-5 5 5-5 5z"></path>
                                <path d="M9.5 14.5 16 8"></path>
                                <path d="m17 2 5 5-5 5-5-5z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Sustainable Digital Product Design</h3>
                            <p class="post-description">Reducing digital carbon footprints, energy-efficient web design,
                                and environmentally conscious development choices.</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.5Posts-Sustainable Digital Product Design/Sustainable_Digital_Product_Design.html"
                                class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- 2.6 Posts -->
                <div class="post-card" data-categories="design tech"
                    data-title="Web Animation Techniques with CSS and JavaScript" data-tags="css javascript animation">
                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(236, 72, 153, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #ec4899;">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Web Animation Techniques with CSS and JavaScript</h3>
                            <p class="post-description">Creating elegant, performant animations for modern web
                                interfaces using CSS and JavaScript.</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.6Posts-Web Animation Techniques/Web_Animation_Techniques.html"
                                class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- 2.7 Posts -->
                <div class="post-card" data-categories="other" data-title="Web Development Podcasts"
                    data-tags="resources podcasts learning">
                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(139, 92, 246, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #8b5cf6;">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Web Development Podcasts</h3>
                            <p class="post-description">Stay up to date with web development and entertained with these
                                top podcasts for developers.</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.7Posts-Web Development Podcasts/Web_Development_Podcasts.html"
                                class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- 2.8 Posts -->
                <div class="post-card" data-categories="css tech" data-title="Simple Trick To Debug Your CSS"
                    data-tags="css debugging web-development">
                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(20, 184, 166, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #14b8a6;">
                                <path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12z">
                                </path>
                                <circle cx="12" cy="12" r="1"></circle>
                                <path d="M12 7v4"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Simple Trick To Debug Your CSS</h3>
                            <p class="post-description">The fastest way to find misbehaving elements on the page using
                                the outline trick in CSS.</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.8Posts-Simple Trick To Debug Your CSS/Simple_Trick_To_Debug_Your_CSS.html"
                                class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- 2.9 Posts -->
                <div class="post-card" data-categories="design tools" data-title="Mastering Color Pickers for Web Development"
                    data-tags="color-pickers design web-development tools">
                    <div class="post-icon-container">
                        <div class="post-icon" style="background-color: rgba(52, 152, 219, 0.1);">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="color: #3498db;">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M8 12a4 4 0 0 1 8 0c0 1.5 0 2 -2 3h-4c-2 -1 -2 -1.5 -2 -3"></path>
                                <line x1="12" y1="17" x2="12" y2="17"></line>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Mastering Color Pickers for Web Development</h3>
                            <p class="post-description">Learn about different types of color pickers, how to implement them, and best practices for color selection in web projects.</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.9Posts-Mastering Color Pickers for Web Development/color-pickers.html" class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- 2.10 Posts -->
                <div class="post-card" data-categories="javascript,development,beginner" data-title="How to Think Like a Developer" data-tags="javascript,problem-solving,beginner,mindset">
                    <div class="post-icon-container">
                        <div class="post-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-code">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">How to Think Like a Developer</h3>
                            <p class="post-description">Break down problems, build solutions step by step, and develop the mindset needed to solve coding challenges effectively.</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.10Posts-how-to-think-like-a-developer/how-to-think-like-a-developer.html" class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- 2.11 Posts -->
                <div class="post-card" data-categories="javascript,websockets,node.js,real-time" data-title="Build a Real-time Chat Application with WebSockets" data-tags="javascript,websockets,node.js,real-time">
                    <div class="post-icon-container">
                        <div class="post-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-header">
                            <h3 class="post-title">Build a Real-time Chat Application with WebSockets</h3>
                            <p class="post-description">Learn how to create a bidirectional chat application using WebSockets, handling multiple connections and real-time communication.</p>
                        </div>
                        <div class="post-footer">
                            <a href="2.11Posts-Build a Real-time Chat Application with WebSockets/build-a-real-time-chat-application-with-websockets.html" class="post-action">Open</a>
                        </div>
                    </div>
                </div>

                <!-- No results message -->
                <div class="no-results hidden">
                    <p>No posts match your search. Try different keywords or categories.</p>
                </div>
            </div>

      `;
    }
});