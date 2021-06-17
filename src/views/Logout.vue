<template>
  <div></div>
</template>

<script>
export default {
  props:{},
  created(){
    this.$store.dispatch("destroyDataUser").then( () => {
      location.href ="/login";
    })
  }
}
</script>