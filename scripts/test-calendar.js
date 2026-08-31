const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const daysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
const startDay = (d) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

// Simulating today is August 31, 2026
let currentMonth = new Date(2026, 7, 31); // August 31, 2026
console.log('Initial Month:', monthNames[currentMonth.getMonth()], currentMonth.getFullYear());
console.log('Initial Start Day index:', startDay(currentMonth)); // Should be 6 (Saturday)
console.log('Initial Days in Month:', daysInMonth(currentMonth)); // Should be 31

// User clicks Next Month
currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
console.log('After Next Month click:', monthNames[currentMonth.getMonth()], currentMonth.getFullYear());
console.log('Start Day index:', startDay(currentMonth)); // Should be 2 (Tuesday)
console.log('Days in Month:', daysInMonth(currentMonth)); // Should be 30
