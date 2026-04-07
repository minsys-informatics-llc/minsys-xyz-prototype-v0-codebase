/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Lightweight test runner for the Talent Acquisition Engine feature.
 * Run with:  npx tsx tests/talent/run.ts
 *
 * Uses node:assert + node:test (built-in, no new deps).
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  roles,
  pillars,
  buildRolePayload,
  buildGeneralPayload,
  countWords,
  clampToWordLimit,
  W3F_ENDPOINT,
} from '../../src/data/talent.ts';
import { getRoute } from '../../src/Router.tsx';

test('US-4: roles array contains exactly the 3 strategic open positions', () => {
  assert.equal(roles.length, 3);
  const titles = roles.map((r) => r.title);
  assert.deepEqual(titles, [
    'M&A Deal Desk Lead',
    'Agentic AI Engineer',
    'Digital & AI Change Manager',
  ]);
  for (const r of roles) {
    assert.ok(r.id, `role ${r.title} missing id`);
    assert.ok(r.pillar);
    assert.ok(r.description.length > 50);
    assert.equal(r.skills.length, 4);
    assert.match(r.imageUrl, /^https:\/\//);
    assert.ok(r.imageAlt);
  }
});

test('US-7: pillars array contains exactly the 4 Minsys pillars in canonical order', () => {
  assert.equal(pillars.length, 4);
  const ids = pillars.map((p) => p.id);
  assert.deepEqual(ids, ['dealdesk', 'nexus', 'studio', 'factory']);
  for (const p of pillars) {
    assert.equal(p.exampleRoles.length, 4);
    assert.ok(p.title);
    assert.ok(p.description.length > 50);
  }
});

test('US-6: buildRolePayload assembles a Web3Forms-shaped object with role-specific subject and body', () => {
  const role = roles[0];
  const payload = buildRolePayload(role, {
    name: 'Jane Doe',
    linkedin: 'https://linkedin.com/in/janedoe',
    portfolio: 'https://janedoe.dev',
    q1: 'I want to rewire Main Street.',
    q2: 'I led a $20M LBO closing in 90 days.',
  });
  assert.equal(payload.subject, '[Minsys Talent] New Application — M&A Deal Desk Lead');
  assert.equal(payload.from_name, 'Jane Doe');
  assert.ok(payload.message.includes('ROLE APPLIED FOR:\nM&A Deal Desk Lead'));
  assert.ok(payload.message.includes('LINKEDIN:\nhttps://linkedin.com/in/janedoe'));
  assert.ok(payload.message.includes('PORTFOLIO:\nhttps://janedoe.dev'));
  assert.ok(payload.message.includes('--- Q1:'));
  assert.ok(payload.message.includes('--- Q2:'));
  assert.ok('access_key' in payload);
});

test('US-6: buildRolePayload defaults missing portfolio to "Not provided"', () => {
  const payload = buildRolePayload(roles[1], {
    name: 'Anon',
    linkedin: 'https://linkedin.com/in/anon',
    portfolio: '',
    q1: 'a',
    q2: 'b',
  });
  assert.ok(payload.message.includes('PORTFOLIO:\nNot provided'));
});

test('US-7: buildGeneralPayload uses generic subject and includes pillar choice', () => {
  const payload = buildGeneralPayload({
    name: 'Sam',
    linkedin: 'https://linkedin.com/in/sam',
    portfolio: '',
    pillar: 'The Nexus',
  });
  assert.equal(payload.subject, '[Minsys Talent] General Interest — Sam');
  assert.ok(payload.message.includes('PILLAR INTEREST:\nThe Nexus'));
});

test('US-5: countWords + clampToWordLimit enforce the 500-word cap', () => {
  assert.equal(countWords(''), 0);
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('one two three'), 3);
  const long = Array.from({ length: 600 }, (_, i) => `w${i}`).join(' ');
  const clamped = clampToWordLimit(long, 500);
  assert.equal(clamped.words, 500);
  assert.equal(countWords(clamped.text), 500);
  const short = clampToWordLimit('only a few words', 500);
  assert.equal(short.words, 4);
  assert.equal(short.text, 'only a few words');
});

test('US-2: getRoute resolves /talent → talent and everything else → home', () => {
  assert.equal(getRoute('/talent'), 'talent');
  assert.equal(getRoute('/talent/'), 'talent');
  assert.equal(getRoute('/'), 'home');
  assert.equal(getRoute('/anything-else'), 'home');
  assert.equal(getRoute('/#capabilities'), 'home');
});

test('US-6: Web3Forms endpoint constant points at the official api.web3forms.com', () => {
  assert.equal(W3F_ENDPOINT, 'https://api.web3forms.com/submit');
});
