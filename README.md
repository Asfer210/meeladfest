# Group Score Live

# Build a Group Score Publishing Website with Supabase

Build a simple, modern, responsive **Group Scoreboard** web application.

This application is for a competition involving three groups. An administrator can update the scores from a private admin page, while anyone can view the latest scores from a public scoreboard page.

The administrator and public viewers may use completely different devices, so the scores must be stored in **Supabase** as a shared cloud database.

I have already created a Supabase project. **Connect this application to my existing Supabase project. Do not create another Supabase project.**

---

# 1. Application Structure

There must be exactly two application routes:

```text
/       → Public Scoreboard
/admin  → Admin Login + Score Management
```

There should be no other application pages.

The application should be simple and focused only on score management and score display.

---

# 2. Groups

There are exactly three groups:

| Group  | Color |
| ------ | ----- |
| Neel   | Blue  |
| Dijla  | Red   |
| Furath | Green |

These groups are fixed.

Do not provide functionality to:

* Create groups
* Delete groups
* Rename groups
* Change group colors

Initial scores:

```text
Neel   = 0
Dijla  = 0
Furath = 0
```

---

# 3. Supabase Connection

I already have an existing Supabase project.

Connect the application to that project.

Use the Supabase JavaScript client.

Configure Supabase using environment variables.

Use:

```text
VITE_SUPABASE_URL : https://pulqfbsxhcoodzqypbrh.supabase.co
VITE_SUPABASE_ANON_KEY : sb_publishable_Yqo_nw-vnC6rRGhEIPR6Kw_TWNoPLmI
```

or the current Supabase-recommended public/publishable key equivalent.

Do NOT hardcode the credentials in application source code.

### Security

NEVER use or expose:

* Supabase `service_role` key
* Supabase secret key
* Database password
* PostgreSQL connection string containing the database password

The frontend must only use the public/anonymous/publishable Supabase key.

If Lovable's native Supabase integration is available, use that integration to connect to the existing Supabase project rather than creating a separate backend.

---

# 4. Database

Create the following table in the existing Supabase project:

## `group_scores`

Columns:

```text
id
group_name
score
updated_at
```

Recommended types:

```text
id          → uuid, primary key
group_name  → text, unique, not null
score       → integer, not null
updated_at  → timestamptz, not null
```

Add a constraint so that:

```text
score >= 0
```

The table should contain exactly these three records:

```text
Neel    | 0
Dijla   | 0
Furath  | 0
```

Use a unique constraint on `group_name`.

---

# 5. Supabase Row Level Security

Enable Row Level Security on `group_scores`.

The public scoreboard needs to be able to read the scores.

Anonymous/public users must NOT be allowed to directly modify scores.

Do not expose unrestricted database write access to the public client.

Configure appropriate RLS policies.

The intended behavior is:

```text
Public user
    ↓
Can SELECT scores
    ↓
Cannot UPDATE scores


Administrator
    ↓
Can update scores through the intended score-update mechanism
```

Because the administrator login is a simple hardcoded credential, do not build a full user-management system.

---

# 6. Atomic Score Update

This is very important.

The administrator does NOT enter a new total score.

The administrator enters an **adjustment amount**.

For example:

```text
Current score = 50
Adjustment = 25
```

If the administrator clicks **Add**:

```text
50 + 25 = 75
```

If the administrator clicks **Subtract**:

```text
75 - 25 = 50
```

The adjustment amount can be any positive whole number.

Examples:

```text
1
3
5
7
10
15
25
50
100
500
```

Do NOT restrict the administrator to predefined values such as `+5`, `-5`, `+10`, or `-10`.

---

# 7. Create Supabase RPC for Score Updates

Do NOT implement the score update like this:

```text
1. Read current score
2. Calculate new score in JavaScript
3. Write the new score
```

This can cause race conditions if multiple updates happen close together.

Instead, create a PostgreSQL function/RPC such as:

```text
update_group_score(target_group, adjustment)
```

The function must atomically update the current score.

Conceptually:

```sql
UPDATE group_scores
SET
    score = GREATEST(0, score + adjustment),
    updated_at = NOW()
WHERE group_name = target_group;
```

The function should return the updated record/current score.

For adding:

```text
adjustment = positive number
```

For subtracting:

```text
adjustment = negative number
```

Example:

```text
Add 25:
group = Neel
adjustment = 25

Subtract 25:
group = Neel
adjustment = -25
```

The database must ensure that the score never becomes negative.

---

# 8. Prevent Negative Scores

Scores can never be less than zero.

Example:

```text
Current score = 10
Adjustment = 25
```

If the administrator clicks Subtract:

```text
10 - 25
```

The final score must be:

```text
0
```

NOT:

```text
-15
```

Enforce this at the database level as well as in the UI.

---

# 9. Admin Authentication

Route:

```text
/admin
```

The admin page must require login.

Use exactly one hardcoded administrator credential:

```text
Username: Admin
Password: Admin@5001
```

Do NOT create:

* Registration
* User table
* Multiple users
* User management
* Roles management
* Password reset
* Social login
* Profile management

The credential is only intended for this small/private scoreboard application.

If an unauthenticated user visits:

```text
/admin
```

show the login screen.

After successful login, show the admin score management interface.

Provide a **Logout** button.

The login state may be stored temporarily in browser session storage if necessary.

The scores themselves must NEVER be stored in browser storage.

---

# 10. Admin Login UI

Create a clean login screen.

Example:

```text
┌───────────────────────────────┐
│                               │
│        ADMIN LOGIN            │
│                               │
│  Username                     │
│  ┌─────────────────────────┐  │
│  │ Admin                   │  │
│  └─────────────────────────┘  │
│                               │
│  Password                     │
│  ┌─────────────────────────┐  │
│  │ •••••••••••             │  │
│  └─────────────────────────┘  │
│                               │
│       [ Login ]               │
│                               │
└───────────────────────────────┘
```

Display a clear error for incorrect credentials.

---

# 11. Admin Score Management

After login, display the three groups.

Each group should have a card containing:

* Group name
* Group color
* Current score
* Adjustment Amount input
* Add (+) button
* Subtract (−) button

The administrator enters the amount to add/subtract.

There should NOT be a "Set Score" input.

---

# 12. Admin Group Card

Example:

```text
┌───────────────────────────────────────┐
│                                       │
│                 NEEL                  │
│                 BLUE                  │
│                                       │
│                  50                   │
│                                       │
│          Adjustment Amount            │
│                                       │
│          ┌─────────────────┐          │
│          │       25        │          │
│          └─────────────────┘          │
│                                       │
│       [ − Subtract ] [ + Add ]        │
│                                       │
└───────────────────────────────────────┘
```

Create the same interface for:

* Neel
* Dijla
* Furath

Use the group's color as the visual theme.

---

# 13. Adjustment Amount Validation

The adjustment input must accept:

* Positive whole numbers only

Valid:

```text
1
5
10
25
100
500
```

Invalid:

```text
0
-5
1.5
10.5
abc
empty
```

Do not allow negative numbers in the input itself.

The Add/Subtract buttons determine the direction.

---

# 14. Add Operation

When the administrator clicks:

```text
+ Add
```

perform:

```text
current score + adjustment amount
```

Example:

```text
Current score = 100
Adjustment = 25

Click + Add

New score = 125
```

---

# 15. Subtract Operation

When the administrator clicks:

```text
− Subtract
```

perform:

```text
current score - adjustment amount
```

Example:

```text
Current score = 125
Adjustment = 20

Click − Subtract

New score = 105
```

---

# 16. Score Update Feedback

After a successful update:

1. Display the new score immediately.
2. Clear the adjustment input.
3. Show a subtle animation.
4. Show a small success indication.
5. Update `updated_at`.
6. Allow Supabase Realtime to notify the public scoreboard.

If the update fails:

* Do not show the new score as if it succeeded.
* Display a clear error message.
* Keep the user informed.

Disable the clicked button while its request is being processed to prevent accidental duplicate submissions.

---

# 17. Public Scoreboard

Route:

```text
/
```

This page is completely public.

No authentication is required.

Anyone with the URL can access it.

The public page must be **read-only**.

It must load the latest scores directly from Supabase.

Do not use browser localStorage, IndexedDB, or Dexie for score storage.

---

# 18. Public Scoreboard Design

Create a visually attractive competition scoreboard.

The page should be suitable for:

* Mobile phones
* Tablets
* Desktop computers
* TV screens
* Projectors

The scores should be the primary focus.

Suggested layout:

```text
                 GROUP SCOREBOARD


      ┌──────────┐ ┌──────────┐ ┌──────────┐
      │   NEEL   │ │  DIJLA   │ │  FURATH  │
      │   BLUE   │ │   RED    │ │  GREEN   │
      │          │ │          │ │          │
      │    75    │ │    60    │ │    90    │
      └──────────┘ └──────────┘ └──────────┘


                 CURRENT SCORES


             ┌────────────────────┐
             │                    │
             │     BAR CHART      │
             │                    │
             └────────────────────┘


                Last updated: ...
```

---

# 19. Public Score Cards

Display three large cards:

### Neel

Blue theme.

### Dijla

Red theme.

### Furath

Green theme.

The score must be displayed using large, highly readable typography.

Make the cards visually distinct.

---

# 20. Score Graph

Use **Recharts**.

Create a responsive **bar chart** comparing the current scores.

The chart must:

* Display all three groups
* Use blue for Neel
* Use red for Dijla
* Use green for Furath
* Display score values
* Update automatically
* Animate changes smoothly
* Work on mobile
* Work on large displays

The chart should make it immediately obvious which group has the highest score.

---

# 21. Real-Time Updates

Use **Supabase Realtime**.

When the administrator changes a score, the public scoreboard must automatically update.

Example:

```text
Administrator Phone

Neel = 50

Adjustment = 25

Click + Add
        │
        ▼
Supabase
        │
        ▼
Neel = 75
        │
        │ Realtime event
        ▼
Public Phone

Neel = 75
```

The public viewer must NOT need to refresh the page.

Both the score cards and graph must update automatically.

If Supabase Realtime cannot be used for some reason, implement a lightweight polling fallback every 5–10 seconds.

---

# 22. Last Updated

Display the latest update time using the `updated_at` value from Supabase.

Example:

```text
Last updated: 10:42 AM
```

Update this whenever any group score changes.

---

# 23. Loading State

When the public page is loading scores from Supabase, show:

```text
Loading latest scores...
```

Do not display fake or outdated scores while the initial request is loading.

The admin page should also display an appropriate loading state when retrieving scores.

---

# 24. Error Handling

If the public page cannot retrieve scores:

```text
Unable to load the latest scores.
Please try again.
```

If an admin update fails:

```text
Unable to update the score.
Please try again.
```

Use clean, user-friendly error messages.

---

# 25. No Local Score Storage

This is a critical requirement.

Do NOT store scores in:

```text
localStorage
sessionStorage
IndexedDB
Dexie.js
```

The scores must always come from Supabase.

Browser storage may only be used for temporary admin login/session state.

This application must work like this:

```text
Admin Phone
     │
     │ Score adjustment
     ▼
Supabase Database
     │
     │ Shared data
     ├───────────────┐
     ▼               ▼
Public Phone      Public TV
```

All devices must see the same scores.

---

# 26. Security

Do not expose Supabase service-role credentials.

Do not put database passwords in frontend code.

Use only the public Supabase key in the frontend.

Use environment variables.

Configure Row Level Security.

The public scoreboard should have read-only access.

Anonymous users must not be able to directly update scores.

Use the atomic Supabase RPC/database function for score updates.

---

# 27. Components

Keep the React application clean and componentized.

Create reusable components such as:

```text
AdminLogin
AdminScoreboard
GroupScoreCard
ScoreAdjustmentControl
PublicScoreboard
PublicScoreCard
ScoreChart
```

Use TypeScript.

Example type:

```typescript
interface GroupScore {
  id: string;
  group_name: 'Neel' | 'Dijla' | 'Furath';
  score: number;
  updated_at: string;
}
```

---

# 28. Technology

Use:

* React
* TypeScript
* Tailwind CSS
* Recharts
* Supabase JavaScript client
* Supabase PostgreSQL
* Supabase Realtime

Use a clean modern UI.

Avoid unnecessary libraries.

---

# 29. Responsive Design

On desktop/tablet:

```text
Neel       Dijla       Furath
```

display the three group cards side-by-side.

On mobile:

```text
Neel
Dijla
Furath
```

stack them vertically.

The public scoreboard should use the available screen space effectively.

For large screens, use large typography so that the scores can be seen clearly from a distance.

---

# 30. Do Not Add

Do NOT add:

* User registration
* User database
* Multiple administrators
* Password reset
* Profile management
* Social login
* Firebase
* Dexie.js
* IndexedDB
* Local score storage
* Group creation
* Group deletion
* Group editing
* Manual "Set Total Score" as the primary update method
* Fixed +5/-5/+10/-10 buttons
* Additional dashboards
* Additional pages
* Payment features
* Unnecessary navigation
* Unnecessary functionality

---

# 31. Critical Score Example

The application must follow this exact concept:

```text
Current score = 50
```

Administrator enters:

```text
Adjustment Amount = 25
```

Clicks:

```text
+ Add
```

Result:

```text
75
```

Then administrator enters:

```text
Adjustment Amount = 10
```

Clicks:

```text
− Subtract
```

Result:

```text
65
```

Then:

```text
Adjustment Amount = 3
+ Add
```

Result:

```text
68
```

The administrator is always entering an **adjustment**, never the new total.

---

# 32. Final Acceptance Criteria

The application is complete only when all of these requirements work:

## Authentication

1. `/` is publicly accessible.
2. `/admin` requires login.
3. Username `Admin` works.
4. Password `Admin@5001` works.
5. Incorrect credentials are rejected.
6. Logout works.

## Score Management

7. Admin sees the current scores from Supabase.
8. Admin can enter any positive whole-number adjustment.
9. Admin can click Add.
10. Admin can click Subtract.
11. Add increases the current score by the entered amount.
12. Subtract decreases the current score by the entered amount.
13. The adjustment is NOT treated as the new total score.
14. Scores can never become negative.
15. Adjustment input is cleared after a successful update.
16. Errors are handled correctly.

## Database

17. Existing Supabase project is used.
18. `group_scores` table is created/configured.
19. Three groups exist in the table.
20. Scores are stored centrally in Supabase.
21. Supabase is the single source of truth.
22. Score updates use an atomic RPC/database function.
23. `updated_at` is updated after every score change.
24. Scores persist after browser refresh.
25. Scores are shared between different devices.

## Public Scoreboard

26. `/` displays all three groups.
27. Neel is blue.
28. Dijla is red.
29. Furath is green.
30. Current scores are prominently displayed.
31. Bar chart displays all three scores.
32. Chart uses the corresponding group colors.
33. Last updated time is displayed.
34. Public users cannot modify scores.

## Real-Time

35. Supabase Realtime is enabled.
36. Updating a score from the admin phone updates the public scoreboard automatically.
37. The public page does not require a refresh.
38. Score cards update automatically.
39. Graph updates automatically.

## Security

40. Supabase service-role key is never exposed.
41. Database password is never exposed.
42. Supabase credentials use environment variables.
43. Row Level Security is configured.
44. Anonymous users cannot directly modify scores.
45. Scores are not stored in localStorage.
46. Scores are not stored in IndexedDB.
47. Dexie.js is not used.

## Simplicity

48. Only two application routes exist:

```text
/
/admin
```

49. No unnecessary pages are created.
50. The application is responsive and suitable for displaying the scoreboard on a large screen.

---

# Important Implementation Instruction

Before considering the application complete, verify the entire flow:

```text
Admin Phone
    ↓
/admin
    ↓
Login with Admin / Admin@5001
    ↓
Select Neel
    ↓
Enter adjustment: 25
    ↓
Click + Add
    ↓
Supabase RPC
    ↓
Neel score increases by 25
    ↓
Supabase Realtime
    ↓
Public /
    ↓
Neel score automatically changes
    ↓
Graph automatically changes
```

This cross-device flow is the primary purpose of the application.

Do not consider the project complete until this flow works correctly.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://score-sync-trio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3e153552-b1da-4e85-9ff0-762b3839862a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
