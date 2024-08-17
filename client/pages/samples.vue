<template>
    <div class="sample-page">
      <header class="header">
        <h1 class="title">Welcome to the Sample Page</h1>
        <p class="subtitle">This page demonstrates the usage of CSS variables and mixins.</p>
      </header>
  
      <main class="content">
        <section class="intro">
          <p class="text-lg">
            This is an example of responsive typography. Resize the window to see how the text adjusts.
          </p>
          <button class="btn-primary">Primary Button</button>
        </section>
  
        <section class="grid-demo">
          <div class="grid-container">
            <div class="grid-item">
              <div class="card elevation-1">Grid Item 1</div>
            </div>
            <div class="grid-item">
              <div class="card elevation-2">Grid Item 2</div>
            </div>
            <div class="grid-item grid-item-span-2">
              <div class="card elevation-3">Grid Item 3 (Span 2)</div>
            </div>
          </div>
        </section>
  
        <section class="animation-demo">
          <div class="fade-in card elevation-1">This element fades in</div>
        </section>
  
        <section class="flex-demo flex-center">
          <div class="card elevation-2 rounded">
            <p class="truncate">
              This is a very long text that will be truncated if it exceeds the available width. 
            </p>
          </div>
        </section>
      </main>
  
      <footer class="footer">
        <p class="text-center">
          © 2024 Sample Project
        </p>
      </footer>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .sample-page {
    background-color: var(--background-color);
    color: var(--text-color);
    padding: var(--space-lg);
    font-family: var(--font-family);
  }
  
  .header {
    margin-bottom: var(--space-xl);
  }
  
  .title {
    font-size: var(--font-size-lg);
    text-align: center;
    margin-bottom: var(--space-md);
  }
  
  .subtitle {
    font-size: var(--font-size-md);
    text-align: center;
    color: var(--secondary-color);
  }
  
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }
  
  .intro {
    text-align: center;
  }
  
  .grid-demo .grid-container {
    gap: var(--space-md);
  }
  
  .card {
    background-color: #fff;
    padding: var(--space-md);
    border-radius: var(--border-radius);
  }
  
  .animation-demo {
    text-align: center;
    margin-top: var(--space-lg);
  }
  
  .flex-demo {
    text-align: center;
    margin-top: var(--space-lg);
  }
  
  .footer {
    margin-top: var(--space-xl);
  }
  
  .btn-primary {
    margin-top: var(--space-md);
  }
  </style>
  