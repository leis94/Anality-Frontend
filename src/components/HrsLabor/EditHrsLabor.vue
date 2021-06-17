<template>
	<v-container>
		<v-dialog v-model="dialog" persistent max-width="1000px">
			<v-card>
				<v-card-title>
					<span class="headline">{{ formTitle }}</span>
				</v-card-title>
				<v-card-text>
					<v-form ref="form" v-model="valid" lazy-validation>
						<v-container>
							<v-row>
								<v-col cols="12" md="4">
									<v-autocomplete
										:items="dataPeriodos"
										item-text="periodo"
										item-value="id"
										label="Periodo"
										v-model="editItem.periodo"
										:rules="[v => !!v || 'Campo requerido']"
										required
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
										v-model="editItem.proyecto"
										@change="change_proyecto"
										:rules="[v => !!v || 'Campo requerido']"
										required
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
									<v-text-field
										label="Pais"
										v-model="editItem.pais"
										disabled
										:rules="[v => !!v || 'Campo requerido']"
										required
									></v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12" md="8">
									<v-autocomplete
										v-model="editItem.servicio"
										:items="itemsServicios"
										item-text="servicio"
										label="Servicio"
										:rules="[v => !!v || 'Campo requerido']"
										required
									>
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Seleccione la línea de servicio al cual pertenecen los datos que va a ingresar.
											</v-tooltip>
										</template>
									</v-autocomplete>
								</v-col>
								<v-col cols="12" md="4">
									<v-text-field v-model="editItem.linea_base_horas" type="number" label="Linea Base Horas" 
										@change="change_Lhrs" :rules="[v => !!v || 'Campo requerido', v => parseFloat(v) > 0 || 'No puede ser menor ó igual a 0']"
										required min="1" suffix="Hrs">
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Ingrese la línea base de horas contractuales a su línea de servicio y colóquelo en formato decimal.
											</v-tooltip>
										</template>
									</v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12" md="6">
									<v-text-field v-model="editItem.horas_ejecutadas" type="number" label="Horas Ejecutadas"
										@change="change_HrsE" :rules="[v => !!v || 'Campo requerido', v => parseFloat(v) >= 1 || 'Debe ser mayor ó igual a 1']"
										required min="1" suffix="Hrs">
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Ingrese el total de horas ejecutadas en la línea de servicio por la operación.
											</v-tooltip>
										</template>
									</v-text-field>
								</v-col>
								<v-col cols="12" md="6">
									<v-text-field v-model="editItem.uso" prefix="%" type="number" label="Uso" disabled></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="close()">Cancelar</v-btn>
					<v-btn color="blue darken-1" text @click="save()">Guardar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>
<script>
  import http from '@/plugins/axios'
  import swal from 'sweetalert'
	import { mapState } from 'vuex'
	
  export default {
    name: 'EditHrsLabor',
    data: () => ({
			valid: true,
			itemsServicios: [],
    }),
    methods: {
			change_proyecto(value){
				let proyecto = this.dataProyectos.filter((e)=>(e.id==value))
				let pais = proyecto[0].proyecto_pais.split(" -- ")[1]
				this.editItem.pais = pais
			},
			change_Lhrs(value){
        if (value !== "" || value != 0 ){
          this.editItem.uso = parseFloat(this.editItem.horas_ejecutadas / value * 100).toFixed(2) 
        }else{
          this.editItem.uso = 0
        }
      },
      change_HrsE(value){
        if (value !== "" || value != 0 ){
          this.editItem.uso = parseFloat(value / this.editItem.linea_base_horas * 100).toFixed(2) 
        }else{
          this.editItem.uso = 0
        }
      }, 
      close() {
        this.$store.commit('updateShowEdit')
				this.$store.commit('updateEditItem', {})
				this.$store.commit('setFormTitle', '')
				this.$refs.form.resetValidation()
      },
      put(url, params){
        http.put(url, params)
        .then((response) => {
          let data = response.data
          this.$store.commit("updateDataHrsLabor", data)
          swal("Actualizado Correctamente!", {
            icon: "success",
          });
        })
        .catch(() => {
					swal("Error Interno", "Favor contactar con el administrador", "error");
        });
			},
			post(url, params){
        http.post(url, params)
        .then((response) => {
          let data = response.data
          this.$store.commit("newHrsLabor", data)
          swal("Creado Correctamente!", {
            icon: "success",
          });
        })
        .catch(() => {
          swal("Error Interno", "Favor contactar con el administrador", "error");
        });
      },   
      save(){
				if (this.$refs.form.validate()){
					this.editItem.linea_base_horas = parseFloat(this.editItem.linea_base_horas).toFixed(2)
					this.editItem.horas_ejecutadas = parseFloat(this.editItem.horas_ejecutadas).toFixed(2)
					let proyecto = this.editItem.proyecto
					let periodo = this.editItem.periodo 
					if (typeof(proyecto) !== "object"){
						this.editItem.proyecto = {"id": proyecto}
					}else{
						this.editItem.proyecto = {"id": this.editItem.proyecto.id}
					}
					if (typeof(periodo) !== "object"){
						this.editItem.periodo = {"id": periodo}
					}else{
						this.editItem.periodo = {"id": this.editItem.periodo.id}
					}
					if (this.formTitle === 'Editar'){
						this.put(`api/hrs_labor/${this.editItem.id}`, this.editItem)
					}else{
						this.post('api/hrs_labor', this.editItem)
					}
					this.close()
				}
      },
    },
    computed: {
			...mapState(['dialog', 'dataProyectos', 'editItem', 'dataPeriodos', 'editItemIndex', 'formTitle', 'dataServicios']),
		},
		watch: {
			"editItem.proyecto": function(value){
				if (value !== '' && value !== undefined){
					let proyecto;
					if(typeof(value) === 'object'){
						proyecto = value.id
					}else{
						proyecto = value
					}
					http.get('api/servicios_hrs_labor/'+proyecto)
					.then(r => r.data)
					.then(response => {
						this.itemsServicios = response;
					})
					.catch(e => {
						console.log(e)
					})
				}
			}
		},
  };
</script>

<style >
	.my-input input{ text-transform: uppercase}
</style>