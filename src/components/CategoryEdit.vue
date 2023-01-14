<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'edit' | localize}}</h4>
      </div>

      <p class="center" v-if="!this.categories.length">{{'noCategoriesYet' | localize}}</p>

      <form @submit.prevent="submitHandler" v-else>
        <div class="input-field" >
          <select ref="select" v-model="current">
            <option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
            >{{cat.title}}</option>
          </select>
          <label>{{'selectCategory' | localize}}</label>
        </div>

        <div class="input-field">
          <input
              id="name"
              type="text"
              v-model.number="title"
              :class="{invalid: $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">{{'title' | localize}}</label>
          <span
            v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid"
          >{{'inputTitle' | localize}}</span>
        </div>

        <div class="input-field">
          <input
              id="limit"
              type="number"
              v-model="limit"
              :class="{invalid: ($v.limit.$dirty && !$v.limit.minValue) || ($v.limit.$dirty && !$v.limit.required)}"
          >
          <label for="limit">{{'limit' | localize}}</label>
          <span
            v-if="($v.limit.$dirty && !$v.limit.minValue) || ($v.limit.$dirty && !$v.limit.required)"
            class="helper-text invalid"
          >
            {{'minimalValue' | localize}} {{$v.limit.$params.minValue.min}}
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'update' | localize}}
          <i class="material-icons right">send</i>
        </button>

        <button class="btn waves-effect waves-light red lighten-2" v-tooltip="deleteText" @click="deleteCategory" type="button">
          {{'delete' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>


<script>
import {required, minValue} from 'vuelidate/lib/validators'
import localize from '@/filters/localize.filter'

export default {
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    select: null,
    title: '',
    limit: 100,
    current: null
  }),
  computed: {
    deleteText () {
      return localize('deleteText');
    }
  },
  validations: {
    title: {required},
    limit: {minValue: minValue(100), required}
  },
  watch: {
    current(catId) {
      const {title, limit} = this.categories.find(cat => cat.id === catId)
      this.title = title
      this.limit = limit
    }
  },
  created() {
    if (this.categories.length) {
      const {id, title, limit} = this.categories[0]
      this.current = id
      this.title = title
      this.limit = limit
    }
  },
  mounted() {
    /* M - object from materialize framework */
    // eslint-disable-next-line
    this.select = M.FormSelect.init(this.$refs.select)
    // eslint-disable-next-line
    M.updateTextFields()
  },
  methods: {
    async deleteCategory() {
      await this.$store.dispatch('deleteCategory', this.current)
      const index = this.categories.findIndex(cat => cat.id === this.current)

      await this.$store.dispatch('deleteRecord', this.current)

      this.categories.splice(index, 1)
      this.$message(localize('deletedCategory'))
    },
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit
        }
        await this.$store.dispatch('updateCategory', categoryData)
        this.$message(localize('categoryUpdated'))
        this.$emit('updated', categoryData)
      } catch (e) {
        this.$store.commit('setError', e)
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

<style scoped>
button {
  margin-right: 20px;
  margin-bottom: 10px;
}
</style>

