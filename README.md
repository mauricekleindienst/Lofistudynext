

<h1 align="center">Lo-Fi.Study</h1>
</p>

Welcome to lo-fi.study, a website dedicated to providing a relaxing environment for studying.

## Quick Start

### 🚀 First Time Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Lofistudynext
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase (Required)**
   ```bash
   npm run setup-supabase
   ```
   
   Follow the interactive setup guide, or see `SUPABASE_SETUP_GUIDE.md` for detailed instructions.

4. **Validate your setup**
   ```bash
   npm run validate-env
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Visit your app**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## About

lo-fi.study is a platform that combines the lo-fi artstyle with a simple, distraction-free interface to help you focus on your studies.

## Features

- **Minimalist Design**: Our interface is clean and simple, helping you to focus on what's important.
- **Pomodoro Timer**: Set a study timer to manage your study sessions effectively.
- **Notes & Todo Lists**: Keep track of your tasks and notes.
- **Background Videos**: Relaxing lo-fi backgrounds to enhance your study environment.
- **User Authentication**: Save your progress with Supabase auth.
- **Statistics & Progress Tracking**: Monitor your study habits and achievements.

## Technology Stack

- **Frontend**: Next.js, React, CSS Modules
- **Backend**: Supabase (Database + Authentication)
- **Real-time**: Socket.IO
- **Deployment**: Heroku (or any Node.js hosting)

## How to Use

1. Visit our website.
2. Create an account or sign in.
3. Choose a background from our library.
4. Set your study timer.
5. Use notes and todos to organize your work.
6. Start studying!

![Lofi Study Interface](https://github.com/mauricekleindienst/Lofistudynext/blob/master/public/cover.png)

## Database Setup

This project uses Supabase for authentication and data storage. You need to:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Configure your environment variables in `.env.local`

See `SUPABASE_SETUP_GUIDE.md` for complete setup instructions.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run setup-supabase` - Interactive Supabase setup
- `npm run validate-env` - Validate environment configuration
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

This project is licensed under the terms of the MIT license.
