<template>
  <div>
    <loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{'history' | localize}}</router-link>
        <a @click.prevent class="breadcrumb">
          {{record.type === 'income' ? 'Доход' : 'Расход'}}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div
            :class="{
              red: record.type === 'outcome',
              green: record.type === 'income'
            }"
            class="card lighten-5"
          >
            <div class="card-content">
              <p>{{'description' | localize}}: {{record.description}}</p>
              <p>{{'amount' | localize}}: {{record.amount | currency}}</p>
              <p>{{'category' | localize}}: {{record.caregoryName}}</p>

              <small>{{record.date | date('datetime')}}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center" v-else>Такой записи нет</p>
  </div>
</template>


<script>
export default {
  name: 'record-detail',
  data: () => ({
    record: null,
    loading: true
  }),
  async mounted() {
    const id = this.$route.params.id
    const record = await this.$store.dispatch('fetchRecordById', id)
    const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)

    this.record = {
      ...record,
      categoryName: category.title
    }

    this.loading = false
  }
}
</script>
