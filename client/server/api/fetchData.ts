// server/api/fetchData.ts
export default defineEventHandler(async () => {

  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/api`);
  const data = await response.text();

  return {
    message: data
  };

});
