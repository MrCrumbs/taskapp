<template>
    <div class="mx-5 mt-3">

      <v-container class="mt-10">
        <v-row
                class="mb-6"
                justify="center"
        >
          <v-col lg="6">
            <v-card
                    class="pa-2"
                    tile
            >
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
              <v-card
                      class="pa-2"
                      tile
              >
                  <!--add email & phone num-->
                  <h2 class="text-center pt-3">הוספת כתובת מייל לעדכונים</h2>
                  <form ref="emailForm">
                      <v-row>
                          <!-- email-->
                          <v-col cols="12">
                              <v-text-field label="מייל" type="email" required="required" :value="email" v-model="email" outlined></v-text-field>
                              <v-btn color="teal" class="text-white" @click="saveEmailAndNumber('email')" block>שמור</v-btn>
                          </v-col>
                      </v-row>
                  </form>
              </v-card>
              <br/>
              <v-card
                      class="pa-2"
                      tile
              >
                  <!--add phone num-->
                  <h2 class="text-center pt-3">הוספת מספר טלפון לעדכונים</h2>
                  <form ref="numForm">
                      <v-row>
                          <!-- phone num-->
                          <v-col cols="12">
                              <v-text-field label="מספר טלפון" type="number" required="required" :value="phoneNum" v-model="phoneNum" outlined></v-text-field>
                              <v-btn color="teal" class="text-white" @click="saveEmailAndNumber('num')" block>שמור</v-btn>
                          </v-col>
                      </v-row>
                  </form>
              </v-card>
          </v-col>
        </v-row>
      </v-container>


    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import Swal from "sweetalert2";
    export default {
        name: "Settings",
        data() {
            return {
              value: false,
              newPassword: null,
              repeatPassword: null,
              email: null,
              phoneNum: null
            }
        },
        computed: {
            ...mapGetters(['getManager'])
        },
        methods: {
            ...mapActions(['updateManagerPassword','addManagerEmailAndPhoneNum']),
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
                    }
                    }else {
                    if (this.$refs.numForm.reportValidity()) {
                        const payload = {
                            _id: JSON.parse(localStorage.getItem('taskManager'))._id,
                            phoneNum: this.phoneNum
                        }
                        this.addManagerEmailAndPhoneNum(payload)
                    }
                }
                this.email = null
                this.phoneNum = null
            }
        }
    }
</script>
<style>
    .swal2-styled.swal2-confirm {
        background-color: #149E91
    }
</style>
