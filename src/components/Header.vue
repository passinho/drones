<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'manage' }"
        exact-active-class="no-active"
      >
        Test Drones
      </router-link>
    </nav>
  </header>
</template>

<script>
    export default {
      name: "AppHeader",
    };
</script>
