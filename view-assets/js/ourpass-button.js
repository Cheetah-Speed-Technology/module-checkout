const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            width: 100%;
            font-family: Gilroy;
            overflow: visible;
            clear: both;
        }
        :host .wrapper {
            position: relative;
        }
        :host([hidden]) .wrapper {
            display: none;
        }
        :host #ourpassButton {
            font-family: Gilroy;
            font-size: 0;
            background-color: #1DBC86;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            transition-duration: 0.4s;
            cursor: pointer;
            opacity: 1;
            border: none;
            text-align: center;
            text-decoration: none;
            border-radius: 8px;
            margin: 0 auto;
            padding: 12px 24px;  
        }
        :host([size=large]) #ourpassButton {
            padding: 16px 24px; 
        }
        :host([size=compact]) #ourpassButton {
            padding: 8px 16px; 
        }
        :host #title{
            margin-left: 8px;
            font-size: 16px;
        }
        :host([size=large]) #title {
            font-size: 16px;
        }
        :host([size=compact]) #title {
            font-size: 14px;
        }
        :host #icon{
            width: 14px;
            height: 14px;
        }
        :host([size=large]) #icon {
            width: 16px;
            height: 16px;
        }
        :host([size=compact]) #icon {
            width: 12px;
            height: 12px;
        }
    </style>

    <div class="wrapper">
        <button id="ourpassButton">
            <svg id="icon" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.888916 4.39877H5.02464V0L0.888916 4.39877Z" fill="white"/>
                <path d="M2.38574 8.73967H8.59661V2.13635L2.38574 8.73967Z" fill="white"/>
                <path d="M3.85132 15.3075H14.2222V4.29163L3.85132 15.3075Z" fill="white"/>
            </svg>
            <span id="title">OurPass Checkout</span>
        </button>
    </div>
`;

class OurPassCheckoutButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.mySVG = this.shadowRoot.querySelector("#icon");
        this.handleSizeAttributeChange(this.getAttribute('size'));   
    }

    static get observedAttributes() {
        return ['size'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'size':
                this.handleSizeAttributeChange(newValue);
                break;
        }
    }

    handleSizeAttributeChange(value) {
        switch (value) {
            case 'compact':
                this.mySVG.setAttribute("viewBox", "0 0 17 17");
                break;
            case 'large':
                this.mySVG.setAttribute("viewBox", "0 0 19 19");
                break;
            default:
                this.mySVG.setAttribute("viewBox", "0 0 19 19");
                break;
        }
    }
}

window.customElements.define('ourpass-checkout-button', OurPassCheckoutButton);
