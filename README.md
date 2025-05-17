# Statement Analyzer

A modern, open-source web application that helps users analyze their financial statements by automatically parsing PDF and Excel files, providing clear insights into their spending patterns and financial health.

## Features

- 📤 Easy file upload for PDF and Excel statements
- 🔍 Automatic transaction parsing and categorization using LLM (DeepSeek)
- 📊 Interactive dashboard with spending insights and charts
- 📈 Category breakdown, top merchants, and monthly trends
- 💡 AI-powered observations and suggestions
- 🔒 Privacy-first: No data is stored on a server (demo uses in-memory storage)
- 🌈 Beautiful, retro-inspired UI
- 🆓 100% open source

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- [formidable](https://www.npmjs.com/package/formidable) (file uploads)
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) (PDF text extraction)
- [DeepSeek](https://deepseek.com/) (LLM for financial analysis)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/statement-analyzer.git
cd statement-analyzer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root:
```
DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

### 4. Run the development server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploying to Vercel (Recommended)
1. Push your code to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com](https://vercel.com/), sign up, and import your repository.
3. Set the `DEEPSEEK_API_KEY` environment variable in the Vercel dashboard.
4. Click **Deploy**. Your app will be live!

## Usage
- Upload your bank statement (PDF, XLS, XLSX, or CSV).
- The app will parse, analyze, and visualize your transactions.
- View insights, category breakdowns, and AI-powered suggestions on the dashboard.

## Project Structure
```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard page
│   └── upload/         # File upload page
├── components/         # Reusable UI components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source under the [MIT License](LICENSE).

---

**Made with ❤️ for the open-source community.**
