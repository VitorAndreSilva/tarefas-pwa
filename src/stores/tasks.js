import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import tasksApi from '../api/tasksApi.js';

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const pendingTasks = computed(() => tasks.value.filter((t) => !t.done));
  const completedTasks = computed(() => tasks.value.filter((t) => t.done));

  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    try {
      const response = await tasksApi.getAll();
      tasks.value = response.data;
    } catch (err) {
      error.value = 'Erro ao carregar tarefas.';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function addTask({ title, imgAttachmentKey, latitude, longitude } = {}) {
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return;

    error.value = null;

    const payload = {
      title: trimmedTitle,
    };

    if (imgAttachmentKey != null) {
      payload.img_attachment_key = imgAttachmentKey;
    }

    if (latitude != null) {
      payload.latitude = latitude;
    }

    if (longitude != null) {
      payload.longitude = longitude;
    }

    try {
      const response = await tasksApi.create(payload)
      const created = response.data
      // fallback: if backend didn't return latitude/longitude, keep local payload
      if ((created.latitude == null || created.longitude == null) && (payload.latitude != null || payload.longitude != null)) {
        tasks.value.push({ ...created, latitude: payload.latitude ?? created.latitude, longitude: payload.longitude ?? created.longitude })
      } else {
        tasks.value.push(created)
      }
    } catch (err) {
      error.value = 'Erro ao adicionar tarefa.'
      console.error(err)
    }
  }

  async function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) return;
    error.value = null;
    try {
      const response = await tasksApi.update(id, { done: !task.done });
      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1) tasks.value[index] = response.data;
    } catch (err) {
      error.value = 'Erro ao atualizar tarefa.';
      console.error(err);
    }
  }

  async function removeTask(id) {
    error.value = null;
    try {
      await tasksApi.remove(id);
      tasks.value = tasks.value.filter((t) => t.id !== id);
    } catch (err) {
      error.value = 'Erro ao remover tarefa.';
      console.error(err);
    }
  }

  async function updateTask(id, { title, imgAttachmentKey, latitude, longitude } = {}) {
    error.value = null;

    const payload = {};

    if (title !== undefined) {
      const trimmedTitle = title.trim();
      if (trimmedTitle) payload.title = trimmedTitle;
    }

    if (imgAttachmentKey != null) {
      payload.img_attachment_key = imgAttachmentKey;
    }

    if (latitude != null) {
      payload.latitude = latitude
    }

    if (longitude != null) {
      payload.longitude = longitude
    }

    if (Object.keys(payload).length === 0) return;

    try {
      const response = await tasksApi.update(id, payload);
      const responseData = response.data
      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        const updated = responseData
        // fallback: preserve lat/lon from payload if backend didn't return them
        const merged = {
          ...updated,
          latitude: updated.latitude ?? payload.latitude ?? tasks.value[index].latitude,
          longitude: updated.longitude ?? payload.longitude ?? tasks.value[index].longitude,
        }
        tasks.value[index] = merged
      }
    } catch (err) {
      error.value = 'Erro ao editar tarefa.';
      console.error(err);
    }
  }

  return {
    tasks,
    loading,
    error,
    pendingTasks,
    completedTasks,
    fetchTasks,
    addTask,
    toggleTask,
    removeTask,
    updateTask,
  };
});