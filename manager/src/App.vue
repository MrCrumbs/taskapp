<template>
  <v-app>
    <v-content>
    <v-app-bar flat app dense v-if="$route.path != '/login'">
      <v-app-bar-nav-icon @click="darwer = !darwer"></v-app-bar-nav-icon>

      <v-toolbar-title><span class="ito">איתו</span><span class="ran">רן</span></v-toolbar-title>

    </v-app-bar>
      <v-navigation-drawer v-if="$route.path != '/login'" v-model="darwer" :right="true" app class="teal" dark>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            <span class="ito">איתו</span><span class="ran">רן</span>
          </v-list-item-title>
          <v-list-item-subtitle>
            חשבון מנהל
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          router 
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <router-view />
      <!-- <HelloWorld/> -->
    </v-content>
  </v-app>
</template>

<script>
import {mapActions} from 'vuex'
  export default {
    name: "App",
    data () {
      return {
        login: false,
        darwer: true,
          items: [
          { title: 'תקלות', icon: 'mdi-medical-bag', route: '/tasks' },
          { title: 'תלמידים', icon: 'mdi-account-group', route: '/students' },
          { title: 'מיקומים', icon: 'mdi-map-marker-multiple', route: '/locations' },
          { title: 'הגדרות', icon: 'mdi-cog', route: '/settings' },
          { title: 'דוח לפי מיקום', icon: 'mdi-map-marker', route: '/locationReport' },
          { title: 'פח תקלות', icon: 'mdi-trash-can', route: '/recycleBin' },
          { title: 'התנתק', icon: 'mdi-power', route: '/login' },
        ],
      }
    },
    computed: {
      bg () {
        return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
      },
    },
    methods: {
      ...mapActions(['fetchLocations', 'fetchStudents'])
    },
    created() {
      this.$vuetify.rtl = true
      this.fetchLocations()
      this.fetchStudents()
    }
  }
</script>

<style>
#app {
  background: #f9f9f9;
}
.back-red {
    color: red !important;
}
.v-data-footer__select#text {
  display: none !important;
}
.over-table th {
  font-size: 18px !important;
  font-weight: bold !important;
}
.over-table td {
  font-size: 16px !important;
  font-weight: bold !important;
}
.ant-pagination-item-active {
  border: 1px solid #489689 !important;
}
.ant-pagination-item-active a {
  color: #489689 !important;
}
.ant-table-pagination.ant-pagination {
  float: left !important;
}
.ant-pagination-item {
  margin-right: 5px !important;
  margin-left: 5px !important;
}
.text-white {
  color: #fff !important;
}
.ito {
  color: #003300 !important;
}
.ran {
  color: #663300 !important;
}
</style>
