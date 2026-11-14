<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  heading: {
    type: String,
    required: true,
  },
  navigationLabel: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <aside class="app-sidebar">
    <p class="sidebar-heading">{{ props.heading }}</p>
    <nav :aria-label="props.navigationLabel">
      <RouterLink
        v-for="item in props.items"
        :key="item.path"
        :to="item.path"
        class="sidebar-link"
        active-class="sidebar-link--active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
