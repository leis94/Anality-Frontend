<template>
    <v-app-bar
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click="setDrawer(!drawer)"></v-app-bar-nav-icon>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">ITS Analitica    </span>
        <v-avatar size="36">
          <img src="@/assets/rsz_logo-color.png"  alt="Its Logo">
        </v-avatar>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon title="Home" to="/app/">
        <v-icon >mdi-apps</v-icon>
      </v-btn>
      <v-btn title="Ayuda" icon @click="help">
        <v-icon >mdi-help</v-icon>
      </v-btn>
      <v-menu
        bottom
        left
        offset-y
        origin="top right"
        transition="scale-transition"
      >
        <template v-slot:activator="{on}"> 
            <v-btn icon v-on="on">
                <v-icon>
                    mdi-account
                </v-icon>
            </v-btn>
        </template>
        <v-list dense name>
          <v-list-item color="primary" @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <v-btn text @click="logout">Logout</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AppBar',
  computed: {
    ...mapState(['drawer']),
  },
  methods: {
    logout(){
      this.$router.push({name: 'Logout'})
    },
    help(){
      const a = document.createElement("a");
      a.target = "_blank"
      a.style.display = "none";
      document.body.appendChild(a);
      a.href = "https://drive.google.com/file/d/1v2AjWM1fBDwe4BIUwsicTgjMyNqqxXCU/view?usp=sharing"
      a.click()
    },
    ...mapMutations({
      setDrawer: 'setDrawer',
    }),
  },
}
</script>