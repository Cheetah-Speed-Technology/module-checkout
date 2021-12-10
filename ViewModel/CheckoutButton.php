<?php

namespace OurPass\Checkout\ViewModel;

use OurPass\Checkout\Helper\OurPassCheckout as OurPassCheckoutHelper;
use OurPass\Checkout\Model\Config\OurPassIntegrationConfig;
use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Registry;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Quote\Api\GuestCartManagementInterface;
use Magento\Quote\Model\MaskedQuoteIdToQuoteId;
use Magento\Quote\Model\QuoteFactory;
use Magento\Quote\Model\QuoteIdMaskFactory;
use Magento\Quote\Model\QuoteRepository;

/**
 *
 * @SuppressWarnings(PHPMD.LongVariable)
 */
class CheckoutButton implements ArgumentInterface
{

    /**
     * @var OurPassIntegrationConfig
     */
    protected $ourpassIntegrationConfig;
    /**
     * @var UrlInterface
     */
    protected $urlInterface;

    /**
     * @var OurPassCheckoutHelper
     */
    protected $ourpassCheckoutHelper;

    /**
     * @var CheckoutSession
     */
    protected $checkoutSession;
    /**
     * @var QuoteRepository
     */
    protected $quoteRepository;
    /**
     * @var QuoteFactory
     */
    protected $quoteFactory;
    /**
     * @var MaskedQuoteIdToQuoteId
     */
    protected $maskedQuoteIdToQuoteId;
    /**
     * @var GuestCartManagementInterface
     */
    protected $cartManagement;

    /**
     * @var CustomerSession
     */
    protected $customerSession;

    /**
     * @var QuoteIdMaskFactory
     */
    protected $quoteIdMaskFactory;

    /**
     * @var Registry
     */
    protected $registry;

    /**
     * CheckoutButton constructor.
     * @param OurPassIntegrationConfig $ourpassIntegrationConfig
     * @param OurPassCheckoutHelper $ourpassCheckoutHelper
     * @param CheckoutSession $checkoutSession
     * @param CustomerSession $customerSession
     * @param QuoteIdMaskFactory $quoteIdMaskFactory
     * @param Registry $registry
     * @param QuoteRepository $quoteRepository
     * @param QuoteFactory $quoteFactory
     * @param GuestCartManagementInterface $cartManagement
     * @param MaskedQuoteIdToQuoteId $maskedQuoteIdToQuoteId
     * @param UrlInterface $urlInterface
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        OurPassIntegrationConfig $ourpassIntegrationConfig,
        OurPassCheckoutHelper $ourpassCheckoutHelper,
        CheckoutSession $checkoutSession,
        CustomerSession $customerSession,
        QuoteIdMaskFactory $quoteIdMaskFactory,
        Registry $registry,
        QuoteRepository $quoteRepository,
        QuoteFactory $quoteFactory,
        GuestCartManagementInterface $cartManagement,
        MaskedQuoteIdToQuoteId $maskedQuoteIdToQuoteId,
        UrlInterface $urlInterface
    ) {
        $this->ourpassIntegrationConfig = $ourpassIntegrationConfig;
        $this->ourpassCheckoutHelper = $ourpassCheckoutHelper;
        $this->checkoutSession = $checkoutSession;
        $this->customerSession = $customerSession;
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
        $this->registry = $registry;
        $this->quoteRepository = $quoteRepository;
        $this->quoteFactory = $quoteFactory;
        $this->cartManagement = $cartManagement;
        $this->maskedQuoteIdToQuoteId = $maskedQuoteIdToQuoteId;
        $this->urlInterface = $urlInterface;
    }

    /**
     * @return bool
     */
    public function isOurPassEnabled()
    {
        return $this->ourpassIntegrationConfig->isEnabled();
    }

    /**
     * @return string
     */
    public function getSecretKey()
    {
        return $this->ourpassIntegrationConfig->getSecretKey();
    }

    /**
     * @return string
     */
    public function getEnvironment()
    {
        return $this->ourpassIntegrationConfig->getEnvironment();
    }

    /**
     * @return string
     */
    public function getButtonSize()
    {
        return $this->ourpassIntegrationConfig->getButtonSize();
    }

    /**
     * @return string
     */
    public function getProductDataUrl(): string
    {
        return $this->urlInterface->getUrl(
            'ourpass/product/data'
        );
    }

    /**
     * @return string
     */
    public function getCartDataUrl(): string
    {
        return $this->urlInterface->getUrl(
            'ourpass/cart/data'
        );
    }

    /**
     * @return string
     */
    public function getCartCheckUrl(): string
    {
        return $this->urlInterface->getUrl(
            'ourpass/cart/check'
        );
    }

    /**
     * @return string
     */
    public function getClearCartUrl(): string
    {
        return $this->urlInterface->getUrl(
            'ourpass/cart/clear'
        );
    }

    /**
     * @return string
     */
    public function getCreateOrderUrl(): string
    {
        return $this->urlInterface->getUrl(
            'ourpass/order/create'
        );
    }

    /**
     * @return bool
     */
    public function isOurPassProduct()
    {
        $product = $this->registry->registry('product');

        if ($product !== null && (int)$product->getData('hide_ourpass_option') == 1) {
            return false;
        }
        return true;
    }

    /**
     * @return bool
     */
    public function isProductOurPass()
    {
        return $this->isOurPassProduct();
    }

    /**
     * @return bool
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function areAllProductsOurPass()
    {
        //get all products in cart - if product is not ourpass able return false
        foreach ($this->checkoutSession->getQuote()->getAllVisibleItems() as $cartItem) {
            if ((int)$cartItem->getProduct()->getData('hide_ourpass_option') == 1) {
                return false;
            }
            //reject non enabled product types
            if (!in_array($cartItem->getProductType(), $this->ourPassConfig->getProcessableProductType())) {
                return false;
            }
        }
        return true;
    }
}
