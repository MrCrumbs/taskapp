<template>
    <div class="tasks mx-5 mt-3">
      <v-row>
        <v-snackbar
            v-model="added"
            timeout="2500"
            :top="true"
            :color="color"
          >
            {{msg}}

            <template v-slot:action="{ attrs }">
              <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="added = false"
              >
                ביטול
              </v-btn>
            </template>
          </v-snackbar>
        <v-col cols="6">
          <h2 class="">דו"ח תקלות לפי מיקום</h2>
        </v-col>
      </v-row>
        <v-row align="center">
          <v-col class="d-flex" cols="5" sm="5">
            <v-select
                    :items="locations"
                    v-model="selectedLoc"
                    label="בחר מיקום"
                    prepend-icon="mdi-map-marker"
            ></v-select>
          </v-col>

            <v-col class="d-flex" cols="5" sm="5">
              <v-menu
                      ref="menu"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :return-value.sync="dates"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                          v-model="dateRangeText"
                          label="בחר טווח תאריכים"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dates" range no-title>
                  <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.menu.save(dates)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

          <v-col class="d-flex" cols="2" sm="2">
            <v-btn class="float-left" outlined color="teal" @click="searchTasks()"><i class="fa fa-search ml-2"></i>חיפוש</v-btn>
            <v-btn class="float-left mr-1" :loading="loader" :disabled="loader" color="teal" @click="refresh()"><i class="fa fa-refresh ml-2"></i>
              אתחול
              <template v-slot:loader>
              <span class="custom-loader">
                <v-icon :dark="true">mdi-cached</v-icon>
              </span>
              </template>
            </v-btn>

          </v-col>


        </v-row>
      <!-- Overlay -->

      <v-row>
        <v-col cols="12">
          <v-overlay
            :z-index="10"
            :value="overlay"
            color="#fff"
            opacity="1"
          >
            <v-data-table
                :headers="overcolumns"
                :items="filteredTasks"
                class="elevation-1 over-table"
                light
                :footer-props="{
                  'itemsPerPageText':'שורות לעמוד'
                }"
            >

            </v-data-table>

          </v-overlay>
        </v-col>
      </v-row>

      <v-row>
      </v-row>
      <v-row>
        <v-col cols="12">
          <!-- <v-card class="pb-5"> -->
            <v-tabs grow color="teal" v-model="tab" @change="checkTab">
              <v-tab style="font-weight: bold" key="1">חדש</v-tab>
              <v-tab style="font-weight: bold" key="2">לא ברור / לא נמצא</v-tab>
              <v-tab style="font-weight: bold" key="3">בוצע</v-tab>

              <v-tab-item>
                <NewTasks v-if="tasks" :tasks="tasks"/>
              </v-tab-item>
              <v-tab-item>
                  <TaskUnclearNotFound :tasks="tasks"/>
              </v-tab-item>
              <v-tab-item>
                <DoneTasks v-if="tasks" :tasks="tasks"/>
              </v-tab-item>
            </v-tabs>
          <!-- </v-card> -->
        </v-col>
      </v-row>

    </div>
</template>

<script>
import NewTasks from '@/components/New.vue'
import TaskUnclearNotFound from '@/components/TaskUnclearNotFound.vue'
import DoneTasks from '@/components/Done.vue'
import moment from 'moment'
import Swal from "sweetalert2"
import {mapActions, mapGetters} from 'vuex'
  export default {
    components: {
      NewTasks,
      TaskUnclearNotFound,
      DoneTasks
    },
    data() {
        return {
            currentTab: 0,
            overlay: false,
            tab: null,
            search: null,
            dialog: false,
            pagination: {},
            visible: false,
            added: false,
            isPressed: false,
            color: null,
            msg: null,
            tasks: null,
            filteredTasks: null,
            task: {
              title: null,
              location: null,
              phone_number: null,
              urgency: null,
              full_name: null,
              description: null,
              status: 'חדש',
              image: null,
              created_on: null,
              modified_on: null,
            },
            required: [
              v => !!v || 'נדרש'
            ],
            overcolumns: [

                {
                    text: 'מיקום',
                    value: 'location',
                    sortable: true
                },
                {
                    text: 'שם מלא',
                    value: 'full_name',
                    sortable: true
                },
                {
                    text: 'תיאור',
                    value: 'description',
                    sortable: true
                },
            ],
          selectedLoc: null,
          dates: [],
          dateFormatted: [],
          menu1: false,
          menu2: false,
          loader: false
        }
    },
    computed: {
      ...mapGetters(['getTasks','getLocations']),
      locations() {
        let locs = []
        if(this.getLocations) {
          this.getLocations.forEach(element => {
            let name = element.name
            locs.push(name)
          });
        }
        return locs
      },
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },

    methods: {
      ...mapActions(['fetchTasks']),
      searchTasks() {
        if (this.selectedLoc && this.dates.length !== 0) {
          let d1 = this.dates[0]
          let d2 = this.dates[1]
          let start = null
          let end = null
          if (moment(d1).diff(d2) < 0) {
            start = d1
            end = d2
          } else {
            end = d1
            start = d2
          }
          console.log('start->', start, 'end->', end)
          const tasks = []
          this.tasks.forEach((item) => {
            let date = moment(item.created_on, 'DD/MM/YYYY').format('YYYY-MM-DD')
            if (item.location === this.selectedLoc && moment(date).isBetween(start, end)) {
              tasks.push(item)
            }
          })
          this.tasks = tasks
          console.log('tasks-->', tasks)
        }
      },
      refresh() {
        this.dates = []
        this.selectedLoc = null
        this.fetchTasks()
        this.loader = true
      },
      checkTab(v) {
        this.currentTab = v
        this.filterTasksByStatus(this.currentTab)
      },
      filterTasksByStatus(v) {
        if(this.tasks) {
          if(v == 0) {
            this.filteredTasks = this.tasks.filter(task => task.status == 'חדש' || task.status == 'טיפול מתמשך')
            let filtered = this.filteredTasks
            this.sortTasks(filtered)
            console.log(this.filteredTasks)
          }
          else if(v == 1) {
            this.filteredTasks = this.tasks.filter(task => task.status == 'לא ברור / לא נמצא')
            let filtered = this.filteredTasks
            this.sortTasks(filtered)
            console.log(this.filteredTasks)
          }
          else if(v == 2) {
            this.filteredTasks = this.tasks.filter(task => task.status == 'בוצע')
            let filtered = this.filteredTasks
            this.sortTasks(filtered)
            console.log(this.filteredTasks)
          }
        }
      },
      sortTasks(taskArray) {
        return taskArray.sort((a,b) => {
                let x = a.urgency
                let y = b.urgency

                if(x == "גבוהה") {
                    x = 1
                }
                if(x == "בינונית") {
                    x = 2
                }
                if(x == "נמוכה") {
                    x = 3
                }

                if(y == "גבוהה") {
                    y = 1
                }
                if(y == "בינונית") {
                    y = 2
                }
                if(y == "נמוכה") {
                    y = 3
                }

                return (x < y) ? -1 : ((x > y) ? 1 : 0)

            })
      },
      view(record) {
        this.$router.push({path: '/task/1'})
      },
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
    },
    created() {
      this.fetchTasks()
    },
    watch: {
      getTasks(val) {
        if(val) {
          this.tasks = val.filter((item => { return !item.deleted }))
            this.filterTasksByStatus(this.currentTab)
          this.loader = false
        }
      },
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
    }
  }
</script>

<style scoped>
.task-row {
  border: 2px solid #489689 !important;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
