<template>
  <v-container>
      <v-data-table
        :headers="headers"
        :search="search"
				:items="dataNewMonth"
      >
        <template v-slot:[`item.linea_base_horas`]="{ item }">
          <v-edit-dialog
            :return-value.sync="item.linea_base_horas"
          >
            <template v-if="item.linea_base_horas===null || item.linea_base_horas===''">
							<v-icon>
								mdi-account-edit
							</v-icon>
						</template>
            <span v-else>{{ item.linea_base_horas }}</span>
            <template v-slot:input>
              <v-text-field
                v-model="item.linea_base_horas"
                type="number"
                min="0"
                :rules="[v => !!v || 'Campo requerido', v => parseFloat(v) > 0 || 'No puede ser menor ó igual a 0']"
                label="Ingrese el valor y Enter"
                single-line
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.horas_ejecutadas`]="{ item }">
          <v-edit-dialog
            :return-value.sync="item.horas_ejecutadas"
          >
            <template v-if="item.horas_ejecutadas===null || item.horas_ejecutadas===''">
							<v-icon>
								mdi-account-edit
							</v-icon>
						</template>
            <span v-else>{{ item.horas_ejecutadas }}</span>
            <template v-slot:input>
              <v-text-field
                v-model="item.horas_ejecutadas"
                type="number"
                min="1"
                label="Ingrese el valor"
                :rules="[v => !!v || 'Campo requerido', v => parseFloat(v) >= 1 || 'Debe ser mayor ó igual a 1']"
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
    name: 'ListNewMonthHrsLabor',
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
        { "text": "Linea Base Hrs", "value": "linea_base_horas", class: 'header_editabled'},
        { "text": "Horas ejecutadas", "value": "horas_ejecutadas", class: 'header_editabled' },
        // { "text": '% Uso', "value": 'uso'},
        { "text": 'Actions', "value": 'actions', "sortable": false },
      ],
    }),
    created() {
      this.dataNewMonth.forEach((e, index) => {
        e.id = index
        delete e.periodo
        e.periodo = {'id': this.nextPeriodo.id, 'periodo': this.nextPeriodo.periodo}
        e.linea_base_horas = null
        e.horas_ejecutadas = null
        e.uso = null
      })
    },
    computed: {
      ...mapState(['permisos', 'dataPeriodos']),
    },
    methods: {
      calcularUso(){
        this.dataNewMonth.forEach((e) => {
          if(e.linea_base_horas !== 0){
            e.uso = parseFloat(e.horas_ejecutadas / e.linea_base_horas * 100).toFixed(2)
          }else{
            e.uso = 0
          }
        })
      },
      post(url){
        http.post(url, this.dataNewMonth)
        .then((response) => {
          let data = response.data
          data.forEach((e) => {
            this.$store.commit("newHrsLabor", e)
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
            if ( this.dataNewMonth[i].linea_base_horas === null || this.dataNewMonth[i].horas_ejecutadas === null 
                || this.dataNewMonth[i].linea_base_horas === "" || this.dataNewMonth[i].horas_ejecutadas === ""
                || parseFloat(this.dataNewMonth[i].linea_base_horas) <= 0 || parseFloat(this.dataNewMonth[i].horas_ejecutadas) < 0
                ){
              isValid = false
              errorColumn+=`${this.dataNewMonth[i].id}, `
            }
          }
          if (isValid){
            this.calcularUso()
            this.post("api/hrs_labor_new_month")
            this.$emit('close')
          }else{
            this.$emit('showMessage', {
                title: `Favor Revisar los campos de la tabla con id ${errorColumn}:`,
                msg: "Ingrese la Linea Base Hrs > 0 y Horas ejecutadas >= 0"
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