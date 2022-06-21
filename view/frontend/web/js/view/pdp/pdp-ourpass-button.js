define(['uiComponent', 'jquery', 'Magento_Customer/js/customer-data', 'ko', 'underscore', 'ourpassConfig'],
    function (Component, $, customerData, ko, _, ourpassConfigFactory) {
        'use strict';

        var ourpassConfig = ourpassConfigFactory();

        return Component.extend({

            initialize: function() {
                var self = this;
                this._super();
                self.shouldShowOurPassButton = ko.observable(ourpassConfig.shouldShowOurPassOnPDP());
                $(document).ready(function () {
                    // $("#pdp-ourpass-button").css({
                    //     'width': ($("#product-addtocart-button").outerWidth() + 'px')
                    // });
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

                    productOptions.push({
                        id: formData.get('product'),
                        options: options,
                        quantity: Number(formData.get('qty'))
                    });

                    for (var pair of formData.entries()) {

                        if (pair[0].includes('super_attribute')) {
                            productOptions = [];
                            options.push({
                                id: pair[0].replace(/\D/g, ''),
                                value: pair[1],
                            });

                            productOptions.push({
                                id: formData.get('product'),
                                options: options,
                                quantity: Number(formData.get('qty'))
                            });
                            // break;
                        }

                        if (pair[0].includes('bundle_option')) {
                            productOptions.push({
                                id: pair[1],
                                options: [],
                                quantity: Number(formData.get('qty'))
                            });
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
                            let hasVerified = false;
                            OurpassCheckout.openIframe({
                                env: response.data.env,
                                api_key: response.data.api_key,
                                subAccountAuthKey: response.data.sub_account_key,
                                reference: response.data.reference,
                                amount: response.data.amount,
                                qty: 1,
                                name: response.data.name,
                                email: response.data.email,
                                description: response.data.description,
                                src: response.data.src,
                                url: response.data.url,
                                items: response.data.items,
                                metadata: response.data.metadata,
                                onSuccess: (res) => {
                                    if (hasVerified) {
                                        return;
                                    }
                                    hasVerified = true;
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
                                    });
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
