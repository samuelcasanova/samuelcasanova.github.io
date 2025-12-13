---
description: Project-specific upgrade instructions
---

# Project-Specific Upgrade Guide

This guide contains the exact changes needed for YOUR specific project.

## Files That MUST Be Modified

### 1. `/src/index.js` (CRITICAL - Required)

**Current code (lines 1-24):**
```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import { Switch, Route, HashRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import Calendar from './Components/Calendar/Calendar'
import Categories from './Components/Categories/Categories'

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Header/>
      <Switch>
        <Route key='home' exact path='/'>
          <Calendar calendarName='home'/>
        </Route>
        <Route key='loupes' path='/loupes'>
          <Calendar calendarName='loupes'/>
        </Route>
        <Route key='categories' path='/categorias' component={Categories}/>
      </Switch>
      <Footer />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
```

**Updated code for React 18 + React Router v6:**
```javascript
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import { Routes, Route, HashRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import Calendar from './Components/Calendar/Calendar'
import Categories from './Components/Categories/Categories'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <HashRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Calendar calendarName='home'/>} />
        <Route path='/loupes' element={<Calendar calendarName='loupes'/>} />
        <Route path='/categorias' element={<Categories/>} />
      </Routes>
      <Footer />
    </HashRouter>
  </React.StrictMode>
)
```

**Key changes:**
1. ✅ Import `createRoot` from `react-dom/client` instead of `ReactDOM` from `react-dom`
2. ✅ Replace `Switch` with `Routes`
3. ✅ Remove `exact` prop (default in v6)
4. ✅ Remove `key` props (not needed in v6)
5. ✅ Replace child components with `element` prop
6. ✅ Replace `component={Categories}` with `element={<Categories/>}`

---

### 2. `.nvmrc` (RECOMMENDED)

**Current:**
```
v16
```

**Updated:**
```
v20
```

---

## Files to Check for React Router Hooks

Search these files for React Router hooks that may need updating:

### Common patterns to find and replace:

#### Pattern 1: useHistory
```javascript
// OLD
import { useHistory } from 'react-router-dom'
const history = useHistory()
history.push('/path')
history.replace('/path')
history.goBack()

// NEW
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/path')
navigate('/path', { replace: true })
navigate(-1)
```

#### Pattern 2: useRouteMatch
```javascript
// OLD
import { useRouteMatch } from 'react-router-dom'
const match = useRouteMatch()

// NEW
import { useMatch } from 'react-router-dom'
const match = useMatch('/path/:id')
```

#### Pattern 3: useLocation (no change needed)
```javascript
// Works the same in v6
import { useLocation } from 'react-router-dom'
const location = useLocation()
```

---

## Search Commands to Find Issues

Run these commands to find files that might need updates:

```bash
# Find files using useHistory
grep -r "useHistory" src/

# Find files using useRouteMatch
grep -r "useRouteMatch" src/

# Find files using withRouter
grep -r "withRouter" src/

# Find files using Route component
grep -r "Route" src/

# Find files using Switch
grep -r "Switch" src/

# Find files using Redirect
grep -r "Redirect" src/
```

---

## Step-by-Step Execution Plan

### Step 1: Backup
```bash
git checkout -b backup-before-upgrade
git push origin backup-before-upgrade
git checkout -b upgrade-to-react-18
```

### Step 2: Update Node
```bash
# Update .nvmrc file manually to v20
nvm install 20
nvm use 20
node --version  # Should show v20.x.x
```

### Step 3: Update Dependencies
```bash
# Core React
npm install react@latest react-dom@latest

# React Scripts
npm install react-scripts@latest

# React Router
npm install react-router-dom@latest

# Testing libraries
npm install --save-dev @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest

# Other dependencies
npm install web-vitals@latest react-collapsible@latest
npm install --save-dev typescript@latest gh-pages@latest
npm install --save-dev @typescript-eslint/parser@latest @typescript-eslint/eslint-plugin@latest
npm install --save-dev eslint-config-standard@latest eslint-plugin-node@latest eslint-plugin-promise@latest
```

### Step 4: Update Code Files

**Update `/src/index.js`** (see exact code above)

### Step 5: Search for Router Hooks
```bash
# Check if any files use these hooks
grep -r "useHistory\|useRouteMatch\|withRouter" src/
```

If any files are found, update them according to the patterns above.

### Step 6: Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

### Step 7: Test
```bash
# Check for errors
npm start

# Run tests
npm test -- --watchAll=false

# Build production
npm run build
```

### Step 8: Commit
```bash
git add .
git commit -m "Upgrade to React 18 and React Router v6"
git push origin upgrade-to-react-18
```

---

## Expected Results After Upgrade

### package.json should show:
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x.x",
    "react-scripts": "^5.0.1",
    "typescript": "^5.x.x",
    ...
  }
}
```

### Application should:
- ✅ Start without errors
- ✅ Navigate between routes correctly
- ✅ Display all components properly
- ✅ Pass all tests
- ✅ Build successfully

---

## Troubleshooting

### Issue: "Cannot find module 'react-dom/client'"
**Solution:** Make sure you installed React 18: `npm install react@latest react-dom@latest`

### Issue: "Switch is not exported from 'react-router-dom'"
**Solution:** You're using React Router v6 syntax with v5 code. Update to use `Routes` instead of `Switch`

### Issue: "element is not a valid prop"
**Solution:** You're using React Router v5 syntax with v6. Make sure you updated the import and usage.

### Issue: Tests failing
**Solution:** Update test files to use new React 18 testing utilities. May need to wrap renders in `act()`.

### Issue: Build warnings about deprecated packages
**Solution:** Run `npm audit fix` to update sub-dependencies.

---

## Rollback Instructions

If something goes wrong:

```bash
# Switch to backup
git checkout backup-before-upgrade

# Reinstall old dependencies
rm -rf node_modules package-lock.json
npm install

# Switch back to old Node version
nvm use 16
```

---

## Estimated Time for This Project

- **Code changes:** 15-30 minutes
- **Dependency updates:** 10-15 minutes
- **Testing:** 30-60 minutes
- **Total:** 1-2 hours

## Risk Assessment

**LOW RISK** - Your project has:
- ✅ Simple routing structure (only 3 routes)
- ✅ No apparent use of advanced router features
- ✅ Standard React patterns
- ✅ Good test coverage

The main changes are in one file (`index.js`), making this a straightforward upgrade.
