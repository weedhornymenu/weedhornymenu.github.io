<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import logo from '../assets/logo.png'

const props = defineProps({
  label: { type: Object, required: true }
})

const TYPE_META = {
  sativa: { pill: 'SATIVA', cls: 'sativa' },
  indica: { pill: 'INDICA', cls: 'indica' },
  sativaD: { pill: 'SATIVA DOMINANT', cls: 'sativaD' },
  indicaD: { pill: 'INDICA DOMINANT', cls: 'indicaD' },
  hybrid: { pill: 'HYBRID', cls: 'hybrid' }
}

const sizeClass = computed(() => {
  const chosen = props.label.fontSize
  if (chosen && chosen !== 'auto') return chosen
  const len = (props.label.name || '').trim().length
  if (len <= 12) return 'big'
  if (len <= 22) return 'medium'
  return 'small'
})

const typeMeta = computed(() => TYPE_META[props.label.type] || TYPE_META.hybrid)

const effects = computed(() =>
  Array.isArray(props.label.effects)
    ? props.label.effects.map((e) => String(e).trim()).filter(Boolean)
    : []
)

function fmt(v) {
  const n = Number(v)
  return Number.isFinite(n) && v !== '' && v !== null ? n.toLocaleString('en-US') : '0'
}

const BASE_SIZE = { big: 58, medium: 36, small: 26 }
const nameEl = ref(null)

function fitName() {
  const el = nameEl.value
  if (!el) return
  const base = BASE_SIZE[sizeClass.value]
  el.style.fontSize = base + 'px'
  if (el.scrollWidth > el.clientWidth) {
    el.style.fontSize = Math.floor((base * el.clientWidth) / el.scrollWidth) + 'px'
  }
}

onMounted(fitName)
watch([() => props.label.name, sizeClass], () => nextTick(fitName))
</script>

<template>
  <div class="label">
    <header class="label-header">
      <img class="logo" :src="logo" alt="" />
      <div class="company">
        <div class="company-name">HAPPY THAI HERB</div>
        <div class="tagline">
          <i class="tline" /><span>CANNABIS</span><i class="tline" /><span>CLINIC</span><i class="tline" /><span>AND</span><i class="tline" /><span>DISPENSARY</span><i class="tline" />
        </div>
      </div>
    </header>

    <div class="rule" />

    <div class="name-zone">
      <h1 ref="nameEl" class="product-name" :class="sizeClass">{{ label.name }}</h1>
    </div>

    <div class="rule" />

    <div class="meta-zone">
      <div class="thc-block">
        <div class="tag">THC</div>
        <div class="thc-value">{{ label.thc || 0 }}%</div>
      </div>
      <i class="vline" />
      <div class="type-block">
        <div class="tag">TYPE</div>
        <div class="pill" :class="typeMeta.cls">{{ typeMeta.pill }}</div>
      </div>
    </div>

    <div class="rule" />

    <div class="effects-zone">
      <div class="tag">EFFECTS</div>
      <div class="effects-list">
        <template v-for="(effect, i) in effects" :key="i">
          <span v-if="i" class="bullet">•</span>
          <span class="effect">{{ effect }}</span>
        </template>
      </div>
    </div>

    <div class="price-box">
      <div class="price-head">PRICE</div>
      <div class="price-body">
        <div class="price-col">
          <div class="price-row"><span class="qty">1 G</span><span class="dash">-</span><span class="amt">{{ fmt(label.prices.g1) }} ฿</span></div>
          <div class="price-row"><span class="qty">10 G</span><span class="dash">-</span><span class="amt">{{ fmt(label.prices.g10) }} ฿</span></div>
          <div class="price-row"><span class="qty">30 G</span><span class="dash">-</span><span class="amt">{{ fmt(label.prices.g30) }} ฿</span></div>
        </div>
        <i class="vline" />
        <div class="price-col">
          <div class="price-row"><span class="qty">50 G</span><span class="dash">-</span><span class="amt">{{ fmt(label.prices.g50) }} ฿</span></div>
          <div class="price-row"><span class="qty">100 G</span><span class="dash">-</span><span class="amt">{{ fmt(label.prices.g100) }} ฿</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.label {
  width: 610px;
  height: 610px;
  box-sizing: border-box;
  background: #ffffff;
  padding: 26px 28px 28px;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', 'Noto Sans Thai', sans-serif;
  color: #005116;
}

.label-header {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 90px;
  flex: none;
  padding: 0px 20px;
}
.logo {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  flex: none;
  display: block;
}
.company { flex: 1; min-width: 0; }
.company-name {
  font-family: 'Montserrat', sans-serif;
  font-weight: 900;
  font-size: 40px;
  line-height: 1.15;
  letter-spacing: 2px;
  color: #005116;
  white-space: nowrap;
}
.tagline {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 1.1px;
  color: #005116;
}
.tline { flex: 1; height: 1px; background: #68a879; }

.rule { height: 2px; background: #68a879; flex: none; }

.name-zone {
  height: 92px;
  display: flex;
  align-items: center;
  flex: none;
  padding: 0px 20px;
}
.product-name {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #005116;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
}
.product-name.big { font-size: 58px; }
.product-name.medium { font-size: 36px; }
.product-name.small { font-size: 26px; }

.meta-zone {
  height: 97px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex: none;
  padding: 10px 20px;
}
.tag {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #005116;
}
.thc-block { width: 170px; flex: none; }
.thc-value {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 46px;
  line-height: 1;
  margin-top: 8px;
  color: #005116;
}
.vline { width: 2px; background: #68a879; flex: none; }
.type-block {
  flex: 1;
  min-width: 0;
  padding-left: 40px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
}
.pill {
  margin-top: 9px;
  height: 38px;
  border-radius: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.8px;
  color: #ffffff;
}
.pill.sativa { background: #d84747; }
.pill.indica { background: #475fd8; }
.pill.sativaD { background: #d84747; }
.pill.indicaD { background: #475fd8; }
.pill.hybrid { background: #44b948; }

.effects-zone { flex: none; padding: 16px 20px 0px 20px; }
.effects-zone .tag { margin-bottom: 12px; }
.effects-list {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  font-weight: 600;
  font-size: 26px;
  color: #005116;
}
.bullet { margin: 0 12px; }

.price-box {
  margin-top: auto;
  border: 1.5px solid #7bb389;
  border-radius: 10px;
  overflow: hidden;
  height: 175px;
  flex: none;
  display: flex;
  flex-direction: column;
}
.price-head {
  background: #2e5e3a;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0.5px;
  padding: 8px 20px;
  flex: none;
}
.price-body {
  flex: 1;
  display: flex;
  padding: 15px 0 12px;
}
.price-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 2px 18px;
}
.price-body > .vline { align-self: stretch; margin: 2px 0; }
.price-row {
  display: grid;
  grid-template-columns: 1fr auto 1.15fr;
  align-items: center;
  height: 20px;
  font-weight: 700;
  font-size: 25px;
  color: #005116;
}
.qty { text-align: left; }
.dash { text-align: center; }
.amt { text-align: right; white-space: nowrap; }
</style>
