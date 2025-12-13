---
description: Quick upgrade checklist
---

# React Upgrade Checklist

Quick reference checklist for upgrading to React 18 and latest dependencies.

## Pre-Upgrade
- [ ] Create backup branch
- [ ] Commit all changes
- [ ] Test current application
- [ ] Run existing tests
- [ ] Document current Node version

## Node.js Update
- [ ] Update `.nvmrc` to `v20`
- [ ] Install Node 20: `nvm install 20 && nvm use 20`
- [ ] Verify: `node --version`

## Core Dependencies
- [ ] `npm install react@latest react-dom@latest`
- [ ] `npm install react-scripts@latest`
- [ ] `npm install --save-dev typescript@latest`
- [ ] `npm install --save-dev @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest`
- [ ] `npm install web-vitals@latest`

## React Router v6
- [ ] `npm install react-router-dom@latest`
- [ ] Replace `Switch` with `Routes`
- [ ] Replace `component={X}` with `element={<X />}`
- [ ] Replace `useHistory()` with `useNavigate()`
- [ ] Remove `exact` props

## Code Changes
- [ ] Update `index.js` to use `createRoot` API
- [ ] Update all route components
- [ ] Update navigation hooks
- [ ] Fix TypeScript errors

## Other Dependencies
- [ ] `npm install react-collapsible@latest`
- [ ] `npm install --save-dev gh-pages@latest`
- [ ] `npm install --save-dev @typescript-eslint/parser@latest @typescript-eslint/eslint-plugin@latest`
- [ ] `npm install --save-dev eslint-config-standard@latest eslint-plugin-node@latest eslint-plugin-promise@latest`

## Clean Install
- [ ] `rm -rf node_modules package-lock.json`
- [ ] `npm install`

## Testing
- [ ] `npx tsc --noEmit` (TypeScript check)
- [ ] `npm start` (dev server)
- [ ] Manual testing of all features
- [ ] `npm test -- --watchAll=false`
- [ ] `npm run build`
- [ ] `npx serve -s build` (test production)

## Finalize
- [ ] Review all changes
- [ ] Update README.md
- [ ] Commit changes
- [ ] Push to remote
- [ ] Create PR
- [ ] Deploy: `npm run deploy`

## Critical Code Updates

### 1. index.js (REQUIRED)
```javascript
// OLD
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// NEW
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### 2. Routes (REQUIRED if using React Router)
```javascript
// OLD
import { Switch, Route } from 'react-router-dom';
<Switch>
  <Route exact path="/" component={Home} />
</Switch>

// NEW
import { Routes, Route } from 'react-router-dom';
<Routes>
  <Route path="/" element={<Home />} />
</Routes>
```

### 3. Navigation (REQUIRED if using history)
```javascript
// OLD
import { useHistory } from 'react-router-dom';
const history = useHistory();
history.push('/path');

// NEW
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/path');
```
