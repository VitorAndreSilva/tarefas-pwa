<template>
  <header class="app-header">
    <h1>Tarefas</h1>
    <nav>
      <router-link to="/">Início</router-link>
      <router-link to="/about">Sobre</router-link>
      <button
        v-if="authStore.isAuthenticated"
        class="logout-btn"
        @click="handleLogout"
      >
        Sair
      </button>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0 12px;
  border-bottom: 2px solid #4a90d9;
  margin-bottom: 20px;
  gap: 10px;
}

.app-header h1 {
  font-size: 1.25rem;
  color: #4a90d9;
  font-weight: 700;
}

nav {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

nav a {
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 4px 6px;
}

nav a.router-link-active {
  color: #4a90d9;
}

.logout-btn {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c02413;
}

@media (max-width: 480px) {
  .app-header {
    padding: 12px 0 10px;
  }

  nav {
    gap: 6px;
  }

  nav a {
    font-size: 0.82rem;
  }

  .logout-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}
</style>