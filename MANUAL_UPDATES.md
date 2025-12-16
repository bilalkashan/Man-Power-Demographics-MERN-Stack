# Manual Updates Required

## Backend Files to Update

### 1. `/Backend/models/Job.js`

Replace the entire file with the content from `jobControllerUpdated.js` - add the `status` field to the schema:

```javascript
status: { type: String, enum: ['Active', 'Closed'], default: 'Active' }
```

### 2. `/Backend/controllers/jobController.js`

Copy the content from `jobControllerUpdated.js` to replace the existing jobController.js file.
This adds these new functions:

- `getAllJobs` - Get all jobs for admin
- `updateJobStatus` - Update job status (Active/Closed)
- `deleteJob` - Delete a job posting

### 3. `/Backend/routes/jobRoutes.js`

Update the routes to include:

```javascript
router.patch("/:id/status", verifyToken, updateJobStatus);
router.delete("/:id", verifyToken, deleteJob);
```

## Frontend Files to Update

### 1. `/Frontend/src/App.jsx`

Add these after line 22:

```jsx
import ManageJobs from "./pages/ManageJobs";
```

Add this route after the `/candidates` route:

```jsx
<Route
  path="/admin/manage-jobs"
  element={<ProtectedRoute element={<ManageJobs />} />}
/>
```

## Features Implemented

✅ **ManageJobs.jsx** - Complete admin page for managing jobs:

- View all posted jobs in a table
- Search jobs by title, category, or location
- Filter by status (Active/Closed)
- Update job status with dropdown
- View job details in modal
- Delete jobs with confirmation
- Stats cards showing total, active, and closed jobs

✅ **AdminSidebar** - Already has the "Manage Jobs" link pointing to `/admin/manage-jobs`

## How It Works

1. Admin navigates to "Manage Jobs" from sidebar
2. All jobs are loaded from backend
3. Admin can:
   - Search and filter jobs
   - Click to view full job details
   - Change status from Active to Closed
   - Delete job postings
   - See statistics of job postings

## Notes

- The Job model now supports `status` field with values: 'Active' (default) or 'Closed'
- All admin job operations are protected with `verifyToken` middleware
- Resume uploads already integrated in ApplicationForm
- Candidates can view job details and apply with resume
