import axios from 'axios'
import Swal from 'sweetalert2'

const state = {
    tasks: null,
    isTaskCreated: null,
    isTaskDeleted: null,
    isTaskUpdated: null,
    loader: false
}

const getters = {
    getTasks: state => state.tasks,
    getTaskCreated: state => state.isTaskCreated,
    getTaskDeleted: state => state.isTaskDeleted,
    getTaskUpdated: state => state.isTaskUpdated,
    getLoader: state => state.loader
}

const actions = {

    // FETCH TaskS
    fetchTasks({commit}) {
        commit('setTasks', null)
        axios.get(baseURL+'tasks').then(result => {
          if(result.data.status === 'success') {
            commit('setTasks', result.data.data)
          }
        })
      },

    // CREATE Task
    createTask({commit}, payload) {
        commit('setTaskCreated', null)
        commit('setLoader', true)
        let formData = new FormData();
        formData.append('title', payload.title)
        formData.append('urgency', payload.urgency)
        formData.append('full_name', payload.full_name)
        formData.append('status', payload.status)
        if(payload.description != null)
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
            commit('setLoader', false)
            commit('setTaskCreated', 'success')
          }
          else {
            commit('setLoader', false)
            commit('setTaskCreated', 'failed')
          }
        }).catch(err => {commit('setLoader', false);commit('setTaskCreated', 'failed')})
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
        let changed = payload.changed
        delete payload.changed
        let message_body_done = payload.message_body_done
        delete payload.message_body_done
        let message_body_unclear = payload.message_body_unclear
        delete payload.message_body_unclear
        let message_body_continuous = payload.message_body_continuous
        delete payload.message_body_continuous
        console.log("Changed: " + changed.toString());
        console.log("phone number: " + payload.phone_number);
        commit('setTaskUpdated', null)
        axios.put(baseURL+'update_task/'+id, payload).then(result => {
            if(result.data.status == 'success') {
                commit('setTaskUpdated', 'success')
                if(changed && !payload.deleted && payload.status != "חדש" && payload.phone_number && payload.phone_number!="undefined"){
                    console.log("About to send SMS Post request");
                    payload.message_body_done = message_body_done;
                    payload.message_body_unclear = message_body_unclear;
                    payload.message_body_continuous = message_body_continuous;
                    axios.post(baseURL+"send_sms_to_student", payload).then(result => {
                        if(result.data.status == "success")
                            console.log("Successful SMS request");
                        else
                            console.log("Error sending SMS request");
                    }).catch(err => console.log("Error Sending SMS request", err.message))
                }
            }
            else {
                commit('setTaskUpdated', 'failed')
            }
        }).catch(err => commit('setTaskUpdated', err.message))
    }
}

const mutations = {
    setTasks: (state, payload) => state.tasks = payload,
    setTaskCreated: (state,payload) => state.isTaskCreated = payload,
    setTaskDeleted: (state,payload) => state.isTaskDeleted = payload,
    setTaskUpdated: (state,payload) => state.isTaskUpdated = payload,
    setLoader(state, loader) {
        Vue.set(state, 'loader', loader)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
