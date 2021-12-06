<?php

namespace OurPass\Checkout\Controller\Cart;

use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory as ResultJsonFactory;
use Magento\Quote\Api\CartRepositoryInterface;

/**
 * Class Clear
 *
 * removes items from carts in Magento
 */
class Clear implements \Magento\Framework\App\Action\HttpGetActionInterface
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
     * @var CartRepositoryInterface
     */
    protected $quoteRepository;

    public function __construct(
        Context $context,
        ResultJsonFactory $resultJsonFactory,
        CheckoutSession $checkoutSession,
        CustomerSession $customerSession,
        CartRepositoryInterface $quoteRepository,
        \Magento\Framework\Controller\Result\RedirectFactory $resultRedirectFactory
    ) {
        $this->resultJsonFactory = $resultJsonFactory;
        $this->checkoutSession = $checkoutSession;
        $this->customerSession = $customerSession;
        $this->quoteRepository = $quoteRepository;
        $this->resultRedirectFactory = $resultRedirectFactory;
    }

    /**
     * clear the current user's shopping cart
     */
    public function execute()
    {
        
        $quote = $this->checkoutSession->getQuote();
        $quoteId = $quote->getId();

        if ($quoteId) {
            $cart = $this->quoteRepository->get($quoteId);
            $cart->delete();
        }

        $this->checkoutSession->clearQuote();
        $this->checkoutSession->clearStorage();
        $this->checkoutSession->restoreQuote();

        $resultRedirect = $this->resultRedirectFactory->create();
        $resultRedirect->setPath('checkout/cart');
        return $resultRedirect;
    }
}
