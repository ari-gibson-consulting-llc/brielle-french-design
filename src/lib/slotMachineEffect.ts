type SlotMachineEffectOptions = {
  wordList: string[];
  container: HTMLElement;
  minItemsToPassBy: number;
  maxItemsToPassBy: number;
};

export class SlotMachineEffect {
  wordList: string[];
  container: HTMLElement;
  min: number;
  max: number;
  itemsContainer: HTMLDivElement;

  constructor(options: SlotMachineEffectOptions) {
    const { wordList, container, minItemsToPassBy, maxItemsToPassBy } = options;

    // if (wordList.length < 5)
    //   throw new Error("wordList must have at least 5 items");

    // if (minItemsToPassBy > maxItemsToPassBy)
    //   throw new Error("minItemsToPassBy must be less than maxItemsToPassBy");

    // if (minItemsToPassBy > wordList.length)
    //   throw new Error("minItemsToPassBy must be less than wordList length");

    // if (maxItemsToPassBy > wordList.length)
    //   throw new Error("maxItemsToPassBy must be less than wordList length");

    this.wordList = wordList;
    this.container = container;
    this.min = minItemsToPassBy;
    this.max = maxItemsToPassBy;
    this.itemsContainer = document.createElement("div");
  }

  attach() {
    const mask = document.createElement("div");
    mask.classList.add("slot-machine--mask");

    this.itemsContainer.classList.add("slot-machine--items-container");

    this.container.classList.add("slot-machine");
    this.container.append(mask);
    mask.append(this.itemsContainer);

    this.wordList.map((text) => {
      const elem = document.createElement("div");
      elem.classList.add("slot-machine--item");
      elem.innerText = text;
      this.itemsContainer.append(elem);
    });
  }

  animate() {
    const frame = () => {
      top += 20;
      this.itemsContainer.style.top = `${top}px`;
      if (top >= 0) {
        clearInterval(int);
      }
    };
    const wordIndex = this.indexToRotateTo(this.wordList.length);
    let top = -wordIndex * 300;
    const int = setInterval(frame, 4, top);

    setTimeout(() => {
      this.popPushNItems(wordIndex);
      this.container.style.top = "0px";
    }, 300);
  }

  private indexToRotateTo(wordListLength: number): number {
    return Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
  }

  private popPushNItems(n: number): void {
    const children = [
      ...this.itemsContainer.querySelectorAll(".slot-machine--item"),
    ];
    const slicedChildren = children.slice(0, n);
    let lastChild = children.at(-1)!;
    slicedChildren.forEach((child) => {
      lastChild!.parentNode!.insertBefore(child, lastChild.nextSibling);
      lastChild = child;
    });
    if (n === children.length) {
      this.popPushNItems(1);
    }
  }
}
