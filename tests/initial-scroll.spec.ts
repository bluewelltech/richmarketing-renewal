import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://connect.facebook.net/**', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const original = window.scrollTo.bind(window);
    const calls: unknown[][] = [];
    Object.assign(window, { initialScrollCalls: calls });
    window.scrollTo = ((...args: Parameters<typeof window.scrollTo>) => {
      calls.push(args);
      original(...args);
    }) as typeof window.scrollTo;
  });
});

const callCount = (page: import('@playwright/test').Page) => page.evaluate(() =>
  (window as unknown as { initialScrollCalls: unknown[] }).initialScrollCalls.length);

async function readMiddle(page: import('@playwright/test').Page) {
  await page.locator('#pricing').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  return page.evaluate(() => window.scrollY);
}

test('fresh ad visit starts at top once and never resets while reading', async ({ page }) => {
  await page.goto('/?fbclid=test&utm_source=instagram');
  await expect(page.locator('h1')).toBeVisible();
  await expect.poll(() => callCount(page)).toBe(1);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await expect.poll(() => page.evaluate(() => history.scrollRestoration)).toBe('auto');
  const y = await readMiddle(page);
  await page.evaluate(() => {
    window.dispatchEvent(new Event('richmarketing:ready'));
    window.dispatchEvent(new Event('load'));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(2800); // Includes a carousel autoplay interval.
  expect(await callCount(page)).toBe(1);
  expect(Math.abs(await page.evaluate(() => scrollY) - y)).toBeLessThan(10);
});

test('a displaced startup position is corrected before reading', async ({ page }) => {
  await page.route('http://127.0.0.1:5173/', async route => {
    const response = await route.fetch();
    const html = (await response.text()).replace('<div id="root"></div>',
      `<div id="root"></div><script>
        document.documentElement.style.minHeight = '20000px';
        document.documentElement.scrollTop = 1800;
      </script>`);
    await route.fulfill({ response, body: html });
  });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  expect(await callCount(page)).toBe(1);
});

test('explicit section links are excluded and section navigation still works', async ({ page }) => {
  await page.goto('/#intro');
  expect(await callCount(page)).toBe(0);
  expect(await page.evaluate(() => history.scrollRestoration)).toBe('auto');
  await page.evaluate(() => { location.hash = 'pricing'; });
  await expect(page.locator('#pricing')).toBeInViewport();
  expect(await callCount(page)).toBe(0);
});

test('reload leaves native restoration in control', async ({ page, browserName }) => {
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => history.scrollRestoration)).toBe('auto');
  const y = await readMiddle(page);
  await page.reload();
  expect(await callCount(page)).toBe(0);
  expect(await page.evaluate(() => history.scrollRestoration)).toBe('auto');
  // Baseline WebKit also returns to zero on reload of this client-rendered page.
  // Do not introduce a separate restoration policy as part of the fresh-visit fix.
  if (browserName !== 'webkit') {
    await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - y)).toBeLessThan(30);
  }
});

test('back and forward keep each page reading position', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => history.scrollRestoration)).toBe('auto');
  const firstY = await readMiddle(page);
  await page.goto('/?second=1');
  await expect.poll(() => page.evaluate(() => history.scrollRestoration)).toBe('auto');
  await page.locator('#process').scrollIntoViewIfNeeded();
  const secondY = await page.evaluate(() => scrollY);
  await page.goBack();
  await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - firstY)).toBeLessThan(30);
  await page.goForward();
  await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - secondY)).toBeLessThan(30);
});

for (const event of ['pointerdown', 'touchstart', 'wheel', 'keydown', 'pagehide']) {
  test(`${event} during slow startup cancels initial scroll`, async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/src/main.tsx', async route => { await gate; await route.continue(); });
    await page.goto('/', { waitUntil: 'commit' });
    await expect.poll(() => page.evaluate(() => history.scrollRestoration)).toBe('manual');
    await page.evaluate(type => window.dispatchEvent(new Event(type)), event);
    expect(await page.evaluate(() => history.scrollRestoration)).toBe('auto');
    release();
    await expect(page.locator('h1')).toBeVisible();
    expect(await callCount(page)).toBe(0);
  });
}
