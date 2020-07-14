import axios from 'axios'

const state = {
    tasks: null,
    isTaskCreated: null,
    isTaskDeleted: null,
    isTaskUpdated: null,
}

const getters = {
    getTasks: state => state.tasks,
    getTaskCreated: state => state.isTaskCreated,
    getTaskDeleted: state => state.isTaskDeleted,
    getTaskUpdated: state => state.isTaskUpdated,
}

const actions = {

    // FETCH TaskS
    fetchTasks({commit}) {
        commit('setTasks', null)
        axios.get(baseURL+'tasks').then(result => {
          if(result.data.status == 'success') {
            commit('setTasks', result.data.data)
          }
        })
      },

    // CREATE Task
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
    },

    // DELETE Task
    deleteTask({commit}, payload) {
        commit('setTaskDeleted', null)
        axios.delete(baseURL+'delete_task/'+payload.id).then(result => {
            if(result.data.status == 'success') {
                commit('setTaskDeleted', 'success')
            }
            else {
                commit('setTaskDeleted', 'failed')
            }
        }).catch(err => commit('setTaskDeleted', err.message))
    },

    // UPDATE Task
    updateTask({commit}, payload) {
        let id = payload.id
        delete payload.id
        commit('setTaskUpdated', null)
        axios.put(baseURL+'update_task/'+id, payload).then(result => {
            if(result.data.status == 'success') {
                commit('setTaskUpdated', 'success')

                // sendStatusUpdateSMS()
            }
            else {
                commit('setTaskUpdated', 'failed')
            }
        }).catch(err => commit('setTaskDeleted', err.message))
    }
}

const mutations = {
    setTasks: (state, payload) => state.tasks = payload,
    setTaskCreated: (state,payload) => state.isTaskCreated = payload,
    setTaskDeleted: (state,payload) => state.isTaskDeleted = payload,
    setTaskUpdated: (state,payload) => state.isTaskUpdated = payload
}

export default {
    state,
    getters,
    actions,
    mutations
}