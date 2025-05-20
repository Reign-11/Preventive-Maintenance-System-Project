<script setup>
import { ref, computed, defineProps, reactive, watchEffect, watch } from 'vue'; 
import MainLayout from '@/Layouts/MainLayout.vue';

const props = defineProps({
  departments: { type: Array, default: () => [] },  
  pmYear: { type: Object, default: () => ({}) },
  YrId: { type: [String, Number], default: null },
  PlanId: { type: [String, Number], default: null },
  office: { type: Object, default: () => ({}) },
  deptId: { type: [String, Number], default: null },
  categoryId: { type: [String, Number], default: null }
});

const selectedDepartments = ref(null);
const selectedPmYear = computed(() => props.pmYear ?? {});
const departments = ref(props.departments || []);
const selectedPlan = ref(props.PlanId || '');
const selectedDeptId = ref(props.deptId ?? null);
const selectedCategoryId = ref(props.categoryId ?? 2);

watchEffect(() => {
  if (!selectedDeptId.value && props.departments?.length > 0) {
    selectedDeptId.value = props.departments[0].DeptId;
  }
  if (!selectedCategoryId.value) {
    selectedCategoryId.value = 2;
  }
});

watchEffect(() => {
  selectedPlan.value = props.PlanId || '';
});

watchEffect(() => {
  departments.value = props.departments || [];
});

const isStep1ModalOpen = ref(false);
const openStep1Modal = (checkId) => {
  selectedDepartments.value = departments.value.find(dep => dep.checkId === checkId);
  isStep1ModalOpen.value = true;
  disableBackgroundScroll();
};

const closeModal = () => {
  isStep1ModalOpen.value = false;
  enableBackgroundScroll();
};

const disableBackgroundScroll = () => {
  document.body.style.overflow = 'hidden';
};

const enableBackgroundScroll = () => {
  document.body.style.overflow = '';
};

const options = [
  { value: '1' },
  { value: '2' },
  { value: '3' }
];

const checklist = reactive({
  Months: "",
  data_softsystem_checks1: "",
  data_softsystem_checks2: "",
  data_softsystem_checks3: "",
  data_softsystem_checks4: "",
  data_softsystem_checks5: "",
  data_softsystem_checks6: "",
  data_softsystem_checks7: "",
  data_softsystem_checks8: "",
  security_checks1: "",
  security_checks2: "",
  security_checks3: "",
  security_checks4: "",
  security_checks5: "",
  hardware_checks1: "",
  hardware_checks2: "",
  Summary: ""
});

// Helper function to get logo path
const getLogoPath = () => {
  // In a web application, we need to use a relative URL from the web root
  return '/assets/cmu1.png';
};

// This is the updated printDetails function with the CMU header
const printDetails = (department) => {
  if (!department) return;

  // Populate the checklist with department values
  Object.keys(checklist).forEach(key => {
    checklist[key] = department[key] || ""; // Ensure that undefined fields are populated with empty strings
  });

  console.log('Checklist Data:', checklist); // Debugging output

  // Create a deep copy of the checklist to avoid reactivity issues
  const checklistData = JSON.parse(JSON.stringify(checklist));

  const modalHtml = `
    <html>
      <head>
        <title>Print Modal</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .checkmark { font-size: 18px; display: inline-block; }
          .signature-container { display: flex; justify-content: space-between; margin-top: 20px; }
          .signature-box { width: 45%; }
          .signature-line { border-bottom: 1px solid #000; margin: 25px 0 5px 0; }
          
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
            margin-bottom: 5px;
            text-transform: uppercase;
            text-align: center;
          }
          
          .month-header {
            font-size: 14px;
            text-align: center;
            margin-bottom: 15px;
            font-weight: bold;
          }
        </style>
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
          <div class="office-title">MANAGEMENT INFORMATION SYSTEM OFFICE</div>
          <div class="report-title-header">PREVENTIVE MAINTENANCE CHECKLIST for SERVERS/DATACENTER</div>
          <div class="month-header">For the Month of ${checklistData.Months}</div>
        </div>
    
        <table>
          <thead>
            <tr> 
              <th>Category</th>
              <th>Specification</th>
              <th class="text-center">Good</th>
              <th class="text-center">Near Maintenance</th>
              <th class="text-center">N/A</th>
            </tr>
          </thead>
          <tbody>
            ${renderGroup("Data, Software and System Checks", [
              ["Check backups are working", checklistData.data_softsystem_checks1],
              ["Check and update OS", checklistData.data_softsystem_checks2],
              ["Update your control panel", checklistData.data_softsystem_checks3],
              ["Check and update applications", checklistData.data_softsystem_checks4],
              ["Check Remote Management Tools", checklistData.data_softsystem_checks5],
              ["Check Server Usage", checklistData.data_softsystem_checks6],
              ["Review user accounts", checklistData.data_softsystem_checks7],
              ["Free up server storage space", checklistData.data_softsystem_checks8],
            ])}
            ${renderGroup("Security Checks", [
              ["Change server passwords", checklistData.security_checks1],
              ["Firewall installed", checklistData.security_checks2],
              ["Perform a server malware scan", checklistData.security_checks3],
              ["Check fans and power supplies", checklistData.security_checks4],
              ["Check RAID fault tolerance", checklistData.security_checks5],
            ])}
            ${renderGroup("Hardware Checks", [
              ["Check Cable Integrity", checklistData.hardware_checks1],
              ["Check A/C unit at the facility", checklistData.hardware_checks2],
            ])}
            <tr>
              <td colspan="5"><strong>Summary/Recommendation:</strong> ${checklistData.Summary || 'None'}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Added Signature Section with proper spacing -->
        <table style="border: none; margin-top: 30px; width: 100%;">
          <tr style="border: none;">
            <td style="border: none; width: 50%; text-align: left;"><strong>Checked by:</strong></td>
            <td style="border: none; width: 50%; text-align: left;"><strong>Noted by:</strong></td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; padding-top: 40px;"></td>
            <td style="border: none; padding-top: 40px;">CARLO MARTIN A. SARAUSA</td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; padding-top: 5px;"><div style="border-bottom: 1px solid #000; width: 80%; height: 1px;"></div></td>
            <td style="border: none; padding-top: 5px;"><div style="border-bottom: 1px solid #000; width: 80%; height: 1px;"></div></td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; padding-top: 5px;">Technical Staff</td>
            <td style="border: none; padding-top: 5px;">Director, Office of Digital Transformation</td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '1px';
  iframe.style.height = '1px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(modalHtml);
  iframeDocument.close();

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };
};

// Updated renderGroup function with a clearer structure
function renderGroup(category, items) {
  return items.map((item, index) => {
    const [label, value] = item;
    return `
      <tr>
        ${index === 0 ? `<td rowspan="${items.length}">${category}</td>` : ''}
        <td>${label}</td>
        <td style="text-align:center">${renderCheck(value, '1')}</td>
        <td style="text-align:center">${renderCheck(value, '2')}</td>
        <td style="text-align:center">${renderCheck(value, '3')}</td>
      </tr>
    `;
  }).join('');
}

// Improved renderCheck function that's more reliable
function renderCheck(value, checkValue) {
  // Convert to string for strict comparison 
  const stringValue = String(value || '');
  const stringCheckValue = String(checkValue || '');
  
  // Debug output
  console.log(`Checking: Value "${stringValue}" against "${stringCheckValue}" - Match: ${stringValue === stringCheckValue}`);
  
  // Return a clear checkmark if values match
  return stringValue === stringCheckValue ? '<span class="checkmark">✓</span>' : '';
}

watch(selectedDepartments, (newVal) => {
  if (newVal) {
    for (const key in checklist) {
      checklist[key] = newVal[key] || "";
    }
  }
});
</script>

<template>
  <MainLayout>
    <div class="container">
      <div class="page-header">
        <h1 class="title">{{ selectedPmYear.Description }} {{ selectedPmYear.Name }}</h1>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Office</th>
              <th>Actions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="department in departments" :key="department.deptId">
              <td>{{ department.checkId }}</td>

              <!-- Actions Column -->
              <td>
                <div class="action-buttons">
                  <button class="btn view-btn" @click="openStep1Modal(department.checkId)">
                    <i class="fas fa-edit"></i> View Form
                  </button>
                  <button class="btn print-btn" @click="printDetails(department)">
                    <i class="fas fa-print"></i> Print
                  </button>
                </div>
              </td>

              <!-- Status Column -->
              <td :class="{ 'clear-status': department.status === 'Clear', 'unclear-status': department.status === 'Unclear' }">
                {{ department.status }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal Component -->
    <div v-if="isStep1ModalOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div class="header-title-container">
            <h2 class="modal-title">PREVENTIVE MAINTENANCE CHECKLIST FOR SERVERS/DATACENTER</h2>
            <div class="header-month-display">
              <label for="month-input" class="month-label">For the Month:</label>
              <input type="text" id="month-input" v-model="checklist.Months" class="month-input" placeholder="Enter month" disabled>
            </div>
          </div>
          <button class="close-modal-btn" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Preventive Maintenance Checklist Table -->
          <div class="table-responsive">
            <table class="checklist-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Specification</th>
                  <th class="text-center">Good</th>
                  <th class="text-center">Near Maintenance</th>
                  <th class="text-center">N/A</th>
                </tr>
              </thead>
              <tbody>
                <!-- Data, Software and System Checks Section -->
                <tr>
                  <td class="category-cell" rowspan="8">Data, Software and System Checks</td>
                  <td class="spec-cell">Check backups are working</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'backup_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks1" disabled/>
                      <label class="radio-label" :for="'backup_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check and update OS</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Os_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks2" disabled/>
                      <label class="radio-label" :for="'Os_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Update your control panel</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Panel_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks3" disabled />
                      <label class="radio-label" :for="'Panel_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check and update applications</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Applications_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks4" disabled/>
                      <label class="radio-label" :for="'Applications_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check Remote Management Tools</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Tools_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks5" disabled />
                      <label class="radio-label" :for="'Tools_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check Server Usage</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Usage_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks6" disabled/>
                      <label class="radio-label" :for="'Usage_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Review user accounts</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Account_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks7" disabled />
                      <label class="radio-label" :for="'Account_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Free up server storage space</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Space_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks8" disabled />
                      <label class="radio-label" :for="'Space_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                
                <!-- Security Checks Section -->
                <tr>
                  <td class="category-cell" rowspan="5">Security Checks</td>
                  <td class="spec-cell">Change server passwords</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Checks_' + opt.value" :value="opt.value" v-model="checklist.security_checks1" disabled>
                      <label class="radio-label" :for="'Checks_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Firewall installed</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Firewall_' + opt.value" :value="opt.value" v-model="checklist.security_checks2" disabled/>
                      <label class="radio-label" :for="'Firewall_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Perform a server malware scan</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Malware_' + opt.value" :value="opt.value" v-model="checklist.security_checks3" disabled/>
                      <label class="radio-label" :for="'Malware_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check fans and power supplies</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Power_' + opt.value" :value="opt.value" v-model="checklist.security_checks4" disabled />
                      <label class="radio-label" :for="'Power_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check RAID fault tolerance</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Fault_' + opt.value" :value="opt.value" v-model="checklist.security_checks5" disabled />
                      <label class="radio-label" :for="'Fault_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                
                <!-- Hardware Checks Section -->
                <tr>
                  <td class="category-cell" rowspan="2">Hardware Checks</td>
                  <td class="spec-cell">Check Cable Integrity</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Hardware_' + opt.value" :value="opt.value" v-model="checklist.hardware_checks1" disabled/>
                      <label class="radio-label" :for="'Hardware_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="spec-cell">Check A/C unit at the facility</td>
                  <td v-for="opt in options" :key="opt.value" class="option-cell">
                    <div class="radio-container">
                      <input class="radio-input" type="radio" :id="'Facility_' + opt.value" :value="opt.value" v-model="checklist.hardware_checks2" disabled />
                      <label class="radio-label" :for="'Facility_' + opt.value"></label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary/Recommendation Section -->
          <div class="summary-container">
            <label for="comments" class="summary-label">Summary/Recommendation</label>
            <textarea id="comments" v-model="checklist.Summary" class="summary-textarea" rows="3" disabled></textarea>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn close-btn" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
  margin: 0;
  border-bottom: 3px solid #3498db;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.table-responsive {
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 2rem;
}

/* Main Table Styles */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  border: 1px solid #e0e0e0;
  padding: 1rem;
  text-align: center;
  vertical-align: middle;
}

.data-table th {
  background-color: #2c3e50;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 1.2rem 1rem;
}

.data-table tr:nth-child(even) {
  background-color: #f8f9fa;
}

.data-table tr:hover {
  background-color: #ebf5ff;
  transition: background-color 0.3s ease;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.btn {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.view-btn {
  background-color: #3498db;
  color: white;
}

.view-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.print-btn {
  background-color: #2ecc71;
  color: white;
}

.print-btn:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
}

/* Status Indicators */
.clear-status {
  color: #27ae60;
  font-weight: bold;
  background-color: rgba(46, 204, 113, 0.1);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
}

.unclear-status {
  color: #e74c3c;
  font-weight: bold;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background-color: #2c3e50;
  color: white;
  border-bottom: 1px solid #ddd;
}

.header-title-container {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  margin-right: 1rem;
}

.modal-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-month-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.month-label {
  font-weight: 600;
  color: white;
  margin: 0;
  white-space: nowrap;
  font-size: 0.9rem;
}

.month-input {
  padding: 0.4rem 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  width: 150px;
  font-size: 0.85rem;
  color: white;
  outline: none;
}

.close-modal-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: all 0.2s ease;
}

.close-modal-btn:hover {
  color: #e74c3c;
  transform: scale(1.1);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 130px);
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

/* Checklist Table Styles */
.checklist-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 2rem 0;
}

.checklist-table th,
.checklist-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.checklist-table th {
  background-color: #2c3e50;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
}

.category-cell {
  background-color: #f2f2f2;
  font-weight: 600;
  color: #2c3e50;
  vertical-align: middle;
  text-align: center;
  width: 15%;
}

.spec-cell {
  color: #333;
  font-weight: 500;
  width: 55%;
}

.option-cell {
  text-align: center;
  width: 10%;
}

/* Radio Button Styles */
.radio-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.radio-input {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #3498db;
  border-radius: 50%;
  outline: none;
  position: relative;
  cursor: pointer;
  background-color: white;
}

.radio-input:checked {
  background-color: white;
}

.radio-input:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #3498db;
}

.radio-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Summary Section Styles */
.summary-container {
  margin-top: 1.5rem;
}

.summary-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.summary-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f8f9fa;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.summary-textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Modal Footer Buttons */
.close-btn {
  background-color: #e74c3c;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }
  
  .container {
    padding: 1rem;
  }
  
  .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .modal-title {
    font-size: 1rem;
  }
  
  .header-month-display {
    gap: 0.25rem;
  }
  
  .month-label {
    font-size: 0.8rem;
  }
  
  .month-input {
    width: 120px;
    font-size: 0.8rem;
    padding: 0.3rem 0.5rem;
  }
  
  .modal-content {
    width: 95%;
  }
}

/* For very small screens */
@media (max-width: 480px) {
  .header-title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .modal-title {
    white-space: normal;
    margin-bottom: 0.5rem;
  }
}
</style>
