// Path to the CSV file
const csvFilePath = 'jadual_waktu_solat_JAKIM.csv'; // Replace with your actual CSV file path

// Fetch and load the CSV file
async function loadCSV() {
    try {
        const response = await fetch(csvFilePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvData = await response.text();
        populateTable(csvData);
    } catch (error) {
        console.error('Error loading CSV file:', error);
    }
}

// Populate the table with CSV data
function populateTable(csvData) {
    const rows = csvData.split('\n');
    const tableBody = document.getElementById('prayer-times-table');
    tableBody.innerHTML = ''; // Clear the table before populating

    rows.slice(1).forEach(row => {
        if (row.trim()) {
            const cols = row.split(',');
            const tableRow = document.createElement('tr');

            cols.forEach(col => {
                const tableCell = document.createElement('td');
                tableCell.textContent = col.trim();
                tableRow.appendChild(tableCell);
            });

            tableBody.appendChild(tableRow);
        }
    });

    filterTableByMonth(); // Filter table by the current month after loading
}

// Highlight today's date in the table
function highlightToday() {
    const today = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });
    const tableRows = document.querySelectorAll('#prayer-times-table tr');

    tableRows.forEach(row => {
        const dateCell = row.children[0]?.textContent;
        if (dateCell && dateCell.trim() === today) {
            row.classList.add('highlight');
        }
    });
}

// Filter table rows by the current month
function filterTableByMonth() {
    const tableRows = document.querySelectorAll('#prayer-times-table tr');
    const targetMonth = (currentMonth + 1).toString().padStart(2, '0'); // Format month as "01", "02", etc.

    tableRows.forEach(row => {
        const dateCell = row.children[0]?.textContent?.trim(); // Assumes the first cell contains the date
        if (dateCell) {
            let monthInRow = '';

            // Extract month from the date
            if (dateCell.includes('/')) {
                // Format: DD/MM/YYYY
                const dateParts = dateCell.split('/');
                monthInRow = dateParts[1]?.padStart(2, '0');
            } else if (dateCell.includes('-')) {
                // Format: YYYY-MM-DD
                const dateParts = dateCell.split('-');
                monthInRow = dateParts[1]?.padStart(2, '0');
            }

            // Show or hide the row based on the month
            if (monthInRow === targetMonth) {
                row.style.display = ''; // Show row
            } else {
                row.style.display = 'none'; // Hide row
            }
        } else {
            row.style.display = 'none'; // Hide rows with no date
        }
    });
}

// Navigate between months
function navigateMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11; // Wrap to December
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0; // Wrap to January
        currentYear++;
    }
    updateMonthLabel();
    filterTableByMonth();
}

// Update the month label in the UI
function updateMonthLabel() {
    const monthNames = [
        "Januari", "Februari", "Mac", "April", "Mei", "Jun", 
        "Julai", "Ogos", "September", "Oktober", "November", "Disember"
    ];

    // Update both labels
    const monthLabelTop = document.getElementById('month-label');
    const monthLabelBottom = document.getElementById('month-label2');

    const labelText = `${monthNames[currentMonth]} ${currentYear}`;
    monthLabelTop.textContent = labelText;
    monthLabelBottom.textContent = labelText;
}


// Search filter for table rows
function filterTable() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const tableRows = document.querySelectorAll('#prayer-times-table tr');

    tableRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchValue) ? '' : 'none';
    });
}

// Refresh the table
function refreshTable() {
    loadCSV();
}

// Download the table as a CSV file
function downloadCSV() {
    const tableRows = document.querySelectorAll('#prayer-times-table tr');
    let csvContent = 'Tarikh Miladi,Tarikh Hijri,Hari,Imsak,Subuh,Syuruk,Zohor,Asar,Maghrib,Isyak\n';

    tableRows.forEach(row => {
        const rowData = Array.from(row.children).map(cell => cell.textContent);
        csvContent += rowData.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Waktu_Solat.csv';
    link.click();
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show scroll-to-top button on scroll
window.addEventListener('scroll', () => {
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (window.scrollY > 200) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

// Variables to track the current month and year

let currentMonth = 0; // Start from January
const currentYear = 2025; // Fixed year

function navigateMonth(direction) {
    currentMonth += direction;

    // Restrict navigation to only 2025
    if (currentMonth < 0) {
        currentMonth = 0; // Stay at January
        alert("You cannot navigate before January 2025!");
    } else if (currentMonth > 11) {
        currentMonth = 11; // Stay at December
        alert("You cannot navigate after December 2025!");
    }

    updateMonthLabels(); // Update both labels
    refreshTable(); // Update table data if applicable
}

function updateMonthLabels() {
    const monthNames = [
        "Januari", "Februari", "Mac", "April", "Mei", "Jun",
        "Julai", "Ogos", "September", "Oktober", "November", "Disember"
    ];

    // Update both month labels
    document.getElementById('month-label').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    document.getElementById('month-label2').textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

// Initialize month labels
updateMonthLabels();


// Call updateMonthLabel to initialize the label
updateMonthLabel();

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    updateMonthLabel(); // Set the initial month label
    loadCSV(); // Load the CSV data into the table
});
