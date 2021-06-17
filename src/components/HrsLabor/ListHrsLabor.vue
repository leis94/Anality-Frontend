<template>
  <v-container>
    <div>
      <Drawer />
      <AppBar />
    </div>
    <v-card>
      <EditHrsLabor />
      <NewMonth api="api/list_hrs_labor_new_month" RenderListComponent="HRS" />
      <!-- <NewMonthHrsLabor /> -->
      <v-card-title>
        Capacidad y demanda
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
        :loading="loading"
        loading-text="Cargando Data, Favor esperar."
      >
        <template v-slot:[`item.uso`]="{ item }">
          % {{ item.uso }}
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
  import EditHrsLabor from '@/components/HrsLabor/EditHrsLabor'
  import NewMonth from '@/components/NewMonth.vue'
  import swal from 'sweetalert'
  import http from '@/plugins/axios'
  import { mapState } from 'vuex'

  export default {
    name: 'HrsLabor',
    components: {
      AppBar,
      Drawer,
      EditHrsLabor,
      NewMonth
    },
    data: () => ({
      search: null,
      headers: [
        { "text": 'ID', "value":'id'},
        { "text": "Periodo", "value": "periodo.periodo" },
        { "text": "Pais", "value": "pais"},
        { "text": "Proyecto", "value": "proyecto.proyecto"},
        { "text": "Servicio", "value": "servicio" },
        { "text": "Linea Base Hrs", "value": "linea_base_horas"},
        { "text": "Horas ejecutadas", "value": "horas_ejecutadas" },
        { "text": '% Uso', "value": 'uso'},
        { "text": 'Actions', "value": 'actions', "sortable": false },
      ],
      newItem: {
        periodo: '',
        pais: '',
        proyecto: '',
        servicio: '',
        linea_base_horas: '',
        horas_ejecutadas: '',
        uso: '',
      },
    }),
    created() {
      this.$store.dispatch("setLoad");
      this.$store.dispatch("loadDataHrsLabor")
    },
    computed: {
      getdata() {
        return this.$store.getters.getDataHrsLabor
      },
      ...mapState(['permisos', 'loading']),
    },
    methods: {
      editItem(item, title) {
        this.$store.commit('setFormTitle', title)
        this.$store.commit('setEditItemIndex', this.getdata.indexOf(item))
        this.$store.commit('updateEditItem', item)
        this.$store.commit('updateShowEdit')
      },
      NewMonth() {
        this.$store.commit('updateShowNewMonth')
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
            http.delete(`api/hrs_labor/${item.id}`)
            .then(() => {
              this.$store.commit("deleteItemHrsLabor", item)
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