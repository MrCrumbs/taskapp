<template>
    <div class="new-tasks">
        <v-row>
        <v-col cols="12">
          <v-data-table :headers="columns" :items="newTasks" class="elevation-1" :search="search" :footer-props="{'itemsPerPageText':'שורות לעמוד'}">
            <template v-slot:top>
              <v-text-field  v-model="search" label="חיפוש" append-icon="mdi-magnify" class="mx-4 mt-3"></v-text-field>
            </template>
            <template v-slot:item.urgency="{ item }">
              <v-chip :color="getColor(item.urgency)" dark small>{{item.urgency}}</v-chip>
            </template>
            <template v-slot:item.title="{ item }">
              <span :class="checkLate(item) ? 'back-red' : ''">{{item.title}}</span>
            </template>
            <template v-slot:item.full_name="{ item }">
              <span :class="checkLate(item) ? 'back-red' : ''">{{item.full_name}}</span>
            </template>
            <template v-slot:item.description="{ item }">
              <span :class="checkLate(item) ? 'back-red' : ''">{{item.description!="null" ? item.description : "(ללא)"}}</span>
            </template>
            <template v-slot:item.phone_number="{ item }">
              <span :class="checkLate(item) ? 'back-red' : ''">{{item.phone_number!="undefined" ? item.phone_number : "(ללא)"}}</span>
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
            <template v-slot:item.status="{ item }">
              <v-select v-model="item.status" v-on:change="updateTaskStatus($event,item)" :items="['חדש', 'לא ברור / לא נמצא', 'טיפול מתמשך', 'בוצע']" :key="'status_select_list'+item._id" chips></v-select>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="view(item)">mdi-eye</v-icon>
                <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
            </v-data-table>
        </v-col>
      </v-row>
    </div>
</template>

<script>
import moment from "moment";
export default {
    name: "New",
    props: {
        tasks: Array
    },
    computed: {
        newTasks() {
            let tasks = this.$props.tasks.filter(task => task.status == 'חדש' || task.status == 'טיפול מתמשך')
            //tasks.sort((a, b) => status[a.status] - status[b.status]);

            return tasks.sort((a,b) => { 
                let x = a.urgency;
                let xx = this.checkLate(a);
                let y = b.urgency;
                let yy = this.checkLate(b);
                
                if(xx && !yy)
                    return -1;
                else if(!xx && yy)
                    return 1;
                else{
                    if(x == "גבוהה")
                        x = 1;
                    else if(x == "בינונית")
                        x = 2;
                    else if(x == "נמוכה")
                        x = 3;
                    
                    if(y == "גבוהה")
                        y = 1;
                    else if(y == "בינונית")
                        y = 2;
                    else if(y == "נמוכה")
                        y = 3;
                    
                    return (x < y) ? -1 : ((x > y) ? 1 : 0);
                }
            });
        },
    },
    data() {
        return {
            search: null,
            allTasks: null,
            columns: [
                {
                    text: 'שם מלא',
                    value: 'full_name',
                    sortable: true
                },
                {
                    text: 'מיקום',
                    value: 'location',
                    sortable: true
                },
                {
                    text: 'כותרת תקלה',
                    value: 'title',
                    sortable: true
                },
                {
                    text: 'דחיפות',
                    value: 'urgency',
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
                    text: 'סטאטוס',
                    value: 'status',
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
        };
    },
    created() {
        if(this.$props.tasks) {
            //this.newTasks = this.$props.tasks.filter(task => task.status.toLowerCase() == 'new' || task.status.toLowerCase() == 'ongoing')
        }
    },
    methods: {
        updateTaskStatus(event, record){
            this.$emit('edit-task', {'record': record,'status': event});
        },
        checkLate(record) {
            let date_to_check = record.status == "טיפול מתמשך" ? record.modified_on : record.created_on;
            let splitDate = date_to_check.split('/');
            let mYear = splitDate[2];
            let mMonth = splitDate[1];
            let mDay = splitDate[0];
            let pastDate = mYear+'-'+mMonth+'-'+mDay;
            let modified_date = moment(pastDate);
            
            let date = new Date();
            let year = date.getFullYear();
            let month = this.addZ(date.getMonth()+1)
            let day = this.addZ(date.getDate())
            let dd = year+"-"+month+"-"+day;
            let current = moment(dd);
            let diff = moment.duration(current.diff(modified_date));
            let duration = diff.asDays();

            return duration >= 14;
        },
        addZ(n){return n<10? '0'+n:''+n;},
      view(record) {
        this.$router.push({path: '/task/'+record._id});
      },
      edit(record) {
        this.$emit('edit', record);
      },
      deleteItem(record) {
        this.$emit('delete', record);
      },
      getColor(urgency) {
          if(urgency == 'נמוכה')
              return 'teal';
          if(urgency == 'בינונית')
              return 'orange';
          if(urgency == 'גבוהה')
              return 'pink';
      }
    }
};
</script>

<style>
.v-select__selections input { 
  display: none;
}
.select {
    min-width: 100px;
}
</style>
