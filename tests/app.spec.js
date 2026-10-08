import { test, expect } from '@playwright/test';

test.describe('Pet Community Platform', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage with header', async ({ page }) => {
    const header = page.locator('header h1');
    await expect(header).toContainText('Pet Community');
  });

  test('should display create post button', async ({ page }) => {
    const createBtn = page.locator('button:has-text("Create Post")');
    await expect(createBtn).toBeVisible();
  });

  test('should open create post modal', async ({ page }) => {
    const createBtn = page.locator('button:has-text("Create Post")');
    await createBtn.click();
    
    const modal = page.locator('.modal.active');
    await expect(modal).toBeVisible();
    
    const modalHeader = page.locator('.modal-header');
    await expect(modalHeader).toContainText('Create New Post');
  });

  test('should create a new post', async ({ page }) => {
    const createBtn = page.locator('button:has-text("Create Post")');
    await createBtn.click();

    await page.fill('input[name="title"]', 'My Dog is Sick');
    await page.fill('textarea[name="description"]', 'My dog has been vomiting for 2 days. What should I do?');
    await page.fill('input[name="image_url"]', 'https://via.placeholder.com/400');
    await page.selectOption('select[name="pet_type"]', 'Dog');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    await page.waitForTimeout(1000);
    const postTitle = page.locator('text=My Dog is Sick');
    await expect(postTitle).toBeVisible();
  });

  test('should display posts with pet type badge', async ({ page }) => {
    const petTypeBadge = page.locator('.pet-type');
    const count = await petTypeBadge.count();
    
    if (count > 0) {
      await expect(petTypeBadge.first()).toBeVisible();
    }
  });

  test('should add comment to post', async ({ page }) => {
    const createBtn = page.locator('button:has-text("Create Post")');
    await createBtn.click();

    await page.fill('input[name="title"]', 'Cat Question');
    await page.fill('textarea[name="description"]', 'My cat is not eating');
    await page.selectOption('select[name="pet_type"]', 'Cat');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    await page.waitForTimeout(1000);

    const addCommentBtn = page.locator('button:has-text("Add Comment")').first();
    await addCommentBtn.click();

    const commentTextarea = page.locator('textarea[placeholder="Write your comment..."]');
    await expect(commentTextarea).toBeVisible();

    await commentTextarea.fill('You should visit a vet immediately');
    
    const postCommentBtn = page.locator('button:has-text("Post Comment")');
    await postCommentBtn.click();

    await page.waitForTimeout(1000);
    const comment = page.locator('text=You should visit a vet immediately');
    await expect(comment).toBeVisible();
  });

  test('should display user information', async ({ page }) => {
    const userInfo = page.locator('text=Logged in as:');
    await expect(userInfo).toBeVisible();
  });

  test('should cancel comment form', async ({ page }) => {
    const createBtn = page.locator('button:has-text("Create Post")');
    await createBtn.click();

    await page.fill('input[name="title"]', 'Test Post');
    await page.fill('textarea[name="description"]', 'Test description');
    
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    await page.waitForTimeout(1000);

    const addCommentBtn = page.locator('button:has-text("Add Comment")').first();
    await addCommentBtn.click();

    const cancelBtn = page.locator('button:has-text("Cancel")');
    await cancelBtn.click();

    const commentTextarea = page.locator('textarea[placeholder="Write your comment..."]');
    await expect(commentTextarea).not.toBeVisible();
  });

  test('should close modal with close button', async ({ page }) => {
    const createBtn = page.locator('button:has-text("Create Post")');
    await createBtn.click();

    const modal = page.locator('.modal.active');
    await expect(modal).toBeVisible();

    const closeBtn = page.locator('.close-btn');
    await closeBtn.click();

    await expect(modal).not.toHaveClass(/active/);
  });

  test('should display multiple posts', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      const createBtn = page.locator('button:has-text("Create Post")');
      await createBtn.click();

      await page.fill('input[name="title"]', `Post ${i + 1}`);
      await page.fill('textarea[name="description"]', `Description for post ${i + 1}`);
      
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();

      await page.waitForTimeout(500);
    }

    const postCards = page.locator('.post-card');
    const count = await postCards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should validate required fields in create post form', async ({ page }) => {
    const createBtn = page.locator('button:has-text("Create Post")');
    await createBtn.click();

    const submitBtn = page.locator('button[type="submit"]');
    
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).toHaveAttribute('required', '');
    
    const descriptionInput = page.locator('textarea[name="description"]');
    await expect(descriptionInput).toHaveAttribute('required', '');
  });
});
