# FarmLedger - Shared Farm Expense Management System

A modern, production-ready farm expense management application built with Next.js, MongoDB, and Cloudinary.

## Features

### Core Features
- **Dual-Owner Shared Account**: Two different users can manage the same farm account
- **Real-time Synchronization**: Changes made by one owner are instantly visible to the other
- **Transaction Management**: Complete DEBIT and CREDIT transaction tracking
- **Bill Image Upload**: Optional bill image upload for DEBIT transactions only (Cloudinary)
- **Advanced Filtering**: Filter by worker, date range, bill status, and transaction type
- **Worker & Farm Management**: Add and track workers and farms (never deleted with financial data)
- **Financial Data Erasure**: Selectively erase transactions while preserving workers/farms
- **Bilingual Support**: English and Marathi with instant language toggle
- **Dark/Light Theme**: User preference saved per account
- **Secure Authentication**: Email/Phone + 4-digit PIN authentication with bcrypt hashing

### Accounting Logic
- **Dynamic Balance Calculation**: Never stored in DB, always calculated
- **Formula**: `netBalance = totalCredit - totalDebit`
- **Filter-Aware Reports**: Calculations based on filtered data only

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Image Storage**: Cloudinary
- **Authentication**: JWT with bcrypt
- **UI Components**: shadcn/ui, next-themes, react-hot-toast
- **Validation**: Custom validators with proper error handling

## Installation

```bash
npm install
```

## Environment Setup

Create `.env.local` file in the root directory (refer to `ENV_SETUP.md` for details):

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```
farm-ledger/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── signup/route.ts
│   │   ├── transactions/route.ts
│   │   ├── workers/route.ts
│   │   ├── farms/route.ts
│   │   └── upload/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── models/
│   ├── Account.ts
│   ├── User.ts
│   ├── Worker.ts
│   ├── Farm.ts
│   └── Transaction.ts
├── lib/
│   ├── mongodb.ts
│   ├── cloudinary.ts
│   ├── auth.ts
│   ├── validators.ts
│   └── i18n.tsx
├── locales/
│   ├── en.json
│   └── mr.json
├── components/
└── .env.local
```

## Database Schema

### Account
- accountName
- createdAt, updatedAt

### User
- name, email, phone
- pin (hashed with bcrypt)
- accountId (ref to Account)
- language (en/mr), theme (light/dark)

### Worker
- name, phone
- accountId (ref to Account)
- isActive

### Farm
- name, location, area
- accountId (ref to Account)
- isActive

### Transaction
- type (DEBIT/CREDIT)
- amount, description
- workerId (ref to Worker)
- farmId (ref to Farm)
- accountId (ref to Account)
- billImageUrl (null for CREDIT)
- date, createdBy (ref to User)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user and account
- `POST /api/auth/login` - Login with email/phone + PIN

### Transactions
- `GET /api/transactions` - Get transactions with filters
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions?type=all|debit|credit` - Erase financial data

### Workers
- `GET /api/workers` - Get all workers
- `POST /api/workers` - Add new worker

### Farms
- `GET /api/farms` - Get all farms
- `POST /api/farms` - Add new farm

### Upload
- `POST /api/upload` - Upload bill image to Cloudinary

## Key Rules

1. **Bill Images**:
   - Only allowed for DEBIT transactions
   - Always optional
   - Stored in Cloudinary, URL saved in MongoDB
   - Credit transactions CANNOT have images

2. **Balance Calculation**:
   - NEVER store balance in database
   - Always calculate: `totalCredit - totalDebit`
   - Apply to filtered results only

3. **Multi-Owner Logic**:
   - All data belongs to Account, not User
   - Both owners see same data
   - Authorization checks by accountId

4. **Data Erasure**:
   - Only deletes Transaction documents
   - Workers, Farms, Users, Account remain intact
   - Requires confirmation

## Authentication Flow

1. User signs up → Account created automatically
2. Second owner can sign up and link to same accountId (manual linking required)
3. Login with email/phone + 4-digit PIN
4. JWT token issued (30-day expiry)
5. All API calls require Bearer token

## Security Features

- PIN hashing with bcrypt
- JWT token authentication
- Authorization by accountId
- Image file type & size validation
- Input validation on all endpoints

## Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- shadcn/ui components
- Dark mode support

## License

Proprietary - All Rights Reserved
