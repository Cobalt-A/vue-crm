<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">{{'homeAccounting' | localize}}</span>
      <div class="input-field">
        <input
            id="email"
            type="text"
            class="validate"
            v-model.trim="email"
            :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
        >
        <label for="email">Email</label>
        <small
          v-if="($v.email.$dirty && !$v.email.required)"
          class="helper-text invalid"
        >{{'inputYourEmail' | localize}}</small>
        <small
          v-else-if="($v.email.$dirty && !$v.email.email)"
          class="helper-text invalid"
        >{{'emailEnteredIncorrectly' | localize}}</small>
      </div>
      <div class="input-field">
        <input
            id="password"
            type="password"
            class="validate"
            v-model.trim="password"
            :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
        >
        <label for="password">{{'password' | localize}}</label>
        <small
          class="helper-text invalid"
          v-if="($v.password.$dirty && !$v.password.required)"
        >{{'inputPassword' | localize}}</small>
        <small
          class="helper-text invalid"
          v-else-if="($v.password.$dirty && !$v.password.minLength)"
        >{{'passwordTooSimple' | localize}}</small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
        >
          {{'signIn' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{'noAccount' | localize}}
        <router-link to="/register">{{'signUp' | localize}}</router-link>
      </p>
    </div>
  </form>
</template>


<script>
import {email, required, minLength} from 'vuelidate/lib/validators'
import messages from '@/utils/messages'

export default {
  name: 'login',
  metaInfo() {
    return {
      title: this.$title('login')
    }
  },
  data: () => ({
    email: '',
    password: ''
  }),
  validations: {
    email: {email, required},
    password: {required, minLength: minLength(6)}
  },
  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message])
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      
      const formData = {
        email: this.email,
        password: this.password
      }

      try {
        await this.$store.dispatch('login', formData)
        this.$router.push('/')
      } catch (e) {
        this.$store.commit('setError', e)
      } 

    }
  }
}
</script>
