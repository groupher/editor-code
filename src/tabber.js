//
import './tabber.css';

const ICON_ASSETS = 'https://cps-oss.oss-cn-shanghai.aliyuncs.com/icons/pl/'

const alias = (text) => {
  switch (text) {
    case 'javascript': return 'js..'
    case 'typescript': return 'ts..'
    case 'php': return 'PHP'
    case 'csharp': return 'C#..'
    case 'python': return 'py..'
    case 'r': return 'R'
    default: return text
  }
}

export default class Tabber {
  constructor({ api, config }) {
    this.api = api
    this.i18n = config.i18n || 'en'
    this.config = config

    this._data = {}
    this.element = null;
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
      tabsWrapper: 'cdx-code-tabs-wrapper',
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
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return prefix + result;
  }

  // TODO:  refactor
  buildSlider(count) {
    const wrapper = this._make('div', ["slider", `slider-width-${count}`], {
      innerHTML: '<div class="indicator" />'
    })

    return wrapper
  }

  // TODO:  refactor
  buildTabs(langs) {
    const container = this._make('div', ['cdx-code-tabs'], {})
    const ul = this._make('ul', null, {})

    for (let i = 0; i < langs.length; i++) {
      const element = langs[i];
      const tab_id = this.randomStr(4)

      const inputEl = this._make('input', null, {
        type: 'radio',
        id: tab_id,
        name: 'tab-control',
      })


      container.appendChild(inputEl)

      const li = this._make('li', null, {
        innerHTML: `
          <label for="${tab_id}" role="button">
            <div class="lang">
              <img src=${ICON_ASSETS + element + '.png'} />
              <div class="title">${alias(element)}</div>
            </div>
          </label>
        `
      })

      li.addEventListener('click', function () {
        console.log('li click ev: ', element)
      })

      ul.appendChild(li)
    }

    container.appendChild(ul)
    container.appendChild(this.buildSlider(langs.length))

    return container
  }

  /**
   * render tabs, maximum is 5
   * 
   * @param {array} lang labels
   * @return {HTMLElement}
   * @public
   */
  renderTabs(langs) {
    const container = this._make('div', [this.CSS.tabsWrapper], {})
    this.tabsEl = this.buildTabs(langs)

    container.appendChild(this.tabsEl)

    return container
  }

  /**
   * Helper method for elements creation
   * @param tagName
   * @param classNames
   * @param attributes
   * @return {HTMLElement}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
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