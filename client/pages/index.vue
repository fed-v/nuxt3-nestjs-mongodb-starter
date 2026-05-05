<template>
    <div>
      <h1>{{ message }}</h1>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <pre>{{ users }}</pre>
    </div>
</template>
  
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useApi, type ApiError } from '../composables/useApi';
  import { useUsersApi, type User } from '../composables/useUsersApi';
  
    const message = ref('loading...');
    const users = ref<User[]>([]);
    const errorMessage = ref('');
    const api = useApi();
    const usersApi = useUsersApi();
  
    // Fetch data from the NestJS API on component mount
    onMounted(async () => {

      try {
        message.value = await api.get<string>('/api');
      } catch (error) {
        const apiError = error as ApiError;
        errorMessage.value = apiError.message;
        console.error('Failed to fetch data:', apiError);
      }
  
      try {
        users.value = await usersApi.getUsers();
      } catch (error) {
        const apiError = error as ApiError;
        errorMessage.value = apiError.message;
        console.error('Failed to fetch users:', apiError);
      }
  
    });
  
</script>  