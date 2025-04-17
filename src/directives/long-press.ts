// src/directives/long-press.ts

import type { DirectiveBinding } from "vue";

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (typeof binding.value !== "function") {
      console.warn("v-long-press 需要传入一个函数");
      return;
    }

    let pressTimer: NodeJS.Timeout | null = null;

    const start = (e: Event) => {
      if (e.type === "click" && (e as MouseEvent).button !== 0) return;

      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          binding.value(e);
        }, 600);
      }
    };

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    // 事件绑定
    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start);
    el.addEventListener("click", cancel);
    el.addEventListener("mouseout", cancel);
    el.addEventListener("touchend", cancel);
    el.addEventListener("touchcancel", cancel);
  },

  unmounted(el: HTMLElement) {
    el.removeEventListener("mousedown", () => {});
    el.removeEventListener("touchstart", () => {});
    el.removeEventListener("click", () => {});
    el.removeEventListener("mouseout", () => {});
    el.removeEventListener("touchend", () => {});
    el.removeEventListener("touchcancel", () => {});
  },
};
