<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h1>Entrar</h1>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="seu@email.com"
          required
          autocomplete="email"
        />
      </div>

      <div class="field">
        <label for="password">Senha</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="••••••••"
          required
          autocomplete="current-password"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p class="first-access">É sua primeira vez? <span><RouterLink to="/register">Crie a sua conta</RouterLink></span></p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { RouterLink } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    errorMessage.value =
      err.response?.data?.detail ??
      'Erro ao entrar. Verifique suas credenciais.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0 32px;
}

.login-form {
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 10px 30px rgba(74, 144, 217, 0.12);
  border: 1px solid #e8f1fc;
}

.login-form h1 {
  font-size: 1.5rem;
  color: #4a90d9;
  text-align: center;
  margin-bottom: 8px;
}

.error-message {
  margin-bottom: 14px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff1f2;
  color: #b42318;
  font-size: 0.9rem;
  border: 1px solid #fecdd3;
}

.field {
  margin-bottom: 14px;
}

.field label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 6px;
}

.field input {
  width: 100%;
  border: 1px solid #dbe7f5;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 1rem;
  background: #f9fbff;
  color: #1f2937;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus {
  border-color: #4a90d9;
  box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.16);
}

button[type='submit'] {
  width: 100%;
  border: none;
  border-radius: 999px;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #4a90d9, #2d6fb6);
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(74, 144, 217, 0.22);
}

button[type='submit']:disabled {
  opacity: 0.75;
  cursor: wait;
}

.first-access {
  margin: 20px 0 0 5px;
  font-size: 80%;
}

@media (min-width: 480px) {
  .login-form {
    padding: 28px 24px;
  }
}
</style>