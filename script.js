// ============================================================
//  Election Guide AI Assistant – script.js
// ============================================================

// ---------- Knowledge Base ----------
const KB = {
  greetings: {
    keys: ["hi", "hello", "hey", "namaste", "namaskar", "hlo", "hii"],
    answer: `Namaste! 🙏 Welcome to **Election Guide AI Assistant**.

I'm here to help you understand India's election process in simple language. You can ask me about:
- 🗳️ How to vote
- 🪪 Voter ID & registration
- 📜 Voting rules & NOTA
- 📄 Documents needed at the polling booth

What would you like to know?`
  },

  howToVote: {
    keys: ["how to vote", "voting process", "how do i vote", "vote kaise kare", "how can i vote", "voting procedure", "how to cast vote", "cast vote"],
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
    keys: ["voter id", "epic card", "check voter id", "voter id card", "voter registration", "how to get voter id", "apply voter id", "voter card", "new voter id"],
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
Yes! 11 alternative photo IDs are accepted:
Aadhaar, Passport, Driving Licence, PAN Card, Bank Passbook with photo, MNREGA Job Card, and more.

**Download Digital Voter ID:**
You can download your **e-EPIC** (digital Voter ID) instantly from the Voter Helpline App or voters.eci.gov.in 📲`
  },

  votingRules: {
    keys: ["voting rules", "rules for voting", "election rules", "dos and donts", "what are the rules", "booth rules", "polling booth rules"],
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
    keys: ["nota", "none of the above", "what is nota", "nota option", "nota button"],
    answer: `Great question! NOTA is an important democratic right. ❌

**NOTA = None Of The Above**

Introduced in **2013** by the Supreme Court of India, NOTA allows voters to reject all candidates if they don't find anyone worthy of their vote.

**How to Use NOTA?**
- On the EVM, NOTA is the **last option** at the bottom
- It has the symbol of a crossed-out ballot paper 🗳️
- Press that button just like any other candidate

**Does NOTA Win?**
No. Even if NOTA gets the most votes, the candidate with the **second-highest votes** wins. NOTA votes are counted but don't result in re-election.

**Why is NOTA Important?**
✅ It sends a message that voters are unhappy with all candidates
✅ It ensures your vote is not wasted (if you don't like anyone)
✅ It protects your right to express dissent
✅ High NOTA % puts pressure on parties to field better candidates

NOTA is your right — use it wisely! 💪`
  },

  documents: {
    keys: ["documents", "documents required", "id proof", "what documents", "what to carry", "id for voting", "required documents", "id required"],
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
- No document is needed for your **name to be in the voter list** — that's the most important thing!

💡 **Tip:** Always check your name in the voter list first at electoralsearch.eci.gov.in`
  },

  evm: {
    keys: ["evm", "electronic voting machine", "how does evm work", "vvpat", "voting machine"],
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
- This ensures your vote is recorded correctly 🔍

**Is EVM Secure?**
✅ EVMs are standalone machines — not connected to internet
✅ Tamper-proof hardware
✅ Used successfully since 1982 in India`
  },

  eligibility: {
    keys: ["eligibility", "who can vote", "age to vote", "voting age", "am i eligible", "can i vote"],
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
Yes! Since 2011, **NRIs (Non-Resident Indians)** who haven't acquired citizenship of another country can register as overseas voters and vote in their home constituency.

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

You can also use the **quick buttons** below to get instant answers!

Or call the Voter Helpline: 📞 **1950** (Free, 24x7)`
  }
};

// ---------- Find Answer ----------
function findAnswer(input) {
  const text = input.toLowerCase().trim();

  for (const [, topic] of Object.entries(KB)) {
    if (!topic.keys) continue;
    if (topic.keys.some(key => text.includes(key))) {
      return topic.answer;
    }
  }

  // Greeting check
  if (KB.greetings.keys.some(k => text === k || text.startsWith(k + " ") || text.endsWith(" " + k))) {
    return KB.greetings.answer;
  }

  return KB.default.answer;
}

// ---------- Render Markdown (simple) ----------
function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}

// ---------- Get Time String ----------
function getTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ---------- Append Message ----------
function appendMessage(text, isUser = false) {
  const messages = document.getElementById("chatMessages");

  const div = document.createElement("div");
  div.className = `message ${isUser ? "user-message" : "bot-message"}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = isUser ? "👤" : "🤖";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.innerHTML = renderMarkdown(text) + `<div class="message-time">${getTime()}</div>`;

  div.appendChild(avatar);
  div.appendChild(bubble);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// ---------- Show Typing Indicator ----------
function showTyping() {
  const messages = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "message bot-message";
  div.id = "typingIndicator";

  div.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-bubble">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

// ---------- Send Message ----------
function sendMessage() {
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, true);
  input.value = "";
  sendBtn.disabled = true;

  showTyping();

  setTimeout(() => {
    hideTyping();
    const answer = findAnswer(text);
    appendMessage(answer, false);
    sendBtn.disabled = false;
    input.focus();
  }, 900 + Math.random() * 600);
}

function sendQuickMessage(topic) {
  const input = document.getElementById("chatInput");
  input.value = topic;
  sendMessage();
}

function handleKeyPress(event) {
  if (event.key === "Enter") sendMessage();
}

function clearChat() {
  const messages = document.getElementById("chatMessages");
  messages.innerHTML = "";
  appendMessage("Chat cleared! 🧹 Feel free to ask me anything about Indian elections.", false);
}

// ---------- Navigation ----------
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const navH = document.querySelector(".navbar").offsetHeight;
    const top = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  }
  // Close mobile menu
  document.getElementById("navLinks").classList.remove("open");
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

// ---------- Scroll Events ----------
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Navbar shrink
  document.getElementById("navbar").classList.toggle("scrolled", scrollY > 60);

  // Back to top
  document.getElementById("backToTop").classList.toggle("visible", scrollY > 400);

  // Active nav link
  const sections = ["home", "assistant", "guide", "timeline"];
  const navLinks = document.querySelectorAll(".nav-link");
  const navH = document.querySelector(".navbar").offsetHeight;

  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= navH + 80 && rect.bottom > navH + 80) {
      navLinks.forEach(l => l.classList.remove("active"));
      navLinks[i].classList.add("active");
    }
  });
});

// ---------- Intersection Observer for Cards ----------
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -60px 0px" };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  // Animate cards on scroll
  document.querySelectorAll(".guide-card, .timeline-card, .fact-card, .stat-card").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });
});
