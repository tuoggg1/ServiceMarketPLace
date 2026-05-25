<script setup>
import { reactive, computed } from 'vue'
import { formatBDT } from '../../data/services'

const props = defineProps({
  service: Object,
  customer: Object
})

defineEmits(['submit-request', 'back'])

const form = reactive({
  location: props.customer?.location || 'Rajshahi',
  preferredDate: '',
  budget: props.service?.price || '',
  details: ''
})

const priceLabel = computed(() => formatBDT(props.service?.price))
</script>

<template>
  <section class="page-section request-page">
    <button class="back-pill" @click="$emit('back')">Back to services</button>

    <div class="request-header clean-card">
      <div>
        <p class="eyebrow">Create request</p>
        <h2>{{ service?.title }}</h2>
        <p>
          Base price starts from {{ priceLabel }}. Add your Rajshahi area,
          budget and details so admin can assign the right provider.
        </p>
      </div>

      <aside>
        <span>Request owner</span>
        <strong>{{ customer?.name }}</strong>
        <small>{{ customer?.email }}</small>
      </aside>
    </div>

    <form
      class="request-form clean-card"
      @submit.prevent="$emit('submit-request', {
        ...form,
        serviceId: service.id,
        serviceTitle: service.title,
        customerId: customer.id,
        customerName: customer.name
      })"
    >
      <section class="form-section">
        <div class="step-number">1</div>
        <div>
          <h3>Task location</h3>
          <p>Where in Rajshahi does the provider need to go?</p>
        </div>

        <div class="form-grid">
          <label class="full">
            Area / address
            <input v-model="form.location" required placeholder="Boalia, Motihar, Laxmipur..." />
          </label>

          <label>
            Preferred date
            <input v-model="form.preferredDate" type="date" required />
          </label>

          <label>
            Budget
            <input v-model="form.budget" type="number" min="0" placeholder="৳" />
          </label>
        </div>
      </section>

      <section class="form-section">
        <div class="step-number">2</div>
        <div>
          <h3>Task details</h3>
          <p>Describe the work clearly for admin and provider review.</p>
        </div>

        <div class="form-grid">
          <label class="full">
            Details
            <textarea v-model="form.details" required></textarea>
          </label>
        </div>
      </section>

      <div class="form-actions">
        <button class="secondary" type="button" @click="$emit('back')">Cancel</button>
        <button class="primary" type="submit">Submit to admin</button>
      </div>
    </form>
  </section>
</template>
