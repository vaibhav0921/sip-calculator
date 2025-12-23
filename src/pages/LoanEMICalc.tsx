import React, { useState, useMemo } from 'react';

/**
 * LoanEmiCalculator - Production-ready React component for EMI calculation
 * Supports multiple loan types with Indian banking standards
 * SEO-optimized and Google AdSense compatible
 */

// Loan type configurations with Indian banking standards
const LOAN_TYPES = {
    home: {
        name: 'Home Loan',
        minRate: 8,
        maxRate: 12,
        maxTenureYears: 30,
        defaultRate: 8.5,
        defaultAmount: 5000000,
        defaultTenure: 20
    },
    personal: {
        name: 'Personal Loan',
        minRate: 10,
        maxRate: 24,
        maxTenureYears: 5,
        defaultRate: 14,
        defaultAmount: 500000,
        defaultTenure: 3
    },
    car: {
        name: 'Car Loan',
        minRate: 7,
        maxRate: 15,
        maxTenureYears: 7,
        defaultRate: 9,
        defaultAmount: 800000,
        defaultTenure: 5
    },
    education: {
        name: 'Education Loan',
        minRate: 6,
        maxRate: 14,
        maxTenureYears: 15,
        defaultRate: 8,
        defaultAmount: 1000000,
        defaultTenure: 10
    },
    business: {
        name: 'Business Loan',
        minRate: 11,
        maxRate: 22,
        maxTenureYears: 10,
        defaultRate: 15,
        defaultAmount: 2000000,
        defaultTenure: 5
    }
};

// Utility function to calculate EMI
const calculateEMI = (principal: number, annualRate: number, months: number) => {
    if (principal <= 0 || annualRate <= 0 || months <= 0) {
        return { emi: 0, totalInterest: 0, totalAmount: 0 };
    }

    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    return {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalAmount: Math.round(totalAmount)
    };
};
type LoanType = keyof typeof LOAN_TYPES;
// Format currency in Indian Rupee format
const formatIndianCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null || amount === undefined) return '₹0';

    const num = Math.round(amount);
    const numStr = num.toString();
    const lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);

    if (otherNumbers !== '') {
        return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return '₹' + lastThree;
};

const LoanEmiCalculator = () => {
    // State management
    const [loanType, setLoanType] = useState<LoanType>('home');
    const [loanAmount, setLoanAmount] = useState(LOAN_TYPES.home.defaultAmount);
    const [interestRate, setInterestRate] = useState(LOAN_TYPES.home.defaultRate);
    const [tenure, setTenure] = useState(LOAN_TYPES.home.defaultTenure);
    const [tenureUnit, setTenureUnit] = useState('years');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [hasCalculated, setHasCalculated] = useState(false);

    const currentLoanConfig = LOAN_TYPES[loanType];

    type ValidationErrors = {
        loanAmount?: string;
        interestRate?: string;
        tenure?: string;
    };
    // Validation logic
    const validateInputs = () => {
        const newErrors: ValidationErrors = {};

        // Validate loan amount
        if (!loanAmount || loanAmount <= 0) {
            newErrors.loanAmount = 'Loan amount must be greater than 0';
        } else if (loanAmount > 100000000) {
            newErrors.loanAmount = 'Loan amount cannot exceed ₹10 Crore';
        }

        // Validate interest rate
        if (!interestRate || interestRate <= 0) {
            newErrors.interestRate = 'Interest rate must be greater than 0';
        } else if (interestRate < currentLoanConfig.minRate) {
            newErrors.interestRate = `Rate must be at least ${currentLoanConfig.minRate}% for ${currentLoanConfig.name}`;
        } else if (interestRate > currentLoanConfig.maxRate) {
            newErrors.interestRate = `Rate cannot exceed ${currentLoanConfig.maxRate}% for ${currentLoanConfig.name}`;
        }

        // Validate tenure
        if (!tenure || tenure <= 0) {
            newErrors.tenure = 'Tenure must be greater than 0';
        } else {
            const tenureInYears = tenureUnit === 'years' ? tenure : tenure / 12;
            if (tenureInYears > currentLoanConfig.maxTenureYears) {
                newErrors.tenure = `Tenure cannot exceed ${currentLoanConfig.maxTenureYears} years for ${currentLoanConfig.name}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Check if form is valid
    const isFormValid = useMemo(() => {
        return loanAmount > 0 &&
            loanAmount <= 100000000 &&
            interestRate >= currentLoanConfig.minRate &&
            interestRate <= currentLoanConfig.maxRate &&
            tenure > 0 &&
            (tenureUnit === 'years' ? tenure : tenure / 12) <= currentLoanConfig.maxTenureYears;
    }, [loanAmount, interestRate, tenure, tenureUnit, loanType]);

    // Calculate results
    const results = useMemo(() => {
        if (!hasCalculated || !isFormValid) {
            return { emi: 0, totalInterest: 0, totalAmount: 0 };
        }

        const months = tenureUnit === 'years' ? tenure * 12 : tenure;
        return calculateEMI(loanAmount, interestRate, months);
    }, [loanAmount, interestRate, tenure, tenureUnit, hasCalculated, isFormValid]);

    // Handle loan type change
    const handleLoanTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as LoanType;

        setLoanType(newType);

        const config = LOAN_TYPES[newType];

        setLoanAmount(config.defaultAmount);
        setInterestRate(config.defaultRate);
        setTenure(config.defaultTenure);
        setTenureUnit('years');
        setErrors({});
        setHasCalculated(false);
    };

    // Handle calculate button click
    const handleCalculate = () => {
        if (validateInputs()) {
            setHasCalculated(true);
        }
    };

    // Styles
    const styles: Record<string, React.CSSProperties> = {
        section: {
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '20px',
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        header: {
            textAlign: 'center',
            marginBottom: '30px',
            padding: '30px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px',
        },
        h1: {
            fontSize: '2em',
            marginBottom: '10px',
            fontWeight: 700,
        },
        subtitle: {
            fontSize: '1.1em',
            opacity: 0.95,
        },
        calculator: {
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '30px',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '25px'
        },
        formGroup: {
            marginBottom: '0'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#495057',
            fontSize: '0.95em'
        },
        input: {
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '16px',
            transition: 'border-color 0.3s',
            boxSizing: 'border-box'
        },
        inputFocus: {
            borderColor: '#667eea',
            outline: 'none'
        },
        inputError: {
            borderColor: '#dc3545'
        },
        select: {
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '16px',
            backgroundColor: 'white',
            cursor: 'pointer',
            boxSizing: 'border-box'
        },
        error: {
            color: '#dc3545',
            fontSize: '0.85em',
            marginTop: '5px',
            display: 'block'
        },
        toggleGroup: {
            display: 'flex',
            gap: '10px',
            marginTop: '8px'
        },
        toggleBtn: {
            flex: 1,
            padding: '10px',
            border: '2px solid #e0e0e0',
            background: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s',
            fontSize: '14px'
        },
        toggleBtnActive: {
            background: '#667eea',
            color: 'white',
            borderColor: '#667eea'
        },
        calculateBtn: {
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            marginTop: '20px'
        },
        calculateBtnDisabled: {
            background: '#ccc',
            cursor: 'not-allowed'
        },
        results: {
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '30px',
            marginTop: '30px'
        },
        resultsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
        },
        resultCard: {
            background: 'rgba(255,255,255,0.15)',
            padding: '20px',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)'
        },
        resultLabel: {
            fontSize: '0.9em',
            marginBottom: '8px',
            opacity: '0.9'
        },
        resultValue: {
            fontSize: '1.8em',
            fontWeight: '700'
        },
        content: {
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            lineHeight: '1.7'
        },
        h2: {
            color: '#667eea',
            fontSize: '1.8em',
            marginBottom: '15px',
            fontWeight: '700'
        },
        h3: {
            color: '#495057',
            fontSize: '1.3em',
            marginTop: '25px',
            marginBottom: '12px',
            fontWeight: '600'
        },
        p: {
            marginBottom: '15px',
            fontSize: '1.05em',
            color: '#333'
        },
        disclaimer: {
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '6px',
            padding: '15px',
            marginTop: '20px',
            fontSize: '0.9em',
            color: '#856404'
        }
    };

    return (
        <section style={styles.section}>
            <header style={styles.header}>
                <h1 style={styles.h1}>💰 Loan EMI Calculator</h1>
                <p style={styles.subtitle}>Calculate EMI for Home, Personal, Car, Education & Business Loans</p>
            </header>

            <article style={styles.calculator}>
                <h2 style={{ ...styles.h2, textAlign: 'left', marginBottom: '25px' }}>Calculate Your EMI</h2>

                <div style={styles.grid}>
                    <div style={styles.formGroup}>
                        <label htmlFor="loanType" style={styles.label}>Loan Type</label>
                        <select
                            id="loanType"
                            value={loanType}
                            onChange={handleLoanTypeChange}
                            style={styles.select}
                        >
                            {Object.entries(LOAN_TYPES).map(([key, config]) => (
                                <option key={key} value={key}>{config.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="loanAmount" style={styles.label}>Loan Amount (₹)</label>
                        <input
                            id="loanAmount"
                            type="number"
                            value={loanAmount}
                            onChange={(e) => {
                                setLoanAmount(Number(e.target.value));
                                setHasCalculated(false);
                            }}
                            style={{
                                ...styles.input,
                                ...(errors.loanAmount ? styles.inputError : {})
                            }}
                            min="1"
                            max="100000000"
                        />
                        {errors.loanAmount && <span style={styles.error}>{errors.loanAmount}</span>}
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="interestRate" style={styles.label}>
                            Interest Rate (% p.a.)
                        </label>
                        <input
                            id="interestRate"
                            type="number"
                            value={interestRate}
                            onChange={(e) => {
                                setInterestRate(Number(e.target.value));
                                setHasCalculated(false);
                            }}
                            style={{
                                ...styles.input,
                                ...(errors.interestRate ? styles.inputError : {})
                            }}
                            step="0.1"
                            min={currentLoanConfig.minRate}
                            max={currentLoanConfig.maxRate}
                        />
                        {errors.interestRate && <span style={styles.error}>{errors.interestRate}</span>}
                        <span style={{ fontSize: '0.85em', color: '#6c757d', marginTop: '5px', display: 'block' }}>
                            Range: {currentLoanConfig.minRate}% - {currentLoanConfig.maxRate}%
                        </span>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="tenure" style={styles.label}>Loan Tenure</label>
                        <input
                            id="tenure"
                            type="number"
                            value={tenure}
                            onChange={(e) => {
                                setTenure(Number(e.target.value));
                                setHasCalculated(false);
                            }}
                            style={{
                                ...styles.input,
                                ...(errors.tenure ? styles.inputError : {})
                            }}
                            min="1"
                        />
                        <div style={styles.toggleGroup}>
                            <button
                                type="button"
                                onClick={() => {
                                    setTenureUnit('years');
                                    setHasCalculated(false);
                                }}
                                style={{
                                    ...styles.toggleBtn,
                                    ...(tenureUnit === 'years' ? styles.toggleBtnActive : {})
                                }}
                            >
                                Years
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setTenureUnit('months');
                                    setHasCalculated(false);
                                }}
                                style={{
                                    ...styles.toggleBtn,
                                    ...(tenureUnit === 'months' ? styles.toggleBtnActive : {})
                                }}
                            >
                                Months
                            </button>
                        </div>
                        {errors.tenure && <span style={styles.error}>{errors.tenure}</span>}
                        <span style={{ fontSize: '0.85em', color: '#6c757d', marginTop: '5px', display: 'block' }}>
                            Max: {currentLoanConfig.maxTenureYears} years
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    disabled={!isFormValid}
                    style={{
                        ...styles.calculateBtn,
                        ...(!isFormValid ? styles.calculateBtnDisabled : {})
                    }}
                    onMouseEnter={(e) => {
                        if (isFormValid) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    Calculate EMI
                </button>

                {hasCalculated && isFormValid && (
                    <div style={styles.results}>
                        <h3 style={{ marginBottom: '20px', fontSize: '1.5em' }}>Your EMI Breakdown</h3>
                        <div style={styles.resultsGrid}>
                            <div style={styles.resultCard}>
                                <div style={styles.resultLabel}>Monthly EMI</div>
                                <div style={styles.resultValue}>{formatIndianCurrency(results.emi)}</div>
                            </div>
                            <div style={styles.resultCard}>
                                <div style={styles.resultLabel}>Total Interest</div>
                                <div style={styles.resultValue}>{formatIndianCurrency(results.totalInterest)}</div>
                            </div>
                            <div style={styles.resultCard}>
                                <div style={styles.resultLabel}>Total Amount</div>
                                <div style={styles.resultValue}>{formatIndianCurrency(results.totalAmount)}</div>
                            </div>
                        </div>
                    </div>
                )}
            </article>

            <article style={styles.content}>
                <h2 style={styles.h2}>Understanding Loan EMI in India</h2>

                <p style={styles.p}>
                    EMI, or Equated Monthly Installment, is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month so that over a specified number of years, the loan is fully paid off. Understanding how EMI works is crucial for anyone considering taking a loan in India, whether for a home, car, education, or personal needs.
                </p>

                <h3 style={styles.h3}>How EMI is Calculated</h3>

                <p style={styles.p}>
                    The EMI calculation is based on three key factors: the principal loan amount, the interest rate charged by the lender, and the loan tenure. Indian banks use a standard mathematical formula where the monthly interest rate is derived from the annual rate, and compound interest is applied over the loan period. In the early stages of loan repayment, a larger portion of your EMI goes toward paying interest, while in later stages, more of it goes toward repaying the principal.
                </p>

                <h3 style={styles.h3}>Choosing the Right Loan Type</h3>

                <p style={styles.p}>
                    Different loan types in India come with varying interest rates and tenure options. Home loans typically offer the longest repayment period (up to 30 years) and relatively lower interest rates because they're secured against property. Personal loans have higher rates but offer flexibility in usage. Car loans and education loans fall somewhere in between, with specific terms designed for their purposes. Understanding these differences helps you choose the most suitable loan for your financial situation and repayment capacity.
                </p>

                <div style={styles.disclaimer}>
                    <strong>Disclaimer:</strong> This calculator is for educational purposes only. Actual EMI amounts may vary based on bank policies, processing fees, and other charges. Please consult with your bank or financial advisor for accurate loan details and personalized advice.
                </div>
            </article>
        </section>
    );
};

export default LoanEmiCalculator;