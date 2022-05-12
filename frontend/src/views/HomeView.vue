<template>
  <div class="wrapper">
    <div class="upper-container">
      <div class="banner">
        <span style="font-weight: 900; font-size: 7rem">nanos</span>
        <img src="@/assets/favicon.png" alt="logo" style="width: 16rem; height: 16rem"/>
      </div>

      <div class="event" v-if="event">

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {GameJamEvent} from "@/types/dto";
import RestApi from "@/libs/rest-api";

@Component({
  components: {}
})
export default class HomeView extends Vue {

  private event: GameJamEvent|null = null;

  mounted() {
    RestApi.get<GameJamEvent>(`/event`).then(res => {
      this.event = res.data;
    }).catch(err => {
      console.log(err);
    });
  }
}
</script>

<style scoped lang="scss">
  .wrapper {
    width: 100%;

    .upper-container {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .banner {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }

      .event {
        display: flex;
      }
    }
  }
</style>
