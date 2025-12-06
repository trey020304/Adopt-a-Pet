# 🐾 Adopt-a-Pet
### A Cloud-Deployed Pet Adoption & Rescue Platform

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

---

## 📌 Overview
**Adopt-a-Pet** is a web-based platform designed to help animal shelters digitize core operations such as pet adoption, rescue reporting, and donation management. By integrating a modern frontend with a serverless backend, the system ensures a seamless user experience and efficient admin workflows.

This platform utilizes:
* **React.js** – Responsive, component-based user interface.
* **Supabase** – Authentication, PostgreSQL cloud database, and S3-compatible storage.
* **Vercel** – Automated deployment, global CDN, and environment management.

---

## ✨ Key Features

### 👤 User Features
* **Account Management:** Create an account via email/password; secure login via Supabase Auth.
* **Pet Browsing:** View adoptable pets with full descriptions and photos.
* **Submissions:**
    * Adoption forms.
    * Rescue reports (supports uploading up to 4 images).
    * Donation forms.
* **Privacy:** Users can view *only* their own submissions (protected via RLS).

### 🔐 Admin Features
* **CRUD Management:** Full control over pet listings (Create, Read, Update, Delete).
* **Submission Review:** Manage adoption requests, rescue reports, and donation records.
* **Security:** Full access to protected records enforced through Supabase policies.

### ☁️ Cloud Functionality
* **Database:** PostgreSQL relational database.
* **Storage:** S3-compatible object storage for pet and rescue images.
* **Security:** Row-Level Security (RLS) for strict access control.
* **CI/CD:** Automatic deployments via Vercel on GitHub push.

---

## 📋 Functional Requirements

1.  **User Authentication**
    * Register using email and password.
    * Verify logins and maintain active sessions.
    * Protect routes for authenticated users only.
2.  **Pet Listing & Browsing**
    * Display Name, Breed, Age, Description, and Image(s).
    * Public access to view profiles (no login required).
3.  **Adoption Submission**
    * Validate required fields before submission.
    * Users see only their own history (RLS).
    * Admins can approve/reject/update forms.
4.  **Rescue Reporting**
    * Upload 1–4 images with a report.
    * **Constraint:** Form must not submit without images.
    * Admins access all reports; standard users access none (except their own creation).
5.  **Donation Management**
    * Submit donation inquiries.
    * Admins view and archive records.
6.  **Admin CRUD Operations**
    * Add, Update, Delete, or Archive pet profiles.
    * View all user submissions.
7.  **Media Management**
    * Images stored in Supabase Storage with retrievable URLs.
    * Security policies applied to public vs. signed URLs.
8.  **System Security**
    * RLS ensures strict per-user data protection.
    * Auth tokens secure all API requests.
9.  **Cloud Deployment**
    * Automatic builds on Vercel.
    * Secure environment variable storage.

---

## 🛠️ Development Environment Setup

Follow these steps to run Adopt-a-Pet on your local machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/trey020304/Adopt-a-Pet](https://github.com/trey020304/Adopt-a-Pet)
cd Adopt-a-Pet
```

### 2. Install Dependencies
Requires Node.js and npm.

```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** Get these credentials from **Supabase Dashboard → Settings → API**.

### 4. Supabase Configuration
Inside your Supabase project:

**A. Create Database Tables**
* `pets`
* `adoption_forms`
* `rescue_reports`
* `donations`
* `profiles` (Optional)

**B. Enable Row-Level Security (RLS)**
* Enable RLS for each table listed above.

**C. Add RLS Policies**
* **Users:** Can only view entries where `user_id = auth.uid()`.
* **Admins:** Can access all records (`true` policy).

**D. Create Storage Buckets**
* `pet-images`
* `rescue-images`
* *Ensure proper upload & read rules are set in storage policies.*

### 5. Run Locally
```bash
npm run dev
```
App runs on: 👉 http://localhost:5173/ (default for Vite)

### 6. Build for Production
```bash
npm run build
```

### 7. Deploy to Vercel
You can deploy via the CLI or connect your GitHub repository.

**Option A: CLI**
```bash
vercel
```

**Option B: GitHub Integration**
1.  Connect your GitHub repository to Vercel.
2.  Set Environment Variables in **Vercel → Project Settings → Environment Variables**.
3.  Vercel will automatically redeploy on every push to GitHub.

---

## 📁 Project Structure

```text
src/
 ├── components/      # UI components
 ├── pages/           # Frontend pages & routes
 ├── hooks/           # Custom React hooks
 ├── supabase/        # Supabase client config
 ├── utils/           # Helper scripts and API wrappers
 └── assets/          # Images & static assets
```

---

## 🌐 Links

* 🔗 **GitHub Repository:** [https://github.com/trey020304/Adopt-a-Pet](https://github.com/trey020304/Adopt-a-Pet)
* 🔗 **Live Deployment:** [https://adopt-a-pet-beta.vercel.app/](https://adopt-a-pet-beta.vercel.app/)

---

## 👥 Proponents

* **Del Mundo, Ron Gabriel B.**
* **Marcos, Mark Wilhelm Trevor K.**