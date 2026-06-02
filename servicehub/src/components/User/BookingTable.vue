<script setup>
defineProps({ bookings: { type: Array, default: () => [] }, admin: { type: Boolean, default: false } })
defineEmits(['change-status'])
</script>
<template>
  <div class="responsive-table">
    <table>
      <thead>
        <tr>
          <th>Service</th>
          <th>Area</th>
          <th>Date</th>
          <th>Payment</th>
          <th>Total</th>
          <th>Status</th>
          <th v-if="admin">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.id">
          <td>{{ booking.serviceTitle }}</td>
          <td>{{ booking.area }}</td>
          <td>{{ booking.date }} {{ booking.time }}</td>
          <td>{{ booking.payment }}</td>
          <td>৳{{ booking.total }}</td>
          <td><span :class="['status-pill', booking.status.toLowerCase().replace(' ', '-')]">{{ booking.status }}</span>
          </td>
          <td v-if="admin"><select :value="booking.status"
              @change="$emit('change-status', { id: booking.id, status: $event.target.value })">
              <option>Pending</option>
              <option>Accepted</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
