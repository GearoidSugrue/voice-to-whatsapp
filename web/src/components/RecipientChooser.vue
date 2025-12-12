<script setup lang="ts">
const recipient = defineModel<string>({ required: true })
</script>

<template>
  <section class="panel">
    <p class="eyebrow">Recipient</p>
    <h3>Who should receive this?</h3>
    <p class="muted">This will back a WhatsApp deeplink (wa.me).</p>
    <input
      class="input"
      v-model="recipient"
      type="tel"
      name="recipient"
      placeholder="e.g. +14155552671"
    />
  </section>
</template>

<style scoped>
.muted {
  color: var(--muted);
}
</style>
