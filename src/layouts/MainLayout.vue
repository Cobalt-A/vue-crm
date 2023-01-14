<template>
  <div>
    <loader v-if="loading" />

    <div class="app-main-layout" v-else>

      <nav-bar @ownClick="isOpen = !isOpen" />

      <side-bar v-model="isOpen" :key="locale" />

      <main class="app-content" :class="{full: !isOpen}">
        <div class="app-page">
          <router-view />
        </div>
      </main>

      <div class="fixed-action-btn">
      <router-link class="btn-floating btn-large blue" to="/record">
          <i class="large material-icons">add</i>
      </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/app/NavBar.vue'
import SideBar from '@/components/app/SideBar.vue'
import messages from '@/utils/messages'

export default {
  name: 'main-layouts',
  data: () => ({
    isOpen: true,
    loading: true
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }
    this.loading = false
  },
  computed: {
		error() {
			return this.$store.getters.error
    },
    locale() {
      return this.$store.getters.info.locale
    }
	},
	watch: {
		error(fbError) {
			console.log(fbError)
			this.$error(messages[fbError.code] || 'Что-то пошло не так')
		}
	},
  components: {
    NavBar,
    SideBar
  }
}
</script>