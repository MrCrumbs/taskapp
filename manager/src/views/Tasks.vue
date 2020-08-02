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
          <h2 class="">תקלות</h2>
        </v-col>
        <v-col>
          <v-btn class="float-left" outlined color="teal" @click="dialog = !dialog"><i class="fa fa-plus ml-2"></i> הוסף תקלה</v-btn>
          <v-btn class="float-left ml-2" dark depressed color="teal" @click="overlay = !overlay"><i class="fa fa-print ml-2"></i> תצוגת הדפסה</v-btn>
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
            <v-btn class="my-4" @click="overlay = !overlay" color="teal" depressed dark> <i class="fa fa-times-circle fa-2x"></i> </v-btn>
            <v-btn class="my-4 mr-2" @click="print" color="teal" depressed dark> <i class="fa fa-print fa-2x"></i> </v-btn>
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
              <v-tab key="1">חדש</v-tab>
              <v-tab key="2">תקלה לא ברורה</v-tab>
              <v-tab key="3">תקלה לא נמצאה</v-tab>
              <v-tab key="4">בוצע</v-tab>

              <v-tab-item>
                <NewTasks v-if="tasks" @edit-task="editTaskStatus" @edit="edit" @delete="deleteItem" :tasks="tasks"/>
              </v-tab-item>
              <v-tab-item>
                  <TaskUnclear v-if="tasks" @edit-task="editTaskStatus" @edit="edit" @delete="deleteItem" :tasks="tasks"/>
              </v-tab-item>
              <v-tab-item>
                <TaskNotFound v-if="tasks" @edit-task="editTaskStatus" @edit="edit" @delete="deleteItem" :tasks="tasks"/>
              </v-tab-item>
              <v-tab-item>
                <DoneTasks v-if="tasks" @edit-task="editTaskStatus" @edit="edit" @delete="deleteItem" :tasks="tasks"/>
              </v-tab-item>
            </v-tabs>
          <!-- </v-card> -->
        </v-col>
      </v-row>

      <!-- ADD TASK -->

      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">הוסף תקלה</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                    <v-form>
                        <v-row class="mx-5">
                            <v-col cols="12" sm="6">
                              <v-autocomplete clearable outlined v-model="task.full_name" :items="students" :item-text="'name'" :item-value="'name'" :name="'name'" label="שם מלא*" :rules="required" return-object @change="setPhoneNumber"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-autocomplete clearable outlined @change="checkLocation" v-model="pickedLocation" :items="locations" label="מיקום*" :rules="required"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" v-if="pickedLocation && pickedLocation == 'אחר'">
                              <v-text-field label="מיקום*" v-model="task.location" :rules="required" clearable outlined required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field label="כותרת תקלה*" :rules="required" outlined v-model="task.title" clearable required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-select :rules="required" outlined v-model="task.urgency" :items="['נמוכה', 'בינונית', 'גבוהה']" label="דחיפות*" required></v-select>
                            </v-col>
                            <!-- <v-col cols="12" sm="6" md="6">
                              <v-text-field label="מספר טלפון*" v-model="task.phone_number" :rules="required" clearable outlined required></v-text-field>
                            </v-col> -->
                            <v-col cols="12" sm="12" :md="pickedLocation == 'אחר' && pickedLocation ? '6' : '12' "> 
                              <v-file-input outlined show-size label="העלאת תמונה" v-model="task.image" accept="image/*" prepend-icon="mdi-camera"></v-file-input>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                              <v-textarea outlined label="תיאור*" v-model="task.description" :rules="required" clearable required></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-container>
              <small>*שדות חובה</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal" text @click="dialog = !dialog">ביטול</v-btn>
              <v-btn color="teal" text @click="addTask" :disabled="isPressed">אישור</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-row>


  <!-- Edit TASK -->

      <v-row justify="center">
        <v-dialog v-model="editDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">ערוך משימה</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form>
                  <v-row v-if="taskToEdit">
                    <v-col cols="12" sm="6">
                      <v-select
                        @change="setUrgency"
                        v-model="taskToEdit.urgency"
                        outlined
                        :items="['נמוכה', 'בינונית', 'גבוהה']"
                        label="דחיפות"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="taskToEdit.status"
                        outlined
                        :items="['חדש', 'התקלה לא ברורה', 'התקלה לא נמצאה', 'טיפול מתמשך', 'בוצע']"
                        label="סטאטוס"
                        required
                      ></v-select>
                    </v-col>
                    
                    
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal" text @click="editDialog = !editDialog">ביטול</v-btn>
              <v-btn color="teal" text @click="editItem">אישור</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="deleteModal" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">מחיקת תקלה</span>
            </v-card-title>
            <v-card-text>
              <v-container>
               <v-row v-if="taskToDelete">
                 <v-col cols="12" class="text-center">
                   <h4>האם הנך בטח שברצונך למחוק את התקלה {{taskToDelete.title}} </h4>
                 </v-col>
                 
               </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal" text @click="deleteModal = !deleteModal">לא, ביטול</v-btn>
              <v-btn color="teal" text @click="removeTask">כן, מחק</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-row>
        
    </div>
</template>

<script>
import NewTasks from '@/components/New.vue'
import TaskUnclear from '@/components/TaskUnclear.vue'
import TaskNotFound from '@/components/TaskNotFound.vue'
import DoneTasks from '@/components/Done.vue'
import Swal from "sweetalert2"
import {mapActions, mapGetters} from 'vuex'
  export default {
    components: {
      NewTasks,
      TaskUnclear,
      TaskNotFound,
      DoneTasks
    },
    data() {
        return {
            currentTab: 0,
            deleteModal: false,
            overlay: false,
            tab: null,
            search: null,
            dialog: false,
            editDialog: false,
            pagination: {},
            visible: false,
            added: false,
            isPressed: false,
            color: null,
            msg: null,
            tasks: null,
            filteredTasks: null,
            taskToEdit: {
              id: null,
              status: null,
              urgency: null,
              modified_on: null
            },
            pickedLocation: null,
            taskToDelete: null,
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
      ...mapGetters(['getTasks', 'getTaskCreated', 'getTaskDeleted', 'getTaskUpdated', 'getLocations', 'getStudents']),
      locations() {
        let locs = []
        if(this.getLocations) {
            this.getLocations.forEach(element => {
            let name = element.name
            locs.push(name)
          });
          locs.push('אחר')
        }
        return locs
      },
      students() {
        let studs = []
        if(this.getStudents) {
            this.getStudents.forEach(element => {
            const obj = {
              name: element.full_name,
              phone: element.phone_number
            }
            studs.push(obj)
          });
        }
        return studs
        //return this.getStudents
      }
    },

    methods: {
      ...mapActions(['createTask', 'fetchTasks', 'deleteTask', 'updateTask']),
      print() {
          window.print();
      },
      setPhoneNumber(v) {
        if(v) {
          this.task.phone_number = v.phone
          this.task.full_name = v.name
        }
      },
      checkTab(v) {
        this.currentTab = v
        console.log(this.currentTab)
        this.filterTasksByStatus(this.currentTab)
      },
      filterTasksByStatus(v) {
        if(this.tasks) {
          if(v < 1) {  
            this.filteredTasks = this.tasks.filter(task => task.status == 'חדש' || task.status == 'טיפול מתמשך')
            let filtered = this.filteredTasks
            this.sortTasks(filtered)
            console.log(this.filteredTasks)
          }
          if(v == 1) {
            this.filteredTasks = this.tasks.filter(task => task.status == 'התקלה לא ברורה')
            let filtered = this.filteredTasks
            this.sortTasks(filtered)
            console.log(this.filteredTasks)
          }
          if(v == 2) {
            this.filteredTasks = this.tasks.filter(task => task.status == 'התקלה לא נמצאה')
            let filtered = this.filteredTasks
            this.sortTasks(filtered)
            console.log(this.filteredTasks)
          }
          if(v == 3) {
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
      checkLocation(e) {
        if(e !== 'אחר') {
          this.task.location = e
        }
      },
      setUrgency(v) {
        // if(v == 'נמוכה') {
        //   console.log("Low")
        // }
      },
      addTask() {
        if(this.task.title == null || this.task.title == '' || this.task.urgency == null || this.task.urgency == '' || this.task.location == null || this.task.location == '' || this.task.full_name == null || this.task.full_name == '' || this.task.phone_number == null || this.task.phone_number == '' || this.task.description == null || this.task.description == '')
        {
          return
        }
        let date = new Date()
        let year = date.getFullYear()
        let month = this.addZ(date.getMonth()+1)
        let day = this.addZ(date.getDate())
        
        this.task.created_on = day+"/"+month+"/"+year
        this.task.modified_on = day+"/"+month+"/"+year
        //console.log(this.task)
        this.isPressed = true

        this.createTask(this.task);
        Swal.fire({title: "...שומר תקלה", text: "נא המתן", showConfirmButton: false})
      },
      addZ(n){return n<10? '0'+n:''+n;},
      view(record) {
        this.$router.push({path: '/task/1'})
      },
      edit(record) {
        this.taskToEdit.id = record._id
        this.taskToEdit.status = record.status
        this.taskToEdit.urgency = record.urgency
        this.editDialog = true
      },
      editItem() {
        let date = new Date()
        let year = date.getFullYear()
        let month = this.addZ(date.getMonth()+1)
        let day = this.addZ(date.getDate())

        this.taskToEdit.modified_on = day+"/"+month+"/"+year

        this.updateTask(this.taskToEdit)
      },
      editTaskStatus(data) {
        this.taskToEdit.id = data.record._id;
        this.taskToEdit.status = data.status;
        this.taskToEdit.urgency = data.record.urgency;
        let date = new Date()
        let year = date.getFullYear()
        let month = this.addZ(date.getMonth()+1)
        let day = this.addZ(date.getDate())
        this.taskToEdit.modified_on = day+"/"+month+"/"+year
        this.updateTask(this.taskToEdit)
      },
      deleteItem(record) {
        this.taskToDelete = record
        this.deleteModal = true
      },
      removeTask() {
        const payload = {
          id: this.taskToDelete._id
        }
        this.deleteTask(payload)
      },
    },

    created() {
      this.fetchTasks()
    },

    watch: {
      getTasks(val) {
        if(val) {
          this.tasks = val
          //if(this.tasks) {
            this.filterTasksByStatus(this.currentTab)
          //}
          
          //this.filteredTasks = this.tasks.filter(task => task.status == 'חדש' || task.status == 'טיפול מתמשך')
        }
      },
      getTaskCreated(val) {
        if(val && val == 'success') {
          Swal.close()
          this.msg = 'התקלה הוספה בהצלחה'
          this.color = 'success'
          this.added = true
          this.isPressed = false
          this.dialog = false
          this.fetchTasks()
        }
        if(val && val != 'success') {
          Swal.close()
          this.msg = 'אירעה שגיאה'
          this.color = 'error'
          this.added = true
          this.isPressed = false
        }
      },
      getTaskUpdated(val) {
        if(val && val == 'success') {
          this.added = true
          this.color = 'success'
          this.msg = 'התקלה עודכנה בהצלחה'
          this.editDialog = false
          this.fetchTasks()
        }
        if(val && val != 'success') {
          this.added = true
          this.color = 'error'
          this.msg = 'אירעה שגיאה'
        }
      },
      getTaskDeleted(val) {
        if(val && val == 'success') {
          this.added = true
          this.color = 'success'
          this.msg = 'התקלה נמחקה בהצלחה.'
          this.deleteModal = false
          this.fetchTasks()
        }
        if(val && val != 'success') {
          this.added = true
          this.color = 'error'
          this.msg = 'אירעה שגיאה'
        }
      },
    }
  }
</script>

<style scoped>
.task-row {
  border: 2px solid #489689 !important;
}
</style>
