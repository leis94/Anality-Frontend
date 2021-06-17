<template>
	<v-container>
		<v-dialog v-model="dialog_newMonth" persistent max-width="1200px">
			<v-card>
				<v-card-title>
					<span class="headline"> Nuevo Mes</span>
					<template>
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-icon v-on="on">
									mdi-help-circle-outline
								</v-icon>
							</template>
								1. Los campos de color verde, son campos editables. <br>
								2. Presionar click en el campo con el icono <v-icon>mdi-account-edit</v-icon> para editarlo.<br>
								3. Presione la tecla enter ó el boton Save para confirmar el dato.<br>
								4. Para el formulario Cumplimiento indicadores, el cumplimiento general se calcula al guardar los datos.<br>
								5. Para el formulario Eficiencia en la solución, la eficiencia se calcula al guardar los datos.<br>
								6. Para el formulario Capacidad y demanda, el %uso se calcula al guardar los datos.
						</v-tooltip>
					</template>
				</v-card-title>
				<v-card-text>
					<v-form ref="form" v-model="valid" lazy-validation>
						<v-container>
							<v-row>
								<v-col cols="12" md="4">
									<v-autocomplete
										:items="dataPeriodos"
										item-text="periodo"
										item-value="periodo"
										label="Periodos"
										v-model="periodo"
										dense
									>
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Seleccione el mes correspondiente a los datos que ingresará.
											</v-tooltip>
										</template>
									</v-autocomplete>
								</v-col>
								<v-col cols="12" md="4">
									<v-select
										:items="dataProyectos"
										item-text="proyecto_pais"
										item-value="id"
										label="Proyecto"
										v-model="proyecto"
										dense
									>
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Seleccione el proyecto al que corresponden los datos que va a ingresar.
											</v-tooltip>
										</template>
									</v-select>
								</v-col>
								<v-col cols="12" md="4">
									<v-btn color="primary" dark class="mb-2" @click="buscar()">
										Buscar
									</v-btn>
								</v-col>
							</v-row>				
						</v-container>
					</v-form>
					<component :is="newMonthComponent" :dataNewMonth="dataList" :nextPeriodo="nextPeriodo" ref="refComponent" 
						@showMessage="showMessage" @close="close"></component>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="close()">Cancelar</v-btn>
					<v-btn color="blue darken-1" text @click="save()" :disabled="disabledSave" >Guardar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-snackbar
      v-model="snackbar.visible"
      :timeout="timeout"
			:multi-line="snackbar.mode === 'multi-line'" 
    >
			<v-layout align-center pr-4>
        <v-icon class="pr-3" dark large>{{ snackbar.icon }}</v-icon>
        <v-layout column>
          <div>
            <strong>{{ snackbar.title }}</strong>
          </div>
          <div>{{ snackbar.text }}</div>
        </v-layout>
      </v-layout>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar.visible = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
	</v-container>
</template>
<script>
	import ListNewMonthHrsLabor from '@/components/HrsLabor/ListNewMonth'
	import ListNewMonthAns from '@/components/Ans/ListNewMonth'
	import ListNewMonthVolumetrias from '@/components/Volumetrias/ListNewMonth'
  import http from '@/plugins/axios'
  import swal from 'sweetalert'
	import { mapState } from 'vuex'
	
  export default {
    name: 'NewMonth',
		components: {
			ListNewMonthHrsLabor,
			ListNewMonthAns,
			ListNewMonthVolumetrias
		},
		props: {
			api: {
				type: String,
				default: "",
			},
      RenderListComponent: {
        type: String,
				default: "",
      }
		},
    data: () => ({
			refComponent: null,
			disabledSave: true,
			newMonthComponent: null,
			valid: true,
			itemsServicios: [],
			dataList: {},
			nextPeriodo: null,
			proyecto: null,
			periodo: null,
			snackbar: {
				visible: false,
				title: "Error",
				text: "",
				mode: "multi-line",
        position: "top",
				icon: "mdi-info"
			},
			text: '',
			timeout: 7000
    }),
    methods: {
			showMessage(d){
				this.snackbar.visible = true
				this.snackbar.title = d.title
				this.snackbar.text = d.msg
			},
			selectListComponent(option){
				if (option === "ANS"){
					this.newMonthComponent = ListNewMonthAns
					this.refComponent = ListNewMonthAns
				}else if(option === "VOL"){
					this.newMonthComponent = ListNewMonthVolumetrias
					this.refComponent = ListNewMonthVolumetrias
				}else{
					this.newMonthComponent = ListNewMonthHrsLabor
					this.refComponent = ListNewMonthHrsLabor
				}
			},
      close() {
        this.$store.commit('updateShowNewMonth')
				this.newMonthComponent = null
				this.nextPeriodo = null
				this.dataList = {}
      },
			getNextPeriodo(periodo){
				let months  = {'ENE': 0,'FEB': 1,'MAR': 2,'ABR': 3,'MAY': 4,'JUN': 5,'JUL': 6,'AGO': 7,'SEP': 8,'OCT': 9,'NOV': 10,'DIC': 11}
				let months2 = {0: 'ENE',1: 'FEB',2: 'MAR',3: 'ABR',4: 'MAY',5: 'JUN',6: 'JUL',7: 'AGO',8: 'SEP',9: 'OCT',10: 'NOV',11: 'DIC'}
				let actualPeriodo = periodo.split(" -- ")
				let t = new Date(actualPeriodo[1], months[actualPeriodo[0]], 1)
				t.setMonth(t.getMonth() + 1 )
				let nextPeriodo = `${months2[t.getMonth()]} -- ${t.getFullYear()}`
				return nextPeriodo
			},
			buscar(){
				this.newMonthComponent = null
				if (this.periodo!=null && this.proyecto != null){
					let nextPeriodo = this.getNextPeriodo(this.periodo)
					let next = this.dataPeriodos.find(e => e.periodo === nextPeriodo)
					if (next !== undefined) {
						http.post(this.api, {'proyecto': this.proyecto, 'periodo': this.periodo})
						.then((response) => {
							if (response.data.code){
								this.disabledSave = true
								this.showMessage({title: "Error", msg: response.data.msg})
							}else{
								let data = response.data
								this.disabledSave = false
								this.dataList = data
								this.nextPeriodo = next
								this.selectListComponent(this.RenderListComponent)
							}
						})
						.catch(()=>{
							this.disabledSave = true
							swal("Error Interno", "Favor contactar con el administrador", "error");
						})
					}else{
						this.disabledSave = true
						swal("Error", `Favor contactar con el administrador y solicitar que cree el nuevo periodo ${nextPeriodo}`, "error");
					}
				}else{
					this.showMessage({title: "Error", msg: 'Seleccione un periodo y un proyecto'})
				}
			},   
      save(){
				this.$refs.refComponent.saveMonth()
      },
    },
    computed: {
			...mapState(['dialog_newMonth', 'dataPeriodos', 'dataProyectos']),
		},
  };
</script>

<style >
	.my-input input{ text-transform: uppercase}
</style>