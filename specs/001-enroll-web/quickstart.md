# Quickstart

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the database:
   ```bash
   npx prisma db push
   ```

3. Setup environment variables:
   - Create a `.env.local` file based on `.env.example`
   - Add your `LINE_NOTIFY_TOKEN`
   - Add `SESSION_SECRET` for secure cookies

4. Run the development server:
   ```bash
   npm run dev
   ```
