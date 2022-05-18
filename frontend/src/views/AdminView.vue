<template>
  <div class="admin-wrapper">
    <div class="container">
      <div class="header">
        <h1 class="title">Admin-Panel: <span>Eventmanagement</span></h1>
        <select class="selection" v-model="eventIndex" @change="onSelectionChange">
          <option :value="-1">-- Create new Event --</option>
          <option v-for="(e, i) in events" :value="i">{{e.scheduledAt.toFormat("dd.MM.yyyy HH:mm")}}</option>
        </select>
      </div>
      <div class="panel" v-if="editingEvent !== null || selectedEvent !== null">
        <div v-if="editingEvent !== null" class="form">
          <div class="row">
            <div class="form-control required">
              <label>Theme:</label>
              <input type="text" v-model="editingEvent.theme" />
            </div>
            <div class="form-control">
              <label>Are Teams allowed?:</label>
              <input type="checkbox" v-model="editingEvent.teamsAllowed" />
            </div>
          </div>
          <div class="row">
            <div class="form-control">
              <label>Scheduled at:</label>
              <DateTimePicker v-model="editingEvent.scheduledAt"/>
            </div>
            <div class="form-control">
              <label>Submissions go until:</label>
              <DateTimePicker v-model="editingEvent.submissionGoesUntil"/>
            </div>
            <div class="form-control">
              <label>Event goes until:</label>
              <DateTimePicker v-model="editingEvent.goesUntil" />
            </div>
          </div>
          <div class="row" style="justify-content: center; align-items: center; margin-top: 1rem">
            <button class="button filled" @click="saveEditingEvent">{{editingEvent.id < 0 ? 'Create Event' : 'Save Event'}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from "vue-property-decorator";
import {GameJamEvent} from "@/types/dto";
import RestApi from "@/libs/rest-api";
import DateTimePicker from "@/components/DateTimePicker.vue";
import { formatDate } from "@/libs/date-utils";
import {DateTime} from "luxon";

@Component({
  components: {DateTimePicker},
})
export default class AdminView extends Vue {

  private events: GameJamEvent[] = [];
  private eventIndex: number = -2;
  private editingEvent: GameJamEvent|null = null;

  private formatDate = formatDate;

  async mounted() {
    try {
      this.events = (await RestApi.get<GameJamEvent[]>("/event/list")).data;
    } catch (e) {
      console.error(e);
    }
  }

  private async onSelectionChange() {
    if (this.eventIndex === -1) {
      this.editingEvent = AdminView.defaultEvent;
    }
  }

  private async saveEditingEvent() {
    if (this.editingEvent === null) {
      return;
    }

    if ((this.editingEvent.theme?.trim().length || 0) <= 0) {
      return;
    }

    this.toggleSpinner(true);

    try {

      if (this.editingEvent.id < 0) {
        const createdEvent = (await RestApi.post<GameJamEvent>("/event", {
          ...this.editingEvent,
          scheduledAt: this.editingEvent.scheduledAt.toISO(),
          submissionGoesUntil: this.editingEvent.submissionGoesUntil.toISO(),
          goesUntil: this.editingEvent.goesUntil.toISO(),
        })).data;
        this.events.push(createdEvent);
        this.events.sort((a, b) => a.scheduledAt.toMillis() - b.scheduledAt.toMillis());
        this.editingEvent = null;
        this.eventIndex = this.events.indexOf(createdEvent);
      } else {
        await RestApi.patch("/event", {
          ...this.editingEvent,
          scheduledAt: this.editingEvent.scheduledAt.toISO(),
          submissionGoesUntil: this.editingEvent.submissionGoesUntil.toISO(),
          goesUntil: this.editingEvent.goesUntil.toISO(),
        });
      }

    } catch (e) {
      console.error(e);
    } finally {
      this.toggleSpinner(false);
    }
  }

  private get selectedEvent(): GameJamEvent|null {
    if (this.eventIndex < 0) {
      return null;
    }
    return this.events[this.eventIndex];
  }

  private static get defaultEvent(): GameJamEvent {
    return {
      id: -1,
      theme: "",
      scheduledAt: DateTime.now(),
      submissionGoesUntil: DateTime.now().plus({days: 3}),
      goesUntil: DateTime.now().plus({days: 5}),
      teamsAllowed: false,
      resultsShown: false
    };
  }

  @Inject("toggle-spinner")
  private toggleSpinner!: (show: boolean) => void;
}
</script>

<style scoped lang="scss">
.admin-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;

  .container {
    display: flex;
    flex-direction: column;
    width: calc(100% - 4rem);
    height: calc(100vh - 4rem);
    margin: 2rem;
    gap: 1rem;
    .header {
      display: flex;
      gap: 0.8rem;
      align-items: center;
      .title {
        flex-shrink: 0;
        margin: 0;
        font-weight: 900;
        span {
          color: #3b82f6;
        }
      }
      .selection {
        flex-shrink: 0;

      }
    }
    .panel {
      display: flex;
      background-color: rgba(30, 41, 59, 0.53);
      width: calc(100% - 3rem);
      padding: 1.5rem;
      border-radius: 1.5rem;
      filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.77));
    }
  }
}
</style>
