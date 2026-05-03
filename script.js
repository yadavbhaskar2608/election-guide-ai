/**
 * @fileoverview Election Guide AI Assistant – script.js
 * @description Main JavaScript module for the Election Guide AI web application.
 *   Handles chat logic, navigation, scroll events, animations, and GA4 event tracking.
 * @version 2.0.0
 */

'use strict';

// ============================================================
// CONSTANTS
// ============================================================

/** Minimum simulated bot response delay in milliseconds */
const TYPING_DELAY_MIN = 900;

/** Random extra delay range added to the minimum (ms) */
const TYPING_DELAY_RANGE = 600;

/** Maximum allowed input length in characters */
const INPUT_MAX_LENGTH = 500;

/** Scroll threshold (px) to trigger navbar shrink */
const NAVBAR_SCROLL_THRESHOLD = 60;

/** Scroll threshold (px) to show Back-to-Top button */
const BACK_TO_TOP_THRESHOLD = 400;

/** Number of animated dots in the typing indicator */
const TYPING_DOTS_COUNT = 3;

/** Viewport offset (px) below navbar to detect active section */
const ACTIVE_SECTION_OFFSET = 80;

/** Ordered list of section IDs for nav highlighting */
const SECTION_IDS = ['home', 'assistant', 'guide', 'timeline'];

// ============================================================
// KNOWLEDGE BASE
// ============================================================

/**
 * @typedef {Object} KBTopic
 * @property {string[]} [keys] - Keywords that trigger this topic
 * @property {string} answer - Response text (supports **bold** and *italic* markdown)
 */

/** @type {Object.<string, KBTopic>} */
const KB = {
  greetings: {
    keys: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'hlo', 'hii'],
    answer: `Namaste! 🙏 Welcome to **Election Guide AI Assistant**.

I'm here to help you understand India's election process in simple language. You can ask me about:
- 🗳️ How to vote
- 🪪 Voter ID & registration
- 📜 Voting rules & NOTA
- 📄 Documents needed at the polling booth

What would you like to know?`
  },

  howToVote: {
    keys: ['how to vote', 'voting process', 'how do i vote', 'vote kaise kare', 'how can i vote', 'voting procedure', 'how to cast vote', 'cast vote'],
    answer: `Here's how you can vote in India — step by step! 🗳️

**Step 1 – Register as a Voter**
Visit 👉 voters.eci.gov.in and fill Form 6 online. You must be 18+ and an Indian citizen.

**Step 2 – Check Your Name**
Before election day, search your name at electoralsearch.eci.gov.in or call 📞 **1950** (free helpline).

**Step 3 – Visit Your Polling Booth**
On election day, go to your designated booth. Booths are open from **7:00 AM to 6:00 PM**.

**Step 4 – Get Your Slip Verified**
Show your Voter ID or any approved photo ID (Aadhaar, PAN, Passport, etc.) to the polling officer.

**Step 5 – Press the Button on EVM**
Find your candidate's name and symbol, then press the blue button next to it. You'll hear a beep ✅

That's it — you've voted! Your vote is completely **secret and secure**. 🔒`
  },

  voterId: {
    keys: ['voter id', 'epic card', 'check voter id', 'voter id card', 'voter registration', 'how to get voter id', 'apply voter id', 'voter card', 'new voter id'],
    answer: `Here's everything you need to know about Voter ID (EPIC Card): 🪪

**What is Voter ID?**
It's officially called **EPIC** (Electors Photo Identity Card), issued free of cost by the Election Commission of India.

**How to Apply for Voter ID?**
1. Visit 👉 **voters.eci.gov.in**
2. Click on "New Registration (Form 6)"
3. Fill in your personal details
4. Upload your photo, age proof, and address proof
5. Submit — you'll get an acknowledgement number

**How to Check Your Voter ID Status?**
- Go to voters.eci.gov.in → Track Application Status
- Or call 📞 **1950** (Voter Helpline, free)

**Can I Vote Without Voter ID?**
Yes! 11 alternative photo IDs are accepted: Aadhaar, Passport, Driving Licence, PAN Card, Bank Passbook with photo, MNREGA Job Card, and more.

**Download Digital Voter ID:**
You can download your **e-EPIC** (digital Voter ID) instantly from the Voter Helpline App or voters.eci.gov.in 📲`
  },

  votingRules: {
    keys: ['voting rules', 'rules for voting', 'election rules', 'dos and donts', 'what are the rules', 'booth rules', 'polling booth rules'],
    answer: `Here are the important voting rules you must know! 📜

**✅ DOs at the Polling Booth:**
- Carry a valid Photo ID
- Stand in queue patiently
- Follow booth officer instructions
- Verify your vote on VVPAT screen
- Use NOTA if you don't support any candidate

**❌ DON'Ts at the Polling Booth:**
- No mobile phones or cameras inside the voting compartment
- No political symbols, badges or campaign material inside booth
- No one can accompany you inside except a specially-abled voter's helper
- No photography of the EVM screen
- No voting more than once (strict penalty!)

**⚖️ Key Rules:**
- Voting is completely **voluntary** — no one can force you
- Your vote is **absolutely secret** — no one knows how you voted
- Government employees and defence personnel get **Postal Ballot** facility
- If you're in queue before 6 PM, you **must** be allowed to vote
- Campaigning stops **48 hours** before polling (Campaign Silence)`
  },

  nota: {
    keys: ['nota', 'none of the above', 'what is nota', 'nota option', 'nota button'],
    answer: `Great question! NOTA is an important democratic right. ❌

**NOTA = None Of The Above**

Introduced in **2013** by the Supreme Court of India, NOTA allows voters to reject all candidates if they don't find anyone worthy.

**How to Use NOTA?**
- On the EVM, NOTA is the **last option** at the bottom
- It has the symbol of a crossed-out ballot paper 🗳️
- Press that button just like any other candidate

**Does NOTA Win?**
No. Even if NOTA gets the most votes, the candidate with the **second-highest votes** wins.

**Why is NOTA Important?**
✅ It sends a message that voters are unhappy with all candidates
✅ It ensures your vote is not wasted
✅ It protects your right to express dissent
✅ High NOTA % puts pressure on parties to field better candidates

NOTA is your right — use it wisely! 💪`
  },

  documents: {
    keys: ['documents', 'documents required', 'id proof', 'what documents', 'what to carry', 'id for voting', 'required documents', 'id required'],
    answer: `Here are the documents accepted at Indian polling booths! 📄

**Primary Document:**
🪪 **Voter ID / EPIC Card** — Best to carry this!

**12 Alternative Photo IDs Accepted:**
1. 🆔 Aadhaar Card (Physical or m-Aadhaar)
2. 🛂 Passport
3. 🚗 Driving Licence
4. 🏦 Bank / Post Office Passbook with Photograph
5. 💼 MNREGA Job Card
6. 🏛️ PAN Card
7. 🎓 Smart Cards issued by Govt. (Health, Labour Dept.)
8. 📜 Pension Document with Photo
9. 🪖 Service Identity Card (Armed Forces, Police)
10. 🏥 Health Insurance Smart Card
11. 🌾 Kisan Passbook issued by Govt.
12. 📱 e-EPIC (Digital Voter ID on phone)

**Remember:**
- You only need **ONE** of these documents
- Documents must have your **photograph**
- Your **name must be in the voter list** — that's the most important thing!

💡 **Tip:** Always check your name at electoralsearch.eci.gov.in`
  },

  evm: {
    keys: ['evm', 'electronic voting machine', 'how does evm work', 'vvpat', 'voting machine'],
    answer: `Let's understand EVM & VVPAT — India's voting technology! ⚡

**What is EVM?**
EVM stands for **Electronic Voting Machine**. It has two units:
1. **Control Unit** — with the polling officer
2. **Balloting Unit** — where you press the button

**How to Use EVM?**
1. Officer presses 'Ballot' button on Control Unit
2. The Balloting Unit lights up ✨
3. Find your candidate's name & party symbol
4. Press the **blue button** next to your choice
5. You'll hear a **beep** confirming your vote ✅

**What is VVPAT?**
VVPAT = **Voter Verified Paper Audit Trail**
- A printer machine connected to the EVM
- After you vote, it shows a **paper slip** for 7 seconds
- Shows your chosen candidate's name & symbol
- The slip drops into a sealed box (for audit if needed)

**Is EVM Secure?**
✅ EVMs are standalone — not connected to internet
✅ Tamper-proof hardware
✅ Used successfully since 1982 in India`
  },

  eligibility: {
    keys: ['eligibility', 'who can vote', 'age to vote', 'voting age', 'am i eligible', 'can i vote'],
    answer: `Here's who can vote in India! 🗳️

**Basic Eligibility to Vote:**
✅ Must be a **citizen of India**
✅ Must be **18 years or older** on the qualifying date (1st January of the year)
✅ Must be **ordinarily resident** in the constituency where you register
✅ Must be **mentally sound** (not disqualified by court)
✅ Must be **registered** in the electoral rolls

**Who CANNOT Vote?**
❌ Non-citizens of India
❌ Persons below 18 years
❌ Persons declared of unsound mind by a court
❌ Persons convicted and imprisoned for certain crimes
❌ Persons disqualified under Representation of People Act

**Can NRIs Vote?**
Yes! Since 2011, **NRIs** who haven't acquired foreign citizenship can register as overseas voters.

**Register at:** voters.eci.gov.in 📲`
  },

  default: {
    answer: `Hmm, I'm not sure about that specific question. 🤔

But here are the topics I can help you with:

🗳️ **"How to vote"** — Step-by-step voting guide
🪪 **"Check voter ID"** — Voter ID info & application
📜 **"Voting rules"** — Dos and Don'ts at booth
❌ **"What is NOTA"** — About NOTA option
📄 **"Documents required"** — IDs accepted at booth
⚡ **"What is EVM"** — About voting machines
👤 **"Who can vote"** — Voter eligibility

You can also use the **quick buttons** below for instant answers!

Or call the Voter Helpline: 📞 **1950** (Free, 24×7)`
  }
};

// ============================================================
// DOM REFERENCES (cached for efficiency)
// ============================================================

/** @type {HTMLElement} */
let chatMessages;

/** @type {HTMLInputElement} */
let chatInput;

/** @type {HTMLButtonElement} */
let sendBtn;

/** @type {HTMLElement} */
let navbar;

/** @type {HTMLButtonElement} */
let backToTop;

/** @type {HTMLButtonElement} */
let hamburger;

/** @type {HTMLUListElement} */
let navLinks;

/** @type {NodeListOf<HTMLAnchorElement>} */
let navLinkItems;

// ============================================================
// UTILITIES
// ============================================================

/**
 * Safely escapes a string to prevent XSS when inserted into HTML.
 * @param {string} str - Raw user input string
 * @returns {string} HTML-escaped string
 */
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return str.replace(/[&<>"']/g, (ch) => map[ch]);
}

/**
 * Converts a limited subset of Markdown to safe HTML.
 * Only allows **bold**, *italic*, newlines, and bullet lists.
 * Does NOT use innerHTML with raw user input — all user text is escaped first.
 * @param {string} text - Markdown-style text
 * @returns {string} Safe HTML string
 */
function renderMarkdown(text) {
  // Escape first, then apply safe formatting
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

/**
 * Returns the current time formatted as HH:MM (12-hour, Indian locale).
 * @returns {string} Formatted time string
 */
function getTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// ============================================================
// CHAT LOGIC
// ============================================================

/**
 * Finds a matching answer from the knowledge base for a given user input.
 * Checks all topic keyword arrays for substring matches.
 * @param {string} input - Raw user input string
 * @returns {string} Answer text from the knowledge base
 */
function findAnswer(input) {
  const text = input.toLowerCase().trim();

  // Greeting check (exact or word-boundary match)
  if (KB.greetings.keys.some(k => text === k || text.startsWith(k + ' ') || text.endsWith(' ' + k))) {
    return KB.greetings.answer;
  }

  for (const [key, topic] of Object.entries(KB)) {
    if (key === 'greetings' || key === 'default') continue;
    if (!topic.keys) continue;
    if (topic.keys.some(kw => text.includes(kw))) {
      return topic.answer;
    }
  }

  return KB.default.answer;
}

/**
 * Appends a message bubble to the chat messages container.
 * @param {string} text - The message text (supports Markdown for bot messages)
 * @param {boolean} [isUser=false] - Whether this is a user message
 */
function appendMessage(text, isUser = false) {
  const div = document.createElement('div');
  div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = isUser ? '👤' : '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  // For bot messages: apply safe markdown rendering
  // For user messages: escape and display as plain text in a paragraph
  const contentHtml = isUser
    ? `<p>${escapeHtml(text)}</p>`
    : renderMarkdown(text);

  const timeEl = document.createElement('div');
  timeEl.className = 'message-time';
  timeEl.setAttribute('aria-label', `Sent at ${getTime()}`);
  timeEl.textContent = getTime();

  // Use insertAdjacentHTML with sanitized content only
  bubble.innerHTML = contentHtml;
  bubble.appendChild(timeEl);

  div.appendChild(avatar);
  div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Shows the animated typing indicator in the chat.
 */
function showTyping() {
  const div = document.createElement('div');
  div.className = 'message bot-message';
  div.id = 'typingIndicator';
  div.setAttribute('aria-label', 'Chunav Mitra is typing');

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = '🤖';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < TYPING_DOTS_COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'typing-dot';
    indicator.appendChild(dot);
  }

  bubble.appendChild(indicator);
  div.appendChild(avatar);
  div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Removes the typing indicator from the chat.
 */
function hideTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

/**
 * Sends the current chat input as a user message and triggers a bot response.
 * Validates input length and prevents empty submissions.
 */
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  if (text.length > INPUT_MAX_LENGTH) {
    chatInput.value = chatInput.value.slice(0, INPUT_MAX_LENGTH);
    return;
  }

  appendMessage(text, true);
  chatInput.value = '';
  sendBtn.disabled = true;
  chatInput.setAttribute('aria-busy', 'true');

  // Track chat event in GA4
  if (typeof gtag === 'function') {
    gtag('event', 'chat_message_sent', {
      event_category: 'Chat',
      event_label: text.slice(0, 100)
    });
  }

  showTyping();

  const delay = TYPING_DELAY_MIN + Math.random() * TYPING_DELAY_RANGE;
  setTimeout(() => {
    hideTyping();
    const answer = findAnswer(text);
    appendMessage(answer, false);
    sendBtn.disabled = false;
    chatInput.setAttribute('aria-busy', 'false');
    chatInput.focus();
  }, delay);
}

/**
 * Sends a pre-filled quick question to the chat.
 * @param {string} topic - The quick question text
 */
function sendQuickMessage(topic) {
  chatInput.value = topic;

  // Track quick button click in GA4
  if (typeof gtag === 'function') {
    gtag('event', 'quick_button_clicked', {
      event_category: 'Chat',
      event_label: topic
    });
  }

  sendMessage();
}

/**
 * Clears all chat messages and shows a fresh greeting.
 */
function clearChat() {
  // Use replaceChildren() for safe DOM clearing (avoids innerHTML assignment)
  chatMessages.replaceChildren();
  appendMessage('Chat cleared! 🧹 Feel free to ask me anything about Indian elections.', false);
}

// ============================================================
// NAVIGATION
// ============================================================

/**
 * Smoothly scrolls to the section with the given ID, accounting for navbar height.
 * Also closes the mobile menu if open.
 * @param {string} id - The section element ID to scroll to
 */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const navH = navbar.offsetHeight;
  const top = el.getBoundingClientRect().top + window.scrollY - navH;
  window.scrollTo({ top, behavior: 'smooth' });

  // Close mobile menu
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');

  // Track section navigation in GA4
  if (typeof gtag === 'function') {
    gtag('event', 'section_navigate', {
      event_category: 'Navigation',
      event_label: id
    });
  }
}

/**
 * Toggles the mobile navigation menu open/closed.
 */
function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
}

// ============================================================
// SCROLL HANDLING (rAF throttled for efficiency)
// ============================================================

/** @type {boolean} Prevents queuing multiple rAF calls */
let scrollTicking = false;

/**
 * Handles all scroll-based UI updates:
 * - Navbar shrink on scroll
 * - Back-to-top button visibility
 * - Active nav link highlighting
 */
function handleScroll() {
  if (scrollTicking) return;
  scrollTicking = true;

  requestAnimationFrame(() => {
    const scrollY = window.scrollY;
    const navH = navbar.offsetHeight;

    // Navbar shrink
    navbar.classList.toggle('scrolled', scrollY > NAVBAR_SCROLL_THRESHOLD);

    // Back to top visibility
    backToTop.classList.toggle('visible', scrollY > BACK_TO_TOP_THRESHOLD);

    // Active nav link detection
    SECTION_IDS.forEach((id, i) => {
      const section = document.getElementById(id);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top <= navH + ACTIVE_SECTION_OFFSET && rect.bottom > navH + ACTIVE_SECTION_OFFSET) {
        navLinkItems.forEach(l => l.classList.remove('active'));
        if (navLinkItems[i]) navLinkItems[i].classList.add('active');
      }
    });

    scrollTicking = false;
  });
}

// ============================================================
// INTERSECTION OBSERVER (scroll-in animations)
// ============================================================

/** @type {IntersectionObserverInit} */
const OBSERVER_OPTIONS = { threshold: 0.1, rootMargin: '0px 0px -60px 0px' };

/**
 * Reveals animated cards when they enter the viewport.
 * @type {IntersectionObserver|null}
 */
const cardObserver = (typeof IntersectionObserver !== 'undefined')
  ? new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          cardObserver.unobserve(entry.target);
        }
      });
    }, OBSERVER_OPTIONS)
  : null;

// ============================================================
// INITIALISATION — Split into focused sub-functions
// ============================================================

/**
 * Attaches all chat-related event listeners.
 * Covers send button, Enter key, clear button, and quick-topic delegation.
 */
function initChatListeners() {
  sendBtn.addEventListener('click', sendMessage);

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  const clearBtn = document.getElementById('clearChatBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearChat);

  const quickButtons = document.getElementById('quickButtons');
  if (quickButtons) {
    quickButtons.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-topic]');
      if (btn) sendQuickMessage(btn.dataset.topic);
    });
  }
}

/**
 * Attaches navigation event listeners.
 * Covers hamburger toggle, Escape key, nav links, hero buttons, and back-to-top.
 */
function initNavListeners() {
  hamburger.addEventListener('click', toggleMenu);

  // Escape key closes mobile menu (accessibility)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu();
      hamburger.focus();
    }
  });

  navLinkItems.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href').replace('#', '');
      scrollToSection(target);
    });
  });

  /** @type {Object.<string, string>} Maps button IDs to target section IDs */
  const heroButtonMap = {
    btnChatAssistant: 'assistant',
    btnVotingGuide:   'guide',
    btnTimeline:      'timeline'
  };
  Object.entries(heroButtonMap).forEach(([btnId, sectionId]) => {
    const btn = document.getElementById(btnId);
    if (btn) btn.addEventListener('click', () => scrollToSection(sectionId));
  });

  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => scrollToSection('assistant'));
  }

  backToTop.addEventListener('click', () => scrollToSection('home'));
}

/**
 * Attaches scroll handling, intersection observers, and external link tracking.
 */
function initScrollListeners() {
  window.addEventListener('scroll', handleScroll, { passive: true });

  document.querySelectorAll('.guide-card, .timeline-card, .fact-card, .stat-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    if (cardObserver) cardObserver.observe(el);
  });

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'external_link_click', {
          event_category: 'Outbound',
          event_label: link.href
        });
      }
    });
  });
}

/**
 * Entry point: caches DOM references then delegates to init sub-functions.
 * Guarded so this file can be safely required in Node.js for unit testing.
 */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM references once at startup
    chatMessages = document.getElementById('chatMessages');
    chatInput    = document.getElementById('chatInput');
    sendBtn      = document.getElementById('sendBtn');
    navbar       = document.getElementById('navbar');
    backToTop    = document.getElementById('backToTop');
    hamburger    = document.getElementById('hamburger');
    navLinks     = document.getElementById('navLinks');
    navLinkItems = document.querySelectorAll('.nav-link');

    // Guard: exit early if core elements are missing (e.g., test runner page)
    if (!chatMessages || !chatInput || !sendBtn || !navbar) return;

    initChatListeners();
    initNavListeners();
    initScrollListeners();
  });
}

// ============================================================
// PUBLIC API (exported for testing)
// ============================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { findAnswer, renderMarkdown, getTime, escapeHtml };
} else {
  // Browser: expose testable functions as globals for script.test.js
  window.findAnswer     = findAnswer;
  window.renderMarkdown = renderMarkdown;
  window.getTime        = getTime;
  window.escapeHtml     = escapeHtml;
}
