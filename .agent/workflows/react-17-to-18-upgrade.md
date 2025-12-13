---
description: Upgrade from React 17 to React 18
---

# React 17 → React 18 Upgrade Guide

Simple, focused guide to upgrade your project from React 17 to React 18.

---

## Why React 18?

- ✅ **Stable and battle-tested** (released April 2022)
- ✅ **No known vulnerabilities** (unlike React 19.0-19.2.0)
- ✅ **Excellent compatibility** with existing code
- ✅ **Performance improvements** (automatic batching, concurrent features)
- ✅ **Long-term support** from the React team

---

## What Needs to Change

### Files to Modify:
1. **`src/index.js`** - Update to React 18 Root API
2. **`package.json`** - Dependencies (automatic via npm)

### No Changes Needed:
- ✅ React Router can stay at v5 (or upgrade to v6 separately later)
- ✅ Your components work as-is
- ✅ No breaking changes in your code

---

## Step-by-Step Instructions

### Step 1: Create Backup (30 seconds)

```bash
cd /home/samuel/git/personal/premierportal
git checkout -b upgrade-react-18
git status  # Ensure clean working directory
```

---

### Step 2: Update Dependencies (2 minutes)

```bash
# Update React and React DOM to version 18
npm install react@18 react-dom@18

# Update React Scripts to version 5 (compatible with React 18)
npm install react-scripts@5

# Update testing libraries
npm install --save-dev @testing-library/react@14 @testing-library/jest-dom@6 @testing-library/user-event@14
```

---

### Step 3: Update `src/index.js` (2 minutes)

**Current code:**
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

reportWebVitals()
```

**New code for React 18:**
```javascript
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import { Switch, Route, HashRouter } from 'react-router-dom'
import reportWebVitals from './reportWebVitals'
import Calendar from './Components/Calendar/Calendar'
import Categories from './Components/Categories/Categories'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
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
  </React.StrictMode>
)

reportWebVitals()
```

**What changed:**
1. Line 2: `import { createRoot } from 'react-dom/client'` instead of `import ReactDOM from 'react-dom'`
2. Lines 11-12: Create root container
3. Line 14: Use `root.render()` instead of `ReactDOM.render()`
4. Removed the second argument (no more `document.getElementById('root')` in render)

---

### Step 4: Clean Install (1 minute)

```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Step 5: Test the Application (5 minutes)

```bash
# Start development server
npm start
```

**Test these in your browser:**
- [ ] Home page loads (`/`)
- [ ] Loupes page loads (`/loupes`)
- [ ] Categories page loads (`/categorias`)
- [ ] Navigation works between pages
- [ ] No console errors
- [ ] All components render correctly

---

### Step 6: Run Tests (2 minutes)

```bash
npm test -- --watchAll=false
```

---

### Step 7: Build for Production (2 minutes)

```bash
npm run build
```

If successful, you should see:
```
The build folder is ready to be deployed.
```

---

### Step 8: Commit Changes (1 minute)

```bash
git add .
git commit -m "Upgrade to React 18"
git push origin upgrade-react-18
```

---

## Expected package.json After Upgrade

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^5.3.0",
    "react-scripts": "^5.0.1",
    ...
  },
  "devDependencies": {
    "@testing-library/react": "^14.3.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.5.2",
    ...
  }
}
```

---

## What You Get with React 18

### Performance Improvements
- **Automatic Batching**: Multiple state updates are batched together
- **Concurrent Rendering**: Better responsiveness for complex UIs
- **Transitions**: Smooth UI updates with `useTransition`

### New Features (Optional to Use)
- `useId()` - Generate unique IDs
- `useTransition()` - Mark updates as non-urgent
- `useDeferredValue()` - Defer expensive computations
- `useSyncExternalStore()` - Subscribe to external stores

### Better Developer Experience
- Improved error messages
- Better TypeScript support
- Stricter development mode checks

---

## Troubleshooting

### Issue: "Cannot find module 'react-dom/client'"

**Cause:** React 18 not installed properly

**Solution:**
```bash
npm install react@18 react-dom@18
```

---

### Issue: Tests failing with "act" warnings

**Cause:** Testing library needs update

**Solution:**
```bash
npm install --save-dev @testing-library/react@14
```

---

### Issue: Build warnings about deprecated packages

**Solution:**
```bash
npm audit fix
```

---

### Issue: Application doesn't start

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## Rollback Plan

If you need to go back to React 17:

```bash
# Switch to main branch
git checkout main

# Or revert the upgrade branch
git checkout upgrade-react-18
git revert HEAD
```

---

## React Router: Stay on v5 or Upgrade to v6?

**Recommendation: Stay on React Router v5 for now**

Why?
- ✅ Works perfectly with React 18
- ✅ No code changes needed
- ✅ Stable and well-tested
- ✅ You can upgrade React Router separately later

If you want to upgrade React Router v6 later, that's a separate task with its own breaking changes.

---

## Summary

### Total Time: ~15-30 minutes

### Changes Required:
- ✅ 1 file to modify (`src/index.js`)
- ✅ Dependencies updated via npm
- ✅ No changes to components
- ✅ No changes to routing

### Risk Level: **LOW**
- React 18 is very backward compatible
- Simple API change (createRoot)
- Easy rollback if needed

---

## Next Steps After Successful Upgrade

1. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

2. **Monitor for issues**
   - Check browser console
   - Test all features
   - Monitor user feedback

3. **Optional: Explore React 18 features**
   - Try `useTransition` for better UX
   - Use `useId` for accessible components
   - Experiment with Suspense improvements

---

## Questions?

- Official guide: https://react.dev/blog/2022/03/08/react-18-upgrade-guide
- React 18 docs: https://react.dev/

---

**Ready to upgrade? Start with Step 1!** 🚀
