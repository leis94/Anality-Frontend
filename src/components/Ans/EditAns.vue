<template>
	<v-container>
		<v-dialog v-model="dialog" persistent max-width="1100px">
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
								<v-col cols="12" md="4">
									<v-select
										:items="tipo_formato"
										label="Tipo de formato"
										v-model="editItem.tipo_formato"
										:rules="[v => !!v || 'Campo requerido']"
										required>
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Seleccione que tipo de indicador va a ingresar, si es un indicador de Porcentaje o si es un indicador decimal
											</v-tooltip>
										</template>
									</v-select>
								</v-col>
                <v-col cols="12" md="8">
									<v-autocomplete
										:items="itemsServicios"
										v-model="editItem.servicio"
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
												Seleccione el nombre del indicador que va a ingresar (<strong>Ejemplo</strong> Cumplimiento Incidentes)
											</v-tooltip>
										</template>
									</v-autocomplete>
								</v-col>								
							</v-row>
							<v-row>
									<v-col cols="12" md="12">
									<v-autocomplete
										v-model="editItem.indicadores_servicio"
										:items="itemsServicios"
										item-text="indicadores_servicio"
										label="Ind. de Servicio"
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
												Seleccione la descripción correspondiente del indicador que va a ingresar.
											</v-tooltip>
										</template>
									</v-autocomplete>
								</v-col>
							</v-row>
              <v-row>
								<v-col cols="12" md="4" v-if="showNSOP">
									<v-text-field v-model="editItem.nso" prefix="%" label="NSO" type="number" 
										:rules="[v => !!v || 'Campo requerido', v => v > 0 || 'Debe ser mayor a 0', v => v <= 100 || 'Debe ser menor a 100']"
										min="1" max="100">
									</v-text-field>
								</v-col>
                <v-col cols="12" md="4" v-if="showNSOD">
									<v-text-field v-model="editItem.nso_dec" type="number" label="NSO DEC" 
										:rules="[v => !!v || 'Campo requerido']">
									</v-text-field>
								</v-col>
								<v-col cols="12" md="4">
									<v-select :items="ind_txt_items" v-model="editItem.ind_txt" label="IND TEX" :rules="[v => !!v || 'Campo requerido']" required>
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												<strong>Ejemplo:</strong> Si mi meta es superar o igualar el valor del NSO para cumplirlo debo colocar >= (NSO: 20 >= OBTENIDO: 25).<br> Si mi meta es no superar o igualar el valor del NOS para cumplirlo debo colocar &lt;= (NSO: 20 &lt;= OBTENIDO: 15).
											</v-tooltip>
										</template>
									</v-select>
								</v-col>
								<v-col cols="12" md="4" v-if="showNSOP">
									<v-text-field v-model="editItem.obtenido" type="number" label="Obtenido" 
										:rules="[v => !!v || 'Campo requerido', v => v > 0 || 'Debe ser mayor a 0', v => v <= 1 || 'Debe ser menor a 1']"
										required>
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Indique el valor obtenido de su operación <strong>siempre en formato decimal</strong>. Ejemplo: si mi resultado fue 95% lo indico en decimal 0,95
											</v-tooltip>
										</template>
									</v-text-field>
								</v-col>
								<v-col cols="12" md="4" v-if="showNSOD">
									<v-text-field v-model="editItem.obtenido" type="number" label="Obtenido" 
										:rules="[v => !!v || 'Campo requerido', v => v > 0 || 'Debe ser mayor a 0', v => v <= 1000 || 'Debe ser menor a 1000']"
										required>
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Indique el valor obtenido de su operación siempre en formato decimal. Ejemplo: si mi resultado fue 95% lo indico en decimal 0,95
											</v-tooltip>
										</template>
									</v-text-field>
								</v-col>
							</v-row>
							<v-row>
                <v-col cols="12" md="9">
									<v-text-field v-model="editItem.observaciones" label="Observaciones">
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Si tiene alguna observación referente a los datos ingresados o el valor obtenido ingrésela en este campo.
											</v-tooltip>
										</template>
									</v-text-field>
								</v-col>
								<v-col cols="12" md="3">
									<v-text-field v-model="editItem.cumplimiento_general" label="Cump. Gral"
										type="number" disabled
									></v-text-field>
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
    name: 'EditAns',
    data: () => ({
			valid: true,
			showNSOP: false,
			showNSOD: false,
			ind_txt_items: ['<','>','<=','>='],
			itemsServicios: [],
    }),
    methods: {
			change_proyecto(value){
				let proyecto = this.dataProyectos.filter((e)=>(e.id==value))
				let pais = proyecto[0].proyecto_pais.split(" -- ")[1]
				this.editItem.pais = pais
			},
      close() {
				this.showNSOP = false
				this.showNSOD = false
        this.$store.commit('updateShowEdit')
				this.$store.commit('updateEditItem', {})
				this.$store.commit('setFormTitle', '')
				this.$refs.form.resetValidation()
      },
      put(url, params){
        http.put(url, params)
        .then((response) => {
          let data = response.data
          this.$store.commit("updateDataAns", data)
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
						this.$store.commit("newAns", data)
						swal("Creado Correctamente!", {
							icon: "success",
						});
					})
					.catch(() => {
						swal("Error Interno", "Favor contactar con el administrador", "error");
					});
			},
			calcular_cumplimiento(){
				let ind_txt = this.editItem.ind_txt
				let tipo_formato = this.editItem.tipo_formato;
				let nsop = parseFloat(this.editItem.nso);
				let nsod = parseFloat(this.editItem.nso_dec);
				let obt = parseFloat(this.editItem.obtenido);
				if (tipo_formato === 'PORCENTAJE'){
					obt = (obt * 100).toFixed(4)
				}
				
				switch(ind_txt){
					case "<":
						if (tipo_formato === 'PORCENTAJE'){
							if (obt < nsop){
								this.editItem.cumplimiento_general = 1
							}else{
								this.editItem.cumplimiento_general = -1
							}
						}else{
							if (obt < nsod){
								this.editItem.cumplimiento_general = 1
							}else{
								this.editItem.cumplimiento_general = -1
							}
						}
						break;
					case "<=":
						if (tipo_formato === 'PORCENTAJE'){
							if (obt <= nsop){
								this.editItem.cumplimiento_general = 1
							}else{
								this.editItem.cumplimiento_general = -1
							}
						}else{
							if (obt <= nsod){
								this.editItem.cumplimiento_general = 1
							}else{
								this.editItem.cumplimiento_general = -1
							}
						}
						break;
					case ">":
						if (tipo_formato === 'PORCENTAJE'){
							if ( obt > nsop ){
								this.editItem.cumplimiento_general = 1
							}else{
								this.editItem.cumplimiento_general = -1
							}
						}else{
							if (obt > nsod){
								this.editItem.cumplimiento_general = 1
							}else{
								this.editItem.cumplimiento_general = -1
							}
						}					
						break;
					case ">=":
						if (tipo_formato === 'PORCENTAJE'){
							if (obt >= nsop){
								this.editItem.cumplimiento_general = "1"
							}else{
								this.editItem.cumplimiento_general = "-1"
							}
						}else{
							if (obt >= nsod){
								this.editItem.cumplimiento_general = "1"
							}else{
								this.editItem.cumplimiento_general = "-1"
							}
						}
						break;
				}
			},
			deleteNsoOrNsoDec(){
				if (this.editItem.nso == "NaN"){
					delete this.editItem.nso
				}else{
					delete this.editItem.nso_dec
				}
			},
      save(){
				if (this.$refs.form.validate()){
					this.editItem.obtenido = parseFloat(this.editItem.obtenido).toFixed(4)
					this.editItem.nso  = parseFloat(this.editItem.nso).toFixed(4)
					this.editItem.nso_dec  = parseFloat(this.editItem.nso_dec).toFixed(4)
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
					this.calcular_cumplimiento()
					this.deleteNsoOrNsoDec()
					if (this.formTitle === 'Editar'){		
						this.put(`api/ans/${this.editItem.id}`, this.editItem)
					}else{
						this.post('api/ans', this.editItem)
					}
					this.close()
				}
      },
		},
		watch: {
			"editItem.tipo_formato": function(value){
				if (value === "DECIMAL"){
					this.editItem.nso = null
					this.showNSOD = true
					this.showNSOP = false
				}else	if (value === "PORCENTAJE"){
					this.editItem.nso_dec = null
					this.showNSOP = true
					this.showNSOD = false
				}
			},
			"editItem.proyecto": function(value){
				if (value !== '' && value !== undefined){
					let proyecto;
					if(typeof(value) === 'object'){
						proyecto = value.id
					}else{
						proyecto = value
					}
					http.get('api/servicios_ans/'+proyecto)
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
    computed: {
      ...mapState(['dialog', 'dataProyectos', 'editItem', 'dataPeriodos', 'dataPjs', 'editItemIndex', 'semanas', 'formTitle', 'tipo_formato']),
		},
  };
</script>