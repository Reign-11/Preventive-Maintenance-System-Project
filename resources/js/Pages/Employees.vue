<script setup>
import { ref, computed, onMounted, onBeforeUnmount,defineProps} from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';


const props = defineProps({
  employees: { type: Array, default: () => [] },
  officeId: { type: [String, Number], default: '' },
  YrId: { type: [String, Number], default: '' },
  employeeId: { type: [String, Number], default: '' },
  PlanId: { type: [String, Number], default: '' },
  departmentId: { type: [String, Number], default: '' },
  categoryId: { type: [String, Number], default: 1 },
  pmYear: {type: Object, default: () => ({ Name: '',Description: '' })}
});

const employees = ref(props.employees || []);



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
          <tr v-for="employees in employees" :key="employees.mainId">
  <td>{{employees.ticketnumber }}</td>

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