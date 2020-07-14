<template>
    <div class="login">
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
                        <h2 class="text-center pt-3">התחברות מנהל</h2>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="סיסמה" :type="value ? 'password' : 'text'" :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'" @click:append="() => (value = !value)" :value="password" v-model="password" outlined></v-text-field>
                                    <v-btn color="teal" class="text-white" @click="login" block>התחבר</v-btn>
                                </v-col>
                            </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            value: true,
            password: null
        }
    },
    methods: {
        login() {
            console.log(this.password)
            if(this.password && this.password == 'tasktracker123') {
                const payload = {
                    password: this.password
                }
                localStorage.setItem('taskManager', JSON.stringify(payload))
                this.$router.push({path: '/tasks'})
            }
            //
        }
    },

    created() {
        
        const loggedUser = JSON.parse(localStorage.getItem('taskManager'));
        if(loggedUser) {
            localStorage.removeItem('taskManager')
        }
    }
}
</script>