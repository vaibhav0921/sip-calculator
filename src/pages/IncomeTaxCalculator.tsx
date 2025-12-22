import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, TrendingDown, FileText, PieChart, Info } from 'lucide-react';
const STANDARD_DEDUCTION = 75000;
const MAX_INCOME = 10_000_000_000_000;
interface TaxInputs {
  annualIncome: number | '';
}

const TaxCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<TaxInputs>({
    annualIncome: '',

  });

  const handleIncomeChange = (value: string) => {
    if (value === "") {
      setInputs({ annualIncome: "" });
      return;
    }

    const num = Number(value);

    if (isNaN(num)) return;

    // 🚫 Prevent negative & above 10 trillion
    if (num < 0 || num > MAX_INCOME) return;

    setInputs({ annualIncome: num });
  };


  const results = useMemo(() => {
    if (inputs.annualIncome === '') {
      return null;
    }

    const annualIncome = Number(inputs.annualIncome);



    const taxableIncome = Math.max(0, annualIncome - STANDARD_DEDUCTION);

    // New Tax Regime Slabs for FY 2024-25
    let tax = 0;

    if (taxableIncome <= 300000) {
      tax = 0;
    } else if (taxableIncome <= 700000) {
      tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 20000 + (taxableIncome - 700000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      tax = 50000 + (taxableIncome - 1000000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      tax = 80000 + (taxableIncome - 1200000) * 0.20;
    } else {
      tax = 140000 + (taxableIncome - 1500000) * 0.30;
    }

    // Health and Education Cess (4%)
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    // Calculate rebate under Section 87A (if applicable)
    let rebate = 0;
    if (taxableIncome <= 700000) {
      rebate = Math.min(totalTax, 25000);
    }

    const finalTax = totalTax - rebate;
    const monthlyTax = finalTax / 12;
    const takeHomeAnnual = annualIncome - finalTax;
    const takeHomeMonthly = takeHomeAnnual / 12;
    const effectiveTaxRate = (finalTax / annualIncome) * 100;

    // Calculate tax breakdown by slab
    const slabs = [];

    if (taxableIncome > 0) {
      slabs.push({
        range: '₹0 - ₹3,00,000',
        rate: '0%',
        income: Math.min(taxableIncome, 300000),
        tax: 0
      });
    }

    if (taxableIncome > 300000) {
      const slabIncome = Math.min(taxableIncome - 300000, 400000);
      slabs.push({
        range: '₹3,00,001 - ₹7,00,000',
        rate: '5%',
        income: slabIncome,
        tax: slabIncome * 0.05
      });
    }

    if (taxableIncome > 700000) {
      const slabIncome = Math.min(taxableIncome - 700000, 300000);
      slabs.push({
        range: '₹7,00,001 - ₹10,00,000',
        rate: '10%',
        income: slabIncome,
        tax: slabIncome * 0.10
      });
    }

    if (taxableIncome > 1000000) {
      const slabIncome = Math.min(taxableIncome - 1000000, 200000);
      slabs.push({
        range: '₹10,00,001 - ₹12,00,000',
        rate: '15%',
        income: slabIncome,
        tax: slabIncome * 0.15
      });
    }

    if (taxableIncome > 1200000) {
      const slabIncome = Math.min(taxableIncome - 1200000, 300000);
      slabs.push({
        range: '₹12,00,001 - ₹15,00,000',
        rate: '20%',
        income: slabIncome,
        tax: slabIncome * 0.20
      });
    }

    if (taxableIncome > 1500000) {
      const slabIncome = taxableIncome - 1500000;
      slabs.push({
        range: '₹15,00,001 and above',
        rate: '30%',
        income: slabIncome,
        tax: slabIncome * 0.30
      });
    }

    return {
      taxableIncome,
      baseTax: tax,
      cess,
      totalTax,
      rebate,
      finalTax,
      monthlyTax,
      takeHomeAnnual,
      takeHomeMonthly,
      effectiveTaxRate,
      slabs,
    };
  }, [inputs]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* SEO Optimized Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calculator className="w-10 h-10 text-emerald-600" aria-hidden="true" />
            <h1 className="text-4xl font-bold text-gray-800">
              Income Tax Calculator India 2024-25
            </h1>
          </div>
          <p className="text-gray-600 text-lg mb-2">
            Calculate Income Tax Online - New Tax Regime FY 2024-25 (AY 2025-26)
          </p>
          <p className="text-sm text-gray-500 max-w-3xl mx-auto">
            Free online income tax calculator for salaried employees in India. Calculate your tax liability under the new tax regime with standard deduction, Section 87A rebate, and health & education cess for Financial Year 2024-25.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
              <FileText className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              Income Details
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="annual-income" className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Income (₹)
                </label>
                <input
                  id="annual-income"
                  name="annual-income"
                  type="number"
                  min="0"
                  value={inputs.annualIncome}
                  onChange={(e) => handleIncomeChange(e.target.value)}
                  placeholder="Enter your annual gross salary"
                  aria-label="Enter annual income in rupees"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="standard-deduction" className="block text-sm font-medium text-gray-700 mb-1">
                  Standard Deduction (₹)
                </label>
                <input
                  id="standard-deduction"
                  name="standard-deduction"
                  type="number"
                  min="0"
                  value={STANDARD_DEDUCTION}
                  // onChange={(e) => handleChange('standardDeduction', e.target.value)}
                  aria-label="Standard deduction amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Default: ₹75,000 for salaried individuals as per Budget 2023</p>
              </div>
            </div>

            {/* Tax Slabs Info */}
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <h3 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" aria-hidden="true" />
                Income Tax Slabs 2024-25 - New Regime
              </h3>
              <div className="space-y-2 text-xs text-emerald-900">
                <div className="flex justify-between">
                  <span>Up to ₹3 Lakhs</span>
                  <span className="font-semibold">Nil (0%)</span>
                </div>
                <div className="flex justify-between">
                  <span>₹3 - ₹7 Lakhs</span>
                  <span className="font-semibold">5%</span>
                </div>
                <div className="flex justify-between">
                  <span>₹7 - ₹10 Lakhs</span>
                  <span className="font-semibold">10%</span>
                </div>
                <div className="flex justify-between">
                  <span>₹10 - ₹12 Lakhs</span>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>₹12 - ₹15 Lakhs</span>
                  <span className="font-semibold">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Above ₹15 Lakhs</span>
                  <span className="font-semibold">30%</span>
                </div>
              </div>
              <p className="text-xs text-emerald-700 mt-3 pt-3 border-t border-emerald-300">
                Plus 4% Health & Education Cess on income tax amount
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {!results ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Calculate Your Income Tax</h3>
                <p className="text-gray-500">Enter your annual salary to instantly calculate tax liability, take-home salary, and effective tax rate</p>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <article className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold uppercase opacity-90">Total Tax Payable</h3>
                      <DollarSign className="w-6 h-6 opacity-75" aria-hidden="true" />
                    </div>
                    <div className="text-4xl font-bold mb-1">
                      {formatCurrency(results.finalTax)}
                    </div>
                    <div className="text-sm opacity-90">
                      {formatCurrency(results.monthlyTax)} per month (TDS deduction)
                    </div>
                  </article>

                  <article className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold uppercase opacity-90">Net Take Home Salary</h3>
                      <TrendingDown className="w-6 h-6 opacity-75" aria-hidden="true" />
                    </div>
                    <div className="text-4xl font-bold mb-1">
                      {formatCurrency(results.takeHomeAnnual)}
                    </div>
                    <div className="text-sm opacity-90">
                      {formatCurrency(results.takeHomeMonthly)} per month (in-hand salary)
                    </div>
                  </article>
                </div>

                {/* Tax Breakdown */}
                <section className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                    <PieChart className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    Detailed Tax Calculation Breakdown
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Gross Annual Salary Income</span>
                      <span className="text-gray-900 font-bold">{formatCurrency(Number(inputs.annualIncome))}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Less: Standard Deduction u/s 16</span>
                      <span className="text-blue-600 font-bold">- {formatCurrency(STANDARD_DEDUCTION)}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Net Taxable Income</span>
                      <span className="text-purple-600 font-bold">{formatCurrency(results.taxableIncome)}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Income Tax (as per slabs)</span>
                      <span className="text-orange-600 font-bold">{formatCurrency(results.baseTax)}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Add: Health & Education Cess @ 4%</span>
                      <span className="text-red-600 font-bold">+ {formatCurrency(results.cess)}</span>
                    </div>

                    {results.rebate > 0 && (
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700 font-medium">Less: Tax Rebate u/s 87A</span>
                        <span className="text-green-600 font-bold">- {formatCurrency(results.rebate)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center p-3 bg-emerald-100 rounded-lg border-2 border-emerald-500">
                      <span className="text-gray-800 font-bold">Net Tax Payable (Annual)</span>
                      <span className="text-emerald-600 font-bold text-xl">{formatCurrency(results.finalTax)}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="text-gray-700 font-medium">Effective Tax Rate (ETR)</span>
                      <span className="text-gray-900 font-bold">{results.effectiveTaxRate.toFixed(2)}%</span>
                    </div>
                  </div>
                </section>

                {/* Slab-wise Breakdown */}
                <section className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                    <FileText className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    Income Tax Slab-wise Calculation
                  </h2>

                  <div className="space-y-2">
                    {results.slabs.map((slab, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">{slab.range}</div>
                          <div className="text-xs text-gray-600">Taxable Income: {formatCurrency(slab.income)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-emerald-600">Tax Rate: {slab.rate}</div>
                          <div className="text-xs text-gray-600">Tax Amount: {formatCurrency(slab.tax)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Important Notes */}
                <aside className="bg-amber-50 rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" aria-hidden="true" />
                    Key Points About New Tax Regime 2024-25
                  </h3>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold" aria-hidden="true">•</span>
                      <span>New tax regime is the default option from FY 2023-24. No need to opt-in separately for salary income.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold" aria-hidden="true">•</span>
                      <span>Standard deduction of ₹75,000 is now available under new regime (introduced in Budget 2023).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold" aria-hidden="true">•</span>
                      <span>Section 87A rebate: Income up to ₹7 lakhs gets full tax rebate of up to ₹25,000 (effectively zero tax).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold" aria-hidden="true">•</span>
                      <span>No deductions allowed: 80C (PPF, ELSS, insurance), 80D (health insurance), HRA, LTA not available in new regime.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold" aria-hidden="true">•</span>
                      <span>You can still opt for old tax regime if you have significant deductions under 80C, 80D, home loan interest etc.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 font-bold" aria-hidden="true">•</span>
                      <span>This calculator provides estimated tax. Please consult a chartered accountant (CA) or tax advisor for ITR filing.</span>
                    </li>
                  </ul>
                </aside>

                {/* SEO Content Section */}
                <article className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">How to Use This Income Tax Calculator</h2>
                  <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
                    <p>
                      Our free online income tax calculator helps you calculate your tax liability under the new tax regime for FY 2024-25 (Assessment Year 2025-26). Simply enter your gross annual salary and get instant results including your net tax payable, monthly TDS deduction, and in-hand salary.
                    </p>
                    <p>
                      <strong>What is New Tax Regime?</strong> The new income tax regime, made default from April 2023, offers lower tax rates but doesn't allow most deductions like Section 80C, 80D, HRA etc. However, it now includes a standard deduction of ₹75,000 for salaried individuals.
                    </p>
                    <p>
                      <strong>Who should use New Tax Regime?</strong> If your total deductions under old regime (80C, 80D, HRA, home loan interest) are less than ₹2.5 lakhs, the new regime will likely save you more tax. Use this calculator to compare both regimes.
                    </p>
                  </div>
                </article>
              </>
            )}
          </div>
        </div>

        {/* Footer SEO Content */}
        <footer className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Income Tax Calculator India - New Tax Regime FY 2024-25</h2>
          <div className="prose max-w-none text-gray-700 space-y-4 text-sm">
            <p>
              Calculate your income tax liability for Financial Year 2024-25 (AY 2025-26) using our free online tax calculator. Get accurate calculations for new tax regime including standard deduction, Section 87A rebate, and health & education cess.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Key Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Instant tax calculation for salaried employees</li>
                  <li>Updated with Budget 2024 tax slabs</li>
                  <li>Automatic Section 87A rebate calculation</li>
                  <li>Monthly TDS and take-home salary breakdown</li>
                  <li>Effective tax rate computation</li>
                  <li>Detailed slab-wise tax analysis</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Related Calculators:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>SIP Calculator for mutual fund investments</li>
                  <li>PPF Calculator for tax-saving investments</li>
                  <li>HRA Calculator for house rent allowance</li>
                  <li>Retirement Planning Calculator</li>
                  <li>Old vs New Tax Regime Comparison</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-6 pt-4 border-t">
              <strong>Disclaimer:</strong> This income tax calculator is for informational purposes only. Tax calculations are approximate and based on information provided. For accurate tax filing and ITR submission, please consult a qualified chartered accountant or tax consultant. Tax laws are subject to change as per government notifications and budget announcements.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TaxCalculator;