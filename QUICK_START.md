# Quick Start - Test Suite

## 🚀 Run Tests in 3 Steps

### Step 1: Navigate to Project
```bash
cd GYM_WEBSITE
```

### Step 2: Run Test Suite

**Windows:**
```bash
run_tests.bat
```

**Linux/Mac:**
```bash
bash run_tests.sh
```

**Any Platform:**
```bash
python run_test_suite.py
```

### Step 3: View Results
- Check console output for test results
- Open `test_report.json` for detailed report
- Check `playwright-report/` for HTML report (if available)

---

## 📊 What Gets Tested

✅ **API Tests (13 tests)**
- User management
- Post CRUD operations
- Comments functionality
- Error handling

✅ **UI Tests (11 tests)**
- Homepage loading
- Post creation
- Comments
- Form validation
- User interactions

---

## 🔧 Manual Testing

### Start Backend
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### Start Frontend (new terminal)
```bash
cd frontend
npm start
```

### Run Tests (another terminal)
```bash
npx playwright test
```

---

## 📝 Test Report

After running, check:
- **Console output** - Real-time test progress
- **test_report.json** - Detailed results
- **playwright-report/** - HTML report with screenshots

---

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8000 in use | Kill process: `taskkill /PID <PID> /F` (Windows) |
| Port 3000 in use | Kill process: `taskkill /PID <PID> /F` (Windows) |
| npm install fails | Run: `npm cache clean --force` |
| Playwright issues | Run: `npx playwright install --with-deps` |

---

## 📚 More Info

- Full documentation: See `TEST_SUITE.md`
- Known issues: See `issues.md`
- Test files: `tests/api.spec.js`, `tests/app.spec.js`

---

**Ready to test? Run the command above! 🎉**
