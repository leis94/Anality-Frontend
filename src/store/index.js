import Vue from 'vue'
import Vuex from 'vuex'
import http from '../plugins/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    drawer: false,
    dialog: false,
    dialog_newMonth: false,
    username: (process.env.VUE_APP_MODE != 'devp') ? null : "Robinson Giraldo Naranjo",
    email: (process.env.VUE_APP_MODE != 'devp') ? null : "rgiraldo@itsinfocom.com",
    rol: (process.env.VUE_APP_MODE != 'devp') ? null : "PMO",
    permisos: (process.env.VUE_APP_MODE != 'devp') ? null : "rw",
    pais: localStorage.getItem('pais') || (process.env.VUE_APP_MODE != 'devp') ? null : ['COLOMBIA', 'HONDURAS', 'COSTA RICA'],
    formularios: localStorage.getItem('formularios') || (process.env.VUE_APP_MODE != 'devp') ? null : ['TODOS'],
    paises: [ 
      {id: "COLOMBIA", text: "COLOMBIA"},
      {id: "HONDURAS", text: "HONDURAS"},
      {id: "COSTA RICA", text: "COSTA RICA"},
      {id: "GUATEMALA", text: "GUATEMALA"},
      {id: "NICARAGUA", text: "NICARAGUA"},
      {id: "EL SALVADOR", text: "EL SALVADOR"},
    ],
    semanas: [ 
      {id: "S1", text: "S1"}, 
      {id: "S2", text: "S2"}, 
      {id: "S3", text: "S3"}, 
      {id: "S4", text: "S4"}
    ],
    tipos: ["INCIDENTE", "REQUERIMIENTO"],
    tipo_formato: ["PORCENTAJE", "DECIMAL"],
    dataMultas: [],
    dataOcupacion: [],
    dataAns: [],
    dataVolumetrias: [],
    dataHrsLabor: [],
    dataProyectos: [],
    dataProyectosOcupacion: [],
    dataPeriodos: [],
    dataTrm: [],
    dataPjs: [],
    dataServicios: [],
    dataUsersOcupacion: [],
    editItem: {},
    editItemIndex: -1,
    formTitle: '',
  },
  getters: {
    getPaises(state){
      return state.paises
    },
    getFormularios(state){
      return state.formularios
    },
    getPaisPM(state){
      return state.pais
    },
    getDrawer(state){
      return state.drawer
    },
    getDataMultas: (state) => {
      return state.dataMultas
    },
    getDataOcupacion: (state) => {
      return state.dataOcupacion
    },
    getDataHrsLabor: (state) => {
      return state.dataHrsLabor
    },
    getDataVolumetrias: (state) => {
      return state.dataVolumetrias
    },
    getDataAns: (state) => {
      return state.dataAns
    },
    showEdited(state){
      return state.dialog
    },
  },
  mutations: {
    setLoading(state, value){
      state.loading = value
    },
    retrieveDataUser(state, data){
      state.username = data.username
      state.email = data.email
      state.rol = data.rol
      state.permisos = data.permisos
      state.pais = data.pais
      state.formularios = data.formularios
    },   
    destroyDataUser(state){
      state.username = null
      state.email = null
      state.rol = null
      state.permisos = null
    },
    setDrawer(state, val){
      state.drawer = val
    },
    dataMultasApi: (state, data) => {
      state.dataMultas = data
    },
    dataOcupacionApi: (state, data) => {
      state.dataOcupacion = data
    },
    dataUsersOcupacionApi: (state, data) => {
      state.dataUsersOcupacion = data
    },
    dataHrsLaborApi: (state, data) => {
      state.dataHrsLabor = data
      state.loading = !state.loading
    },
    dataAnsApi: (state, data) => {
      state.dataAns = data
      state.loading = !state.loading
    },
    dataVolumetriasApi: (state, data) => {
      state.dataVolumetrias = data
    },
    deleteItemMultas: (state, item ) => {
      let index = state.dataMultas.indexOf(item)
      state.dataMultas.splice(index, 1)
    },
    deleteItemOcupacion: (state, item ) => {
      let index = state.dataOcupacion.indexOf(item)
      state.dataOcupacion.splice(index, 1)
    },
    deleteItemHrsLabor: (state, item ) => {
      let index = state.dataHrsLabor.indexOf(item)
      state.dataHrsLabor.splice(index, 1)
    },
    deleteItemVolumetrias: (state, item ) => {
      let index = state.dataVolumetrias.indexOf(item)
      state.dataVolumetrias.splice(index, 1)
    },
    deleteItemAns: (state, item ) => {
      let index = state.dataAns.indexOf(item)
      state.dataAns.splice(index, 1)
    },
    updateShowEdit: (state) => {
      state.dialog = !state.dialog
    },
    updateShowNewMonth: (state) => {
      state.dialog_newMonth = !state.dialog_newMonth
    },
    dataProyectosApi: (state, data ) => {
      state.dataProyectos = data
    },
    dataProyectosOcupacionApi: (state, data ) => {
      state.dataProyectosOcupacion = data
    },
    dataPeridosApi: (state, data ) => {
      state.dataPeriodos = data
    },
    dataPjsApi: (state, data ) => {
      state.dataPjs = data
    },
    dataServiciosApi: (state, data ) => {
      state.dataServicios = data
    },
    dataTrmApi: (state, data ) => {
      state.dataTrm = data
    },
    updateEditItem: (state, item) => {
      // console.log("rgn", item)
      state.editItem = Object.assign({}, item)
    },
    setEditItemIndex: (state, index) => {
      state.editItemIndex = index
    },
    updateDataMultas: (state, data) => {
      Object.assign(state.dataMultas[state.editItemIndex], data)
    },
    newMulta: (state, data) => {
      state.dataMultas.unshift(data)
    },
    updateDataOcupacion: (state, data) => {
      Object.assign(state.dataOcupacion[state.editItemIndex], data)
    },
    newOcupacion: (state, data) => {
      state.dataOcupacion.unshift(data)
    },
    updateDataHrsLabor: (state, data) => {
      Object.assign(state.dataHrsLabor[state.editItemIndex], data)
    },
    newHrsLabor: (state, data) => {
      state.dataHrsLabor.unshift(data)
    },
    updateDataAns: (state, data) => {
      Object.assign(state.dataAns[state.editItemIndex], data)
    },
    newAns: (state, data) => {
      state.dataAns.unshift(data)
    },
    updateDataVolumetrias: (state, data) => {
      Object.assign(state.dataVolumetrias[state.editItemIndex], data)
    },
    newVolumetria: (state, data) => {
      state.dataVolumetrias.unshift(data)
    },
    setFormTitle: (state, title) => {
      state.formTitle = title
    },
  },
  actions: {
    setLoad({commit}){
      commit("setLoading", true)
    },
    loadDataAll({commit}){
      http.get("api/proyectos")
        .then(r => r.data)
        .then(response => {
          commit("dataProyectosApi", response)
        })
      http.get("api/periodos")
        .then(r => r.data)
        .then(response => {
          commit("dataPeridosApi", response)
        })
      http.get("api/pjs")
        .then(r => r.data)
        .then(response => {
          commit("dataPjsApi", response)
        })
      http.get("api/proyectos_ocupacion")
        .then(r => r.data)
        .then(response => {
          commit("dataProyectosOcupacionApi", response)
        })
    },
    loadDataMultas({commit}){
      http.get("api/multas")
      .then(r => r.data)
      .then(response => {
        commit("dataMultasApi", response)
        commit("setLoading", false)
      })
    },
    loadDataOcupacion({commit}){
      http.get("api/ocupacion")
      .then(r => r.data)
      .then(response => {
        commit("dataOcupacionApi",response)
        commit("setLoading", false)
      })
    },
    loadDataUsersOcupacion({commit}){
      http.get("api/get_users_ocupacion")
      .then(r => r.data)
      .then(response => {
        commit("dataUsersOcupacionApi",response)
      })
    },
    loadDataHrsLabor({commit}){
      http.get("api/hrs_labor")
      .then(r => r.data)
      .then(response => {
        commit("dataHrsLaborApi",response)
        commit("setLoading", false)
      })
    },
    loadDataVolumetrias({commit}){
      http.get("api/volumetrias")
      .then(r => r.data)
      .then(response => {
        commit("dataVolumetriasApi",response)
        commit("setLoading", false)
      })
    },
    loadDataAns({commit}){
      http.get("api/ans")
      .then(r => r.data)
      .then(response => {
        commit("dataAnsApi",response)
        commit("setLoading", false)
      })
    },
    retrieveDataUser({commit}){
      http.post("get_user_data/")
        .then(response =>{
          if (response.data.code == 200){
            localStorage.setItem('formularios', response.data.formularios)
            localStorage.setItem('pais', response.data.pais)
            commit('retrieveDataUser', response.data)
          }
        })
    },
    destroyDataUser({commit}){
      http.get("logout").
        then(() => {
          localStorage.removeItem('formularios')
          commit('destroyDataUser')
        })
    },
  },
})
