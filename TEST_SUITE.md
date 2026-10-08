# Pet Community Platform - Test Suite Documentation

## Overview

This document describes the complete test suite for the Pet Community Platform, including setup instructions, test descriptions, and how to run tests.

## Test Suite Components

### 1. API Tests (`tests/api.spec.js`)
Tests for FastAPI backend endpoints using Playwright's API testing capabilities.

**Tests Included:**
- Root endpoint verification
- User creation and retrieval
- Post CRUD operations (Create, Read, Update, Delete)
- Comment functionality
- Error handling (404 responses)

**Total API Tests:** 13

### 2. UI Tests (`tests/app.spec.js`)
End-to-end tests for React frontend using Playwright browser automation.

**Tests Included:**
- Homepage loading and header display
- Create post button visibility
- Modal interactions
- Post creation with all fields
- Pet type badge display
- Comment addition
- User information display
- Form validation
- Multiple posts display

**Total UI Tests:** 11

### 3. Total Test Coverage
- **24 automated tests**
- **API endpoints:** 13 tests
- **UI interactions:** 11 tests
- **Browsers tested:** Chrome, Firefox, Safari (configurable)

---

## Prerequisites

### System Requirements
- **Node.js:** v16 or higher
- **Python:** v3.8 or higher
- **npm:** v7 or higher
- **Git:** (optional, for version control)

### Installation

1. **Clone/Download the project**
   ```bash
   cd GYM_WEBSITE
   ```

2. **Install dependencies** (automated by test runner)
   ```bash
   # Backend
   cd backend
   pip install fastapi uvicorn pydantic python-multipart
   
   # Frontend
   cd ../frontend
   npm install --legacy-peer-deps
   
   # Playwright
   npx playwright install --with-deps
   ```

---

## Running Tests

### Option 1: Automated Test Suite (Recommended)

#### Windows
```bash
run_tests.bat
```

#### Linux/Mac
```bash
bash run_tests.sh
```

#### Python (All Platforms)
```bash
python run_test_suite.py
```

### Option 2: Manual Test Execution

#### Start Backend Server
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

#### Start Frontend Server (in new terminal)
```bash
cd frontend
npm start
```

#### Run Tests (in another terminal)
```bash
# Run all tests
npx playwright test

# Run API tests only
npx playwright test tests/api.spec.js

# Run UI tests only
npx playwright test tests/app.spec.js

# Run with UI mode (interactive)
npx playwright test --ui

# Run with headed browser (see browser)
npx playwright test --headed

# Run specific test
npx playwright test -g "should create a new post"
```

### Option 3: CI/CD Pipeline

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

See `.github/workflows/playwright-tests.yml` for configuration.

---

## Test Execution Flow

### Phase 1: Setup
1. Install backend dependencies
2. Install frontend dependencies
3. Install Playwright browsers

### Phase 2: Start Servers
1. Start FastAPI backend on `http://localhost:8000`
2. Start React frontend on `http://localhost:3000`
3. Wait for servers to be ready

### Phase 3: Run Tests
1. Execute API tests against backend
2. Execute UI tests against frontend
3. Collect test results

### Phase 4: Cleanup
1. Generate test report (`test_report.json`)
2. Stop backend server
3. Stop frontend server
4. Display summary

---

## Test Report

After running tests, a report is generated at `test_report.json` containing:

```json
{
  "timestamp": "2024-01-15T10:30:00.000000",
  "tests": [
    {
      "name": "API Tests",
      "success": true,
      "returncode": 0,
      "timestamp": "2024-01-15T10:30:05.000000"
    },
    {
      "name": "UI Tests",
      "success": true,
      "returncode": 0,
      "timestamp": "2024-01-15T10:30:45.000000"
    }
  ],
  "summary": {
    "total_tests": 2,
    "passed": 2,
    "failed": 0,
    "success_rate": "100%"
  }
}
```

---

## API Test Details

### User Endpoints
- `POST /users` - Create new user
- `GET /users` - Get all users

### Post Endpoints
- `POST /posts` - Create new post
- `GET /posts` - Get all posts
- `GET /posts/{post_id}` - Get specific post
- `PUT /posts/{post_id}` - Update post
- `DELETE /posts/{post_id}` - Delete post

### Comment Endpoints
- `POST /posts/{post_id}/comments` - Add comment
- `GET /posts/{post_id}/comments` - Get comments
- `DELETE /comments/{comment_id}` - Delete comment

---

## UI Test Details

### Homepage Tests
- Load homepage
- Display header with title
- Show create post button

### Post Creation Tests
- Open create post modal
- Fill form fields
- Submit post
- Verify post appears

### Comment Tests
- Add comment to post
- Display comments
- Cancel comment form

### Validation Tests
- Required field validation
- Pet type selection
- Image URL input

---

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # Mac/Linux

# Kill process using port 8000
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # Mac/Linux
```

### Frontend Won't Start
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Playwright Issues
```bash
# Reinstall Playwright
npx playwright install --with-deps

# Run with debug mode
PWDEBUG=1 npx playwright test
```

### Port Already in Use
- Backend: Change port in `backend/main.py` and update tests
- Frontend: Change port in `frontend/package.json` and update tests

---

## Continuous Integration

### GitHub Actions Workflow
- **File:** `.github/workflows/playwright-tests.yml`
- **Triggers:** Push and Pull Requests
- **Runs on:** Ubuntu Latest
- **Artifacts:** Test reports and screenshots

### Local CI Simulation
```bash
# Run tests as CI would
CI=true python run_test_suite.py
```

---

## Performance Metrics

### Expected Test Execution Times
- Setup: 2-3 minutes
- Backend startup: 3-5 seconds
- Frontend startup: 5-10 seconds
- API tests: 30-60 seconds
- UI tests: 60-120 seconds
- Total: 5-10 minutes

---

## Best Practices

1. **Run tests before committing**
   ```bash
   python run_test_suite.py
   ```

2. **Keep tests isolated** - Each test should be independent

3. **Use meaningful test names** - Describe what is being tested

4. **Update tests when features change** - Keep tests in sync with code

5. **Review test failures** - Investigate and fix issues promptly

6. **Monitor test performance** - Track execution time trends

---

## Adding New Tests

### API Test Template
```javascript
test('should [action]', async ({ request }) => {
  const response = await request.post(`${API_URL}/endpoint`, {
    data: { /* test data */ }
  });
  
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty('expectedField');
});
```

### UI Test Template
```javascript
test('should [action]', async ({ page }) => {
  await page.goto('/');
  
  const element = page.locator('selector');
  await expect(element).toBeVisible();
  
  await element.click();
  // Assert expected behavior
});
```

---

## Support

For issues or questions:
1. Check `issues.md` for known issues
2. Review test output for error messages
3. Check GitHub Actions logs for CI failures
4. Consult Playwright documentation: https://playwright.dev

---

## Resources

- **Playwright Documentation:** https://playwright.dev
- **FastAPI Documentation:** https://fastapi.tiangolo.com
- **React Documentation:** https://react.dev
- **GitHub Actions:** https://docs.github.com/en/actions

---

**Last Updated:** 2024-01-15  
**Test Suite Version:** 1.0.0
