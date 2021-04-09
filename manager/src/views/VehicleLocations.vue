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
                <h2 class="">רכבים</h2>
            </v-col>
            <v-col>
                <v-btn class="float-left" outlined color="teal" @click="dialog = !dialog"><i class="fa fa-plus ml-2"></i>הוסף רכב</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" v-if="locations">
                <v-data-table :headers="columns" :items="filtered_locations" class="elevation-1" :search="search" 
                  :footer-props="{'itemsPerPageText':'שורות לעמוד', 'itemsPerPageOptions': [-1, 10, 15, 50]}" :items-per-page="-1">
                    <template v-slot:top>
                        <v-text-field v-model="search" label="חיפוש" append-icon="mdi-magnify" class="mx-4 mt-3"></v-text-field>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
                        <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-- ADD TASK -->
        <v-row justify="center">
            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                        <span class="headline">הוסף רכב</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form">
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="רכב*" v-model="location.name" :rules="required" outlined clearable required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-container>
                        <small>*שדות חובה</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="teal" text @click="cancel_edit">ביטול</v-btn>
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
                        <span class="headline">ערוך רכב</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form>
                                <v-row v-if="originalRecordID">
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="רכב*" v-model="locationToEdit.name" :rules="required" outlined clearable required></v-text-field>
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
                        <span class="headline">מחיקת רכב</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row v-if="locationToDelete">
                                <v-col cols="12" class="text-center">
                                    <h4>האם הנך בטוח שברצונך למחוק את הרכב {{locationToDelete.name}}?</h4>
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
    name: "VehicleLocations",
    data() {
        return {
            locationToDelete: null,
            locationToEdit: null,
            originalRecordID: null,
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
                    text: 'רכב',
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
      cancel_edit(){
          this.dialog = !this.dialog;
      },
      save() {
        if(this.location.name == null || this.location.name == '')
          return;
        this.isPressed = true;
        this.location.location_type = "vehicle";
        this.createLocation(this.location);
      },
      edit(record) {
        this.editDialog = true
        this.originalRecordID = record._id;
        this.locationToEdit = {name: record.name};
      },
      editLocation(){
        if(this.locationToEdit.name == null || this.locationToEdit.name == '')
          return;
        const payload = {
          id: this.originalRecordID,
          data: {
            name: this.locationToEdit.name,
            location_type: "vehicle"
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
            this.filtered_locations = this.locations.filter(location => location.location_type == "vehicle");
    },
    watch: {
      getLocations(val) {
        if(val) {
          this.locations = val;
          this.filtered_locations = this.locations.filter(location => location.location_type == "vehicle");
        }
      },
      getLocationCreated(val) {
        if(val && val == 'success') {
          this.added = true
          this.color = 'success'
          this.msg = 'הרכב  הוסף בהצלחה'
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
          this.msg = 'הרכב  נמחק בהצלחה'
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
          this.msg = 'הרכב  עודכן בהצלחה'
          this.editDialog = false
          this.locationToEdit = null
          this.originalRecordID = null
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
