<script setup>
import { ref, computed } from 'vue';
import MainLayout from '@/Layouts/MainLayout.vue';

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

const officeData = ref([
  { name: "College of Information Sciences and Computing", status: "Clear" },
  { name: "College of Arts and Sciences", status: "Clear" },
  { name: "Registrar Office", status: "Clear" },
  { name: "Research Office", status: "Clear" },
  { name: "Library", status: "Clear" },
]);

const displayedData = computed(() => officeData.value);

// Checklist Data
const checklist = ref([
  {
    category: 'Data, Software and System Checks',
    items: [
      'Check backups are working',
      'Check and update OS',
      'Update your control panel',
      'Check and update applications',
      'Check Remote Management Tools',
      'Check Server Usage',
      'Review user accounts',
      'Free up server storage space'
    ]
  },
  {
    category: 'Security Checks',
    items: [
      'Change server passwords',
      'Firewall installed',
      'Perform a server malware scan',
      'Check fans and power supplies',
      'Check RAID fault tolerance'
    ]
  },
  {
    category: 'Hardware Checks',
    items: [
      'Check Cable Integrity',
      'Check A/C unit at the facility'
    ]
  }
]);

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

</script>

<template>
  <MainLayout>
    <div class="container">
      <h2 class="text-center my-3">Preventive Maintenance 2025</h2> 

      <table class="data-table">
        <thead>
          <tr>
            <th>Office</th>
            <th>Actions</th>
            <th>Status</th>
            <th>Print Details</th> <!-- No conditions needed -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in displayedData" :key="index">
            <td>{{ item.name }}</td>
            <td>
              <button class="edit-btn" @click="openStep1Modal(item)">View</button>
            </td>
            <td :class="{ 'clear-status': item.status === 'Clear', 'unclear-status': item.status === 'Unclear' }">
              {{ item.status }}
            </td>
            <td>
              <button class="edit-btn" @click="printDetails(item)">Print</button>
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
            <template v-for="(category, index) in checklist" :key="index">
                <tr>
                <td :rowspan="category.items.length + 1" class="fw-bold">{{ category.category }}</td>
                </tr>
                <tr v-for="(item, idx) in category.items" :key="idx">
                <td>{{ item }}</td>
                <td class="text-center">
                    <input type="radio" :name="item" value="Good" @change="setStatus(item, 'Good')">
                </td>
                <td class="text-center">
                    <input type="radio" :name="item" value="Near Maintenance" @change="setStatus(item, 'Near Maintenance')">
                </td>
                <td class="text-center">
                    <input type="radio" :name="item" value="N/A" @change="setStatus(item, 'N/A')">
                </td>
                </tr>
            </template>
            </tbody>
        </table>

        <!-- Summary/Recommendation Section (Below Table) -->
        <div class="mt-3">
            <label for="comments" class="fw-bold">Summary/Recommendation</label>
            <textarea id="comments" v-model="comments" class="form-control" rows="3" placeholder="Enter any additional comments..."></textarea>
        </div>

        </div>
        <!-- Modal Body Ends -->

        <!-- Modal Footer -->
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        <button type="button" class="btn btn-primary" @click="saveChecklist">Save</button>
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