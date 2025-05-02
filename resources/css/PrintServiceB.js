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
    
    .university-logo {
      width: 100%;
      max-width: 600px;
      margin: 0 auto 10px;
      display: block;
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
    
    .ticket-info-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
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
      background-color: #f2f2f2;
      color: #333;
      padding: 8px 10px;
      font-weight: bold;
      border-radius: 4px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
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
      color: #333;
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

    @media print {
      .section {
        margin-bottom: 4px;
      }
    }

    .section {
      margin-bottom: 8px;
    }

    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 6px;
    }

    .info-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
    }

    .info-item {
      flex: 1 1 45%;
      margin-bottom: 4px;
    }

    .info-label {
      font-weight: 500;
      display: inline-block;
      margin-right: 4px;
    }

    .info-value {
      display: inline-block;
    }

    .signature-subtitle {
    font-size: 12px;
    margin-top: 3px;
    }
    
    /* Added styles for logo */
    .cmu-header {
      width: 100%;
      margin-bottom: 0;
      padding-bottom: 5px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #555;
    }
    
    .cmu-logo-img {
      max-height: 70px;
      width: auto;
      margin-right: 10px;
    }

    .university-info {
      display: flex;
      flex-direction: column;
    }

    .republic-text {
      font-size: 12px;
      color: #333;
      margin-bottom: 2px;
    }

    .university-name {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      margin: 0;
      text-transform: uppercase;
    }

    .university-address {
      font-size: 12px;
      color: #333;
      margin-top: 2px;
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
 * @param {Object} equipment - Equipment data object
 * @returns {string} HTML for the section
 */
const generateBasicInfoSection = (equipment) => {
  return `
    <div class="section" style="margin-top: 0; padding-top: 0; page-break-before: avoid !important;">
      <div class="section-title" style="margin-top: 0;">Basic Information</div>
      <table class="specs-table" style="margin-top: 5px; font-size: 95%; width: 100%;">
        <tbody>
          <tr style="height: 22px;">
            <th style="padding: 3px 5px; width: 20%;">Office/College/Unit</th>
            <td style="padding: 3px 5px;">${equipment.OfficeName || 'N/A'}</td>
          </tr>
          <tr style="height: 22px;">
            <th style="padding: 3px 5px; width: 20%;">Department</th>
            <td style="padding: 3px 5px;">${equipment.department_name || 'N/A'}</td>
          </tr>
          <tr style="height: 22px;">
            <th style="padding: 3px 5px; width: 20%;">Date Acquired</th>
            <td style="padding: 3px 5px;">${formatDate(equipment.date_acquired) || 'N/A'}</td>
          </tr>
          <tr style="height: 22px;">
            <th style="padding: 3px 5px; width: 20%;">PC Name</th>
            <td style="padding: 3px 5px;">${equipment.pcName || 'N/A'}</td>
          </tr>
          <tr style="height: 22px;">
            <th style="padding: 3px 5px; width: 20%;">Equipment No</th>
            <td style="padding: 3px 5px;">${equipment.equipmentId || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Generates the HTML for the Equipment Installed section
 * @param {Object} equipment - Equipment data object
 * @returns {string} HTML for the section
 */
const generateEquipmentSection = (equipment) => {
  // Define the possible equipment options
  const equipmentOptions = ['CPU', 'Keyboard', 'Monitor', 'Mouse', 'Printer', 'UPS', 'AVR', 'Other'];
  
  // Build equipment array from object properties
  const equipmentInstalled = [];
  if (equipment.cpu_status == 1) equipmentInstalled.push('CPU');
  if (equipment.monitor_status == 1) equipmentInstalled.push('Monitor');
  if (equipment.mouse_status == 1) equipmentInstalled.push('Mouse');
  if (equipment.keyboard_status == 1) equipmentInstalled.push('Keyboard');
  if (equipment.printer_status == 1) equipmentInstalled.push('Printer');
  if (equipment.ups_status == 1) equipmentInstalled.push('UPS');
  if (equipment.avr_status == 1) equipmentInstalled.push('AVR');
  if (equipment.other_equip) equipmentInstalled.push('Other');
  
  return `
    <div class="section" style="margin-bottom: 0; padding-bottom: 0;">
      <div class="section-title">Equipment Installed:</div>
      <div class="info-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 5px; margin-bottom: 0;">
        ${equipmentOptions.map(item => {
          const isChecked = equipmentInstalled.includes(item);
          return `
            <div class="info-item" style="display: flex; align-items: center; margin-bottom: 2px;">
              <div style="width: 14px; height: 14px; border: 1px solid #333; margin-right: 6px; display: flex; justify-content: center; align-items: center;">
                ${isChecked ? '<span style="font-weight: bold;">✓</span>' : ''}
              </div>
              <div class="info-value" style="font-size: 95%;">
                ${item}${item === 'Other' && isChecked && equipment.other_equip ? ': ' + equipment.other_equip : ''}
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
 * @param {Object} equipment - Equipment data object
 * @returns {string} HTML for the section
 */
const generateOsSection = (equipment) => {
  // Build OS information
  let osInstalled = 'None';
  if (equipment.windows10 == 1) osInstalled = 'Windows 10';
  else if (equipment.windows11 == 1) osInstalled = 'Windows 11';
  else if (equipment.other_os) osInstalled = `Other: ${equipment.other_os}`;
  
  const isWindows = osInstalled.includes('Windows');
  const otherOS = equipment.other_os ? `: ${equipment.other_os}` : '';
  const licenseStatus = isWindows ? `${equipment.license == 1 ? 'Licensed' : 'Not Licensed'}` : '';

  return `
    <div class="section">
      <div class="section-title">Operating System</div>
      <div class="info-item" style="display: flex; align-items: center;">
        <div class="info-label" style="margin-right: 10px;">OS:</div>
        <div class="info-value" style="flex-grow: 1;">
          ${osInstalled} ${licenseStatus ? `— ${licenseStatus}` : ''}
        </div>
      </div>
    </div>
  `;
};

/**
 * Generates the HTML for the Software Installed section
 * @param {Object} equipment - Equipment data object
 * @returns {string} HTML for the section
 */
const generateSoftwareSection = (equipment) => {
  // Define the possible software options
  const softwareOptions = ['Enrollment System', 'Adobe Reader', 'Word Processor', 'Media Player', 'Anti-Virus', 'Browser', 'Microsoft', 'Other'];
  
  // Build software array from object properties
  const softwareInstalled = [];
  if (equipment.enrollment == 1) softwareInstalled.push('Enrollment System');
  if (equipment.adobe_reader == 1) softwareInstalled.push('Adobe Reader');
  if (equipment.word_processor == 1) softwareInstalled.push('Word Processor');
  if (equipment.media_player == 1) softwareInstalled.push('Media Player');
  if (equipment.anti_virus == 1) softwareInstalled.push('Anti-Virus');
  if (equipment.browser == 1) softwareInstalled.push('Browser');
  if (equipment.microsoft == 1) softwareInstalled.push('Microsoft');
  if (equipment.other_sys) softwareInstalled.push('Other');
  
  return `
    <div class="section" style="margin-bottom: 0; padding-bottom: 0;">
      <div class="section-title">Software Application Installed:</div>
      <div class="info-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 5px; margin-bottom: 0;">
        ${softwareOptions.map(item => {
          const isChecked = softwareInstalled.includes(item);
          return `
            <div class="info-item" style="display: flex; align-items: center; margin-bottom: 2px;">
              <div style="width: 14px; height: 14px; border: 1px solid #333; margin-right: 6px; display: flex; justify-content: center; align-items: center;">
                ${isChecked ? '<span style="font-weight: bold;">✓</span>' : ''}
              </div>
              <div class="info-value" style="font-size: 95%;">
                ${item}${item === 'Other' && isChecked && equipment.other_sys ? ': ' + equipment.other_sys : ''}
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
 * @param {Object} equipment - Equipment data object
 * @returns {string} HTML for the section
 */
const generateSpecsSection = (equipment) => {
  // Build hardware specifications
  const hardwareSpecs = [
    { name: 'Processor', value: equipment.processor_details },
    { name: 'Motherboard', value: equipment.motherboard_details },
    { name: 'Memory', value: equipment.memory_details },
    { name: 'Graphics Card', value: equipment.graphics_card_details },
    { name: 'Hard Disk', value: equipment.hard_disk_details },
    { name: 'Monitor', value: equipment.monitor_details },
    { name: 'Casing', value: equipment.casing_details },
    { name: 'Power Supply', value: equipment.power_supply_details },
    { name: 'Keyboard', value: equipment.keyboard_details },
    { name: 'Mouse', value: equipment.mouse_details },
    { name: 'AVR', value: equipment.avr_details },
    { name: 'UPS', value: equipment.ups_details },
    { name: 'Printer', value: equipment.printer_details },
    { name: 'Network/MAC/IP', value: equipment.network_mac_ip_details }
  ].filter(spec => spec.value); // Only include specs that have values

  return `
    <div class="section" style="margin-top: 0; padding-top: 0; page-break-before: avoid !important;">
      <div class="section-title" style="margin-top: 0;">Desktop Specifications</div>
      <table class="specs-table" style="margin-top: 5px; font-size: 95%; width: 100%;">
        <tbody>
          ${hardwareSpecs.map(spec => `
            <tr style="height: 22px;">
              <th style="padding: 3px 5px; width: 20%;">${spec.name}</th>
              <td style="padding: 3px 5px;">${spec.value || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Generates the HTML for the Maintenance Checklist section
 * @param {Object} equipment - Equipment data object
 * @returns {string} HTML for the section
 */
const generateChecklistSection = (equipment) => {
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
            <td>${getStatusLabel(equipment.System_Boot)}</td>
          </tr>
          <tr>
            <td>2</td>
            <td>System Log-in</td>
            <td>Monitor for errors and speed of entire boot process</td>
            <td>${getStatusLabel(equipment.System_Log)}</td>
          </tr>

          <tr>
            <td>3</td>
            <td>Network Settings</td>
            <td>Monitor login script</td>
            <td>${getStatusLabel(equipment.Network_Settings1)}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>TCP/IP and IPX settings are correct</td>
            <td>${getStatusLabel(equipment.Network_Settings2)}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>Domain Name</td>
            <td>${getStatusLabel(equipment.Network_Settings3)}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>Security Settings</td>
            <td>${getStatusLabel(equipment.Network_Settings4)}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>Client Configurations</td>
            <td>${getStatusLabel(equipment.Network_Settings5)}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>Computer Name</td>
            <td>${getStatusLabel(equipment.Network_Settings6)}</td>
          </tr>

          <!-- Hardware Settings -->
          <td>4</td>
          <td>Computer Hardware Settings</td>
          <td>Verify Device Manager settings</td>
          <td>${getStatusLabel(equipment.Computer_Hardware_Settings1)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>BIOS up-to-date</td>
          <td>${getStatusLabel(equipment.Computer_Hardware_Settings2)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Hard Disk</td>
          <td>${getStatusLabel(equipment.Computer_Hardware_Settings3)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>DVD/CD-RW firmware up-to-date</td>
          <td>${getStatusLabel(equipment.Computer_Hardware_Settings4)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Memory is O.K.</td>
          <td>${getStatusLabel(equipment.Computer_Hardware_Settings5)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>For Laptop battery run-time is norm</td>
          <td>${getStatusLabel(equipment.Computer_Hardware_Settings6)}</td>
          </tr>

          <!-- Browser Settings -->
          <tr>
            <td>5</td>
            <td>Browser/Proxy Settings</td>
            <td>Verify proper settings and operation</td>
            <td>${getStatusLabel(equipment.Browser_Settings)}</td>
          </tr>
          
          <!-- Software Loads -->
          <tr>
            <td>6</td>
            <td>Proper Software Loads</td>
            <td>Required software is installed and operating</td>
            <td>${getStatusLabel(equipment.Proper_Software_Loads)}</td>
          </tr>
          
          <!-- Viruses and Malware -->
          <td>7</td>
          <td>Viruses and Malware</td>
          <td>Anti-virus installed</td>
          <td>${getStatusLabel(equipment.Viruses_Malware1)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Virus scan done</td>
          <td>${getStatusLabel(equipment.Viruses_Malware2)}</td>
          </tr>

          <!-- Clearance -->
          <td>8</td>
          <td>Clearance</td>
          <td>Unused Software Removed</td>
          <td>${getStatusLabel(equipment.Clearance1)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Temporary files removed</td>
          <td>${getStatusLabel(equipment.Clearance2)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Cache Cleared</td>
          <td>${getStatusLabel(equipment.Clearance3)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Recycle Bin Emptied</td>
          <td>${getStatusLabel(equipment.Clearance4)}</td>
          </tr>

          <!-- Interiors and Cleaning -->
          <td>9</td>
          <td>Interiors and Cleaning</td>
          <td>Dust removed</td>
          <td>${getStatusLabel(equipment.Interiors_Cleaning1)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>No loose parts</td>
          <td>${getStatusLabel(equipment.Interiors_Cleaning2)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Airflow is O.K.</td>
          <td>${getStatusLabel(equipment.Interiors_Cleaning3)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Cables unplugged and re-plugged</td>
          <td>${getStatusLabel(equipment.Interiors_Cleaning4)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Fans are operating</td>
          <td>${getStatusLabel(equipment.Interiors_Cleaning5)}</td>
          </tr>

          <!-- Peripheral Devices -->
          <td>10</td>
          <td>Peripheral Devices</td>
          <td>Mouse</td>
          <td>${getStatusLabel(equipment.Peripheral_Devices1)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Keyboard</td>
          <td>${getStatusLabel(equipment.Peripheral_Devices2)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Monitor</td>
          <td>${getStatusLabel(equipment.Peripheral_Devices3)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>UPS</td>
          <td>${getStatusLabel(equipment.Peripheral_Devices4)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Printer</td>
          <td>${getStatusLabel(equipment.Peripheral_Devices5)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Telephone extension</td>
          <td>${getStatusLabel(equipment.Peripheral_Devices6)}</td>
          </tr>
          <tr>
          <td></td>
          <td></td>
          <td>Fax</td>
          <td>${getStatusLabel(equipment.Peripheral_Devices7)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Prints equipment details using iframe for direct printing
 * 
 * @param {Object} equipment - The equipment object to print
 * @param {Boolean} includeSummary - Whether to include the summary/checklist section
 * @param {Boolean} printImmediately - Whether to print immediately without showing the page
 */
const printEquipmentDetails = (equipment, includeSummary = true, printImmediately = true) => {
  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  // Get the iframe document
  const iframeDoc = iframe.contentWindow.document;
  
  // Get current date for the printed document
  const currentDate = new Date().toLocaleDateString();
  
  // Prepare HTML content for printing
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Preventive Maintenance Report - ${equipment.equipmentId || 'N/A'}</title>
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
        <div class="ticket-info">Ticket #: ${equipment.ticketnumber || 'N/A'}</div>
        <div class="ticket-info">Date: ${formatDate(equipment.date) || formatDate(new Date())}</div>
      </div>
      
      ${generateBasicInfoSection(equipment)}
      ${generateEquipmentSection(equipment)}
      ${generateOsSection(equipment)}
      ${generateSoftwareSection(equipment)}
      ${generateSpecsSection(equipment)}
      ${includeSummary ? generateChecklistSection(equipment) : ''}
      
      ${equipment.Summary ? `
      <div class="summary-box">
        <div class="info-label">Summary/Recommendation:</div>
        <div class="info-value">${equipment.Summary || 'No summary provided.'}</div>
      </div>
      ` : ''}
      
      <div class="signature-section">
        <div class="signature-item">
          <div class="signature-line">
            <div class="signature-title">Technician's Signature</div>
            <div></div>
          </div>
        </div>
        <div class="signature-item">
          <div class="signature-line">
            <div class="signature-title">User's Signature</div>
            <div></div>
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

      <script>
        ${printImmediately ? 'window.onload = function() { window.print(); };' : ''}
      </script>
    </body>
    </html>
  `;
  
  // Write HTML to the iframe
  iframeDoc.open();
  iframeDoc.write(printContent);
  iframeDoc.close();
  
  // Wait for content to load before triggering print
  iframe.onload = function() {
    // Make sure print triggers
    if (printImmediately) {
      iframe.contentWindow.focus(); // Focus the iframe
      setTimeout(() => {
        iframe.contentWindow.print();
      }, 300);
    }
    
    // Remove the iframe after printing (with a delay to ensure printing completes)
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
};

// Export the service
export default {
  printEquipmentDetails,
  formatDate,
  getStatusLabel
};
