
import Base from "../base";
import "./styles.scss";
import cerateNew from "../new"
import { ComponentType } from "../enums";

class Confirm extends Base {
  get type() {
    return ComponentType.Confirm
  }
}

Confirm.new = cerateNew(Confirm);

export default Confirm;