<template>
    <div class="mx-5 mt-3">
      <v-container class="mt-5 pr-0">
        <v-row class="mb-6">
          <v-col lg="4">
            <v-card class="pa-2" tile>
              <h2 class="text-center pt-3">החלפת סיסמה</h2>
                <form ref="password">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="סיסמה חדשה" :type="value ? 'password' : 'text'" required="required" :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'" @click:append="() => (value = !value)" :value="newPassword" v-model="newPassword" outlined></v-text-field>
                </v-col>
              </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="אימות הסיסמה" :type="value ? 'password' : 'text'" required="required" :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'" @click:append="() => (value = !value)" :value="repeatPassword" v-model="repeatPassword" outlined></v-text-field>
                        <v-btn color="teal" class="text-white" @click="saveNewPassword" block>שמור</v-btn>
                    </v-col>
                </v-row>
                </form>
            </v-card>
              <br/>
              </v-col>
        </v-row>
      </v-container>

<!--        emails list -->
        <v-row>
            <v-col>
                <h2 class="">כתובות מייל לעדכונים</h2>
            </v-col>
            <v-col>
                <v-btn class="float-left" outlined color="teal" @click="addEmailModal()"><i class="fa fa-plus ml-2"></i>הוסף מייל</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="emails">
                <v-data-table
                        :headers="email_columns"
                        :items="emails"
                        class="elevation-1"
                        :search="search_email"
                        :footer-props="{
                  'itemsPerPageText':'שורות לעמוד',
                  'itemsPerPageOptions': [-1, 10, 15, 50]
                }"
                :items-per-page="-1"
                >
                    <template v-slot:top>
                        <v-text-field  v-model="search_email" label="חיפוש" append-icon="mdi-magnify" class="mx-4 mt-3"></v-text-field>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                                small
                                class="mr-2"
                                @click="editEmailOrNumModal(item, 'email')"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                                small
                                class="mr-2"
                                @click="deleteEmailOrNumModal(item,'email')"
                        >
                            mdi-delete
                        </v-icon>
                    </template>

                </v-data-table>
            </v-col>
        </v-row>

        <br/>

        <!--        phone num list -->
        <v-row>
            <v-col>
                <h2 class="">מספרי טלפון לעדכונים</h2>
            </v-col>
            <v-col>
                <v-btn class="float-left" outlined color="teal" @click="(addEmailOrNum = !addEmailOrNum) && (addEmail = false)"><i class="fa fa-plus ml-2"></i> הוסף מספר טלפון</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col v-if="phoneNums">
                <v-data-table
                        :headers="phone_columns"
                        :items="phoneNums"
                        class="elevation-1"
                        :search="search_phone"
                        :footer-props="{
                  'itemsPerPageText':'שורות לעמוד',
                  'itemsPerPageOptions': [-1, 10, 15, 50]
                }"
                :items-per-page="-1"
                >
                    <template v-slot:top>
                        <v-text-field  v-model="search_phone" label="חיפוש" append-icon="mdi-magnify" class="mx-4 mt-3"></v-text-field>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                                small
                                class="mr-2"
                                @click="editEmailOrNumModal(item, 'num')"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                                small
                                class="mr-2"
                                @click="deleteEmailOrNumModal(item,'num')"
                        >
                            mdi-delete
                        </v-icon>
                    </template>

                </v-data-table>
            </v-col>
        </v-row>
        
        
        <br/>
        
        <v-row>
            <v-col lg="4" style="padding-bottom:0">
                <h2 class="">נוסח הודעת עדכון סטאטוס - בוצע</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col lg="4" style="padding-bottom:0">
                <v-textarea outlined label="נוסח הודעה" clearable v-model="status_changed_done_text_box"></v-textarea>
            </v-col>
            <v-col>
            הערה: על ההודעה לכלול את הביטויים הדינאמיים <i>{שם}, {תקלה}</i> בדיוק פעם אחת.
            </v-col>
        </v-row>
        <v-row>
            <v-col lg="4" style="padding-top:0">
                <v-btn color="teal" dark block @click="status_changed_done_click">שמור</v-btn>
            </v-col>
        </v-row>
        
        <br/>
        
        <v-row>
            <v-col lg="4" style="padding-bottom:0">
                <h2 class="">נוסח הודעת עדכון סטאטוס - לא ברור/לא נמצא</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col lg="4" style="padding-bottom:0">
                <v-textarea outlined label="נוסח הודעה" clearable v-model="status_changed_unclear_text_box"></v-textarea>
            </v-col>
            <v-col>
            הערה: על ההודעה לכלול את הביטויים הדינאמיים <i>{שם}, {תקלה}</i> בדיוק פעם אחת.
            </v-col>
        </v-row>
        <v-row>
            <v-col lg="4" style="padding-top:0">
                <v-btn color="teal" dark block @click="status_changed_unclear_click">שמור</v-btn>
            </v-col>
        </v-row>
        
        <br/>
        
        <v-row>
            <v-col lg="4" style="padding-bottom:0">
                <h2 class="">נוסח הודעת עדכון סטאטוס - טיפול מתמשך</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col lg="4" style="padding-bottom:0">
                <v-textarea outlined label="נוסח הודעה" clearable v-model="status_changed_continuous_text_box"></v-textarea>
            </v-col>
            <v-col>
            הערה: על ההודעה לכלול את הביטויים הדינאמיים <i>{שם}, {תקלה}</i> בדיוק פעם אחת.
            </v-col>
        </v-row>
        <v-row>
            <v-col lg="4" style="padding-top:0">
                <v-btn color="teal" dark block @click="status_changed_continuous_click">שמור</v-btn>
            </v-col>
        </v-row>
        
        <br/>
        
        <v-row>
            <v-col lg="4" style="padding-bottom:0">
                <h2 class="">נוסח הודעת חוסר טיפול לאחר שבועיים</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col lg="4" style="padding-bottom:0">
                <v-textarea outlined label="נוסח הודעה" clearable v-model="deadline_passed_text_box"></v-textarea>
            </v-col>
            <v-col>
            הערה: על ההודעה לכלול את הביטוי הדינאמי <i>{תקלות}</i> בדיוק פעם אחת.
            </v-col>
        </v-row>
        <v-row>
            <v-col lg="4" style="padding-top:0">
                <v-btn color="teal" dark block @click="deadline_passed_click">שמור</v-btn>
            </v-col>
        </v-row>
        
        <!-- ADD modal -->

        <v-row>
            <v-dialog v-model="addEmailOrNum" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ this.addEmail ? 'הוסף מייל' : 'הוסף מספר טלפון' }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <form :ref="addEmail ? 'emailForm' : 'numForm'">
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="מספר טלפון*" v-if="!addEmail" type="number" v-model="phoneNum" outlined clearable required></v-text-field>
                                        <v-text-field label="מייל*" v-else type="email" required="required" :value="email" v-model="email" outlined></v-text-field>
                                    </v-col>
                                </v-row>
                            </form>
                        </v-container>
                        <small>*שדות חובה</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="teal" text @click="addEmailOrNum = !addEmailOrNum">ביטול</v-btn>
                        <v-btn color="teal" text @click="addEmail ? saveEmailAndNumber('email') : saveEmailAndNumber('num')">אישור</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>


        <!-- Edit modal -->

        <v-row>
            <v-dialog v-model="editEmailDialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">ערוך</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form>
                                <v-row v-if="emailToEdit">
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="מייל*" v-model="editedEmail" type="email" outlined clearable required></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row v-else>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="מספר טלפון*" v-model="editedNum" type="number" outlined clearable required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="teal" text @click="editEmailDialog = !editEmailDialog">ביטול</v-btn>
                            <v-btn color="teal" v-if="emailToEdit" text @click="editEmail">אישור</v-btn>
                            <v-btn color="teal" v-else text @click="editNumber">אישור</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import Swal from "sweetalert2";
    export default {
        name: "Settings",
        data() {
            return {
              value: true,
              newPassword: null,
              repeatPassword: null,
              email: null,
              phoneNum: null,
              addEmailOrNum: false,
              addEmail: false,
              status_changed_done_text_box: null,
              status_changed_unclear_text_box: null,
              status_changed_continuous_text_box: null,
              deadline_passed_text_box: null,
              email_columns: [
                  {
                      text: 'אימייל',
                      value: 'item',
                      sortable: true
                  },
                  {
                      text: 'פעולות',
                      value: 'actions',
                      sortable: false
                  },
              ],
              phone_columns: [
                  {
                      text: 'מספרי טלפון',
                      value: 'item',
                      sortable: true
                  },
                  {
                      text: 'פעולות',
                      value: 'actions',
                      sortable: false
                  },
              ],
              emails: null,
              phoneNums: null,
              search_email: null,
              search_phone: null,
              emailToEdit: null,
              editEmailDialog: false,
              editedEmail: null,
              numToEdit: null,
              editedNum: null
            }
        },
        created() {
            var task_manager = JSON.parse(localStorage.getItem('taskManager'));
            this.emails = task_manager.email_addresses_for_notifications
            this.emails = this.emails.map(item => ({ item }))
            this.phoneNums = task_manager.phone_numbers_for_notifications
            this.phoneNums = this.phoneNums.map(item => ({ item }))
            this.status_changed_done_text_box = task_manager.changed_status_done_message
            this.status_changed_unclear_text_box = task_manager.changed_status_unclear_message
            this.status_changed_continuous_text_box = task_manager.changed_status_continuous_message
            this.deadline_passed_text_box = task_manager.deadline_passed_message
        },
        computed: {
            ...mapGetters(['getManager'])
        },
        watch: {
          getManager(val) {
            if(val) {
              console.log("***");
              console.log(val);
              console.log("***");
              localStorage.setItem('taskManager', JSON.stringify(val))
            }
          }
        },
        methods: {
            ...mapActions(['updateManagerPassword','addManagerEmailAndPhoneNum','updateManagerEmailOrNum','deleteManagerEmailOrNum', 'updateManagerChangedStatusDoneMessage', 'updateManagerChangedStatusUnclearMessage', 'updateManagerChangedStatusContinuousMessage', 'updateManagerDeadlinePassedMessage']),
            status_changed_done_click(){
                if ((this.status_changed_done_text_box.match(/{תקלה}/g) || []).length == 1 && (this.status_changed_done_text_box.match(/{שם}/g) || []).length == 1){
                    const payload = {
                                _id: JSON.parse(localStorage.getItem('taskManager'))._id,
                                changed_status_done_message: this.status_changed_done_text_box,
                    };
                    this.updateManagerChangedStatusDoneMessage(payload);
                }
                else{
                    Swal.fire('שגיאה', 'הביטויים הדינאמיים לא צוינו בהודעה בדיוק פעם אחת.', 'error')
                }
            },
            
            status_changed_unclear_click(){
                if ((this.status_changed_unclear_text_box.match(/{תקלה}/g) || []).length == 1 && (this.status_changed_unclear_text_box.match(/{שם}/g) || []).length == 1){
                    const payload = {
                                _id: JSON.parse(localStorage.getItem('taskManager'))._id,
                                changed_status_unclear_message: this.status_changed_unclear_text_box,
                    };
                    this.updateManagerChangedStatusUnclearMessage(payload);
                }
                else{
                    Swal.fire('שגיאה', 'הביטויים הדינאמיים לא צוינו בהודעה בדיוק פעם אחת.', 'error')
                }
            },
            
            status_changed_continuous_click(){
                if ((this.status_changed_continuous_text_box.match(/{תקלה}/g) || []).length == 1 && (this.status_changed_continuous_text_box.match(/{שם}/g) || []).length == 1){
                    const payload = {
                                _id: JSON.parse(localStorage.getItem('taskManager'))._id,
                                changed_status_continuous_message: this.status_changed_continuous_text_box,
                    };
                    this.updateManagerChangedStatusContinuousMessage(payload);
                }
                else{
                    Swal.fire('שגיאה', 'הביטויים הדינאמיים לא צוינו בהודעה בדיוק פעם אחת.', 'error')
                }
            },
            
            deadline_passed_click(){
                if ((this.deadline_passed_text_box.match(/{תקלות}/g) || []).length == 1){
                    const payload = {
                                _id: JSON.parse(localStorage.getItem('taskManager'))._id,
                                deadline_passed_message: this.deadline_passed_text_box,
                    };
                    this.updateManagerDeadlinePassedMessage(payload);
                }
                else{
                    Swal.fire('שגיאה', 'הביטוי הדינאמי לא צוין בהודעה בדיוק פעם אחת.', 'error')
                }
            },
            saveNewPassword() {
                if (this.$refs.password.reportValidity()) {
                    if (this.newPassword === this.repeatPassword) {
                        const payload = {
                            _id: JSON.parse(localStorage.getItem('taskManager'))._id,
                            password: this.newPassword
                        }

                        this.updateManagerPassword(payload)
                        this.newPassword = null
                        this.repeatPassword = null
                    }else {
                        console.log('passwords do not match')
                        Swal.fire('שגיאה', 'הסיסמאות לא זהות!', 'error')
                  }
                }
            },
            saveEmailAndNumber(source) {
                if (source === 'email'){
                    if (this.$refs.emailForm.reportValidity()) {
                        const payload = {
                            _id: JSON.parse(localStorage.getItem('taskManager'))._id,
                            email: this.email,
                        }
                        
                        this.addManagerEmailAndPhoneNum(payload)
                        this.emails.push({'item': this.email})
                        
                        this.addEmailOrNum = false
                        this.addEmail = false
                        this.email = null
                    }
                    }else {
                    if (this.$refs.numForm.reportValidity()) {
                        const payload = {
                            _id: JSON.parse(localStorage.getItem('taskManager'))._id,
                            phoneNum: this.phoneNum
                        }
                        this.addManagerEmailAndPhoneNum(payload)
                        this.phoneNums.push({'item': this.phoneNum})
                        
                        this.addEmailOrNum = false
                        this.addEmail = false
                        this.phoneNum = null
                    }
                }
            },
            addEmailModal() {
                this.addEmailOrNum = true
                this.addEmail = true
            },
            editEmailOrNumModal(item, source) {
                this.editEmailDialog = true
                if (source === 'email') {
                    this.emailToEdit = item.item
                    this.editedEmail = item.item
                }else {
                    this.emailToEdit = null
                    this.numToEdit = item.item
                    this.editedNum = item.item
                }
            },
            editEmail(){
                if(this.emailToEdit !== this.editedEmail) {
                    Vue.set(this.emails, this.emails.findIndex(f => f.item === this.emailToEdit), {item: this.editedEmail})
                    const payload = {
                        id: JSON.parse(localStorage.getItem('taskManager'))._id,
                        email: {
                            emailToEdit: this.emailToEdit,
                            editedEmail: this.editedEmail
                        }
                    }
                    this.updateManagerEmailOrNum(payload)

                }
                this.emailToEdit = null
                this.editedEmail = null
                this.editEmailDialog = false
            },
            editNumber(){
                if(this.numToEdit !== this.editedNum) {
                    Vue.set(this.phoneNums, this.phoneNums.findIndex(f => f.item === this.numToEdit), {item: this.editedNum})
                    const payload = {
                        id: JSON.parse(localStorage.getItem('taskManager'))._id,
                        phoneNum: {
                            numToEdit: this.numToEdit,
                            editedNum: this.editedNum
                        }
                    }
                    this.updateManagerEmailOrNum(payload)
                }
                this.numToEdit = null
                this.editedNum = null
                this.editEmailDialog = false
            },
            deleteEmailOrNumModal(item,source) {
                let payload = {}
                if (source === 'email') {
                     payload = {
                        id: JSON.parse(localStorage.getItem('taskManager'))._id,
                        email: {
                            emailToDelete: item.item
                        }
                    }
                }else {
                     payload = {
                        id: JSON.parse(localStorage.getItem('taskManager'))._id,
                        phoneNum: {
                            numToDelete: item.item
                        }
                    }
                }
                this.deleteManagerEmailOrNum(payload)
                if (source === 'email') {
                    let emails = []
                     this.emails.map(email => { emails.push(email.item) })
                    emails.splice(emails.indexOf(item.item), 1)
                    emails = emails.map(item => ({ item }))
                    this.emails = emails
                } else {
                    let nums = []
                    this.phoneNums.map(num => { nums.push(num.item) })
                    nums.splice(nums.indexOf(item.item), 1)
                    nums = nums.map(item => ({ item }))
                    this.phoneNums = nums
                }
            }
        }
    }
</script>
