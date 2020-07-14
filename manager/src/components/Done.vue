<template>
    <div class="task-done">
        <v-row>
        <v-col cols="12">
          <v-data-table
                :headers="columns"
                :items="newTasks"
                class="elevation-1"
                :search="search"
                :footer-props="{
                  'itemsPerPageText':'שורות לעמוד'
                }"
            >
            <template v-slot:top>
              <v-text-field  v-model="search" label="חיפוש" append-icon="mdi-magnify" class="mx-4 mt-3"></v-text-field>
            </template>
            <template v-slot:item.urgency="{ item }">
              <v-chip :color="getColor(item.urgency)" dark small>{{item.urgency}}</v-chip>
            </template>
            <template v-slot:item.title="{ item }">
              <span :class="checkLate(item) ? 'back-red' : ''">{{item.title}}</span>
            </template>
            <template v-slot:item.location="{ item }">
              <span :class="checkLate(item) ? 'back-red' : ''">{{item.location}}</span>
            </template>
             <template v-slot:item.created_on="{ item }">
              <span :class="checkLate(item) ? 'back-red' : ''">{{item.created_on}}</span>
            </template>
            <template v-slot:item.modified_on="{ item }">
              <span :class="checkLate(item) ? 'back-red' : ''">{{item.modified_on}}</span>
            </template>
            <!-- <template v-slot:item.status="{ item }">
              <v-chip color="success" dark small>{{item.status}}</v-chip>
            </template> -->
                <template v-slot:item.actions="{ item }">
                    <v-icon
                        small
                        class="mr-2"
                        @click="view(item)"
                    >
                        mdi-eye
                    </v-icon>
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
        </v-col>
      </v-row>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    name: "Done",
    props: {
        tasks: Array
    },
    computed: {
        newTasks() {
            let tasks = this.$props.tasks.filter(task => task.status == 'בוצע')
            return tasks.sort((a,b) => { 
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

                // if(x == "High") {
                //     x = 1
                // }
                // if(x == "Medium") {
                //     x = 2
                // }
                // if(x == "Low") {
                //     x = 3
                // }

                // if(y == "High") {
                //     y = 1
                // }
                // if(y == "Medium") {
                //     y = 2
                // }
                // if(y == "Low") {
                //     y = 3
                // }

                return (x < y) ? -1 : ((x > y) ? 1 : 0)

            })
        }
    },
    data() {
        return {
            search: null,
            columns: [
                {
                    text: 'כותרת תקלה',
                    value: 'title',
                    sortable: true
                },
                {
                    text: 'מיקום',
                    value: 'location',
                    sortable: true
                },
                {
                    text: 'ת. יצירה',
                    value: 'created_on',
                    sortable: true
                },
                {
                    text: 'ת. עריכה',
                    value: 'modified_on',
                    sortable: true
                },
                {
                    text: 'דחיפות',
                    value: 'urgency',
                    sortable: true
                },
                // {
                //     text: 'סטאטוס',
                //     value: 'status',
                //     sortable: true
                // },
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
                {
                    text: 'מספר טלפון',
                    value: 'phone_number',
                    sortable: true
                },
                {
                    text: 'פעולות',
                    value: 'actions',
                    sortable: false
                },
            ],
        }
    },
    created() {
        if(this.$props.tasks) {
            //this.newTasks = this.$props.tasks.filter(task => task.status.toLowerCase() == 'task unclear')
        }
    },
    methods: {
        checkLate(record) {
            let splitDate = record.modified_on.split('/')
            let mYear = splitDate[2]
            let mMonth = splitDate[1]
            let mDay = splitDate[0]
            let pastDate = mYear+'-'+mMonth+'-'+mDay
            let modified_date = moment(pastDate)
            
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth()+1
            let day = date.getDate()
            let dd = year+"-"+month+"-"+day
            let current = moment(dd)
            let diff = moment.duration(current.diff(modified_date))
            let duration = diff.asDays()

            if(duration > 14) {
                return false
            }
            return false
        },
      view(record) {
        this.$router.push({path: '/task/'+record._id})
      },
      edit(record) {
        this.$emit('edit', record)
      },
      deleteItem(record) {
          this.$emit('delete', record)
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
    }
}
</script>