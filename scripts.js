// Path to the CSV file
const csvFilePath = 'jadual_waktu_solat_JAKIM.csv'; // Replace with your actual CSV file path

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

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
    highlightToday(); // Highlight today's date
}

// Highlight today's date in the table
function highlightToday() {
    // Get today's date
    const today = new Date();
    
    // Select all rows in the prayer times table
    const tableRows = document.querySelectorAll('#prayer-times-table tr');

    tableRows.forEach(row => {
        // Get the text content of the first column (the date)
        const dateCell = row.children[0]?.textContent?.trim();

        // Proceed if the date cell exists and has content
        if (dateCell) {
            // Split the date based on the format (either '/' or '-')
            const dateParts = dateCell.includes('/') ? dateCell.split('/') : dateCell.split('-');
            
            // Extract day, month, and year from the date parts
            const day = parseInt(dateParts[0]); // Day part
            const month = parseInt(dateParts[1]) - 1; // Month part (0-based index)
            const year = parseInt(dateParts[2]); // Year part

            // Create a Date object for the current row's date
            const rowDate = new Date(year, month, day);

            // Compare the row's date with today's date
            if (rowDate.toDateString() === today.toDateString()) {
                // Highlight the row if the dates match
                row.classList.add('highlight');
            }
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

    updateMonthLabel(); // Update the displayed month
}

// Navigate between months (restricted to 2025)
function navigateMonth(direction) {
    // Check if we're within the year 2025
    if (currentYear === 2025) {
        currentMonth += direction;

        // Prevent navigation before January 2025 or after December 2025
        if (currentMonth < 0) {
            currentMonth = 0; // Lock at January if trying to go back before January 2025
        } else if (currentMonth > 11) {
            currentMonth = 11; // Lock at December if trying to go beyond December 2025
        }

        // Update the displayed table and month label
        filterTableByMonth(); // Filter the table rows for the current month
        updateMonthLabel(); // Update the month label in the UI
    }
}

// Update the displayed month label
function updateMonthLabel() {
    const monthNames = [
        'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
        'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
    ];

    const monthLabel = document.getElementById('month-label');
    const monthLabel2 = document.getElementById('month-label2');

    const formattedLabel = `${monthNames[currentMonth]} ${currentYear}`;
    if (monthLabel) monthLabel.textContent = formattedLabel;
    if (monthLabel2) monthLabel2.textContent = formattedLabel;
}

// Filter table rows based on search input
function filterTable() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const tableRows = document.querySelectorAll('#prayer-times-table tr');

    tableRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(searchTerm)) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
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

// Function to fetch and download the PDF
document.getElementById('download-pdf').addEventListener('click', () => {
    const pdfUrl = 'jadual_waktu_solat_2025.pdf'; // Replace with the actual path to your PDF file

    // Create a hidden link element
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Jadual_Waktu_Solat_2025.pdf'; // Suggested filename for the downloaded file
    link.style.display = 'none';

    // Add the link to the body and trigger a click
    document.body.appendChild(link);
    link.click();

    // Clean up: remove the link after triggering the download
    document.body.removeChild(link);
});

function filterTable() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const tableRows = document.querySelectorAll('#prayer-times-table tr');

    // If the search bar is empty, automatically refresh the table
    if (searchTerm === '') {
        loadCSV(); // This will reload the original CSV and refresh the table
    } else {
        tableRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(searchTerm)) {
                row.style.display = ''; // Show row
            } else {
                row.style.display = 'none'; // Hide row
            }
        });
    }
}

// Scroll to the top of the page
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show the "Scroll to Top" button when scrolling down
window.addEventListener('scroll', () => {
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (window.scrollY > 300) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

// Load the CSV file when the page is ready
document.addEventListener('DOMContentLoaded', loadCSV);
