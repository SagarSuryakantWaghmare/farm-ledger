# FarmLedger - Quick Environment Setup

## Step 1: Copy this content to `.env.local`

Create a new file called `.env.local` in the project root and paste this:

```env
MONGODB_URI=mongodb://localhost:27017/farmledger

JWT_SECRET=farmledger_jwt_secret_2026_change_in_production_abc123xyz
NEXTAUTH_SECRET=farmledger_nextauth_secret_2026_change_in_production_def456uvw
NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

NODE_ENV=development
```

## Step 2: Get Cloudinary Credentials (Free)

1. Go to https://cloudinary.com and sign up (free)
2. After login, go to your Dashboard
3. You'll see three values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123`)
4. Replace in `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
   ```

## Step 3: MongoDB Setup (Choose One)

### Option A: Local MongoDB (Simple)
- Download MongoDB Community Server: https://www.mongodb.com/download-center/community
- Install it
- MongoDB will run on `mongodb://localhost:27017`
- No changes needed in `.env.local`

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free M0 cluster
3. Create database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (for development)
5. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Update in `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farmledger
   ```

## Step 4: Run the App

```bash
npm run dev
```

Open http://localhost:3000 and create your account!

## ✅ Quick Check

Your `.env.local` should have:
- [x] MONGODB_URI (MongoDB connection)
- [x] JWT_SECRET (for authentication)
- [x] NEXTAUTH_SECRET (for NextAuth)
- [x] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (from Cloudinary)
- [x] CLOUDINARY_API_KEY (from Cloudinary)
- [x] CLOUDINARY_API_SECRET (from Cloudinary)
- [x] NODE_ENV=development

## 🚨 Important Notes

- **JWT_SECRET** and **NEXTAUTH_SECRET** are already set with working defaults
- You ONLY need to update the 3 Cloudinary values (from your Cloudinary dashboard)
- MongoDB will work locally by default, or update to Atlas URL if using cloud
- Never commit `.env.local` to git (it's already in .gitignore)
- Change the JWT secrets in production!

## Need Help?

- MongoDB not connecting? Make sure it's running or check your Atlas connection string
- Cloudinary upload failing? Double-check you copied all 3 credentials correctly
- Can't login? Make sure MongoDB is connected and check browser console for errors

You're all set! 🎉
