---
description: Quick start upgrade guide
---

# Quick Start: Upgrade Your React App

## TL;DR - Fastest Path to Upgrade

This is the minimal set of steps to upgrade your project safely.

---

## Prerequisites

- [ ] All changes committed
- [ ] 30-60 minutes available
- [ ] Backup created

---

## 5-Minute Quick Upgrade

### 1. Create backup (30 seconds)
```bash
git checkout -b upgrade-to-react-18
```

### 2. Update Node version (1 minute)
```bash
# Edit .nvmrc: change v16 to v20
nvm install 20
nvm use 20
```

### 3. Update all dependencies (2 minutes)
```bash
npm install react@latest react-dom@latest react-scripts@latest react-router-dom@latest
npm install --save-dev @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest typescript@latest
npm install web-vitals@latest react-collapsible@latest
npm install --save-dev gh-pages@latest @typescript-eslint/parser@latest @typescript-eslint/eslint-plugin@latest
```

### 4. Update src/index.js (2 minutes)

Replace the entire file with:

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

reportWebVitals()
```

### 5. Update .nvmrc
```
v20
```

### 6. Clean install (1 minute)
```bash
rm -rf node_modules package-lock.json
npm install
```

### 7. Test (5 minutes)
```bash
npm start
# Test the app in browser
# Ctrl+C to stop

npm test -- --watchAll=false
npm run build
```

### 8. Commit (30 seconds)
```bash
git add .
git commit -m "Upgrade to React 18, React Router v6, and Node 20"
git push origin upgrade-to-react-18
```

---

## What Changed?

### Dependencies
- React: 17.0.1 → 18.3.1
- React DOM: 17.0.1 → 18.3.1
- React Scripts: 4.0.3 → 5.0.1
- React Router DOM: 5.3.0 → 6.x
- Node: v16 → v20
- TypeScript: 4.3.5 → 5.x
- All testing libraries updated

### Code Changes
**Only 1 file changed:** `src/index.js`

Changes:
1. `ReactDOM.render` → `createRoot(...).render`
2. `Switch` → `Routes`
3. `<Route path='/' exact>` → `<Route path='/' element={...}/>`
4. Removed `key` props from routes
5. Removed `exact` props from routes

---

## Verification Checklist

After upgrade, verify:

- [ ] `npm start` works without errors
- [ ] Home page loads (`/`)
- [ ] Loupes page loads (`/loupes`)
- [ ] Categories page loads (`/categorias`)
- [ ] Navigation between pages works
- [ ] No console errors
- [ ] Tests pass
- [ ] Production build succeeds

---

## If Something Goes Wrong

### Quick rollback:
```bash
git checkout main
nvm use 16
```

### Common fixes:

**Error: "Cannot find module 'react-dom/client'"**
```bash
npm install react@latest react-dom@latest
```

**Error: "Routes is not exported"**
```bash
npm install react-router-dom@latest
```

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Why Upgrade?

### Security
- ✅ Latest security patches
- ✅ No known vulnerabilities
- ✅ Protected against React 19 vulnerability

### Performance
- ✅ Automatic batching (faster updates)
- ✅ Concurrent rendering support
- ✅ Smaller bundle sizes

### Features
- ✅ React 18 concurrent features
- ✅ Improved TypeScript support
- ✅ Better error messages
- ✅ Modern React Router features

### Maintenance
- ✅ Active support and updates
- ✅ Better documentation
- ✅ Community support

---

## Next Steps After Upgrade

1. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

2. **Monitor for issues**
   - Check application logs
   - Monitor user feedback
   - Watch for console errors

3. **Consider future improvements**
   - Migrate to TypeScript fully
   - Add more tests
   - Optimize bundle size
   - Add error boundaries

---

## Support

If you encounter issues:

1. Check the detailed guides:
   - `upgrade-to-latest.md` - Complete guide
   - `project-specific-upgrade.md` - Your specific changes
   - `upgrade-checklist.md` - Detailed checklist

2. Official documentation:
   - [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
   - [React Router v6 Guide](https://reactrouter.com/en/main/upgrading/v5)

3. Rollback if needed (see above)

---

## Success Criteria

✅ Application runs without errors
✅ All routes work correctly  
✅ Tests pass
✅ Production build succeeds
✅ No console warnings
✅ Performance is same or better

**Estimated total time: 15-30 minutes**
