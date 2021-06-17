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
									<v-select
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
									</v-select>
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
									></v-autocomplete>
								</v-col>
								<v-col cols="12" md="4">
									<v-select
										:items="tipos"
										label="Tipo"
										v-model="editItem.tipo"
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
												Seleccione a qué tipo de casos corresponden los datos que va a ingresar.
											</v-tooltip>
										</template>
									</v-select>
								</v-col>
							</v-row>
							<v-row>
                <v-col cols="12" md="4">
									<v-text-field v-model="editItem.registrados" label="Registrados" type="number" @keypress="isNumber($event)" :rules="[v => !!v || 'Campo requerido']">
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Ingrese la cantidad de casos registrados-creados del mes.
											</v-tooltip>
										</template>
									</v-text-field>
								</v-col>
								<v-col cols="12" md="4">
									<v-text-field v-model="editItem.cerrados" type="number" @keypress="isNumber($event)" label="Cerrados" :rules="[v => !!v || 'Campo requerido']"
										required>
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Ingrese la cantidad de casos cerrados del mes.
											</v-tooltip>
										</template>	
									</v-text-field>
								</v-col>
								<v-col cols="12" md="4">
									<v-text-field v-model="editItem.backlog" type="number" @keypress="isNumber($event)" label="Backlog" :rules="[v => !!v || 'Campo requerido']"
										required>
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Ingrese la cantidad de casos en backlog que quedaron del mes
											</v-tooltip>
										</template>
									</v-text-field>
								</v-col>
							</v-row>
              <v-row>
								<v-alert dense type="info" outlined>
									<strong color="sucess">Backlog y Registrados</strong> y la 	<strong>Eficiencia</strong> son calculados automaticamente.
								</v-alert>
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
		<v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
	</v-container>
</template>
<script>
  import http from '@/plugins/axios'
  import swal from 'sweetalert'
  import { mapState } from 'vuex'
  export default {
    name: 'EditVolumetria',
    data: () => ({
			valid: true,
			loading: false,
			loader: null,
			snackbar: false,
			text: '',
			timeout: 3000,
			itemsServicios: [],
    }),
    methods: {
			isNumber(evt){
				evt = (evt) ? evt : window.event
				var charCode = (evt.which) ? evt.which : evt.keyCode
				if (charCode === 46) {
					evt.preventDefault()
				}else{
					return true
				}
			},
			change_proyecto(value){
				let proyecto = this.dataProyectos.filter((e)=>(e.id==value))
				let pais = proyecto[0].proyecto_pais.split(" -- ")[1]
				this.editItem.pais = pais
			},
      close() {
        this.$store.commit('updateShowEdit')
				this.$store.commit('updateEditItem', {})
				this.$store.commit('setFormTitle', '')
				this.$refs.form.resetValidation()
				this.loading = false
      },
      put(url, params){
        http.put(url, params)
        .then((response) => {
          let data = response.data
          this.$store.commit("updateDataVolumetrias", data)
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
						this.$store.commit("newVolumetria", data)
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
						this.put(`api/volumetrias/${this.editItem.id}`, this.editItem)
					}else{
						this.post('api/volumetrias', this.editItem)
					}
					this.close()
				}
			},
    },
    computed: {
			...mapState(['dialog', 'dataProyectos', 'editItem', 'dataPeriodos', 'dataPjs', 'editItemIndex', 'paises', 'semanas', 'formTitle', 'tipos']),
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
					http.get('api/servicios_vol/'+proyecto)
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