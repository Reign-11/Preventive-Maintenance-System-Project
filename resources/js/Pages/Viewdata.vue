<script setup>
import { ref, computed, defineProps, reactive, watchEffect,watch} from 'vue'; 
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


const selectedDepartments = ref (null)
const selectedPmYear = computed(() => props.pmYear ?? {});
const departments = ref(props.departments || []);
const selectedPlan = ref(props.PlanId || '');
const selectedDeptId = ref(props.deptId ?? null);
const selectedCategoryId = ref(props.categoryId ?? 2); 
console.log (departments.value)
watchEffect(() => {
  if (!selectedDeptId.value && props.departments?.length > 0) {
    selectedDeptId.value = props.departments[0].DeptId;
  }
  if (!selectedCategoryId.value && props.categories?.length > 0) {
    selectedCategoryId.value = 2;
  }
});

watchEffect(() => {
  selectedPlan.value = props.PlanId || '';
  console.log("Updated PlanId:", selectedPlan.value);
});

const isStep1ModalOpen = ref(false);

const openStep1Modal = (checkId) => {
  console.log("Clicked checkId:", checkId); // ✅ log the correct ID
  selectedDepartments.value = departments.value.find(dep => dep.checkId === checkId); // ✅ match the selected department
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
  {  value: '1' },
  {  value: '2' },
  {  value: '3' }
];


// Checklist Data
const checklist = reactive({
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





const statuses = ref({});
const setStatus = (item, status) => {
  statuses.value[item] = status;
};
const selectedMonth = ref('');
const months = ref([
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
]);
const saveChecklist = () => {
  console.log("Saved Checklist Data:", statuses.value);
  alert("Checklist saved successfully!");
  closeModal();
};

const printDetails = (item) => {
  const modalHtml = `
    <html>
      <head>
        <title>Print Modal</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .modal-content { font-size: 16px; }
        </style>
      </head>
      <body>
        <h2>Office/User Details</h2>
        <div class="details">
          <p><strong>Name:</strong> ${item.name}</p>
          <p><strong>Status:</strong> ${item.status}</p>
        </div>
        <div class="modal-body">
          <p><strong>Equipment Installed:</strong> ${item.equipmentInstalled ? item.equipmentInstalled.join(', ') : 'N/A'}</p>
          <p><strong>Operating System:</strong> ${item.osInstalled || 'N/A'}</p>
          <p><strong>Software Installed:</strong> ${item.softwareInstalled ? item.softwareInstalled.join(', ') : 'N/A'}</p>
          <p><strong>PC Specifications:</strong> ${JSON.stringify(item.desktopSpecs)}</p>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(modalHtml);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  },10); // Wait for 500ms before printin
};



watch(selectedDepartments, (newVal) => {
  console.log("selectedDepartments changed to:", newVal);
  if (newVal) {
    for (const key in checklist) {
      checklist[key] = newVal[key] || "";
    }


    checklist.data_softsystem_checks1 = newVal.data_softsystem_checks1 || "";
    checklist.data_softsystem_checks2 = newVal.data_softsystem_checks2 || "";
    checklist.data_softsystem_checks3 = newVal.data_softsystem_checks3 || "";
    checklist.data_softsystem_checks4 = newVal.data_softsystem_checks4 || "";
    checklist.data_softsystem_checks5 = newVal.data_softsystem_checks5 || ""; 
    checklist.data_softsystem_checks6 = newVal.data_softsystem_checks6 || "";
    checklist.data_softsystem_checks7 = newVal.data_softsystem_checks7 || "";
    checklist.data_softsystem_checks8 = newVal.data_softsystem_checks8  || "";

    checklist.security_checks1 = newVal.security_checks1 || "";
    checklist.security_checks2 = newVal.security_checks2 || "";
    checklist.security_checks3 = newVal.security_checks3 || "";
    checklist.security_checks4 = newVal.security_checks4 || "";
    checklist.security_checks5 = newVal.security_checks5 || "";

    checklist.hardware_checks1 = newVal.hardware_checks1  || "";
    checklist.hardware_checks2 = newVal.hardware_checks2 || "";

    checklist.Summary = newVal.Summary || "";

    }
    });

</script>

<template>
  <MainLayout>
    <div class="container">
      <h1> {{ selectedPmYear.Description }} {{ selectedPmYear.Name }}</h1>

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
          <td class="text-center">
            <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto mx-2" 
                @click="openStep1Modal(department.checkId)">
                <i class="fas fa-edit me-1"></i> View Form
              </button>
              <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto" 
                @click="printDetails(department)">
                <i class="fas fa-print me-1"></i> Print
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
    
    <div v-if="isStep1ModalOpen" class="modal">
    <div class="modal-content">

        <!-- Modal Body Starts -->
        <div class="modal-body">
        
        <!-- Title (Above the Table) -->
        <h3 class="modal-title text-center fw-bold">PREVENTIVE MAINTENANCE CHECKLIST FOR SERVERS/DATACENTER</h3>
        
        <!-- Month Dropdown (Directly Under Title) -->
        <div class="text-center mt-2">
        <label for="month-select" class="fw-semibold me-2">For the Month:</label>
        <select id="month-select" v-model="selectedMonth" class="form-select d-inline-block w-auto">
            <option value="" disabled>Select</option>
            <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
        </div>

        <!-- Preventive Maintenance Checklist Table -->
        <table class="table table-bordered mt-3">
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
              <tr>
                <td class="border px-4 py-2" rowspan="8">Data, Software and System Checks </td>
                <td class="border px-4 py-2">Check backups are working  </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'backup_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks1" disabled/>
                    <label class="form-check-label" :for="'backup_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check and update OS  </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Os_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks2" disabled/>
                    <label class="form-check-label" :for="'Os_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Update your control panel </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Panel_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks3" disabled/>
                    <label class="form-check-label" :for="'Panel_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check and update applications </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Applications_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks4"disabled />
                    <label class="form-check-label" :for="'Applications_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check Remote Management Tools</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Tools_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks5" disabled/>
                    <label class="form-check-label" :for="'Tools_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check Server Usage</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Usage_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks6"disabled />
                    <label class="form-check-label" :for="'Usage_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Review user acounts</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Account_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks7" disabled/>
                    <label class="form-check-label" :for="'Account_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Free up server storage space</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Space_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks8" disabled/>
                    <label class="form-check-label" :for="'Space_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <td class="border px-4 py-2" rowspan="5">Security Checks </td>
                <td class="border px-4 py-2">Change server passwords </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Checks_' + opt.value" :value="opt.value" v-model="checklist.security_checks1" disabled/>
                    <label class="form-check-label" :for="'Checks_' + opt.value"> </label> </div>
                  </td>
              <tr>
                <td class="border px-4 py-2">Firewall installed </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Firewall_' + opt.value" :value="opt.value" v-model="checklist.security_checks2" disabled/>
                    <label class="form-check-label" :for="'Firewall_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Perform a server malware scan </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Malware_' + opt.value" :value="opt.value" v-model="checklist.security_checks3"disabled />
                    <label class="form-check-label" :for="'Malware_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check fans and power supplies</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Power_' + opt.value" :value="opt.value" v-model="checklist.security_checks4"disabled />
                    <label class="form-check-label" :for="'Power_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check RAID fault tolerance</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Fault_' + opt.value" :value="opt.value" v-model="checklist.security_checks5"disabled />
                    <label class="form-check-label" :for="'Fault_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <td class="border px-4 py-2" rowspan="2">Hardware Checks </td>
                <td class="border px-4 py-2">Check Cable Integrity </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware_' + opt.value" :value="opt.value" v-model="checklist.hardware_checks1" disabled/>
                    <label class="form-check-label" :for="'Hardware_' + opt.value"> </label> </div>
                  </td>
              <tr>
                <td class="border px-4 py-2">Check A/C unit at the facility </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Facility_' + opt.value" :value="opt.value" v-model="checklist.hardware_checks2"disabled />
                    <label class="form-check-label" :for="'Facility_' + opt.value"> </label> </div>
                  </td>
              </tr>
            </tbody>
        </table>

        <!-- Summary/Recommendation Section (Below Table) -->
        <div class="mt-3">
            <label for="comments" class="fw-bold">Summary/Recommendation</label>
            <textarea id="comments" v-model="checklist.Summary" class="form-control" rows="3" placeholder="Enter any additional comments..." disabled></textarea>
        </div>

        </div>
        <!-- Modal Body Ends -->

        <!-- Modal Footer -->
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        <!-- <button type="button" class="btn btn-primary" @click="submitChecklist">Save</button> -->
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