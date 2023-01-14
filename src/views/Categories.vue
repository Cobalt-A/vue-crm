<template>
  <div>
    <div class="page-title">
      <h3>{{'categories' | localize}}</h3>
    </div>
    <section>

      <loader v-if="loading" />

      <div class="row" v-else>

        <category-create @created="addNewCategory" />

        <category-edit
          :categories="categories"
          :key="categories.length + updateCount"
          @updated="updateCategories"
        />

      </div>
    </section>
  </div>
</template>


<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'

export default {
  name: 'categories',
  metaInfo() {
    return {
      title: this.$title('categories')
    }
  },
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0
  }),
  components: {
    CategoryCreate, CategoryEdit
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category)
    },
    updateCategories(category) {
      const idx = this.categories.findIndex(cat => cat.id === category.id)
      this.categories[idx].title = category.title
      this.categories[idx].limit = category.limit
      this.updateCount++
    }
  }
}
</script>


