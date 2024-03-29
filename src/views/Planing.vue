<template>
  <div>
    <div class="page-title">
      <h3>{{'planing' | localize}}</h3>
      <h4>{{info.bill | currency}}</h4>
    </div>

    <loader v-if="loading"/>

    <p class="center" v-else-if="!categories.length">{{'noCategoriesYet' | localize}} <router-link to="/categories">{{'addNewCategory' | localize}}</router-link></p>

    <section v-else>
      <div v-for="cat in categories" :key="cat.id">
        <p>
          <strong>{{cat.title}}</strong>
          {{cat.spend | currency}} {{'of' | localize}} {{cat.limit | currency}}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <div
            :style="{width: cat.progressPercent + '%'}"
            :class="[cat.progressColor]"
            class="determinate"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import {mapGetters} from 'vuex'
import currencyFilter from '@/filters/currency.filter'
import localize from '@/filters/localize.filter'

export default {
  name: 'planing',
  metaInfo() {
    return {
      title: this.$title('planing')
    }
  },
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(['info'])
  },
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.categories = categories.map(cat => {
      const spend = records
        .filter(rec => rec.categoryId === cat.id)
        .filter(rec => rec.type === 'outcome')
        .reduce((total, record) => {
          return total += +record.amount
        }, 0)

      const percent = (100 * spend / cat.limit)
      const progressPercent = percent > 100 ? 100 : percent
      const progressColor = percent < 60
        ? 'green'
        : percent < 100
          ? 'yellow'
          : 'red'

      const tooltipValue = cat.limit - spend
      const tooltip = `${tooltipValue < 0 ? localize('excessOn') : localize('left')} ${currencyFilter(Math.abs(tooltipValue))}`

      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        tooltip
      }
    })

    this.loading = false
  }
}
</script>
