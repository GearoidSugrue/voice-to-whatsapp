<script setup lang="ts">
import { useAuthToken } from '../composables/useAuthToken'

const { authToken } = useAuthToken()

defineExpose({
  authToken,
})
</script>

<template>
  <div>auth: {{ authToken }}</div>
</template>
