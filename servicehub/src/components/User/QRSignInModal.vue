<script setup>
// QRSignInModal.vue: simulates a QR/device login flow without needing camera permissions.
defineEmits(['close', 'confirm'])
</script>
<template>
    <div class="modal-backdrop">
        <section class="modal-card qr-card">
            <button class="icon-close" @click="$emit('close')">×</button>
            <p class="eyebrow">QR sign in</p>
            <h2>Scan or confirm device login</h2>
            <div class="fake-qr">QR</div>
            <p class="muted">Prototype mode: click confirm to simulate a verified QR login.</p>
            <button class="primary" @click="$emit('confirm')">Confirm QR sign in</button>
        </section>
    </div>
</template>
