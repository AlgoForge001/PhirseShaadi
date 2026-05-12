# Implementation Plan - Phirse Shaadi Enhancements

This plan outlines the steps to address the requested features and bug fixes for the Phirse Shaadi platform.

## 1. Bug Fixes & Refinements

### 1.1 Marital Status Logic Error
- **Issue**: Redundant or conflicting "Marriage Type" and "Marital Status" fields in the registration form.
- **Solution**: 
  - In `Register.jsx`, implement conditional logic:
    - If **"First Marriage"** is selected in Step 2:
      - Automatically set `maritalStatus` to `"Never Married"`.
      - Hide or disable the "Marital Status" dropdown in Step 3.
    - If **"Second Marriage"** is selected in Step 2:
      - Filter "Marital Status" options to only include `"Divorced"`, `"Widowed"`, or `"Awaiting Divorce"`.
      - Ensure one of these is selected in Step 3.

### 1.2 Session Error Redirection
- **Issue**: Users see a session error instead of being redirected to the login page.
- **Solution**:
  - Update `myfrontend/src/utils/api.js`.
  - Add an Axios **response interceptor** to handle `401 Unauthorized` responses.
  - On 401, clear `localStorage` (token/user) and use `window.location.href = '/login'` to force redirection.

### 1.3 Remove "Near You" Tab
- **Issue**: "Near You" tab is no longer required.
- **Solution**:
  - Remove the `"nearby"` tab entry from the tabs array in `myfrontend/src/pages/SearchBrowse.jsx`.
  - (Optional) Remove the `/api/matches/near-you` route in the backend if it's no longer used anywhere else.

## 2. Feature Additions

### 2.1 Photo & CV Update in Profile
- **Issue**: Missing option to update photos and CV after registration.
- **Solution**:
  - **Frontend**: 
    - Update `myfrontend/src/pages/EditProfile.jsx` to include a photo upload section (reusing logic from `UploadPhotos.jsx`).
    - Add a CV upload field in the professional details section of the edit profile form.
  - **Backend**:
    - Ensure `profileController.js` handles `cvFile` updates in the `updateFullProfile` or a specific CV upload endpoint.
    - Update `User.js` model to ensure `cvUrl` is consistently used.

### 2.2 New Joins: Gender Filtering
- **Issue**: "New Joins" shows all users regardless of gender.
- **Solution**:
  - Update `getNewJoins` in `Backend/controllers/searchController.js`.
  - Use the `getOppositeGenderRegex` helper to filter the `createdAt` query by the user's opposite gender.



### 2.3 Chat Verification (Personal Info Protection)
- **Issue**: Users might exchange personal contact info too early.
- **Solution**:
  - **Backend**:
    - In `Backend/server.js`, within the `message:send` socket event:
    - Implement a regex check on the `text` field to detect phone numbers (e.g., `/\b\d{10}\b/`) and email addresses.
    - If personal info is detected:
      - Option A: Block the message and emit an error to the sender.
      - Option B: Allow the message but flag it in the database for admin review.
      - *Recommendation*: Block the message with a warning to the user.

### 2.4 CV Upload Option
- **Solution**: 
  - Ensure the CV upload is integrated into both `Register.jsx` (already present, verify functionality) and `EditProfile.jsx`.
  - Ensure the backend stores the file in the `uploads/cvs` directory and saves the URL in the database.

## 3. Advanced Features

### 3.1 USP Smart Match AI System
- **Objective**: Provide high-quality matches based on user preferences and profile data.
- **Implementation**:
  - Enhance the existing `calculateMatchScore` in `searchController.js`.
  - Include factors such as:
    - Age difference vs preferred range.
    - Location proximity (Same City > Same State).
    - Education level matching.
    - Income bracket compatibility.
    - Common interests/hobbies (if added to model).
  - Create a "Smart Matches" section on the dashboard that highlights these high-percentage matches.

---

## 4. Proposed Execution Order

1.  **Core Logic & Bug Fixes**: Marital status, Gender filtering, Session redirection, Tab removal.
2.  **Profile Enhancements**: Photo update, CV upload.
3.  **Safety & Trust**: Chat verification, Verified badge.
4.  **Innovation**: Smart Match AI system.

***
## chat ai 
Please let me know if you approve this plan or would like to make any adjustments.
The system now blocks:

Phone numbers in digits or words.
Email addresses in any format.
Social media handles (Instagram, Snapchat, etc.).
External links intended to move the conversation off-platform.***
