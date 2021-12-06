define(['uiComponent', 'jquery', 'Magento_Customer/js/customer-data', 'ko', 'underscore', 'ourpassConfig'],
    function (Component, $, customerData,ko, _, ourpassConfigFactory) {
        'use strict';

        var ourpassConfig = ourpassConfigFactory();

        return Component.extend({

            initialize: function() {
                var self = this;
                this._super();
                self.shouldShowOurPassButton = ko.observable(ourpassConfig.shouldShowOurPassOnPDP());
                $(document).ready(function () {
                    $("#pdp-ourpass-button").css({
                        'width': ($("#product-addtocart-button").outerWidth() + 'px')
                    });
                    $("#pdp-ourpass-button").prependTo(".box-tocart .fieldset .actions");
                });
            },
            pdpOurPassClick: function(data, e) {
                // get the form node via jquery
                var productForm = $('form#product_addtocart_form');

                // validating form
                var validForm = productForm.validation('isValid');

                if (validForm) {
                    // construct a FormData object from the form node
                    // and extract the selected options
                    var formData = new FormData(productForm[0]);

                    var options = [];
                    var productOptions = [];

                    for (var pair of formData.entries()) {
                        if (pair[0].includes('super_group')) {
                            var productQty = Number(pair[1]);
                            if (productQty > 0) {
                                productOptions.push({
                                    id: pair[0].replace(/\D/g, ''),
                                    options: options,
                                    quantity: productQty
                                });
                            }
                        }
                    }

                    $.ajax({
                        method: "GET",
                        url: ourpassConfig.getProductDataUrl(),
                        dataType: 'json',
                        data: {
                            products: productOptions
                        },
                        showLoader: true
                    }).success((response) => {
                        try {
                            OurpassCheckout.openIframe({
                                env: response.data.env,
                                api_key: response.data.api_key,
                                reference: response.data.reference,
                                amount: response.data.amount,
                                qty: 1,
                                email: response.data.email,
                                name: response.data.name,
                                description: response.data.description,
                                src: response.data.src,
                                url: response.data.url,
                                items: response.data.items,
                                metadata: response.data.metadata,
                                onSuccess: (res) => {
                                    $.ajax({
                                        method: "POST",
                                        url: ourpassConfig.getCreateOrderUrl(),
                                        data: {
                                            reference: response.data.reference,
                                        },
                                        dataType: 'json',
                                        showLoader: true
                                    }).success((data) => {
                                        if (data.success) {
                                            customerData.set('messages', {
                                                messages: [{
                                                    text: 'Checkout with OurPass successful',
                                                    type: 'success'
                                                }]
                                            });
                                        }
                                    }).error((err) => {
                                        customerData.set('messages', {
                                            messages: [{
                                                text: 'Checkout successful but order not submitted, contact administrator.',
                                                type: 'success'
                                            }]
                                        });
                                    })
                                },
                                onClose: () => {
                                    customerData.set('messages', {
                                        messages: [{
                                            text: 'Checkout cancelled',
                                            type: 'error'
                                        }]
                                    });
                                }
                            });
                        } catch (error) {
                            customerData.set('messages', {
                                messages: [{
                                    text: 'An error occur, please try again',
                                    type: 'error'
                                }]
                            });
                        }
                    }).error((err) => {
                        customerData.set('messages', {
                            messages: [{
                                text: err?.responseJSON?.message || 'Error, please try again',
                                type: 'error'
                            }]
                        });
                    })
                }
                return true;
            },
            shouldShowOurPassButton: function() {
                return ourpassConfig.shouldShowOurPassOnPDP();
            },
            ourpassButtonSize: function () {
                return ourpassConfig.getButtonSize();
            }
        });
    });
