import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, PieChart, Calendar, PiggyBank, BarChart3 } from 'lucide-react';

interface RetirementInputs {
    currentAge: number;
    retirementAge: number;
    lifeExpectancy: number;
    currentSavings: number;
    monthlyContribution: number;
    expectedReturn: number;
    inflationRate: string;
    monthlyExpenseToday: number;
}

const INFLATION_OPTIONS = [
    { year: '2024', rate: 5.4 },
    { year: '2023', rate: 5.7 },
    { year: '2022', rate: 6.7 },
    { year: '2021', rate: 5.1 },
    { year: '2020', rate: 6.2 },
    { year: 'Custom', rate: 0 }
];

const RetirementCalc: React.FC = () => {
    const [inputs, setInputs] = useState<RetirementInputs>({
        currentAge: 30,
        retirementAge: 60,
        lifeExpectancy: 80,
        currentSavings: 500000,
        monthlyContribution: 10000,
        expectedReturn: 12,
        inflationRate: '2024',
        monthlyExpenseToday: 30000,
    });

    const [customInflation, setCustomInflation] = useState<number>(6);

    const handleChange = (field: keyof RetirementInputs, value: string) => {
        if (field === 'inflationRate') {
            setInputs(prev => ({ ...prev, [field]: value }));
        } else {
            // Allow empty string to enable clearing the input
            if (value === '') {
                setInputs(prev => ({ ...prev, [field]: '' as any }));
                return;
            }

            const numValue = parseFloat(value);

            // Check if it's a valid positive number
            if (!isNaN(numValue) && numValue >= 0) {
                // Apply max limit for age fields
                if ((field === 'currentAge' || field === 'retirementAge' || field === 'lifeExpectancy') && numValue > 100) {
                    return; // Don't update if age exceeds 100
                }
                setInputs(prev => ({ ...prev, [field]: numValue }));
            }
        }
    };

    const getInflationRate = () => {
        const selected = INFLATION_OPTIONS.find(opt => opt.year === inputs.inflationRate);
        return selected?.year === 'Custom' ? customInflation : selected?.rate || 6;
    };

    const results = useMemo(() => {
        const inflationRate = getInflationRate();
        const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
        const yearsInRetirement = inputs.lifeExpectancy - inputs.retirementAge;
        const monthlyRate = inputs.expectedReturn / 100 / 12;
        const months = yearsToRetirement * 12;

        // Future value of current savings
        const fvCurrentSavings = inputs.currentSavings * Math.pow(1 + inputs.expectedReturn / 100, yearsToRetirement);

        // Future value of monthly contributions
        let fvContributions = 0;
        if (monthlyRate > 0) {
            fvContributions = inputs.monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        } else {
            fvContributions = inputs.monthlyContribution * months;
        }

        const totalRetirementCorpus = fvCurrentSavings + fvContributions;

        // Calculate inflation-adjusted monthly expenses at retirement
        const futureMonthlyExpense = inputs.monthlyExpenseToday * Math.pow(1 + inflationRate / 100, yearsToRetirement);
        const annualExpenseAtRetirement = futureMonthlyExpense * 12;

        // Calculate required corpus for retirement
        const realReturnRate = ((1 + inputs.expectedReturn / 100) / (1 + inflationRate / 100)) - 1;
        const monthlyRealRate = realReturnRate / 12;

        let requiredCorpus = 0;
        if (monthlyRealRate > 0) {
            const retirementMonths = yearsInRetirement * 12;
            requiredCorpus = futureMonthlyExpense * ((1 - Math.pow(1 + monthlyRealRate, -retirementMonths)) / monthlyRealRate);
        } else {
            requiredCorpus = futureMonthlyExpense * yearsInRetirement * 12;
        }

        const shortfall = requiredCorpus - totalRetirementCorpus;
        const isOnTrack = shortfall <= 0;

        // Calculate monthly contribution needed if there's a shortfall
        let requiredMonthlyContribution = 0;
        if (shortfall > 0) {
            const targetCorpus = requiredCorpus - fvCurrentSavings;
            if (monthlyRate > 0) {
                requiredMonthlyContribution = (targetCorpus * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
            } else {
                requiredMonthlyContribution = targetCorpus / months;
            }
        }

        // Additional analytics
        const totalInvested = inputs.monthlyContribution * months + inputs.currentSavings;
        const roi = ((totalRetirementCorpus - totalInvested) / totalInvested) * 100;
        const corpusMultiple = totalRetirementCorpus / totalInvested;
        const monthlyIncomeAtRetirement = (totalRetirementCorpus * (inputs.expectedReturn / 100)) / 12;

        return {
            totalRetirementCorpus,
            requiredCorpus,
            shortfall: Math.abs(shortfall),
            isOnTrack,
            futureMonthlyExpense,
            annualExpenseAtRetirement,
            yearsToRetirement,
            yearsInRetirement,
            totalInvested,
            investmentGains: totalRetirementCorpus - totalInvested,
            requiredMonthlyContribution,
            inflationRate,
            fvCurrentSavings,
            fvContributions,
            roi,
            corpusMultiple,
            realReturnRate: realReturnRate * 100,
            monthlyIncomeAtRetirement,
        };
    }, [inputs, customInflation]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercent = (value: number) => {
        return value.toFixed(2) + '%';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <PiggyBank className="w-10 h-10 text-indigo-600" />
                        <h1 className="text-4xl font-bold text-gray-800">Retirement Planning Calculator</h1>
                    </div>
                    <p className="text-gray-600">Comprehensive analysis for your retirement goals</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Input Section */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                            <Calculator className="w-5 h-5 text-indigo-600" />
                            Input Parameters
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Age (years)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={inputs.currentAge}
                                    onChange={(e) => handleChange('currentAge', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Retirement Age (years)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={inputs.retirementAge}
                                    onChange={(e) => handleChange('retirementAge', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Life Expectancy (years)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={inputs.lifeExpectancy}
                                    onChange={(e) => handleChange('lifeExpectancy', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Savings (₹)
                                </label>
                                <input
                                    type="number"
                                    value={inputs.currentSavings}
                                    onChange={(e) => handleChange('currentSavings', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Monthly Investment (₹)
                                </label>
                                <input
                                    type="number"
                                    value={inputs.monthlyContribution}
                                    onChange={(e) => handleChange('monthlyContribution', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expected Annual Return (%)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={inputs.expectedReturn}
                                    onChange={(e) => handleChange('expectedReturn', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Inflation Rate (India)
                                </label>
                                <select
                                    value={inputs.inflationRate}
                                    onChange={(e) => handleChange('inflationRate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {INFLATION_OPTIONS.map(opt => (
                                        <option key={opt.year} value={opt.year}>
                                            {opt.year === 'Custom' ? 'Custom Rate' : `${opt.year} - ${opt.rate}%`}
                                        </option>
                                    ))}
                                </select>
                                {inputs.inflationRate === 'Custom' && (
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={customInflation}
                                        onChange={(e) => setCustomInflation(parseFloat(e.target.value) || 0)}
                                        placeholder="Enter custom rate (%)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mt-2"
                                    />
                                )}
                            </div>

                            <div className="border-t pt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Monthly Expenses (₹)
                                </label>
                                <input
                                    type="number"
                                    value={inputs.monthlyExpenseToday}
                                    onChange={(e) => handleChange('monthlyExpenseToday', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className={`rounded-xl shadow-lg p-6 ${results.isOnTrack ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-600'} text-white`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="w-8 h-8" />
                                        <h2 className="text-2xl font-bold">
                                            {results.isOnTrack ? 'Retirement Goal: Achievable' : 'Retirement Goal: Shortfall'}
                                        </h2>
                                    </div>
                                    <p className="text-lg opacity-90">
                                        {results.isOnTrack
                                            ? 'You will have ' + formatCurrency(results.shortfall) + ' surplus at retirement'
                                            : 'Additional ' + formatCurrency(results.shortfall) + ' required to meet your goals'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm opacity-75">Coverage Ratio</div>
                                    <div className="text-3xl font-bold">
                                        {((results.totalRetirementCorpus / results.requiredCorpus) * 100).toFixed(0)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommended Actions Card - Prominent Position */}
                        {!results.isOnTrack && (
                            <div className="bg-white rounded-xl shadow-2xl p-6 border-l-4 border-orange-500">
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-100 p-3 rounded-full">
                                        <TrendingUp className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Recommended Actions</h3>
                                        <p className="text-gray-600 mb-4">To meet your retirement goal, consider the following options:</p>

                                        <div className="space-y-3">
                                            <div className="bg-orange-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-800">Option 1: Increase Monthly Investment</span>
                                                    <span className="text-2xl font-bold text-orange-600">{formatCurrency(results.requiredMonthlyContribution)}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">Increase from {formatCurrency(inputs.monthlyContribution)} to {formatCurrency(results.requiredMonthlyContribution)} per month</p>
                                            </div>

                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="font-semibold text-gray-800 mb-2">Option 2: Increase Expected Returns</div>
                                                <p className="text-sm text-gray-600">Consider allocating more to equity-oriented investments (mutual funds, stocks) for higher returns. Even a 1-2% increase in returns can significantly impact your corpus.</p>
                                            </div>

                                            <div className="bg-purple-50 p-4 rounded-lg">
                                                <div className="font-semibold text-gray-800 mb-2">Option 3: Reduce Post-Retirement Expenses</div>
                                                <p className="text-sm text-gray-600">Review your expected monthly expenses. Reducing expenses by {formatCurrency(Math.ceil((results.shortfall / results.yearsInRetirement) / 12))} per month can help bridge the gap.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success Message for On Track */}
                        {results.isOnTrack && (
                            <div className="bg-white rounded-xl shadow-2xl p-6 border-l-4 border-green-500">
                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Excellent Planning!</h3>
                                        <p className="text-gray-600 mb-4">You're on track to exceed your retirement goals. Here are some tips to optimize further:</p>

                                        <div className="space-y-3">
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <div className="font-semibold text-gray-800 mb-2">✓ Maintain Your Discipline</div>
                                                <p className="text-sm text-gray-600">Continue your current investment strategy and avoid withdrawing from your retirement fund early.</p>
                                            </div>

                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="font-semibold text-gray-800 mb-2">✓ Review Annually</div>
                                                <p className="text-sm text-gray-600">Reassess your retirement plan yearly as your income, expenses, and goals may change.</p>
                                            </div>

                                            <div className="bg-purple-50 p-4 rounded-lg">
                                                <div className="font-semibold text-gray-800 mb-2">✓ Consider Additional Goals</div>
                                                <p className="text-sm text-gray-600">With a surplus of {formatCurrency(results.shortfall)}, you could plan for legacy, travel, or supporting family members.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Key Metrics Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl shadow-lg p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Projected Corpus</h3>
                                    <PieChart className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="text-3xl font-bold text-indigo-600">
                                    {formatCurrency(results.totalRetirementCorpus)}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">At age {inputs.retirementAge}</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Required Corpus</h3>
                                    <BarChart3 className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="text-3xl font-bold text-purple-600">
                                    {formatCurrency(results.requiredCorpus)}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">For {results.yearsInRetirement} years</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Investment</h3>
                                    <PiggyBank className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold text-blue-600">
                                    {formatCurrency(results.totalInvested)}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">Principal amount</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Investment Gains</h3>
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="text-3xl font-bold text-green-600">
                                    {formatCurrency(results.investmentGains)}
                                </div>
                                <div className="text-xs text-gray-500 mt-2">Returns on investment</div>
                            </div>
                        </div>

                        {/* Detailed Analytics */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                                <BarChart3 className="w-5 h-5 text-indigo-600" />
                                Detailed Analysis
                            </h3>

                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Years to Retirement</span>
                                    <span className="font-semibold text-gray-800">{results.yearsToRetirement} years</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Years in Retirement</span>
                                    <span className="font-semibold text-gray-800">{results.yearsInRetirement} years</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Return on Investment (ROI)</span>
                                    <span className="font-semibold text-green-600">{formatPercent(results.roi)}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Corpus Multiple</span>
                                    <span className="font-semibold text-gray-800">{results.corpusMultiple.toFixed(2)}x</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Inflation Rate Applied</span>
                                    <span className="font-semibold text-gray-800">{formatPercent(results.inflationRate)}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Real Return Rate</span>
                                    <span className="font-semibold text-gray-800">{formatPercent(results.realReturnRate)}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">FV of Current Savings</span>
                                    <span className="font-semibold text-gray-800">{formatCurrency(results.fvCurrentSavings)}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">FV of Future Contributions</span>
                                    <span className="font-semibold text-gray-800">{formatCurrency(results.fvContributions)}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Monthly Expense at Retirement</span>
                                    <span className="font-semibold text-gray-800">{formatCurrency(results.futureMonthlyExpense)}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Annual Expense at Retirement</span>
                                    <span className="font-semibold text-gray-800">{formatCurrency(results.annualExpenseAtRetirement)}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Monthly Income from Corpus</span>
                                    <span className="font-semibold text-blue-600">{formatCurrency(results.monthlyIncomeAtRetirement)}</span>
                                </div>

                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Total Investment Period</span>
                                    <span className="font-semibold text-gray-800">{results.yearsToRetirement * 12} months</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetirementCalc;
