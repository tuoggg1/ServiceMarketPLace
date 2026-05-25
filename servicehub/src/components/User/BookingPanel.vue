<script setup>
// BookingPanel.vue: optional compact booking panel. The main app uses RequestForm.vue for the full workflow.
import { reactive } from 'vue'
const props = defineProps({ service: { type: Object, required: true } })
const emit = defineEmits(['close', 'submit-booking'])
const form = reactive({ name: '', phone: '', area: props.service.area, address: '', date: '', time: '', payment: 'Cash', notes: '' })
function submit() { emit('submit-booking', { ...form }) }
</script>
<template>
  <div class="modal-backdrop">
    <form class="modal-card" @submit.prevent="submit"><button type="button" class="icon-close"
        @click="$emit('close')">×</button>
      <p class="eyebrow">Book service</p>
      <h2>{{ service.title }}</h2><label>Name<input v-model="form.name"></label><label>Phone<input
          v-model="form.phone"></label><label>Area<input v-model="form.area"></label><label>Address<textarea
          v-model="form.address"></textarea></label><label>Date<input v-model="form.date"
          type="date"></label><label>Time<input v-model="form.time" type="time"></label><label>Notes<textarea
          v-model="form.notes"></textarea></label><button class="primary">Submit booking</button>
    </form>
  </div>
</template>
