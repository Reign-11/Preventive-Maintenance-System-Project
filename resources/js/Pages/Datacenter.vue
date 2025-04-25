<script setup>
import { ref, computed,watchEffect,onMounted ,defineProps, reactive, toRaw } from 'vue';
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


const selectedDepartments = ref (null)
const selectedPmYear = computed(() => props.pmYear ?? {});
const selectedOfficeId = ref(props.office?.OffId || '');
const selectedYear = ref(props.YrId || '');
const departments = ref(props.departments || []);
const selectedPlan = ref(props.PlanId || '');
const selectedDeptId = ref(props.deptId ?? null);
const selectedCategoryId = ref(props.categoryId ?? 2); 
const getPlanId = () => {
  return props.departments.length > 0 ? props.departments[0].PlanId : null;
};

const selectedMonth = ref('');
const months = ref([]);
const hasLoadedMonths = ref(false);
const deptId = ref('');

const fetchMonths = async () => {
  const PlanId = getPlanId();
  // Make sure deptId is a simple value, not an object
  const departmentId = typeof deptId.value === 'object' ? deptId.value.id || '' : deptId.value;
  const OffId = selectedDepartments.value?.OffId || '';
  
  console.log("Debug values:", { PlanId, departmentId, OffId }); // Add this for debugging
  
  if (!PlanId || !departmentId || !OffId) {
    console.warn("Missing required parameters for fetchMonths:", { PlanId, departmentId, OffId });
    return;
  }

  try {
    const response = await axios.get(`/api/getAvailableMonths/${PlanId}/${departmentId}/${OffId}`);
    months.value = response.data.map(item => item.MonthName);
    hasLoadedMonths.value = true;
  } catch (error) {
    console.error("Failed to fetch months:", error);
  }
};

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
const editedItem = ref({}); 

const openStep1Modal = (item) => {
  console.log("Clicked deptId:", item); // 🔍 see if it's the expected ID
  isStep1ModalOpen.value = true;
  disableBackgroundScroll();
  deptId.value = item;
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

watchEffect(() => {
  if (!selectedDepartments.value && departments.value.length > 0) {
    selectedDepartments.value = departments.value.find(dep => dep.OffId && dep.PlanId) || departments.value[0];
  }
});

const submitChecklist = async () => {
  try {
    const payload = {
      YrId: props.YrId,
      OffId: selectedDepartments.value?.OffId || '',
      PlanId: selectedDepartments.value?.PlanId || '',
      deptId: deptId.value,
      Months: selectedMonth.value,

      data_softsystem_checks1: checklist.data_softsystem_checks1,
      data_softsystem_checks2: checklist.data_softsystem_checks2,
      data_softsystem_checks3: checklist.data_softsystem_checks3,
      data_softsystem_checks4: checklist.data_softsystem_checks4,
      data_softsystem_checks5: checklist.data_softsystem_checks5,
      data_softsystem_checks6: checklist.data_softsystem_checks6,
      data_softsystem_checks7: checklist.data_softsystem_checks7,
      data_softsystem_checks8: checklist.data_softsystem_checks8,

      security_checks1: checklist.security_checks1,
      security_checks2: checklist.security_checks2,
      security_checks3: checklist.security_checks3,
      security_checks4: checklist.security_checks4,
      security_checks5: checklist.security_checks5,

      hardware_checks1: checklist.hardware_checks1,
      hardware_checks2: checklist.hardware_checks2,

      Summary: checklist.Summary,

    };

    // Optionally: clean checklist before submitting if it might be reactive
    // Object.assign(payload, toRaw(checklist)); <-- Only if `checklist` is reactive

    const response = await axios.post('/api/addDatacenter', payload);

    console.log("Checklist submitted:", response.data);
    alert("Checklist submitted successfully!");
    
    // Reset form data
    resetForm();
    
    // Reset selected month
    const submittedMonth = selectedMonth.value;
    selectedMonth.value = '';
    
    // Remove the submitted month from the dropdown
    months.value = months.value.filter(month => month !== submittedMonth);
    
    // Alternatively, completely refresh the months list
    // This is more thorough but makes an extra API call
    hasLoadedMonths.value = false;
    fetchMonths();
    closeModal();
  } catch (error) {
    console.error("Submission error:", error.response?.data || error.message);
    alert("Something went wrong during submission.");
  }
};





// Reset form function
const resetForm = () => {
  // Reset all checklist values
  Object.keys(checklist).forEach(key => {
    if (typeof checklist[key] === 'number') {
      checklist[key] = 0;
    } else if (typeof checklist[key] === 'string') {
      checklist[key] = '';
    }
  });
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

const options = [
  {  value: '1' },
  {  value: '2' },
  {  value: '3' }
];
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
          <th>Show ticket</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="department in departments" :key="department.deptId">
          <td>{{ department.department_name }}</td>

          <!-- Actions Column -->
          <td class="text-center">
            <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-outline-primary d-flex align-items-center w-auto mx-2" 
                @click="openStep1Modal(department.DeptId)">
                <i class="fas fa-edit me-1"></i> Fillup Form
              </button>
            
            </div>
          </td>

          <!-- Status Column -->
          <td :class="{ 'clear-status': department.status === 'Clear', 'unclear-status': department.status === 'Unclear' }">
            {{ department.status }}
          </td>

          <!-- Show Ticket Column -->
          <td class="text-center">
            <Link 
              :href="route('viewdata', { 
                departmentId: department.DeptId , 
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
    
    <div v-if="isStep1ModalOpen" class="modal">
    <div class="modal-content">

        <!-- Modal Body Starts -->
        <div class="modal-body">
        
        <!-- Title (Above the Table) -->
        <h3 class="modal-title text-center fw-bold">PREVENTIVE MAINTENANCE CHECKLIST FOR SERVERS/DATACENTER</h3>
        
        <!-- Month Dropdown (Directly Under Title) -->
 <!-- Month Dropdown (Directly Under Title) -->
<div class="text-center mt-2">
  <label for="month-select" class="fw-semibold me-2">For the Month:</label>
  <select
    id="month-select"
    v-model="selectedMonth"
    class="form-select d-inline-block w-auto"
    @click="fetchMonths(selectedPlan.PlanId)"
  >
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
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'backup_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks1" />
                    <label class="form-check-label" :for="'backup_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check and update OS  </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Os_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks2" />
                    <label class="form-check-label" :for="'Os_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Update your control panel </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Panel_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks3" />
                    <label class="form-check-label" :for="'Panel_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check and update applications </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Applications_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks4" />
                    <label class="form-check-label" :for="'Applications_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check Remote Management Tools</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Tools_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks5" />
                    <label class="form-check-label" :for="'Tools_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check Server Usage</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Usage_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks6" />
                    <label class="form-check-label" :for="'Usage_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Review user acounts</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Account_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks7" />
                    <label class="form-check-label" :for="'Account_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Free up server storage space</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Space_' + opt.value" :value="opt.value" v-model="checklist.data_softsystem_checks8" />
                    <label class="form-check-label" :for="'Space_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <td class="border px-4 py-2" rowspan="5">Security Checks </td>
                <td class="border px-4 py-2">Change server passwords </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Checks_' + opt.value" :value="opt.value" v-model="checklist.security_checks1" />
                    <label class="form-check-label" :for="'Checks_' + opt.value"> </label> </div>
                  </td>
              <tr>
                <td class="border px-4 py-2">Firewall installed </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Firewall_' + opt.value" :value="opt.value" v-model="checklist.security_checks2" />
                    <label class="form-check-label" :for="'Firewall_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Perform a server malware scan </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Malware_' + opt.value" :value="opt.value" v-model="checklist.security_checks3" />
                    <label class="form-check-label" :for="'Malware_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check fans and power supplies</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Power_' + opt.value" :value="opt.value" v-model="checklist.security_checks4" />
                    <label class="form-check-label" :for="'Power_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <tr>
                <td class="border px-4 py-2">Check RAID fault tolerance</td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Fault_' + opt.value" :value="opt.value" v-model="checklist.security_checks5" />
                    <label class="form-check-label" :for="'Fault_' + opt.value"> </label> </div>
                  </td>
              </tr>
              <td class="border px-4 py-2" rowspan="2">Hardware Checks </td>
                <td class="border px-4 py-2">Check Cable Integrity </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Hardware_' + opt.value" :value="opt.value" v-model="checklist.hardware_checks1" />
                    <label class="form-check-label" :for="'Hardware_' + opt.value"> </label> </div>
                  </td>
              <tr>
                <td class="border px-4 py-2">Check A/C unit at the facility </td>
                <td v-for="opt in options" :key="opt.value" class="border text-center">
                  <div class="form-check form-check-inline"><input class="form-check-input" type="radio"  :id="'Facility_' + opt.value" :value="opt.value" v-model="checklist.hardware_checks2" />
                    <label class="form-check-label" :for="'Facility_' + opt.value"> </label> </div>
                  </td>
              </tr>
            </tbody>
        </table>

        <!-- Summary/Recommendation Section (Below Table) -->
        <div class="mt-3">
            <label for="comments" class="fw-bold">Summary/Recommendation</label>
            <textarea id="comments" v-model="checklist.Summary" class="form-control" rows="3" placeholder="Enter any additional comments..."></textarea>
        </div>

        </div>
        <!-- Modal Body Ends -->

        <!-- Modal Footer -->
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        <button type="button" class="btn btn-primary" @click="submitChecklist">Save</button>
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