# FICA Tip Credit Calculator Documentation

## Overview
This calculator implements IRS Section 45B (FICA Tip Credit) calculation logic to help restaurants and hospitality businesses estimate their potential tax credits.

## Files Created

### 1. `calculator.html`
**Standalone HTML calculator** - Ready to use immediately!
- Complete calculator with inputs and outputs
- Real-time calculations as you type
- Fully responsive design (mobile & desktop)
- No dependencies, no build required
- Styled to match your existing website

**Usage:**
- Deploy directly to your website
- Access at: `https://yoursite.com/calculator.html`

### 2. `fica-calculator.js`
**Reusable JavaScript module** - For custom integrations

**Functions:**
```javascript
// Main calculation function
calculateFicaTipCredit({
    locations: 1,
    servers: 10,
    hoursPerMonth: 173,
    cashWagePerHour: 8.00,
    tipsPct: 0.60,  // 60% as decimal
    minWageBasis: 5.15
})

// Returns:
{
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
}

// Formatting functions
formatCurrency(value)  // Returns "$1,234.56"
formatNumber(value)    // Returns "1,234"

// Validation
validateInputs(params) // Returns { isValid: boolean, errors: [] }
```

**Usage:**
```html
<!-- In browser -->
<script src="fica-calculator.js"></script>
<script>
    const result = window.FicaCalculator.calculateFicaTipCredit({...});
    console.log(window.FicaCalculator.formatCurrency(result.totalCredit));
</script>
```

```javascript
// In Node.js
const { calculateFicaTipCredit, formatCurrency } = require('./fica-calculator.js');
const result = calculateFicaTipCredit({...});
```

### 3. `FicaCalculator.jsx`
**React component** - For React applications

**Usage:**
```javascript
import FicaCalculator from './FicaCalculator';

function App() {
    return (
        <div>
            <FicaCalculator />
        </div>
    );
}
```

**Or use just the calculation function:**
```javascript
import { calculateFicaTipCredit, formatCurrency } from './FicaCalculator';

const result = calculateFicaTipCredit({
    locations: 1,
    servers: 10,
    hoursPerMonth: 173,
    cashWagePerHour: 8.00,
    tipsPct: 0.60,
    minWageBasis: 5.15
});

console.log(formatCurrency(result.totalCredit));
```

## Calculation Logic (IRS Section 45B)

### Inputs
1. **Number of Restaurant Locations** - Total business locations
2. **Number of Full-Time Servers** - Per location
3. **Hours Worked per Month** - Per server (default: 173)
4. **Cash Wage to Server** - Hourly rate paid ($/hr)
5. **Tips as % of Total Income** - Percentage (0-100%)
6. **Minimum Wage Basis** - IRS baseline ($/hr, default: $5.15)

### Formulas

```javascript
// 1. Monthly cash wage
cashWageMonthly = cashWagePerHour × hoursPerMonth

// 2. Total monthly income
totalIncomeMonthly = cashWageMonthly / (1 - tipsPct)
tipsMonthly = totalIncomeMonthly - cashWageMonthly

// 3. Minimum wage baseline (IRS requirement)
baselineMonthly = minWageBasis × hoursPerMonth

// 4. Non-creditable tips
nonCreditableTips = max(0, baselineMonthly - cashWageMonthly)

// 5. Creditable tips
creditableTips = max(0, tipsMonthly - nonCreditableTips)

// 6. Apply FICA tax rate (7.65%)
creditRate = 0.0765

// 7. Monthly credit per server
monthlyCreditPerServer = creditableTips × creditRate

// 8. Annual and 3-year credits
annualCreditPerServer = monthlyCreditPerServer × 12
credit3yrPerServer = annualCreditPerServer × 3

// 9. Total credit across all servers and locations
totalCredit = credit3yrPerServer × servers × locations

// 10. Servers needed to reach $100k credit
serversFor100k = ceil(100000 / credit3yrPerServer)
```

### FICA Tax Rate
- Social Security: 6.2%
- Medicare: 1.45%
- **Total: 7.65%** (employer portion)

Note: We ignore the Social Security wage base cap for simplicity, consistent with the original calculator.

## Outputs

### Primary Result
- **Estimated 3-Year FICA Refund/Credit** - Total credit across all servers and locations

### Per Server Breakdown
- **Monthly Tips** - Tips earned per month
- **Tips Not Creditable** - Portion below IRS baseline
- **Creditable Tips** - Portion qualifying for credit
- **Monthly Credit** - Monthly credit amount per server
- **Annual Credit per Server** - Annual credit per server
- **3-Year Credit per Server** - 3-year total per server

### Server Income Details
- **Monthly Income** - Total monthly income (wages + tips)
- **Annual Income** - Total annual income
- **Effective Hourly Rate** - True hourly rate including tips
- **Servers Needed for $100k Credit** - How many servers to reach $100k

## Example Calculation

**Inputs:**
- Locations: 1
- Servers: 10
- Hours/Month: 173
- Cash Wage: $8.00/hr
- Tips %: 60%
- Min Wage Basis: $5.15/hr

**Results:**
```
Monthly Tips:           $2,075.00
Non-Creditable Tips:    $0.00
Creditable Tips:        $2,075.00
Monthly Credit:         $158.74
Annual Credit/Server:   $1,904.85
3-Year Credit/Server:   $5,714.55
Total 3-Year Credit:    $57,145.50

Monthly Income:         $3,458.33
Annual Income:          $41,500.00
Effective Hourly Rate:  $19.99/hr
Servers for $100k:      18
```

## Integration Examples

### Update index.html Navigation
Add calculator link to your main navigation:

```html
<div class="nav-links">
    <a href="index.html" class="nav-link">Home</a>
    <a href="calculator.html" class="nav-link">Calculator</a>
    <a href="faq.html" class="nav-link">FAQ</a>
    <a href="blog.html" class="nav-link">Blog</a>
</div>
```

### Embed in Existing Page
```html
<iframe
    src="calculator.html"
    width="100%"
    height="1200px"
    frameborder="0"
    title="FICA Tip Credit Calculator">
</iframe>
```

### Use with WordPress
1. Upload `calculator.html` to your WordPress site
2. Use iframe shortcode or HTML block to embed

### Use with React
```javascript
import FicaCalculator from './FicaCalculator';

// Use full component
<FicaCalculator />

// Or create custom UI with calculation function
import { calculateFicaTipCredit } from './FicaCalculator';
```

## Browser Compatibility
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅
- IE11: ❌ (not supported)

## Performance
- **Real-time calculations** - Updates as you type
- **No server required** - All calculations in browser
- **Fast** - Instant results, no delays
- **Lightweight** - ~50KB total

## Disclaimer
This calculator provides estimates only and is not tax or legal advice. Results should be verified by a qualified tax professional.

## Support
For questions or issues, contact: support@tipcreditpartners.com

## License
© 2025 Tip Tax Partner. All rights reserved.
