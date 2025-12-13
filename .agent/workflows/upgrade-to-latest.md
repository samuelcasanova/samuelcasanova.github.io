---
description: Upgrade React application to latest versions
---

# React Application Upgrade Plan

This workflow guides you through upgrading your React application from React 17 to React 18, along with all related dependencies.

## Current State
- React: 17.0.1
- React DOM: 17.0.1
- React Scripts: 4.0.3
- React Router DOM: 5.3.0
- Node: v16
- TypeScript: 4.3.5

## Target State
- React: 18.3.1 (latest stable)
- React DOM: 18.3.1
- React Scripts: 5.0.1
- React Router DOM: 6.x (latest)
- Node: v20 LTS
- TypeScript: 5.x

---

## Phase 1: Preparation & Backup

### 1. Create a backup branch
```bash
git checkout -b backup-before-upgrade
git push origin backup-before-upgrade
git checkout main
git checkout -b upgrade-to-react-18
```

### 2. Ensure all changes are committed
```bash
git status
```

### 3. Document current functionality
Run the application and test all features to ensure you know what works before upgrading.

```bash
npm start
```

### 4. Run existing tests
```bash
npm test -- --watchAll=false
```

---

## Phase 2: Update Node.js Version

### 1. Update .nvmrc file
Update from `v16` to `v20` (current LTS)

### 2. Install and switch to Node 20
```bash
nvm install 20
nvm use 20
```

### 3. Verify Node version
```bash
node --version
```

---

## Phase 3: Update Core React Dependencies

### 1. Update React and React DOM to version 18
```bash
npm install react@latest react-dom@latest
```

### 2. Update React Scripts
```bash
npm install react-scripts@latest
```

### 3. Update TypeScript
```bash
npm install --save-dev typescript@latest
```

### 4. Update testing libraries
```bash
npm install --save-dev @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest
```

### 5. Update web-vitals
```bash
npm install web-vitals@latest
```

---

## Phase 4: Update React Router

React Router v6 has breaking changes from v5. This requires code modifications.

### 1. Install React Router v6
```bash
npm install react-router-dom@latest
```

### 2. Update routing code (Manual step)

**Key changes needed:**
- Replace `<Switch>` with `<Routes>`
- Replace `<Route component={Component}>` with `<Route element={<Component />}>`
- Replace `useHistory()` with `useNavigate()`
- Replace `useRouteMatch()` with `useMatch()`
- Remove `exact` prop (default behavior in v6)

**Example migration:**

**Before (v5):**
```javascript
import { Switch, Route, useHistory } from 'react-router-dom';

function App() {
  const history = useHistory();
  
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </Switch>
  );
}
```

**After (v6):**
```javascript
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
```

---

## Phase 5: Update React 18 Root API

### 1. Update index.js/index.tsx

**Before (React 17):**
```javascript
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

**After (React 18):**
```javascript
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Phase 6: Update TypeScript Configuration

### 1. Update @typescript-eslint packages
```bash
npm install --save-dev @typescript-eslint/parser@latest @typescript-eslint/eslint-plugin@latest
```

### 2. Update tsconfig.json (if exists)
Ensure it includes React 18 types and modern settings.

---

## Phase 7: Update ESLint Dependencies

### 1. Update ESLint related packages
```bash
npm install --save-dev eslint-config-standard@latest eslint-plugin-node@latest eslint-plugin-promise@latest
```

---

## Phase 8: Update Other Dependencies

### 1. Update react-collapsible
```bash
npm install react-collapsible@latest
```

### 2. Update gh-pages
```bash
npm install --save-dev gh-pages@latest
```

---

## Phase 9: Clean Install

### 1. Remove node_modules and package-lock.json
```bash
rm -rf node_modules package-lock.json
```

### 2. Fresh install
```bash
npm install
```

---

## Phase 10: Testing & Validation

### 1. Check for TypeScript errors
```bash
npx tsc --noEmit
```

### 2. Run the development server
```bash
npm start
```

### 3. Test all application features manually
- Navigate through all routes
- Test all interactive components
- Check console for warnings/errors

### 4. Run automated tests
```bash
npm test -- --watchAll=false
```

### 5. Build production bundle
```bash
npm run build
```

### 6. Test production build locally
```bash
npx serve -s build
```

---

## Phase 11: Fix Common Issues

### Issue 1: React 18 Strict Mode Double Rendering
React 18's Strict Mode intentionally double-invokes effects in development. This is expected behavior.

### Issue 2: Automatic Batching
React 18 automatically batches state updates. If you need to opt-out:
```javascript
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount(c => c + 1);
});
```

### Issue 3: New TypeScript Types
Update component types if needed:
```typescript
// Old
const root = document.getElementById('root');

// New
const root = document.getElementById('root')!; // or with null check
```

---

## Phase 12: Update Documentation

### 1. Update README.md
Document the new versions and any setup changes.

### 2. Update package.json scripts if needed
Ensure all scripts work with new versions.

---

## Phase 13: Commit & Deploy

### 1. Review all changes
```bash
git status
git diff
```

### 2. Commit the upgrade
```bash
git add .
git commit -m "Upgrade to React 18 and latest dependencies"
```

### 3. Push to remote
```bash
git push origin upgrade-to-react-18
```

### 4. Create Pull Request
Review changes and merge when ready.

### 5. Deploy to GitHub Pages
```bash
npm run deploy
```

---

## Rollback Plan

If issues occur:

### 1. Switch back to backup branch
```bash
git checkout backup-before-upgrade
```

### 2. Reinstall dependencies
```bash
npm install
```

### 3. Redeploy if needed
```bash
npm run deploy
```

---

## Additional Resources

- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React Router v6 Migration Guide](https://reactrouter.com/en/main/upgrading/v5)
- [Create React App 5.0 Release Notes](https://github.com/facebook/create-react-app/releases/tag/v5.0.0)

---

## Expected Breaking Changes Summary

1. **React 18 Root API**: Must update `ReactDOM.render` to `createRoot`
2. **React Router v6**: Major API changes in routing
3. **Automatic Batching**: State updates batch differently
4. **Strict Mode**: Double-invokes effects in development
5. **TypeScript**: May need type updates for new APIs

---

## Estimated Time
- Small project: 2-4 hours
- Medium project: 4-8 hours
- Large project: 1-2 days

## Risk Level
**Medium** - Breaking changes in React Router v6 require code modifications, but React 18 itself is mostly backward compatible.
