import Vue from 'vue'
import Vuex from 'vuex'
import Location from './modules/Location'
import Student from './modules/Student'
import Task from './modules/Task'
import Manager from './modules/Manager'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Location,
    Student,
    Task,
    Manager
  }
})
