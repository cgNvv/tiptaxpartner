/**
 * FICA Tip Credit Calculator
 * IRS Section 45B Implementation
 *
 * This module provides calculation functions for estimating FICA tip tax credits
 * for restaurants and hospitality businesses.
 */

/**
 * Calculate FICA Tip Credit based on IRS Section 45B
 *
 * @param {Object} params - Calculation parameters
 * @param {number} params.locations - Number of restaurant locations
 * @param {number} params.servers - Number of full-time servers
 * @param {number} params.hoursPerMonth - Hours worked per month per server
 * @param {number} params.cashWagePerHour - Cash wage paid to server ($/hr)
 * @param {number} params.tipsPct - Tips as percentage of total income (0-1 decimal)
 * @param {number} params.minWageBasis - Minimum wage basis for IRS calculation ($/hr, default $5.15)
 *
 * @returns {Object} Calculation results
 * @returns {number} tipsMonthly - Monthly tips per server
 * @returns {number} nonCreditableTips - Tips that don't qualify for credit
 * @returns {number} creditableTips - Tips that qualify for credit
 * @returns {number} monthlyCreditPerServer - Monthly credit amount per server
 * @returns {number} annualCreditPerServer - Annual credit amount per server
 * @returns {number} credit3yrPerServer - 3-year credit amount per server
 * @returns {number} totalCredit - Total credit across all servers and locations
 * @returns {number} serversFor100k - Number of servers needed to reach $100k credit
 * @returns {number} totalIncomeMonthly - Total monthly income per server
 * @returns {number} annualIncome - Annual income per server
 * @returns {number} effectiveHourlyRate - Effective hourly rate including tips
 */
function calculateFicaTipCredit(params) {
    const {
        locations = 1,
        servers = 1,
        hoursPerMonth = 173,
        cashWagePerHour = 0,
        tipsPct = 0, // Should be decimal (e.g., 0.60 for 60%)
        minWageBasis = 5.15
    } = params;

    // Validate inputs
    if (locations < 1 || servers < 1 || hoursPerMonth < 1) {
        throw new Error('Invalid input: locations, servers, and hoursPerMonth must be positive numbers');
    }

    if (tipsPct < 0 || tipsPct > 1) {
        throw new Error('Invalid input: tipsPct must be between 0 and 1');
    }

    // Step 1: Calculate monthly cash wage
    const cashWageMonthly = cashWagePerHour * hoursPerMonth;

    // Step 2: Calculate total monthly income and tips
    // Formula: total_income = cash_wage / (1 - tips_pct)
    const totalIncomeMonthly = tipsPct === 1
        ? cashWageMonthly // Avoid division by zero
        : cashWageMonthly / (1 - tipsPct);

    const tipsMonthly = totalIncomeMonthly - cashWageMonthly;

    // Step 3: Calculate minimum wage baseline (IRS requirement)
    const baselineMonthly = minWageBasis * hoursPerMonth;

    // Step 4: Calculate non-creditable tips
    // Non-creditable = amount below baseline that employer must pay
    let nonCreditableTips = baselineMonthly - cashWageMonthly;
    if (nonCreditableTips < 0) nonCreditableTips = 0;

    // Step 5: Calculate creditable tips
    let creditableTips = tipsMonthly - nonCreditableTips;
    if (creditableTips < 0) creditableTips = 0;

    // Step 6: Apply FICA tax rate
    // Employer portion: Social Security (6.2%) + Medicare (1.45%) = 7.65%
    const FICA_CREDIT_RATE = 0.0765;

    // Step 7: Calculate monthly credit per server
    const monthlyCreditPerServer = creditableTips * FICA_CREDIT_RATE;

    // Step 8: Calculate annual and 3-year credits
    const annualCreditPerServer = monthlyCreditPerServer * 12;
    const credit3yrPerServer = annualCreditPerServer * 3;

    // Step 9: Calculate total credit across all servers and locations
    const totalCredit = credit3yrPerServer * servers * locations;

    // Step 10: Calculate servers needed to reach $100,000 credit
    const serversFor100k = credit3yrPerServer > 0
        ? Math.ceil(100000 / credit3yrPerServer)
        : 0;

    // Additional calculations for display
    const annualIncome = totalIncomeMonthly * 12;
    const effectiveHourlyRate = hoursPerMonth > 0
        ? totalIncomeMonthly / hoursPerMonth
        : 0;

    return {
        // Core credit calculations
        tipsMonthly,
        nonCreditableTips,
        creditableTips,
        monthlyCreditPerServer,
        annualCreditPerServer,
        credit3yrPerServer,
        totalCredit,
        serversFor100k,

        // Income calculations
        totalIncomeMonthly,
        annualIncome,
        effectiveHourlyRate,

        // Intermediate values (useful for debugging)
        cashWageMonthly,
        baselineMonthly,
        creditRate: FICA_CREDIT_RATE
    };
}

/**
 * Format a number as USD currency
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

/**
 * Format a number with commas
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
function formatNumber(value, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

/**
 * Validate calculator inputs
 * @param {Object} params - Input parameters
 * @returns {Object} Validation result with isValid boolean and errors array
 */
function validateInputs(params) {
    const errors = [];

    if (!params.locations || params.locations < 1) {
        errors.push('Number of locations must be at least 1');
    }

    if (!params.servers || params.servers < 1) {
        errors.push('Number of servers must be at least 1');
    }

    if (!params.hoursPerMonth || params.hoursPerMonth < 1) {
        errors.push('Hours per month must be at least 1');
    }

    if (params.cashWagePerHour < 0) {
        errors.push('Cash wage cannot be negative');
    }

    if (params.tipsPct < 0 || params.tipsPct > 1) {
        errors.push('Tips percentage must be between 0% and 100%');
    }

    if (params.minWageBasis < 0) {
        errors.push('Minimum wage basis cannot be negative');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    // Node.js / CommonJS
    module.exports = {
        calculateFicaTipCredit,
        formatCurrency,
        formatNumber,
        validateInputs
    };
}

// Also support browser global
if (typeof window !== 'undefined') {
    window.FicaCalculator = {
        calculateFicaTipCredit,
        formatCurrency,
        formatNumber,
        validateInputs
    };
}
