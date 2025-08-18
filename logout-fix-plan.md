# Logout Route Implementation Issue and Fix Plan

## Current Issue

The `/logout` route in the user service is not implemented correctly:

1. **Route Definition Issue**: In `backend/user/src/routes/user.ts`, line 14:
   ```typescript
   router.post("/logout", isAuth);
   ```
   The route is missing the controller function.

2. **Missing Import**: The `logoutUser` controller function exists in `backend/user/src/controllers/user.ts` but is not imported in the routes file.

## Required Fix

1. Add `logoutUser` to the import statement in `backend/user/src/routes/user.ts`:
   ```typescript
   import { getAllUser, getAUser, loginUser, myProfile, logoutUser, updateName, verifyOtp } from '../controllers/user.js';
   ```

2. Update the route definition to include the controller function:
   ```typescript
   router.post("/logout", isAuth, logoutUser);
   ```

## Files to Modify

- `backend/user/src/routes/user.ts`

## Implementation Steps

1. Switch to Code mode
2. Update the import statement to include `logoutUser`
3. Update the route definition to include the controller function
4. Verify the fix works correctly