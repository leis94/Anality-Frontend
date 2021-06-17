<template>
  <v-navigation-drawer v-model="Drawer" app>
    <v-list nav dense>
      <v-list-item-group color="indigo">
        <v-list-item link to="/app/ans" 
          v-if="formularios.findIndex(el => el === 'Ans') != -1 || formularios.findIndex(el => el == 'TODOS') != -1">
          <v-list-item-action>
            <v-icon>mdi-clipboard-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Cumplimiento indicadores
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/app/volumetrias" 
          v-if="formularios.findIndex(el => el === 'Volumetrias') != -1 || formularios.findIndex(el => el == 'TODOS') != -1">
          <v-list-item-action>
            <v-icon>mdi-clipboard-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Eficiencia en la solución
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/app/horas_labor" 
          v-if="formularios.findIndex(el => el === 'HrsLabor') != -1 || formularios.findIndex(el => el == 'TODOS') != -1">
          <v-list-item-action>
            <v-icon>mdi-clipboard-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Capacidad y demanda
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/app/ocupacion" 
          v-if="formularios.findIndex(el => el === 'Ocupacion') != -1 || formularios.findIndex(el => el == 'TODOS') != -1">
          <v-list-item-action>
            <v-icon>mdi-clipboard-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Ocupación PMO y BackOffice
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/app/multas" 
          v-if="formularios.findIndex(el => el === 'Multas') != -1 || formularios.findIndex(el => el == 'TODOS') != -1">
          <v-list-item-action>
            <v-icon>mdi-clipboard-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Facturación
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    computed: {
      formularios() {
        let formularios = localStorage.getItem('formularios')
        if(typeof(formularios) === "string"){
          formularios = formularios.split(",")
        }
        return formularios
      },
      Drawer: {
        get () {
          return this.$store.getters.getDrawer
        },
        set (val) {
          this.$store.commit('setDrawer', val)
        },
      },
    },
  }
</script>