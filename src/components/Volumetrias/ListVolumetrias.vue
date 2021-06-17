<template>
  <v-container>
    <div>
      <Drawer />
      <AppBar />
    </div>
    <v-card>
      <EditVolumetria />
      <NewMonth api="api/list_volumetrias_new_month" RenderListComponent="VOL"/>
      <v-card-title>
        Eficiencia en la solución
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
          @click="NewMonth()"
          style="margin-right:20px"
        >
          Nuevo Mes
        </v-btn>
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
  import EditVolumetria from '@/components/Volumetrias/EditVolumetria'
  import NewMonth from '@/components/NewMonth.vue'
  import swal from 'sweetalert'
  import http from '@/plugins/axios'
  import { mapState } from 'vuex'

  export default {
    name: 'Volumetrias',
    components: {
      AppBar,
      Drawer,
      EditVolumetria,
      NewMonth,
    },
    data: () => ({
      search: null,
      headers: [
        { "text": 'ID', "value":'id'},
        { "text": "Periodo", "value": "periodo.periodo" },
        { "text": "Pais", "value": "pais"},
        { "text": "Proyecto", "value": "proyecto.proyecto"},
        { "text": "Servicio", "value": "servicio" },
        { "text": "Tipo", "value": "tipo"},
        { "text": "Registrados", "value": "registrados" },
        { "text": 'Cerrados', "value": 'cerrados'},
        { "text": 'Backlog', "value": 'backlog'},
        { "text": 'Backlog y registrados', "value": 'backlog_y_registrados'},
        { "text": 'Eficiencia', "value": 'eficiencia'},
        { "text": 'Actions', "value": 'actions', "sortable": false },
      ],
      newItem: {
        periodo: '',
        pais: '',
        proyecto: '',
        servicio: '',
        tipo: '',
        registrados: '',
        cerrados: '',
        backlog: '',
        backlog_y_registrados: '',
        eficiencia: ''
      }
    }),
    created() {
      this.$store.dispatch("setLoad");
      this.$store.dispatch("loadDataVolumetrias")
    },
    computed: {
      getdata() {
        return this.$store.getters.getDataVolumetrias
      },
      ...mapState(['permisos', 'loading'])
    },
    methods: {
      NewMonth() {
        this.$store.commit('updateShowNewMonth')
      },
      editItem(item, title) {
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
            http.delete(`api/volumetrias/${item.id}`)
            .then(() => {
              this.$store.commit("deleteItemVolumetrias", item)
              swal("Eliminado correctamente!", {
                  icon: "success",
              });
            })
            .catch(() => {
              swal("Error Interno", "Favor contactar con el administrador", "error");
            });
          }
        });
      }
    }
  }
</script>

<style>

</style>