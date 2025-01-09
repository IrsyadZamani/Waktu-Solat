// scripts.js
const csvFilePath = 'jadual_waktu_solat_JAKIM.csv'; // Replace with your CSV file path

// Fetch and load CSV
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

function populateTable(csvData) {
    const rows = csvData.split('\n');
    const tableBody = document.getElementById('prayer-times-table');
    tableBody.innerHTML = '';

    const today = new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' });

    rows.slice(1).forEach(row => {
        if (row.trim()) {
            const cols = row.split(',');
            const tableRow = document.createElement('tr');

            cols.forEach((col, index) => {
                const tableCell = document.createElement('td');
                tableCell.textContent = col.trim();
                tableRow.appendChild(tableCell);

                // Highlight today's date
                if (index === 0 && col.trim() === today) {
                    tableRow.classList.add('highlight');
                }
            });

            tableBody.appendChild(tableRow);
        }
    });
}

// Refresh table data
function refreshTable() {
    loadCSV();
}

// Filter table by search
function filterTable() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const tableRows = document.querySelectorAll('#prayer-times-table tr');

    tableRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchValue) ? '' : 'none';
    });
}

// Download CSV function
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

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show Scroll to Top Button on Scroll
window.addEventListener('scroll', () => {
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (window.scrollY > 200) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCSV();
});
