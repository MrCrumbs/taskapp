<template>
  <v-app>
    <v-app-bar
      app
      color="teal"
      dark
    >
      <div class="d-flex align-center">
        <h2><span class="ito">איתו</span><span class="ran">רן</span> רכבים</h2>

        
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <Home />
    </v-content>
  </v-app>
</template>

<script>
import Home from './views/Home';
import {mapActions, mapGetters} from 'vuex'
export default {
  name: 'App',

  components: {
    Home,
  },
   methods: {
    ...mapActions(['fetchLocations', 'fetchStudents']),
  },

  created() {
    this.$vuetify.rtl = true
    this.fetchStudents()
    this.fetchLocations()
  },
};
</script>
<style>
.ito {
  color: #003300 !important;
}
.ran {
  color: #663300 !important;
}
</style>
