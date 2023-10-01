export class Button {
    constructor(label, onClick) {
      this.label = label;
      this.onClick = onClick;
    }

    render() {
      const button = document.querySelector(this.label);
      button.addEventListener('click', this.onClick);
    }
}
