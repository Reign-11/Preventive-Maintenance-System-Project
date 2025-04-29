<script setup>
import { ref, computed,onBeforeUnmount,onMounted ,defineProps, reactive, watch } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';

const props = defineProps({
  departments: { type: Array, default: () => [] },  
  pmYear: { type: Object, default: () => ({}) },
  YrId: { type: [String, Number], default: null }, // Changed default to null
  PlanId: { type: [String, Number], default: null }, // Changed default to null
  office: { type: Object, default: () => ({}) },
  deptId: { type: [String, Number], default: null },  // Changed default to null
  categoryId: { type: [String, Number], default: null } // Changed default to null
});

const isStep1ModalOpen = ref(false);
const selectedDepartments = ref (null)

const openStep1Modal = (routeId) => {
  const selectedDepartment = props.departments.find(route => route.routeId == routeId);
  if (selectedDepartment) {
    selectedDepartments.value = selectedDepartment; 
   
  } else {
    console.warn("Department not found for deptId:", routeId);
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
  network_monitoring_tool_status:"0",
  firewall_status:"0",
  vpn_client_status:"0",
  network_config_tool_status:"0",
  manaegable_software_status: "0",
  anti_virus_status: "0",
  other_software: "",
  desktopSpecs: {
  AccessPoint: "",
  Modem:  "",
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
    if (newVal.modem_status    === 1) formData.equipmentInstalled.push("Modem");
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
    formData.other_software= newVal.other_software|| "";
    // Desktop Specs
    formData.desktopSpecs.AccessPoint = newVal.access_point_details || "";
    formData.desktopSpecs.Modem = newVal.modem_details    || "";
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
    // If checked, mark status as "0"
    if (option === "Network Monitoring Tool") formData.network_monitoring_tool_status = "1";
    if (option === "Firewall Software") formData.firewall_status = "1";
    if (option === "VPN Client") formData.vpn_client_status = "1";
    if (option === "Network Configuration Tool") formData.network_config_tool_status = "1";
    if (option === "Manageable Software") formData.manaegable_software_status = "1";
    if (option === "Anti Virus") formData.anti_virus_status = "1";
    if (option === "Other") formData.other_software = "";
  } else {
    // If unchecked, mark status as "1"
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
</script>

<template>
  <MainLayout>
    <div class="container">

      <table class="data-table">
      <thead>
        <tr>
          <th>Route Id </th>

          <th>Office</th>
          <th>Actions</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="department in departments" :key="department.deptId">
          <td>{{ department.routeId }}</td>

          <td>{{ department.department_name }}</td>

          <!-- Actions Column -->
          <td class="text-center">
            <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto mx-2" 
                @click="openStep1Modal(department.routeId)">
                <i class="fas fa-edit me-1"></i> View Form
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
    
    <div v-if="isStep1ModalOpen" class="modal fade show d-block">
        <div class="modal-dialog modal-xl" role="document">
          <!-- Preventive Maintenance Form Modal -->
            <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header d-flex align-items-center justify-content-between w-100 flex-wrap gap-3">
            <!-- Title -->
            <h5 class="modal-title mb-0">Preventive Maintenance Form</h5>
            <!-- Inputs Group -->
            <div class="d-flex align-items-center gap-3 flex-wrap ml-auto">
            <!-- <div class="d-flex align-items-center gap-4 flex-wrap"> -->
              
            <!-- Inputs Group -->
              <div class="d-flex align-items-center gap-3 flex-wrap">
              
              <!-- Number Input -->
              <div class="d-flex flex-column">
              <label class="form-label mb-0" style="font-size: 14px;"></label>
              <input 
               type="text" 
               class="form-control form-control-sm" 
               @input="console.log('Ticket Number:', formData.ticketnumber)"

               v-model="formData.ticketnumber"
               placeholder="Number"
              style="width: 150px; height: 30px; font-size: 14px; padding: 5px;"
          >
            </div>

              <!-- Equipment Number Input -->
              <div class="d-flex flex-column">
              <label class="form-label mb-0" style="font-size: 14px;"></label>
              <input 
               type="text" 
               class="form-control form-control-sm" 
               @input="console.log('Equipment Number:', formData.equipment)"

               v-model="formData.equipment"
               placeholder="Equipment Number"
              style="width: 150px; height: 30px; font-size: 14px; padding: 5px;"
          >
            </div>

          </div>
          </div>

            <div class="d-flex align-items-center ms-auto">
            <!-- <button class="btn btn-danger me-2" @click="markForDisposal">For Disposal</button> -->
            <button type="button" class="btn-close" @click="isModalOpen = false"></button>
            </div>
            </div>

            <!-- Modal Body -->
            <div class="modal-body modal-scrollable">
            <!-- User & Date Info -->
            <div class="row">
              <div class="col-md-3">
                <label class="form-label">Office/College/Unit</label>
                <input type="text" class="form-control" v-model="formData.officeUnit">
              </div>
              <div class="col-md-3">
                <label class="form-label">Department</label>
                <input type="text" class="form-control" v-model="formData.department">
              </div>
              <div class="col-md-3">
                <label class="form-label">Date Acquired</label>
                <input type="date" class="form-control" v-model="formData.dateAcquired">
              </div>
              <div class="col-md-3">
                <label class="form-label">Date</label>
                <input type="text" class="form-control" v-model="formData.date">
              </div>
            </div>

            <!-- Equipment Installed -->
            <div class="card p-3 mt-3">
            <h6 class="fw-bold">Equipment Installed:</h6>
            <div class="row">
              <div v-for="(option, index) in equipmentOptions" :key="index" class="col-md-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :value="option" 
                    v-model="formData.equipmentInstalled"
                    @change="updateEquipmentStatus(option)" 
                  />
                  <label class="form-check-label">{{ option }}</label>
                </div>

                <!-- Input Field for 'Other' Equipment -->
                <input 
                  v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')" 
                  type="text" 
                  class="form-control mt-1 ms-3" 
                  v-model="formData.other_equipment"
                  placeholder="Specify Other Equipment">
              </div>
            </div>
          </div>

            <!-- Software Installed -->
            <div class="card p-3 mt-3">
            <h6 class="fw-bold">Software Application Installed:</h6>
            <div class="row">
              <div v-for="(option, index) in softwareOptions" :key="index" class="col-md-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :value="option" 
                    v-model="formData.softwareInstalled" 
                    @change="updateSoftwareStatus(option)" 
                  />
                  <label class="form-check-label">{{ option }}</label>
                </div>

                <!-- Input Field for 'Other' Software -->
                <input 
                  v-if="option === 'Other' && formData.softwareInstalled.includes('Other')" 
                  type="text" 
                  class="form-control mt-1 ms-3" 
                  v-model="formData.other_software" 
                  placeholder="Specify Other Software">
              </div>
            </div>
          </div>

            <!-- Network Specifications -->
            <div class="card p-3 mt-3">
              <h6 class="fw-bold">Specifications:</h6>
              <div class="row">
                <!-- Loop through and format keys with spaces -->
                <div v-for="(value, key) in filteredSpecs" :key="key" class="col-md-2">
                  <!-- Replace underscores with spaces for the label -->
                  <label class="form-label">{{ formatKey(key) }}</label>
                  <input type="text" class="form-control" v-model="formData.desktopSpecs[key]">
                </div>


                <!-- Wifi Band-->
                <div class="col-md-2">
                  <label class="form-label">Wifi Band</label>
                  <select class="form-control" v-model="formData.desktopSpecs.WifiBand">
                    <option disabled value="">Select</option>
                    <option>2.4 GHz</option>
                    <option>5 GHz</option>
                    <option>Mix</option>
                  </select>
                </div>
                

                <div class="col-md-2">
                  <label class="form-label">DHCP</label>
                  <select class="form-control" v-model="formData.desktopSpecs.DHCP">
                    <option disabled value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>     
              </div>
            </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="button" class="btn btn-primary" @click="submitForm">Submit</button>
          
          </div>
        </div>
      </div>
    </div>
  </div>
  </MainLayout>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 30px;
  min-height: 100vh;
}

.data-table {
  width: 70%;
  margin: auto;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.data-table th {
  background-color: #2c3e50;
  color: white;
  font-weight: bold;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.clear-status {
  color: #27ae60;
  font-weight: bold;
}

.unclear-status {
  color: #e74c3c;
  font-weight: bold;
}

.edit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn:hover {
  background-color: #2980b9;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex !important;
  align-items: center;
  justify-content: center;
}

/* Make modal larger */
.modal-content {
  width: 300%;
  max-width: 1200px; /* Increase max width */
  max-height: 95vh; /* Prevent it from going beyond the viewport */
  display: flex;
  flex-direction: column;
}

/* Increase the height and make it scrollable */
.modal-body {
  max-height: 70vh; /* Adjust height for better visibility */
  overflow-y: auto; /* Enable scrolling */
  padding-right: 10px;
}

.dropdown-container {
  margin-bottom: 15px; /* Adds space below the dropdown */
  margin-top: 15px; /* Adds space above the dropdown */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px; /* Adds spacing between label and dropdown */
}

#month-select {
  padding: 8px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: auto;
  padding-right: 30px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 15px; /* Adds space between the buttons */
  margin-top: 15px;
}

.save-btn, .close-btn {
  background-color: #2ecc71; /* Save button color */
  color: white;
  padding: 12px 20px; /* Ensuring uniform padding */
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px; /* Slightly larger text */
  width: 120px; /* Ensure both buttons have the same width */
  text-align: center;
  transition: background 0.3s ease-in-out;
}

.close-btn {
  background-color: #e74c3c; /* Close button color */
}

.save-btn:hover {
  background-color: #27ae60;
}

.close-btn:hover {
  background-color: #c0392b;
}

</style>