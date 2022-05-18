<template>
  <div id="app">
    <router-view/>

    <Blur v-if="showSpinner">
      <Spinner/>
    </Blur>
  </div>
</template>

<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
}
</style>
<script lang="ts">
import {Component, Provide, Vue} from "vue-property-decorator";
import Spinner from "@/components/Spinner.vue";
import Blur from "@/components/Blur.vue";

@Component({
  components: {Blur, Spinner}
})
export default class App extends Vue {

  private showSpinner: boolean = false;

  @Provide("toggle-spinner")
  private toggleSpinner(val: boolean) {
    this.showSpinner = val;
  }
}
</script>
