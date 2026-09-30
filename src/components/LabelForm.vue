<script setup>
defineProps({
  form: { type: Object, required: true }
})

defineEmits(['submit'])
</script>

<template>
  <form class="form" @submit.prevent="$emit('submit')">
    <h2>New label</h2>

    <div class="field">
      <label for="f-name">Product name</label>
      <input id="f-name" v-model.trim="form.name" type="text" required maxlength="40" placeholder="e.g. ANDROMEDA" />
    </div>

    <div class="row-2">
      <div class="field">
        <label for="f-thc">THC (%)</label>
        <input id="f-thc" v-model="form.thc" type="number" required min="0" max="100" step="0.1" placeholder="25" />
      </div>
      <div class="field">
        <label for="f-type">Type</label>
        <select id="f-type" v-model="form.type">
          <option value="sativa">Sativa Dominant</option>
          <option value="indica">Indica Dominant</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>
    </div>

    <div class="field">
      <label for="f-size">Name font size</label>
      <select id="f-size" v-model="form.fontSize">
        <option value="auto">Auto (by name length)</option>
        <option value="big">Big</option>
        <option value="medium">Medium</option>
        <option value="small">Small</option>
      </select>
    </div>

    <div class="field">
      <label for="f-effects">Effects (comma separated)</label>
      <input id="f-effects" v-model="form.effects" type="text" placeholder="Energetic, Happy, Creative" />
    </div>

    <fieldset class="prices">
      <legend>Prices (฿)</legend>
      <div class="price-grid">
        <div class="field">
          <label for="p-g1">1 G</label>
          <input id="p-g1" v-model="form.prices.g1" type="number" required min="0" step="1" />
        </div>
        <div class="field">
          <label for="p-g10">10 G</label>
          <input id="p-g10" v-model="form.prices.g10" type="number" required min="0" step="1" />
        </div>
        <div class="field">
          <label for="p-g30">30 G</label>
          <input id="p-g30" v-model="form.prices.g30" type="number" required min="0" step="1" />
        </div>
        <div class="field">
          <label for="p-g50">50 G</label>
          <input id="p-g50" v-model="form.prices.g50" type="number" required min="0" step="1" />
        </div>
        <div class="field">
          <label for="p-g100">100 G</label>
          <input id="p-g100" v-model="form.prices.g100" type="number" required min="0" step="1" />
        </div>
      </div>
    </fieldset>

    <button class="btn primary" type="submit">Add to label list</button>
  </form>
</template>

<style scoped>
.form { display: flex; flex-direction: column; gap: 14px; }
.form h2 {
  margin: 0 0 4px;
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #005116;
}
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-size: 12.5px;
  font-weight: 600;
  color: #40544a;
  letter-spacing: 0.2px;
}
.field input,
.field select {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid #c9d6cd;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #17281e;
  background: #ffffff;
}
.field input:focus,
.field select:focus {
  outline: none;
  border-color: #68a879;
  box-shadow: 0 0 0 3px rgba(104, 168, 121, 0.2);
}
.prices {
  margin: 0;
  padding: 12px 14px 14px;
  border: 1px solid #dbe5de;
  border-radius: 10px;
}
.prices legend {
  padding: 0 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: #40544a;
}
.price-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
}
.btn {
  border: none;
  border-radius: 8px;
  padding: 11px 18px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn.primary { background: #005116; color: #ffffff; }
.btn.primary:hover { background: #00651c; }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }
</style>
