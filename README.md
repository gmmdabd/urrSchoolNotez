# urSchoolNotez

A web application for students to create accounts, browse class sections, upload and search for notes, and participate in a class community.

## Features

- User authentication (signup/login) with email and password
- Dashboard with class sections (A-F)
- Upload notes in PDF, JPEG, or PNG format
- Search for notes by title or date
- Community section for class discussions with replies

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Supabase (Authentication, Database, Storage)

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up for an account if you don't have one.
2. Create a new project from the Supabase dashboard.
3. Once the project is created, note down the `Project URL` and `anon public key` from the project settings.

### 2. Configure Database Tables

Create the following tables in your Supabase database:

#### Notes Table
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### Community Posts Table
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  class TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### Post Replies Table
```sql
CREATE TABLE post_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 3. Configure Storage Bucket

1. Go to the Storage section in your Supabase dashboard.
2. Create a new bucket named `notes`.
3. Set the Access Control to `public` for the bucket.
4. Create a policy that allows authenticated users to upload files.

### 4. Configure Authentication

1. Go to the Authentication section in your Supabase dashboard.
2. Enable Email/Password sign-up method.
3. Optionally, configure email templates for verification emails.

### 5. Configure the Application

1. Open the `js/config.js` file.
2. Replace the placeholder values with your actual Supabase project URL and anon key:

```javascript
const SUPABASE_URL = 'https://lyiviofffopemsolinwz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5aXZpb2ZmZm9wZW1zb2xpbnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTE5NTYsImV4cCI6MjA1NjY4Nzk1Nn0.jx_x7qo19wsuIbZB4HWkrJ_k35g7bfG7-0LTnB3gBgY';
```

### 6. Run the Application

The application doesn't require any build steps. You can serve it using any static file server:

- Using Node.js and http-server:
  ```
  npm install -g http-server
  http-server
  ```

- Using Python:
  ```
  python -m http.server
  ```

- Using PHP:
  ```
  php -S localhost:8000
  ```

Or simply open the `index.html` file in your browser.

## Project Structure

- `index.html` - Main HTML file
- `css/styles.css` - Stylesheet for the application
- `js/config.js` - Supabase configuration
- `js/auth.js` - Authentication functions
- `js/app.js` - Main application logic

## License

MIT 