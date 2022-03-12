class Ourpass {
  #dStyle;
  #environments;
  #config;
  #logoSrc;

  constructor() {

    this.#dStyle = {
      // MAIN MODAL BACKDROP DIV
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
      // LOADER WRAPPER
      ourpassLoaderWrapper: `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `,
      // LOADER LOGO
      ourpassLoaderImg: `
        height: 80px;
        width: 80px;
        animation: loader 1s 1s infinite;
        display: block;
      `,
      // CANCEL TEXT UNDER THE LOADER LOGO
      ourpassLoaderCloseSpan: `
        display: block;
        cursor: pointer;
        font-weight: 900;
        color: #fff;
        margin-top: 30px;
        text-decoration: underline;
      `,
      // CONTENT MODAL DESKTOP
      ourPassContentModal: `
        position: relative;
        background-color: rgb(254, 254, 254);
        margin: auto;
        display: none;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        width: calc(100% - 50px) !important;
        height: 95% !important;
        max-width: 385px !important;
        max-height: 630px !important;
      `,
      // IFRAME
      ourpassIframe: `
        display: none;
        border: none;
        height: 100% !important;
        width: 100% !important;
        z-index: 99999;
        border-radius: 5px;
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
    document.getElementById("ourpassParentModal").onclick = function() { 
      document.getElementById('ourPassContentModal').animate([
        // keyframes
        { transform: 'scale(1)' },
        { transform: 'scale(1.02)' },
        { transform: 'scale(1)' }
      ], {
        duration: 200,
      });
    }; 
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

    const checkoutUrl = new URL(`${this.#config.baseUrl}/checkout/`);

    checkoutUrl.searchParams.append("src", this.clientInfo.src)
    checkoutUrl.searchParams.append("items", items)
    checkoutUrl.searchParams.append("metadata", metadata)
    checkoutUrl.searchParams.append("amount", this.clientInfo.amount)
    checkoutUrl.searchParams.append("url", this.clientInfo.url)
    checkoutUrl.searchParams.append("name", this.clientInfo.name)
    checkoutUrl.searchParams.append("email", this.clientInfo.email)
    checkoutUrl.searchParams.append("qty", this.clientInfo.qty)
    checkoutUrl.searchParams.append("description", this.clientInfo.description)
    checkoutUrl.searchParams.append("api_key", this.clientInfo.api_key)
    checkoutUrl.searchParams.append("reference", this.clientInfo.reference);
    checkoutUrl.searchParams.append("cdn_version", "01-03-2022");

    return checkoutUrl.toString();
  }

  // Close Functions
  // Close Button
  g() {
    this.removeElement("ourpassParentModal")
    // WINDOW BEHIND BACKDROP RESUME SCROLLING
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
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

    // WINDOW BEHIND BACKDROP FROM SCROLLING
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;

    // Create Modal-Content card
    const ourPassContentModal = this.createAnElement("ourpassParentModal", "div", ["ourPassContentModal"], this.#dStyle.ourPassContentModal);

    this.handleAnimation()

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
        // FAILED
        if (event.data == 'false pass') {
          this.g();
        }
        // FAILED
        if (event.data == 'closeiframe') {
          this.g();
        }
        // SUCCESS
        if (event.data == 'false pass1') {
          this.removeElement(backDropElement)
          this.clientInfo.onSuccess(this.clientInfo)
        }
      }
    })
  }
}

window.OurpassCheckout = new Ourpass();