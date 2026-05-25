<script setup>
import { reactive } from 'vue'

// Customer request form. The payload is sent to App.vue then the API adapter.
const props = defineProps({ service: Object, currentUser: Object })
defineEmits(['submit-request', 'back'])
const form = reactive({ location: '', preferredDate: '', budget: '', details: '' })
</script>

<template>
  <section class="page-section request-page">
    <button class="back-pill" @click="$emit('back')">Back to services</button>
    <div class="request-header clean-card">
      <div>
        <p class="eyebrow">Create request</p>
        <h2>{{ service?.title }}</h2>
        <p>After submission, the request goes to the admin dashboard. Admin must approve and assign it to the correct
          provider.</p>
      </div>
      <aside><span>Request owner</span><strong>{{ currentUser?.name }}</strong><small>{{ currentUser?.email }}</small>
      </aside>
    </div>
    <form class="request-form clean-card"
      @submit.prevent="$emit('submit-request', { ...form, serviceId: service.id, serviceTitle: service.title, customerId: currentUser.id, customerName: currentUser.name })">
      <section class="form-section">
        <div class="step-number">1</div>
        <div>
          <h3>Task location</h3>
          <p>Where does the provider need to go?</p>
        </div>
        <div class="form-grid"><label class="full">Location <input v-model="form.location"
              required /></label><label>Preferred date <input v-model="form.preferredDate" type="date"
              required /></label><label>Budget <input v-model="form.budget" placeholder="$" /></label></div>
      </section>
      <section class="form-section">
        <div class="step-number">2</div>
        <div>
          <h3>Task details</h3>
          <p>Give enough detail for admin/provider review.</p>
        </div>
        <div class="form-grid"><label class="full">Details <textarea v-model="form.details" required></textarea></label>
        </div>
      </section>
      <div class="form-actions"><button class="secondary" type="button" @click="$emit('back')">Cancel</button><button
          class="primary" type="submit">Submit to admin</button></div>
    </form>
  </section>
</template>
