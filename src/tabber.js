import { make } from '@groupher/editor-utils'

import DeleteIcon from "./icon/delete.svg";
import "./tabber.css";

const ICON_ASSETS = "https://cps-oss.oss-cn-shanghai.aliyuncs.com/icons/pl/";

const alias = text => {
  switch (text) {
    case "javascript":
      return "js..";
    case "typescript":
      return "ts..";
    case "csharp":
      return "c#..";
    case "python":
      return "py..";
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
    this.sliderEl = null;

    this.switchTab = switchTab;
    this.removeTab = removeTab;
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
      deleteBtn: "delete-btn"
    };
  }

  /**
   * generate uniq string
   *
   * @param {number: number, prefix: string}
   * @return {string}
   * @private
   */
  randomStr(length, prefix = "tab_") {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return prefix + result;
  }

  /**
   * build the bottom slider
   *
   * @param {number} count - count of tabs
   * @returns {HTMLElement}
   * @public
   */
  buildSlider(count) {
    this.sliderEl = make("div", ["slider", `slider-width-${count}`], {
      innerHTML: '<div class="indicator" />'
    });

    return this.sliderEl;
  }

  /**
   *
   * move bottom indicator by javascript
   * NOTE:  use css will cause global name conflict
   * 使用 CSS 会导致多个 code block tabs 相互冲突, 比如第二个 code 块在切换
   * tab 的时候会将上一个代码块的 indicator 切到第一个
   *
   * @param {number}  - count of tabs
   * @returns {void}
   * @public
   */
  moveIndicator(index) {
    const unit = index < 0 ? 0 : index * 100;

    this.sliderEl.style.transform = `translateX(${unit}%)`;
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
      const element = langs[i];
      const tab_id = this.randomStr(4);

      const inputEl = make("input", null, {
        type: "radio",
        id: tab_id,
        name: "tab-control"
      });

      container.appendChild(inputEl);

      const liEl = make("li", null, {
        innerHTML: `
          <label for="${tab_id}" role="button">
            <div class="lang">
              <img src=${ICON_ASSETS + element.lang + ".png"} />
              <div class="title">${alias(element.lang)}</div>
            </div>
          </label>
        `
      });

      // first tab should not be deleted
      if (i !== 0) {
        const deleteBtnEl = make("div", [this.CSS.deleteBtn], {
          innerHTML: DeleteIcon
        });
        liEl.appendChild(deleteBtnEl);

        deleteBtnEl.addEventListener("click", ev => {
          ev.stopPropagation();
          this.removeTab(element);
        });
      }

      liEl.addEventListener("click", () => this.switchTab(element));

      ulEl.appendChild(liEl);
    }

    container.appendChild(ulEl);
    container.appendChild(this.buildSlider(langs.length));

    return container;
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

// const container2 = this._make('div', [this.CSS.tabsWrapper], {
//   innerHTML: `
//   <div class="cdx-code-tabs">
//     <input type="radio" id="${tab1_id}" name="tab-control" checked>
//     <input type="radio" id="${tab2_id}" name="tab-control">
//     <input type="radio" id="${tab3_id}" name="tab-control">
//     <input type="radio" id="${tab4_id}" name="tab-control">
//     <input type="radio" id="${tab5_id}" name="tab-control">
//     <ul>
//       <li>
//         <label for="${tab1_id}" role="button">
//           <div class="lang">
//             <img src=${ICON_ASSETS + 'javascript.png'} />
//             <div>javascript</div>
//           </div>
//         </label>
//       </li>
//       <li>
//         <label for="${tab2_id}" role="button">
//           <div class="lang">
//             <img src=${ICON_ASSETS + 'elixir.png'} />
//             <div>elixir</div>
//           </div>
//         </label>
//       </li>
//       <li>
//         <label for="${tab3_id}" role="button">
//           <div class="lang">
//             <img src=${ICON_ASSETS + 'ruby.png'} />
//             <div>ruby</div>
//           </div>
//         </label>
//       </li>

//       <li>
//         <label for="${tab4_id}" role="button">
//           <div class="lang">
//             <img src=${ICON_ASSETS + 'java.png'} />
//             <div>java</div>
//           </div>
//         </label>
//       </li>

//       <li>
//         <label for="${tab5_id}" role="button">
//           <div class="lang">
//             <img src=${ICON_ASSETS + 'clojure.png'} />
//             <div>colojure</div>
//           </div>
//         </label>
//       </li>
//     </ul>

//     <div class="slider">
//       <div class="indicator" />
//     </div>
//   </div>
// `
// })
