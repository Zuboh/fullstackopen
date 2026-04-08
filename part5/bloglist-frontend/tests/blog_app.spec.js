import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper.js'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page).toHaveURL('http://localhost:5173/')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page).toHaveURL('http://localhost:5173/login')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'playwright title',
        author: 'playwright author',
        url: 'https://playwright.dev',
      })

      await expect(page).toHaveURL('http://localhost:5173/')
      await expect(page.getByRole('link', { name: 'playwright title playwright author' })).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: 'first blog',
          author: 'first author',
          url: 'https://first.example.com',
        })
      })

      test('it can be liked', async ({ page }) => {
        const blog = page.locator('.blog').filter({ hasText: 'first blog first author' })
        await page.getByRole('link', { name: 'first blog first author' }).click()
        await blog.getByRole('button', { name: 'like' }).click()

        await expect(blog.getByText('likes 1')).toBeVisible()
      })

      test('it can be removed by the user who added it', async ({ page }) => {
        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })

        const blog = page.locator('.blog').filter({ hasText: 'first blog first author' })
        await page.getByRole('link', { name: 'first blog first author' }).click()
        await blog.getByRole('button', { name: 'remove' }).click()

        await expect(page).toHaveURL('http://localhost:5173/')
        await expect(page.getByRole('link', { name: 'first blog first author' })).not.toBeVisible()
      })

      test('only the user who added the blog sees the remove button', async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Other User',
            username: 'otheruser',
            password: 'salainen',
          },
        })

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'otheruser', 'salainen')

        const blog = page.locator('.blog').filter({ hasText: 'first blog first author' })
        await page.getByRole('link', { name: 'first blog first author' }).click()
        await expect(blog.getByRole('button', { name: 'like' })).toHaveCount(1)
        await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(0)
      })
    })

    describe('and multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: 'least liked',
          author: 'author one',
          url: 'https://one.example.com',
        })
        await createBlog(page, {
          title: 'most liked',
          author: 'author two',
          url: 'https://two.example.com',
        })
        await createBlog(page, {
          title: 'middle liked',
          author: 'author three',
          url: 'https://three.example.com',
        })

        await page.getByRole('link', { name: 'most liked author two' }).click()
        await page.locator('.blog').getByRole('button', { name: 'like' }).click()
        await page.locator('.blog').getByRole('button', { name: 'like' }).click()
        await page.goto('/')

        await page.getByRole('link', { name: 'middle liked author three' }).click()
        await page.locator('.blog').getByRole('button', { name: 'like' }).click()
        await page.goto('/')
      })

      test('blogs are ordered according to likes', async ({ page }) => {
        const blogContents = await page.locator('.blog').allTextContents()

        expect(blogContents[0]).toContain('most liked')
        expect(blogContents[1]).toContain('middle liked')
        expect(blogContents[2]).toContain('least liked')
      })
    })
  })
})
