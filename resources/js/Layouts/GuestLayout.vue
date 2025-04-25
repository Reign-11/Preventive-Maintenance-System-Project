<script setup>
// import ApplicationLogo from '@/Components/ApplicationLogo.vue';
// import { Link } from '@inertiajs/vue3';
</script>

<template>
    <div class="min-h-screen flex w-full relative overflow-hidden">
        <!-- Left Illustration -->
        <div class="w-1/2 bg-white flex items-center justify-center z-10">
            <img src="/assets/2.svg" alt="Illustration" class="w-[80%] h-auto object-contain" />
        </div>

        <!-- Right Form -->
        <div class="w-1/2 flex items-center justify-center z-10">
            <div class="bg-white bg-opacity-70 backdrop-blur-lg w-full max-w-sm p-8 rounded-xl shadow-lg shadow-2xl transform transition-all duration-500 hover:scale-105">
                <slot />
            </div>
        </div>

        <!-- Curved Background Overlay -->
        <div class="absolute top-0 right-0 w-1/2 h-full bg-[#d9f3e8] z-0 curve-shape" />
    </div>
</template>

<style scoped>
.curve-shape {
    clip-path: ellipse(90% 100% at 100% 50%);
}
</style>
