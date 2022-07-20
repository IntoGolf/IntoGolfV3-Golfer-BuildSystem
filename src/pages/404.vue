<template>
  <div class="page-404">
    <div class="row">
      <div class="text-center m-auto col-10">
        <h1>404</h1>
        <h3>Oops, something went wrong!</h3>
        <p>
          The page you requested could not be found, was deleted or is
          temporarily unavailable.
        </p>
        <p>Please try again</p>
        <button
          type="button"
          class="btn btn-outline-primary w-100"
          @click="$router.go(-1)"
        >
          Return to previous page
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error",
};
</script>

<style lang="scss">
.page-404 {
  height: 100vh;
  padding-top: 4rem;
  background-image: url("../assets/images/404.svg");
  background-repeat: no-repeat;
  background-position: right top;

  h1 {
    font-size: 10rem;
    color: #88959e;
  }
}
</style>
