<template>
  <v-container>
    <div>
      <Drawer />
      <AppBar />
    </div>
    <v-card>
      <EditMulta />
      <v-card-title>
        Facturación
        <v-spacer></v-spacer>
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
        <template v-slot:[`item.valor_facturacion`]="{ item }">
          $ {{ item.valor_facturacion | humanFormat }}
        </template>
        <template v-slot:[`item.valor_multa`]="{ item }">
          $ {{ item.valor_multa | humanFormat }}
        </template>
        <template v-slot:[`item.porcentaje_multa`]="{ item }">
          {{ item.porcentaje_multa }} %
        </template>
        <template v-slot:[`item.periodo.trm`]="{ item }">
          $ {{ item.trm | humanFormat}}
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
  import EditMulta from '@/components/Multas/EditMulta'
  import swal from 'sweetalert'
  import http from '@/plugins/axios'
  import "@/plugins/vuetify-money.js"
  import { mapState } from 'vuex'

  export default {
    name: 'Multas',
    components: {
      AppBar,
      Drawer,
      EditMulta,
    },
    data: () => ({
      search: null,
      headers: [
        { "text": 'ID', "value":'id'},
        { "text": "Periodo", "value": "periodo.periodo" },
        { "text": "Pais", "value": "pais"},
        { "text": "PJ", "value": "pj.pj_pais"},
        { "text": "Proyecto", "value": "proyecto.proyecto"},
        { "text": "Valor Facturacion(US)", "value": "valor_facturacion" },
        { "text": "Valor Multa(US)", "value": "valor_multa" },
        { "text": "% de Multa", "value": "porcentaje_multa"},
        { "text": 'Trm', "value": 'periodo.trm'},
        { "text": 'Actions', "value": 'actions', "sortable": false },
      ],
      newItem: {
        periodo: '',
        proyecto: '',
        trm: '',
        pj: '',
        pais: '',
        valor_facturacion: '',
        porcentaje_multa: '',
        valor_multa: ''
      }
    }),
    created() {
      this.$store.dispatch("setLoad");
      this.$store.dispatch("loadDataMultas")
    },
    computed: {
      getdata() {
        return this.$store.getters.getDataMultas
      },
      ...mapState(['permisos', 'loading'])
    },
    methods: {
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
            http.delete(`api/multas/${item.id}`)
            .then(() => {
              this.$store.commit("deleteItemMultas", item)
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
    },
  }
</script>