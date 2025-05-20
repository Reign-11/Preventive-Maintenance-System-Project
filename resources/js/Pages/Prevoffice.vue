<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineProps, reactive, watch } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import { Link } from '@inertiajs/vue3';

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
const selectedPlan = ref(props.PlanId || '');
const selectedDepartments = ref(null);
const selectedYear = ref(props.YrId || '');
const selectedOfficeId = ref(props.office?.OffId || '');

const openStep1Modal = (DeptId) => {
  const selectedDepartment = props.departments.find(dep => dep.DeptId == DeptId);

  if (selectedDepartment) {
    selectedDepartments.value = selectedDepartment;
    formData.officeUnit = selectedDepartment.OfficeName;
    formData.department = selectedDepartment.department_name;
  } else {
    console.warn("Department not found for deptId:", DeptId);
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
  const excludedKeys = ['IPv4', 'IPv6', 'Gateway', 'DHCP', 'WifiBand']; // <- Add all manually handled keys
  const specs = {};

  for (const key in formData.desktopSpecs) {
    if (!excludedKeys.includes(key)) {
      specs[key] = formData.desktopSpecs[key];
    }
  }

  return specs;
});

const formData = reactive({
  ticketnumber: "",
  officeUnit: "",
  department: "",
  dateAcquired: "",
  pcName: "",
  equipmentInstalled: [],
  router_status: "0",
  switch_status: "0",
  access_point_status: "0",
  modem_status: "0",
  network_cable_status: "0",
  patch_panel_status: "0",
  other_equipment: "",
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
    formData.desktopSpecs.IPv4 = "";
    formData.desktopSpecs.IPv6 = "";
    delete formData.desktopSpecs.Gateway;
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

// Options
const equipmentOptions = ['Router', 'Switch', 'Access Point', 'Modem', 'Network Cable', 'Patch Panel', 'Other'];
const softwareOptions = ['Network Monitoring Tool', 'Firewall Software', 'VPN Client', 'Network Configuration Tool', 'Manageable Software', 'Anti Virus', 'Other'];

const submitForm = async () => {
  try {
    console.log("Submitting Form Data:", formData);

    if (!selectedDepartments.value) {
      console.error("No department selected!");
      alert("Please select a department first.");
      return;
    }

    // Optional: log selected department
    console.log("Selected Department:", selectedDepartments.value);

    // Construct request payload  
    const payload = {
      Offid: selectedDepartments.value.OffId, 
      deptId: selectedDepartments.value.DeptId,
      YrId: selectedDepartments.value?.YrId || props.YrId,
      ticketnumber: formData.ticketnumber,
      equipmentnumber: formData.equipment, 
      date_acquired: formData.dateAcquired,
      router_status: formData.router_status,
      switch_status: formData.switch_status,
      access_point_status: formData.access_point_status,
      modem_status: formData.modem_status,
      network_cable_status: formData.network_cable_status,
      patch_panel: formData.patch_panel_status,
      other_equipment: formData.other_equipment,

      networking_monitoring_tool_status: formData.network_monitoring_tool_status,
      firewall_status: formData.firewall_status,
      vpn_client_status: formData.vpn_client_status,
      network_config_tool_status: formData.network_config_tool_status,
      manageable_software_status: formData.manaegable_software_status,
      anti_virus_status: formData.anti_virus_status,
      other_software: formData.other_software,

      access_point_details: formData.desktopSpecs.AccessPoint,
      modem_details: formData.desktopSpecs.Modem,
      number_ports: formData.desktopSpecs.NumberOfPorts,
      ip_details: formData.desktopSpecs.IP,
      mac_details: formData.desktopSpecs.Mac,
      dns_details: formData.desktopSpecs.DNS,
      wifi_name: formData.desktopSpecs.WifiName,
      password_details: formData.desktopSpecs.Password,
      vlan_details: formData.desktopSpecs.Vlan,
      wifiband_details: formData.desktopSpecs.WifiBand,
      dhcp_details: formData.desktopSpecs.DHCP,
    };

    // Handle conditional fields
    if (formData.desktopSpecs.DHCP === "Yes") {
      payload.ipv4_details = formData.desktopSpecs.IPv4;
      payload.ipv6_details = formData.desktopSpecs.IPv6;
      payload.gateway_details = null;
    } else if (formData.desktopSpecs.DHCP === "No") {
      payload.gateway_details = formData.desktopSpecs.Gateway;
      payload.ipv4_details = null;
      payload.ipv6_details = null;
    }

    console.log("Payload:", payload);

    const response = await axios.post(`/api/checklistC`, payload);
    console.log("Form submitted successfully:", response.data);

    window.location.reload();

  } catch (error) {
    console.error("Error submitting form:", error.response?.data || error.message);
  }
};
</script>

<template>
  <MainLayout>
    <div class="container">
      <div class="page-header">
        <h1 class="title">{{ pmYear.Description }} {{ pmYear.Name }}</h1>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Office</th>
              <th>Actions</th>
              <th>Status</th>
              <th>Show ticket</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="department in departments" :key="department.DeptId" class="table-row">
              <td class="dept-name">{{ department.department_name }}</td>
              <td>
                <button class="btn primary-btn" @click="openStep1Modal(department.DeptId)">
                  <i class="fas fa-edit"></i> Fillup Form
                </button>
              </td>
              <td>
                <div :class="['status-badge', { 
                  'status-clear': department.status === 'Clear', 
                  'status-unclear': department.status === 'Unclear',
                  'status-pending': department.status === 'Pending',
                  'status-completed': department.status === 'Completed'
                }]">
                  {{ department.status || 'Pending' }}
                </div>
              </td>
              <td>
                <Link 
                  v-if="department.DeptId"
                  :href="route('network', { 
                    departmentId: department.DeptId, 
                    officeId: selectedOfficeId, 
                    YrId: selectedYear,
                    PlanId: selectedPlan
                  })"
                  class="btn secondary-btn">
                  <i class="fas fa-eye"></i> View
                </Link>
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
            <h2 class="modal-title">NETWORK INFRASTRUCTURE MAINTENANCE FORM</h2>
            <div class="header-input-group">
              <div class="input-field">
                <label for="ticket-number" class="input-label">Ticket:</label>
                <input 
                  id="ticket-number"
                  type="text"
                  class="header-input"
                  v-model="formData.ticketnumber"
                  placeholder="Number"
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
                />
              </div>
            </div>
          </div>
          <button class="close-btn-icon" @click="closeModal">&times;</button>
        </div>

        <div class="modal-body">
          <!-- User & Date Info Card -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Office Information</h3>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Office/College/Unit</label>
                  <input type="text" class="form-control" v-model="formData.officeUnit">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Department</label>
                  <input type="text" class="form-control" v-model="formData.department">
                </div>
                <div class="col-md-3">
                  <label class="form-label">Date Acquired</label>
                  <input type="date" class="form-control" v-model="formData.dateAcquired">
                </div>
              </div>
            </div>
          </div>

          <!-- Equipment Installed -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Equipment Installed</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div v-for="(option, index) in equipmentOptions" :key="index" class="col-md-3 mb-3">
                  <div class="checkbox-container">
                    <input 
                      class="checkbox-input" 
                      type="checkbox" 
                      :id="'equipment_' + index"
                      :value="option" 
                      v-model="formData.equipmentInstalled"
                      @change="updateEquipmentStatus(option)" 
                    />
                    <label class="checkbox-label" :for="'equipment_' + index">{{ option }}</label>
                  </div>

                  <!-- Input Field for 'Other' Equipment -->
                  <input 
                    v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')" 
                    type="text" 
                    class="form-control mt-2" 
                    v-model="formData.other_equipment"
                    placeholder="Specify Other Equipment">
                </div>
              </div>
            </div>
          </div>

          <!-- Software Installed -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Software Application Installed</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div v-for="(option, index) in softwareOptions" :key="index" class="col-md-3 mb-3">
                  <div class="checkbox-container">
                    <input 
                      class="checkbox-input" 
                      type="checkbox" 
                      :id="'software_' + index"
                      :value="option" 
                      v-model="formData.softwareInstalled"
                      @change="updateSoftwareStatus(option)" 
                    />
                    <label class="checkbox-label" :for="'software_' + index">{{ option }}</label>
                  </div>

                  <!-- Input Field for 'Other' Software -->
                  <input 
                    v-if="option === 'Other' && formData.softwareInstalled.includes('Other')" 
                    type="text" 
                    class="form-control mt-2" 
                    v-model="formData.other_software"
                    placeholder="Specify Other Software">
                </div>
              </div>
            </div>
          </div>

          <!-- Network Specifications -->
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">Network Specifications</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <!-- Regular specifications -->
                <div v-for="(value, key) in filteredSpecs" :key="key" class="col-md-3 mb-3">
                  <div class="form-group">
                    <label class="form-label">{{ formatKey(key) }}</label>
                    <input type="text" class="form-control" v-model="formData.desktopSpecs[key]">
                  </div>
                </div>

                <!-- Wifi Band Dropdown -->
                <div class="col-md-3 mb-3">
                  <div class="form-group">
                    <label class="form-label">Wifi Band</label>
                    <select class="form-control" v-model="formData.desktopSpecs.WifiBand">
                      <option disabled value="">Select</option>
                      <option>2.4 GHz</option>
                      <option>5 GHz</option>
                      <option>Mix</option>
                    </select>
                  </div>
                </div>

                <!-- DHCP Dropdown -->
                <div class="col-md-3 mb-3">
                  <div class="form-group">
                    <label class="form-label">DHCP</label>
                    <select class="form-control" v-model="formData.desktopSpecs.DHCP">
                      <option disabled value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <!-- Conditional fields based on DHCP selection -->
                <template v-if="formData.desktopSpecs.DHCP === 'Yes'">
                  <div class="col-md-3 mb-3">
                    <div class="form-group">
                      <label class="form-label">IPv4</label>
                      <input type="text" class="form-control" v-model="formData.desktopSpecs.IPv4">
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="form-group">
                      <label class="form-label">IPv6</label>
                      <input type="text" class="form-control" v-model="formData.desktopSpecs.IPv6">
                    </div>
                  </div>
                </template>

                <template v-else-if="formData.desktopSpecs.DHCP === 'No'">
                  <div class="col-md-3 mb-3">
                    <div class="form-group">
                      <label class="form-label">Gateway</label>
                      <input type="text" class="form-control" v-model="formData.desktopSpecs.Gateway">
                    </div>
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
          <button type="button" class="btn save-btn" @click="submitForm">
            <i class="fas fa-save"></i> Submit
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

.secondary-btn {
  background-color: #2ecc71;
  color: white;
}

.secondary-btn:hover {
  background-color: #27ae60;
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

.mb-4 {
  margin-bottom: 1.5rem;
}

/* Row and Column Grid */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.75rem;
  margin-left: -0.75rem;
}

.col-md-2, .col-md-3, .col-md-4 {
  position: relative;
  width: 100%;
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

.g-3 {
  gap: 1rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

/* Form Elements */
.form-group {
  margin-bottom: 1rem;
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
}

.form-control:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

/* Checkbox & Radio Styles */
.checkbox-container {
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
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

.checkbox-input:hover {
  border-color: #2980b9;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.checkbox-label {
  font-size: 1rem;
  color: #333;
  cursor: pointer;
}

/* Action Buttons */
.save-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.save-btn {
  background-color: #2ecc71;
  color: white;
}

.save-btn:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
}

.cancel-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Mt-2 utility class */
.mt-2 {
  margin-top: 0.5rem;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .col-md-2, .col-md-3, .col-md-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
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
  
  .modal-footer {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
  
  .save-btn, .cancel-btn {
    width: 100%;
  }
  
  .col-md-2, .col-md-3, .col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
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

.save-btn:active {
  animation: pulse 0.3s ease-in-out;
}

/* Firefox specific fixes for checkboxes */
@-moz-document url-prefix() {
  .checkbox-input {
    border-width: 1px;
  }
}
.status-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: rgba(241, 196, 15, 0.15);
  color: #f39c12;
  border: 1px solid rgba(241, 196, 15, 0.3);
}
</style>