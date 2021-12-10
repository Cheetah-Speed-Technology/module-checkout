define([
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'jquery',
    'ko',
    'underscore',
    'ourpassConfig',
], function (
    Component,
    customerData,
    $,
    ko,
    _,
    ourpassConfigFactory,
) {
    'use strict';

    var ourpassConfig = ourpassConfigFactory();

    return Component.extend({
        observableProperties: [
            'items'
        ],
        initialize: function () {
            var self = this,
                minicart = $('[data-block="minicart"]');
            this._super();
            self.shouldShowOurPassButton = ko.observable(ourpassConfig.shouldShowOurPassOnCart());
            customerData.get('cart').subscribe(
                function (cartData) {
                    $.ajax({
                        url: ourpassConfig.getCartCheckUrl(),
                        type: 'GET',
                        dataType: 'json',
                        success: function (data, textStatus, xhr) {
                            self.shouldShowOurPassButton(data.areAllProductsOurPass);
                        }
                    });
                    self.items(cartData.items);
                }
            );
            this.items(customerData.get('cart')().items); //get cart items

            minicart.on('contentLoading', function () {
                self.shouldShowOurPassButton(false);
            });
        },
        initObservable: function () {
            this._super();
            this.observe(this.observableProperties);

            return this;
        },
        ourpassClick: function (data, e) {
            $.ajax({
                method: "GET",
                url: ourpassConfig.getCartDataUrl(),
                dataType: 'json',
                showLoader: true
            }).success((response) => {
                try {
                    let hasVerified = false;
                    OurpassCheckout.openIframe({
                        env: response.data.env,
                        api_key: response.data.api_key,
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
                                    window.location.replace(ourpassConfig.getClearCartUrl());
                                    return;
                                }
                                customerData.set('messages', {
                                    messages: [{
                                        text: 'Checkout successful but order not submitted, contact administrator.',
                                        type: 'success'
                                    }]
                                });
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
            
            return true;
        },
        ourpassButtonSize: function () {
            return ourpassConfig.getButtonSize();
        }
    });
});
