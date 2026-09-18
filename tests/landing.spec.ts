import { test, expect } from '@playwright/test';

// Verify queued events locally without sending test conversions to Meta.
test.beforeEach(async ({ page }) => {
  await page.route('https://connect.facebook.net/**', route => route.abort());
});

test('complete landing, working local font and consultation destinations', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('임상 데이터비포·애프터인플루언서');
  await expect(page.locator('main > section')).toHaveCount(14);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('600 16px Pretendard'))).toBe(true);
  expect(await page.locator('body *').evaluateAll(elements => elements
    .filter(el => el.textContent?.trim() && !getComputedStyle(el).fontFamily.startsWith('Pretendard'))
    .map(el => el.tagName))).toEqual([]);
  const links = page.getByRole('link', { name: '특허 마케팅 신청하기', exact: false });
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('href', 'https://tally.so/r/ZjZ98a');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await expect(page.getByRole('link', { name: 'marketing@lawmun.com' })).toHaveAttribute('href', 'mailto:marketing@lawmun.com');
  expect(errors).toEqual([]);
});

test('pricing is informational with a permanently highlighted package', async ({ page }) => {
  await page.goto('/');
  const group = page.getByRole('group', { name: 'IP 마케팅 패키지 가격' });
  await expect(group.getByRole('button')).toHaveCount(0);
  await expect(group.locator('article')).toHaveCount(2);
  await expect(group).toContainText('40만원');
  await expect(group).toContainText('25만원');
  await expect(group).toContainText('총 100만원');
  await expect(group.getByText(/선택하기|선택됨/)).toHaveCount(0);
  await expect(group.locator('.pricing-card--recommended')).toHaveCSS('border-top-color', 'rgb(243, 216, 137)');
});

test('Meta initializes once and every consultation click queues one Lead', async ({ page }) => {
  await page.goto('/');
  const queue = () => page.evaluate(() => Array.from((window.fbq as unknown as { queue: IArguments[] }).queue, args => Array.from(args)));
  expect(await queue()).toEqual([['init', '934398425706152'], ['track', 'PageView']]);
  await page.evaluate(() => document.addEventListener('click', e => e.preventDefault(), true));
  const links = page.locator('.consult-link');
  for (let i = 0; i < await links.count(); i++) {
    await links.nth(i).click();
    expect((await queue()).filter(args => args[1] === 'Lead')).toHaveLength(i + 1);
  }
});

test('carousels loop across both ends with keyboard navigation', async ({ page }) => {
  // Keep keyboard traversal independent from image loading and autoplay timing.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const [name, total, initial] of [['광고 소재 예시', 3, 2], ['특허 활용 사례', 5, 3]] as const) {
    const viewport = page.getByRole('region', { name }).locator('.carousel__viewport');
    await viewport.focus();
    for (let i = 1; i <= total + 2; i++) {
      await viewport.press('ArrowRight');
      await expect(viewport).toHaveAttribute('aria-label', new RegExp(`현재 ${(initial - 1 + i) % total + 1}/${total}`));
    }
    for (let i = total + 1; i >= 0; i--) {
      await viewport.press('ArrowLeft');
      await expect(viewport).toHaveAttribute('aria-label', new RegExp(`현재 ${(initial - 1 + i) % total + 1}/${total}`));
    }
  }
});

test('drag advances a card and keyboard focus stops autoplay', async ({ page }) => {
  await page.goto('/');
  const carousel = page.getByRole('region', { name: '광고 소재 예시' });
  const viewport = carousel.locator('.carousel__viewport');
  await viewport.scrollIntoViewIfNeeded();
  const rect = (await viewport.boundingBox())!;
  await page.mouse.move(rect.x + rect.width / 2, rect.y + 60);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width / 2 - 100, rect.y + 60, { steps: 8 });
  await page.mouse.up();
  await expect(viewport).toHaveAttribute('aria-label', /현재 3\/3/);
  await viewport.focus();
  await expect(page.locator('.carousel__controls')).toHaveCount(0);
  await page.clock.install();
  await page.clock.fastForward(10000);
  await expect(viewport).toHaveAttribute('aria-label', /현재 3\/3/);
});

test('autoplay advances at the specified interval', async ({ page }) => {
  await page.clock.install();
  for (const [name, interval, initial, next, following] of [
    ['광고 소재 예시', 1600, '2/3', '3/3', '1/3'],
    ['특허 활용 사례', 2400, '3/5', '4/5', '5/5'],
  ] as const) {
    await page.goto('/');
    const viewport = page.getByRole('region', { name }).locator('.carousel__viewport');
    await viewport.scrollIntoViewIfNeeded();
    await expect(viewport).toHaveAttribute('aria-label', new RegExp(`현재 ${initial}`));
    await page.clock.runFor(interval + 100);
    await expect(viewport).toHaveAttribute('aria-label', new RegExp(`현재 ${next}`));
    await page.clock.runFor(interval);
    await expect(viewport).toHaveAttribute('aria-label', new RegExp(`현재 ${following}`));
  }
});

test('failed images preserve their empty frame', async ({ page }) => {
  await page.route('**/medical_moz.png', route => route.abort());
  await page.goto('/');
  const image = page.locator('img[alt="임상 데이터 광고 예시"]').first();
  await expect(image).toHaveClass(/image-unavailable/);
  expect((await image.boundingBox())!.height).toBeGreaterThan(100);
  await expect(page.getByText('이미지 URL 입력 영역')).toHaveCount(0);
});

test('drag pauses for three seconds and then autoplay resumes', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const viewport = page.getByRole('region', { name: '광고 소재 예시' }).locator('.carousel__viewport');
  await viewport.scrollIntoViewIfNeeded();
  const rect = (await viewport.boundingBox())!;
  await page.mouse.move(rect.x + rect.width / 2, rect.y + 70);
  await page.mouse.down();
  await page.mouse.move(rect.x + rect.width / 2 - 100, rect.y + 70, { steps: 5 });
  await page.mouse.up();
  await expect(viewport).toHaveAttribute('aria-label', /현재 3\/3/);
  await page.clock.runFor(2900);
  await expect(viewport).toHaveAttribute('aria-label', /현재 3\/3/);
  await page.clock.runFor(200);
  await expect(viewport).toHaveAttribute('aria-label', /현재 1\/3/);
});

test('reduced motion leaves process content visible and disables autoplay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/');
  const viewport = page.getByRole('region', { name: '광고 소재 예시' }).locator('.carousel__viewport');
  await page.clock.runFor(10000);
  await expect(viewport).toHaveAttribute('aria-label', /현재 2\/3/);
  await expect(page.locator('.process-step').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('.process-step').first()).toHaveCSS('transform', 'none');
});

test('scroll reveals process once and the footer stays readable', async ({ page }) => {
  await page.goto('/');
  await page.locator('#process').scrollIntoViewIfNeeded();
  await expect(page.locator('.process-step').last()).toHaveCSS('opacity', '1');
  await page.locator('#intro').scrollIntoViewIfNeeded();
  await page.locator('#process').scrollIntoViewIfNeeded();
  await expect(page.locator('.process-step').first()).toHaveCSS('opacity', '1');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(page.getByText('대표 변리사 : 이원택, 김성현')).toBeVisible();
  await expect(page.getByText('사업자등록번호 : 797-43-01231')).toBeVisible();
});

test('all sections fit narrow and wide screens without horizontal scrolling', async ({ page }) => {
  for (const width of [320, 360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const overflow = await page.locator('.pricing-card, .reaction-card, .process-step, .consult-link, .value-card').evaluateAll(elements =>
      elements.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.className));
    expect(overflow).toEqual([]);
    const examples = await page.locator('.example-card').evaluateAll(elements =>
      elements.map(el => ({ x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y })));
    expect(Math.abs(examples[0].y - examples[1].y)).toBeLessThan(1);
    expect(examples[1].x).toBeGreaterThan(examples[0].x);
    // Approved compact layout: reactions stay 2x2 and prices stay side by side,
    // including on phones. Check rendered positions, not just CSS declarations.
    for (const selector of ['.reaction-card', '.pricing-card']) {
      const cards = await page.locator(selector).evaluateAll(elements =>
        elements.map(el => {
          const { x, y, width, height } = el.getBoundingClientRect();
          return { x, y, width, height };
        }));
      expect(cards.length).toBe(selector === '.reaction-card' ? 4 : 2);
      expect(Math.abs(cards[0].y - cards[1].y)).toBeLessThan(1);
      expect(cards[1].x).toBeGreaterThanOrEqual(cards[0].x + cards[0].width);
      if (cards.length === 4) {
        expect(cards[2].y).toBeGreaterThanOrEqual(cards[0].y + cards[0].height);
        expect(Math.abs(cards[2].y - cards[3].y)).toBeLessThan(1);
        expect(Math.abs(cards[0].x - cards[2].x)).toBeLessThan(1);
      }
    }
  }
});

test('consultation steps light in sequence and remain lit after scrolling away', async ({ page }) => {
  await page.goto('/');
  const steps = page.locator('.consult-steps');
  await steps.scrollIntoViewIfNeeded();
  await expect(steps).toHaveAttribute('data-active', 'true');
  const items = steps.locator('li');
  await expect(items.nth(0)).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(items.nth(2)).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.locator('#intro').scrollIntoViewIfNeeded();
  await steps.scrollIntoViewIfNeeded();
  for (const item of await items.all()) {
    await expect(item).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(item).toHaveCSS('color', 'rgb(21, 27, 40)');
  }
});

test('book stays on certificate until requested and supports next and back', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const book = page.locator('.book-showcase');
  await book.scrollIntoViewIfNeeded();
  await page.clock.runFor(15000);
  await expect(book).toHaveAttribute('aria-label', /현재 1\/6/);
  await book.getByRole('button', { name: '상세페이지 활용방안 예시보기' }).click();
  await expect(book).toHaveAttribute('aria-label', /현재 2\/6/);
  await expect(book.locator('.book-showcase__turning')).toHaveCount(1);
  await page.clock.runFor(15000);
  await expect(book).toHaveAttribute('aria-label', /현재 2\/6/);
  await book.getByRole('button', { name: '뒤로가기' }).click();
  await expect(book).toHaveAttribute('aria-label', /현재 1\/6/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await book.getByRole('button', { name: '상세페이지 활용방안 예시보기' }).click();
  await expect(book).toHaveAttribute('aria-label', /현재 2\/6/);
  await expect(book.locator('.book-showcase__turning')).toHaveCount(0);
});
