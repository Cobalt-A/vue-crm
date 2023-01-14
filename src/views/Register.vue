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
      <div class="input-field">
        <input
            id="name"
            type="text"
            v-model.trim="name"
            :class="{invalid: ($v.name.$dirty && !$v.name.required)}"
        >
        <label for="name">{{'name' | localize}}</label>
        <small
          v-if="($v.name.$dirty && !$v.name.required)"
          class="helper-text invalid"
        >{{'inputYourName' | localize}}</small>
      </div>
      <p>
        <label>
          <input type="checkbox" v-model="agree" />
          <span>{{'withRulesAgree' | localize}}</span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
        >
          {{'signUp' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{'alreadyHaveAccount' | localize}}
        <router-link to="/login">{{'signIn' | localize}}</router-link>
      </p>
    </div>
  </form>
</template>


<script>
import {email, required, minLength} from 'vuelidate/lib/validators'

export default {
  name: 'register',
  metaInfo() {
    return {
      title: this.$title('register')
    }
  },
  data: () => ({
    email: '',
    password: '',
    name: '',
    agree: false
  }),
  validations: {
    email: {email, required},
    password: {required, minLength: minLength(6)},
    name: {required},
    agree: {checked: v => v}
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      const formData = {
        email: this.email,
        password: this.password,
        name: this.name
      }

      try {
        await this.$store.dispatch('register', formData)
        this.$router.push('/')
      } catch (e) {
        this.$store.commit('setError', e)
      } 

    }
  }
}
</script>
