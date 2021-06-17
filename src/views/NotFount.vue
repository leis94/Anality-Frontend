<template>
  <v-container
    class="text-center"
    fill-height
    style="height: calc(100vh - 58px);"
  >
    <v-row align="center">
      <v-col>
        <h1 class="display-2 primary--text">Whoops, 404</h1>

        <p>Esta pagina no existe</p>

        <v-btn
          :to="`/app/`"
          color="primary"
          outlined
        >
          Salir
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'NotFound',
    props: {
    },
  }
</script>