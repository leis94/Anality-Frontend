<template>
  <v-container>
    <div>
      <Drawer />
      <AppBar />
    </div>
    <v-card>
      <EditAns />
      <NewMonth api="api/list_ans_new_month" RenderListComponent="ANS" />
      <v-card-title>
        Cumplimiento indicadores
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
        dense
      >
        <template v-slot:[`item.nso`]="{ item }">
          % {{ item.nso }}
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
  import EditAns from '@/components/Ans/EditAns'
  import NewMonth from '@/components/NewMonth.vue'
  import swal from 'sweetalert'
  import http from '@/plugins/axios'
  import { mapState } from 'vuex'

  export default {
    name: 'Ans',
    components: {
      AppBar,
      Drawer,
      EditAns,
      NewMonth,
    },
    data: () => ({
      search: null,
      headers: [
        { "text": 'ID', "value":'id'},
        { "text": "Periodo", "value": "periodo.periodo" },
        { "text": "Pais", "value": "pais"},
        { "text": "Proyecto", "value": "proyecto.proyecto"},
        { "text": "Tipo Formato", "value": "tipo_formato"},
        { "text": "Servicio", "value": "servicio" },
        { "text": 'NSO', "value": 'nso'},
        { "text": 'NSO Dec', "value": 'nso_dec'},
        { "text": 'Ind Txt', "value": 'ind_txt'},
        { "text": 'Obtenido', "value": 'obtenido'},
        { "text": 'Observaciones', "value": 'observaciones'},
        { "text": 'Cump. Gral', "value": 'cumplimiento_general'},
        { "text": 'Actions', "value": 'actions', "sortable": false },
      ],
      newItem: {
        periodo: '',
        pais: '',
        proyecto: '',
        tipo_formato: '',
        servicio: '',
        indicadores_servicio: '',
        nso: '',
        nso_dec: '',
        ind_txt: '',
        obtenido: '',
        observaciones: '',
        cumplimiento_general: '',
      }
    }),
    created() {
      this.$store.dispatch("setLoad");
      this.$store.dispatch("loadDataAns");
    },
    computed: {
      getdata() {
        return this.$store.getters.getDataAns
      },
      ...mapState(['permisos', 'loading']),
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
            //   this.$store.commit("deleteItemAns", item)
            http.delete(`api/ans/${item.id}`)
            .then(() => {
              this.$store.commit("deleteItemAns", item)
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