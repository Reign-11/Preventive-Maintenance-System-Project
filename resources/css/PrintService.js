/**
 * Formats a date to a readable string
 * @param {string|Date} dateStr - Date to format
 * @returns {string} Formatted date string
 */
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  /**
   * Converts status codes to HTML-formatted status labels
   * @param {string} statusCode - Status code ('1', '2', '3')
   * @returns {string} HTML-formatted status label
   */
  const getStatusLabel = (statusCode) => {
    // Handle null, undefined, and empty values
    if (statusCode === null || statusCode === undefined || statusCode === '') {
      return '<span style="color: #95a5a6;">Not Checked</span>';
    }
    
    // Ensure we're working with a string
    const code = String(statusCode).trim();
    
    switch (code) {
      case '1':
        return '<span style="color: #27ae60; font-weight: bold;">OK</span>';
      case '2':
        return '<span style="color: #e74c3c; font-weight: bold;">Needs Repair</span>';
      case '3':
        return '<span style="color: #7f8c8d; font-style: italic;">N/A</span>';
      default:
        // Return a visible indication of an unexpected value
        return '<span style="color: #95a5a6;">Not Checked</span>';
    }
  };
  
  /**
   * Gets CSS styles for the printed document
   * @returns {string} CSS styles
   */
  const getPrintStyles = () => {
    return `
      @media print {
        @page {
          size: legal;
          margin: 1cm;
        }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
    }
    
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      line-height: 1.5;
    }
    
    .print-header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #333;
      padding-bottom: 10px;
      position: relative;
    }
    
    .organization-header {
      text-align: center;
      margin-bottom: 10px;
    }
    
    .organization-header h1 {
      margin: 0;
      font-size: 22px;
      color: #333;
    }
    
    .organization-header h2 {
      margin: 5px 0;
      font-size: 18px;
      color: #333;
    }
    
    .report-title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin: 15px 0 5px;
    }
    
    .ticket-info {
      font-size: 16px;
      margin: 5px 0;
    }
    
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .section-title {
      /* Removed background-color: #2c3e50; */
      background-color: #f2f2f2;
      color: #333; /* Changed from white to dark color */
      padding: 8px 10px;
      font-weight: bold;
      border-radius: 4px;
      margin-bottom: 10px;
      border: 1px solid #ccc; /* Added border for better visibility */
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .info-item {
      margin-bottom: 8px;
    }
    
    .info-label {
      font-weight: bold;
      color: #333; /* Changed from #2c3e50 to #333 */
    }
    
    .info-value {
      padding: 4px 0;
    }
    
    .specs-table, .checklist-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    
    .specs-table th, .specs-table td,
    .checklist-table th, .checklist-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    
    .specs-table th, .checklist-table th {
      background-color: #f2f2f2;
      color: #333; /* Changed from #2c3e50 to #333 */
    }
    
    .specs-table tr:nth-child(even),
    .checklist-table tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    .checklist-category {
      background-color: #eef2f7 !important;
      font-weight: bold;
    }
    
    .summary-box {
      border: 1px solid #ddd;
      padding: 15px;
      margin-top: 20px;
      border-radius: 4px;
      background-color: #f9f9f9;
    }
    
    .signature-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    
    .signature-line {
      border-top: 1px solid #333;
      width: 200px;
      text-align: center;
      padding-top: 5px;
      margin-top: 60px;
    }
    
    .signature-title {
      font-weight: bold;
    }
    
    .print-footer {
      margin-top: 30px;
      font-size: 12px;
      text-align: center;
      color: #7f8c8d;
      border-top: 1px solid #eee;
      padding-top: 10px;

  @media print {
      .section {
          margin-bottom: 4px;
      }
      }

      .section {
      margin-bottom: 8px; /* reduce section spacing */
      }

      .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 6px; /* reduce title spacing */
      }

      .info-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px; /* tighter spacing between items */
      }

      .info-item {
      flex: 1 1 45%; /* allow items to wrap nicely */
      margin-bottom: 4px; /* reduce item spacing */
      }

      .info-label {
      font-weight: 500;
      display: inline-block;
      margin-right: 4px;
      }

      .info-value {
      display: inline-block;
      }

    `;
  };
  
  /**
   * Generates the HTML for the Basic Information section
   * @param {Object} formData - Form data object
   * @returns {string} HTML for the section
   */
  const generateBasicInfoSection = (formData) => {
    return `
      <div class="section" style="margin-top: 0; padding-top: 0; page-break-before: avoid !important;">
        <div class="section-title" style="margin-top: 0;">Basic Information</div>
        <table class="specs-table" style="margin-top: 5px; font-size: 95%; width: 100%;">
          <tbody>
            <tr style="height: 22px;">
              <th style="padding: 3px 5px; width: 20%;">User/Operator</th>
              <td style="padding: 3px 5px;">${formData.userOperator || 'N/A'}</td>
            </tr>
            <tr style="height: 22px;">
              <th style="padding: 3px 5px; width: 20%;">Office/College/Unit</th>
              <td style="padding: 3px 5px;">${formData.officeUnit || 'N/A'}</td>
            </tr>
            <tr style="height: 22px;">
              <th style="padding: 3px 5px; width: 20%;">Department</th>
              <td style="padding: 3px 5px;">${formData.department || 'N/A'}</td>
            </tr>
            <tr style="height: 22px;">
              <th style="padding: 3px 5px; width: 20%;">Date Acquired</th>
              <td style="padding: 3px 5px;">${formatDate(formData.dateAcquired) || 'N/A'}</td>
            </tr>
            <tr style="height: 22px;">
              <th style="padding: 3px 5px; width: 20%;">PC Name</th>
              <td style="padding: 3px 5px;">${formData.pcName || 'N/A'}</td>
            </tr>
            <tr style="height: 22px;">
              <th style="padding: 3px 5px; width: 20%;">Equipment No</th>
              <td style="padding: 3px 5px;">${formData.equipment || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };
  
/**
 * Generates the HTML for the Equipment Installed section
 * @param {Object} formData - Form data object
 * @returns {string} HTML for the section
 */
const generateEquipmentSection = (formData) => {
  // Define the possible equipment options
  const equipmentOptions = ['CPU', 'Keyboard', 'Monitor', 'Mouse', 'Printer', 'UPS', 'AVR', 'Other'];
  
  return `
    <div class="section" style="margin-bottom: 0; padding-bottom: 0;">
      <div class="section-title">Equipment Installed:</div>
      <div class="info-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 5px; margin-bottom: 0;">
        ${equipmentOptions.map(item => {
          const isChecked = formData.equipmentInstalled && formData.equipmentInstalled.includes(item);
          return `
            <div class="info-item" style="display: flex; align-items: center; margin-bottom: 2px;">
              <div style="width: 14px; height: 14px; border: 1px solid #333; margin-right: 6px; display: flex; justify-content: center; align-items: center;">
                ${isChecked ? '<span style="font-weight: bold;">✓</span>' : ''}
              </div>
              <div class="info-value" style="font-size: 95%;">
                ${item}${item === 'Other' && isChecked && formData.other_equip ? ': ' + formData.other_equip : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};
  
/**
 * Generates the HTML for the Operating System section
 * @param {Object} formData - Form data object
 * @returns {string} HTML for the section
 */
const generateOsSection = (formData) => {
  const isWindows = formData.osInstalled === 'Windows 10' || formData.osInstalled === 'Windows 11';
  const osLabel = formData.osInstalled || 'N/A';
  const otherOS = formData.osInstalled === 'Other' && formData.other_os ? `: ${formData.other_os}` : '';
  const licenseStatus = isWindows ? `${formData.license == 1 ? 'Licensed' : 'Not Licensed'}` : '';

  return `
    <div class="section">
      <div class="section-title">Operating System</div>
      <div class="info-item" style="display: flex; align-items: center;">
        <div class="info-label" style="margin-right: 10px;">OS:</div>
        <div class="info-value" style="flex-grow: 1;">
          ${osLabel}${otherOS} ${licenseStatus ? `— ${licenseStatus}` : ''}
        </div>
      </div>
    </div>
  `;
};
  
  
/**
 * Generates the HTML for the Software Installed section
 * @param {Object} formData - Form data object
 * @returns {string} HTML for the section
 */
const generateSoftwareSection = (formData) => {
  // Define the possible software options
  const softwareOptions = ['Enrollment System', 'Adobe Reader', 'Word Processor', 'Media Player', 'Anti-Virus', 'Browser', 'Microsoft', 'Other'];
  
  return `
    <div class="section" style="margin-bottom: 0; padding-bottom: 0;">
      <div class="section-title">Software Application Installed:</div>
      <div class="info-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 5px; margin-bottom: 0;">
        ${softwareOptions.map(item => {
          const isChecked = formData.softwareInstalled && formData.softwareInstalled.includes(item);
          return `
            <div class="info-item" style="display: flex; align-items: center; margin-bottom: 2px;">
              <div style="width: 14px; height: 14px; border: 1px solid #333; margin-right: 6px; display: flex; justify-content: center; align-items: center;">
                ${isChecked ? '<span style="font-weight: bold;">✓</span>' : ''}
              </div>
              <div class="info-value" style="font-size: 95%;">
                ${item}${item === 'Other' && isChecked && formData.other_sys ? ': ' + formData.other_sys : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
};
  /**
   * Generates the HTML for the Desktop Specifications section
   * @param {Object} formData - Form data object
   * @returns {string} HTML for the section
   */
  const generateSpecsSection = (formData) => {
    return `
      <div class="section" style="margin-top: 0; padding-top: 0; page-break-before: avoid !important;">
        <div class="section-title" style="margin-top: 0;">Desktop Specifications</div>
        <table class="specs-table" style="margin-top: 5px; font-size: 95%; width: 100%;">
          <tbody>
            ${Object.entries(formData.desktopSpecs).map(([key, value]) => `
              <tr style="height: 22px;">
                <th style="padding: 3px 5px; width: 20%;">${key.replace(/([A-Z])/g, ' $1').trim()}</th>
                <td style="padding: 3px 5px;">${value || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };
  
  /**
   * Generates the HTML for the Maintenance Checklist section
   * @param {Object} checklist - Checklist data object
   * @returns {string} HTML for the section
   */
  const generateChecklistSection = (checklist) => {
    return `
      <div class="section">
        <div class="section-title">Maintenance Checklist</div>
        <table class="checklist-table">
          <thead>
            <tr>
              <th width="10%">ITEM#</th>
              <th width="25%">TASK</th>
              <th width="45%">DESCRIPTION</th>
              <th width="20%">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <!-- System Boot & Login -->
            <tr>
              <td>1</td>
              <td>System Boot</td>
              <td>Boot system from a cold start</td>
              <td>${getStatusLabel(checklist.System_Boot)}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>System Log-in</td>
              <td>Monitor for errors and speed of entire boot process</td>
              <td>${getStatusLabel(checklist.System_Log)}</td>
            </tr>

           <tr>
            <td>3</td>
            <td>Network Settings</td>
            <td>Monitor login script</td>
            <td>${getStatusLabel(checklist.Network_Settings1)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>TCP/IP and IPX settings are correct</td>
            <td>${getStatusLabel(checklist.Network_Settings2)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Domain Name</td>
            <td>${getStatusLabel(checklist.Network_Settings3)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Security Settings</td>
            <td>${getStatusLabel(checklist.Network_Settings4)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Client Configurations</td>
            <td>${getStatusLabel(checklist.Network_Settings5)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Computer Name</td>
            <td>${getStatusLabel(checklist.Network_Settings6)}</td>
            </tr>

            <!-- Hardware Settings -->
            <td>4</td>
            <td>Computer Hardware Settings</td>
            <td>Verify Device Manager settings</td>
            <td>${getStatusLabel(checklist.Computer_Hardware_Settings1)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>BIOS up-to-date</td>
            <td>${getStatusLabel(checklist.Computer_Hardware_Settings2)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Hard Disk</td>
            <td>${getStatusLabel(checklist.Computer_Hardware_Settings3)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>DVD/CD-RW firmware up-to-date</td>
            <td>${getStatusLabel(checklist.Computer_Hardware_Settings4)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Memory is O.K.</td>
            <td>${getStatusLabel(checklist.Computer_Hardware_Settings5)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>For Laptop battery run-time is norm</td>
            <td>${getStatusLabel(checklist.Computer_Hardware_Settings6)}</td>
            </tr>

            
            <!-- Browser Settings -->
            <tr>
              <td>5</td>
              <td>Browser/Proxy Settings</td>
              <td>Verify proper settings and operation</td>
              <td>${getStatusLabel(checklist.Browser_Settings)}</td>
            </tr>
            
            <!-- Software Loads -->
            <tr>
              <td>6</td>
              <td>Proper Software Loads</td>
              <td>Required software is installed and operating</td>
              <td>${getStatusLabel(checklist.Proper_Software_Loads)}</td>
            </tr>
            
            <!-- Viruses and Malware -->
            <td>7</td>
            <td>Viruses and Malware</td>
            <td>Anti-virus installed</td>
            <td>${getStatusLabel(checklist.Viruses_Malware1)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Virus scan done</td>
            <td>${getStatusLabel(checklist.Viruses_Malware2)}</td>
            </tr>

            <!-- Clearance -->
            <td>8</td>
            <td>Clearance</td>
            <td>Unused Software Removed</td>
            <td>${getStatusLabel(checklist.Clearance1)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Temporary files removed</td>
            <td>${getStatusLabel(checklist.Clearance2)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Cache Cleared</td>
            <td>${getStatusLabel(checklist.Clearance3)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Recycle Bin Emptied</td>
            <td>${getStatusLabel(checklist.Clearance4)}</td>
            </tr>

           <!-- Interiors and Cleaning -->
            <td>9</td>
            <td>Interiors and Cleaning</td>
            <td>Dust removed</td>
            <td>${getStatusLabel(checklist.Interiors_Cleaning1)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>No loose parts</td>
            <td>${getStatusLabel(checklist.Interiors_Cleaning2)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Airflow is O.K.</td>
            <td>${getStatusLabel(checklist.Interiors_Cleaning3)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Cables unplugged and re-plugged</td>
            <td>${getStatusLabel(checklist.Interiors_Cleaning4)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Fans are operating</td>
            <td>${getStatusLabel(checklist.Interiors_Cleaning5)}</td>
            </tr>

            
            <!-- Peripheral Devices -->
            <td>10</td>
            <td>Peripheral Devices</td>
            <td>Mouse</td>
            <td>${getStatusLabel(checklist.Peripheral_Devices1)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Keyboard</td>
            <td>${getStatusLabel(checklist.Peripheral_Devices2)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Monitor</td>
            <td>${getStatusLabel(checklist.Peripheral_Devices3)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>UPS</td>
            <td>${getStatusLabel(checklist.Peripheral_Devices4)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Printer</td>
            <td>${getStatusLabel(checklist.Peripheral_Devices5)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Telephone extension</td>
            <td>${getStatusLabel(checklist.Peripheral_Devices6)}</td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td>Fax</td>
            <td>${getStatusLabel(checklist.Peripheral_Devices7)}</td>
            </tr>

          </tbody>
        </table>
      </div>
    `;
  };
  
  /**
   * Main function to print employee preventive maintenance details - uses iframe instead of new window
   * @param {Object} employee - Employee data object
   * @param {Object} formData - Form data object
   * @param {Object} checklist - Checklist data object
   */
  const printPreventiveMaintenance = (employee, formData, checklist) => {
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Get the iframe document
    const iframeDoc = iframe.contentWindow.document;
    
    // Prepare HTML content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Preventive Maintenance Record - ${employee.emp_name || ''}</title>
        <style>${getPrintStyles()}</style>
      </head>
      <body>
        <div class="print-header">
          <div class="organization-header">
          </div>
          <div class="report-title">PREVENTIVE MAINTENANCE CHECKLIST</div>
          <div class="ticket-info">Ticket #: ${formData.ticketnumber || 'N/A'}</div>
          <div class="ticket-info">Date: ${formatDate(formData.date) || 'N/A'}</div>
        </div>
        
        ${generateBasicInfoSection(formData)}
        ${generateEquipmentSection(formData)}
        ${generateOsSection(formData)}
        ${generateSoftwareSection(formData)}
        ${generateSpecsSection(formData)}
        ${generateChecklistSection(checklist)}

        <div class="summary-box">
          <div class="info-label">Summary/Recommendation:</div>
          <div class="info-value">${checklist.Summary || 'No summary provided.'}</div>
        </div>
        
        <div class="signature-section">
          <div class="signature-item">
            <div class="signature-line">
              <div class="signature-title">Technician's Signature</div>
              <div>${employee.technician_name || ''}</div>
            </div>
          </div>
          <div class="signature-item">
            <div class="signature-line">
              <div class="signature-title">User's Signature</div>
              <div>${formData.userOperator || ''}</div>
            </div>
          </div>
          <div class="signature-item">
            <div class="signature-line">
              <div class="signature-title">Date</div>
              <div>${formatDate(new Date())}</div>
            </div>
          </div>
        </div>
        
        <div class="print-footer">
          This document was generated on ${formatDate(new Date())} by the Preventive Maintenance System.
        </div>
      </body>
      </html>
    `;
    
    // Write HTML to the iframe
    iframeDoc.open();
    iframeDoc.write(printContent);
    iframeDoc.close();
    
    // Wait for content to load before triggering print
    iframe.onload = function() {
      // Start printing
      iframe.contentWindow.print();
      
      // Remove the iframe after printing (with a delay to ensure printing completes)
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };
  
  /**
   * Alternative function that prints in the same page without opening new window
   * This can be used interchangeably with printPreventiveMaintenance
   */
  const printInPage = (employee, formData, checklist) => {
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Get the iframe document
    const iframeDoc = iframe.contentWindow.document;
    
    // Prepare HTML content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Preventive Maintenance Record - ${employee.emp_name || ''}</title>
        <style>${getPrintStyles()}</style>
      </head>
      <body>
        <div class="print-header">
          <div class="organization-header">
            <h1>DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY</h1>
            <h2>Information Technology Services</h2>
          </div>
          <div class="report-title">PREVENTIVE MAINTENANCE RECORD</div>
          <div class="ticket-info">Ticket #: ${formData.ticketnumber || 'N/A'}</div>
          <div class="ticket-info">Date: ${formatDate(formData.date) || 'N/A'}</div>
        </div>
        
        ${generateBasicInfoSection(formData)}
        ${generateEquipmentSection(formData)}
        ${generateOsSection(formData)}
        ${generateSoftwareSection(formData)}
        ${generateSpecsSection(formData)}
        ${generateChecklistSection(checklist)}
        
        <div class="summary-box">
          <div class="info-label">Summary/Recommendation:</div>
          <div class="info-value">${checklist.Summary || 'No summary provided.'}</div>
        </div>
        
        <div class="signature-section">
          <div class="signature-item">
            <div class="signature-line">
              <div class="signature-title">Technician's Signature</div>
              <div>${employee.technician_name || ''}</div>
            </div>
          </div>
          <div class="signature-item">
            <div class="signature-line">
              <div class="signature-title">User's Signature</div>
              <div>${formData.userOperator || ''}</div>
            </div>
          </div>
          <div class="signature-item">
            <div class="signature-line">
              <div class="signature-title">Date</div>
              <div>${formatDate(new Date())}</div>
            </div>
          </div>
        </div>
        
        <div class="print-footer">
          This document was generated on ${formatDate(new Date())} by the Preventive Maintenance System.
        </div>
      </body>
      </html>
    `;
    
    // Write HTML to the iframe
    iframeDoc.open();
    iframeDoc.write(printContent);
    iframeDoc.close();
    
    // Wait for content to load before triggering print
    iframe.onload = function() {
      // Start printing
      iframe.contentWindow.print();
      
      // Remove the iframe after printing (with a delay to ensure printing completes)
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };
  
  // Export the print service functions
  export default {
    printPreventiveMaintenance,
    printInPage, // Added the new function
    formatDate,
    getStatusLabel
  };