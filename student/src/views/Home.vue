<template>
  <div class="home">
    <v-container>
      <v-row justify="center" class="mt-5">
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
        <v-col cols="12" md="6" sm="6">
          <v-card>
            <h2 class="py-3 text-center">הוסף תקלה חדשה</h2>
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
                  <v-text-field label="תיאור התקלה בקצרה*" :rules="required" outlined v-model="task.title" clearable required></v-text-field>
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
                  <v-textarea outlined label="פירוט, באם יש צורך" v-model="task.description" clearable></v-textarea>
                  <v-btn color="teal" dark block @click="addTask" :disabled="isPressed">{{btnText}}</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
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
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import {mapActions, mapGetters} from 'vuex'
import axios from 'axios'
import Swal from "sweetalert2";
export default {
  name: 'Home',
  components: {
    //HelloWorld
  },
  data() {
    return {
      added: false,
      isPressed: false,
      color: null,
      msg: null,
      pickedLocation: null,
      load: false,
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
        modified_on: null
      },
      btnText: "הוסף תקלה",
      required: [
        v => !!v || 'נדרש'
      ],
    }
  },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setLoader') {
        this.load = this.$store.getters.getLoader
      }
    });
  },
  computed: {
    ...mapGetters(['getLocations', 'getStudents', 'getTaskCreated']),
    locations() {
      let locs = []
      if(this.getLocations) {
          this.getLocations.forEach(element => {
          let name = element.name
          locs.push(name)
        });
        locs.push("אחר")
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
    }
  },

  methods: {
    ...mapActions(['createTask']),
    setPhoneNumber(v) {
        if(v) {
          this.task.phone_number = v.phone
          this.task.full_name = v.name
        }
      },
    checkLocation(e) {
        if(e !== 'Other') {
          this.task.location = e
        }
      },
      addZ(n){return n<10? '0'+n:''+n;},
    addTask() {
      if(this.task.title == null || this.task.title == '' || this.task.urgency == null || this.task.urgency == '' || this.task.location == null || this.task.location == '' || this.task.full_name == null || this.task.full_name == '')
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
      this.btnText = "נא המתן"
      console.log(this.task)
      this.isPressed = true
      this.createTask(this.task);
      // Swal.fire({title: "...שומר תקלה", text: "נא המתן", showConfirmButton: false})
    },
  },

  watch: {
    getTaskCreated(val) {
      if(val && val == 'success') {
        // Swal.close()
        this.msg = 'התקלה הוספה בהצלחה'
        this.color = 'success'
        this.added = true
        this.isPressed = false
        this.btnText = "הוסף תקלה"
        this.task.title = null
        this.task.urgency = null
        this.task.location = null
        this.task.full_name = null
        this.task.description = null
        this.task.image = null
        this.task.phone_number = null
        this.pickedLocation = null
        this.$refs.form.resetValidation()
        this.$refs.form.reset()
      }
      if(val && val != 'success') {
        // Swal.close()
        this.msg = 'אירעה שגיאה'
        this.color = 'error'
        this.added = true
        this.isPressed = false
        this.btnText = "הוסף תקלה"
      }
    }
  },
  beforeDestroy() {
    this.unsubscribe();
  },
}
</script>
