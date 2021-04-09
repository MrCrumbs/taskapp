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
          <h2 class="">מיקומים</h2>
        </v-col>
        <v-col>
          <v-btn class="float-left" outlined color="teal" @click="dialog = !dialog"><i class="fa fa-plus ml-2"></i> הוסף מיקום</v-btn>
          
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-if="locations">
            <v-data-table
                :headers="columns"
                :items="filtered_locations"
                class="elevation-1"
                :search="search"
                :footer-props="{
                  'itemsPerPageText':'שורות לעמוד',
                  'itemsPerPageOptions': [-1, 10, 15, 50]
                }"
                :items-per-page="-1"
            >
            <template v-slot:top>
              <v-text-field  v-model="search" label="חיפוש" append-icon="mdi-magnify" class="mx-4 mt-3"></v-text-field>
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
                    <v-btn outlined color="red" @click="deleteLocation(record)" small> Delete</v-btn>
                </span>
            </a-table> -->
        </v-col>
      </v-row>

      <!-- ADD TASK -->

      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">הוסף מיקום</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form">
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field label="מיקום*" v-model="location.name" :rules="required" outlined clearable required></v-text-field>
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


  <!-- Edit TASK -->

      <v-row justify="center">
        <v-dialog v-model="editDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">ערוך מיקום</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form>
                  <v-row v-if="locationToEdit">
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field label="מיקום*" v-model="locationToEdit.name" :rules="required" outlined clearable required></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal" text @click="editDialog = !editDialog">ביטול</v-btn>
              <v-btn color="teal" text @click="editLocation">אישור</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-dialog v-model="deleteModal" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">מחיקת מיקום</span>
            </v-card-title>
            <v-card-text>
              <v-container>
               <v-row v-if="locationToDelete">
                 <v-col cols="12" class="text-center">
                   <h4>האם הנך בטוח שברצונך למחוק את המיקום {{locationToDelete.name}} </h4>
                 </v-col>
                 
               </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="teal" text @click="deleteModal = !deleteModal">לא, ביטול</v-btn>
              <v-btn color="teal" text @click="removeLocation">כן, מחק</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </v-row>
        
    </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  export default {
    name: "Locations",
    data() {
        return {
            locationToDelete: null,
            locationToEdit: null,
            deleteModal: false,
            locations: null,
            filtered_locations: null,
            isPressed:false,
            color: null,
            msg: null,
            added: false,
            location: {
              name: null,
              created_on: null,
              location_type: null
            },
            required: [
              v => !!v || 'נדרש'
            ],
            search: null,
            dialog: false,
            editDialog: false,
            visible: false,
            columns: [
                {
                    text: 'מיקום',
                    value: 'name',
                    sortable: true
                    // sorter: (a, b) => a.location.length - b.location.length,
                    // sortDirections: ['descend', 'ascend'],
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
      ...mapGetters(['getLocations', 'getLocationCreated', 'getLocationDeleted', 'getLocationUpdated']),
      pageTxt(){
        return this.$vuetify.dataFooter.pageText
      }
    },

    methods: {
      ...mapActions(['createLocation', 'fetchLocations', 'deleteLocation', 'updateLocation']),
      view(record) {

      },
      save() {
        if(this.location.name == null || this.location.name == '')
          return;
        this.isPressed = true;
        this.location.location_type = "general";
        this.createLocation(this.location);
      },
      edit(record) {
        this.editDialog = true
        this.locationToEdit = record
      },
      editLocation(){
        if(this.locationToEdit.name == null || this.locationToEdit.name == '')
          return;
        const payload = {
          id: this.locationToEdit._id,
          data: {
            name: this.locationToEdit.name,
            location_type: "general"
          }
        }
        this.updateLocation(payload)
      },
      deleteItem(record) {
        this.deleteModal = true
        this.locationToDelete = record
      },
      removeLocation(){
        const payload = {
          id: this.locationToDelete._id
        }
        this.deleteLocation(payload)
      }
    },

    created(){
        this.locations = this.getLocations;
        if(this.locations)
            this.filtered_locations = this.locations.filter(location => location.location_type == "general");
    },
    watch: {
      getLocations(val) {
        if(val) {
          this.locations = val;
          this.filtered_locations = this.locations.filter(location => location.location_type == "general");
        }
      },
      getLocationCreated(val) {
        if(val && val == 'success') {
          this.added = true
          this.color = 'success'
          this.msg = 'המיקום הוסף בהצלחה'
          this.dialog = false
          this.location.name = null
          this.isPressed = false
          this.$refs.form.reset()
          this.fetchLocations()
        }
        if(val && val != 'success') {
          this.added = true
          this.color = 'error'
          this.msg = 'אירעה שגיאה'
        }
      },
      getLocationDeleted(val) {
        if(val && val == 'success') {
          this.added = true
          this.color = 'success'
          this.msg = 'המיקום נמחק בהצלחה.'
          this.deleteModal = false
          this.fetchLocations()
        }
        if(val && val != 'success') {
          this.added = true
          this.color = 'error'
          this.msg = 'אירעה שגיאה'
        }
      },
      getLocationUpdated(val) {
        if(val && val == 'success') {
          this.added = true
          this.color = 'success'
          this.msg = 'המיקום עודכן בהצלחה.'
          this.editDialog = false
          this.locationToEdit = null
          this.fetchLocations()
        }
        if(val && val != 'success') {
          this.added = true
          this.color = 'error'
          this.msg = 'אירעה שגיאה'
        }
      }
    }
  }
 </script>
