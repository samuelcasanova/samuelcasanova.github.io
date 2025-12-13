---
description: Quick React 19 upgrade checklist
---

# React 19 Quick Upgrade Checklist

Fast reference for upgrading from React 18 to React 19.

---

## ⚠️ Security Warning

**Known Vulnerability in React 19.0 - 19.2.0**
- Affects: `react-server-dom-webpack`, `react-server-dom-parcel`, `react-server-dom-turbopack`
- Your project: ✅ NOT AFFECTED (you don't use these packages)
- Recommendation: Wait for React 19.3.0+ or proceed with caution

---

## Pre-Flight Check

- [ ] Currently on React 18.3.1 ✅
- [ ] All tests passing
- [ ] Clean git status
- [ ] Backup branch created

---

## Quick Steps

### 1. Search for Deprecated APIs (2 min)

```bash
# Check your code
grep -r "propTypes\|defaultProps\|findDOMNode" src/
grep -r 'ref="' src/
grep -r "react-dom/test-utils" src/
```

**Expected:** No results ✅

---

### 2. Update Dependencies (2 min)

```bash
npm install react@19 react-dom@19
npm install --save-dev @testing-library/react@latest @testing-library/jest-dom@latest
```

---

### 3. Clean Install (1 min)

```bash
rm -rf node_modules package-lock.json
npm install
```

---

### 4. Test (5 min)

```bash
npm start
# Test all pages
# Check console for errors

npm test -- --watchAll=false
npm run build
```

---

### 5. Commit

```bash
git add .
git commit -m "Upgrade to React 19"
```

---

## Breaking Changes to Watch For

### ❌ Removed APIs

- `propTypes` and `defaultProps` for function components
- String refs (`ref="myRef"`)
- `ReactDOM.findDOMNode()`
- `react-dom/test-utils` (use `react` instead)
- `React.createFactory()`

### ✅ Your Code Status

Based on your codebase:
- ✅ No propTypes usage
- ✅ No defaultProps usage
- ✅ No string refs
- ✅ No findDOMNode
- ✅ Already using createRoot (React 18)

**Result:** Likely NO code changes needed! 🎉

---

## If Tests Fail

Update test imports:

```javascript
// OLD
import { act } from 'react-dom/test-utils'

// NEW
import { act } from 'react'
```

---

## If Build Fails

Try:

```bash
# Peer dependency issues
npm install --legacy-peer-deps

# Or clean install
rm -rf node_modules package-lock.json
npm install
```

---

## Rollback

```bash
npm install react@18 react-dom@18
rm -rf node_modules package-lock.json
npm install
```

---

## New Features You Can Use

### 1. ref as prop (no forwardRef!)

```javascript
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
```

### 2. Document metadata

```javascript
<>
  <title>My Page</title>
  <meta name="description" content="..." />
  <div>Content</div>
</>
```

### 3. useActionState

```javascript
const [error, submitAction, isPending] = useActionState(
  async (prev, formData) => {
    // handle form
  },
  null
)
```

### 4. useOptimistic

```javascript
const [optimisticState, addOptimistic] = useOptimistic(
  state,
  (current, optimisticValue) => [...current, optimisticValue]
)
```

---

## Recommendation

### ✅ Upgrade Now If:
- You want latest features
- Can test thoroughly
- Comfortable with new releases

### ⏳ Wait If:
- You prefer stability
- Want security patch (19.3.0+)
- Need all packages to support React 19

**My advice:** Wait 1-2 months for React 19.3.0+ for maximum stability.

---

## Total Time

- **Code changes:** 0-5 minutes (likely none needed!)
- **Dependency updates:** 5 minutes
- **Testing:** 15-30 minutes
- **Total:** 20-40 minutes

---

## Success Criteria

- [ ] `npm start` works
- [ ] All pages load
- [ ] No console errors
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Production build works

---

**See `react-18-to-19-upgrade.md` for detailed guide.**
