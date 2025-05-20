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
      max-height: 45px; /* Further reduced from 50px */
      width: auto;
      margin-right: 15px;
    }

    .university-info {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .republic-text {
      font-size: 11px;
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
      font-size: 11px;
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
    
    .ticket-info-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
  `;
};

/**
 * Returns the path to the logo image
 * @returns {string} Path to the logo image
 */
const getLogoPath = () => {
  return '/assets/cmu1.png';
};

export default {
  // Print any element by ID
  printElementById(elementId, title = 'Print Document') {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID ${elementId} not found`);
      return;
    }
    
    this.printElement(element, title);
  },
  
  // Print DOM element
  printElement(element, title = 'Print Document') {
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    
    if (!printWindow) {
      alert('Please allow pop-ups for printing functionality');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            ${getPrintStyles()}
          </style>
        </head>
        <body>
          ${element.outerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  },
  
  // Print network form data
  printNetworkForm(formData) {
    // Create a temporary div to hold the formatted content
    const tempDiv = document.createElement('div');
    tempDiv.className = 'network-form-print';
    
    // Add the university header with logo
    tempDiv.innerHTML = `
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
        <div class="report-title-header">NETWORK PREVENTIVE MAINTENANCE CHECKLIST</div>
      </div>
      
      <div class="ticket-info-container">
        <div class="ticket-info">Ticket #: ${formData.ticketnumber || 'N/A'}</div>
        <div class="ticket-info">Date: ${formatDate(formData.date || new Date())}</div>
      </div>
    `;
    
    // Add basic information section
    tempDiv.innerHTML += `
      <div class="section" style="margin-top: 0; padding-top: 0; page-break-before: avoid !important;">
        <div class="section-title" style="margin-top: 0;">Basic Information</div>
        <table class="specs-table" style="margin-top: 0px; font-size: 95%; width: 100%;">
          <tbody>
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
    
    // Add equipment installed section
    tempDiv.innerHTML += `
      <div class="section" style="margin-bottom: 0; padding-bottom: 0;">
        <div class="section-title">Equipment Installed:</div>
        <div class="info-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 5px; margin-bottom: 0;">
          ${['Router', 'Switch', 'Access Point', 'Modem', 'Network Cable', 'Patch Panel', 'Other'].map(item => {
            const isChecked = (formData.equipmentInstalled || []).includes(item);
            return `
              <div class="info-item" style="display: flex; align-items: center; margin-bottom: 2px;">
                <div style="width: 14px; height: 14px; border: 1px solid #333; margin-right: 6px; display: flex; justify-content: center; align-items: center;">
                  ${isChecked ? '<span style="font-weight: bold;">✓</span>' : ''}
                </div>
                <div class="info-value" style="font-size: 95%;">
                  ${item}${item === 'Other' && isChecked && formData.other_equipment ? ': ' + formData.other_equipment : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    
    // Add software installed section
    tempDiv.innerHTML += `
      <div class="section" style="margin-bottom: 0; padding-bottom: 0;">
        <div class="section-title">Software Application Installed:</div>
        <div class="info-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 5px; margin-bottom: 0;">
          ${['Network Monitoring Tool', 'Firewall Software', 'VPN Client', 'Network Configuration Tool', 'Manageable Software', 'Anti Virus', 'Other'].map(item => {
            const isChecked = (formData.softwareInstalled || []).includes(item);
            return `
              <div class="info-item" style="display: flex; align-items: center; margin-bottom: 2px;">
                <div style="width: 14px; height: 14px; border: 1px solid #333; margin-right: 6px; display: flex; justify-content: center; align-items: center;">
                  ${isChecked ? '<span style="font-weight: bold;">✓</span>' : ''}
                </div>
                <div class="info-value" style="font-size: 95%;">
                  ${item}${item === 'Other' && isChecked && formData.other_software ? ': ' + formData.other_software : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    
    // Add specifications section using the improved approach
    // Generate network specifications
    const fixedFooterDate = "12 February 2024";
    const generateNetworkSpecsSection = (specs) => {
      // Build network specifications array
      const networkSpecs = [];
      
      // Add regular specs (excluding special handling cases)
      for (const key in specs) {
        if (specs[key] !== null && key !== 'WifiBand' && key !== 'DHCP' && 
            !(key === 'IPv4' && specs.DHCP !== 'Yes') && 
            !(key === 'IPv6' && specs.DHCP !== 'Yes') &&
            !(key === 'Gateway' && specs.DHCP === 'Yes')) {
          
          const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          networkSpecs.push({ name: formattedKey, value: specs[key] });
        }
      }
      
      // Add DHCP and related fields
      if (specs.DHCP) {
        networkSpecs.push({ name: 'DHCP', value: specs.DHCP });
        
        if (specs.DHCP === 'Yes') {
          if (specs.IPv4) {
            networkSpecs.push({ name: 'IPv4', value: specs.IPv4 });
          }
          
          if (specs.IPv6) {
            networkSpecs.push({ name: 'IPv6', value: specs.IPv6 });
          }
        } else if (specs.DHCP === 'No' && specs.Gateway) {
          networkSpecs.push({ name: 'Gateway', value: specs.Gateway });
        }
      }
      
      // Add Wifi Band
      if (specs.WifiBand) {
        networkSpecs.push({ name: 'Wifi Band', value: specs.WifiBand });
      }
      
      return `
        <div class="section" style="margin-top: 0; padding-top: 0; page-break-before: avoid !important;">
          <div class="section-title" style="margin-top: 0;">Network Specifications</div>
          <table class="specs-table" style="margin-top: 5px; font-size: 95%; width: 100%;">
            <tbody>
              ${networkSpecs.map(spec => `
                <tr style="height: 22px;">
                  <th style="padding: 3px 5px; width: 20%;">${spec.name}</th>
                  <td style="padding: 3px 5px;">${spec.value || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    };
    
    // Add the network specs section to the output
    tempDiv.innerHTML += generateNetworkSpecsSection(formData.desktopSpecs || {});
    
    // Add signature section with page-break-inside: avoid to keep it on the same page
    tempDiv.innerHTML += `
      <div class="signature-section" style="page-break-inside: avoid; margin-top: 10px;">
        <table style="width: 100%; border-collapse: collapse; border: none;">
          <tr>
            <td style="width: 30%; text-align: center; padding-top: 50px; vertical-align: bottom;">
              <div style="border-top: 1px solid #333; display: inline-block; width: 80%; margin: 0 auto;">
                <div style="margin-top: 0px; font-weight: bold;">Technician's Signature</div>
              </div>
            </td>
            <td style="width: 30%; text-align: center; padding-top: 50px; vertical-align: bottom;">
              <div style="border-top: 1px solid #333; display: inline-block; width: 80%; margin: 0 auto;">
                <div style="margin-top: 0px; font-weight: bold;">User's Signature</div>
              </div>
            </td>
            <td style="width: 30%; text-align: center; padding-top: 50px; vertical-align: bottom;">
              <div style="border-top: 1px solid #333; display: inline-block; width: 80%; margin: 0 auto;">
                <div style="margin-top: 0px; font-weight: bold;">Date</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      
       <hr style="border: 1px solid #000; margin: 0;">
       
        <div class="footer" style="display: block;">
        <table style="width: 100%; border: none;">
        <tr>
          <td style="width: 25%; text-align: left;">CMU-F-4-DTO-002</td>
          <td style="width: 30%; text-align: center;">${fixedFooterDate}</td>
          <td style="width: 25%; text-align: right;">Rev. 1</td>
          <td style="width: 20%; text-align: right;">Page 1 of 2</td>
        </tr>
      </table>
    </div>
    `;
    
    // Print the content
    document.body.appendChild(tempDiv);
    
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
        <title>Network Preventive Maintenance Form</title>
        <style>${getPrintStyles()}</style>
      </head>
      <body>
        ${tempDiv.innerHTML}
        <script>
          window.onload = function() { 
            setTimeout(function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }, 500);
          };
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
      iframe.contentWindow.focus(); // Focus the iframe
      setTimeout(() => {
        iframe.contentWindow.print();
      }, 300);
      
      // Remove the iframe after printing (with a delay to ensure printing completes)
      setTimeout(() => {
        document.body.removeChild(iframe);
        document.body.removeChild(tempDiv);
      }, 1000);
    };
  }
};