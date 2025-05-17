import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File, Fields, Files } from 'formidable';
import type { FileUploadResponse, StatementAnalysis } from '@/types';
import pdfParse from 'pdf-parse';
import fs from 'fs';

// Use a string property on globalThis for transaction storage
const TRANSACTION_STORE = '__parsedTransactions';
declare global {
  // eslint-disable-next-line no-var
  var __parsedTransactions: StatementAnalysis | undefined;
}

// Helper: Extract text from PDF
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      if (file.filepath) {
        const stream = fs.createReadStream(file.filepath);
        stream.on('data', (chunk: string | Buffer) => {
          if (Buffer.isBuffer(chunk)) {
            chunks.push(chunk);
          } else {
            chunks.push(Buffer.from(chunk));
          }
        });
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      } else {
        reject(new Error('No filepath for file'));
      }
    });

    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is not corrupted.');
  }
}

// Helper: Prepare prompt for LLM
function buildLLMPrompt(fileName: string, textContent: string): string {
  return `You are a financial analyst AI that receives a Statement of Account (SOA) text content. First, check if the text contains keywords such as 'Transaction History', 'Statement of Account', 'Account Number', 'Transaction Date', 'Merchant', and a list of transactions. 

If the text does NOT contain these, respond with: ❌ Error: The uploaded file is not a valid Statement of Account. Please upload a document that contains transaction history or financial account data.

If the text is valid, perform the following tasks:

1. Summary Analysis:
- Calculate total spending
- Calculate total income, cashback/rewards, and interest/fees (if available)
- Identify the highest and lowest transactions for both expense and income
- Compute average daily spending
- Count the number of unique merchants

2. Breakdown by Category:
- Assign appropriate categories (e.g., Food & Dining, Transport, Subscriptions, Entertainment, Cashback/Rewards, Interest/Fees)
- List all transactions under each category
- Provide the total amount per category
- Add a short remark for each category (e.g., 'Dining is unusually high this month.')

3. Transaction Listing:
- Present transactions in a table format with columns: Date, Merchant, Category, Amount, Type (Expense/Income/Reward/Fee), Remark

4. Chart Data Output:
Prepare chart-ready JSON data for:
- Pie Chart (Spending per Category)
- Line Chart (Daily Spending Over Time)
- Bar Chart (Top 5 Merchants by Spending)
- Donut Chart (Proportion of Expenses, Income, Fees)

5. Optional Observations:
- Detect duplicate or frequent merchants
- Highlight subscriptions or recurring payments
- Identify anomalies or spikes in spending
- Offer budgeting suggestions

Text content:
${textContent}

Respond with a JSON object containing all the analysis data in the following structure:
{
  "summary": {
    "totalSpending": number,
    "totalIncome": number,
    "totalRewards": number,
    "totalFees": number,
    "highestExpense": Transaction,
    "lowestExpense": Transaction,
    "highestIncome": Transaction,
    "lowestIncome": Transaction,
    "averageDailySpending": number,
    "uniqueMerchantCount": number
  },
  "categories": [
    {
      "category": string,
      "total": number,
      "transactions": Transaction[],
      "remark": string
    }
  ],
  "transactions": Transaction[],
  "charts": {
    "pieChart": { "labels": string[], "data": number[] },
    "lineChart": { "labels": string[], "data": number[] },
    "barChart": { "labels": string[], "data": number[] },
    "donutChart": { "labels": string[], "data": number[] }
  },
  "observations": {
    "duplicateMerchants": string[],
    "recurringPayments": string[],
    "anomalies": string[],
    "suggestions": string[]
  }
}`;
}

// Real DeepSeek LLM call
async function callLLM(prompt: string): Promise<StatementAnalysis> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('DeepSeek API key is not configured');
    throw new Error('AI processing is not configured. Please contact the administrator.');
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { 
          role: 'system', 
          content: 'You are a financial analyst AI specialized in analyzing bank statements and transaction data. You must validate if the input is a valid Statement of Account before processing. Return only valid JSON without any markdown formatting or code blocks.' 
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    throw new Error('DeepSeek API error: ' + (await response.text()));
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content from DeepSeek');

  console.log('Raw LLM response:', content);

  // Check if the response indicates an invalid statement
  if (content.includes('❌ Error:') || 
      content.toLowerCase().includes('not a valid statement') || 
      content.toLowerCase().includes('invalid statement')) {
    throw new Error('The uploaded file is not a valid Statement of Account. Please upload a document that contains transaction history or financial account data.');
  }

  try {
    // Clean the response by removing markdown code blocks if present
    const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    
    // Try to parse the JSON
    const analysis = JSON.parse(cleanedContent);
    
    // Validate the analysis structure
    if (!analysis.summary || !analysis.categories || !analysis.transactions || !analysis.charts || !analysis.observations) {
      throw new Error('Invalid analysis structure');
    }

    return analysis;
  } catch (e) {
    console.error('JSON parsing error:', e);
    console.error('Attempted to parse:', content);
    throw new Error('Failed to parse AI response. Please try again.');
  }
}

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FileUploadResponse | StatementAnalysis>
) {
  if (req.method === 'GET') {
    const analysis = globalThis[TRANSACTION_STORE];
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'No analysis data found',
      });
    }
    return res.status(200).json(analysis);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    console.log('File details:', {
      name: file.originalFilename,
      type: file.mimetype,
      size: file.size,
      filepath: file.filepath
    });

    // Extract text from PDF
    const textContent = await extractTextFromPDF(file);

    // Prepare prompt and call LLM
    const prompt = buildLLMPrompt(file.originalFilename || 'unknown', textContent);
    const analysis = await callLLM(prompt);

    // Check for valid transactions
    if (!analysis.transactions || analysis.transactions.length === 0) {
      return res.status(422).json({
        success: false,
        message: 'No valid transactions found in the uploaded file.',
      });
    }

    // Store analysis in a simple in-memory store (for demo)
    globalThis[TRANSACTION_STORE] = analysis;

    return res.status(200).json({
      success: true,
      message: 'File uploaded and analyzed successfully',
      fileId: 'mock-file-id',
      analysis,
    });
  } catch (error) {
    console.error('Error processing file upload:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process file',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 