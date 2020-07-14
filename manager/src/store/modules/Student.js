import axios from 'axios'

const state = {
    students: null,
    isStudentCreated: null,
    isStudentDeleted: null,
    isStudentUpdated: null,
    isBulkUploaded: null
}

const getters = {
    getStudents: state => state.students,
    getStudentCreated: state => state.isStudentCreated,
    getStudentDeleted: state => state.isStudentDeleted,
    getStudentUpdated: state => state.isStudentUpdated,
    getBulkUploaded: state => state.isBulkUploaded
}

const actions = {

    // FETCH StudentS
    fetchStudents({commit}) {
        commit('setStudents', null)
        axios.get(baseURL+'students').then(result => {
          if(result.data.status == 'success') {
            commit('setStudents', result.data.data)
          }
        })
      },

    // CREATE Student
    createStudent({commit}, payload) {
        commit('setStudentCreated', null)
        axios.post(baseURL+'create_student', payload).then(result => {
            if(result.data.status == 'success') {
                commit('setStudentCreated', 'success')
            }
            else {
                commit('setStudentCreated', 'failed')
            }
        }).catch(err => commit('setStudentCreated', err.message))
    },

    // DELETE Student
    deleteStudent({commit}, payload) {
        commit('setStudentDeleted', null)
        axios.delete(baseURL+'delete_student/'+payload.id).then(result => {
            if(result.data.status == 'success') {
                commit('setStudentDeleted', 'success')
            }
            else {
                commit('setStudentDeleted', 'failed')
            }
        }).catch(err => commit('setStudentDeleted', err.message))
    },

    // UPDATE Student
    updateStudent({commit}, payload) {
        console.log(payload)
        let id = payload._id
        delete payload._id
        commit('setStudentUpdated', null)
        axios.put(baseURL+'update_student/'+id, payload).then(result => {
            if(result.data.status == 'success') {
                commit('setStudentUpdated', 'success')
            }
            else {
                commit('setStudentUpdated', 'failed')
            }
        }).catch(err => commit('setStudentDeleted', err.message))
    },

    bulkUpload({commit}, payload) {
        commit('setBulkUploaded', null)
        let formData = new FormData()
        formData.append('file', payload.file)
        formData.append('students', JSON.stringify(payload.students))
        
        axios.post(baseURL+'import', formData).then(result => {
            if(result.data.status == 'success') {
                commit('setBulkUploaded', 'success')
            }
            else {
                commit('setBulkUploaded', 'failed')
            }
        }).catch(() => commit('setBulkUploaded', 'failed'))
    }
}

const mutations = {
    setStudents: (state, payload) => state.students = payload,
    setStudentCreated: (state,payload) => state.isStudentCreated = payload,
    setStudentDeleted: (state,payload) => state.isStudentDeleted = payload,
    setStudentUpdated: (state,payload) => state.isStudentUpdated = payload,
    setBulkUploaded: (state, payload) => state.isBulkUploaded = payload
}

export default {
    state,
    getters,
    actions,
    mutations
}