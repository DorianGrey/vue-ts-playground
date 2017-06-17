import {Component, p, Prop, Vue} from "av-ts";
import {TodoModel} from "./todo.state";

@Component
export default class TodoEntry extends Vue {
  @Prop todo = p({
    type:     Object,
    required: true
  }) as TodoModel;
}
