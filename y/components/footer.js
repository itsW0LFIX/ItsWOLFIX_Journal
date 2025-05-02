// footer.js
document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = `
        <footer class="footer">
          <div class="container">
            <div class="footer-content">
              <!-- About Section -->
              <div class="footer-section">
                <h3>About WOLFIX Journal</h3>
                <p>A community-driven platform focused on technology, science, and innovation.</p>
                <a href="/community.html">Learn more about us</a>
              </div>
    
              <!-- Resources Section -->
              <div class="footer-section">
                <h3>GitHub Resources</h3>
                <ul>
                  <li>
                    <a href="https://github.com/WOLFIX-Journal/.github/blob/main/CODE_OF_CONDUCT.md">Code of
                      Conduct</a>
                  </li>
                  <li>
                    <a href="https://github.com/WOLFIX-Journal/.github/blob/main/CONTRIBUTING.md">Contributing
                      Guidelines</a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/WOLFIX-Journal/.github/blob/main/.github/ISSUE_TEMPLATE/bug_report.md">Report
                      a Bug</a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/WOLFIX-Journal/.github/blob/main/.github/PULL_REQUEST_TEMPLATE.md">Submit
                      a Pull Request</a>
                  </li>
                </ul>
              </div>
    
              <!-- Connect Section -->
              <div class="footer-section">
                <h3>Connect with Us</h3>
                <ul>
                  <li>
                    <a href="https://github.com/WOLFIX-Journal">GitHub</a>
                  </li>
                  <li>
                    <a href="https://github.com/itsW0LFIX">Contact Us</a>
                  </li>
                </ul>
              </div>
            </div>
    
            <div class="footer-bottom">
              <p>&copy; 2025 WOLFIX Journal. All rights reserved.</p>
            </div>
          </div>
        </footer>
      `;
    }
  });