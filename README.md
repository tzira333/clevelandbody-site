# Domestic and Foreign Auto Body Inc. - Web Application

**Full-stack Next.js application for auto body shop management and customer service**

Built with Next.js 14, TypeScript, Supabase, Tailwind CSS, Twilio, and Stripe (prepared).

---

## 🚀 Features

### Public Website
- ✅ Home page with hero, services overview, and call-to-actions
- ✅ Services page with detailed service offerings
- ✅ Insurance & claims information page
- ✅ Photo gallery of completed work
- ✅ Customer reviews and testimonials
- ✅ Contact page with form and business information
- ✅ Appointment scheduling system (30-minute slots, business hours)
- ✅ Tow request workflow with photo uploads
- ✅ Repair case request workflow
- ✅ Payments page (call-only, prepared for Stripe)

### Customer Portal
- ✅ User authentication (Supabase Auth)
- ✅ Create and manage repair cases
- ✅ Upload photos and documents
- ✅ Store insurance and claim information
- ✅ View appointment history
- ✅ Track repair status

### Admin Dashboard
- ✅ View all repair cases with filtering and search
- ✅ Manage appointments (view, confirm, reschedule, cancel)
- ✅ View tow requests and dispatch status
- ✅ Configurable notification settings (SMS and email recipients)
- ✅ Activity log for auditing
- ✅ Staff-only access with role-based permissions

### Notification System
- ✅ SMS alerts to staff (Twilio) - broadcast to all configured numbers
- ✅ Email alerts (Postmark or SendGrid) - configurable recipients
- ✅ Automated notifications for:
  - New repair case submissions
  - New appointment requests
  - Tow request submissions
  - Status updates
  - New file uploads

### Payments Infrastructure (Prepared, Currently Disabled)
- ✅ Database schema ready for Stripe integration
- ✅ Payment types: deposits, full payments, partial payments
- ✅ Payment methods: Stripe, Zelle, Venmo, PayPal, Cash App, Cash, Check
- ⚠️ **Currently showing call-only page** - enable when ready

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Supabase account** (free tier works great)
- **Twilio account** (for SMS notifications)
- **Postmark** or **SendGrid account** (for email)
- **Stripe account** (optional, for future payment processing)
- **Domain access** to clevelandbody.com (for DNS configuration)

---

## 🛠 Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd domestic-foreign-auto-body

# Install dependencies
npm install
```

### 2. Set Up Supabase

1. **Create a new Supabase project** at https://app.supabase.com

2. **Run the database schema**:
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Execute the SQL script

3. **Set up Storage**:
   - Go to **Storage** in your Supabase dashboard
   - Create a new bucket named `case-uploads`
   - Set it to **private** (not public)
   - Add storage policies (see schema.sql comments for policy code)

4. **Configure Authentication**:
   - Go to **Authentication** → **Providers**
   - Enable **Email** provider
   - Configure email templates (optional)
   - Set site URL to your domain (for production) or `http://localhost:3000` (for dev)

5. **Get your API keys**:
   - Go to **Settings** → **API**
   - Copy your:
     - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
     - Anon/Public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
     - Service Role key (`SUPABASE_SERVICE_ROLE_KEY`) - **keep this secret!**

### 3. Configure Twilio (SMS Notifications)

1. **Sign up for Twilio** at https://www.twilio.com/try-twilio
2. **Get a phone number** (must support SMS)
3. **Complete A2P 10DLC registration** (required for US SMS):
   - Go to **Messaging** → **Regulatory compliance**
   - Register your business (EIN required)
   - Register a campaign (usually takes 1-3 days for approval)
4. **Get your credentials**:
   - Account SID (`TWILIO_ACCOUNT_SID`)
   - Auth Token (`TWILIO_AUTH_TOKEN`)
   - Your Twilio phone number (`TWILIO_PHONE_NUMBER`)

### 4. Configure Email Service

**Option A: Postmark (Recommended)**

1. Sign up at https://account.postmarkapp.com
2. Create a server and add your sending domain
3. Configure DNS records (SPF, DKIM, Return-Path)
4. Get your Server API Token (`POSTMARK_API_KEY`)
5. Set from email (`POSTMARK_FROM_EMAIL`)

**Option B: SendGrid (Alternative)**

1. Sign up at https://signup.sendgrid.com
2. Create an API key with "Mail Send" permissions
3. Authenticate your sending domain (DNS records)
4. Get your API key (`SENDGRID_API_KEY`)
5. Set from email (`SENDGRID_FROM_EMAIL`)

### 5. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Email (choose Postmark OR SendGrid)
POSTMARK_API_KEY=your_postmark_api_key
POSTMARK_FROM_EMAIL=notifications@clevelandbody.com

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BUSINESS_PHONE=+12164818696

# Staff Notifications (comma-separated E.164 format)
STAFF_SMS_RECIPIENTS=+12162880668,+14405300810,+14407491081
DEFAULT_EMAIL_RECIPIENTS=domesticandforeignab@gmail.com
```

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 🌐 Production Deployment (Vercel)

### 1. Prepare Your Repository

Push your code to GitHub, GitLab, or Bitbucket.

### 2. Deploy to Vercel

1. **Sign up** at https://vercel.com
2. **Import your repository**
3. **Configure project**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**:
   - Go to **Settings** → **Environment Variables**
   - Add all variables from `.env.local`
   - Set appropriate environments:
     - `NEXT_PUBLIC_*` → **Production, Preview, Development**
     - Secret keys → **Production only** (recommended)

5. **Deploy**!

Your site will be live at `your-project.vercel.app`

### 3. Configure Custom Domain (clevelandbody.com)

#### A. In Vercel Dashboard

1. Go to **Settings** → **Domains**
2. Add domain: `clevelandbody.com`
3. Add domain: `www.clevelandbody.com`
4. Vercel will provide DNS instructions

#### B. Configure DNS (Cloudflare)

**If you use Cloudflare for DNS:**

1. **Log in** to your Cloudflare dashboard
2. **Select** clevelandbody.com domain
3. **Go to DNS** → **Records**

4. **Add/Update A Record** (root domain):
   ```
   Type: A
   Name: @
   IPv4 address: 76.76.21.21
   Proxy status: DNS only (gray cloud)
   TTL: Auto
   ```

5. **Add/Update CNAME Record** (www subdomain):
   ```
   Type: CNAME
   Name: www
   Target: cname.vercel-dns.com
   Proxy status: DNS only (gray cloud)
   TTL: Auto
   ```

6. **Important**: Set proxy status to **DNS only** (gray cloud icon), NOT proxied (orange cloud)

7. **Wait for DNS propagation** (can take 1-48 hours, usually ~15 minutes)

8. **Verify in Vercel**:
   - Go back to Vercel dashboard
   - Check domain status (should show "Valid Configuration")
   - Vercel will automatically provision SSL certificates

#### C. If Using Another DNS Provider

Add these records to your DNS provider:

**For root domain (clevelandbody.com):**
```
Type: A
Host: @ (or leave blank)
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

### 4. Configure Email Domain Authentication

To send emails from `@clevelandbody.com`, you need to add DNS records:

#### For Postmark:

1. Go to Postmark → **Servers** → **Sender Signatures**
2. Add domain: `clevelandbody.com`
3. Postmark will provide 3 DNS records:
   - **DKIM record** (TXT)
   - **Return-Path record** (CNAME)
   - **SPF record** (TXT) - update existing if you have one

4. Add these records to your DNS (Cloudflare or other provider)

#### For SendGrid:

1. Go to SendGrid → **Settings** → **Sender Authentication**
2. Authenticate your domain
3. Add the provided DNS records (usually 3 CNAMEs)

**Verification takes 24-48 hours.**

---

## 👥 User Management

### Create Admin User

1. **Sign up** through the customer portal at `/portal`
2. **Manually promote to admin**:
   - Go to Supabase Dashboard → **Table Editor**
   - Open `profiles` table
   - Find your user by email
   - Change `role` from `customer` to `admin`
3. **Log out and log back in**
4. You'll now see the Admin Dashboard link

### Staff Phone Numbers Configuration

**Method 1: Environment Variable** (for Vercel deployment)
```env
STAFF_SMS_RECIPIENTS=+12162880668,+14405300810,+14407491081
```

**Method 2: Database** (recommended for production)
- Go to Admin Dashboard → Settings → Notifications
- Update SMS recipients
- Changes take effect immediately

---

## 📱 SMS Compliance (A2P 10DLC)

**Important**: To send business SMS in the US, you **must** complete A2P 10DLC registration with Twilio.

### Steps:

1. **Register your business**:
   - Business name: Domestic and Foreign Auto Body Inc.
   - EIN (Employer Identification Number) required
   - Business address: 17017 Saint Clair Ave, Cleveland, OH 44110

2. **Register your campaign**:
   - Use Case: **Notifications**
   - Sample messages: appointment confirmations, tow requests, status updates
   - Opt-in method: "Customer submits appointment/repair request via website"

3. **Approval time**: 1-3 business days

4. **Documentation**: https://www.twilio.com/docs/messaging/compliance/a2p-10dlc

**Without A2P 10DLC registration**, SMS delivery will be unreliable or blocked by carriers.

---

## 💳 Payments Setup (When Ready to Enable)

Currently, the payments page shows **"Please call to arrange payment"**. When ready to accept online payments:

### 1. Stripe Setup

1. **Sign up** at https://dashboard.stripe.com
2. **Complete business verification**
3. **Get API keys**:
   - Publishable key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
   - Secret key (`STRIPE_SECRET_KEY`)
   - Webhook secret (`STRIPE_WEBHOOK_SECRET`)

4. **Set up webhook** endpoint:
   - URL: `https://clevelandbody.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

5. **Add to environment variables** in Vercel

### 2. Enable Payments in Code

Update `app/payments/page.tsx` to show payment options instead of call-only message.

### 3. PayPal Integration (Optional)

For customers who prefer PayPal:
1. Sign up for PayPal Business account
2. Get API credentials
3. Integrate PayPal Checkout buttons

### 4. Alternative Payment Methods

For Zelle, Venmo, Cash App:
- Currently designed as "pay-by-app instructions" page
- Customer submits payment confirmation
- Staff verifies manually

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - only use server-side
3. **Use environment variables** in Vercel for all secrets
4. **Enable Row Level Security (RLS)** on all Supabase tables (included in schema)
5. **Regularly update dependencies**: `npm audit fix`
6. **Monitor Supabase logs** for suspicious activity
7. **Use HTTPS only** in production (automatic with Vercel)

---

## 📊 Monitoring and Maintenance

### Application Monitoring

- **Vercel Analytics**: Automatically enabled
- **Supabase Dashboard**: Monitor database performance
- **Error tracking**: Check Vercel deployment logs

### Database Backups

Supabase provides automatic daily backups on all plans. To manually backup:

```bash
# Export database
npx supabase db dump > backup.sql
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update (carefully review breaking changes)
npm update
```

---

## 🐛 Troubleshooting

### SMS Not Sending

- ✅ Verify Twilio credentials in environment variables
- ✅ Check A2P 10DLC registration status
- ✅ Verify `STAFF_SMS_RECIPIENTS` format (E.164: +1XXXXXXXXXX)
- ✅ Check Twilio console for error logs

### Email Not Sending

- ✅ Verify email service API key
- ✅ Check domain authentication (SPF, DKIM records)
- ✅ Verify sender email is from authenticated domain
- ✅ Check spam folder

### Database Connection Issues

- ✅ Verify Supabase URL and keys
- ✅ Check Supabase project status
- ✅ Verify RLS policies allow access
- ✅ Check network/firewall settings

### Authentication Not Working

- ✅ Verify site URL in Supabase settings
- ✅ Check redirect URLs configuration
- ✅ Clear browser cookies and cache
- ✅ Verify email templates are configured

### File Upload Issues

- ✅ Verify storage bucket exists: `case-uploads`
- ✅ Check storage RLS policies
- ✅ Verify file size limits
- ✅ Check file type restrictions

---

## 🎨 Customization

### Brand Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    DEFAULT: '#800000', // Burgundy/Maroon
    light: '#A00000',
    dark: '#600000',
  },
}
```

### Business Hours

Edit `types/index.ts`:

```ts
export const BUSINESS_HOURS: BusinessHours = {
  monday: { open: '08:00', close: '16:30', closed: false },
  // ... update as needed
}
```

### Appointment Duration

Change 30-minute default in `types/index.ts`:

```ts
export const APPOINTMENT_DURATION_MINUTES = 30
```

---

## 📞 Support and Contact

### Business Contact
- **Phone**: (216) 481-8696
- **Address**: 17017 Saint Clair Ave, Cleveland, OH 44110
- **Hours**: Mon-Fri 8:00 AM - 4:30 PM | Sat 9:00 AM - 1:00 PM

### Technical Support
- **Vercel**: https://vercel.com/support
- **Supabase**: https://supabase.com/support
- **Twilio**: https://support.twilio.com

---

## 📝 License

Proprietary - © 2026 Domestic and Foreign Auto Body Inc. All rights reserved.

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables configured in Vercel
- [ ] Supabase database schema deployed
- [ ] Storage bucket created and configured
- [ ] DNS records added and propagated
- [ ] SSL certificate provisioned (automatic)
- [ ] Email domain authenticated (SPF, DKIM)
- [ ] Twilio A2P 10DLC registration approved
- [ ] Admin user created and tested
- [ ] Test appointment booking
- [ ] Test tow request submission
- [ ] Test repair case creation
- [ ] Test file uploads
- [ ] SMS notifications tested
- [ ] Email notifications tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed
- [ ] Google Analytics/Search Console configured (optional)
- [ ] Privacy policy and terms added (if required)

---

## 🚀 What's Next?

### Future Enhancements (Suggested Roadmap)

1. **Payments Integration**
   - Enable Stripe Checkout
   - Add PayPal support
   - Implement deposit/full payment workflows

2. **Customer Experience**
   - SMS appointment reminders (24h before)
   - Email status update notifications
   - Real-time repair progress tracking
   - Before/after photo galleries per case

3. **Admin Tools**
   - Calendar view for appointments
   - Drag-and-drop appointment rescheduling
   - Bulk email/SMS campaigns
   - Reporting and analytics dashboard

4. **Marketing**
   - Google Business Profile integration
   - Review request automation
   - Referral program
   - Newsletter signup

5. **Integrations**
   - Accounting software (QuickBooks)
   - CRM integration
   - Parts ordering system
   - Fleet management tools

---

**Built with ❤️ for Domestic and Foreign Auto Body Inc.**

For assistance with this application, contact your development team or refer to the documentation above.
