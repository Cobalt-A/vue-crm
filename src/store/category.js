import firebase from 'firebase/app'

export default {
  actions: {
    async deleteCategory({dispatch}, id) {
      const uid = await dispatch('getUid')
      await firebase.database().ref(`/users/${uid}/categoryes`).child(id).remove()
      console.log(firebase)
    },
    async fetchCategories({commit, dispatch}) {
      try {
        const uid = await dispatch('getUid')
        const categories = (await firebase.database().ref(`/users/${uid}/categoryes`).once('value')).val() || {}
        return Object.keys(categories).map(key => ({...categories[key], id: key}))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async updateCategory({commit, dispatch}, {title, limit, id}) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/categoryes`).child(id).update({title, limit})
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async createCategory({commit, dispatch}, {title, limit}) {
      try {
        const uid = await dispatch('getUid')
        const category = await firebase.database().ref(`/users/${uid}/categoryes`).push({title, limit})
        return {title, limit, id: category.key}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchCategoryById({commit, dispatch}, id) {
      try {
        const uid = await dispatch('getUid')
        const category = (await firebase.database().ref(`/users/${uid}/categoryes`).child(id).once('value')).val() || {}
        return {...category, id}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}