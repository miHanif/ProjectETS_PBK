<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  emptyText: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['row-click'])
</script>

<template>
  <div class="data-table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in props.columns" :key="column.key" scope="col">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="props.rows.length">
        <tr
          v-for="(row, rowIndex) in props.rows"
          :key="row.id ?? rowIndex"
          :data-clickable="true"
          @click="emit('row-click', row)"
        >
          <td v-for="column in props.columns" :key="column.key">
            {{ row[column.key] }}
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="Math.max(props.columns.length, 1)">
            {{ props.emptyText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
