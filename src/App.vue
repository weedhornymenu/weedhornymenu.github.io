<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import LabelCard from './components/LabelCard.vue'
import LabelForm from './components/LabelForm.vue'
import LabelsTable from './components/LabelsTable.vue'
import { exportLabelsPdf } from './lib/exportPdf.js'

function blankDraft() {
  return {
    name: '',
    fontSize: 'auto',
    thc: '',
    type: 'sativa',
    effects: '',
    pricePreset: '',
    prices: { g1: '', g10: '', g30: '', g50: '', g100: '' }
  }
}

const draft = reactive(blankDraft())
const labels = ref([])
let seq = 0

function toLabel(d) {
  return {
    name: d.name,
    fontSize: d.fontSize,
    thc: d.thc,
    type: d.type,
    effects: String(d.effects || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    prices: { ...d.prices }
  }
}

const draftLabel = computed(() => toLabel(draft))

function onSubmit() {
  labels.value.push({ id: ++seq, ...toLabel(draft) })
  Object.assign(draft, blankDraft())
}

function removeLabel(id) {
  labels.value = labels.value.filter((l) => l.id !== id)
}

const previewWrap = ref(null)
const scale = ref(1)
let observer = null

onMounted(() => {
  observer = new ResizeObserver(() => {
    const w = previewWrap.value ? previewWrap.value.clientWidth : 610
    scale.value = Math.min(1, w / 610)
  })
  observer.observe(previewWrap.value)
})
onBeforeUnmount(() => observer && observer.disconnect())

const stageRefs = new Map()
function setStageRef(id, el) {
  if (el) stageRefs.set(id, el)
  else stageRefs.delete(id)
}

const exporting = ref(false)
async function onExport() {
  if (exporting.value || !labels.value.length) return
  exporting.value = true
  try {
    const nodes = labels.value.map((l) => stageRefs.get(l.id)).filter(Boolean)
    await exportLabelsPdf(nodes)
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1>Product Label Studio</h1>
      <p>Happy Thai Herb Co.,Ltd — Cannabis Clinic and Dispensary</p>
    </header>

    <section class="card studio">
      <div class="studio-form">
        <LabelForm :form="draft" @submit="onSubmit" />
      </div>
      <div class="studio-preview">
        <h2>Preview</h2>
        <div ref="previewWrap" class="preview-wrap" :style="{ height: 610 * scale + 'px' }">
          <div class="preview-scale" :style="{ transform: `scale(${scale})` }">
            <LabelCard :label="draftLabel" />
          </div>
        </div>
      </div>
    </section>

    <section class="card list">
      <div class="list-head">
        <h2>Created labels ({{ labels.length }})</h2>
      </div>
      <LabelsTable :labels="labels" @remove="removeLabel" />
      <div class="list-actions">
        <button class="btn primary" type="button" :disabled="!labels.length || exporting" @click="onExport">
          {{ exporting ? 'Exporting…' : 'Export PDF (A4 · 6 labels per page)' }}
        </button>
      </div>
    </section>

    <div class="export-stage" aria-hidden="true">
      <div v-for="l in labels" :key="l.id" :ref="(el) => setStageRef(l.id, el)">
        <LabelCard :label="l" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 20px 60px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.page-head h1 {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #005116;
}
.page-head p {
  margin: 4px 0 0;
  color: #52685c;
  font-size: 14px;
}
.card {
  background: #ffffff;
  border: 1px solid #e0e8e2;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(23, 40, 30, 0.06);
  padding: 22px;
}
.studio {
  display: grid;
  grid-template-columns: minmax(320px, 400px) 1fr;
  gap: 26px;
  align-items: start;
}
.studio-preview h2,
.list-head h2 {
  margin: 0 0 14px;
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #005116;
}
.preview-wrap {
  position: relative;
  overflow: hidden;
  width: 100%;
}
.preview-scale {
  position: absolute;
  top: 0;
  left: 0;
  width: 610px;
  height: 610px;
  transform-origin: 0 0;
  box-shadow: 0 0 0 1px #e0e8e2;
}
.list-actions {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
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
.export-stage {
  position: fixed;
  left: -10000px;
  top: 0;
  width: 610px;
  pointer-events: none;
}
@media (max-width: 900px) {
  .studio { grid-template-columns: 1fr; }
}
</style>
