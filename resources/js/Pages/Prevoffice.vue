<script setup>
import { ref, computed, onMounted, onBeforeUnmount,defineProps, reactive,watch} from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';
import { Link } from '@inertiajs/vue3';
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
const editedItem = ref({}); 
const selectedPlan = ref(props.PlanId || '');
const selectedOfficeId = ref(props.office?.OffId || '');
const selectedYear = ref(props.YrId || '');

const selectedDepartments = ref (null)

const openStep1Modal = (deptId) => {
  const selectedDepartment = props.departments.find(dep => dep.deptId == deptId);

  if (selectedDepartment) {
    selectedDepartments.value = selectedDepartment; // ✅ This is important!
    formData.officeUnit = selectedDepartment.OfficeName;
    formData.department = selectedDepartment.department_name;
  } else {
    console.warn("Department not found for deptId:", deptId);
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

// Filter statuses based on search input



// Function to set selected status


// Close dropdown when clicking outside
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
    Object.entries(specs).filter(([key, _]) => key !== 'WifiBand' && key !== 'DHCP')
  );
});

const formData = reactive({
  ticketnumber: "",
  officeUnit: "",
  department: "",
  dateAcquired: "",
  pcName: "",
  equipmentInstalled: [], // this line is important
  router_status: "0",
  switch_status: "0",
  access_point_status: "0",
  modem_status: "0",
  network_cable_status: "0",
  patch_panel_status: "0",
  other_equipment: "",
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
      <h2 class="text-center my-3">Preventive Maintenance Offices</h2> 

      <table class="data-table">
        <thead>
          <tr>
            <th>Office</th>
            <th>Actions</th>
            <th>Status</th>
            <th>View Depts</th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="department in departments" :key="department.deptId">
            <td>{{ department.department_name }}</td>
            <td class="text-center">
              <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto" 
              @click="openStep1Modal(department.deptId)">
              <i class="fas fa-edit me-1"></i>Fillup Form</button>
            </div>
            </td>
            <td :class="{ 'clear-status': 'Clear', 'unclear-status':'Unclear' }">              
            </td>
          <td class="text-center">
            <Link 
              :href="route('network', { 
                departmentId:department.DeptId , 
                officeId: selectedOfficeId, 
                YrId: selectedYear,
                PlanId: selectedPlan
              })"
              class="btn btn-sm btn-outline-primary w-auto mx-2">
              <i class="fas fa-eye me-1"></i> View 
            </Link>
          
          </td>
        </tr>

        </tbody>
      </table>
    </div>

   <!-- Modal -->
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
                    <option>5z</option>
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
            <!-- <button type="button" class="btn btn-success" @click="openStep2Modal">
              <i class="fas fa-arrow-right"></i> Next
            </button> -->
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
  width: 100%;
  max-width: 95vw; /* Viewport width responsive */
  height: auto;
  max-height: 90vh; /* Prevent modal from going beyond screen */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 10px;
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