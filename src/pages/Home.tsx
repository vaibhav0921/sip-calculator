import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
type ChartPoint = {
  year: number;
  invested: number;
  maturityValue: number;
};
// Utility function to format currency in INR
const formatINR = (amount: number) => {
  return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

// SIP Calculation utility
const calculateSIP = (monthlyAmount: number, years: number, annualReturn: number) => {
  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;

  if (monthlyRate === 0) {
    return monthlyAmount * months;
  }

  const futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  return futureValue;
};

// Generate chart data for investment growth
const generateChartData = (monthlyAmount: number, years: number, annualReturn: number) => {
  const data = [];
  const monthlyRate = annualReturn / 12 / 100;

  for (let year = 0; year <= years; year++) {
    const months = year * 12;
    const invested = monthlyAmount * months;
    let maturityValue = 0;

    if (monthlyRate === 0) {
      maturityValue = invested;
    } else {
      maturityValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    }

    data.push({
      year,
      invested,
      maturityValue: Math.round(maturityValue)
    });
  }

  return data;
};

// Fund categories with expected return ranges
const fundCategories = [
  { name: 'Large Cap', minReturn: 10, maxReturn: 12, defaultReturn: 11 },
  { name: 'Mid Cap', minReturn: 12, maxReturn: 14, defaultReturn: 13 },
  { name: 'Small Cap', minReturn: 14, maxReturn: 16, defaultReturn: 15 },
  { name: 'Index Fund', minReturn: 10, maxReturn: 12, defaultReturn: 11 },
  { name: 'Hybrid Fund', minReturn: 8, maxReturn: 10, defaultReturn: 9 }
];

// AdSense Component
type AdSenseProps = {
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
};

const AdSenseUnit: React.FC<AdSenseProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  style = {}
}) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle && import.meta.env.PROD) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '20px 0', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense client ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

const Home = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState(fundCategories[0]);
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(fundCategories[0].defaultReturn);
  const [results, setResults] = useState({
    totalInvested: 0,
    maturityValue: 0,
    totalGains: 0
  });
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = fundCategories.find(
      cat => cat.name === e.target.value
    );

    if (category) {
      setSelectedCategory(category);
      setExpectedReturn(category.defaultReturn);
    }
  };

  // Calculate results whenever inputs change
  useEffect(() => {
    const totalInvested = monthlyAmount * years * 12;
    const maturityValue = calculateSIP(monthlyAmount, years, expectedReturn);
    const totalGains = maturityValue - totalInvested;

    setResults({
      totalInvested,
      maturityValue,
      totalGains
    });

    // Generate chart data
    const data = generateChartData(monthlyAmount, years, expectedReturn);
    setChartData(data);
  }, [monthlyAmount, years, expectedReturn]);

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Smart SIP Return Estimator",
    "description": "Free online SIP calculator to estimate mutual fund returns. Calculate returns for Large Cap, Mid Cap, Small Cap, Index Funds, and Hybrid Funds with interactive charts.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "featureList": [
      "SIP Calculator",
      "Mutual Fund Return Estimator",
      "Investment Planning Tool",
      "Large Cap Fund Calculator",
      "Mid Cap Fund Calculator",
      "Small Cap Fund Calculator"
    ]
  };

  // Set document title and meta tags on mount
  useEffect(() => {
    // Set page title
    document.title = "SIP Calculator 2025 - Free Mutual Fund Returns Calculator Online | Smart SIP Estimator";

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Calculate your SIP returns instantly with our free online calculator. Estimate mutual fund returns for Large Cap, Mid Cap, Small Cap, Index, and Hybrid funds. Plan your investments with accurate projections.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Calculate your SIP returns instantly with our free online calculator. Estimate mutual fund returns for Large Cap, Mid Cap, Small Cap, Index, and Hybrid funds. Plan your investments with accurate projections.";
      document.head.appendChild(meta);
    }

    // Set meta keywords
    let metaKeywords = document.querySelector<HTMLMetaElement>(
      'meta[name="keywords"]'
    );

    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }

    metaKeywords.content =
      'SIP calculator, mutual fund calculator, SIP returns, investment calculator, large cap funds, mid cap funds, small cap funds, index funds, hybrid funds, SIP investment, systematic investment plan';
    // Add structured data script
    const script = document.createElement('script');
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Add AdSense script
    const adsenseScript = document.createElement('script');
    adsenseScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX";
    adsenseScript.async = true;
    adsenseScript.crossOrigin = "anonymous";
    document.head.appendChild(adsenseScript);

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header with semantic HTML */}
        <header className="bg-white shadow-sm" role="banner">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Smart SIP Return Estimator - Free Mutual Fund Calculator 2025
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Calculate SIP returns for Large Cap, Mid Cap, Small Cap, Index & Hybrid Funds
            </p>
          </div>
        </header>

        {/* Top AdSense Unit - Horizontal Banner */}
        <AdSenseUnit
          slot="1234567890"
          format="horizontal"
          style={{ minHeight: '90px' }}
        />

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8" role="main">
          {/* Breadcrumb for SEO */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex text-sm text-gray-600" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <a href="/" itemProp="item" className="hover:text-blue-600">
                  <span itemProp="name">Home</span>
                </a>
                <meta itemProp="position" content="1" />
              </li>
              <li className="mx-2">/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name" className="text-gray-900">SIP Calculator</span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </nav>

          {/* Introduction Section for SEO */}
          <article className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Calculate Your Mutual Fund SIP Returns Online
            </h2>
            <p className="text-gray-600 mb-3">
              Our free SIP calculator helps you estimate potential returns from your systematic investment plan (SIP) in mutual funds.
              Whether you're investing in large cap funds, mid cap funds, small cap funds, index funds, or hybrid funds,
              get accurate projections based on historical return patterns.
            </p>
            <p className="text-gray-600">
              Use this tool to plan your long-term wealth creation strategy and understand how regular monthly investments
              can grow through the power of compounding.
            </p>
          </article>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Input Section */}
            <section className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Enter Your Investment Details
              </h2>

              {/* Mutual Fund Category */}
              <div className="mb-6">
                <label htmlFor="fund-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Mutual Fund Category
                </label>
                <select
                  id="fund-category"
                  name="fund-category"
                  value={selectedCategory.name}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select mutual fund category"
                >
                  {fundCategories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name} ({category.minReturn}–{category.maxReturn}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly SIP Amount */}
              <div className="mb-6">
                <label htmlFor="monthly-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly SIP Amount (₹)
                </label>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">₹</span>
                  <input
                    id="monthly-amount"
                    name="monthly-amount"
                    type="number"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                    min="500"
                    step="500"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Monthly SIP investment amount"
                  />
                </div>
                <input
                  type="range"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  min="500"
                  max="100000"
                  step="500"
                  className="w-full mt-2"
                  aria-label="Monthly amount slider"
                />
              </div>

              {/* Investment Duration */}
              <div className="mb-6">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Duration: {years} Years
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="range"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  min="1"
                  max="30"
                  className="w-full"
                  aria-label="Investment duration in years"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>

              {/* Expected Return */}
              <div className="mb-6">
                <label htmlFor="expected-return" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Annual Return: {expectedReturn}%
                </label>
                <input
                  id="expected-return"
                  name="expected-return"
                  type="range"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  min={selectedCategory.minReturn}
                  max={selectedCategory.maxReturn}
                  step="0.1"
                  className="w-full"
                  aria-label="Expected annual return percentage"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{selectedCategory.minReturn}%</span>
                  <span>{selectedCategory.maxReturn}%</span>
                </div>
              </div>
            </section>

            {/* Sidebar Ad Space */}
            <aside className="lg:col-span-1">
              {/* Results Section */}
              <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Your Estimated Returns
                </h2>

                <div className="space-y-4">
                  {/* Total Invested */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Invested Amount</p>
                    <p className="text-2xl font-bold text-blue-600">{formatINR(results.totalInvested)}</p>
                  </div>

                  {/* Estimated Maturity Value */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Estimated Maturity Value</p>
                    <p className="text-2xl font-bold text-green-600">{formatINR(results.maturityValue)}</p>
                  </div>

                  {/* Total Gains */}
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Gains</p>
                    <p className="text-2xl font-bold text-indigo-600">{formatINR(results.totalGains)}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Monthly Investment</p>
                      <p className="font-semibold text-gray-800">{formatINR(monthlyAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-800">{years} years</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sidebar AdSense Unit - Vertical */}
              <AdSenseUnit
                slot="0987654321"
                format="vertical"
                style={{ minHeight: '600px' }}
              />
            </aside>
          </div>

          {/* Middle AdSense Unit - In-feed */}
          <AdSenseUnit
            slot="1122334455"
            format="fluid"
            style={{ minHeight: '250px', marginTop: '32px' }}
          />

          {/* Chart Section */}
          <section className="bg-white rounded-lg shadow-md p-6 mt-8" aria-labelledby="chart-heading">
            <h2 id="chart-heading" className="text-2xl font-semibold text-gray-800 mb-6">
              SIP Investment Growth Projection Chart
            </h2>
            <p className="text-gray-600 mb-4">
              Visualize how your SIP investment grows over time with compound interest.
              The blue line shows your total investment, while the green line shows projected maturity value.
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    tickFormatter={(value: number) =>
                      '₹' + (value / 100000).toFixed(0) + 'L'
                    }
                  />
                  <Tooltip
                    formatter={(value?: string | number) => {
                      if (typeof value === 'number') {
                        return formatINR(value);
                      }
                      return value ?? '';
                    }}
                    labelFormatter={(label?: string | number) =>
                      label !== undefined ? `Year ${label}` : ''
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="invested"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Total Invested"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="maturityValue"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Maturity Value"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Educational Section - Rich Content for SEO */}
          <article className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Complete Guide to SIP Investments in India
            </h2>

            <div className="prose max-w-none space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  What is SIP (Systematic Investment Plan)?
                </h3>
                <p className="text-gray-600">
                  A Systematic Investment Plan (SIP) is a smart investment strategy where you invest a fixed amount regularly
                  (monthly, quarterly, or annually) in mutual funds. It's like setting up a recurring deposit for wealth creation.
                  SIP helps in building financial discipline and leverages the power of rupee cost averaging to reduce market timing risks.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  How Does SIP Work?
                </h3>
                <p className="text-gray-600 mb-2">
                  When you invest through SIP, a fixed amount is automatically debited from your bank account and invested
                  in your chosen mutual fund scheme. You get units allocated based on the NAV (Net Asset Value) on that day.
                  The formula used to calculate SIP returns is:
                </p>
                <p className="text-gray-600 bg-gray-50 p-4 rounded font-mono text-sm">
                  FV = P × [((1 + r)^n − 1) / r] × (1 + r)
                  <br />
                  Where: P = Monthly investment, r = Monthly rate of return, n = Number of months
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  Types of Mutual Fund Categories for SIP
                </h3>

                <h4 className="text-lg font-semibold text-gray-700 mt-3 mb-2">
                  1. Large Cap Funds (10-12% Expected Returns)
                </h4>
                <p className="text-gray-600 mb-3">
                  Large cap mutual funds invest primarily in the top 100 companies by market capitalization.
                  These are established blue-chip companies like TCS, Reliance, HDFC Bank, and Infosys.
                  Large cap funds offer relatively stable returns with lower volatility, making them ideal for conservative investors.
                </p>

                <h4 className="text-lg font-semibold text-gray-700 mt-3 mb-2">
                  2. Mid Cap Funds (12-14% Expected Returns)
                </h4>
                <p className="text-gray-600 mb-3">
                  Mid cap funds invest in companies ranked 101-250 by market capitalization. These are growth-stage companies
                  with higher potential for expansion. Mid cap funds offer a balance between risk and return,
                  suitable for investors with moderate risk appetite and 5-7 year investment horizon.
                </p>

                <h4 className="text-lg font-semibold text-gray-700 mt-3 mb-2">
                  3. Small Cap Funds (14-16% Expected Returns)
                </h4>
                <p className="text-gray-600 mb-3">
                  Small cap mutual funds invest in companies ranked 251 onwards. These are emerging businesses with
                  high growth potential but also higher risk. Small cap funds can deliver superior returns in bull markets
                  but are suitable only for aggressive investors with long-term horizons (7-10 years+).
                </p>

                <h4 className="text-lg font-semibold text-gray-700 mt-3 mb-2">
                  4. Index Funds (10-12% Expected Returns)
                </h4>
                <p className="text-gray-600 mb-3">
                  Index funds are passive mutual funds that replicate market indices like Nifty 50 or Sensex.
                  They offer low expense ratios (typically 0.1-0.5%) and provide market-linked returns.
                  Index funds are ideal for investors who believe in long-term market growth and want cost-effective investing.
                </p>

                <h4 className="text-lg font-semibold text-gray-700 mt-3 mb-2">
                  5. Hybrid Funds (8-10% Expected Returns)
                </h4>
                <p className="text-gray-600 mb-3">
                  Hybrid funds (also called balanced funds) invest in both equity and debt instruments.
                  The typical allocation is 60-70% equity and 30-40% debt. These funds offer balanced risk-return profile
                  and are suitable for moderate investors seeking stability with growth potential.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  Benefits of SIP Investment
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Disciplined Investing:</strong> Automates your savings and investment process</li>
                  <li><strong>Rupee Cost Averaging:</strong> Buy more units when markets are down, fewer when up</li>
                  <li><strong>Power of Compounding:</strong> Returns generate returns over long periods</li>
                  <li><strong>Flexibility:</strong> Start with as low as ₹500 per month</li>
                  <li><strong>No Market Timing:</strong> Eliminates the need to time the market perfectly</li>
                  <li><strong>Goal-based Planning:</strong> Align investments with financial goals</li>
                  <li><strong>Tax Benefits:</strong> ELSS SIPs offer tax deduction under Section 80C</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  How to Choose the Right SIP?
                </h3>
                <p className="text-gray-600 mb-2">Consider these factors:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Investment Goal:</strong> Retirement, child education, home purchase, etc.</li>
                  <li><strong>Time Horizon:</strong> Short-term (1-3 years), medium-term (3-5 years), long-term (5+ years)</li>
                  <li><strong>Risk Appetite:</strong> Conservative, moderate, or aggressive</li>
                  <li><strong>Fund Performance:</strong> Check 3-5 year historical returns</li>
                  <li><strong>Expense Ratio:</strong> Lower is better (below 1.5% for equity funds)</li>
                  <li><strong>Fund Manager Track Record:</strong> Experience and consistency matter</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  SIP vs Lump Sum Investment
                </h3>
                <p className="text-gray-600">
                  While lump sum investment can work well in bullish markets, SIP is generally preferred for most investors
                  as it reduces timing risk, builds discipline, and works well in volatile markets. SIP is particularly
                  beneficial for salaried individuals who receive monthly income.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  Tax Implications of SIP
                </h3>
                <p className="text-gray-600">
                  Equity mutual fund gains held for more than 1 year are taxed at 12.5% (LTCG).
                  Short-term gains (less than 1 year) are taxed at 20% (STCG).
                  Debt fund gains are taxed as per your income tax slab. ELSS funds offer tax deduction up to ₹1.5 lakh
                  under Section 80C with a 3-year lock-in period.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                  Common SIP Mistakes to Avoid
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Stopping SIP during market downturns (best time to accumulate units)</li>
                  <li>Choosing funds based only on recent past performance</li>
                  <li>Not aligning SIP with financial goals</li>
                  <li>Ignoring expense ratios and exit loads</li>
                  <li>Investing without understanding fund strategy</li>
                  <li>Not reviewing portfolio annually</li>
                </ul>
              </section>
            </div>
          </article>

          {/* FAQ Section for SEO */}
          <section className="bg-white rounded-lg shadow-md p-6 mt-8" itemScope itemType="https://schema.org/FAQPage">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="space-y-6">
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-lg font-semibold text-gray-800" itemProp="name">
                  What is the minimum amount to start SIP?
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-gray-600 mt-2" itemProp="text">
                    Most mutual funds in India allow you to start SIP with as low as ₹500 per month.
                    However, some funds may have higher minimums like ₹1,000 or ₹5,000.
                  </p>
                </div>
              </div>

              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-lg font-semibold text-gray-800" itemProp="name">
                  Can I stop or pause my SIP?
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-gray-600 mt-2" itemProp="text">
                    Yes, you can stop or pause your SIP anytime except for ELSS funds which have a 3-year lock-in period.
                    However, it's advisable to continue SIP even during market downturns for better long-term returns.
                  </p>
                </div>
              </div>

              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-lg font-semibold text-gray-800" itemProp="name">
                  Which is better: monthly or weekly SIP?
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-gray-600 mt-2" itemProp="text">
                    Monthly SIP is more popular and convenient for salaried individuals. Weekly SIP offers better rupee cost averaging
                    but the difference in returns is marginal. Choose based on your cash flow convenience.
                  </p>
                </div>
              </div>

              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-lg font-semibold text-gray-800" itemProp="name">
                  How accurate is this SIP calculator?
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-gray-600 mt-2" itemProp="text">
                    Our calculator uses standard SIP formula and provides accurate projections based on your inputs.
                    However, actual returns depend on market performance and may vary. Past returns don't guarantee future results.
                  </p>
                </div>
              </div>

              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-lg font-semibold text-gray-800" itemProp="name">
                  Is SIP safe for beginners?
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-gray-600 mt-2" itemProp="text">
                    Yes, SIP is ideal for beginners as it promotes disciplined investing, requires small amounts,
                    and reduces market timing risk through rupee cost averaging. Start with large cap or index funds for lower risk.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom AdSense Unit - Multiplex */}
          <AdSenseUnit
            slot="5566778899"
            format="autorelaxed"
            style={{ minHeight: '300px', marginTop: '32px' }}
          />

          {/* Disclaimer */}
          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8" role="complementary">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Important Disclaimer</h3>
            <p className="text-sm text-gray-700">
              <strong>Investment Risks:</strong> Mutual fund investments are subject to market risks.
              This calculator is for educational and informational purposes only and does not constitute investment advice.
              Past performance does not guarantee future results. The projected returns are based on assumed rates
              and actual returns may vary significantly. Please read all scheme-related documents carefully and
              consult with a SEBI-registered financial advisor before making investment decisions.
            </p>
          </section>

          {/* Related Tools - Internal Linking for SEO */}
          <section className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Related Financial Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/incometax-calculator" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800">IncomeTax Calculator</h3>
                <p className="text-sm text-gray-600 mt-1">Calculate one-time investment returns</p>
              </a>
              <a href="/retirement-calculator" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800">Retirement Calculator</h3>
                <p className="text-sm text-gray-600 mt-1">Plan your retirement corpus</p>
              </a>
              <a href="/tax-calculator" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800">Tax Calculator</h3>
                <p className="text-sm text-gray-600 mt-1">Calculate tax on mutual fund gains</p>
              </a>
            </div>
          </section>
        </main>

        {/* Footer with semantic HTML */}
        <footer className="bg-white border-t border-gray-200 mt-12" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">About Us</h3>
                <p className="text-sm text-gray-600">
                  Free online SIP calculator to help investors plan their mutual fund investments
                  and estimate potential returns across different fund categories.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><a href="/about" className="hover:text-blue-600">About</a></li>
                  <li><a href="/privacy-policy" className="hover:text-blue-600">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-blue-600">Terms of Use</a></li>
                  <li><a href="/contact" className="hover:text-blue-600">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Disclaimer</h3>
                <p className="text-xs text-gray-600">
                  We are not SEBI registered advisors. This tool is for educational purposes only.
                  Please consult a certified financial advisor before investing.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <p className="text-center text-sm text-gray-600">
                © 2025 Smart SIP Return Estimator. All rights reserved. Made in India 🇮🇳
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;