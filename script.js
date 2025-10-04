// Utility: format plural labels
function label(value, singular, plural) {
  return value === 1 ? singular : plural;
}

// Main calculate handler
function calculate() {
  const dobInput = document.getElementById("dob");
  const ageResult = document.getElementById("ageResult");
  const countdown = document.getElementById("countdown");

  const dob = new Date(dobInput.value);
  if (!dobInput.value || Number.isNaN(dob.getTime())) {
    alert("Please select a valid Date of Birth.");
    return;
  }

  const today = new Date();
  // Age in years/months/days (calendar-aware)
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Absolute differences
  const diffMs = today - dob;
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const leftoverDays = totalDays % 7;
  const totalMonthsApprox = years * 12 + months; // calendar-aware months so far

  // Render age block
  ageResult.innerHTML = `
    <h2>📊 Your Age</h2>
    <ul class="result-list">
      <li><strong>Calendar age:</strong> ${years} ${label(years, "year", "years")}, ${months} ${label(months, "month", "months")}, ${days} ${label(days, "day", "days")}</li>
      <li><strong>Or:</strong> ${totalMonthsApprox} months</li>
      <li><strong>Or:</strong> ${totalWeeks} weeks, ${leftoverDays} days</li>
      <li><strong>Or:</strong> ${totalDays} days</li>
      <li><strong>Or:</strong> ${totalHours} hours</li>
      <li><strong>Or:</strong> ${totalMinutes} minutes</li>
      <li><strong>Or:</strong> ${totalSeconds} seconds</li>
    </ul>
  `;

  // Next birthday (same month/day as DOB)
  let nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  // Start/update countdown
  function updateCountdown() {
    const now = new Date();
    const msLeft = nextBirthday - now;

    if (msLeft <= 0) {
      countdown.innerHTML = `
        <h2>⏳ Next Birthday Countdown</h2>
        <div class="count-value">🎉 Happy Birthday! 🎉</div>
      `;
      return;
    }

    const days = Math.floor(msLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((msLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((msLeft / 1000) % 60);

    countdown.innerHTML = `
      <h2>⏳ Next Birthday Countdown</h2>
      <div class="count-value">
        ${days} ${label(days, "Day", "Days")}
        ${hours} ${label(hours, "Hour", "Hours")}
        ${minutes} ${label(minutes, "Minute", "Minutes")}
        ${seconds} ${label(seconds, "Second", "Seconds")}
      </div>
    `;
  }

  updateCountdown();
  // Clear any existing intervals before setting a new one
  if (window.__countdownInterval) {
    clearInterval(window.__countdownInterval);
  }
  window.__countdownInterval = setInterval(updateCountdown, 1000);
}

// Wire up button
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("calculateBtn");
  btn.addEventListener("click", calculate);
});

// Auto-update footer year
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  yearSpan.textContent = new Date().getFullYear();
});
