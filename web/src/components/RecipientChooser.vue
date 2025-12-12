<script setup lang="ts">
const recipient = defineModel<string>({ required: true })
</script>

<template>
  <section class="panel">
    <p class="eyebrow">Recipient</p>
    <h3>Who should receive this?</h3>
    <p class="muted">This will back a WhatsApp deeplink (wa.me).</p>
    <input v-model="recipient" type="tel" name="recipient" placeholder="e.g. +14155552671" />
  </section>
</template>

<style scoped>
input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.6);
  color: var(--text);
}

input:focus {
  outline: 2px solid var(--accent);
  border-color: var(--accent);
}

.muted {
  color: var(--muted);
}
</style>
