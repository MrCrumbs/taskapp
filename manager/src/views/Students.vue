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
          <h2 class="">תלמידים</h2>
        </v-col>
        <v-col>
          <v-btn class="float-left" outlined color="teal" @click="dialog = !dialog"><i class="fa fa-plus ml-2"></i> הוסף תלמידים</v-btn>
          <v-btn class="float-left ml-2 text-white" depressed color="teal" @click="pickExcelFile" :disabled="isPressed"> {{uploadText}}</v-btn>
          <input @change="onFilePicked" type="file" style="display:none" ref="onFileInput">
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-if="students">
            <v-data-table
                :headers="columns"
                :items="students"
                class="elevation-1"
                :search="search"
                :footer-props="{
                  'itemsPerPageText':'שורות לעמוד'
                }"
            >
                <template v-slot:top>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field  v-model="search" color="teal" label="חיפוש" append-icon="mdi-magnify" class="mx-4 mt-3"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field  @input="searchByClass" color="teal" label="סינון לפי מחזור" append-icon="mdi-magnify" class="mx-4 mt-3"></v-text-field>
                    </v-col>
                  </v-row>
                  
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon
                        small
                        class="mr-2"
                        @click="edit(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                        small
                        class="mr-2"
                        @click="deleteItem(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
                
            </v-data-table>


          <!-- <a-table
                class="table"
                :columns="columns"
                :dataSource="data"
                rowKey="id"
                :scroll="{ x: 1 }">
                <span slot="status" slot-scope="id, record">
                    <v-chip color="warning">{{record.status}}</v-chip>
                </span>
                <span slot="view" slot-scope="id, record">
                    <v-btn outlined color="teal" @click="view(record)" small> View</v-btn>
                </span>
                <span slot="edit" slot-scope="id, record">
                    <v-btn outlined color="warning" @click="edit(record)" small> Edit</v-btn>
                </span>
                <span slot="delete" slot-scope="id, record">
                    <v-btn outlined color="red" @click="deleteItem(record)" small> Delete</v-btn>
                </span>
            </a-table> -->
        </v-col>
      </v-row>

      <!-- ADD Student -->

      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">הוסף תלמידים</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field :label="ID" v-model="student.student_id" :rules="required" outlined clearable required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="שם פרטי*" v-model="student.first_name" :rules="required" outlined clearable required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="שם משפחה*" outlined v-model="student.last_name" :rules="required" clearable required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="מחזור*" outlined clearable v-model="student.class" :rules="required" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field label="מספר טלפון*" outlined v-model="student.phone_number" :rules="required" clearable required></v-text-field>
                    </v-col>
                    
                  </v-row>
                </v-form>
              </v-container>
              <small>*שדות חובה</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal" text @click="dialog = !dialog">ביטול</v-btn>
              <v-btn color="teal" text @click="save" :disabled="isPressed">אישור</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-row>


  <!-- Edit Student -->

      <v-row justify="center">
        <v-dialog v-model="editDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">ערוך סטודנט</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form>
                  <v-row v-if="studentToEdit">
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label='ת"ז*' v-model="studentToEdit.student_id" disabled :rules="required" outlined clearable required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="שם פרטי" v-model="studentToEdit.first_name" :rules="required" outlined clearable required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="שם משפחה*" v-model="studentToEdit.last_name" :rules="required" outlined clearable required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="מחזור*" v-model="studentToEdit.class" :rules="required" outlined clearable required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field label="מספר טלפון*" v-model="studentToEdit.phone_number" :rules="required" outlined clearable required></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal" text @click="editDialog = !editDialog">ביטול</v-btn>
              <v-btn color="teal" text @click="editStudent">אישור</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-dialog v-model="deleteModal" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">מחיקת תלמיד</span>
            </v-card-title>
            <v-card-text>
              <v-container>
               <v-row v-if="studentToDelete">
                 <v-col cols="12" class="text-center">
                   <h4>האם הנך בטוח שברצונך למחוק את התלמיד {{studentToDelete.first_name}} {{studentToDelete.last_name}} </h4>
                 </v-col>
                 
               </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal" text @click="deleteModal = !deleteModal">לא, ביטול</v-btn>
              <v-btn color="teal" text @click="removeStudent">כן, מחק</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-row>
        
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
  export default {
    name: "Students",
    data() {
        return {
            ID: 'ת"ז*',
            uploadText: 'ייבוא מאקסל',
            uploadExcel: {
              file: null,
              students: null
            },
            studentToDelete: null,
            studentToEdit: null,
            deleteModal: false,
            students: null,
            isPressed:false,
            color: null,
            msg: null,
            added: false,
            required: [
              v => !!v || 'נדרש'
            ],
            student: {
              student_id: null,
              first_name: null,
              last_name: null,
              phone_number: null,
              class: null
            },
            search: null,
            dialog: false,
            editDialog: false,
            pagination: {},
            visible: false,
            columns: [
                {
                    text: 'ת"ז',
                    value: 'student_id',
                    sortable: true,
                },
                {
                    text: 'שם פרטי',
                    value: 'first_name',
                    sortable: true,
                },
                {
                    text: 'שם משפחה',
                    value: 'last_name',
                    sortable: true,
                },
                {
                    text: 'מספר טלפון',
                    value: 'phone_number',
                    sortable: true,
                },
                {
                    text: 'מחזור',
                    value: 'class',
                    sortable: true,
                },
                {
                    text: 'פעולות',
                    value: 'actions',
                    sortable: false
                    
                },
            ]
        }
    },

    computed: {
      ...mapGetters(['getStudents', 'getStudentCreated', 'getStudentDeleted', 'getStudentUpdated', 'getBulkUploaded'])
    },

    methods: {
      ...mapActions(['createStudent', 'fetchStudents', 'deleteStudent', 'updateStudent', 'bulkUpload']),
      pickExcelFile() {
        this.$refs.onFileInput.click()
      },
      onFilePicked(e) {

        let fileT = e.target.files[0]
        console.log(fileT)
        if(fileT) {
          let type = fileT.name.split('.')[1]
          console.log(type)
          if(type != 'xlsx') {
            this.added = true
            this.color = 'error'
            this.msg = "Only Excel Files Allowed"
            return
          }
          this.isPressed = true
          this.uploadText = "נא המתן"
          this.uploadExcel.file = fileT
          this.uploadExcel.students = this.getStudents
          console.log(this.uploadExcel)
          fileT = null
          this.bulkUpload(this.uploadExcel)
        }
        else {
          console.log("Something wrong")
        }
      },
      searchByClass(e) {
        if(e) {
          this.students = []
          this.students = this.getStudents.filter(s => s.class == e) 
        }
        else {
          this.students = this.getStudents
        }
        
      },
      view(record) {

      },
      save() {
        if(this.student.student_id == null || this.student.student_id == '' || this.student.first_name == null || this.student.first_name == ''  || this.student.last_name == null || this.student.last_name == ''  || this.student.phone_number == null || this.student.phone_number == '' || this.student.class == null || this.student.class == '') {
          this.added = true
          this.color = 'error'
          this.msg = "All Fields Required"
          return
        }
        if(this.student.student_id) {
          let found = this.students.find(s => s.student_id == this.student.student_id)
          if(found) {
            this.added = true
            this.color = 'error'
            this.msg = "Student Already Exists with Same ID."
            return
          }
        }
        this.isPressed = true
        this.createStudent(this.student)
      },
      edit(record) {
        this.studentToEdit = record
        this.editDialog = true
      },
      editStudent(){
        if(this.studentToEdit.first_name == null || this.studentToEdit.first_name == ''  || this.studentToEdit.last_name == null || this.studentToEdit.last_name == ''  || this.studentToEdit.phone_number == null || this.studentToEdit.phone_number == '' || this.studentToEdit.class == null || this.studentToEdit.class == '') {
          return
        }
        this.updateStudent(this.studentToEdit)
      },
      deleteItem(record) {
        this.deleteModal = true
        this.studentToDelete = record
      },
      removeStudent(){
        const payload = {
          id: this.studentToDelete._id
        }
        this.deleteStudent(payload)
      }
    },

    created(){
      if(this.getStudents) {
        this.students = this.getStudents
      }
    },

    watch: {
      getStudents(val) {
        if(val) {
          this.students = val
        }
      },
      getStudentCreated(val) {
        if(val && val == 'success') {
          this.added = true
          this.color = 'success'
          this.msg = 'התלמיד הוסף בהצלחה'
          this.dialog = false
          this.student.name = null
          this.isPressed = false
          this.fetchStudents()
        }
        if(val && val != 'success') {
          this.added = true
          this.color = 'error'
          this.msg = 'אירעה שגיאה'
        }
      },
      getStudentDeleted(val) {
        if(val && val == 'success') {
          this.added = true
          this.color = 'success'
          this.msg = 'התלמיד נמחק בהצלחה.'
          this.deleteModal = false
          this.fetchStudents()
        }
        if(val && val != 'success') {
          this.added = true
          this.color = 'error'
          this.msg = 'אירעה שגיאה'
        }
      },
      getStudentUpdated(val) {
        if(val && val == 'success') {
          this.added = true
          this.color = 'success'
          this.msg = 'התלמיד עודכן בהצלחה.'
          this.editDialog = false
          this.fetchStudents()
        }
        if(val && val != 'success') {
          this.added = true
          this.color = 'error'
          this.msg = 'אירעה שגיאה'
        }
      },
      getBulkUploaded(val) {
        if(val && val == 'success') {
          this.added = true
          this.color = 'success'
          this.isPressed = false
          this.msg = 'רשימת התלמידים יובאה בהצלחה'
          this.uploadText = "Import Excel"
          this.uploadExcel.file = null
          this.fetchStudents()
        }
        if(val && val != 'success') {
          this.added = true
          this.color = 'error'
          this.msg = 'אירעה שגיאה'
          this.isPressed = false
          this.uploadText = "Import Excel"
          this.uploadExcel.file = null
        }
      }
    }
  }
</script>