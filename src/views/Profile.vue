<template>
  <div>
    <div class="page-title">
      <h3>{{'profile' | localize}}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
          v-model="name"
          id="description"
          type="text"
          :class="{invalid: $v.name.$dirty && !$v.name.required}"
        >
        <label for="description">{{'name' | localize}}</label>
        <span
          v-if="$v.name.$dirty && !$v.name.required"
          class="helper-text invalid"
        >{{'inputName' | localize}}</span>
      </div>

      <p>
        <label>
          <input
            v-model="language"
            value="ru-RU"
            name="group1" 
            type="radio" 
          />
          <span>Русский</span>
        </label>
        <label>
          <input
            v-model="language"
            value="en-US"
            name="group1"
            type="radio" 
          />
          <span>English</span>
        </label>
      </p>

      <button class="btn waves-effect waves-light" type="submit">
        {{'update' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>


<script>
import {mapGetters, mapActions} from 'vuex'
import {required} from 'vuelidate/lib/validators'

export default {
  name: 'profile',
  metaInfo() {
    return {
      title: this.$title('profile')
    }
  },
  data: () => ({
    name: '',
    language: 'ru-RU'
  }),
  validations: {
    name: {required}
  },
  mounted() {
    if (this.info.locale) this.language = this.info.locale 
    this.name = this.info.name
    setTimeout(() => {
      /* M - object from materialize framework */
      // eslint-disable-next-line
      M.updateTextFields()
    }, 0)
  },
  methods: {
    ...mapActions(['updateInfo']),
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.language
        })
      } catch (e) {}
    }
  },
  computed: {
    ...mapGetters(['info'])
  }
}
</script>
