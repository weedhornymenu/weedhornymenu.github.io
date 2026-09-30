<script setup>
defineProps({
  labels: { type: Array, required: true }
})

defineEmits(['remove'])

const TYPE_LABEL = {
  sativa: 'Sativa Dominant',
  indica: 'Indica Dominant',
  hybrid: 'Hybrid'
}

function fmt(v) {
  const n = Number(v)
  return Number.isFinite(n) && v !== '' && v !== null ? n.toLocaleString('en-US') : '0'
}
</script>

<template>
  <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th>Type</th>
          <th>THC</th>
          <th>Effects</th>
          <th class="num">1 G</th>
          <th class="num">10 G</th>
          <th class="num">30 G</th>
          <th class="num">50 G</th>
          <th class="num">100 G</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!labels.length">
          <td colspan="11" class="empty">No labels yet — submit the form above to add one.</td>
        </tr>
        <tr v-for="(l, i) in labels" :key="l.id">
          <td>{{ i + 1 }}</td>
          <td class="name">{{ l.name }}</td>
          <td><span class="badge" :class="l.type">{{ TYPE_LABEL[l.type] }}</span></td>
          <td>{{ l.thc }}%</td>
          <td class="effects">{{ l.effects.join(', ') }}</td>
          <td class="num">{{ fmt(l.prices.g1) }}</td>
          <td class="num">{{ fmt(l.prices.g10) }}</td>
          <td class="num">{{ fmt(l.prices.g30) }}</td>
          <td class="num">{{ fmt(l.prices.g50) }}</td>
          <td class="num">{{ fmt(l.prices.g100) }}</td>
          <td class="del">
            <button class="remove" type="button" title="Remove" @click="$emit('remove', l.id)">×</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap { overflow-x: auto; }
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  color: #17281e;
}
.table th {
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #52685c;
  padding: 10px 12px;
  border-bottom: 2px solid #68a879;
  white-space: nowrap;
}
.table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e4ebe6;
  vertical-align: middle;
}
.table .num { text-align: right; font-variant-numeric: tabular-nums; }
.table th.num { text-align: right; }
.table .name { font-weight: 600; white-space: nowrap; }
.table .effects { color: #40544a; }
.empty { text-align: center; color: #7b8c82; padding: 26px 12px; }
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.badge.sativa { background: #d84747; }
.badge.indica { background: #475fd8; }
.badge.hybrid { background: #44b948; }
.remove {
  border: none;
  background: transparent;
  color: #b3403a;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}
.remove:hover { background: #fbeaea; }
.del { text-align: center; }
</style>
