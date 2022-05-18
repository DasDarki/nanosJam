<template>
  <input v-bind="$attrs" v-model="inputValue" placeholder="dd.MM.yyyy hh:mm" @focusout="onFocusOut" @change="onChange"/>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {DateTime} from "luxon";

@Component({
  components: {}
})
export default class DateTimePicker extends Vue {

  @Prop({required: true})
  private value!: DateTime;

  private inputValue: string = "";
  private countdown: number = 0;

  mounted() {
    const month = this.value.month.toString().padStart(2, "0");
    const day = this.value.day.toString().padStart(2, "0");
    const hour = this.value.hour.toString().padStart(2, "0");
    const minute = this.value.minute.toString().padStart(2, "0");
    this.inputValue = `${day}.${month}.${this.value.year} ${hour}:${minute}`;
  }

  private onChange() {
    this.countdown = setTimeout(() => {
      this.emitDate();
    }, 5000);
  }

  private onFocusOut() {
    clearTimeout(this.countdown);

    this.emitDate();
  }

  private emitDate() {
    const date = this.convertDate();
    if (date) {
      if (date < DateTime.now()) {
        return;
      }

      this.$emit("input", date);
      this.$emit("change", date);
    }
  }

  private convertDate(): DateTime|null {
    try {
      const datetime = DateTime.fromFormat(this.inputValue, "dd.MM.yyyy HH:mm");
      if (datetime.isValid) {
        return datetime;
      }

      return null;
    } catch {
      return null;
    }
  }
}
</script>
