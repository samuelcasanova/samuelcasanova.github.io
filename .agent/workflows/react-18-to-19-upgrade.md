---
description: Upgrade from React 18 to React 19
---

# React 18 → React 19 Upgrade Guide

Comprehensive guide to upgrade your project from React 18 to React 19.

---

## ⚠️ Important: Security Consideration

**React 19 Vulnerability Alert:**
- React 19.0, 19.1.0, 19.1.1, and 19.2.0 have a known security vulnerability
- The vulnerability affects `react-server-dom-webpack`, `react-server-dom-parcel`, and `react-server-dom-turbopack`
- **Your project does NOT use these packages**, so you're safe
- **Recommendation:** Wait for React 19.3.0 or use React 19.0.0 with caution

**Current Status (as of Dec 2024):**
- React 19.0.0 - Released Dec 5, 2024
- Latest stable: 19.0.0
- Vulnerability fixed in: TBD (check https://react.dev for updates)

---

## Why Upgrade to React 19?

### New Features
- ✅ **Actions** - Simplified async operations and form handling
- ✅ **ref as prop** - No more `forwardRef` needed
- ✅ **Document Metadata** - Built-in `<title>`, `<meta>` support
- ✅ **Better error handling** - Improved error reporting
- ✅ **use() API** - Read resources in render
- ✅ **useOptimistic** - Optimistic UI updates
- ✅ **useActionState** - Manage form state

### Improvements
- ✅ Better hydration error messages
- ✅ Improved Suspense behavior
- ✅ Better TypeScript support
- ✅ Smaller bundle sizes

---

## What Needs to Change

### Files to Check:
1. **`package.json`** - Update dependencies
2. **Your components** - Check for deprecated APIs
3. **Tests** - Update if using deprecated test utilities

### Breaking Changes:
- ❌ Removed `propTypes` and `defaultProps` for function components
- ❌ Removed string refs (use callback refs)
- ❌ Removed `ReactDOM.findDOMNode`
- ❌ Removed `react-dom/test-utils` (use `react` instead)
- ❌ Changed error handling behavior

---

## Pre-Upgrade Checklist

Before starting, verify:

- [ ] You're currently on React 18.3.1 ✅
- [ ] All tests are passing
- [ ] Application runs without errors
- [ ] You have a backup branch
- [ ] You've read the breaking changes

---

## Step-by-Step Instructions

### Step 1: Create Backup Branch (30 seconds)

```bash
cd /home/samuel/git/personal/premierportal
git checkout -b upgrade-react-19
git status  # Ensure clean working directory
```

---

### Step 2: Check for Deprecated APIs (5 minutes)

Run these searches to find potential issues:

```bash
# Check for propTypes usage
grep -r "propTypes" src/

# Check for defaultProps usage
grep -r "defaultProps" src/

# Check for string refs
grep -r 'ref="' src/
grep -r "ref='" src/

# Check for findDOMNode
grep -r "findDOMNode" src/

# Check for test-utils
grep -r "react-dom/test-utils" src/
```

**Expected result:** No matches (your code is clean!)

---

### Step 3: Update Dependencies (2 minutes)

```bash
# Update React and React DOM to version 19
npm install react@19 react-dom@19

# Update React Scripts (if compatible version exists)
# Note: react-scripts may not support React 19 yet
npm install react-scripts@latest

# Update testing libraries
npm install --save-dev @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest

# Update other dependencies
npm install web-vitals@latest react-collapsible@latest
npm install --save-dev gh-pages@latest
```

---

### Step 4: Update TypeScript Types (if using TypeScript)

```bash
npm install --save-dev @types/react@19 @types/react-dom@19
```

---

### Step 5: Check for Code Changes Needed

Based on your current code, you should NOT need any changes because:

✅ You don't use `propTypes`
✅ You don't use `defaultProps`
✅ You don't use string refs
✅ You don't use `findDOMNode`
✅ You already use the new Root API (from React 18 upgrade)

**However, verify by checking:**

#### Check your components for:

1. **PropTypes** (if any):
```javascript
// REMOVE THIS (deprecated in React 19)
import PropTypes from 'prop-types'
Component.propTypes = { ... }

// USE THIS INSTEAD
// Use TypeScript or remove propTypes
```

2. **DefaultProps** (if any):
```javascript
// REMOVE THIS (deprecated in React 19)
Component.defaultProps = { text: 'Hello' }

// USE THIS INSTEAD
function Component({ text = 'Hello' }) { ... }
```

3. **String refs** (if any):
```javascript
// REMOVE THIS (deprecated in React 19)
<div ref="myRef" />

// USE THIS INSTEAD
const myRef = useRef()
<div ref={myRef} />
```

---

### Step 6: Clean Install (1 minute)

```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Step 7: Test the Application (10 minutes)

```bash
# Start development server
npm start
```

**Test these in your browser:**
- [ ] Home page loads (`/`)
- [ ] Loupes page loads (`/loupes`)
- [ ] Categories page loads (`/categorias`)
- [ ] Navigation works between pages
- [ ] No console errors or warnings
- [ ] All components render correctly
- [ ] Data fetching works (calendar loads)

**Watch for new warnings:**
- Check browser console for deprecation warnings
- Check for any React 19 specific warnings

---

### Step 8: Run Tests (2 minutes)

```bash
npm test -- --watchAll=false
```

**If tests fail:**
- Check if you're using `act` from `react-dom/test-utils`
- Update to import from `react` instead:
  ```javascript
  // OLD
  import { act } from 'react-dom/test-utils'
  
  // NEW
  import { act } from 'react'
  ```

---

### Step 9: Build for Production (2 minutes)

```bash
npm run build
```

**Check for:**
- Build completes successfully
- No errors or warnings
- Bundle size is reasonable

---

### Step 10: Test Production Build (2 minutes)

```bash
npx serve -s build
```

Open http://localhost:3000 and test all features.

---

### Step 11: Commit Changes (1 minute)

```bash
git add .
git commit -m "Upgrade to React 19"
git push origin upgrade-react-19
```

---

## Expected package.json After Upgrade

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^5.3.0",
    "react-scripts": "^5.0.1",
    ...
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    ...
  }
}
```

---

## New React 19 Features You Can Use

### 1. ref as a prop (No more forwardRef!)

```javascript
// OLD (React 18)
import { forwardRef } from 'react'

const MyInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})

// NEW (React 19)
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}
```

### 2. Document Metadata

```javascript
function BlogPost({ post }) {
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <article>
        <h1>{post.title}</h1>
        {post.content}
      </article>
    </>
  )
}
```

### 3. useActionState (for forms)

```javascript
import { useActionState } from 'react'

function UpdateName() {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const name = formData.get("name")
      const error = await updateName(name)
      return error
    },
    null
  )

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  )
}
```

### 4. useOptimistic (for optimistic updates)

```javascript
import { useOptimistic } from 'react'

function Thread({ messages, sendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { text: newMessage, sending: true }]
  )

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {message.sending && <small> (Sending...)</small>}
        </div>
      ))}
    </>
  )
}
```

### 5. use() API (read resources in render)

```javascript
import { use } from 'react'

function Comments({ commentsPromise }) {
  // This will suspend until the promise resolves
  const comments = use(commentsPromise)
  
  return comments.map(comment => <p key={comment.id}>{comment.text}</p>)
}
```

---

## Troubleshooting

### Issue: "react-scripts doesn't support React 19"

**Cause:** react-scripts may not have React 19 support yet

**Solution:**
```bash
# Stay on react-scripts 5.0.1 (it should work)
# Or wait for official React 19 support

# Alternative: Migrate to Vite
npm create vite@latest
```

---

### Issue: Build warnings about peer dependencies

**Cause:** Some packages may not officially support React 19 yet

**Solution:**
```bash
# Use --legacy-peer-deps flag
npm install --legacy-peer-deps

# Or wait for package updates
```

---

### Issue: Tests failing

**Cause:** Test utilities changed

**Solution:**
```javascript
// Update imports
import { act } from 'react'  // Not from 'react-dom/test-utils'
```

---

### Issue: TypeScript errors

**Cause:** Type definitions changed

**Solution:**
```bash
# Update TypeScript types
npm install --save-dev @types/react@19 @types/react-dom@19

# Run codemod for automatic fixes
npx codemod@latest react/19/replace-reactdom-render
```

---

## React 19 Codemods (Automatic Fixes)

React provides codemods to automatically fix common issues:

```bash
# Replace ReactDOM.render (if you missed any)
npx codemod@latest react/19/replace-reactdom-render

# Replace string refs
npx codemod@latest react/19/replace-string-ref

# Replace act imports
npx codemod@latest react/19/replace-act-import

# Replace PropTypes
npx codemod@latest react/19/replace-proptypes
```

---

## Rollback Plan

If you encounter issues:

### Option 1: Revert the commit
```bash
git checkout upgrade-react-19
git revert HEAD
npm install
```

### Option 2: Go back to main
```bash
git checkout main
npm install
```

### Option 3: Downgrade manually
```bash
npm install react@18 react-dom@18
rm -rf node_modules package-lock.json
npm install
```

---

## React Router: Should You Upgrade?

**Current:** React Router v5.3.0
**Latest:** React Router v6.x

**Recommendation:** 
- ✅ React Router v5 works with React 19
- ⚠️ Upgrading to v6 is a separate task with breaking changes
- 💡 Do React 19 upgrade first, then consider Router v6 later

---

## Performance Comparison

After upgrading, you should see:

- ✅ Similar or better initial load time
- ✅ Improved re-render performance (automatic batching)
- ✅ Better Suspense behavior
- ✅ Smaller bundle size (removed deprecated code)

---

## Summary

### Total Time: 30-60 minutes

### Changes Required:
- ✅ Update dependencies via npm
- ✅ Likely NO code changes needed (your code is clean!)
- ✅ Possible test updates if using deprecated utilities

### Risk Level: **MEDIUM**
- React 19 is new (Dec 2024)
- Some packages may not support it yet
- Known security vulnerability in 19.0-19.2.0 (doesn't affect you)
- Easy rollback if needed

---

## Recommendation

### Option A: Upgrade Now ⚡
**If you:**
- Want the latest features
- Are comfortable with potential issues
- Can test thoroughly
- Don't mind being an early adopter

### Option B: Wait 1-2 Months ⏳
**If you:**
- Want more stability
- Prefer battle-tested versions
- Need all packages to support React 19
- Want the security patch (React 19.3.0+)

**My recommendation:** Wait for React 19.3.0 or later to avoid the known vulnerability, even though it doesn't affect your project.

---

## Next Steps After Successful Upgrade

1. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

2. **Monitor for issues**
   - Check browser console
   - Monitor error logs
   - Test all features thoroughly

3. **Explore React 19 features**
   - Try Actions for form handling
   - Use `ref` as prop (remove `forwardRef`)
   - Add document metadata
   - Experiment with `useOptimistic`

4. **Consider React Router v6**
   - Separate upgrade task
   - Better features and performance
   - Breaking changes to handle

---

## Resources

- Official guide: https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- React 19 release: https://react.dev/blog/2024/12/05/react-19
- Codemods: https://codemod.com/registry/react-19
- TypeScript changes: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#typescript-changes

---

**Ready to upgrade? Review the checklist and start with Step 1!** 🚀

**Or wait for React 19.3.0+ for maximum stability and security.** 🛡️
