async function fetchIslamicDate() {
    try {
      // Get today's Gregorian date
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1; // Months are 0-indexed
      const year = today.getFullYear();
  
      // Construct API URL for today's date
      const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`;
  
      // Fetch the date data
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      // Extract Hijri and Gregorian dates
      const islamicDate = data.data.hijri;
      const gregorianDate = data.data.gregorian;
  
      // Update the DOM with fetched dates
      document.getElementById('islamic-date').textContent =
        `${islamicDate.day} ${islamicDate.month.en} ${islamicDate.year} AH`;
      document.getElementById('gregorian-date').textContent =
        `Gregorian Date: ${gregorianDate.date}`;
    } catch (error) {
      console.error("Error fetching Islamic date:", error);
      document.getElementById('islamic-date').textContent = "Error fetching date.";
    }
  }
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', fetchIslamicDate);
  