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
          <h2 class="">תקלות שנמחקו</h2>
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
                <NewTasks v-if="tasks" :deleted="true" :tasks="tasks"/>
              </v-tab-item>
              <v-tab-item>
                  <TaskUnclearNotFound :deleted="true" :tasks="tasks"/>
              </v-tab-item>
              <v-tab-item>
                <DoneTasks v-if="tasks" :deleted="true" :tasks="tasks"/>
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
        }
    },

    computed: {
      ...mapGetters(['getTasks']),
    },

    methods: {
      ...mapActions(['fetchTasks']),
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
      }
    },
    created() {
      this.fetchTasks()
    },
    watch: {
      getTasks(val) {
        if(val) {
          this.tasks = val.filter((item => { return item.deleted }))
            this.filterTasksByStatus(this.currentTab)
        }
      }
    }
  }
</script>

<style scoped>
.task-row {
  border: 2px solid #489689 !important;
}
</style>
