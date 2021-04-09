<template>
    <div class="tasks mx-5 mt-3">
      <v-row>
        <v-snackbar v-model="added" timeout="2500" :top="true" :color="color">
            {{msg}}
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="added = false">ביטול</v-btn>
            </template>
        </v-snackbar>
        <v-col cols="6">
            <h2 class="">תקלות</h2>
        </v-col>
        <v-col>
            <v-btn class="float-left" outlined color="teal" @click="open_dialog"><i class="fa fa-plus ml-2"></i>הוסף תקלת רכב</v-btn>
            <v-btn class="float-left ml-2" dark depressed color="teal" @click="showPrintOverlay"><i class="fa fa-print ml-2"></i>תצוגת הדפסה</v-btn>
            <v-btn class="float-left ml-2" dark depressed color="teal" @click="download_excel"><i class="fa fa-download ml-2"></i>הורדת גיבוי</v-btn>
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
            <v-btn class="my-4" @click="hidePrintOverlay" color="teal" depressed dark> <i class="fa fa-times-circle fa-2x"></i> </v-btn>
            <v-btn class="my-4 mr-2" @click="print" color="teal" depressed dark> <i class="fa fa-print fa-2x"></i> </v-btn>
            <v-data-table
                :headers="overcolumns"
                :items="filteredTasks"
                class="elevation-1 over-table"
                light
                :footer-props="{
                  'itemsPerPageText':'שורות לעמוד',
                  'itemsPerPageOptions': [-1, 10, 15, 50]
                }"
                :items-per-page="-1"
            >
                
            </v-data-table>

          </v-overlay>
        </v-col>
      </v-row>

      <v-row>
      </v-row>
      <v-row id="tabDataTables">
        <v-col cols="12">
          <!-- <v-card class="pb-5"> -->
            <v-tabs grow color="teal" v-model="tab" @change="checkTab">
              <v-tab style="font-weight: bold" key="1">חדש</v-tab>
              <v-tab style="font-weight: bold" key="2">לא ברור / לא נמצא</v-tab>
              <v-tab style="font-weight: bold" key="3">בוצע</v-tab>

              <v-tab-item>
                <NewTasks v-if="tasks" @edit-task="editTaskStatus" @edit="edit" @delete="deleteItem" :tasks="tasks"/>
              </v-tab-item>
              <v-tab-item>
                  <TaskUnclearNotFound v-if="tasks" @edit-task="editTaskStatus" @edit="edit" @delete="deleteItem" :tasks="tasks"/>
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
                    <v-form ref="form">
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
                              <v-textarea outlined label="תיאור" v-model="task.description" clearable></v-textarea>
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
                        :items="['חדש', 'לא ברור / לא נמצא', 'טיפול מתמשך', 'בוצע']"
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

      <!--        dialog for loader-->
      <v-row justify="center">
      <v-dialog v-model="load" persistent max-width="400px">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" class="text-center">
                  <h4>שומר תקלה</h4>
                  <h5>נא המתן...</h5>
                  <v-progress-linear
                          color="#009688"
                          indeterminate
                          rounded
                          height="6"
                  ></v-progress-linear>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-row>
        
    </div>
</template>

<script>
import NewTasks from '@/components/New.vue'
import TaskUnclearNotFound from '@/components/TaskUnclearNotFound.vue'
import DoneTasks from '@/components/Done.vue'
import Swal from "sweetalert2"
import {mapActions, mapGetters, mapState} from 'vuex'
import axios from "axios";
import XLSX from 'xlsx'
  export default {
    components: {
      NewTasks,
      TaskUnclearNotFound,
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
            visible: false,
            added: false,
            isPressed: false,
            color: null,
            msg: null,
            tasks: null,
            filteredTasks: null,
            load: false,
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
              task_type: null
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
                    text: 'כותרת',
                    value: 'title',
                    sortable: true
                },
            ],
            tasksToDownload: null,
        }
    },
    created() {
      this.fetchTasks()
      this.unsubscribe = this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'setLoader') {
          this.load = this.$store.getters.getLoader
        }
      });
    },
    computed: {
      ...mapGetters(['getTasks', 'getTaskCreated', 'getTaskDeleted', 'getTaskUpdated', 'getLocations', 'getStudents','getLoader']),
      ...mapState(['loader']),
      locations() {
        let locs = []
        var locations = this.getLocations;
        var filtered_location = null;
        if(locations){
            filtered_location = locations.filter(location => location.location_type == "vehicle");
            filtered_location.forEach(element => {
                let name = element.name;
                locs.push(name);
            });
            locs.push('אחר');
        }
        return locs;
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
        hidePrintOverlay(){
            this.overlay = !this.overlay;
            document.getElementById("tabDataTables").style.display = "block";
        },
        showPrintOverlay(){
            this.overlay = !this.overlay;
            document.getElementById("tabDataTables").style.display = "none";
        },
        print() {
            window.print();
        },
        open_dialog(){
            this.dialog = !this.dialog;
            if (this.$refs.form)
                this.$refs.form.reset();
        },
        download_excel(){
            var worksheet = XLSX.utils.json_to_sheet(this.tasksToDownload);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, worksheet, 'תקלות');
            XLSX.writeFile(wb, "גיבוי_תקלות.xlsx");
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
        prepare_for_download(tasks){
            for(let task of tasks){
                task["כותרת תקלה"] = task["title"];
                task["מיקום"] = task["location"];
                task["ת. יצירה"] = task["created_on"];
                task["ת. עריכה"] = task["modified_on"];
                task["מספר טלפון"] = task["phone_number"];
                task["דחיפות"] = task["urgency"];
                task["שם מלא"] = task["full_name"];
                task["תיאור"] = task["description"];
                task["סטטוס"] = task["status"];
                task["תמונה"] = task["image"];
                task["נשלחה התראה"] = task["notification_sent"];
                task["נמחקה"] = task["deleted"];
                delete task["title"];
                delete task["location"];
                delete task["created_on"];
                delete task["modified_on"];
                delete task["phone_number"];
                delete task["urgency"];
                delete task["full_name"];
                delete task["description"];
                delete task["status"];
                delete task["image"];
                delete task["notification_sent"];
                delete task["deleted"];
                delete task["_id"];
                delete task["__v"];
            }
            return tasks;
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
        if(this.task.title == null || this.task.title == '' || this.task.urgency == null || this.task.urgency == '' || this.task.location == null || this.task.location == '' || this.task.full_name == null || this.task.full_name == '' || this.task.description == null || this.task.description == '')
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
        this.task.task_type = "vehicle"
        this.createTask(this.task);
        this.loaderValues = 0
        // Swal.fire({title: "...שומר תקלה", text: "נא המתן", showConfirmButton: false})
      },
      addZ(n){return n<10? '0'+n:''+n;},
      view(record) {
        this.$router.push({path: '/task/1'})
      },
      edit(record) {
        this.taskToEdit.id = record._id
        this.taskToEdit.old_status = record.status
        this.taskToEdit.status = record.status
        this.taskToEdit.urgency = record.urgency
        this.taskToEdit.phone_number = record.phone_number;
        this.taskToEdit.full_name = record.full_name;
        this.taskToEdit.title = record.title;
        this.taskToEdit.deleted = record.deleted;
        this.editDialog = true;
      },
      editItem() {
        let date = new Date()
        let year = date.getFullYear()
        let month = this.addZ(date.getMonth()+1)
        let day = this.addZ(date.getDate())
        this.taskToEdit.changed = (this.taskToEdit.old_status != this.taskToEdit.status) ? true : false;
        this.taskToEdit.modified_on = day+"/"+month+"/"+year
        console.log(this.taskToEdit);
        var task_manager = JSON.parse(localStorage.getItem('taskManager'));
        var message_body_done = task_manager.changed_status_done_message;
        var message_body_unclear = task_manager.changed_status_unclear_message;
        var message_body_continuous = task_manager.changed_status_continuous_message;
        if(message_body_done)
            this.taskToEdit.message_body_done = message_body_done
        if(message_body_unclear)
            this.taskToEdit.message_body_unclear = message_body_unclear
        if(message_body_continuous)
            this.taskToEdit.message_body_continuous = message_body_continuous
        this.updateTask(this.taskToEdit)
      },
      editTaskStatus(data) {
        this.taskToEdit.id = data.record._id;
        this.taskToEdit.changed = true;
        this.taskToEdit.status = data.record.status;
        this.taskToEdit.urgency = data.record.urgency;
        this.taskToEdit.phone_number = data.record.phone_number;
        this.taskToEdit.full_name = data.record.full_name;
        this.taskToEdit.title = data.record.title;
        this.taskToEdit.deleted = data.record.deleted
        let date = new Date()
        let year = date.getFullYear()
        let month = this.addZ(date.getMonth()+1)
        let day = this.addZ(date.getDate())
        this.taskToEdit.modified_on = day+"/"+month+"/"+year
        var task_manager = JSON.parse(localStorage.getItem('taskManager'));
        var message_body_done = task_manager.changed_status_done_message;
        var message_body_unclear = task_manager.changed_status_unclear_message;
        var message_body_continuous = task_manager.changed_status_continuous_message;
        if(message_body_done)
            this.taskToEdit.message_body_done = message_body_done
        if(message_body_unclear)
            this.taskToEdit.message_body_unclear = message_body_unclear
        if(message_body_continuous)
            this.taskToEdit.message_body_continuous = message_body_continuous
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

    watch: {
      getTasks(val) {
        if(val) {
            this.tasks = val.filter((item => { return item.task_type == "vehicle" }));
            this.tasksToDownload = this.prepare_for_download(JSON.parse(JSON.stringify(this.tasks)));
            this.tasks = this.tasks.filter((item => { return !item.deleted }));
            this.filterTasksByStatus(this.currentTab);
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
    },
    beforeDestroy() {
      this.unsubscribe();
    }
  }
</script>

<style scoped>
.task-row {
  border: 2px solid #489689 !important;
}
</style>
