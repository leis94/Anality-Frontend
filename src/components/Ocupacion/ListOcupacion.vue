<template>
  <v-container>
    <div>
      <Drawer />
      <AppBar />
    </div>
    <v-card>
      <EditOcupacion />
      <v-card-title>
        Ocupación PMO y BackOffice
        <div class="flex-grow-1"></div>
        <v-text-field
          label="Buscar"
          single-line
          hide-details
          v-model="search"
          append-icon="mdi-magnify"
        ></v-text-field>
        <v-spacer v-if="permisos === 'rw'"></v-spacer>
        <v-btn v-if="permisos === 'rw'"
          color="primary"
          dark
          class="mb-2"
          @click="editItem(newItem, 'Nueva')"
        >
          Nuevo
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="getdata"
        :search="search"
        dense
        :loading="loading"
        loading-text="Cargando Data, Favor esperar."
      >
        <template v-slot:[`item.dedicacion`]="{ item }">
          % {{ item.dedicacion }}
        </template>
        <template v-slot:[`item.actions`]="{ item }" v-if="permisos === 'rw'">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item, 'Editar')"
          >
             mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template> 
      </v-data-table>
    </v-card>
    
  </v-container>
</template>

<script>
import AppBar from '@/components/AppBar.vue'
import Drawer from '@/components/Drawer.vue'
import EditOcupacion from '@/components/Ocupacion/EditOcupacion'
import swal from 'sweetalert'
import http from '@/plugins/axios'
import { mapState } from 'vuex'

export default {
  name: 'Ocupacion',
  components: {
      AppBar,
      Drawer,
      EditOcupacion
  },
  data: () => ({
      search: null,
      headers: [
        { "text": 'ID', "value":'id'},
        { "text": "Periodo", "value": "periodo.periodo" },
        { "text": "Pais", "value": "pais"},
        // { "text": "PJ", "value": "pj.pj_pais"},
        { "text": "Proyecto", "value": "proyecto.proyecto"},
        { "text": "Nombre_Apellido", "value": "pm" },
        // { "text": "Cliente", "value": "cliente"},
        { "text": '% Dedicación', "value": 'dedicacion'},
        { "text": 'Observaciones', "value": 'observaciones'},
        { "text": 'Actions', "value": 'actions', "sortable": false },
      ],
      newItem: {
        periodo: '',
        pais: '',
        pj: '',
        proyecto: '',
        pm: '',
        cliente: '',
        dedicacion: '',
        observaciones: '' 
      }
    }),
  created() {
    this.$store.dispatch("setLoad");
    this.$store.dispatch("loadDataOcupacion")
    this.$store.dispatch("loadDataUsersOcupacion")
  },
  computed: {
    getdata() {
      return this.$store.getters.getDataOcupacion
    },
    ...mapState(['permisos', 'loading'])
  },
  methods: {
    editItem(item, title) {
      item.user = {"nombre": "Robinson Giraldo Naranjo", "email": "rgiraldo@itsinfocom.com"}
      this.$store.commit('setFormTitle', title)
      this.$store.commit('setEditItemIndex', this.getdata.indexOf(item))
      this.$store.commit('updateEditItem', item)
      this.$store.commit('updateShowEdit')
    },
    deleteItem(item) {
      swal({
        title: "Esta seguro?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          http.delete(`api/ocupacion/${item.id}`)
          .then(() => {
            this.$store.commit("deleteItemOcupacion", item)
            swal("Eliminado correctamente!", {
              icon: "success",
            });
          })
          .catch(() => {
            swal("Error Interno", "Favor contactar con el administrador", "error");
          });
        }
      })
    }
  }
}
</script>

<style>

</style>