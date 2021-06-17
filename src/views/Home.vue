<template>
  <v-container>
    <div>
      <Drawer />
      <AppBar />
    </div>
    <v-card class="mx-auto" max-width="600">
      <v-img src="@/assets/logo-color.png"  alt="Its Logo" height="300" class="justify-center"></v-img>

    <v-card-title class="justify-center">
      Bienvenido {{ username }}
    </v-card-title>
    <v-card-text>
      <div class="text--primary justify-center">
        En este nuevo portal podrás Crear, Editar y Eliminar.
      </div>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn text color="success accent-4" to="/app/ans"
        v-if="formularios.findIndex(el => el === 'Ans') != -1 || formularios.findIndex(el => el == 'TODOS') != -1">
          Cumplimiento indicadores
      </v-btn>
      <v-btn text color="success accent-4" to="/app/volumetrias"
        v-if="formularios.findIndex(el => el === 'Volumetrias') != -1 || formularios.findIndex(el => el == 'TODOS') != -1">
          Eficiencia en la solución
      </v-btn>
    </v-card-actions>
    <v-card-actions class="justify-center">
      <v-btn text color="success accent-4" to="/app/horas_labor"
        v-if="formularios.findIndex(el => el === 'HrsLabor') != -1 || formularios.findIndex(el => el == 'TODOS') != -1">
          Capacidad y demanda
      </v-btn>
      <v-btn text color="success accent-4" to="/app/ocupacion"
        v-if="formularios.findIndex(el => el === 'Ocupacion') != -1 || formularios.findIndex(el => el == 'TODOS') != -1">
          Ocupación PMO y BackOffice
      </v-btn>
      <v-btn text color="success accent-4" to="/app/multas"
        v-if="formularios.findIndex(el => el === 'Multas') != -1 || formularios.findIndex(el => el == 'TODOS') != -1">
          Facturación
      </v-btn>
    </v-card-actions>
  </v-card>
     
  </v-container>
</template>

<script>
import AppBar from '@/components/AppBar.vue'
import Drawer from '@/components/Drawer.vue'
import { mapState } from 'vuex'
export default {
  name: 'Home',
  components: {
    AppBar,
    Drawer,
  },
  created(){
    
  },
  computed: {
    ...mapState(['username']),
    formularios() {
      let formularios = this.$store.getters.getFormularios;
      if(typeof(formularios) === "string"){
        formularios = formularios.split(",")
      }
      return formularios
    },
  }
}
</script>
