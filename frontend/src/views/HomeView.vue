<template>
  <div class="wrapper">
    <div class="upper-container">
      <div class="banner">
        <span style="font-weight: 900; font-size: 7rem">nanos</span>
        <img src="@/assets/favicon.png" alt="logo" style="width: 16rem; height: 16rem"/>
      </div>

      <div class="event" v-if="event">
        <div class="event-info" v-if="eventStage === EventStage.Planned">
          <span style="font-weight: 900; font-size: 4rem">Next Event starts in:</span>
          <span style="font-weight: 900; font-size: 3.8rem; color: rgba(59,130,246,1)">{{eventCountdownText}}</span>
        </div>
        <div class="event-info" v-else-if="eventStage === EventStage.InProgress">
          <span style="font-weight: 900; font-size: 4rem">The Theme is:</span>
          <span style="font-weight: 900; font-size: 3.8rem; color: rgba(59,130,246,1)">{{event.theme}}</span>
          <span style="font-weight: 900; font-size: 4rem">Submissions go until:</span>
          <span style="font-weight: 900; font-size: 3.8rem; color: rgba(59,130,246,1)">{{eventCountdownText}}</span>
        </div>
        <div class="event-info" v-else-if="eventStage === EventStage.Rating">
          <span style="font-weight: 900; font-size: 4rem">Submissions are closed:</span>
          <span style="font-weight: 900; font-size: 3.8rem; color: rgba(59,130,246,1)">Vote now for Winners!</span>
        </div>
        <button class="button filled" style="font-size: 1.5rem; margin-top: 1rem" @click="$router.push({name: 'login'})">Participate</button>
      </div>
    </div>

    <div class="rules-wrapper">
      <div class="rules">
        <span style="font-weight: 900; font-size: 3rem">Rules:</span>
        <span style="font-weight: 800; font-size: 1.7rem; color: rgba(59,130,246,1)" v-for="(r, i) in rules"><span style="color: #fff">{{i + 1}}. </span>{{r}}</span>
        <span v-if="event && event.teamsAllowed" style="font-weight: 800; font-size: 1.7rem; color: rgba(59,130,246,1)"><span style="color: #fff">{{rules.length}}. </span>Teams are allowed. Max Team Size: <b style="color: #ee4242">3</b></span>
        <span v-else-if="event && !event.teamsAllowed" style="font-weight: 800; font-size: 1.7rem; color: rgba(59,130,246,1)"><span style="color: #fff">{{rules.length}}. </span>Teams are <b style="color: #ee4242">not</b> allowed.</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {GameJamEvent} from "@/types/dto";
import RestApi from "@/libs/rest-api";
import {EventStage} from "@/types/enum";
import {DateTime} from "luxon";
import rules from "@/assets/jsons/rules.json";

@Component({
  components: {}
})
export default class HomeView extends Vue {

  private event: GameJamEvent|null = null;
  private EventStage = EventStage;
  private rules = rules;
  private eventCountdown: number = 0;
  private eventCountdownText: string = "Loading...";

  mounted() {
    this.load();
  }

  destroyed() {
    clearInterval(this.eventCountdown);
  }

  private load() {
    RestApi.get<GameJamEvent>(`/event`).then(res => {
      this.event = res.data;

      if (this.event) {
        switch (this.eventStage) {
          case EventStage.Planned:
            this.startingCountdown(this.event.scheduledAt, () => {
              this.eventCountdownText = "Showing Theme...";
              clearInterval(this.eventCountdown);
              this.load();
            });
            break;
          case EventStage.InProgress:
            this.startingCountdown(this.event.submissionGoesUntil, () => {
              this.eventCountdownText = "Closing...";
              clearInterval(this.eventCountdown);
            });
            break;
        }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  private startingCountdown(date: DateTime, cb: () => void) {
    this.eventCountdownText = "Loading...";
    this.eventCountdown = setInterval(() => {
      const diff = date.diff(DateTime.now(), ['days', 'hours', 'minutes', 'seconds']);

      let text = "";
      if (diff.days > 0) {
        text += `${diff.days} Days `;
      }

      if (diff.hours > 0) {
        text += `${diff.hours} Hours `;
      }

      if (diff.minutes > 0) {
        text += `${diff.minutes} Minutes `;
      }

      const seconds = Math.floor(diff.seconds);
      if (seconds > 0) {
        text += `${seconds} Seconds`;
      }

      this.eventCountdownText = text;

      if (this.eventCountdownText.trim() === "") {
        cb();
      }
    }, 1000);
  }

  private get eventStage(): EventStage {
    if (!this.event) {
      return EventStage.NotPlanned;
    }

    const now = DateTime.now();
    if (now < this.event.scheduledAt) {
      return EventStage.Planned;
    } else if (now >= this.event.scheduledAt && now < this.event.submissionGoesUntil) {
      return EventStage.InProgress;
    } else if (now >= this.event.submissionGoesUntil && now < this.event.goesUntil) {
      return EventStage.Rating;
    } else {
      return EventStage.Finished;
    }
  }
}
</script>

<style scoped lang="scss">
  .wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;

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
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .event-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }
      }
    }

    .rules-wrapper {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .rules {
        width: 70%;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
