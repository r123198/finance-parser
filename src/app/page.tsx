import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center retro-bg">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-pink-400 mb-6 drop-shadow-lg font-vt323 tracking-widest retro-title">
          Welcome to Statement Analyzer
        </h1>
        <p className="text-2xl text-cyan-200 mb-8 font-vt323 retro-subhead">
          Upload your bank statements and get instant insights into your finances.<br/>
          Track your spending, identify trends, and make better financial decisions.
        </p>
        <div className="space-x-4 mb-12">
          <Link
            href="/upload"
            className="inline-block bg-yellow-300 text-black px-8 py-3 rounded-lg font-vt323 text-xl border-4 border-pink-400 shadow-lg hover:bg-pink-400 hover:text-white transition-colors retro-btn"
          >
            Upload Statement
          </Link>
          <Link
            href="/dashboard"
            className="inline-block bg-cyan-300 text-black px-8 py-3 rounded-lg font-vt323 text-xl border-4 border-green-400 shadow-lg hover:bg-green-400 hover:text-white transition-colors retro-btn"
          >
            View Dashboard
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-lg border-4 border-cyan-400 font-vt323">
            <h3 className="text-xl font-bold text-pink-500 mb-2">Easy Upload</h3>
            <p className="text-gray-700 text-lg">
              Simply drag and drop your PDF or Excel statements to get started.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg border-4 border-pink-400 font-vt323">
            <h3 className="text-xl font-bold text-cyan-500 mb-2">Smart Analysis</h3>
            <p className="text-gray-700 text-lg">
              Automatic categorization and trend analysis of your transactions.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg border-4 border-yellow-300 font-vt323">
            <h3 className="text-xl font-bold text-green-500 mb-2">Privacy First</h3>
            <p className="text-gray-700 text-lg">
              Your data stays on your device. We never store your financial information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
