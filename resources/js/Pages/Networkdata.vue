<script setup>
import { ref, computed, onBeforeUnmount, onMounted, defineProps, reactive, watch } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import PrintServices from '../../css/PrintServiceC';

const props = defineProps({
  departments: { type: Array, default: () => [] },  
  pmYear: { type: Object, default: () => ({}) },
  YrId: { type: [String, Number], default: null },
  PlanId: { type: [String, Number], default: null },
  office: { type: Object, default: () => ({}) },
  deptId: { type: [String, Number], default: null },
  categoryId: { type: [String, Number], default: null }
});

const isStep1ModalOpen = ref(false);
const selectedDepartments = ref(null);

const openStep1Modal = (routeId) => {
  const selectedDepartment = props.departments.find(route => route.routeId == routeId);
  if (selectedDepartment) {
    selectedDepartments.value = selectedDepartment; 
  } else {
    console.warn("Department not found for routeId:", routeId);
  }
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

const isStatusDropdownOpen = ref(false);
const handleClickOutside = (event) => {
  if (!event.target.closest(".status-dropdown")) {
    isStatusDropdownOpen.value = false;
  }
};

// Add event listener when component is mounted
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

// Remove event listener when component is destroyed
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const filteredSpecs = computed(() => {
  const specs = formData.desktopSpecs || {};
  return Object.fromEntries(
    Object.entries(specs).filter(([key, _]) => 
      key !== 'WifiBand' && 
      key !== 'DHCP' && 
      !(key === 'IPv4' && formData.desktopSpecs.DHCP !== 'Yes') && 
      !(key === 'IPv6' && formData.desktopSpecs.DHCP !== 'Yes') &&
      !(key === 'Gateway' && formData.desktopSpecs.DHCP === 'Yes')
    )
  );
});

const formData = reactive({
  ticketnumber: "",
  officeUnit: "",
  department: "",
  dateAcquired: "",
  pcName: "",
  equipmentInstalled: [], 
  softwareInstalled: [],
  network_monitoring_tool_status: "0",
  firewall_status: "0",
  vpn_client_status: "0",
  network_config_tool_status: "0",
  manaegable_software_status: "0",
  anti_virus_status: "0",
  other_software: "",
  desktopSpecs: {
    AccessPoint: "",
    Modem: "",
    NumberOfPorts: "",
    IP: "",
    Mac: "",
    DNS: "",
    DHCP: "",
    WifiName: "",
    WifiBand: "",
    Password: "",
    Vlan: "",
    Gateway: null,
    IPv4: null,
    IPv6: null,
  }
});

watch(selectedDepartments, (newVal) => {
  if (newVal) {
    console.log("Selected employee changed:", newVal);    
    // Basic Info
    formData.userOperator = newVal.emp_name || "";
    formData.officeUnit = newVal.OfficeName || "";
    formData.pcName = newVal.pcName || "";
    formData.department = newVal.department_name || "";
    formData.ticketnumber = newVal.ticketnumber || "";
    formData.equipment = newVal.equipmentnumber || "";
    formData.dateAcquired = newVal.date_acquired || "";
    formData.date = newVal.date || "";
    
    // Equipment Installed
    formData.equipmentInstalled = [];
    if (newVal.router_status === 1) formData.equipmentInstalled.push("Router");
    if (newVal.switch_status === 1) formData.equipmentInstalled.push("Switch");
    if (newVal.access_point_status === 1) formData.equipmentInstalled.push("Access Point");
    if (newVal.modem_status === 1) formData.equipmentInstalled.push("Modem");
    if (newVal.network_cable_status === 1) formData.equipmentInstalled.push("Network Cable");
    if (newVal.patch_panel === 1) formData.equipmentInstalled.push("Patch Panel");
    if (newVal.other_equipment) formData.equipmentInstalled.push("Other");
    formData.other_equipment = newVal.other_equipment || "";
    
    // Software Installed
    formData.softwareInstalled = [];
    if (newVal.networking_monitoring_tool_status === 1) formData.softwareInstalled.push("Network Monitoring Tool");
    if (newVal.firewall_status === 1) formData.softwareInstalled.push("Firewall Software");
    if (newVal.vpn_client_status === 1) formData.softwareInstalled.push("VPN Client");
    if (newVal.network_config_tool_status === 1) formData.softwareInstalled.push("Network Configuration Tool");
    if (newVal.manageable_software_status === 1) formData.softwareInstalled.push("Manageable Software");
    if (newVal.anti_virus_status === 1) formData.softwareInstalled.push("Anti Virus");
    if (newVal.other_software) formData.softwareInstalled.push("Other");
    formData.other_software = newVal.other_software || "";
    
    // Desktop Specs
    formData.desktopSpecs.AccessPoint = newVal.access_point_details || "";
    formData.desktopSpecs.Modem = newVal.modem_details || "";
    formData.desktopSpecs.NumberOfPorts = newVal.number_ports || "";
    formData.desktopSpecs.IP = newVal.ip_details || "";
    formData.desktopSpecs.Mac = newVal.mac_details || "";
    formData.desktopSpecs.DNS = newVal.dns_details || "";
    formData.desktopSpecs.DHCP = newVal.dhcp_details || "";
    formData.desktopSpecs.WifiName = newVal.wifi_name || "";
    formData.desktopSpecs.WifiBand = newVal.wifiband_details || "";
    formData.desktopSpecs.Password = newVal.password_details || "";
    formData.desktopSpecs.Vlan = newVal.vlan_details || "";
    formData.desktopSpecs.Gateway = newVal.gateway_details || "";
    formData.desktopSpecs.IPv6 = newVal.ipv6_details || "";
    formData.desktopSpecs.IPv4 = newVal.ipv4_details || "";
    
    // Log the updated data
    console.log("Checklist data updated successfully");
  }
}, { immediate: true, deep: true }); 

// Options
const equipmentOptions = ['Router', 'Switch', 'Access Point', 'Modem', 'Network Cable', 'Patch Panel', 'Other'];
const softwareOptions = ['Network Monitoring Tool', 'Firewall Software', 'VPN Client', 'Network Configuration Tool', 'Manageable Software', 'Anti Virus', 'Other'];

const updateEquipmentStatus = (option) => {
  // If option is CHECKED, set to 1
  if (formData.equipmentInstalled.includes(option)) {
    if (option === "Router") formData.router_status = "1";
    if (option === "Switch") formData.switch_status = "1";
    if (option === "Access Point") formData.access_point_status = "1";
    if (option === "Network Cable") formData.modem_status = "1";
    if (option === "Printer") formData.network_cable_status = "1";
    if (option === "Patch Panel") formData.patch_panel_status = "1";
    if (option === "Other") formData.other_equipment = ""; 
  } else {
    // If UNCHECKED, set to 0
    if (option === "Router") formData.router_status = "0";
    if (option === "Switch") formData.switch_status = "0";
    if (option === "Access Point") formData.access_point_status = "0";
    if (option === "Network Cable") formData.modem_status = "0";
    if (option === "Printer") formData.network_cable_status = "0";
    if (option === "Patch Panel") formData.patch_panel_status = "0";
    if (option === "Other") formData.other_equipment = ""; 
  }
};

const updateSoftwareStatus = (option) => {
  if (formData.softwareInstalled.includes(option)) {
    // If checked, mark status as "1"
    if (option === "Network Monitoring Tool") formData.network_monitoring_tool_status = "1";
    if (option === "Firewall Software") formData.firewall_status = "1";
    if (option === "VPN Client") formData.vpn_client_status = "1";
    if (option === "Network Configuration Tool") formData.network_config_tool_status = "1";
    if (option === "Manageable Software") formData.manaegable_software_status = "1";
    if (option === "Anti Virus") formData.anti_virus_status = "1";
    if (option === "Other") formData.other_software = "";
  } else {
    // If unchecked, mark status as "0"
    if (option === "Network Monitoring Tool") formData.network_monitoring_tool_status = "0";
    if (option === "Firewall Software") formData.firewall_status = "0";
    if (option === "VPN Client") formData.vpn_client_status = "0";
    if (option === "Network Configuration Tool") formData.network_config_tool_status = "0";
    if (option === "Manageable Software") formData.manaegable_software_status = "0";
    if (option === "Anti Virus") formData.anti_virus_status = "0";
    if (option === "Other") formData.other_software = "";
  }
};

// Function to format keys with spaces
const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

watch(() => formData.desktopSpecs.DHCP, (val) => {
  if (val === 'Yes') {
    // Show IPv4 and IPv6 fields, hide Gateway
    formData.desktopSpecs.Gateway = null;
    if (formData.desktopSpecs.IPv4 === null) formData.desktopSpecs.IPv4 = "";
    if (formData.desktopSpecs.IPv6 === null) formData.desktopSpecs.IPv6 = "";
  } else if (val === 'No') {
    formData.desktopSpecs.Gateway = "";
    delete formData.desktopSpecs.IPv4;
    delete formData.desktopSpecs.IPv6;
  } else {
    delete formData.desktopSpecs.Gateway;
    delete formData.desktopSpecs.IPv4;
    delete formData.desktopSpecs.IPv6;
  }
});

const isPrinting = ref(false);

const printNetworkDetails = async (dept) => {
  // Get department data
  const departmentData = props.departments.find(d => String(d.routeId) === String(dept.routeId));
  if (!departmentData) {
    console.error("Department not found for printing with routeId:", dept.routeId);
    return;
  }
  
  // Set the selected department to populate form data
  selectedDepartments.value = departmentData;
  
  // Wait a moment for the reactive data to update
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Debug what's being printed
  console.log("Printing network form with data:", {
    departmentData,
    formData: {...formData}
  });
  
  // Use the print service
  PrintServices.printNetworkForm(formData);
};

// Update the existing print function
const printDepartmentTable = () => {
  // Add ID to table if needed
  const tableElement = document.querySelector('.data-table');
  if (!tableElement.id) {
    tableElement.id = 'departments-table';
  }
  
  // Use the PrintServiceC
  PrintServices.printElementById('departments-table', 'Network Departments');
};
</script>

<template>
  <MainLayout>
    <div class="container">
      <div class="page-header">
        <h1 class="title">Network Infrastructure Details</h1>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Office</th>
              <th>Actions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="department in departments" :key="department.routeId" class="table-row">
              <td>{{ department.routeId }}</td>
              <td class="dept-name">{{ department.department_name }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn primary-btn" @click="openStep1Modal(department.routeId)">
                    <i class="fas fa-eye"></i> View Form
                  </button>
                  <button class="btn print-btn" @click="printNetworkDetails(department)">
                    <i class="fas fa-print"></i> Print
                  </button>
                </div>
              </td>
              <td>
                <div :class="['status-badge', { 
                  'status-clear': department.status === 'Clear', 
                  'status-unclear': department.status === 'Unclear',
                  'status-pending': department.status === 'Pending' || !department.status,
                  'status-completed': department.status === 'Completed'
                }]">
                  {{ department.status || 'Pending' }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal Component -->
    <div v-if="isStep1ModalOpen" class="modal-overlay">
      <div class="modal-content modal-xl">
        <div class="modal-header">
          <div class="header-title-container">
            <h2 class="modal-title">NETWORK INFRASTRUCTURE DETAILS</h2>
            <div class="header-input-group">
              <div class="input-field">
                <label for="ticket-number" class="input-label">Ticket:</label>
                <input 
                  id="ticket-number"
                  type="text"
                  class="header-input"
                  v-model="formData.ticketnumber"
                  placeholder="Number"
                  disabled
                />
              </div>
              <div class="input-field">
                <label for="equipment-number" class="input-label">Equipment:</label>
                <input 
                  id="equipment-number"
                  type="text"
                  class="header-input"
                  v-model="formData.equipment"
                  placeholder="Equipment #"
                  disabled
                />
              </div>
            </div>
          </div>
          <button class="close-btn-icon" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Office Information Card -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Office Information</h3>
            </div>
            <div class="card-body">
              <div class="form-row">
                <div class="form-group col-md-3">
                  <label class="form-label">Office/College/Unit</label>
                  <input type="text" class="form-control" v-model="formData.officeUnit" disabled>
                </div>
                <div class="form-group col-md-3">
                  <label class="form-label">Department</label>
                  <input type="text" class="form-control" v-model="formData.department" disabled>
                </div>
                <div class="form-group col-md-3">
                  <label class="form-label">Date Acquired</label>
                  <input type="text" class="form-control" v-model="formData.dateAcquired" disabled>
                </div>
                <div class="form-group col-md-3">
                  <label class="form-label">Date</label>
                  <input type="text" class="form-control" v-model="formData.date" disabled>
                </div>
              </div>
            </div>
          </div>

          <!-- Equipment Installed Card -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Equipment Installed</h3>
            </div>
            <div class="card-body">
              <div class="checkbox-grid">
                <div v-for="(option, index) in equipmentOptions" :key="index" class="checkbox-item">
                  <div class="checkbox-container">
                    <input 
                      class="checkbox-input" 
                      type="checkbox" 
                      :id="'equipment_' + index"
                      :value="option" 
                      v-model="formData.equipmentInstalled"
                      disabled
                    />
                    <label class="checkbox-label" :for="'equipment_' + index">{{ option }}</label>
                  </div>

                  <!-- Input Field for 'Other' Equipment -->
                  <div v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')" class="other-input">
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="formData.other_equipment"
                      placeholder="Other Equipment"
                      disabled
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Software Installed Card -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Software Application Installed</h3>
            </div>
            <div class="card-body">
              <div class="checkbox-grid">
                <div v-for="(option, index) in softwareOptions" :key="index" class="checkbox-item">
                  <div class="checkbox-container">
                    <input 
                      class="checkbox-input" 
                      type="checkbox" 
                      :id="'software_' + index"
                      :value="option" 
                      v-model="formData.softwareInstalled"
                      disabled
                    />
                    <label class="checkbox-label" :for="'software_' + index">{{ option }}</label>
                  </div>

                  <!-- Input Field for 'Other' Software -->
                  <div v-if="option === 'Other' && formData.softwareInstalled.includes('Other')" class="other-input">
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="formData.other_software"
                      placeholder="Other Software"
                      disabled
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Network Specifications Card -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Network Specifications</h3>
            </div>
            <div class="card-body">
              <div class="specs-grid">
                <!-- Regular specifications -->
                <div v-for="(value, key) in filteredSpecs" :key="key" class="spec-item">
                  <label class="form-label">{{ formatKey(key) }}</label>
                  <input type="text" class="form-control" v-model="formData.desktopSpecs[key]" disabled>
                </div>

                <!-- Wifi Band and DHCP fields -->
                <div class="spec-item">
                  <label class="form-label">Wifi Band</label>
                  <input type="text" class="form-control" v-model="formData.desktopSpecs.WifiBand" disabled>
                </div>

                <div class="spec-item">
                  <label class="form-label">DHCP</label>
                  <input type="text" class="form-control" v-model="formData.desktopSpecs.DHCP" disabled>
                </div>

                <!-- Conditional fields based on DHCP selection -->
                <template v-if="formData.desktopSpecs.DHCP === 'Yes'">
                  <div class="spec-item">
                    <label class="form-label">IPv4</label>
                    <input type="text" class="form-control" v-model="formData.desktopSpecs.IPv4" disabled>
                  </div>
                  <div class="spec-item">
                    <label class="form-label">IPv6</label>
                    <input type="text" class="form-control" v-model="formData.desktopSpecs.IPv6" disabled>
                  </div>
                </template>

                <template v-else-if="formData.desktopSpecs.DHCP === 'No'">
                  <div class="spec-item">
                    <label class="form-label">Gateway</label>
                    <input type="text" class="form-control" v-model="formData.desktopSpecs.Gateway" disabled>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn cancel-btn" @click="closeModal">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
/* Main Container Styles */
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

.table-container {
  overflow-x: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
  margin-bottom: 2rem;
  width: 100%;
}

/* Table Styles */
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
  font-size: 0.9rem;
  padding: 1.2rem 1rem;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:nth-child(even) {
  background-color: #f8f9fa;
}

.table-row:hover {
  background-color: #e8f4fc;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dept-name {
  font-weight: 500;
  color: #34495e;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.primary-btn {
  background-color: #3498db;
  color: white;
}

.primary-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.print-btn {
  background-color: #9b59b6;
  color: white;
}

.print-btn:hover {
  background-color: #8e44ad;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Status Badge Styles */
.status-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-clear {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.status-unclear {
  background-color: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.status-pending {
  background-color: rgba(241, 196, 15, 0.15);
  color: #f39c12;
  border: 1px solid rgba(241, 196, 15, 0.3);
}

.status-completed {
  background-color: rgba(52, 152, 219, 0.15);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;
}

.modal-xl {
  max-width: 1200px;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  background-color: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
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

.header-input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.input-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-label {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0;
}

.header-input {
  padding: 0.4rem 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  width: 120px;
  font-size: 0.85rem;
  color: white;
  outline: none;
}

.close-btn-icon {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: all 0.2s ease;
}

.close-btn-icon:hover {
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
  gap: 1rem;
  border-top: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

/* Card Styles */
.card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  background-color: white;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.card-header {
  background-color: #f2f2f2;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.card-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-body {
  padding: 1.5rem;
}

/* Form Elements */
.form-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.75rem;
  margin-left: -0.75rem;
}

.form-group {
  margin-bottom: 1rem;
  padding-right: 0.75rem;
  padding-left: 0.75rem;
}

.col-md-2 {
  flex: 0 0 16.666667%;
  max-width: 16.666667%;
}

.col-md-3 {
  flex: 0 0 25%;
  max-width: 25%;
}

.col-md-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.form-control:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Checkbox & Grid Styles */
.checkbox-grid, .specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.checkbox-item, .spec-item {
  display: flex;
  flex-direction: column;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.checkbox-input {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #3498db;
  border-radius: 4px;
  outline: none;
  position: relative;
  cursor: pointer;
  margin: 0;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

.checkbox-input:checked {
  background-color: white;
  border-color: #2980b9;
}

.checkbox-input:checked::after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #3498db;
  font-size: 14px;
  font-weight: bold;
}

.checkbox-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.checkbox-label {
  font-size: 1rem;
  color: #333;
}

.other-input {
  margin-left: 1.5rem;
  margin-top: 0.3rem;
}

/* Button Styles */
.cancel-btn {
  background-color: #e74c3c;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.cancel-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .checkbox-grid, .specs-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .col-md-2, .col-md-3, .col-md-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .data-table {
    width: 100%;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
  
  .header-title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .modal-title {
    font-size: 1rem;
    max-width: 100%;
  }
  
  .header-input-group {
    width: 100%;
    gap: 0.5rem;
  }
  
  .input-field {
    flex: 1;
  }
  
  .header-input {
    width: 100%;
  }
  
  .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .col-md-2, .col-md-3, .col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .checkbox-grid, .specs-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
  
  .cancel-btn, .print-btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .modal-header, .modal-footer {
    padding: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .card-header {
    padding: 0.75rem 1rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}

/* Animation Effects */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.print-btn:active, .cancel-btn:active {
  animation: pulse 0.3s ease-in-out;
}
</style>