/**
 * Formats a date to a readable string in day month year format
 * @param {string|Date} dateStr - Date to format
 * @returns {string} Formatted date string
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
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
      margin: 0;
      padding: 0;
    }
    .no-print {
      display: none !important;
    }
    .section {
      margin-bottom: 4px;
    }
    .page-break {
      page-break-before: always;
    }
    .avoid-break {
      page-break-inside: avoid;
    }
    
    /* Footer positioning for printing */
    .footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #000;
      padding-top: 5px;
    }
    
    /* Ensure content doesn't overlap with footer */
    .content {
      margin-bottom: 40px; /* Adjust based on footer height */
    }
  }

  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    color: #333;
    line-height: 1.5;
    position: relative;
    counter-reset: page 1;
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
  
  .ticket-info-container {
    display: flex
    justify-content : space-between;
    margin-bottom: 12px;
  }

  .section {
    margin-bottom: 8px;
    page-break-inside: avoid;
  }

  .section-title {
    background-color: #f2f2f2;
    color: #333;
    padding: 8px 10px;
    font-weight: bold;
    border-radius: 4px;
    margin-bottom: 6px;
    border: 1px solid #ccc;
    font-size: 16px;
  }

  .info-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    margin-bottom: 15px;
  }

  .info-item {
    flex: 1 1 45%;
    margin-bottom: 4px;
  }

  .info-label {
    font-weight: 500;
    display: inline-block;
    margin-right: 4px;
    color: #333;
  }

  .info-value {
    display: inline-block;
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
    color: #333;
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
  }

  /* Styles for CMU header and logo */
  .cmu-header {
    width: 100%;
    margin-bottom: 0;
    padding-bottom: 5px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #555;
  }
  
  .cmu-logo-img {
    max-height: 50px; /* Further reduced from 50px */
    width: auto;
    margin-right: 15px;
  }

  .university-info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .republic-text {
    font-size: 12px;
    color: #333;
    margin-bottom: 1px;
  }

  .university-name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .university-address {
    font-size: 12px;
    color: #333;
    margin-top: 1px;
    font-style: italic;
  }

  .office-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-top: 8px;
    margin-bottom: 3px;
    text-transform: uppercase;
  }

  .report-title-header {
    font-size: 16px;
    font-weight: bold;
    margin-top: 3px;
    margin-bottom: 15px;
    text-transform: uppercase;
    text-align: center;
  }
  
  /* Fixed footer styles */
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: 12px;
    text-align: center;
    border-top: 1px solid #000;
    padding-top: 5px;
    background-color: white;
  }
  
  /* Counter styling for page numbers */
  .footer-content {
    width: 100%;
  }
  
  /* Page number counter */
  @page {
    counter-increment: page;
  }
  
  .pageNumber::after {
    content: counter(page);
  }
  
  
  .content {
    padding: 20px;
    padding-bottom: 60px; /* Provide space for footer */
  }
  
  .avoid-break {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    display: block;
  }
  
  .section {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  
  /* Make sure the signatures section doesn't break */
  .signatures-container {
    page-break-inside: avoid !important;
  }
`;
};

/**
 * Returns the path to the logo image
 * @returns {string} Path to the logo image
 */
const getLogoPath = () => {
  // In a web application, we need to use a relative URL from the web root
  // The absolute path C:\Users\Ritchel\Preventive-Maintenance-System-Project\public\assets\cmu1.png
  // becomes '/assets/cmu1.png' in a web context since 'public' is typically the web root
  return '/assets/cmu1.png';
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
              <td style="padding: 3px 5px;">${value || ' '}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Renders a group of related checklist items with server checklist style
 * @param {string} category - The category name
 * @param {Array} items - Array of [description, statusCode] pairs
 * @returns {string} HTML for the grouped items
 */
const renderGroup = (category, items) => {
  return items.map((item, index) => {
    const [description, statusCode] = item;
    return `
      <tr>
        ${index === 0 ? `<td rowspan="${items.length}">${category}</td>` : ''}
        <td>${description}</td>
        <td style="text-align:center">${renderCheck(statusCode, '1')}</td>
        <td style="text-align:center">${renderCheck(statusCode, '2')}</td>
        <td style="text-align:center">${renderCheck(statusCode, '3')}</td>
      </tr>
    `;
  }).join('');
};

/**
 * Renders checkmark for matching status values
 * @param {string} value - The current value
 * @param {string} checkValue - The value to check against
 * @returns {string} HTML for the checkmark if values match
 */
const renderCheck = (value, checkValue) => {
  // Convert to string for strict comparison 
  const stringValue = String(value || '');
  const stringCheckValue = String(checkValue || '');
  
  // Return a clear checkmark if values match
  return stringValue === stringCheckValue ? '<span class="checkmark">✓</span>' : '';
};

/**
 * Generates the HTML for the Maintenance Checklist section with server-style format
 * @param {Object} checklist - Checklist data object
 * @returns {string} HTML for the section
 */
const generateChecklistSection = (checklist) => {
  return `
  <div style="page-break-inside: avoid;">
  <div style="margin-bottom: 0; padding-bottom: 0;">
    <div style="text-align: center; font-weight: bold; margin-bottom: 5px; font-size: 14px;">ITEM CHECKLIST</div>
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
      <thead>
        <tr>
          <th style="border: 1px solid #000; padding: 2px; width: 5%; text-align: center; font-size: 12px;">ITEM #</th>
          <th style="border: 1px solid #000; padding: 2px; width: 18%; text-align: center; font-size: 12px;">TASK</th>
          <th style="border: 1px solid #000; padding: 2px; width: 52%; text-align: center; font-size: 12px;">DESCRIPTION</th>
          <th style="border: 1px solid #000; padding: 2px; width: 8%; text-align: center; font-size: 12px;">OK</th>
          <th style="border: 1px solid #000; padding: 2px; width: 8%; text-align: center; font-size: 12px;">REPAIR</th>
          <th style="border: 1px solid #000; padding: 2px; width: 9%; text-align: center; font-size: 12px;">N/A</th>
        </tr>
      </thead>
      <tbody>
      <!-- System Boot -->
        <tr>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">1</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">SYSTEM BOOT</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Boot system from a cold start. Monitor for errors and speed of entire boot proccess.</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.System_Boot === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.System_Boot === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.System_Boot === '3' ? '✓' : ''}</td>
        </tr>
        
        <!-- System Log-in -->
        <tr>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">2</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">System Log-in</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Monitor for errors, monitor log-in script</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.System_Log === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.System_Log === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.System_Log === '3' ? '✓' : ''}</td>
        </tr>
        
        <!-- Network Settings -->
        <tr>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; vertical-align: top; font-size: 12px;" rowspan="5">3</td>
          <td style="border: 1px solid #000; padding: 2px; vertical-align: top; font-size: 12px;" rowspan="5">Network Settings</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">TCP/IP or IPX settings are correct</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings2 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings2 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings2 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Domain Name</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings3 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings3 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings3 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Security Settings</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings4 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings4 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings4 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Client Configurations</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings5 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings5 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings5 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Computer Name</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings6 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings6 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Network_Settings6 === '3' ? '✓' : ''}</td>
        </tr>
        
        <!-- Computer Hardware Settings -->
        <tr>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; vertical-align: top; font-size: 12px;" rowspan="6">4</td>
          <td style="border: 1px solid #000; padding: 2px; vertical-align: top; font-size: 12px;" rowspan="6">Computer Hardware Settings</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Verify device manager settings</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings1 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings1 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings1 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">BIOS up-to-date</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings2 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings2 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings2 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Hard Disk</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings3 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings3 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings3 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">DVD, CD/RW drive firmware up-to-date</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings4 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings4 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings4 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Memory is OK</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings5 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings5 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings5 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Laptop: battery run time is normal</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings6 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings6 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Computer_Hardware_Settings6 === '3' ? '✓' : ''}</td>
        </tr>
        
        <!-- Browser/Proxy Settings -->
        <tr>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">5</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Browser/Proxy Settings</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Verify proper settings and operation</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Browser_Settings === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Browser_Settings === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Browser_Settings === '3' ? '✓' : ''}</td>
        </tr>
        
        <!-- Proper Software Loads -->
        <tr>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">6</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Proper Software loads</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Required software is installed and operating</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Proper_Software_Loads === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Proper_Software_Loads === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Proper_Software_Loads === '3' ? '✓' : ''}</td>
        </tr>
        
        <!-- Viruses and Malware -->
        <tr>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; vertical-align: top; font-size: 12px;" rowspan="2">7</td>
          <td style="border: 1px solid #000; padding: 2px; vertical-align: top; font-size: 12px;" rowspan="2">Viruses and Malware</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Anti-Virus installed</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Viruses_Malware1 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Viruses_Malware1 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Viruses_Malware1 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Virus scan done</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Viruses_Malware2 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Viruses_Malware2 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Viruses_Malware2 === '3' ? '✓' : ''}</td>
        </tr>
        
        <!-- Clearance -->
        <tr>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; vertical-align: top; font-size: 12px;" rowspan="4">8</td>
          <td style="border: 1px solid #000; padding: 2px; vertical-align: top; font-size: 12px;" rowspan="4">Clearance</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Unused software remove</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance1 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance1 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance1 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Temporary files remove</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance2 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance2 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance2 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Recycle Bin and Caches emptied</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance3 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance3 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance3 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Periphery devices clean</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance4 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance4 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Clearance4 === '3' ? '✓' : ''}</td>
        </tr>
        
        <!-- Interiors and cleaning -->
        <tr>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; vertical-align: top; font-size: 12px;" rowspan="5">9</td>
          <td style="border: 1px solid #000; padding: 2px; vertical-align: top; font-size: 12px;" rowspan="5">Interiors and cleaning</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Dust remove</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning1 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning1 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning1 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">No loose parts</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning2 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning2 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning2 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Airflow is OK</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning3 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning3 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning3 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Cables unplugged and re-plugged</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning4 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning4 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning4 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Fans are operating</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning5 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning5 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Interiors_Cleaning5 === '3' ? '✓' : ''}</td>
        </tr>
        
        <!-- Peripheral devices -->
        <tr>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; vertical-align: top; font-size: 12px;" rowspan="7">10</td>
          <td style="border: 1px solid #000; padding: 2px; vertical-align: top; font-size: 12px;" rowspan="7">Peripheral devices</td>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Mouse</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices1 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices1 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices1 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Keyboard</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices2 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices2 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices2 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Monitor</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices3 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices3 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices3 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">UPS</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices4 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices4 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices4 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Printer</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices5 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices5 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices5 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Telephone Extension</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices6 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices6 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices6 === '3' ? '✓' : ''}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 2px; font-size: 12px;">Fax</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices7 === '1' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices7 === '2' ? '✓' : ''}</td>
          <td style="border: 1px solid #000; padding: 2px; text-align: center; font-size: 12px;">${checklist.Peripheral_Devices7 === '3' ? '✓' : ''}</td>
        </tr>
        
        <!-- Summary/Recommendation -->
        <tr>
          <td style="border: 1px solid #000; padding: 3px; text-align: left; font-size: 12px;" colspan="6">
            <div style="margin-bottom: 3px;"><strong>Summary/Recommendation</strong></div>
            <div>${checklist.Summary || 'Unit is in good condition. Uninstall unnecessary applications'}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div style= "font-size: 12px;">Note: To be filled by Technician attending to ICT Equipment </div>
  </div>
`;
};

/**
 * Main function to print employee preventive maintenance details with fixed footer
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
  const fixedFooterDate = "12 February 2024";
  const iframeDoc = iframe.contentWindow.document;
  
  const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Preventive Maintenance Record - ${employee.emp_name || ''}</title>
  <style>
    ${getPrintStyles()}
    
    /* Additional styles for fixed page numbering */
    .page {
      position: relative;
      page-break-after: always;
      margin-bottom: 60px; /* Space for footer */
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    .page-footer {
      position: absolute;
      bottom: -40px;
      left: 0;
      width: 100%;
      border-top: 1px solid #000;
      padding-top: 5px;
      background-color: white;
      font-size: 12px;
    }
    
    @media print {
      .page {
        height: calc(100vh - 80px);
      }
    }
  </style>
</head>
<body>
  <!-- First Page with footer -->
  <div class="page">
    <!-- Header and First Page Content -->
    <div class="cmu-header">
      <img src="${getLogoPath()}" alt="Central Mindanao University" class="cmu-logo-img" />
      <div class="university-info">
        <div class="republic-text">Republic of the Philippines</div>
        <div class="university-name">CENTRAL MINDANAO UNIVERSITY</div>
        <div class="university-address">Musuan, Maramag, Bukidnon</div>
      </div>
    </div>

    <div style="margin-top: 8px;">
      <div class="office-title">OFFICE OF DIGITAL TRANSFORMATION</div>
      <div class="report-title-header">PREVENTIVE MAINTENANCE CHECKLIST</div>
    </div>

    <div style="display: flex; justify-content: space-between;">
      <div style="text-align: left; font-size: 14px;">Ticket #: ${employee.ticketnumber || 'N/A'}</div>
      <div style="text-align: right; font-size: 14px;">Date: ${formatDate(employee.date) || formatDate(new Date())}</div>
    </div>

    ${generateBasicInfoSection(formData)}
    ${generateEquipmentSection(formData)}
    ${generateOsSection(formData)}
    ${generateSoftwareSection(formData)}
    ${generateSpecsSection(formData)}
    
    <!-- First page footer -->
    <div class="page-footer">
      <table style="width: 100%; border: none;">
        <tr>
          <td style="width: 25%; text-align: left;">CMU-F-4-DTO-002</td>
          <td style="width: 30%; text-align: center;">${fixedFooterDate}</td>
          <td style="width: 25%; text-align: right;">Rev. 1</td>
          <td style="width: 20%; text-align: right;">Page 1 of 2</td>
        </tr>
      </table>
    </div>
  </div>
  
  <!-- Second Page with footer -->
  <div class="page">
    <!-- Second Page Content (Checklist) -->
    ${generateChecklistSection(checklist)}
  
    <!-- Signatures Section -->
    <div class="signatures-container">
      <table style="width: 100%; border: none; margin-top: 20px;">
        <tr>
          <!-- Checked by -->
          <td style="width: 45%; vertical-align: top; border: none; padding-right: 5%;">
            <div style="margin-bottom: 15px;"><strong>Checked by:</strong></div>
            <div style="text-align: center;">
            <div style="width: 90%; margin: 0 auto; margin-bottom: 20px; height: 40px;"></div>
              <div style="width: 90%; margin: 0 auto; text-align: center; height: auto; min-height: 24px; line-height: 1.2; text-transform: uppercase; font-size: 16px; font-weight: 500; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                ${formData.technician}
              </div>
              <div style="border-top: 1px solid #333; width: 90%; margin: 0 auto;"></div>
              <div style="text-align: center; margin-top: 4px; color: #333;">Signature over Printed Name</div>
              <div style="text-align: center; color: #333;">Technician</div>
            </div>
          </td>

          <!-- Conforme -->
          <td style="width: 45%; vertical-align: top; border: none;">
            <div style="margin-bottom: 15px;"><strong>Conforme:</strong></div>
            <div style="text-align: center;">
            <div style="width: 90%; margin: 0 auto; margin-bottom: 20px; height: 40px;"></div>
              <div style="width: 90%; margin: 0 auto; text-align: center; height: auto; min-height: 28px; line-height: 1.2; text-transform: uppercase; font-size: 16px; font-weight: 500; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                ${formData.userOperator || ' '}
              </div>
              <div style="border-top: 1px solid #333; width: 90%; margin: 0 auto;"></div>
              <div style="text-align: center; margin-top: 4px; color: #333;">Signature over Printed Name</div>
              <div style="text-align: center; color: #333;">End User</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <!-- Second page footer -->
    <div class="page-footer">
      <table style="width: 100%; border: none;">
        <tr>
          <td style="width: 25%; text-align: left;">CMU-F-4-DTO-002</td>
          <td style="width: 30%; text-align: center;">${fixedFooterDate}</td>
          <td style="width: 25%; text-align: right;">Rev. 1</td>
          <td style="width: 20%; text-align: right;">Page 2 of 2</td>
        </tr>
      </table>
    </div>
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
    
    // Remove the iframe after printing
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
      <!-- University Header with Logo -->
      <div class="cmu-header">
        <img src="${getLogoPath()}" alt="Central Mindanao University" class="cmu-logo-img" />
        <div class="university-info">
          <div class="republic-text">Republic of the Philippines</div>
          <div class="university-name">CENTRAL MINDANAO UNIVERSITY</div>
          <div class="university-address">Musuan, Maramag, Bukidnon</div>
        </div>
      </div>
      
      <div style="margin-top: 8px;">
        <div class="office-title">OFFICE OF DIGITAL TRANSFORMATION</div>
        <div class="report-title-header">PREVENTIVE MAINTENANCE CHECKLIST</div>
      </div>
      
      <div class="ticket-info-container">
        <div class="ticket-info">Ticket #: ${formData.ticketnumber || 'N/A'} &nbsp;&nbsp;&nbsp;&nbsp; Date: ${formatDate(formData.date) || formatDate(new Date())}</div>
      </div>
      
      ${generateBasicInfoSection(formData)}
      ${generateEquipmentSection(formData)}
      ${generateOsSection(formData)}
      ${generateSoftwareSection(formData)}
      <div class="page-break"></div>
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
            <div>${formData.technician || ''}</div>
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
