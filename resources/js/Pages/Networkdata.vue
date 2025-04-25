<script setup>
import MainLayout from '@/Layouts/MainLayout.vue';



const props = defineProps({
  networks: { type: Array, default: () => [] },  
  pmYear: { type: Object, default: () => ({}) },
  YrId: { type: [String, Number], default: null },
  PlanId: { type: [String, Number], default: null },
  office: { type: Object, default: () => ({}) },
  deptId: { type: [String, Number], default: null },
  categoryId: { type: [String, Number], default: null }
});
</script>

<template>
<MainLayout>


    
</MainLayout>
    


   
</template>