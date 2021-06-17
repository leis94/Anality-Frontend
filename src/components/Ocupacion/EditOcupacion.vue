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
										:items="dataProyectosOcupacion"
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
								<v-col cols="12" md="6">
									<v-select
										:items="dataUsersOcupacion"
										item-text="nombre"
										item-value="email"
										label="Nombre_Apellido"
										v-model="editItem.email"
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
												Seleccione el Usuario al que corresponden los datos que va a ingresar.
											</v-tooltip>
										</template>
									</v-select>
								</v-col>
								<v-col cols="12" md="6">
									<v-text-field v-model="editItem.dedicacion" type="number" label="Dedicación" prefix="%"
										:rules="[v => !!v || 'Campo requerido']"
									></v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12" md="12">
									<v-text-field v-model="editItem.observaciones" label="Observaciones" required></v-text-field>
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
    name: 'EditOcupacion',
    data: () => ({
      valid: true
    }),
		created () {
			this.$store.dispatch("loadDataUsersOcupacion")
		},
    methods: {
			change_proyecto(value){
				let proyecto = this.dataProyectosOcupacion.filter((e)=>(e.id==value))
				let pais = proyecto[0].proyecto_pais.split(" -- ")[1]
				this.editItem.pais = pais
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
          this.$store.commit("updateDataOcupacion", data)
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
						this.$store.commit("newOcupacion", data)
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
					let pm = this.dataUsersOcupacion.find(user => user.email == this.editItem.email).nombre
					this.editItem.pm = pm
					let dedicacion = parseFloat(this.editItem.dedicacion).toFixed(2)
					this.editItem.dedicacion = dedicacion
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
						this.put(`api/ocupacion/${this.editItem.id}`, this.editItem)
					}else{
						this.post('api/ocupacion', this.editItem)
					}
					this.close()
				}
      },
		},
    computed: {
      ...mapState(['dialog', 'dataProyectosOcupacion', 'editItem', 'dataPeriodos', 
				'dataPjs', 'editItemIndex', 'paises', 'semanas', 'formTitle', 'username', 
				'email', 'dataUsersOcupacion']),
		},
  };
</script>