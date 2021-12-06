class Ourpass {
  #isMobileDevice;
  #dStyle;
  #environments;
  #config;
  #logoSrc;

  constructor() {

    this.#isMobileDevice = /Mobi/i.test(window.navigator.userAgent)

    this.#dStyle = {
      ourpassLoaderWrapper: `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `,
      ourpassLoaderImg: `
      height: 80px;
      width: 80px;
      animation: loader 1s 1s infinite;
      display: block;
    `,
      ourpassLoaderCloseSpan: `
      display: block;
      cursor: pointer;
      font-weight: 900;
      color: #fff;
      margin-top: 30px;
      text-decoration: underline;
    `,
      ourpassParentModal: `
      position: fixed;
      z-index: 99999;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0,0,0,0.85);

    `,
      ourPassContentModalDesktop: `
      position: relative;
      background-color: rgb(254, 254, 254);
      margin: auto;
      width: calc(100% - 50px);
      height: 95%;
      display: none;
      justify-content: center;
      align-items: center;
      max-width: 316px;
      border-radius: 4px;
    `,
      ourPassContentModalMobile: `
      position: relative;
      background-color: rgb(254, 254, 254);
      margin: auto;
      padding: 0;
      border-radius: 5px;
      width: 100%;
      height: 100%;
      display: none;
      justify-content: center;
      align-items: center;
    `,
      ourpassIframe: `
      display: none;
      border: none;
      height: 100%;
      width: 100%;
      z-index: 99999;
    `,
      ourpassCloseButton: `
      color: white;
      position: absolute;
      font-size: 25px;
      font-weight: bold;
      cursor: pointer;
      right: 20px;
      top: 45px;
      background:#C6C6C6;
      border-radius:50%;
      height:25px;
      width:25px;
      display:flex;
      justify-content:center;
      align-items:center;
      padding-left: 1px;
    `,
      ourpassCloseButtonFocus: `
      color: #000;
      text-decoration: none;
      cursor: pointer;
    `,
    }

    this.#logoSrc = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgaWQ9InN2ZzEwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGZpbGw9Im5vbmUiCiAgIHZpZXdCb3g9IjAgMCAxNjcgMTY3IgogICBoZWlnaHQ9IjE2NyIKICAgd2lkdGg9IjE2NyI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTYiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxNCIgLz4KICA8Y2lyY2xlCiAgICAgaWQ9ImNpcmNsZTIiCiAgICAgZmlsbD0iIzFEQkM4NiIKICAgICByPSI4My41IgogICAgIGN5PSI4My41IgogICAgIGN4PSI4My41IiAvPgogIDxwYXRoCiAgICAgaWQ9InBhdGg0IgogICAgIGZpbGw9IiM5QkRGQzgiCiAgICAgZD0iTTU1LjM1MTYgODkuMTQwNEw4OS4yNjI5IDU1LjI2MDlWODkuMTQwNEg1NS4zNTE2WiIKICAgICBjbGlwLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgIG9wYWNpdHk9IjAuNSIgLz4KICA8cGF0aAogICAgIGlkPSJwYXRoNiIKICAgICBmaWxsPSJ3aGl0ZSIKICAgICBkPSJNNjMuODMyIDEyMy4wNTRMMTIwLjM0IDY2LjU0NTdWMTIzLjA1NEg2My44MzJaIgogICAgIGNsaXAtcnVsZT0iZXZlbm9kZCIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiIC8+CiAgPHBhdGgKICAgICBpZD0icGF0aDgiCiAgICAgZmlsbD0id2hpdGUiCiAgICAgZD0iTTQ2Ljg3ODkgNjYuNTQ1M0w2OS40NzU5IDQzLjk0ODRWNjYuNTQ1M0g0Ni44Nzg5WiIKICAgICBjbGlwLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIiAvPgo8L3N2Zz4K`;

    this.#environments = {
      sandbox: {
        baseUrl: 'https://merchant-sandbox.ourpass.co'
      },
      production: {
        baseUrl: 'https://merchant.ourpass.co'
      }
    }

    this.#config = {}
  }


  handleIframeLoaded() {
    this.removeEventListener('load', this.handleIframeLoaded, true)
    document.getElementById("ourpassLoaderWrapper").style.display = "none";
    document.getElementById("dFrame").style.display = "block";
    document.getElementById('ourPassContentModal').style.display = "block";
  }

  handleAnimation() {
    const loader = document.getElementById("ourpassLoaderImg");

    if (!loader) {
      // create loader
      this.createAnElement('ourpassParentModal', 'div', ['ourpassLoaderWrapper'], this.#dStyle.ourpassLoaderWrapper);
      this.createAnElement('ourpassLoaderWrapper', 'img', ['ourpassLoaderImg'], this.#dStyle.ourpassLoaderImg);
      this.createAnElement(
        'ourpassLoaderWrapper',
        'span', 
        ['ourpassLoaderCloseSpan', ["onclick", "OurpassCheckout.g()"]], 
        this.#dStyle.ourpassLoaderCloseSpan, 
        `cancel checkout`
      );
      document.getElementById('ourpassLoaderImg').setAttribute('src', this.#logoSrc)
    }

    document.getElementById('ourpassLoaderImg').style.display = 'block'
    document.getElementById('ourpassLoaderImg').animate([
      // keyframes
      { transform: 'scale(0.7)' },
      { transform: 'scale(0.8)' },
      { transform: 'scale(0.7)' }
    ], {
      // timing options
      duration: 1000,
      iterations: Infinity
    });
    // end animation
  }

  generateIframeSrc() {
    const items = this.clientInfo.items ? JSON.stringify(this.clientInfo.items) : '';
    const metadata = this.clientInfo.metadata ? JSON.stringify(this.clientInfo.metadata) : '';

    const src = `${this.#config.baseUrl}/checkout/?src=${this.clientInfo.src}&items=${items}&metadata=${metadata}&amount=${this.clientInfo.amount}&url=${this.clientInfo.url}&name=${this.clientInfo.name}&email=${this.clientInfo.email}&qty=${this.clientInfo.qty}&description=${this.clientInfo.description}&api_key=${this.clientInfo.api_key}&reference=${this.clientInfo.reference}`;

    return src;
  }

  // Close Functions
  // Close Button
  g() {
    this.removeElement("ourpassParentModal")
    this.clientInfo.onClose()
  }

  // click Modal
  closeOnModal() {
    if (event.target == document.getElementById("ourpassParentModal")) {
      this.g()
    }
  }

  // Element Creation
  createAnElement(parentId, elementTag, elementId, style, html = null) {
    var modalDiv = document.createElement(elementTag)
    modalDiv.style.cssText = style
    if (html) modalDiv.innerHTML = html;

    modalDiv.setAttribute("id", elementId[0]);

    if (elementId.length > 1) modalDiv.setAttribute(`${elementId[1][0]}`, `${elementId[1][1]}`);

    if (parentId instanceof HTMLElement) {
      parentId.appendChild(modalDiv);
    } else {
      if (parentId == "pass") {
        var dParentElement = document.getElementById("button").parentNode
        dParentElement.appendChild(modalDiv);
      } else {
        document.getElementById(parentId).appendChild(modalDiv)
      }
    }

    return modalDiv
  }

  // Element Removal
  removeElement(element) {
    if (!(element instanceof HTMLElement)) {
      element = document.getElementById(element);
    }

    if (element) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  }

  openIframe(clientInfo) {

    //delete any previous element
    let backDropElement = document.getElementById("ourpassParentModal")

    if (!!backDropElement) {
      backDropElement.remove();
    }

    this.clientInfo = clientInfo;

    switch (clientInfo.env) {
      case 'sandbox':
        this.#config = this.#environments.sandbox;
        break;

      case 'production':
        this.#config = this.#environments.production;
        break;

      default:
        this.#config = this.#environments.production
        break;
    }

    // Create Backdrop Element
    backDropElement = this.createAnElement(
      document.getElementsByTagName("body")[0],
      "div",
      ["ourpassParentModal"],
      this.#dStyle.ourpassParentModal
    );

    // Create Modal-Content card
    const ourPassContentModal = this.createAnElement("ourpassParentModal", "div", ["ourPassContentModal"]);

    // Create close button
    const ourpassCloseButton = this.createAnElement(
      "ourPassContentModal",
      "span",
      ["ourpassCloseButton",
        ["onclick", "OurpassCheckout.g()"]],
      this.#dStyle.ourpassCloseButton,
      "&times;"
    );

    this.handleAnimation()

    if (this.#isMobileDevice) {
      ourPassContentModal.style.cssText = this.#dStyle.ourPassContentModalMobile;
      // ourpassCloseButton.style.display = 'none';
    } else {
      this.#dStyle.ourpassIframe = `${this.#dStyle.ourpassIframe}border-radius: 4px;`;
      ourPassContentModal.style.cssText = this.#dStyle.ourPassContentModalDesktop;
    }

    // Create Iframe
    var ourpassIframe = this.createAnElement(
      "ourPassContentModal",
      "iframe",
      ["dFrame", ["src", this.generateIframeSrc()]],
      this.#dStyle.ourpassIframe
    )

    ourpassIframe.addEventListener('load', this.handleIframeLoaded, true)

    window.addEventListener('message', (event) => {
      if (this.#config.baseUrl === event.origin) {
        if (event.data == 'false pass') {
          this.removeElement(backDropElement)
          this.clientInfo.onClose()
        }

        if (event.data == 'remove_close') {
          this.removeElement(ourpassCloseButton);
        }

        if (event.data == 'false pass1') {
          const responsePayload = this.clientInfo;
          this.removeElement(backDropElement)
          this.clientInfo.onSuccess(responsePayload)
        }
      }
    })
  }
}

window.OurpassCheckout = new Ourpass();