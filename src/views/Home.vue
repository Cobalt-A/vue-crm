<template>
  <div>
    <div class="page-title">
      <h3>{{'bill' | localize}}</h3>

      <button class="btn waves-effect btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <loader v-if="loading" />

    <div class="row" v-else>

      <home-bill
        :rates="currency.rates"
      />

      <home-currency
        :rates="currency.rates"
        :date="currency.date"
      />

    </div>
  </div>
</template>


<script>
import HomeBill from '@/components/HomeBill'
import HomeCurrency from '@/components/HomeCurrency'

export default {
  name: 'home',
  metaInfo() {
    return {
      title: this.$title('bill')
    }
  },
  data: () => ({
    loading: true,
    currency: null
  }),
  async mounted() {
    this.currency = await this.$store.dispatch('fetchCurrency')
    this.loading = false
  },
  methods: {
    async refresh() {
      this.loading = true
      this.currency = await this.$store.dispatch('fetchCurrency')
      this.loading = false
    }
  },
  components: {
    HomeBill, HomeCurrency
  }
}
</script>
