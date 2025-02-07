/**
 * Generates the HTML for the control buttons in the main menu.
 * @returns {string} HTML string containing the control buttons
 */
function controlsButtonsHTML() {
  return /*html*/ `
  <div class="info-container">
    <div class="controls-nav">
      <button class="button-style credits-button" onclick="showControls()">
      Pepe Controls
      </button>
      <button
        class="button-style credits-button"
        onclick="showGameMechanics()"
      >
        How to Play
      </button>
    </div>
    <div id="info-content" class="info-content"></div>
  </div>
  `;
}

/**
 * Generates the HTML for the controls guide.
 * @returns {string} HTML string containing the controls guide
 */
function controlsHTML() {
  return /*html*/ `
    <div id="controls-content" class="controls-content">
      <h1>Pepe Controls</h1>
      <div class="controls-container">
        <div class="arrow-keys-container">
          <p>Use the arrow keys to move Pepe.</p>
          <div class="arrow-keys-content">
            <div class="up-key-container">
              <div class="arrow-key-border">
                <img class="arrow-key" src="img/arrow_up.png" alt="up" />
              </div>
              <p>Jump</p>
            </div>
            <div class="left-right-key-container">
              <div class="left-key-container">
                <div class="arrow-key-border">
                  <img class="arrow-key" src="img/arrow_left.png" alt="up" />
                </div>
                <p>Move Left</p>
              </div>
              <div class="right-key-container">
                <div class="arrow-key-border">
                  <img class="arrow-key" src="img/arrow_right.png" alt="up" />
                </div>
                <p>Move Right</p>
              </div>
            </div>
          </div>
        </div>
        <div class="special-controls-container">
          <div class="throw-bottle-container">
            <p>Press "D" to throw a bottle.</p>
            <div class="d-key-border">
              <p>D</p>
            </div>
          </div>
          <div class="restore-health-container">
            <p>Press "S" to restore health.</p>
            <div class="d-key-border">
              <p>S</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for the game mechanics guide.
 * @returns {string} HTML string containing the game mechanics guide
 */
function gameMechanicsHTML() {
  return /*html*/ `
  <div class="how-to-play-content" id="howtoplay">
    <h1>How to Play</h1>
    <div class="game-mechanics"> 
      <p class="mechanic-text">
        Collect
        <img
          class="icon-bottle"
          src="img/6_salsa_bottle/salsa_bottle.png"
          alt="Bottle"
        />
        to throw them at enemies.
      </p>
      <p class="mechanic-text">
        Keep an eye on your
        <img
          class="icon-bar"
          src="img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png"
          alt="Health Bar"
        />. Don't let it reach zero!
      </p>
      <p class="mechanic-text">
        Collect
        <img
          class="coin-icon"
          src="img/7_statusbars/3_icons/icon_coin.png"
          alt="Coin"
        />
        to fill the
        <img
          class="icon-bar"
          src="img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png"
          alt="Coin Bar"
        />. When full, press "S" to restore your health!
      </p>
      <p class="mechanic-text">
        Defeat the final boss to win the game! Use your
        <img
          class="icon-bottle"
          src="img/6_salsa_bottle/salsa_bottle.png"
          alt="Bottle"
        />
        wisely.
      </p>
    </div>
  </div>
  `;
}

/**
 * Generates the HTML for the play game button.
 * @returns {string} HTML string containing the play game button
 */
function playGameButtonHTML() {
  return /*html*/ `
    <button onclick="playGame()" id="playGameButton" class="play-game-button button-style">
      START GAME
    </button>
  `;
}

/**
 * Generates the HTML for the in-game menu.
 * @returns {string} HTML string containing the in-game menu
 */
function inGameMenuHTML() {
  return /*html*/ `
    <div class="in-game-menu-container background-color">
      <div class="in-game-menu-content">
        <h3 class="game-status-text">PAUSE</h3>
        <div class="in-game-menu-buttons">
        <button onclick="closeInGameMenu()" class="button-style menu-button" id="resume">Resume game</button>
        <button onclick="restartGame()" class="button-style menu-button" id="reset">Reset run</button>
        <button onclick="backToMenu()" class="button-style menu-button" id="backToMenu">Back to menu</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for the game over screen.
 * @param {object} gameState - The current game state
 * @returns {string} HTML string containing the game over screen
 */
function gameOverHTML(gameState) {
  return /*html*/ `
    <div class="in-game-menu-container">
      <div class="in-game-menu-content">
        <h3 class="game-status-text">You ${gameState.won ? "won" : "lost"}</h3>
        <p>Time: ${gameState.finalTime}</p>
        <div class="in-game-menu-buttons">
        <button onclick="restartGame()" class="button-style menu-button" id="reset">Reset run</button>
        <button onclick="backToMenu()" class="button-style menu-button" id="backToMenu">Back to menu</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for the credits buttons.
 * @returns {string} HTML string containing the credits buttons
 */
function creditsButtonsHTML() {
  return /*html*/ `
    <div class="credits-container">
      <div class="credits-buttons">
        <button
          data-section="privacyPolicy"
          class="button-style credits-button"
        >
          Privacy policy
        </button>
        <button data-section="legalNotice" class="button-style credits-button">
          Legal notice
        </button>
      </div>
      <div id="credits-content" class="credits-content"></div>
    </div>
  `;
}

/**
 * Generates the HTML for the legal notice.
 * @returns {string} HTML string containing the legal notice
 */
function legalNoticeHTML() {
  return /*html*/ `
    <div class="legal-notice-container">
      <h1>Imprint</h1>
      <h2>Information in accordance with Section 5 TMG</h2>
      <p>Max Mustermann</p>
      <p>Musterstraße 96a</p>
      <p>60528 Frankfurt am Main</p>
      <p></p>
      <h2>Contact</h2>
      <p>max.mustermann@gmail.com</p>
      <p>+49 123 456 7890</p>
    </div>
  `;
}

/**
 * Generates the HTML for the privacy policy.
 * @returns {string} HTML string containing the privacy policy
 */
function privacyPolicyHTML() {
  return /*html*/ `
      <div class="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <p>
        1. Data Protection at a Glance
        General Information: The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you. For detailed information about data protection, please refer to our Privacy Policy listed below this text.
      </p>
      <p>
        <span>Data Collection on this Website</span> 
        Who is responsible for data collection on this website? Data processing on this website is carried out by the website operator. You can find their contact details in the section "Information about the Responsible Party" in this Privacy Policy.
      </p>
      <p>
        <span>How do we collect your data?</span> 
        Your data is collected in two ways: either data that you provide to us (for example, data you enter into a contact form) or data that is automatically collected by our IT systems when you visit the website. This is primarily technical data (e.g., internet browser, operating system, or time of page access). This data is collected automatically as soon as you enter our website.
      </p>
      <p>
        <span>What do we use your data for?</span> 
        Part of the data is collected to ensure error-free provision of the website. Other data may be used to analyze your user behavior.
      </p>
      <p>
        <span>What rights do you have regarding your data?</span> 
        You have the right to receive information about the origin, recipient, and purpose of your stored personal data free of charge at any time. You also have the right to request the correction or deletion of this data. If you have given consent to data processing, you can revoke this consent at any time for the future. You also have the right to request the restriction of the processing of your personal data under certain circumstances. Furthermore, you have the right to file a complaint with the competent supervisory authority. You can contact us at any time regarding this and other questions about data protection.
      </p>
      <p>
        <span>2. Hosting</span> 
        We host the contents of our website with the following provider: External Hosting. This website is hosted externally. The personal data collected on this website is stored on the servers of the host(s). This may include, but is not limited to, IP addresses, contact requests, metadata and communications data, contract data, contact details, names, website access, and other data generated through a website. External hosting is done for the purpose of contract fulfillment with our potential and existing customers (Art. 6(1)(b) GDPR) and in the interest of secure, fast, and efficient provision of our online services by a professional provider (Art. 6(1)(f) GDPR). If appropriate consent has been obtained, the processing is carried out exclusively on the basis of Art. 6(1)(a) GDPR and § 25(1) TTDSG, insofar as the consent includes the storage of cookies or access to information in the user's end device (e.g., device fingerprinting) as defined by the TTDSG. This consent can be revoked at any time. Our host(s) will only process your data to the extent necessary to fulfill their performance obligations and will follow our instructions with regard to this data. We use the following host(s): Max Mustermann, Musterstraße 12, 60528 Frankfurt am Main.
      </p>
      <p>
        <span>3. General Information and Mandatory Information on Data Protection</span> 
        The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with statutory data protection regulations and this privacy policy. When you use this website, various personal data is collected. Personal data is data that can be used to personally identify you. This privacy policy explains what data we collect and what we use it for. It also explains how and for what purpose this happens. We point out that data transmission over the Internet (e.g., when communicating by email) may have security vulnerabilities. Complete protection of data against access by third parties is not possible.
      </p>
      <p>
        <span>Information about the Responsible Party</span> 
        The party responsible for data processing on this website is:
        Max Mustermann
        Musterstraße 12
        60528 Frankfurt am Main
        +49 123 456 7890
        max.mustermann@gmail.com
        The responsible party is the natural or legal person who alone or jointly with others determines the purposes and means of the processing of personal data (e.g., names, email addresses, etc.).
      </p>
      <p>
        <span>Storage Duration</span> 
        Unless a more specific storage period has been specified within this privacy policy, your personal data will remain with us until the purpose for data processing no longer applies. If you assert a legitimate request for deletion or revoke your consent to data processing, your data will be deleted unless we have other legally permissible reasons for storing your personal data (e.g., retention periods under tax or commercial law); in the latter case, the deletion will take place after these reasons cease to apply.
      </p>
      <p>
        <span>General Information about the Legal Basis for Data Processing on this Website</span> 
        If you have consented to data processing, we process your personal data on the basis of Art. 6(1)(a) GDPR or Art. 9(2)(a) GDPR if special categories of data according to Art. 9(1) GDPR are processed. In the case of explicit consent to the transfer of personal data to third countries, the data processing is also based on Art. 49(1)(a) GDPR. If you have consented to the storage of cookies or to the access to information in your end device (e.g., via device fingerprinting), the data processing is additionally based on § 25(1) TTDSG. The consent can be revoked at any time. If your data is required for the performance of a contract or for the implementation of pre-contractual measures, we process your data on the basis of Art. 6(1)(b) GDPR. Furthermore, we process your data if it is required to fulfill a legal obligation on the basis of Art. 6(1)(c) GDPR. Data processing may also be carried out on the basis of our legitimate interest according to Art. 6(1)(f) GDPR. Information about the relevant legal bases in each individual case is provided in the following paragraphs of this privacy policy.
      </p>
      <p>
        <span>Recipients of Personal Data</span> 
        In the course of our business activities, we work with various external parties. In some cases, this also requires the transfer of personal data to these external parties. We only transfer personal data to external parties if this is necessary for the fulfillment of a contract, if we are legally obliged to do so (e.g., transfer of data to tax authorities), if we have a legitimate interest in the transfer according to Art. 6(1)(f) GDPR, or if another legal basis permits the data transfer. When using processors, we only transfer personal data of our customers on the basis of a valid contract for processing. In the case of joint processing, a contract for joint processing is concluded.
      </p>
      <p>
        <span>Revocation of Your Consent to Data Processing</span> 
        Many data processing operations are only possible with your express consent. You can revoke consent you have already given at any time. The legality of the data processing carried out until the revocation remains unaffected by the revocation.
      </p>
      <p>
        <span>Right to Object to Data Collection in Special Cases and to Direct Advertising (Art. 21 GDPR)</span> 
        IF THE DATA PROCESSING IS BASED ON ART. 6(1)(E) OR (F) GDPR, YOU HAVE THE RIGHT TO OBJECT TO THE PROCESSING OF YOUR PERSONAL DATA AT ANY TIME FOR REASONS ARISING FROM YOUR PARTICULAR SITUATION; THIS ALSO APPLIES TO PROFILING BASED ON THESE PROVISIONS. THE RESPECTIVE LEGAL BASIS ON WHICH PROCESSING IS BASED CAN BE FOUND IN THIS PRIVACY POLICY. IF YOU OBJECT, WE WILL NO LONGER PROCESS YOUR AFFECTED PERSONAL DATA UNLESS WE CAN DEMONSTRATE COMPELLING LEGITIMATE GROUNDS FOR THE PROCESSING THAT OVERRIDE YOUR INTERESTS, RIGHTS, AND FREEDOMS OR THE PROCESSING IS FOR THE ESTABLISHMENT, EXERCISE, OR DEFENSE OF LEGAL CLAIMS (OBJECTION UNDER ART. 21(1) GDPR).
      </p>
      <p>
        IF YOUR PERSONAL DATA IS PROCESSED FOR DIRECT MARKETING PURPOSES, YOU HAVE THE RIGHT TO OBJECT AT ANY TIME TO THE PROCESSING OF PERSONAL DATA CONCERNING YOU FOR SUCH MARKETING; THIS ALSO APPLIES TO PROFILING TO THE EXTENT THAT IT IS RELATED TO SUCH DIRECT MARKETING. IF YOU OBJECT, YOUR PERSONAL DATA WILL NO LONGER BE USED FOR DIRECT MARKETING PURPOSES (OBJECTION UNDER ART. 21(2) GDPR).
      </p>
      <p>
        <span>Right to Lodge a Complaint with the Competent Supervisory Authority</span> 
        In the event of violations of the GDPR, data subjects have the right to lodge a complaint with a supervisory authority, in particular in the Member State of their habitual residence, place of work, or place of the alleged infringement. The right to lodge a complaint is without prejudice to any other administrative or judicial remedy.
      </p>
      <p>
        <span>Right to Data Portability</span> 
        You have the right to have data that we process automatically on the basis of your consent or in fulfillment of a contract handed over to you or to a third party in a common, machine-readable format. If you request the direct transfer of the data to another controller, this will only be done to the extent technically feasible.
      </p>
      <p>
        <span>Information, Correction, and Deletion</span> 
        Within the framework of the applicable legal provisions, you have the right at any time to free information about your stored personal data, its origin and recipient, and the purpose of the data processing and, if applicable, a right to correction or deletion of this data. For this purpose, as well as for further questions on the subject of personal data, you can contact us at any time.
      </p>
      <p>
        <span>Right to Restriction of Processing</span> 
        You have the right to request the restriction of the processing of your personal data. For this purpose, you can contact us at any time. The right to restriction of processing exists in the following cases: If you dispute the accuracy of your personal data stored with us, we usually need time to verify this. For the duration of the verification, you have the right to request the restriction of the processing of your personal data. If the processing of your personal data was/is unlawful, you can request the restriction of data processing instead of deletion. If we no longer need your personal data, but you need it to exercise, defend, or assert legal claims, you have the right to request the restriction of the processing of your personal data instead of deletion. If you have lodged an objection under Art. 21(1) GDPR, a balance must be struck between your interests and ours. As long as it is not yet clear whose interests prevail, you have the right to request the restriction of the processing of your personal data.
      </p>
      <p>
        <span>4. Data Collection on this Website</span>
        <span>Cookies</span>
        Our websites use "cookies". Cookies are small data packages and do not cause any damage to your device. They are stored either temporarily for the duration of a session (session cookies) or permanently (permanent cookies) on your device. Session cookies are automatically deleted after your visit. Permanent cookies remain stored on your device until you delete them yourself or until they are automatically deleted by your web browser.

        Cookies can come from us (first-party cookies) or from third-party companies (third-party cookies). Third-party cookies enable the integration of certain services from third-party companies within websites (e.g., cookies for processing payment services).

        Cookies have various functions. Many cookies are technically necessary because certain website functions would not work without them (e.g., the shopping cart function or the display of videos). Other cookies can be used to analyze user behavior or for advertising purposes.

        Cookies that are necessary for carrying out the electronic communication process, for providing certain functions you want (e.g., for the shopping cart function), or for optimizing the website (e.g., cookies for measuring the web audience) are stored on the basis of Art. 6(1)(f) GDPR, unless another legal basis is specified. The website operator has a legitimate interest in storing necessary cookies for the technically error-free and optimized provision of its services.
      </p>
      <p>
        If consent to store cookies and comparable recognition technologies has been requested, processing takes place exclusively on the basis of this consent (Art. 6(1)(a) GDPR and § 25(1) TTDSG); the consent can be revoked at any time.

        You can set your browser so that you are informed about the setting of cookies and only allow cookies in individual cases, exclude the acceptance of cookies for certain cases or in general, and activate the automatic deletion of cookies when closing the browser. When deactivating cookies, the functionality of this website may be limited.

        You can find out which cookies and services are used on this website in this privacy policy.
      </p>
      <p>
        <span>5. Plugins and Tools</span>
        <span>Google Fonts (Local Hosting)</span>
        This site uses Google Fonts for the uniform display of fonts. These fonts are locally installed. A connection to Google servers does not take place.

        For more information about Google Fonts, please visit https://developers.google.com/fonts/faq and see Google's privacy policy: https://policies.google.com/privacy?hl=en.
      </p>
      <p>
        <span>Source</span>
        https://www.e-recht24.de
      </p>
    </div>
  `;
}

/**
 * Generates the HTML for the responsive controls.
 * @returns {string} HTML string containing the responsive controls
 */
function responsiveControlsHTML() {
  return /*html*/ `
        <div class="buttons-left-container">
      <button
        ontouchstart="controls.jump(true)"
        ontouchend="controls.jump(false)"
        id="jump"
        class="responsive-button"
      >
        Jump
      </button>
      <button
        ontouchstart="controls.left(true)"
        ontouchend="controls.left(false)"
        id="left"
        class="responsive-button"
      >
        Left
      </button>
    </div>
    <div class="buttons-right-container">
    <button
        ontouchstart="controls.heal(true)"
        ontouchend="controls.heal(false)"
        id="heal"
        class="responsive-button"
      >
        Heal
      </button>
      <button
        ontouchstart="controls.throwBottle(true)"
        ontouchend="controls.throwBottle(false)"
        id="throw"
        class="responsive-button"
      >
        Throw
      </button>
      <button
        ontouchstart="controls.right(true)"
        ontouchend="controls.right(false)"
        id="right"
        class="responsive-button"
      >
        Right
      </button>
    </div>
  `;
}
