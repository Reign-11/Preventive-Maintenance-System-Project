<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';
import { ref } from 'vue';

// Checklist Data
const checklist = ref([
  {
    category: 'Data, Software and System Checks',
    items: [
      '<b>Check backups are working</b>',
      '<b>Check and update OS</b>',
      '<b>Update your control panel</b>',
      '<b>Check and update applications</b>',
      '<b>Check Remote Management Tools</b>',
      '&nbsp;&nbsp;&nbsp;&nbsp;Remote Console',
      '&nbsp;&nbsp;&nbsp;&nbsp;Remote Reboot',
      '&nbsp;&nbsp;&nbsp;&nbsp;Rescue mode',
      '<b>Check Server Usage</b>',
      '&nbsp;&nbsp;&nbsp;&nbsp;Disk',
      '&nbsp;&nbsp;&nbsp;&nbsp;CPU',
      '&nbsp;&nbsp;&nbsp;&nbsp;RAM',
      '&nbsp;&nbsp;&nbsp;&nbsp;Network',
      '<b>Review user accounts</b>',
      '<b>Free up server storage space</b>'
    ]
  },
  {
    category: 'Security Checks',
    items: [
      '<b>Change server passwords</b>',
      '<b>Firewall installed</b>',
      '<b>Perform a server malware scan</b>',
      '<b>Check fans and power supplies</b>',
      '<b>Check RAID fault tolerance</b>',
      '&nbsp;&nbsp;&nbsp;&nbsp;Perform all driver, controller firmware, and storage management application updates',
      '&nbsp;&nbsp;&nbsp;&nbsp;Run system consistency check',
      '&nbsp;&nbsp;&nbsp;&nbsp;Replace any drives that have failed or are showing signs of failing'
    ]
  },
  {
    category: 'Hardware Checks',
    items: [
      '<b>Check Cable Integrity</b>',
      '&nbsp;&nbsp;&nbsp;&nbsp;Cables are securely fixed at each connection point',
      '&nbsp;&nbsp;&nbsp;&nbsp;Cables are not twisted or under unnecessary strain',
      '&nbsp;&nbsp;&nbsp;&nbsp;Cables are all in good condition',
      '<b>Check A/C unit at the facility</b>'
    ]
  }
]);

// Status Selection
const statuses = ref({});
const setStatus = (item, status) => {
  statuses.value[item] = status;
};
</script>

<template>
  <MainLayout>
    <div class="container mt-4 p-4 rounded shadow-sm bg-white">
      <h2 class="text-center fw-bold">PREVENTIVE MAINTENANCE CHECKLIST FOR SERVERS/DATACENTER</h2>
      <p class="text-center">For the Month of ____________</p>
      <table class="table table-bordered">
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
              <td v-html="item"></td>
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
    </div>
  </MainLayout>
</template>

<style scoped>
.container {
  max-width: 80%;
  background: white;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.table th.text-center, .table td.text-center {
  text-align: center;
}

label {
  margin-right: 15px;
}
</style>
