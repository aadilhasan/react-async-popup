import Base from "../base";
import cssStyles from "./style.module.scss";
import cerateNew from "../new"
import { ComponentType } from "../enums";

class Confirm extends Base {
  get styles() { return cssStyles; }
  get type() {
    return ComponentType.Confirm
  }
}

Confirm.new = cerateNew(Confirm);

export default Confirm;
