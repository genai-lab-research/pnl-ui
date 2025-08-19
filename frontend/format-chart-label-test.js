// Standalone test for formatChartLabel function

// Copy of the formatChartLabel function from dateFormatter.ts
function formatChartLabel(dateString, timeRange) {
  const date = new Date(dateString);
  
  switch (timeRange) {
    case 'week':
      // Return day abbreviation (Mon, Tue, Wed, etc.)
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    
    case 'month':
      // Return day of month for every 2nd day (1, 3, 5, 7, etc.)
      const day = date.getDate();
      return day % 2 === 1 ? day.toString() : '';
    
    case 'quarter':
      // Return month abbreviation (Jan, Feb, Mar)
      return date.toLocaleDateString('en-US', { month: 'short' });
    
    case 'year':
      // Return month name for yearly view
      return date.toLocaleDateString('en-US', { month: 'short' });
    
    default:
      return dateString;
  }
}

// Function to run tests and check results
function runTests() {
  // Test month time range
  console.log('Testing formatChartLabel function with month date range\n');
  console.log('Date\t\t|\tDay\t|\tExpected\t|\tActual\t\t|\tResult');
  console.log('--------------------------------------------------------------------------------');
  
  // Generate test dates for each day of a month
  const testDates = [];
  for (let day = 1; day <= 31; day++) {
    // Using 2024-07 as the test month (31 days)
    const date = new Date(2024, 6, day);
    testDates.push(date.toISOString().split('T')[0]);
  }
  
  // Run tests for each date
  let allPassed = true;
  let failures = [];
  
  testDates.forEach((dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    
    // Every second day (odd day) should have a label, others should be empty
    const expected = day % 2 === 1 ? day.toString() : '';
    const actual = formatChartLabel(dateString, 'month');
    const passed = actual === expected;
    
    if (!passed) {
      allPassed = false;
      failures.push(`Date ${dateString} (day ${day}): expected "${expected}", got "${actual}"`);
    }
    
    console.log(`${dateString}\t|\t${day}\t|\t"${expected}"\t\t|\t"${actual}"\t\t|\t${passed ? 'PASS' : 'FAIL'}`);
  });
  
  // Print all failures together at the end for easier debugging
  if (failures.length > 0) {
    console.log('\nFAILURES DETECTED:');
    failures.forEach(failure => console.log(`- ${failure}`));
  }
  
  // Also test the existing year time range to ensure other functionality still works
  console.log('\nTesting formatChartLabel function with year date range\n');
  console.log('Date\t\t|\tExpected\t|\tActual\t\t|\tResult');
  console.log('------------------------------------------------------------------');
  
  // Generate test dates for each month of the year
  const yearTestDates = [];
  for (let month = 0; month < 12; month++) {
    // Using 2024 as the test year and the 15th day of each month
    yearTestDates.push(new Date(2024, month, 15).toISOString().split('T')[0]);
  }
  
  // Expected month abbreviations
  const expectedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Run tests for year time range
  yearTestDates.forEach((dateString, index) => {
    const expected = expectedMonths[index];
    const actual = formatChartLabel(dateString, 'year');
    const passed = actual === expected;
    
    if (!passed) allPassed = false;
    
    console.log(`${dateString}\t|\t${expected}\t\t|\t${actual}\t\t|\t${passed ? 'PASS' : 'FAIL'}`);
  });
  
  console.log('\nSummary: All tests ' + (allPassed ? 'PASSED!' : 'FAILED!'));
  
  return allPassed;
}

// Run the tests
runTests();