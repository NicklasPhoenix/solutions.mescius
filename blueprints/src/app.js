import * as wijmo from 'wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.input';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import * as wjcGridGroup from 'wijmo/wijmo.grid.grouppanel';
import * as wjcXlsx from 'wijmo/wijmo.xlsx';
import * as wjcGridPdf from 'wijmo/wijmo.grid.pdf';

// Function to generate a large dataset for the grid
function getData(count) {
    let data = [];
    let countries = ['US', 'Germany', 'UK', 'Japan', 'Italy', 'Greece', 'Spain', 'Canada', 'China', 'Brazil'];
    let products = ['Widget', 'Gadget', 'Doohickey', 'Thingamajig', 'Whatchamacallit'];
    for (let i = 0; i < count; i++) {
        data.push({
            id: i,
            country: countries[i % countries.length],
            product: products[i % products.length],
            date: new Date(2023, i % 12, i % 28),
            amount: Math.random() * 10000,
            active: i % 5 === 0
        });
    }
    return data;
}

// Initialize Wijmo components once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create a CollectionView to manage the data. Default to 100,000 rows as requested.
    let cv = new wijmo.CollectionView(getData(100000)); 

    // Initialize the FlexGrid component
    let theGrid = new wjcGrid.FlexGrid('#theGrid', {
        autoGenerateColumns: true, // Automatically create columns based on data
        itemsSource: cv, // Bind the grid to the CollectionView
        allowSorting: true, // Enable column sorting
        allowResizing: wjcGrid.AllowResizing.Columns, // Allow column resizing
        isReadOnly: false, // Allow editing
        selectionMode: wjcGrid.SelectionMode.Row // Select entire rows
    });

    // Add filtering functionality to the grid
    let filter = new wjcGridFilter.FlexGridFilter(theGrid);

    // Add GroupPanel functionality to allow users to drag columns for grouping
    let groupPanel = new wjcGridGroup.GroupPanel('#theGroupPanel', {
        grid: theGrid, // Link to the FlexGrid instance
        placeholder: 'Drag columns here to group by' // Text displayed when no grouping is applied
    });

    // Initialize the search input control
    let theSearch = new wjcInput.InputMask('#theSearch', {
        placeholder: 'Search grid...', // Placeholder text for the search box
        // Event handler for when the search input value changes
        valueChanged: (sender) => {
            let search = sender.text.toLowerCase(); // Get search text and convert to lowercase
            if (search) {
                // Apply a filter to the CollectionView based on the search text
                cv.filter = (item) => {
                    // Iterate through each property of the data item
                    for (let key in item) {
                        // Check if the item property exists and contains the search text (case-insensitive)
                        if (item[key] && item[key].toString().toLowerCase().indexOf(search) > -1) {
                            return true; // Include the item if a match is found
                        }
                    }
                    return false; // Exclude the item if no match is found
                };
            } else {
                cv.filter = null; // Remove the filter if search text is empty
            }
        }
    });

    // Initialize the ComboBox for changing the number of items in the grid
    let itemsCount = new wjcInput.ComboBox('#itemsCount', {
        itemsSource: ['5', '50', '500', '5000', '50000', '100000'], // Available options
        selectedValue: '100000', // Set initial selected value to 100,000
        // Event handler for when the selected item count changes
        selectedIndexChanged: (sender) => {
            // Update the grid's data source with a new dataset of the selected size
            cv.sourceCollection = getData(parseInt(sender.selectedValue));
        }
    });

    // Event listener for the "Export To Excel" button
    document.getElementById('btnExportToExcel').addEventListener('click', () => {
        // Use FlexGridXlsxConverter to export grid data to an Excel file
        wjcXlsx.FlexGridXlsxConverter.saveAsync(theGrid, {
            includeColumnHeaders: true, // Include column headers in the export
            includeRowHeaders: true // Include row headers in the export
        }, 'FlexGrid.xlsx'); // File name for the exported Excel file
    });

    // Event listener for the "Export To PDF" button
    document.getElementById('btnExportToPdf').addEventListener('click', () => {
        // Use FlexGridPdfConverter to export grid data to a PDF file
        wjcGridPdf.FlexGridPdfConverter.export(theGrid, 'FlexGrid.pdf', {
            maxPages: 10, // Limit the number of pages to export to prevent excessively large PDFs
            documentOptions: {
                info: {
                    title: 'FlexGrid Report' // Title for the PDF document
                }
            }
        });
    });
});
