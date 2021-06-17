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
								<v-col cols="12" md="4">
									<v-autocomplete
										:items="dataPeriodos"
										item-text="periodo"
										item-value="id"
										label="Periodo"
										v-model="editItem.periodo"
										@change="select_trm"
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
							</v-row>
							<v-row>
								<v-col cols="12" md="4">
									<v-autocomplete
										:items="dataPjs"
										item-text="pj_pais"
										item-value="id"
										label="PJ"
										v-model="editItem.pj"
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
												Seleccione el #PJ correspondiente a los valores que va a ingresar.
											</v-tooltip>
										</template>
									</v-autocomplete>
								</v-col>
								<v-col cols="12" md="4">
									<vuetify-money 
										v-model="editItem.valor_facturacion" v-bind:options="options" 
										label="Vlr de Facturación(US)" :rules="[v => !!v || 'Campo requerido', v => parseFloat(v) > 0 || 'No puede ser igual 0']" 
										@change.native="change_Facturacion" required autocomplete="off">
											<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Ingrese el valor total de la facturación del mes en dólares (US). Si no tiene valores para el mes coloque 0
											</v-tooltip>
										</template>
									</vuetify-money>
								</v-col>
								<v-col cols="12" md="4">
									<vuetify-money 
										v-model="editItem.valor_multa" v-bind:options="options" 
										label="Vlr de Multa(US)" :rules="[v => !!v || 'Campo requerido']" 
										@change.native="change_Multa" required>
										<template v-slot:append-outer>
											<v-tooltip bottom>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on">
													mdi-help-circle-outline
													</v-icon>
												</template>
												Ingrese el valor total de la multa en dólares (US). Si no tiene valores para el mes coloque 0.
											</v-tooltip>
										</template>
									</vuetify-money> 
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12" md="4">
									<v-text-field v-model="editItem.porcentaje_multa" prefix="%" type="number" label="Porcentaje de Multa" 
										:rules="[v => !!v || 'Campo requerido']" disabled required></v-text-field>
								</v-col>
								<v-col cols="12" md="4">
									<v-text-field :value="editItem.trm | humanFormat" label="TRM" prefix="$" disabled></v-text-field>
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
	import "@/plugins/vuetify-money.js"

	export default {
    name: 'EditMulta',
    data: () => ({
			valid: true,
			options: {
				locale: "en-US",
        decimal: ',',
        thousands: '.',
        prefix: '$ ',
        // suffix: ' #',
        precision: 2,
			},
			snackbar: false,
			text: '',
			timeout: 3000
		}),
    methods: {
			change_proyecto(value){
				let proyecto = this.dataProyectos.filter((e)=>(e.id==value))
				let pais = proyecto[0].proyecto_pais.split(" -- ")[1]
				this.editItem.pais = pais
				this.select_pais(pais)
			},
			select_trm(id){
				let item = this.dataPeriodos.find(el => el.id === id)
				if(this.editItem.pais == 'COLOMBIA'){this.editItem.trm = item.trm_co}
				if(this.editItem.pais == 'HONDURAS'){this.editItem.trm = item.trm_hn}
				if(this.editItem.pais == 'COSTA RICA'){this.editItem.trm = item.trm_cr}
				if(this.editItem.pais == 'GUATEMALA'){this.editItem.trm = item.trm_gt}
				if(this.editItem.pais == 'NICARAGUA'){this.editItem.trm = item.trm_ni}
				if(this.editItem.pais == 'EL SALVADOR'){this.editItem.trm = item.trm_sv}
			},
			select_pais(v){
				if (this.editItem.periodo != ""){
					let id;
					if(typeof(this.editItem.periodo) === 'object'){
						id = this.editItem.periodo.id
					}else{
						id = this.editItem.periodo
					}
					let item = this.dataPeriodos.find(el => el.id === id)
					if(v == 'COLOMBIA'){this.editItem.trm = item.trm_co}
					if(v == 'HONDURAS'){this.editItem.trm = item.trm_hn}
					if(v == 'COSTA RICA'){this.editItem.trm = item.trm_cr}
					if(v == 'GUATEMALA'){this.editItem.trm = item.trm_gt}
					if(v == 'NICARAGUA'){this.editItem.trm = item.trm_ni}
					if(v == 'EL SALVADOR'){this.editItem.trm = item.trm_sv}
				}else{
					this.snackbar = true
					this.text = 'Para calcular el trm es necesario que selecciones un periodo'
				}
			},
			change_Facturacion(v){
				let value = parseFloat(v.srcElement.value.replace(',', ''))
				if (value !== "" || value != 0 ){
          this.editItem.porcentaje_multa = parseFloat((this.editItem.valor_multa / value)*100).toFixed(2)
        }else{
          this.editItem.porcentaje_multa = 0
        }
			},
			change_Multa(v){
				let value = parseFloat(v.srcElement.value.replace(',', ''))
				if (value !== "" || value != 0 ){
          this.editItem.porcentaje_multa = parseFloat((value / this.editItem.valor_facturacion)*100).toFixed(2)
        }else{
          this.editItem.porcentaje_multa = 0
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
						this.$store.commit("updateDataMultas", data)
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
						this.$store.commit("newMulta", data)
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
					let pj = this.editItem.pj
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
					if (typeof(pj) !== "object"){
						this.editItem.pj = {"id": pj}
					}else{
						this.editItem.pj = {"id": this.editItem.pj.id}
					}
					if (this.formTitle === 'Editar'){
						this.put(`api/multas/${this.editItem.id}`, this.editItem)
					}else{
						this.post('api/multas', this.editItem)
					}
					this.close()
				}
      },
		},
    computed: {
			...mapState(['dialog', 'dataProyectos', 'dataPeriodos', 'dataPjs', 'dataTrm', 
				'editItem', 'editItemIndex', 'formTitle'
			]),
    },
  };
</script>