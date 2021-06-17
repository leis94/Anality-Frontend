<template>
  <v-container>
      <v-data-table
        :headers="headers"
        :search="search"
				:items="dataNewMonth"
      >
        <template v-slot:[`item.registrados`]="{ item }">
          <v-edit-dialog
            :return-value.sync="item.registrados"
          >
            <template v-if="item.registrados===null || item.registrados===''">
							<v-icon>
								mdi-account-edit
							</v-icon>
						</template>
            <span v-else>{{ item.registrados }}</span>
            <template v-slot:input>
              <v-text-field
                v-model="item.registrados"
                type="number"
                min="0"
                label="Ingrese el valor y Enter"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.cerrados`]="{ item }">
          <v-edit-dialog
            :return-value.sync="item.cerrados"
          >
            <template v-if="item.cerrados===null || item.cerrados===''">
							<v-icon>
								mdi-account-edit
							</v-icon>
						</template>
            <span v-else>{{ item.cerrados }}</span>
            <template v-slot:input>
              <v-text-field
                v-model="item.cerrados"
                type="number"
                min="0"
                label="Ingrese el valor y Enter"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.backlog`]="{ item }">
          <v-edit-dialog
            :return-value.sync="item.backlog"
          >
            <template v-if="item.backlog===null || item.backlog===''">
							<v-icon>
								mdi-account-edit
							</v-icon>
						</template>
            <span v-else>{{ item.backlog }}</span>
            <template v-slot:input>
              <v-text-field
                v-model="item.backlog"
                type="number"
                min="0"
                label="Ingrese el valor y Enter"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template> 
      </v-data-table>
  </v-container>
</template>

<script>
  import swal from 'sweetalert'
  import http from '@/plugins/axios'
  import { mapState } from 'vuex'

  export default {
    name: 'ListNewMonthVol',
		props: {
			dataNewMonth: {
				type: Array,
				default: () => {}, 
			},
      nextPeriodo: {
        type: Object,
				default: () => {},
      }
		},
    data: () => ({
      search: null,
      headers: [
        { "text": "id", "value": "id"},
        { "text": "Periodo", "value": "periodo.periodo" },
        { "text": "Pais", "value": "pais"},
        { "text": "Proyecto", "value": "proyecto.proyecto"},
        { "text": "Servicio", "value": "servicio" },
        { "text": "Tipo", "value": "tipo"},
        { "text": "Registrados", "value": "registrados", class: 'header_editabled' },
        { "text": 'Cerrados', "value": 'cerrados', class: 'header_editabled'},
        { "text": 'Backlog', "value": 'backlog', class: 'header_editabled'},
        { "text": 'Actions', "value": 'actions', "sortable": false },
      ],
    }),
    created() {
      this.dataNewMonth.forEach((e, index) => {
        e.id = index
        delete e.periodo
        e.periodo = {'id': this.nextPeriodo.id, 'periodo': this.nextPeriodo.periodo}
        e.registrados = null
        e.cerrados = null
        e.backlog = null
        e.backlog_y_registrados = null
        e.eficiencia = null
      })
    },
    computed: {
      ...mapState(['permisos', 'dataPeriodos']),
    },
    methods: {
      post(url){
        http.post(url, this.dataNewMonth)
        .then((response) => {
          let data = response.data
          data.forEach((e) => {
            this.$store.commit("newVolumetria", e)
          })
          swal("Creado Correctamente!", {
            icon: "success",
          });
        })
        .catch((e) => {
          console.log(e)
          swal("Error Interno", "Favor contactar con el administrador", "error");
        });
      },
      saveMonth() {
        let errorColumn = ""
        if (this.dataNewMonth.length > 0){
          let isValid = true
          for (let i = 0; i < this.dataNewMonth.length; i++) {          
            if ( this.dataNewMonth[i].registrados === null || this.dataNewMonth[i].cerrados === null || this.dataNewMonth[i].backlog === null 
                || this.dataNewMonth[i].registrados === "" || this.dataNewMonth[i].cerrados === "" || this.dataNewMonth[i].backlog === ""
                ){
              isValid = false
              errorColumn+=`${this.dataNewMonth[i].id}, `
            }
          }
          if (isValid){
            this.post("api/volumetrias_new_month")
            this.$emit('close')
          }else{
            this.$emit('showMessage',
            {
                title: `Favor Revisar los campos de la tabla con id ${errorColumn}:`,
                msg: "Ingrese según corresponda: Registrados, Cerrados y Backlog"
            })
          }
        }else{
          this.$emit('showMessage',{title: "Error", msg: "Eliminaste todos los registros, favor buscar nuevamente"})
        }
      },
      deleteItem(item) {
        let index = this.dataNewMonth.indexOf(item)
        this.dataNewMonth.splice(index, 1)
      }
    }
  }
</script>

<style>
  .header_editabled{
    color: green !important;
  }
</style>