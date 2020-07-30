import axios from 'axios'
import router from "../../router"
import Swal from 'sweetalert2'

const state = {
    manager: null
}

const getters = {
    getManager: state => state.manager
}

const actions = {
    // UPDATE manager password
    updateManagerPassword({commit}, payload) {
        let id = payload._id
        delete payload._id
        axios.put(baseURL+'update_manager_password/'+id, payload).then(result => {
            if(result.data.status === 'success') {
                commit('setManager', result.data.data)
                Swal.fire('בוצע', 'הסיסמה נשמרה בהצלחה!', 'success')
            }
        }).catch(err => console.log('error occurred while updating password', err.message))
    },

    // Get manager upon password match
    getManagerEntity({commit}, payload) {
        commit('setManager', null)
        axios.post(baseURL+'get_manager_after_password_match', {'password' : payload}).then(result => {
            if(result.data.status === 'success') {
                commit('setManager', result.data.data)
                router.push({path: '/tasks'})
            } else {
                commit('setManager', 'error')
                Swal.fire('שגיאה', 'סיסמה שגויה!', 'error')
            }
        }).catch(err => console.log('error occurred while updating password', err.message))
    },
    // add manager email & phone Num
    addManagerEmailAndPhoneNum({commit}, payload) {
        let id = payload._id
        delete payload._id
        axios.put(baseURL+'add_manager_email_and_number/'+id, payload).then(result => {
            if(result.data.status === 'success') {
                commit('setManager', result.data.data)
                if (payload.email) {
                    Swal.fire('בוצע', 'כתובת מייל נשמרה בהצלחה!', 'success')
                } else {
                    Swal.fire('בוצע', 'מספר טלפון נשמר בהצלחה!', 'success')
                }
            } else {
                Swal.fire('שגיאה', 'אירעה שגיאה בתהליך השמירה', 'error')
            }
        }).catch(err => console.log('error occurred while adding email or number', err.message))
    }
}

const mutations = {
    setManager: (state,payload) => {
        state.manager = payload
        localStorage.setItem('taskManager', JSON.stringify(payload))
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}