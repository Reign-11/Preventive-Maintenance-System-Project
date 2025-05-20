<script setup>
import Checkbox from '@/Components/Checkbox.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const emailInput = ref(null);

// Modified focus approach to avoid conflict
onMounted(() => {
    // Only set focus if no other element has focus
    if (document.activeElement === document.body && emailInput.value) {
        emailInput.value.focus();
    }
    
    // Preload both dashboard and admin assets by creating hidden iframes
    const preloadPages = () => {
        // Preload dashboard
        if (!document.getElementById('dashboard-preloader')) {
            const iframe = document.createElement('iframe');
            iframe.id = 'dashboard-preloader';
            iframe.src = route('dashboard');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Remove after loading to free memory
            iframe.onload = () => {
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 2000);
            };
        }
        
        // Preload admin page - check if route exists first
        if (!document.getElementById('admin-preloader') && route().has('admin')) {
            const adminIframe = document.createElement('iframe');
            adminIframe.id = 'admin-preloader';
            adminIframe.src = route('admin');
            adminIframe.style.display = 'none';
            document.body.appendChild(adminIframe);
            
            // Remove after loading to free memory
            adminIframe.onload = () => {
                setTimeout(() => {
                    document.body.removeChild(adminIframe);
                }, 2000);
            };
        }
    };
    
    // Wait until user has been on the page for a second before preloading
    // This avoids slowing down the initial page render
    setTimeout(preloadPages, 1000);
});

const submit = () => {
    // Submit login form - the redirect is handled on the backend
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
        preserveScroll: true,
        preserveState: true,
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Log in">
            <!-- Prefetch potential destinations -->
            <link rel="prefetch" v-if="route().has('User')":href="route('dashboard')">
            <link rel="prefetch" v-if="route().has('Admin')" :href="route('admin')">
        </Head>

        <!-- Status Message -->
        <div v-if="status" class="mb-4 font-medium text-sm text-green-600">
            {{ status }}
        </div>

        <!-- Log in Title -->
        <div class="text-center text-2xl font-semibold mb-6 text-gray-800">
            Log in to Your Account
        </div>

        <!-- Login Form -->
        <form @submit.prevent="submit">
            <div>
                <InputLabel for="email" value="Email" />
                <TextInput
                    id="email"
                    type="email"
                    class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out hover:shadow-lg"
                    v-model="form.email"
                    required
                    ref="emailInput"
                    autocomplete="username"
                />
                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <div class="mt-4">
                <InputLabel for="password" value="Password" />

                <TextInput
                    id="password"
                    type="password"
                    class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out hover:shadow-lg"
                    v-model="form.password"
                    required
                    autocomplete="current-password"
                />
                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <div class="block mt-4 flex items-center space-x-10">  
                <label class="flex items-center">  
                    <Checkbox name="remember" v-model:checked="form.remember" />  
                    <span class="ms-2 text-sm text-gray-600">Remember me</span>  
                </label>  

                <Link  
                    :href="route('register')"  
                    class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"  
                >  Not yet registered?  
                </Link>  
            </div>  

            <div class="flex items-center justify-end mt-4">
                <Link
                    v-if="canResetPassword"
                    :href="route('password.request')"
                    class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Forgot your password?
                </Link>

                <PrimaryButton 
                    class="ms-4" 
                    :class="{ 'opacity-25': form.processing }" 
                    :disabled="form.processing"
                >
                    Log in
                </PrimaryButton>
            </div>
        </form>
    </GuestLayout>
</template>