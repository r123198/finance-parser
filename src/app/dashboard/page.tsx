'use client';

import { useEffect, useState } from 'react';
import type { StatementAnalysis } from '@/types';
import RetroWindow from '@/components/RetroWindow';
import { Pie, Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ChartTitle);

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<StatementAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/parse');
        if (!res.ok) throw new Error('No analysis data found. Please upload a statement.');
        const data = await res.json();
        setAnalysis(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load analysis.');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, []);

  if (loading) {
    return <div className="text-center text-cyan-300 py-16 text-xl">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="text-center text-rose-400 py-16 text-xl">{error}</div>;
  }
  if (!analysis) {
    return <div className="text-center text-rose-400 py-16 text-xl">No analysis data found.</div>;
  }

  // Prepare chart data from analysis
  const { summary, categories, transactions, charts, observations } = analysis;

  const pieData = {
    labels: charts.pieChart.labels,
    datasets: [
      {
        data: charts.pieChart.data,
        backgroundColor: [
          '#00fff7',
          '#ff00c8',
          '#ffe600',
          '#00ff57',
          '#ff6b00',
          '#a259f7',
          '#f7a259',
        ],
        borderColor: '#181818',
        borderWidth: 3,
      },
    ],
  };

  const lineData = {
    labels: charts.lineChart.labels,
    datasets: [
      {
        label: 'Spending',
        data: charts.lineChart.data,
        borderColor: '#00fff7',
        backgroundColor: 'rgba(0,255,247,0.2)',
        tension: 0.3,
        borderWidth: 4,
        pointBackgroundColor: '#00fff7',
        pointBorderColor: '#181818',
        pointRadius: 7,
      },
    ],
  };

  const barData = {
    labels: charts.barChart.labels,
    datasets: [
      {
        label: 'Top Merchants',
        data: charts.barChart.data,
        backgroundColor: '#ff00c8',
        borderColor: '#181818',
        borderWidth: 3,
      },
    ],
  };

  const donutData = {
    labels: charts.donutChart.labels,
    datasets: [
      {
        data: charts.donutChart.data,
        backgroundColor: [
          '#ff00c8',
          '#00fff7',
          '#ffe600',
        ],
        borderColor: '#181818',
        borderWidth: 3,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#181818',
          font: { family: 'VT323', size: 18 },
        },
      },
    },
  };

  const lineOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#181818',
          font: { family: 'VT323', size: 18 },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: '#181818', font: { family: 'VT323', size: 16 } },
        grid: { color: '#ffe600' },
      },
      y: {
        ticks: { color: '#181818', font: { family: 'VT323', size: 16 } },
        grid: { color: '#00fff7' },
      },
    },
  };

  const barOptions = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#181818', font: { family: 'VT323', size: 16 } },
        grid: { color: '#ffe600' },
      },
      y: {
        ticks: { color: '#181818', font: { family: 'VT323', size: 16 } },
        grid: { color: '#00fff7' },
      },
    },
  };

  const donutOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#181818',
          font: { family: 'VT323', size: 18 },
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen retro-bg">
      <h1 className="text-4xl font-vt323 font-bold text-pink-400 mb-4 drop-shadow-lg tracking-widest retro-title">Financial Dashboard</h1>

      {/* Observations Section */}
      {observations && (
        <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-yellow-700 mb-2 font-vt323">Insights & Observations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-cyan-700 mb-1">Suggestions</h3>
              <ul className="list-disc list-inside text-cyan-900">
                {observations.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-pink-700 mb-1">Anomalies</h3>
              <ul className="list-disc list-inside text-pink-900">
                {observations.anomalies.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-700 mb-1">Recurring Payments</h3>
              <ul className="list-disc list-inside text-green-900">
                {observations.recurringPayments.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-purple-700 mb-1">Duplicate Merchants</h3>
              <ul className="list-disc list-inside text-purple-900">
                {observations.duplicateMerchants.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <RetroWindow title="Total Spending" className="border-pink-400">
          <h3 className="text-lg font-bold text-pink-500 mb-2">Total Spending</h3>
          <p className="text-3xl font-bold text-pink-600">₱{summary.totalSpending.toLocaleString()}</p>
        </RetroWindow>
        <RetroWindow title="Total Income" className="border-green-400">
          <h3 className="text-lg font-bold text-green-500 mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">₱{summary.totalIncome.toLocaleString()}</p>
        </RetroWindow>
        <RetroWindow title="Total Rewards" className="border-yellow-400">
          <h3 className="text-lg font-bold text-yellow-500 mb-2">Total Rewards</h3>
          <p className="text-3xl font-bold text-yellow-600">₱{summary.totalRewards.toLocaleString()}</p>
        </RetroWindow>
        <RetroWindow title="Total Fees" className="border-gray-400">
          <h3 className="text-lg font-bold text-gray-500 mb-2">Total Fees</h3>
          <p className="text-3xl font-bold text-gray-600">₱{summary.totalFees.toLocaleString()}</p>
        </RetroWindow>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <RetroWindow title="Spending by Category (Pie)" className="border-yellow-300">
          <Pie data={pieData} options={pieOptions} />
        </RetroWindow>
        <RetroWindow title="Spending Over Time (Line)" className="border-cyan-400">
          <Line data={lineData} options={lineOptions} />
        </RetroWindow>
        <RetroWindow title="Top Merchants (Bar)" className="border-pink-400">
          <Bar data={barData} options={barOptions} />
        </RetroWindow>
        <RetroWindow title="Expense/Income/Fees (Donut)" className="border-green-400">
          <Doughnut data={donutData} options={donutOptions} />
        </RetroWindow>
      </div>

      {/* Category Breakdown */}
      <div className="mb-8">
        <RetroWindow title="Category Breakdown" className="border-yellow-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat) => (
              <div key={cat.category} className="mb-4">
                <h3 className="text-lg font-bold text-cyan-700 mb-1">{cat.category}</h3>
                <p className="text-md text-gray-700 mb-1">Total: ₱{cat.total.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mb-2">{cat.remark}</p>
                <ul className="list-disc list-inside text-gray-800 text-sm">
                  {cat.transactions.map((t, i) => (
                    <li key={i}>{typeof t.date === 'string' ? t.date : t.date?.toLocaleDateString?.() || String(t.date)} - {t.merchant}: ₱{t.amount.toLocaleString()} ({t.type})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </RetroWindow>
      </div>

      {/* Transactions Table */}
      <div className="mb-8">
        <RetroWindow title="All Transactions" className="border-cyan-400">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-900">
              <thead>
                <tr className="bg-cyan-100 text-cyan-900">
                  <th className="px-2 py-1">Date</th>
                  <th className="px-2 py-1">Merchant</th>
                  <th className="px-2 py-1">Category</th>
                  <th className="px-2 py-1">Amount</th>
                  <th className="px-2 py-1">Type</th>
                  <th className="px-2 py-1">Remark</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i} className="border-b border-cyan-200">
                    <td className="px-2 py-1 whitespace-nowrap text-gray-900">{typeof t.date === 'string' ? t.date : t.date?.toLocaleDateString?.() || String(t.date)}</td>
                    <td className="px-2 py-1 whitespace-nowrap text-gray-900">{t.merchant}</td>
                    <td className="px-2 py-1 whitespace-nowrap text-gray-900">{t.category}</td>
                    <td className="px-2 py-1 whitespace-nowrap text-gray-900">₱{t.amount.toLocaleString()}</td>
                    <td className="px-2 py-1 whitespace-nowrap text-gray-900">{t.type}</td>
                    <td className="px-2 py-1 whitespace-nowrap text-gray-900">{t.remark || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RetroWindow>
      </div>
    </div>
  );
} 