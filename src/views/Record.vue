<template>
  <div>
    <div class="page-title">
      <h3>{{'newRecord' | localize}}</h3>
    </div>

    <loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">{{'noCategoriesYet' | localize}} <router-link to="/categories">{{'addNewCategory' | localize}}</router-link></p>

    <form class="form" v-else @submit.prevent="submitHandler">
      <div class="input-field" >
        <select ref="select" v-model="category">
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >{{cat.title}}</option>
        </select>
        <label>{{'selectCategory' | localize}}</label>
      </div>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              value="income"
              v-model="type"
          />
          <span>{{'income' | localize}}</span>
        </label>
      </p>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              value="outcome"
              v-model="type"
          />
          <span>{{'outcome' | localize}}</span>
        </label>
      </p>

      <div class="input-field">
        <input
            id="amount"
            type="number"
            v-model.number="amount"
            :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
        >
        <label for="amount">Сумма</label>
        <span
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          class="helper-text invalid"
        >{{'minimalValue' | localize}} {{$v.amount.$params.minValue.min}}</span>
      </div>

      <div class="input-field">
        <input
            id="description"
            type="text"
            v-model="description"
            :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">{{'description' | localize}}</label>
        <span
          v-if="$v.description.$dirty && !$v.description.required"
          class="helper-text invalid"
        >{{'inputDescription' | localize}}</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'create' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>


<script>
import {required, minValue} from 'vuelidate/lib/validators'
import {mapGetters} from 'vuex'
import localize from '@/filters/localize.filter'

export default {
  name: 'record',
  metaInfo() {
    return {
      title: this.$title('records')
    }
  },
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    category: null,
    type: 'outcome',
    amount: 1,
    description: ''
  }),
  validations: {
    amount: {minValue: minValue(10)},
    description: {required}
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false

    if (this.categories.length) {
      this.category = this.categories[0].id
    }

    setTimeout(() => {
      /* M - object from materialize framework */
      // eslint-disable-next-line
      this.select = M.FormSelect.init(this.$refs.select)
      // eslint-disable-next-line
      M.updateTextFields()
    }, 0)
  },
  computed: {
    ...mapGetters(['info']),
    mayCreateRecord() {
      if (this.type === 'income') {
        return true
      }
      return this.info.bill >= this.amount
    }
  },
  methods: { 
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.mayCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          })

          const bill = this.type === 'income' 
            ? this.info.bill + this.amount
            : this.info.bill - this.amount
          
          await this.$store.dispatch('updateInfo', {bill})
          this.$v.$reset()
          this.amount = 1
          this.description = ''
          this.$message(localize('recordCreated'))
        } catch (e) {
          this.$store.commit('setError', e)
        }
      } else {
        this.$message(`${localize('insufficientFundsInTheAccount')} (${this.amount - this.info.bill})`)
      }
    }
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  }
}
</script>
