<script setup>
import { ref, computed, defineProps, watchEffect, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
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

// Reactive variables
const isStep1ModalOpen = ref(false);

const selectedOption = ref("Office");

const selectedPmYear = computed(() => props.pmYear ?? {});
const selectedOfficeId = ref(props.office?.OffId || '');
const selectedYear = ref(props.YrId || '');
const departments = ref(props.departments || []);
const selectedPlan = ref(props.PlanId || '');
const selectedDeptId = ref(props.deptId ?? null);
const selectedCategoryId = ref(props.categoryId ?? 1); // Default categoryId to 1

watchEffect(() => {
  if (!selectedDeptId.value && props.departments?.length > 0) {
    selectedDeptId.value = props.departments[0].DeptId;
  }
  if (!selectedCategoryId.value && props.categories?.length > 0) {
    selectedCategoryId.value = 1; // Ensure categoryId is set to 1
  }
});

// Watch for changes in the PlanId prop and log (remove if unnecessary)
watchEffect(() => {
  selectedPlan.value = props.PlanId || '';
  console.log("Updated PlanId:", selectedPlan.value);
});

// Log selected parameters when navigating
const logParams = (deptId) => {
  if (deptId) {
    selectedDeptId.value = deptId; // Update before navigating
  }
  console.log("Navigating to UserTable with Params:", {
    officeId: selectedOfficeId.value,
    YrId: selectedYear.value,
    deptId: selectedDeptId.value,
    PlanId: selectedPlan.value
  });
};

// On mounted, log data for debugging
onMounted(() => {
  console.log('Departments:', props.departments);
  console.log('Selected Office ID:', selectedOfficeId.value);
  console.log('Selected Year:', selectedYear.value);
  console.log('Selected Plan:', selectedPlan.value);
});





// Computed properties
const isUserSelected = computed(() => selectedOption.value === "Users");
const isOfficeSelected = computed(() => selectedOption.value === "Office");

// Modal functions
const openStep1Modal = () => {
  isStep1ModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};




// Print modal content
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
        <h2>${selectedOption.value === 'Office' ? 'Office' : 'User'} Details</h2>
        <p><strong>Name:</strong> ${item.name}</p>
        <p><strong>Status:</strong> ${item.status}</p>
        <p><strong>Equipment Installed:</strong> ${item.equipmentInstalled?.join(', ') || 'N/A'}</p>
        <p><strong>Operating System:</strong> ${item.osInstalled || 'N/A'}</p>
        <p><strong>Software Installed:</strong> ${item.softwareInstalled?.join(', ') || 'N/A'}</p>
        <p><strong>PC Specifications:</strong> ${JSON.stringify(item.desktopSpecs)}</p>
      </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(modalHtml);
  printWindow.document.close();
  printWindow.print();
};


</script>




<template>
  <MainLayout>
    <div class="container">
      <div>
    
    <h1> {{ selectedPmYear.Description }} {{ selectedPmYear.Name }}</h1>

  </div>

      <div class="d-flex align-items-center justify-content-center gap-2 ">
     
        <button class="btn btn-info d-flex align-items-center" v-if="!isUserSelected" @click="printTable">
          <i class="fas fa-print me-1"></i> Print
        </button>
      </div>


      <table class="data-table mt-2">
      <thead>
        <tr>
          <th>Office</th>
          <th v-if="isUserSelected || isOfficeSelected">Actions</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="department in departments" :key="department.deptId">
          <td>{{ department.department_name }}</td>
          <td v-if="isUserSelected || isOfficeSelected">
     
        
    <Link 
      :href="route('department-employees', { 
    departmentId: department.DeptId , 
       officeId: selectedOfficeId, 
        YrId: selectedYear,
        PlanId: selectedPlan
      })"
      class="btn btn-sm btn-outline-primary w-auto align-items-center mx-2"
      @click.prevent="logParams(department.DeptId)">
      <i class="fas fa-eye me-1"></i> View User
    </Link>

    <Link 
      :href="route('equipment', { 
    departmentId: department.DeptId , 
       officeId: selectedOfficeId, 
        YrId: selectedYear,
        PlanId: selectedPlan
      })"
      class="btn btn-sm btn-outline-primary w-auto align-items-center"
      @click.prevent="logParams(department.DeptId)">
      <i class="fas fa-eye me-1"></i> Add Equipment 
    </Link>
          </td>
          <td class="status-column">N/A</td> 
          <td v-if="isUserSelected">
            <button class="edit-btn" @click="printDetails(department)">Print</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </MainLayout>
</template>


<style scoped>
/* Background & Container */
.container {
  text-align: center;
  padding: 30px;
  min-height: 100vh;
}

/* Controls */
.controls {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* Dropdown */
select {
  padding: 10px;
  font-size: 16px;
  border-radius: 6px;
  border: 2px solid #2c3e50;
  background-color: #ffffff;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  min-width: 150px;
  font-weight: bold;
}

/* Table */
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

/* Status Colors */
.clear-status {
  color: #27ae60;
  font-weight: bold;
}

.unclear-status {
  color: #e74c3c;
  font-weight: bold;
}

/* Edit Button */
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

/* Hover Effect on Table Rows */
.data-table tr:hover {
  background-color: rgba(44, 62, 80, 0.1);
  transition: background-color 0.3s ease-in-out;
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
  max-width: 1400px; /* Increase max width */
  max-height: 90vh; /* Prevent it from going beyond the viewport */
  display: flex;
  flex-direction: column;
}

/* Increase the height and make it scrollable */
.modal-body {
  max-height: 70vh; /* Adjust height for better visibility */
  overflow-y: auto; /* Enable scrolling */
  padding-right: 10px;
}

/* Ensure modal stays centered */
.modal-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Centering fix */
}

.input-field {
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 2px solid #2c3e50;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.save-btn {
  background-color: #27ae60;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.print-btn {
  background-color: #4CAF50; /* Green or any color you prefer */
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}
.print-btn:hover {
  background-color: #45a049; /* Darker shade on hover */
}

@media print {
    body { font-family: Arial, sans-serif; padding: 20px; }
    h2 { text-align: center; }
    .modal { display: none !important; } /* Hide modals during print */
}

/* Left-align the headings inside the cards */
.card h6 {
  text-align: left;
}

/* Left-align the labels inside the form groups */
.card .form-check-label {
  text-align: left;
}

/* Additional styling to ensure that the checkboxes and radio buttons align left */
.card .form-check {
  text-align: left;
}

/* Ensure the input fields also align left */
.card .form-control {
  text-align: left;
}

</style>


