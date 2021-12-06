define([
    'domReady!',
    'jquery',
], function ($) {
    var serverConfig = null;
    var theConfig = null;

    return function (config) {

        // When we are invoked with the server config,
        // set it in a persistent variable and notify the rest of the application
        if (serverConfig === null && typeof config === 'object' && config !== null) {
            serverConfig = config;
            //$(document).trigger('ourpass-magento-config-initialized');
        }

        // Return cached config object if called repeatedly
        if (theConfig !== null) {
            return theConfig;
        }

        theConfig = {
            getSecretKey: function () {
                return serverConfig && serverConfig.secretKey ? serverConfig.secretKey : '';
            },
            getButtonSize: function () {
                return serverConfig && serverConfig.buttonSize ? serverConfig.buttonSize : 'default';
            },
            getProductDataUrl: function () {
                return serverConfig && serverConfig.productDataUrl ? serverConfig.productDataUrl : '';
            },
            getCartDataUrl: function () {
                return serverConfig && serverConfig.cartDataUrl ? serverConfig.cartDataUrl : '';
            },
            getCartCheckUrl: function () {
                return serverConfig && serverConfig.cartCheckUrl ? serverConfig.cartCheckUrl : '';
            },
            getClearCartUrl: function () {
                return serverConfig && serverConfig.clearCartUrl ? serverConfig.clearCartUrl : '';
            }, 
            getCreateOrderUrl: function () {
                return serverConfig && serverConfig.createOrderUrl ? serverConfig.createOrderUrl : '';
            },
            /**
             * Check to see if OurPass is enabled and all cart products are OurPass supported products.
             */
            shouldShowOurPassOnCart: function () {
                var isOurPassEnabled = serverConfig && serverConfig.ourpassEnabled && serverConfig.ourpassEnabled === true;
                var areAllProductsOurPass = serverConfig && serverConfig.areAllProductsOurPass && serverConfig.areAllProductsOurPass === true;

                return isOurPassEnabled && areAllProductsOurPass;
            },
            /**
             * Check to see if OurPass is enabled and all cart products are OurPass supported products.
             */
            shouldShowOurPassOnPDP: function () {
                var isOurPassEnabled = serverConfig && serverConfig.ourpassEnabled && serverConfig.ourpassEnabled === true;
                var isProductOurPass = serverConfig && serverConfig.isProductOurPass && serverConfig.isProductOurPass === true;

                return isOurPassEnabled && isProductOurPass;
            }
        };

        return theConfig;
    };
});
