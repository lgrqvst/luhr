import keys from '../data/keys';

export default class InputManager {
  constructor() {
    this.pressedKeys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.tappedKeys = {
      esc: false,
      enter: false
    };
  }

  subscribe = () => {
    window.addEventListener('keydown', e => this.handleKeys(e, true));
    window.addEventListener('keyup', e => this.handleKeys(e, false));
  };

  unsubscribe = () => {
    window.removeEventListener('keyup', this.handleKeys);
    window.removeEventListener('keydown', this.handleKeys);
  };

  resetTaps() {
    this.tappedKeys = {
      esc: false,
      enter: false
    };
    return this.tappedKeys;
  }

  handleKeys(e, value) {
    let pressedKeys = this.pressedKeys;
    let tappedKeys = this.tappedKeys;
    switch (e.keyCode) {
      /*
       * PRESSING
       */

      case keys.W:
      case keys.UP:
        pressedKeys.up = value;
        break;
      case keys.A:
      case keys.LEFT:
        pressedKeys.left = value;
        break;
      case keys.S:
      case keys.DOWN:
        pressedKeys.down = value;
        break;
      case keys.D:
      case keys.RIGHT:
        pressedKeys.right = value;
        break;
      case keys.SPACE:
        pressedKeys.space = value;
        break;
      case keys.TAB:
        pressedKeys.tab = value;
        break;

      /*
       * TAPPING
       */
      case keys.ENTER:
        tappedKeys.enter = value ? false : true;
        break;
      case keys.ESC:
        tappedKeys.esc = value ? false : true;
        break;

      default:
        // Listen pal if it ain't one of the above, I don't want ya to do NUTHIN
        break;
    }
    this.pressedKeys = pressedKeys;
    this.tappedKeys = tappedKeys;
  }
}
