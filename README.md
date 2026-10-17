# 🚀 ProjectPulse - Developer Portfolio & Roadmap Tracker

A dynamic, full-stack portfolio management web application built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**.

---

## 🌟 Architecture & Access

### 1. 👥 Visitor / User View (`/`):
- **Clean Public Experience:** Regular visitors only see your public portfolio roadmap at [http://localhost:3000](http://localhost:3000).
- **Zero Admin Clues:** No "Admin Panel" buttons or administrative links are visible in the navbar or footer.
- **Categorized Roadmap:**
  - ⚡ **Current / Ongoing:** Active builds in progress
  - 🚀 **Upcoming:** Scheduled initiatives ready to start
  - 🔮 **Future Projects:** High-level concepts and architectures
  - ⏳ **Pending / Paused:** Projects awaiting APIs, client feedback, or reviews
  - ✅ **Completed:** Shipped and maintained projects
- **Live Progress Bars (0% to 100%)**
- **Search & Filter:** Search by keywords, tech stack tags (React, Node.js, MongoDB, etc.), or categories.

### 2. 🛡️ Secret Admin Access (`/admin007`):
- **Secret URL:** Access the admin portal directly via:
  👉 **`http://localhost:3000/admin007`**
- **Configured Admin Credentials:**
  - Configured in your `backend/.env` file (`ADMIN_EMAIL` & `ADMIN_PASSWORD`)
- **Admin Capabilities:**
  - Create, edit, and delete projects.
  - Quick status switch directly from project cards.
  - Direct link to "View Public Portfolio" and one-click "Logout".

---

## 🚀 Running the Project

```bash
npm run dev
```

- **Visitor Portfolio:** [http://localhost:3000](http://localhost:3000)
- **Secret Admin Login:** [http://localhost:3000/admin007](http://localhost:3000/admin007)
- **Backend API:** [http://localhost:5001/api](http://localhost:5001/api)

---

## ☁️ Cloudinary Configuration

To upload project images directly to your Cloudinary cloud account:
1. Open [`backend/.env`](file:///e:/code/Projects/portfolio%20updates/backend/.env).
2. Add your Cloudinary credentials:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. In the Admin Dashboard (`/admin007`), click **"Upload Image File"** when adding or editing a project. The image will automatically upload to Cloudinary and populate the URL with full thumbnail preview.
