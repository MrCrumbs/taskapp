<template>
    <div class="task-details">
        <v-container>
            <v-row justify="center">
                <v-col cols="12" sm="12" md="12">
                    <v-card>
                        <h2 class="py-3 pr-3">Task Details</h2>
                        <v-row class="mx-5" v-if="task">
                            <v-col cols="12 text-center" v-if="task.image">
                                <v-img :src="getImage(task.image)" width="100" aspect-ratio="1"></v-img>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <h3>שם מלא</h3>
                                <p>{{task.full_name}}</p>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <h3>מיקום</h3>
                                <p>{{task.location}}</p>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <h3>כותרת תקלה</h3>
                                <p>{{task.title}}</p>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <h3>דחיפות</h3>
                                <v-chip :color="getColor(task.urgency)" dark small>{{task.urgency}}</v-chip>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <h3>סטאטוס</h3>
                                <v-chip :color="getStatusColor(task.status)" dark small>{{task.status}}</v-chip>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <h3>מספר טלפון</h3>
                                <p>{{task.phone_number}}</p>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <h3>ת. יצירה</h3>
                                <p>{{task.created_on}}</p>
                            </v-col>
                            <v-col cols="6" sm="4" md="3">
                                <h3>ת. עריכה</h3>
                                <p>{{task.modified_on}}</p>
                            </v-col>
                            <v-col cols="12">
                                <h3>תיאור</h3>
                                <p>{{task.description}}</p>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: "TaskDetails",
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters(['getTasks']),
        task() {
            let taskFound = null
            if(this.getTasks) {
                let tasks = this.getTasks
                let id = this.$route.params.id
                taskFound = tasks.find(t => t._id == id)
            }
            
            return taskFound
        }
    },
    methods:{
        taskDetails() {
            
        },
        getImage(image) {
            return image.split('"')[1]
        },
        getStatusColor(status) {
            if(status == 'חדש') {
                return 'purple'
            }
            if(status == 'טיפול מתמשך') {
                return 'orange'
            }
            if(status == 'התקלה לא ברורה') {
                return 'info'
            }
            if(status == 'התקלה לא נמצאה') {
                return 'brown'
            }
            if(status == 'בוצע') {
                return 'success'
            }
        },
        getColor(urgency) {
          if(urgency == 'נמוכה') {
              return 'teal'
          }
          if(urgency == 'בינונית') {
              return 'pink darken-2'
          }
          if(urgency == 'גבוהה') {
              return 'pink'
          }
      }
    },
    created() {
        if(this.$route.params.id) {
            this.taskDetails()
        }
    },
    watch: {
        getTasks(val) {
            if(val) {
                this.taskDetails()
            }
        }
    }
}
</script>
