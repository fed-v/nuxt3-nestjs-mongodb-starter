<template>
  <div>
    <h1>{{ message }}</h1>
    <pre>{{ users }}</pre>
  </div>
</template>

<script setup lang="ts">

  const message = ref('loading...');
  const users = ref();

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
      const response = await fetch('/api/fetchHello')
      const data = await response.json()
      message.value = data.message
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }


    try {
      const response = await fetch('/api/fetchUsers')
      const data = await response.json()
      users.value = data.message
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }

  });

</script>
