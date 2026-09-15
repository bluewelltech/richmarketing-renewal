import { test, expect } from '@playwright/test';

test('complete landing, working local font and consultation destinations', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('임상 데이터비포·애프터인플루언서');
  await expect(page.locator('main > section')).toHaveCount(14);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('600 16px Pretendard'))).toBe(true);
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

test('package selection highlights just the chosen package and supports keyboard', async ({ page }) => {
  await page.goto('/');
  const group = page.getByRole('group', { name: 'IP 마케팅 패키지 선택' });
  await expect(group.getByRole('button')).toHaveCount(2);
  const single = group.getByRole('button', { name: '1건 40만원', exact: true });
  await single.click();
  await expect(single).toHaveAttribute('aria-pressed', 'true');
  const bundle = group.getByRole('button', { name: '4건 20만원씩, 총 80만원' });
  await bundle.focus(); await page.keyboard.press('Enter');
  await expect(bundle).toHaveAttribute('aria-pressed', 'true');
  await expect(single).toHaveAttribute('aria-pressed', 'false');
  await expect(group.locator('[aria-pressed="true"]')).toHaveCount(1);
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

test('drag advances a card and a pause control stops autoplay', async ({ page }) => {
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
  await carousel.getByRole('button', { name: '광고 소재 예시 자동재생 일시정지' }).click();
  await expect(carousel.getByRole('button', { name: '광고 소재 예시 자동재생 시작' })).toHaveAttribute('aria-pressed', 'true');
  await page.clock.install();
  await page.clock.fastForward(10000);
  await expect(viewport).toHaveAttribute('aria-label', /현재 3\/3/);
});

test('autoplay advances at the specified interval', async ({ page }) => {
  await page.clock.install();
  for (const [name, interval, initial, next, following] of [
    ['광고 소재 예시', 2000, '2/3', '3/3', '1/3'],
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
  }
});
