import axios from 'axios'

const state = {
    locations: null,
    isLocationCreated: null,
    isLocationDeleted: null,
    isLocationUpdated: null,
}

const getters = {
    getLocations: state => state.locations,
    getLocationCreated: state => state.isLocationCreated,
    getLocationDeleted: state => state.isLocationDeleted,
    getLocationUpdated: state => state.isLocationUpdated,
}

const actions = {

    // FETCH LOCATIONS
    fetchLocations({commit}) {
        commit('setLocations', null)
        axios.get(baseURL+'locations').then(result => {
          if(result.data.status == 'success') {
            commit('setLocations', result.data.data)
          }
        })
      },

    // CREATE LOCATION
    createLocation({commit}, payload) {
        commit('setLocationCreated', null)
        axios.post(baseURL+'create_location', payload).then(result => {
            if(result.data.status == 'success') {
                commit('setLocationCreated', 'success')
            }
            else {
                commit('setLocationCreated', 'failed')
            }
        }).catch(err => commit('setLocationCreated', err.message))
    },

    // DELETE LOCATION
    deleteLocation({commit}, payload) {
        commit('setLocationDeleted', null)
        axios.delete(baseURL+'delete_location/'+payload.id).then(result => {
            if(result.data.status == 'success') {
                commit('setLocationDeleted', 'success')
            }
            else {
                commit('setLocationDeleted', 'failed')
            }
        }).catch(err => commit('setLocationDeleted', err.message))
    },

    // UPDATE LOCATION
    updateLocation({commit}, payload) {
        commit('setLocationUpdated', null)
        axios.put(baseURL+'update_location/'+payload.id, payload.data).then(result => {
            if(result.data.status == 'success') {
                commit('setLocationUpdated', 'success')
            }
            else {
                commit('setLocationUpdated', 'failed')
            }
        }).catch(err => commit('setLocationDeleted', err.message))
    }
}

const mutations = {
    setLocations: (state, payload) => state.locations = payload,
    setLocationCreated: (state,payload) => state.isLocationCreated = payload,
    setLocationDeleted: (state,payload) => state.isLocationDeleted = payload,
    setLocationUpdated: (state,payload) => state.isLocationUpdated = payload
}

export default {
    state,
    getters,
    actions,
    mutations
}