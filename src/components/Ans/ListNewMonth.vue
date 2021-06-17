<template>
  <v-container>
      <v-data-table
        :headers="headers"
        :search="search"
				:items="dataNewMonth"
      >
        <template v-slot:[`item.nso`]="{ item }">
          <v-edit-dialog large
            :return-value.sync="item.nso"
          >
            <template v-if="item.nso===null || item.nso===''">
							<v-icon>
								mdi-account-edit
							</v-icon>
						</template>
            <span v-else>{{ item.nso }}</span>
            
            <template v-slot:input>
              <v-text-field
                v-model="item.nso"
                type="number"
                min="0"
                max="100"
                label="Ingrese el valor y Enter"
                single-line
                :rules="[v => !!v || 'Campo requerido', v => v > 0 || 'Debe ser mayor a 0', v => v <= 100 || 'Debe ser menor a 100']"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.nso_dec`]="{ item }">
          <v-edit-dialog large
            :return-value.sync="item.nso_dec"
          >
            <template v-if="item.nso_dec===null || item.nso_dec===''">
							<v-icon>
								mdi-account-edit
							</v-icon>
						</template>
            <span v-else>{{ item.nso_dec }}</span>
            <template v-slot:input>
              <v-text-field
                v-model="item.nso_dec"
                type="number"
                min="0"
                :rules="[v => !!v || 'Campo requerido']"
                label="Ingrese el valor y Enter"
                single-line
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.tipo_formato`]="{ item }">
          <v-edit-dialog
            :return-value.sync="item.tipo_formato" large
          >
            {{ item.tipo_formato }}
            <template v-slot:input>
              <v-select :items="tipo_formato" v-model="item.tipo_formato" label="IND TEX" single-line counter >
							</v-select>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.ind_txt`]="{ item }">
          <v-edit-dialog
            :return-value.sync="item.ind_txt" large
          >
            {{ item.ind_txt }}
            <template v-slot:input>
              <v-select :items="ind_txt_items" v-model="item.ind_txt" label="IND TEX" single-line counter >
							</v-select>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.obtenido`]="{ item }">
          <v-edit-dialog
            :return-value.sync="item.obtenido" large
          >
            <template v-if="item.obtenido===null || item.obtenido===''">
							<v-icon>
								mdi-account-edit
							</v-icon>
						</template>
            <span v-else>{{ item.obtenido }}</span>

            <template v-slot:input>
              <v-text-field
                v-model="item.obtenido"
                type="number"
                min="0"
                max="1"
                :rules="[v => !!v || 'Campo requerido', v => v > 0 || 'Debe ser mayor a 0']"
                label="Ingrese el valor y Enter"
                single-line 
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
         <template v-slot:[`item.observaciones`]="{ item }">
          <v-edit-dialog
            :return-value.sync="item.observaciones" large
          >
            <template v-if="item.observaciones===null || item.observaciones===''">
							<v-icon>
								mdi-account-edit
							</v-icon>
						</template>
            <span v-else>{{ item.observaciones }}</span>

            <template v-slot:input>
              <v-text-field
                v-model="item.observaciones"
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
    name: 'ListNewMonthAns',
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
      ind_txt_items: ['<','>','<=','>='],
      headers: [
        { "text": "id", "value": "id"},
        { "text": "Periodo", "value": "periodo.periodo" },
        { "text": "Pais", "value": "pais"},
        { "text": "Proyecto", "value": "proyecto.proyecto"},
        { "text": "Tipo Formato", "value": "tipo_formato", class: 'header_editabled'},
        { "text": "Servicio", "value": "servicio" },
        { "text": 'NSO', "value": 'nso', class: 'header_editabled'},
        { "text": 'NSO Dec', "value": 'nso_dec', class: 'header_editabled'},
        { "text": 'Ind Txt', "value": 'ind_txt', class: 'header_editabled'},
        { "text": 'Obtenido', "value": 'obtenido', class: 'header_editabled'},
        // { "text": 'Cump. Gral', "value": 'cumplimiento_general'},
        { "text": 'Observaciones', "value": 'observaciones', class: 'header_editabled'},
        { "text": 'Actions', "value": 'actions', "sortable": false },
      ],
    }),
    created() {
      this.dataNewMonth.forEach((e, index) => {
        e.id = index;
        delete e.periodo
        e.periodo = {'id': this.nextPeriodo.id, 'periodo': this.nextPeriodo.periodo}
        e.obtenido = null
        e.observaciones = null  
      });
    },
    computed: {
      ...mapState(['permisos', 'dataPeriodos', 'tipo_formato']),
    },
    methods: {
      calcular_cumplimiento(){
        for (let i = 0; i < this.dataNewMonth.length; i++) {
          let ind_txt = this.dataNewMonth[i].ind_txt
          let tipo_formato = this.dataNewMonth[i].tipo_formato;
          let nsop = parseFloat(this.dataNewMonth[i].nso);
          let nsod = parseFloat(this.dataNewMonth[i].nso_dec);
          let obt = parseFloat(this.dataNewMonth[i].obtenido);
          if (tipo_formato === 'PORCENTAJE'){
            this.dataNewMonth[i].nso = parseFloat(this.dataNewMonth[i].nso).toFixed(4);
            obt = (obt * 100).toFixed(4)
          }else{
            this.dataNewMonth[i].nso_dec = parseFloat(this.dataNewMonth[i].nso_dec).toFixed(4);
          }
          
          switch(ind_txt){
            case "<":
              if (tipo_formato === 'PORCENTAJE'){
                if (obt < nsop){
                  this.dataNewMonth[i].cumplimiento_general = 1
                }else{
                  this.dataNewMonth[i].cumplimiento_general = -1
                }
              }else{
                if (obt < nsod){
                  this.dataNewMonth[i].cumplimiento_general = 1
                }else{
                  this.dataNewMonth[i].cumplimiento_general = -1
                }
              }
              break;
            case "<=":
              if (tipo_formato === 'PORCENTAJE'){
                if (obt <= nsop){
                  this.dataNewMonth[i].cumplimiento_general = 1
                }else{
                  this.dataNewMonth[i].cumplimiento_general = -1
                }
              }else{
                if (obt <= nsod){
                  this.dataNewMonth[i].cumplimiento_general = 1
                }else{
                  this.dataNewMonth[i].cumplimiento_general = -1
                }
              }
              break;
            case ">":
              if (tipo_formato === 'PORCENTAJE'){
                if ( obt > nsop ){
                  this.dataNewMonth[i].cumplimiento_general = 1
                }else{
                  this.dataNewMonth[i].cumplimiento_general = -1
                }
              }else{
                if (obt > nsod){
                  this.dataNewMonth[i].cumplimiento_general = 1
                }else{
                  this.dataNewMonth[i].cumplimiento_general = -1
                }
              }					
              break;
            case ">=":
              if (tipo_formato === 'PORCENTAJE'){
                if (obt >= nsop){
                  this.dataNewMonth[i].cumplimiento_general = "1"
                }else{
                  this.dataNewMonth[i].cumplimiento_general = "-1"
                }
              }else{
                if (obt >= nsod){
                  this.dataNewMonth[i].cumplimiento_general = "1"
                }else{
                  this.dataNewMonth[i].cumplimiento_general = "-1"
                }
              }
              break;
          }
        }
			},
      post(url){
        http.post(url, this.dataNewMonth)
        .then((response) => {
          let data = response.data
          data.forEach((e) => {
            this.$store.commit("newAns", e)
          })
          swal("Creado Correctamente!", {
            icon: "success",
          });
        })
        .catch(() => {
          swal("Error Interno", "Favor contactar con el administrador", "error");
        });
      },
      saveMonth() {
        let errorColumn = ""
        if (this.dataNewMonth.length > 0){
          let isValid = true
          for (let i = 0; i < this.dataNewMonth.length; i++) {
            if ( this.dataNewMonth[i].tipo_formato == "PORCENTAJE"){ 
              this.dataNewMonth[i].nso_dec = null;
              if ( this.dataNewMonth[i].nso === null || this.dataNewMonth[i].ind_txt === null || this.dataNewMonth[i].obtenido === null
                  || this.dataNewMonth[i].nso === "" || this.dataNewMonth[i].ind_txt === "" || this.dataNewMonth[i].obtenido === ""
                  || this.dataNewMonth[i].obtenido > 1 || this.dataNewMonth[i].obtenido <= 0
                  || this.dataNewMonth[i].nso > 100 || this.dataNewMonth[i].nso <= 0){
                isValid = false;
                errorColumn+=`${this.dataNewMonth[i].id}, `
              }
            }else{
              this.dataNewMonth[i].nso = null;
              if ( this.dataNewMonth[i].nso_dec === null || this.dataNewMonth[i].ind_txt === null || this.dataNewMonth[i].obtenido === null
                  || this.dataNewMonth[i].nso_dec === "" || this.dataNewMonth[i].ind_txt === "" || this.dataNewMonth[i].obtenido === ""
                  || this.dataNewMonth[i].obtenido <= 0){
                isValid = false;
                errorColumn+=`${this.dataNewMonth[i].id}, `
              } 
            }
          }
          if (isValid){
            this.calcular_cumplimiento()
            this.post("api/ans_new_month")
            this.$emit('close')
          }else{
            console.log(errorColumn)
            this.$emit('showMessage', {
                title: `Favor Revisar los campos de la tabla con id ${errorColumn}:`,
                msg: "1) Si es PORCENTAJE: Obtenido(>0 y <1), NSO(>0 y <100). \
                      2) Si es Decimal: NSO Dec(> 0), Obtenido(> 0)"
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