<template>
  <div style="text-align: center; margin-top: 200px">Reload</div>
</template>

<script>

export default {
  mounted() {
    this.$router.push(this.$route.query.page)
  }
}
</script>
