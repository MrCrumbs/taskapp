import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locations: null,
    students: null,
    isTaskCreated: null,
    loader: false
  },
  
  getters: {
    getLocations: state => state.locations,
    getStudents: state => state.students,
    getTaskCreated: state => state.isTaskCreated,
    getLoader: state => state.loader
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
      commit('setTaskCreated', null);
      console.log("Setting loader true");
      commit('setLoader', true);
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
      formData.append('task_type', payload.task_type)
      if(payload.image != null) {
        formData.append('image', payload.image)
      }
      axios.post(baseURL+'create_task', formData).then(result => {
        if(result.data.status == 'success') {
            commit('setLoader', false);
          commit('setTaskCreated', 'success');
        }
        else {
          commit('setLoader', false);
          commit('setTaskCreated', 'failed');
        }
      }).catch(err => {commit('setLoader', false);commit('setTaskCreated', 'failed')})
    }
  },
  mutations: {
    setLocations: (state, payload) => state.locations = payload,
    setStudents: (state, payload) => state.students = payload,
    setTaskCreated: (state, payload) => state.isTaskCreated = payload,
    setLoader(state, loader) {
        Vue.set(state, 'loader', loader)
    }
  },
})
