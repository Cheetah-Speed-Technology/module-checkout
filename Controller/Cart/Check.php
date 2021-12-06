<?php

namespace OurPass\Checkout\Controller\Cart;

use OurPass\Checkout\Model\Config\OurPassIntegrationConfig as OurPassConfig;
use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory as ResultJsonFactory;

class Check implements \Magento\Framework\App\Action\HttpGetActionInterface
{
    /**
     * @var ResultJsonFactory
     */
    protected $resultJsonFactory;
    /**
     * @var CustomerSession
     */
    protected $customerSession;
    /**
     * @var CheckoutSession
     */
    protected $checkoutSession;

    /**
     * @var OurPassConfig
     */
    protected $ourPassConfig;

    /**
     * Check constructor.
     * @param Context $context
     * @param ResultJsonFactory $resultJsonFactory
     * @param CheckoutSession $checkoutSession
     * @param CustomerSession $customerSession
     * @param OurPassConfig $ourPassConfig
     */
    public function __construct(
        Context $context,
        ResultJsonFactory $resultJsonFactory,
        CheckoutSession $checkoutSession,
        CustomerSession $customerSession,
        OurPassConfig $ourPassConfig
    ) {
        $this->resultJsonFactory = $resultJsonFactory;
        $this->checkoutSession = $checkoutSession;
        $this->customerSession = $customerSession;
        $this->ourPassConfig = $ourPassConfig;
    }
    
    public function execute()
    {
        $cartIsOurPass = true;

        foreach ($this->checkoutSession->getQuote()->getAllVisibleItems() as $cartItem) {
            if ((int)$cartItem->getProduct()->getData('hide_ourpass_option') == 0) {
                $cartIsOurPass = false;
            }
            //reject non enabled product types
            if(! in_array($cartItem->getProductType(), $this->ourPassConfig->getProcessableProductType())) {
                $cartIsOurPass = false;
            }
        }

        $result = $this->resultJsonFactory->create();
        return $result->setData([
            'areAllProductsOurPass' => $cartIsOurPass,
        ]);
    }
}
