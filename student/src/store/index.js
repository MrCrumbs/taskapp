import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locations: null,
    students: null,
    isTaskCreated: null
  },
  
  getters: {
    getLocations: state => state.locations,
    getStudents: state => state.students,
    getTaskCreated: state => state.isTaskCreated
  },
  actions: {
    fetchLocations({commit}) {
      commit('setLocations', null)
      axios.get(baseURL+'locations').then(result => {
        if(result.data.status == 'success') {
          commit('setLocations', result.data.data)
        }
      })
    },
    fetchStudents({commit}) {
      commit('setStudents', null)
      axios.get(baseURL+'students').then(result => {
        if(result.data.status == 'success') {
          commit('setStudents', result.data.data)
        }
      })
    },

    createTask({commit}, payload) {
      commit('setTaskCreated', null)
      let formData = new FormData();
      formData.append('title', payload.title)
      formData.append('urgency', payload.urgency)
      formData.append('full_name', payload.full_name)
      formData.append('status', payload.status)
      formData.append('description', payload.description)
      formData.append('location', payload.location)
      formData.append('phone_number', payload.phone_number)
      formData.append('created_on', payload.created_on)
      formData.append('modified_on', payload.modified_on)
      if(payload.image != null) {
        formData.append('image', payload.image)
      }
      axios.post(baseURL+'create_task', formData).then(result => {
        if(result.data.status == 'success') {
          commit('setTaskCreated', 'success')
        }
        else {
          commit('setTaskCreated', 'failed')
        }
      }).catch(err => commit('setTaskCreated', 'failed'))
    }
  },
  mutations: {
    setLocations: (state, payload) => state.locations = payload,
    setStudents: (state, payload) => state.students = payload,
    setTaskCreated: (state, payload) => state.isTaskCreated = payload
  },
})
