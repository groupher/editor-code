import { make } from "@groupher/editor-utils";

import DeleteIcon from "./icon/delete.svg";
import "./style/tabber.css";

const ICON_ASSETS = "https://cps-oss.oss-cn-shanghai.aliyuncs.com/icons/pl/";

const alias = (text) => {
  switch (text) {
    // case "javascript":
    // return "js";
    case "typescript":
      return "ts";
    case "csharp":
      return "c#..";
    case "r":
      return "R";
    default:
      return text;
  }
};

export default class Tabber {
  constructor({ api, config, switchTab, removeTab }) {
    this.api = api;
    this.i18n = config.i18n || "en";
    this.config = config;

    this._data = {};

    this.switchTab = switchTab;
    this.removeTab = removeTab;

    this.activeTabIndex = 0;
  }

  /**
   * @return {EmbedData}
   */
  get data() {
    return this._data;
  }

  /**
   * set saved data by type
   * // TODO:  move data to index.js
   */
  // setData(type = '', value) {
  //   this._data = {
  //     type,
  //     provider: encodeURI(value) || '',
  //     value: encodeURI(value) || '',
  //   };
  // }

  /**
   * CSS classes
   * @constructor
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      tabsWrapper: "cdx-code-tabs-wrapper",
      codeTabs: "cdx-code-tabs",
      deleteBtn: "delete-btn",
      labelActive: "active",
    };
  }

  /**
   * generate uniq string
   *
   * @param {langs: array[{index: number, lang: string}]}, langs arrays
   * @return {HTMLElement}
   * @public
   */
  buildTabs(langs) {
    const container = make("div", [this.CSS.codeTabs], {});
    const ulEl = make("ul", null, {});

    for (let i = 0; i < langs.length; i++) {
      const langObj = langs[i];
      const index = langObj.index;

      const liEl = this.buildLabel(langObj);

      const handleTabClick = () => {
        this.setActiveTab(liEl);
        this.activeTabIndex = langObj.index;
        this.switchTab(langObj);
      };

      // first tab should not be deleted
      if (i !== 0) {
        const deleteBtnEl = make("div", [this.CSS.deleteBtn], {
          innerHTML: DeleteIcon,
        });
        liEl.appendChild(deleteBtnEl);

        deleteBtnEl.addEventListener("click", (ev) => {
          ev.stopPropagation();
          this.removeTab(langObj);
        });
      }

      // liEl.removeEventListener("click", handleTabClick);
      liEl.addEventListener("click", handleTabClick);

      ulEl.appendChild(liEl);
    }

    container.appendChild(ulEl);

    return container;
  }

  /**
   * set active class to current label
   * @param {HTMLElement} labelEl
   * @memberof Tabber
   */
  setActiveTab(labelEl) {
    const targetActiveLabel = labelEl.querySelector("label");
    const curActiveLabel = labelEl.parentNode.querySelector("li label.active");

    if (curActiveLabel) curActiveLabel.classList.remove("active");
    if (targetActiveLabel) targetActiveLabel.classList.add("active");
  }

  buildLabel(langObj) {
    const wrapper = make("li");

    const labelClass = langObj.index == this.activeTabIndex ? "active" : "";

    const labelEl = make("label", labelClass, {
      "data-index": langObj.index,
    });
    const imgEl = make("img", "", {
      src: ICON_ASSETS + langObj.lang + ".png",
    });

    const titleEl = make("div", "title", {
      innerHTML: alias(langObj.lang),
    });

    labelEl.appendChild(imgEl);
    labelEl.appendChild(titleEl);

    wrapper.appendChild(labelEl);

    return wrapper;
    // <label data-index="${index}">
    //   <img src=${ICON_ASSETS + element.lang + ".png"} />
    //   <div class="title">${alias(element.lang)}</div>
    // </label>
  }

  /**
   * render tabs, maximum is 5
   *
   * @param {array} lang labels
   * @return {HTMLElement}
   * @public
   */
  renderTabs(langs) {
    const container = make("div", [this.CSS.tabsWrapper], {});
    this.tabsEl = this.buildTabs(langs);

    container.appendChild(this.tabsEl);

    return container;
  }
}
