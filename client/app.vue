<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup lang="ts">

  const message = ref('loading...');

  // Fetch data from the NestJS API on component mount
  onMounted(async () => {

    /*try {

      // Calling the Nest API directly

      const config = useRuntimeConfig();
      const response = await fetch(`${config.public.apiBase}/api`);
      const data = await response.text();
      message.value = data;

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }*/


    // Calling the Nest API via a server route
    try {
      const response = await fetch('/api/fetchData')
      const data = await response.json()
      message.value = data.message
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }

  });

</script>
