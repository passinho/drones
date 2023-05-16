<template>
  <main>
    <!-- Main Content -->
      <app-upload />
</main>
</template>

<script>
import AppUpload from "@/components/Upload.vue";

export default {
  name: "Manage",
  components: {
    AppUpload,
  },
};
</script>
