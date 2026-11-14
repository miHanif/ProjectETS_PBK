<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <aside class="app-sidebar">
    <p class="sidebar-heading">Menu</p>
    <nav aria-label="Navigasi utama">
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
