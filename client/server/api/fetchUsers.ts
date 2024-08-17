export default defineEventHandler(async () => {

  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/users`);
  const data = await response.text();

  return {
    message: data
  };

});