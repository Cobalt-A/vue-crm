<template>
  <div>
    <div class="page-title">
      <h3>{{'historyOfRecords' | localize}}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <loader v-if="loading" />

    <p class="center" v-else-if="!records.length">{{'noRecordsYet' | localize}}</p>

    <section v-else>

      <history-table :records="items" />

      <paginate
        v-model="page"
        :click-handler="pageChangeHandler"
        :page-count="pageCount"
        :prev-text="this.prev"
        :next-text="this.next"
        :container-class="'pagination'"
        :page-class="'waves-effect teal'"
      />

    </section>
  </div>
</template>


<script>
import paginationMixin from '@/mixins/pagination.mixin'
import HistoryTable from '@/components/HistoryTable'
import {Pie} from 'vue-chartjs'
import localize from '@/filters/localize.filter'

export default {
  name: 'history',
  metaInfo() {
    return {
      title: this.$title('history')
    }
  },
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: [],
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.setup(categories)

    this.loading = false
  },
  computed: {
    next() {
      return localize('next')
    },
    prev() {
      return localize('prev')
    }
  },
  methods: {
    setup(categories) {
      this.setupPagination(this.records.map(record => {
        return {
          ...record,
          categoryName: categories.find(cat => cat.id === record.categoryId) ? categories.find(cat => cat.id === record.categoryId).title : '',
          typeClass: record.type === 'income' ? 'green' : 'red',
          typeText: record.type === 'income' ? localize('income') : localize('outcome'),
        }
      }))



      this.renderChart({
        labels: categories.map(c => c.title),
        datasets: [{
            label: localize('costsForCategories'),
            data: categories.map(c => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === 'outcome') {
                  total += +r.amount
                }
                return total
              }, 0)
            }),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
      })
    }
  },
  components: {
    HistoryTable
  }
}
</script>
