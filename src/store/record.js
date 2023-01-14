import firebase from 'firebase/app'

export default {
  actions: {
    async createRecord({dispatch, commit}, record) {
      try {
        const uid = await dispatch('getUid')
        return await firebase.database().ref(`/users/${uid}/records`).push(record)
      } catch (e) {
        commit ('setError', e)
        throw e
      }
    },
    async fetchRecords({dispatch, commit}) {
      try {
        const uid = await dispatch('getUid')
        const records = (await firebase.database().ref(`/users/${uid}/records`).once('value')).val() || {}
        return Object.keys(records).map(key => ({...records[key], id: key}))
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async fetchRecordById({dispatch, commit}, id) {
      try {
        const uid = await dispatch('getUid')
        const record = (await firebase.database().ref(`/users/${uid}/records`).child(id).once('value')).val() || {}
        return {...record, id}
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async deleteRecord({dispatch}, catId) {
      try {
        const uid = await dispatch('getUid')
        const records = await dispatch('fetchRecords')
        for (let i = 0; i < records.length; i++) {
          if (records[i].categoryId === catId) {
            await firebase.database().ref(`/users/${uid}/records`).child(records[i].id).remove()
          }
        }
        console.log('ale')
      } catch (e) {
        commit('setError', e)
        throw e
      }
    } 
  }
}