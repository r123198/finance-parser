export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'reward' | 'fee';
  category: string;
  merchant: string;
  remark?: string;
  rawData?: Record<string, any>;
}

export interface StatementFile {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'xls';
  uploadDate: Date;
  transactions: Transaction[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  monthlyTrend: {
    month: string;
    income: number;
    expenses: number;
  }[];
}

export interface CategoryAnalysis {
  category: string;
  total: number;
  transactions: Transaction[];
  remark: string;
}

export interface SummaryAnalysis {
  totalSpending: number;
  totalIncome: number;
  totalRewards: number;
  totalFees: number;
  highestExpense: Transaction;
  lowestExpense: Transaction;
  highestIncome: Transaction;
  lowestIncome: Transaction;
  averageDailySpending: number;
  uniqueMerchantCount: number;
}

export interface ChartData {
  pieChart: {
    labels: string[];
    data: number[];
  };
  lineChart: {
    labels: string[];
    data: number[];
  };
  barChart: {
    labels: string[];
    data: number[];
  };
  donutChart: {
    labels: string[];
    data: number[];
  };
}

export interface StatementAnalysis {
  summary: SummaryAnalysis;
  categories: CategoryAnalysis[];
  transactions: Transaction[];
  charts: ChartData;
  observations: {
    duplicateMerchants: string[];
    recurringPayments: string[];
    anomalies: string[];
    suggestions: string[];
  };
}

export interface FileUploadResponse {
  success: boolean;
  message: string;
  fileId?: string;
  analysis?: StatementAnalysis;
  error?: string;
} 