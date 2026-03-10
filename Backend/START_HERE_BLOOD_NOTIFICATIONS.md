# 🩸 BLOOD NOTIFICATION SYSTEM - START HERE

## What Was Created?

A complete automated Gmail notification system that:

- ✅ Sends notifications whenever a blood request is created
- ✅ Filters donors by blood type compatibility
- ✅ Only notifies donors eligible to donate (≥2 months since last donation)
- ✅ Uses professional HTML email templates
- ✅ Runs asynchronously without blocking API responses
- ✅ Includes comprehensive logging and error handling

## System Components

```
src/utils/bloodTypeMatchings.js
├─ isCompatibleDonor(donor, recipient) → boolean
├─ getCompatibleDonorTypes(recipient) → array
└─ Blood type compatibility logic

src/config/gmailConfig.js
├─ Gmail SMTP configuration
└─ Connection verification

src/services/bloodNotificationTransformer.js
├─ transformBloodRequestToNotification(request) → Promise
├─ findEligibleDonors(request) → Promise
├─ sendNotificationEmail(donor, request, requester) → Promise
└─ Main notification orchestration

controllers/request.controller.js (UPDATED)
└─ Integrated transformer into createBloodRequest()
```

## Quick Start (5 Steps)

### Step 1: Install Dependencies

```bash
cd d:\CampusConnect\Backend
npm install
```

This installs `nodemailer` and any other missing dependencies.

### Step 2: Generate Gmail App Password

1. Go to https://myaccount.google.com
2. Click **Security** → Enable **2-Step Verification** (if not enabled)
3. Go to **App Passwords** → Select "Mail" and your device
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update .env File

Edit `.env` and add:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

### Step 4: Validate Setup

```bash
node VALIDATE_SETUP.js
```

This checks all files, packages, and configurations. Look for ✓ checkmarks.

### Step 5: Test System

```bash
node BLOOD_NOTIFICATION_EXAMPLES.js
```

This demonstrates blood type compatibility, eligibility checking, and more.

## Blood Type Compatibility Reference

| Donor | Can Give To                      |
| ----- | -------------------------------- |
| O−    | O−, O+, A−, A+, B−, B+, AB−, AB+ |
| O+    | O+, A+, B+, AB+                  |
| A−    | A−, A+, AB−, AB+                 |
| A+    | A+, AB+                          |
| B−    | B−, B+, AB−, AB+                 |
| B+    | B+, AB+                          |
| AB−   | AB−, AB+                         |
| AB+   | AB+                              |

## How to Use

### Creating a Blood Request (API)

```http
POST /blood-requests/create
Content-Type: application/json
Authorization: Bearer {token}

{
  "blood_group": "AB+",
  "location": "Campus Medical Center",
  "deadline": "2026-03-15T18:00:00Z"
}
```

**Response** (immediate):

```json
{
  "message": "Blood request created successfully and is now active.",
  "request": { "request_id": 123, ... }
}
```

**Background** (asynchronous):

- System finds all active donors
- Filters by blood type compatibility
- Filters by donation eligibility (≥2 months)
- Sends Gmail notifications to each eligible donor

### Check Server Logs

After creating a request, watch your server console:

```
🔔 Triggering blood donation notification transformer...
📋 Processing blood request #123 for AB+
🔍 Finding eligible donors...
✓ Found 12 eligible donors
📧 Sending 12 email notifications...
✓ Email sent to donor1@gmail.com
✓ Email sent to donor2@gmail.com
...
✅ Notification Summary:
   - Sent: 12/12
   - Failed: 0
```

## Documentation Files

| File                              | Purpose                     | Read When                 |
| --------------------------------- | --------------------------- | ------------------------- |
| `BLOOD_NOTIFICATION_README.md`    | Overview and architecture   | Starting out              |
| `BLOOD_NOTIFICATION_SETUP.md`     | Detailed setup guide        | Setting up for first time |
| `BLOOD_NOTIFICATION_QUICK_REF.md` | Quick lookup                | Need quick answers        |
| `BLOOD_NOTIFICATION_EXAMPLES.js`  | Runnable examples and tests | Testing the system        |
| `VALIDATE_SETUP.js`               | Setup validator script      | Checking setup is correct |

## Email Recipients Will Receive

A professional HTML email with:

- 🔴 Blood type badge showing compatibility
- 📍 Request location and deadline
- 👤 Requester information
- ✔️ Why they're eligible (blood type + donation date)
- 🔗 Direct link to view full request
- 📋 Blood donation guidelines
- 💪 Call-to-action button

## Donation Eligibility Rules

A donor is notified if:

1. ✅ Their blood type is compatible with the request
2. ✅ They last donated ≥ 2 months (60 days) ago
3. ✅ Their donor account is active
4. ✅ They haven't made the request themselves

## How the System Decides Compatibility

```
Blood Request Created
        ↓
"AB+ needed"
        ↓
Check each donor's blood type:
├─ O−  → Can give to AB+? YES ✓ → Check eligibility
├─ O+  → Can give to AB+? NO  → Skip
├─ A−  → Can give to AB+? NO  → Skip
├─ A+  → Can give to AB+? YES ✓ → Check eligibility
├─ B−  → Can give to AB+? YES ✓ → Check eligibility
├─ B+  → Can give to AB+? NO  → Skip
├─ AB− → Can give to AB+? YES ✓ → Check eligibility
└─ AB+ → Can give to AB+? YES ✓ → Check eligibility

Compatible Donors: O−, A+, B−, AB−, AB+
        ↓
Filter by donation date:
├─ O− donor: Last donated 90 days ago → ELIGIBLE ✓
├─ A+ donor: Last donated 45 days ago → NOT ELIGIBLE ✗
├─ B− donor: Last donated 60 days ago → ELIGIBLE ✓
├─ AB− donor: Never donated → ELIGIBLE ✓
└─ AB+ donor: Last donated 3 days ago → NOT ELIGIBLE ✗

Final Recipients: O−, B−, AB− donors
        ↓
Send 3 Gmail notifications
```

## Troubleshooting

### Problem: Seeing "Gmail not configured" warning

**Solution**:

1. Check `.env` file has `GMAIL_USER` and `GMAIL_APP_PASSWORD`
2. Run `node VALIDATE_SETUP.js` to verify

### Problem: "Gmail connection failed"

**Solution**:

1. Verify 2-Factor Authentication is enabled on Gmail
2. Regenerate App Password (credentials expire)
3. Remove spaces from the 16-character password in `.env`

### Problem: Donors not receiving emails

**Check**:

1. Are there donors in your database with valid emails?
2. Do they have compatible blood types? (run `BLOOD_NOTIFICATION_EXAMPLES.js`)
3. Has it been ≥ 2 months since their last donation?
4. Check server logs for specific error messages

### Problem: "Donor already active" error

**Solution**: User is already registered as a donor. They need to deactivate first if updating info.

## Environment Variables Needed

```env
# Required (existing)
DATABASE_URL=postgresql://...
JWT_SECRET=...
PORT=4000

# Required for notifications (NEW)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
```

## Installation Summary

| Step | Command                               | Expected Output                       |
| ---- | ------------------------------------- | ------------------------------------- |
| 1    | `npm install`                         | ✓ Installs nodemailer + dependencies  |
| 2    | Add `.env` vars                       | GMAIL_USER and GMAIL_APP_PASSWORD set |
| 3    | `node VALIDATE_SETUP.js`              | ✓ All validations passed              |
| 4    | `node BLOOD_NOTIFICATION_EXAMPLES.js` | ✓ Examples run successfully           |
| 5    | Create blood request                  | See notifications in server logs      |

## Key Functions (For Developers)

### Test Blood Type Compatibility

```javascript
const { isCompatibleDonor } = require("./src/utils/bloodTypeMatchings");

// Returns true if O- can donate to AB+
isCompatibleDonor("O-", "AB+"); // true
```

### Check Donation Eligibility

```javascript
const {
  isEligibleByDonationDate,
} = require("./src/services/bloodNotificationTransformer");

// Donor who donated 60 days ago
const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
isEligibleByDonationDate(twoMonthsAgo); // true (eligible)
```

### Manually Send Notifications

```javascript
const {
  transformBloodRequestToNotification,
} = require("./src/services/bloodNotificationTransformer");

const result = await transformBloodRequestToNotification(bloodRequestObject);
console.log(`Notified ${result.notificationsSent} donors`);
```

## Performance Expectations

- **First email**: ~1-2 seconds (includes connection setup)
- **Subsequent emails**: ~500ms-1s each
- **50 donors**: ~30-50 seconds total
- **100 donors**: ~80-120 seconds total
- **Gmail rate limit**: ~500 emails/day maximum

## What's Next?

1. ✅ Complete: Install & Setup
2. ⏭️ Start: Create blood requests and watch notifications
3. 📊 Monitor: Check server logs for notification details
4. 📚 Learn: Read `BLOOD_NOTIFICATION_SETUP.md` for advanced options
5. 🔧 Customize: Modify email template if needed
6. 📈 Scale: Optimize if handling 1000+ donors

## Important Notes

- 🔒 **Never commit `.env` file** - It contains sensitive credentials
- 📧 **App Password is app-specific** - Gmail can revoke if needed
- ⏱️ **2-month eligibility window** - Medical standard for blood donation
- 🚀 **Async by default** - Won't slow down API
- 📱 **Email verification** - Ensure users have valid emails in database

## Support Resources

1. **Setup Help**: `BLOOD_NOTIFICATION_SETUP.md`
2. **Quick Reference**: `BLOOD_NOTIFICATION_QUICK_REF.md`
3. **Code Examples**: `BLOOD_NOTIFICATION_EXAMPLES.js`
4. **Validation Tool**: `node VALIDATE_SETUP.js`
5. **Server Logs**: Watch console during blood request creation

## System Status

- ✅ Files created and configured
- ✅ Request controller integrated
- ✅ Dependencies added to package.json
- ✅ Environment template updated
- ⏳ Pending: Install dependencies (`npm install`)
- ⏳ Pending: Configure Gmail in `.env`
- ⏳ Pending: Validate setup (`node VALIDATE_SETUP.js`)

## FAQ

**Q: Will notifications block my API response?**  
A: No! Notifications run asynchronously using `setImmediate()`. API responds immediately.

**Q: What if Gmail is not configured?**  
A: System gracefully handles it - blood request still works, just no email sent.

**Q: Can I customize the email template?**  
A: Yes! Edit `generateEmailTemplate()` in `src/services/bloodNotificationTransformer.js`

**Q: What blood types are supported?**  
A: O−, O+, A−, A+, B−, B+, AB−, AB+ (all 8 types)

**Q: How often can someone donate?**  
A: System requires ≥2 months (60 days) between donations per medical guidelines.

**Q: What if a donor has no email?**  
A: Email skipped, logged as failed, but process continues for other donors.

---

## 🚀 Ready to Go!

Your blood donation notification system is ready. Here's what to do now:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure Gmail**:
   - Get App Password from Gmail account
   - Add to `.env` file

3. **Validate setup**:

   ```bash
   node VALIDATE_SETUP.js
   ```

4. **Test it**:

   ```bash
   node BLOOD_NOTIFICATION_EXAMPLES.js
   ```

5. **Start using**:
   - Create blood requests via API
   - Watch server logs for notifications
   - Check recipient emails

**Happy donating! 🩸**

---

**Questions?** Check the documentation files listed above.  
**Issues?** Run `VALIDATE_SETUP.js` to diagnose problems.  
**Examples?** Run `BLOOD_NOTIFICATION_EXAMPLES.js` to see it in action.
