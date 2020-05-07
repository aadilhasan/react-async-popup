
import Base from "../base";
import "./styles.scss";
import createNew from "../new"
import { ComponentType } from "../enums";

class Confirm extends Base {
  get type() {
    return ComponentType.Confirm
  }
}

Confirm.new = createNew(Confirm);

export default Confirm;