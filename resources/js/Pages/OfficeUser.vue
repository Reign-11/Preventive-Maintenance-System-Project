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

// Print table function
const printTable = () => {
  const printStyles = `
    <style>
      @media print {
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; font-size: 18px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .no-print { display: none; }
      }
    </style>
  `;
  
  const tableClone = document.querySelector('.data-table').cloneNode(true);
  const actionCells = tableClone.querySelectorAll('td:nth-child(2)');
  
  // Hide action buttons in print
  actionCells.forEach(cell => {
    cell.classList.add('no-print');
  });
  
  const printContent = `
    <html>
      <head>
        <title>${selectedPmYear.value.Description} ${selectedPmYear.value.Name}</title>
        ${printStyles}
      </head>
      <body>
        <h1>${selectedPmYear.value.Description} ${selectedPmYear.value.Name}</h1>
        ${tableClone.outerHTML}
      </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
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
      <div class="page-header">
        <h1 class="title">{{ selectedPmYear.Description }} {{ selectedPmYear.Name }}</h1>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Office</th>
              <th v-if="isUserSelected || isOfficeSelected">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="department in departments" :key="department.deptId" class="table-row">
              <td class="dept-name">{{ department.department_name }}</td>
              
              <td v-if="isUserSelected || isOfficeSelected" class="actions-cell">
                <div class="action-buttons">
                  <Link 
                    :href="route('department-employees', { 
                      departmentId: department.DeptId, 
                      officeId: selectedOfficeId, 
                      YrId: selectedYear,
                      PlanId: selectedPlan
                    })"
                    class="btn view-btn"
                    @click.prevent="logParams(department.DeptId)">
                    <i class="fas fa-eye"></i> View User
                  </Link>
                  
                  <Link 
                    :href="route('equipment', { 
                      departmentId: department.DeptId, 
                      officeId: selectedOfficeId, 
                      YrId: selectedYear,
                      PlanId: selectedPlan
                    })"
                    class="btn equipment-btn"
                    @click.prevent="logParams(department.DeptId)">
                    <i class="fas fa-tools"></i> Add Equipment
                  </Link>
                </div>
              </td>
              
              
              <td v-if="isUserSelected">
                <button class="btn print-item-btn" @click="printDetails(department)">
                  <i class="fas fa-print"></i> Print
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
/* Base Styles */
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

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

/* Table Container */
.table-container {
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
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
  text-align: left;
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

.print-btn {
  background-color: #34495e;
  color: white;
}

.print-btn:hover {
  background-color: #2c3e50;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.view-btn {
  background-color: #3498db;
  color: white;
}

.view-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.equipment-btn {
  background-color: #2ecc71;
  color: white;
}

.equipment-btn:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.print-item-btn {
  background-color: #9b59b6;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.print-item-btn:hover {
  background-color: #8e44ad;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-na {
  background-color: #f8f9fa;
  color: #95a5a6;
  border: 1px solid #ddd;
}

.clear-status {
  background-color: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.unclear-status {
  background-color: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

/* Action Cell Styling */
.actions-cell {
  min-width: 300px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .container {
    padding: 1.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .actions-cell {
    padding: 0.75rem 0.5rem;
  }
  
  .btn {
    width: 100%;
    padding: 0.6rem 0.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .action-bar {
    margin-bottom: 1rem;
  }
  
  .action-buttons {
    width: 100%;
  }
}

/* Print Styles */
@media print {
  .action-bar, 
  .action-buttons {
    display: none !important;
  }
  
  .container {
    padding: 0;
  }
  
  .table-container {
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .data-table th {
    background-color: #f2f2f2 !important;
    color: #000 !important;
  }
  
  .data-table th,
  .data-table td {
    border: 1px solid #000;
  }
  
  .title {
    border-bottom: 2px solid #000;
  }
}
</style>