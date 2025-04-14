
<script setup>
import { ref, computed, onMounted, onBeforeUnmount,defineProps} from 'vue';
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
const editedItem = ref({}); 

const openStep1Modal = (item) => {
  editedItem.value = { ...item };
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
const searchStatus = ref("");
const statusOptions = ref(["Clear", "Unclear", "Pending", "Completed"]); // Example statuses

// Filter statuses based on search input
const filteredStatusOptions = computed(() => {
  return statusOptions.value.filter(status =>
    status.toLowerCase().includes(searchStatus.value.toLowerCase())
  );
});

// Function to set selected status
const selectStatus = (status) => {
  newUser.value.status = status; // Set selected status to form data
  searchStatus.value = status; // Update input field
  isStatusDropdownOpen.value = false; // Close dropdown
};

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

// Define newUser as a reactive reference (if it's supposed to hold the form data)
const newUser = ref({
  name: '',
  status: 'Clear'
});

const officeData = ref([
  { name: "College of Information Sciences and Computing", status: "Clear" },
  { name: "College of Arts and Sciences", status: "Clear" },
  { name: "Registrar Office", status: "Clear" },
  { name: "Research Office", status: "Clear" },
  { name: "Library", status: "Clear" },
]);

const displayedData = computed(() => officeData.value);

const formData = ref({
  officeUnit: '',
  department: '',
  dateAcquired: '',
  pcName: '',
  equipmentInstalled: [],
  otherEquipment: '',
  osInstalled: '',
  otherOS: '',
  osLicense: '',
  softwareInstalled: [],
  otherSoftware: '',
  desktopSpecs: {
    AccessPoint: '',
    Modem: '',
    NumberOfPorts: '',
    IP: '',
    Mac: '',
    DNS: '',
    DHCP: '',
    Vlan: '',
    WifiName: '',
    Password: '',
    Vlan: '',
    DHCP: ''
  } 
});

// Function to format keys with spaces
const formatKey = (key) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

const filteredSpecs = computed(() => {
  const excluded = ['DHCP', 'IPv4', 'IPv6', 'Gateway'];
  return Object.fromEntries(
    Object.entries(formData.value.desktopSpecs).filter(([key]) => !excluded.includes(key))
  );
});

// Options
const equipmentOptions = ['Router', 'Switch', 'Access Point', 'Modem', 'Network Cable', 'Patch Panel', 'Other'];
const softwareOptions = ['Network Monitoring Tool', 'Firewall Software', 'VPN Client', 'Network Configuration Tool', 'Manageable Software', 'Anti Virus', 'Other'];
const submitForm = async () => {
  try {
    // Check if required fields are filled
    if (!formData.value.userOperator || !formData.value.officeUnit || !formData.value.department) {
      console.error("Please fill in all required fields.");
      alert("Please fill in all required fields.");
      return;
    }

    // Create a data object for submission
    const payload = {
      userOperator: formData.value.userOperator,
      officeUnit: formData.value.officeUnit,
      department: formData.value.department,
      dateAcquired: formData.value.dateAcquired,
      pcName: formData.value.pcName,
      equipmentInstalled: formData.value.equipmentInstalled,
      otherEquipment: formData.value.otherEquipment,
      osInstalled: formData.value.osInstalled,
      otherOS: formData.value.otherOS,
      osLicense: formData.value.osLicense,
      softwareInstalled: formData.value.softwareInstalled,
      otherSoftware: formData.value.otherSoftware,
      desktopSpecs: { ...formData.value.desktopSpecs }
    };

    console.log("Submitting form data:", payload);

    // Simulating an API request (Replace with your actual API call)
    const response = await fetch('/api/submit-form', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Form submitted successfully!");
      closeModal(); // Close modal on success
    } else {
      console.error("Submission failed:", result);
      alert("Error submitting form.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("An unexpected error occurred.");
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
            <!-- <th>Print Details</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="department in departments" :key="department.deptId">
            <td>{{ department.department_name }}</td>
            <td class="text-center">
              <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto" 
              @click="openStep1Modal(item)">
              <i class="fas fa-eye me-1"></i>View</button>
            </div>
            </td>
            <td :class="{ 'clear-status': 'Clear', 'unclear-status':'Unclear' }">
              
            </td>
          </tr>
        </tbody>
      </table>

    </div>

   <!-- Modal -->
   <div v-if="isStep1ModalOpen" class="modal fade show d-block">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
            <div class="modal-header d-flex align-items-center justify-content-between w-100 flex-wrap gap-3">
                <h5 class="modal-title">Preventive Maintenance Form</h5>
            <!-- Inputs Group -->
            <div class="d-flex align-items-center gap-4 flex-wrap">
              
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
                    <input class="form-check-input" type="checkbox" :value="option" v-model="formData.equipmentInstalled">
                    <label class="form-check-label">{{ option }}</label>
                  </div>
                  <input 
                  v-if="option === 'Other' && formData.equipmentInstalled.includes('Other')" 
                  type="text" 
                  class="form-control mt-1 ms-3" 
                  v-model="formData.otherEquipment" 
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
                    <input class="form-check-input" type="checkbox" :value="option" v-model="formData.softwareInstalled">
                    <label class="form-check-label">{{ option }}</label>
                  </div>
                  <input v-if="option === 'Other' && formData.softwareInstalled.includes('Other')" type="text" class="form-control mt-1 ms-3" v-model="formData.otherSoftware" placeholder="Specify Other Software">
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


                <!-- Wifi -->
                <div class="col-md-2">
                  <label class="form-label">Wifi</label>
                  <select class="form-control" v-model="formData.desktopSpecs.DHCP">
                    <option disabled value="">Select</option>
                    <option>2.4 GHz</option>
                    <option>5z</option>
                    <option>Mix</option>
                  </select>
                </div>
                
                <!-- DHCP Selector -->
                <div class="col-md-2">
                  <label class="form-label">DHCP</label>
                  <select class="form-control" v-model="formData.desktopSpecs.DHCP">
                    <option disabled value="">Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>

                <!-- Conditional Fields Based on DHCP -->
                <div class="col-md-2" v-if="formData.desktopSpecs.DHCP === 'Yes'">
                  <label class="form-label">IPv4</label>
                  <input type="text" class="form-control" v-model="formData.desktopSpecs.IPv4">
                </div>

                <div class="col-md-2" v-if="formData.desktopSpecs.DHCP === 'Yes'">
                  <label class="form-label">IPv6</label>
                  <input type="text" class="form-control" v-model="formData.desktopSpecs.IPv6">
                </div>

                <div class="col-md-2" v-if="formData.desktopSpecs.DHCP === 'No'">
                  <label class="form-label">Gateway</label>
                  <input type="text" class="form-control" v-model="formData.desktopSpecs.Gateway">
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