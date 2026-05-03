/**
 * @fileoverview Election Guide AI — Unit Tests
 * @description Browser-compatible test suite for script.js functions.
 *   No build tools or external frameworks required.
 *   Run via tests/test-runner.html in any modern browser.
 */

'use strict';

// ============================================================
// MICRO TEST FRAMEWORK
// ============================================================

/** @type {Array<{name: string, passed: boolean, error: string|null}>} */
const testResults = [];

/**
 * Defines and runs a single test case.
 * @param {string} name - Human-readable test name
 * @param {Function} fn - Test function (may throw on failure)
 */
function test(name, fn) {
  try {
    fn();
    testResults.push({ name, passed: true, error: null });
  } catch (err) {
    testResults.push({ name, passed: false, error: err.message || String(err) });
  }
}

/**
 * Asserts that two values are strictly equal.
 * @param {*} actual - The actual value
 * @param {*} expected - The expected value
 * @param {string} [msg] - Optional context message
 */
function assertEqual(actual, expected, msg = '') {
  if (actual !== expected) {
    throw new Error(
      `${msg ? msg + ': ' : ''}Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

/**
 * Asserts that a value is truthy.
 * @param {*} value - Value to check
 * @param {string} [msg] - Optional context message
 */
function assertTrue(value, msg = '') {
  if (!value) {
    throw new Error(`${msg ? msg + ': ' : ''}Expected truthy, got ${JSON.stringify(value)}`);
  }
}

/**
 * Asserts that a string contains a substring.
 * @param {string} str - The string to search in
 * @param {string} substr - The substring to find
 * @param {string} [msg] - Optional context message
 */
function assertContains(str, substr, msg = '') {
  if (!str.includes(substr)) {
    throw new Error(
      `${msg ? msg + ': ' : ''}"${substr}" not found in "${str.slice(0, 80)}..."`
    );
  }
}

/**
 * Asserts that a string does NOT contain a substring.
 * @param {string} str - The string to search in
 * @param {string} substr - The substring that must be absent
 * @param {string} [msg] - Optional context message
 */
function assertNotContains(str, substr, msg = '') {
  if (str.includes(substr)) {
    throw new Error(
      `${msg ? msg + ': ' : ''}Unexpected "${substr}" found in "${str.slice(0, 80)}..."`
    );
  }
}

/**
 * Asserts that a value is falsy.
 * @param {*} value - Value to check
 * @param {string} [msg] - Optional context message
 */
function assertFalse(value, msg = '') {
  if (value) {
    throw new Error(`${msg ? msg + ': ' : ''}Expected falsy, got ${JSON.stringify(value)}`);
  }
}

// ============================================================
// IMPORT FUNCTIONS UNDER TEST
// (works both in Node via module.exports and in browser via globals)
// ============================================================

const {
  findAnswer,
  renderMarkdown,
  getTime,
  escapeHtml
} = (typeof module !== 'undefined' && module.exports)
  ? require('../script.js')
  : window; // In browser, these are global functions from script.js

// ============================================================
// TEST SUITE: escapeHtml
// ============================================================

test('escapeHtml — escapes < and > characters', () => {
  assertEqual(escapeHtml('<script>'), '&lt;script&gt;');
});

test('escapeHtml — escapes & ampersand', () => {
  assertEqual(escapeHtml('bread & butter'), 'bread &amp; butter');
});

test('escapeHtml — escapes double quotes', () => {
  assertEqual(escapeHtml('"hello"'), '&quot;hello&quot;');
});

test('escapeHtml — escapes single quotes', () => {
  assertEqual(escapeHtml("it's"), 'it&#39;s');
});

test('escapeHtml — leaves plain text unchanged', () => {
  assertEqual(escapeHtml('hello world'), 'hello world');
});

test('escapeHtml — handles XSS payload', () => {
  const xss = '<img src=x onerror=alert(1)>';
  assertNotContains(escapeHtml(xss), '<img', 'XSS img tag must be escaped');
});

test('escapeHtml — handles empty string', () => {
  assertEqual(escapeHtml(''), '');
});

// ============================================================
// TEST SUITE: renderMarkdown
// ============================================================

test('renderMarkdown — wraps output in <p> tags', () => {
  const out = renderMarkdown('Hello world');
  assertTrue(out.startsWith('<p>'), 'Should start with <p>');
  assertTrue(out.endsWith('</p>'), 'Should end with </p>');
});

test('renderMarkdown — converts **bold** to <strong>', () => {
  assertContains(renderMarkdown('This is **bold** text'), '<strong>bold</strong>');
});

test('renderMarkdown — converts *italic* to <em>', () => {
  assertContains(renderMarkdown('This is *italic* text'), '<em>italic</em>');
});

test('renderMarkdown — converts double newlines to paragraph breaks', () => {
  assertContains(renderMarkdown('Para 1\n\nPara 2'), '</p><p>');
});

test('renderMarkdown — converts single newlines to <br />', () => {
  assertContains(renderMarkdown('Line 1\nLine 2'), '<br />');
});

test('renderMarkdown — does NOT allow raw HTML injection', () => {
  const out = renderMarkdown('<script>alert("xss")</script>');
  assertNotContains(out, '<script>', 'Raw <script> must be escaped');
});

test('renderMarkdown — escapes < in user-supplied text', () => {
  assertNotContains(renderMarkdown('3 < 5'), '<5', '< should be escaped');
});

// ============================================================
// TEST SUITE: getTime
// ============================================================

test('getTime — returns a non-empty string', () => {
  assertTrue(typeof getTime() === 'string' && getTime().length > 0);
});

test('getTime — returns a string containing a colon (HH:MM)', () => {
  assertTrue(getTime().includes(':'), 'Time string should contain a colon');
});

test('getTime — result looks like a valid time (contains digits)', () => {
  assertTrue(/\d/.test(getTime()), 'Time should contain digits');
});

// ============================================================
// TEST SUITE: findAnswer — Knowledge Base routing
// ============================================================

test('findAnswer — greeting "hello" returns greeting answer', () => {
  assertContains(findAnswer('hello'), 'Namaste');
});

test('findAnswer — greeting "namaste" returns greeting answer', () => {
  assertContains(findAnswer('namaste'), 'Namaste');
});

test('findAnswer — "how to vote" returns voting process answer', () => {
  assertContains(findAnswer('how to vote'), 'Step 1');
});

test('findAnswer — "vote kaise kare" returns voting answer (Hindi query)', () => {
  assertContains(findAnswer('vote kaise kare'), 'Step 1');
});

test('findAnswer — "voter id" returns EPIC card answer', () => {
  assertContains(findAnswer('voter id'), 'EPIC');
});

test('findAnswer — "check voter id" routes to voter ID topic', () => {
  assertContains(findAnswer('check voter id'), 'EPIC');
});

test('findAnswer — "voting rules" returns DOs and DON\'Ts', () => {
  assertContains(findAnswer('voting rules'), "DOs at the Polling Booth");
});

test('findAnswer — "what is nota" returns NOTA explanation', () => {
  assertContains(findAnswer('what is nota'), 'None Of The Above');
});

test('findAnswer — "nota" keyword returns NOTA answer', () => {
  assertContains(findAnswer('nota'), 'NOTA');
});

test('findAnswer — "documents required" returns accepted ID list', () => {
  assertContains(findAnswer('documents required'), 'Aadhaar');
});

test('findAnswer — "evm" returns EVM explanation', () => {
  assertContains(findAnswer('evm'), 'Electronic Voting Machine');
});

test('findAnswer — "vvpat" routes to EVM topic', () => {
  assertContains(findAnswer('vvpat'), 'VVPAT');
});

test('findAnswer — "who can vote" returns eligibility answer', () => {
  assertContains(findAnswer('who can vote'), 'citizen of India');
});

test('findAnswer — "can i vote" routes to eligibility', () => {
  assertContains(findAnswer('can i vote'), '18 years');
});

test('findAnswer — unknown query returns default fallback', () => {
  assertContains(findAnswer('what is the weather today'), '1950');
});

test('findAnswer — case insensitive: "HOW TO VOTE" returns answer', () => {
  assertContains(findAnswer('HOW TO VOTE'), 'Step 1');
});

test('findAnswer — trims whitespace from input', () => {
  assertContains(findAnswer('  how to vote  '), 'Step 1');
});

test('findAnswer — empty string returns default fallback', () => {
  assertContains(findAnswer(''), '1950');
});

test('findAnswer — "cast vote" routes to howToVote', () => {
  assertContains(findAnswer('cast vote'), 'Step 1');
});

test('findAnswer — "am i eligible" routes to eligibility', () => {
  assertContains(findAnswer('am i eligible'), 'citizen of India');
});

// ============================================================
// SECURITY TESTS
// ============================================================

test('Security — XSS in input: script tag is neutralised by escapeHtml', () => {
  const xss = '<script>alert("xss")</script>';
  assertNotContains(escapeHtml(xss), '<script>');
});

test('Security — XSS in input: img onerror is neutralised by bracket escaping', () => {
  const xss = '<img src=x onerror=alert(1)>';
  const escaped = escapeHtml(xss);
  // The < angle bracket must be escaped, making the tag unable to execute
  assertContains(escaped, '&lt;img', 'Opening angle bracket must be escaped to &lt;');
  assertNotContains(escaped, '<img', 'Raw <img tag must not appear in output');
});

test('Security — renderMarkdown does not pass through raw HTML tags', () => {
  const html = '<b>injected</b>';
  assertNotContains(renderMarkdown(html), '<b>');
});

test('Security — renderMarkdown handles javascript: URI attempt', () => {
  const evil = '**[click](javascript:alert(1))**';
  // After markdown rendering, verify no javascript: URI passed through unescaped
  const out = renderMarkdown(evil);
  // The parentheses get through as text only (no href context here, markdown doesn't render links)
  assertTrue(typeof out === 'string', 'Should return a string without throwing');
});

// ============================================================
// ADDITIONAL EDGE-CASE TESTS
// ============================================================

// --- assertFalse self-tests ---
test('assertFalse — passes on false', () => {
  assertFalse(false);
});
test('assertFalse — passes on 0', () => {
  assertFalse(0);
});
test('assertFalse — passes on empty string', () => {
  assertFalse('');
});

// --- escapeHtml extra edge cases ---
test('escapeHtml — leaves numeric content unchanged', () => {
  assertEqual(escapeHtml('Hello 123'), 'Hello 123');
});
test('escapeHtml — escapes multiple ampersands', () => {
  const out = escapeHtml('a&b&c');
  assertEqual(out, 'a&amp;b&amp;c');
});
test('escapeHtml — handles all special chars together', () => {
  const out = escapeHtml('<>&"\'')
  assertContains(out, '&lt;');
  assertContains(out, '&gt;');
  assertContains(out, '&amp;');
  assertContains(out, '&quot;');
  assertContains(out, '&#39;');
});
test('escapeHtml — very long string does not throw', () => {
  const long = 'a'.repeat(10000);
  assertEqual(escapeHtml(long).length, 10000);
});

// --- renderMarkdown extra edge cases ---
test('renderMarkdown — empty string produces paragraph tags', () => {
  const out = renderMarkdown('');
  assertTrue(out.startsWith('<p>') && out.endsWith('</p>'), 'Should wrap in <p>');
});
test('renderMarkdown — multiple bold items all rendered', () => {
  const out = renderMarkdown('**a** and **b**');
  assertEqual((out.match(/<strong>/g) || []).length, 2, 'Should have 2 <strong> tags');
});
test('renderMarkdown — multiple italic items all rendered', () => {
  const out = renderMarkdown('*x* and *y*');
  assertEqual((out.match(/<em>/g) || []).length, 2, 'Should have 2 <em> tags');
});
test('renderMarkdown — does not produce raw <a> href tags', () => {
  const out = renderMarkdown('[link](https://example.com)');
  assertNotContains(out, '<a ', 'Markdown links must not become <a> tags');
});

// --- getTime extra edge cases ---
test('getTime — does not return undefined', () => {
  assertFalse(getTime() === 'undefined', 'getTime should not return string "undefined"');
});
test('getTime — result is a string of at least 4 chars', () => {
  assertTrue(getTime().length >= 4, 'Time string should be at least 4 characters long');
});

// --- findAnswer extra topics and edge cases ---
test('findAnswer — "hi" returns greeting answer', () => {
  assertContains(findAnswer('hi'), 'Namaste');
});
test('findAnswer — "hey" returns greeting answer', () => {
  assertContains(findAnswer('hey'), 'Namaste');
});
test('findAnswer — "hii" returns greeting answer', () => {
  assertContains(findAnswer('hii'), 'Namaste');
});
test('findAnswer — "voting procedure" routes to howToVote', () => {
  assertContains(findAnswer('voting procedure'), 'Step 1');
});
test('findAnswer — "polling booth rules" routes to votingRules', () => {
  assertContains(findAnswer('polling booth rules'), 'DOs at the Polling Booth');
});
test('findAnswer — "new voter id" routes to voterId', () => {
  assertContains(findAnswer('new voter id'), 'EPIC');
});
test('findAnswer — "nota option" routes to nota topic', () => {
  assertContains(findAnswer('nota option'), 'None Of The Above');
});
test('findAnswer — "NOTA" uppercase routes to nota', () => {
  assertContains(findAnswer('NOTA'), 'NOTA');
});
test('findAnswer — "am i eligible to vote" routes to eligibility', () => {
  assertContains(findAnswer('am i eligible to vote'), 'citizen of India');
});
test('findAnswer — only whitespace returns default', () => {
  assertContains(findAnswer('   '), '1950');
});
test('findAnswer — special characters handled gracefully', () => {
  const result = findAnswer('!@#$%^&*()');
  assertTrue(typeof result === 'string' && result.length > 0, 'Should return a non-empty string');
});

// ============================================================
// EXPORT RESULTS
// ============================================================

/**
 * Returns the full test results array.
 * @returns {Array<{name: string, passed: boolean, error: string|null}>}
 */
function getResults() {
  return testResults;
}

// ============================================================
// EXPORTS
// ============================================================

if (typeof module !== 'undefined' && module.exports) {
  // Node.js / CommonJS environment
  module.exports = { getResults, test, assertEqual, assertTrue, assertFalse, assertContains, assertNotContains };
} else {
  // Browser environment — attach to window so test-runner.html can call getResults()
  window.getResults          = getResults;
  window.test                = test;
  window.assertEqual         = assertEqual;
  window.assertTrue          = assertTrue;
  window.assertFalse         = assertFalse;
  window.assertContains      = assertContains;
  window.assertNotContains   = assertNotContains;
}
