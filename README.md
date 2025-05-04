
# Blog Hub

**Blog Hub** is a full-featured blogging platform where users can create accounts, write and manage blogs, explore content by category, and interact with a dynamic community of authors and readers.

## **Live Website**
[Visit Blog Hub](https://blogsbysarika.vercel.app/)

---

## **Features**
- User authentication with NextAuth credentials
- Create, edit, delete, and view blogs
- Categorized blog browsing (Food, Travel, Fashion, etc.)
- Responsive and modern UI built with Tailwind CSS
- Persistent user sessions and secure access
- Dashboard with user-specific blog management
- Context API-based global loading spinner
- Protected routes for authenticated users

---

## **Tech Stack**
- **Frontend**: Next.js 14 (App Router), React.js, Tailwind CSS
- **Authentication**: NextAuth.js
- **Backend**: Next.js API Routes
- **Database**: MongoDB (via Mongoose)
- **Deployment**: Vercel (or your preferred provider)

---

## **Getting Started**

### **1. Clone the repository**
```bash
git clone https://github.com/sarika-madhariya/blog-app.git
cd blog-hub
```

### **2. Install dependencies**
```bash
npm install

```

### **3. Create your `.env.local` file**
Duplicate `.env.example` if present, or create a new `.env.local` file and fill in the following environment variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blog-hub?retryWrites=true&w=majority

# NextAuth Secret
NEXTAUTH_SECRET=your-nextauth-secret

# Cloudinary Setup
CLOUDINARY_API_KEY = "your-cloudinary-api-key"
CLOUDINARY_API_SECRET = "your-cloudinary-api-secret"
CLOUDINARY_CLOUD_NAME = "your-cloudinary-cloud-name"

# Base URL (for NextAuth)
NEXTAUTH_URL=http://localhost:3000


```

> Make sure the `NEXTAUTH_SECRET` is a strong, random string (use `openssl rand -base64 32` or similar).

---

## **Running the Project**

### **Development**
```bash
npm run dev
```

The app will run locally at [http://localhost:3000](http://localhost:3000)

### **Production Build**
```bash
npm run build
npm start
```

---

## **Project Structure**
```bash
/app
  /auth          # login and signup pages
  /blogs         # all blogs, my blogs
  /category      # category-wise filtering
  /profile       # user profile page
  /api           # backend routes (Next.js API)
  /lib           # global context, utilities
  /post-blog
  /components     # UI components (Navbar, Footer, etc.)

```

---

## **Contributing**
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## **License**
This project is licensed under the [MIT License](LICENSE).

---

## **Contact**
For queries, bug reports or contributions, reach out via [email@example.com](mailto:email@example.com) or open an issue.
