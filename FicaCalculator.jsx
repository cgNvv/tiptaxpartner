import React, { useState, useEffect } from 'react';

/**
 * FICA Tip Credit Calculator - React Component
 * Implements IRS Section 45B calculation logic
 */

// Calculation function
const calculateFicaTipCredit = (params) => {
    const {
        locations = 1,
        servers = 1,
        hoursPerMonth = 173,
        cashWagePerHour = 0,
        tipsPct = 0,
        minWageBasis = 5.15
    } = params;

    // 1. Monthly cash wage
    const cashWageMonthly = cashWagePerHour * hoursPerMonth;

    // 2. Total monthly income and tips
    const totalIncomeMonthly = tipsPct === 1
        ? cashWageMonthly
        : cashWageMonthly / (1 - tipsPct);
    const tipsMonthly = totalIncomeMonthly - cashWageMonthly;

    // 3. Minimum wage baseline
    const baselineMonthly = minWageBasis * hoursPerMonth;

    // 4. Non-creditable tips
    let nonCreditableTips = baselineMonthly - cashWageMonthly;
    if (nonCreditableTips < 0) nonCreditableTips = 0;

    // 5. Creditable tips
    let creditableTips = tipsMonthly - nonCreditableTips;
    if (creditableTips < 0) creditableTips = 0;

    // 6. FICA tax rate (7.65%)
    const FICA_CREDIT_RATE = 0.0765;

    // 7. Monthly credit per server
    const monthlyCreditPerServer = creditableTips * FICA_CREDIT_RATE;

    // 8. Annual and 3-year credits
    const annualCreditPerServer = monthlyCreditPerServer * 12;
    const credit3yrPerServer = annualCreditPerServer * 3;

    // 9. Total credit
    const totalCredit = credit3yrPerServer * servers * locations;

    // 10. Servers needed for $100k
    const serversFor100k = credit3yrPerServer > 0
        ? Math.ceil(100000 / credit3yrPerServer)
        : 0;

    // Additional calculations
    const annualIncome = totalIncomeMonthly * 12;
    const effectiveHourlyRate = hoursPerMonth > 0
        ? totalIncomeMonthly / hoursPerMonth
        : 0;

    return {
        tipsMonthly,
        nonCreditableTips,
        creditableTips,
        monthlyCreditPerServer,
        annualCreditPerServer,
        credit3yrPerServer,
        totalCredit,
        serversFor100k,
        totalIncomeMonthly,
        annualIncome,
        effectiveHourlyRate
    };
};

// Format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

// Format number
const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

const FicaCalculator = () => {
    // Input state
    const [inputs, setInputs] = useState({
        locations: 1,
        servers: 10,
        hoursPerMonth: 173,
        cashWagePerHour: 8.00,
        tipsPct: 60, // Stored as percentage (0-100)
        minWageBasis: 5.15
    });

    // Output state
    const [results, setResults] = useState(null);

    // Calculate results whenever inputs change
    useEffect(() => {
        const calculationParams = {
            ...inputs,
            tipsPct: inputs.tipsPct / 100 // Convert to decimal
        };

        const calculatedResults = calculateFicaTipCredit(calculationParams);
        setResults(calculatedResults);
    }, [inputs]);

    // Handle input changes
    const handleInputChange = (field, value) => {
        setInputs(prev => ({
            ...prev,
            [field]: parseFloat(value) || 0
        }));
    };

    return (
        <div className="fica-calculator">
            <style jsx>{`
                .fica-calculator {
                    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .calculator-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .calculator-header h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #0891B2;
                    margin-bottom: 1rem;
                }

                .calculator-header p {
                    font-size: 1.1rem;
                    color: #64748B;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .calculator-container {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .calculator-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0;
                }

                .inputs-section,
                .outputs-section {
                    padding: 3rem;
                }

                .inputs-section {
                    background: white;
                    border-right: 2px solid #F8FAFC;
                }

                .outputs-section {
                    background: linear-gradient(135deg, rgba(8, 145, 178, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
                }

                .section-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #0891B2;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .section-title::before {
                    content: '';
                    width: 4px;
                    height: 24px;
                    background: #0891B2;
                    border-radius: 2px;
                }

                .input-group {
                    margin-bottom: 1.5rem;
                }

                .input-group label {
                    display: block;
                    font-weight: 600;
                    color: #1E293B;
                    margin-bottom: 0.5rem;
                    font-size: 0.95rem;
                }

                .input-group input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 2px solid #E2E8F0;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-family: 'Montserrat', sans-serif;
                    transition: all 0.3s ease;
                }

                .input-group input:focus {
                    outline: none;
                    border-color: #0891B2;
                    box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
                }

                .input-with-prefix {
                    position: relative;
                }

                .input-prefix {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748B;
                    font-weight: 600;
                    pointer-events: none;
                }

                .input-with-prefix input {
                    padding-left: 2rem;
                }

                .input-suffix {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748B;
                    font-weight: 600;
                    pointer-events: none;
                }

                .input-with-suffix input {
                    padding-right: 2.5rem;
                }

                .output-group {
                    margin-bottom: 1.5rem;
                }

                .output-label {
                    font-weight: 600;
                    color: #64748B;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    display: block;
                }

                .output-value {
                    background: white;
                    padding: 1rem 1.25rem;
                    border-radius: 8px;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #0891B2;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    border: 2px solid rgba(8, 145, 178, 0.1);
                }

                .output-value.large {
                    font-size: 2rem;
                    background: linear-gradient(135deg, #0891B2, #06B6D4);
                    color: white;
                    text-align: center;
                    padding: 1.5rem;
                }

                .output-section-divider {
                    margin: 2rem 0;
                    border: 0;
                    border-top: 2px solid rgba(8, 145, 178, 0.1);
                }

                .output-subsection-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1E293B;
                    margin-bottom: 1rem;
                }

                .disclaimer {
                    background: rgba(8, 145, 178, 0.05);
                    border-left: 4px solid #0891B2;
                    padding: 1.5rem;
                    margin-top: 2rem;
                    border-radius: 0 0 12px 12px;
                }

                .disclaimer p {
                    color: #64748B;
                    font-size: 0.9rem;
                    margin: 0;
                }

                @media (max-width: 968px) {
                    .calculator-grid {
                        grid-template-columns: 1fr;
                    }

                    .inputs-section {
                        border-right: none;
                        border-bottom: 2px solid #F8FAFC;
                    }

                    .inputs-section,
                    .outputs-section {
                        padding: 2rem;
                    }
                }

                @media (max-width: 640px) {
                    .calculator-header h1 {
                        font-size: 1.75rem;
                    }

                    .inputs-section,
                    .outputs-section {
                        padding: 1.5rem;
                    }

                    .output-value.large {
                        font-size: 1.5rem;
                    }
                }
            `}</style>

            <div className="calculator-header">
                <h1>FICA Tip Credit Calculator</h1>
                <p>
                    Calculate your potential tax credit based on IRS Section 45B, which allows employers
                    to claim a credit for the FICA taxes paid on tips that exceed the federal minimum wage
                </p>
            </div>

            <div className="calculator-container">
                <div className="calculator-grid">
                    {/* Inputs Section */}
                    <div className="inputs-section">
                        <h2 className="section-title">Calculator Inputs</h2>

                        <div className="input-group">
                            <label htmlFor="locations">Number of Restaurant Locations</label>
                            <input
                                type="number"
                                id="locations"
                                value={inputs.locations}
                                onChange={(e) => handleInputChange('locations', e.target.value)}
                                min="1"
                                step="1"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="servers">Number of Full-Time Servers</label>
                            <input
                                type="number"
                                id="servers"
                                value={inputs.servers}
                                onChange={(e) => handleInputChange('servers', e.target.value)}
                                min="1"
                                step="1"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="hoursPerMonth">Hours Worked per Month</label>
                            <input
                                type="number"
                                id="hoursPerMonth"
                                value={inputs.hoursPerMonth}
                                onChange={(e) => handleInputChange('hoursPerMonth', e.target.value)}
                                min="1"
                                step="1"
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="cashWage">Cash Wage to Server ($/hr)</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    id="cashWage"
                                    value={inputs.cashWagePerHour}
                                    onChange={(e) => handleInputChange('cashWagePerHour', e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="tipsPct">Tips as % of Total Income</label>
                            <div className="input-with-suffix">
                                <input
                                    type="number"
                                    id="tipsPct"
                                    value={inputs.tipsPct}
                                    onChange={(e) => handleInputChange('tipsPct', e.target.value)}
                                    min="0"
                                    max="100"
                                    step="1"
                                />
                                <span className="input-suffix">%</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="minWageBasis">Minimum Wage Basis ($/hr)</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    id="minWageBasis"
                                    value={inputs.minWageBasis}
                                    onChange={(e) => handleInputChange('minWageBasis', e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Outputs Section */}
                    <div className="outputs-section">
                        <h2 className="section-title">Estimated Credit</h2>

                        {results && (
                            <>
                                <div className="output-group">
                                    <span className="output-label">Estimated 3-Year FICA Refund/Credit</span>
                                    <div className="output-value large">
                                        {formatCurrency(results.totalCredit)}
                                    </div>
                                </div>

                                <hr className="output-section-divider" />

                                <div className="output-subsection">
                                    <h3 className="output-subsection-title">Per Server Breakdown</h3>

                                    <div className="output-group">
                                        <span className="output-label">Monthly Tips</span>
                                        <div className="output-value">
                                            {formatCurrency(results.tipsMonthly)}
                                        </div>
                                    </div>

                                    <div className="output-group">
                                        <span className="output-label">Tips Not Creditable</span>
                                        <div className="output-value">
                                            {formatCurrency(results.nonCreditableTips)}
                                        </div>
                                    </div>

                                    <div className="output-group">
                                        <span className="output-label">Creditable Tips</span>
                                        <div className="output-value">
                                            {formatCurrency(results.creditableTips)}
                                        </div>
                                    </div>

                                    <div className="output-group">
                                        <span className="output-label">Monthly Credit</span>
                                        <div className="output-value">
                                            {formatCurrency(results.monthlyCreditPerServer)}
                                        </div>
                                    </div>

                                    <div className="output-group">
                                        <span className="output-label">Annual Credit per Server</span>
                                        <div className="output-value">
                                            {formatCurrency(results.annualCreditPerServer)}
                                        </div>
                                    </div>

                                    <div className="output-group">
                                        <span className="output-label">3-Year Credit per Server</span>
                                        <div className="output-value">
                                            {formatCurrency(results.credit3yrPerServer)}
                                        </div>
                                    </div>
                                </div>

                                <hr className="output-section-divider" />

                                <div className="output-subsection">
                                    <h3 className="output-subsection-title">Server Income Details</h3>

                                    <div className="output-group">
                                        <span className="output-label">Monthly Income</span>
                                        <div className="output-value">
                                            {formatCurrency(results.totalIncomeMonthly)}
                                        </div>
                                    </div>

                                    <div className="output-group">
                                        <span className="output-label">Annual Income</span>
                                        <div className="output-value">
                                            {formatCurrency(results.annualIncome)}
                                        </div>
                                    </div>

                                    <div className="output-group">
                                        <span className="output-label">Effective Hourly Rate</span>
                                        <div className="output-value">
                                            {formatCurrency(results.effectiveHourlyRate)}/hr
                                        </div>
                                    </div>

                                    <div className="output-group">
                                        <span className="output-label">Servers Needed for $100k Credit</span>
                                        <div className="output-value">
                                            {formatNumber(results.serversFor100k)}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="disclaimer">
                    <p>
                        <strong>Disclaimer:</strong> This calculator provides an estimate only and is not tax or legal advice.
                        Please consult with a tax professional for specific advice regarding your tax situation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FicaCalculator;

// Also export the calculation function for reuse
export { calculateFicaTipCredit, formatCurrency, formatNumber };
