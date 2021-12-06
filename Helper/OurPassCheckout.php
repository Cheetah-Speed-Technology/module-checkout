<?php

namespace OurPass\Checkout\Helper;

use Magento\Sales\Model\Order;
use Magento\Catalog\Model\Product;
use OurPass\Checkout\Logger\Logger;
use Magento\Framework\App\Helper\Context;
use Magento\Customer\Model\CustomerFactory;
use \Magento\Quote\Model\QuoteIdMaskFactory;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Framework\App\ObjectManager;
use Magento\Customer\Api\CustomerRepositoryInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Config\ReinitableConfigInterface;
use Magento\Quote\Model\QuoteManagement;
use OurPass\Checkout\Model\Config\OurPassIntegrationConfig;
use \Magento\Sales\Model\ResourceModel\Sale\Collection;

/**
 *
 * @SuppressWarnings(PHPMD.LongVariable)
 */
class OurPassCheckout extends AbstractHelper
{
    /**
     * @var \Magento\Config\Model\ResourceModel\Config
     */
    protected $saveConfig;
    /**
     * @var ReinitableConfigInterface
     */
    protected $config;
    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;
    /**
     * @var OurPassIntegrationConfig
     */
    protected $ourpassIntegrationConfig;
    /**
     * @var Logger
     */
    protected $logger;

    /**
     * @var StoreManagerInterface
     */
    protected $_storeManager;

    /**
     * @var Product
     */
    protected $_product;

    /**
     * @var CartRepositoryInterface
     */
    protected $cartRepositoryInterface;

    /**
     * @var CustomerRepositoryInterface
     */
    protected $customerRepository;

    /**
     * @var QuoteIdMaskFactory
     */
    protected $quoteIdMaskFactory;

    /**
     * @var Order
     */
    protected $order;

    /**
     * @var Collection
     */
    protected $salesorder;


    public function __construct(
        Context $context,
        \Magento\Config\Model\ResourceModel\Config $saveconfig,
        ReinitableConfigInterface $config,
        ScopeConfigInterface $scopeConfig,
        OurPassIntegrationConfig $ourpassIntegrationConfig,
        Logger $logger,
        StoreManagerInterface $storeManager,
        Product $product,
        CartRepositoryInterface $cartRepositoryInterface,
        CustomerFactory $customerFactory,
        CustomerRepositoryInterface $customerRepository,
        QuoteIdMaskFactory $quoteIdMaskFactory,
        QuoteManagement $quoteManagement,
        Order $order,
        Collection $salesorder
    ) {
        $this->saveConfig = $saveconfig;
        $this->config = $config;
        $this->scopeConfig = $scopeConfig;
        $this->ourpassIntegrationConfig = $ourpassIntegrationConfig;
        $this->logger = $logger;
        $this->_storeManager = $storeManager;
        $this->_product = $product;
        $this->cartRepositoryInterface = $cartRepositoryInterface;
        $this->customerFactory = $customerFactory;
        $this->customerRepository = $customerRepository;
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
        $this->quoteManagement = $quoteManagement;
        $this->order = $order;
        $this->salesorder = $salesorder;

        parent::__construct($context);
    }

    /**
     * @param string $message
     * @param int $level
     */
    public function log(string $message, int $level = Logger::INFO)
    {
        switch ($level) {
            case Logger::DEBUG:
                if ($this->ourpassIntegrationConfig->isDebugLoggingEnabled()) {
                    $this->logger->debug($message);
                }
                break;
            case Logger::ERROR:
                $this->logger->error($message);
                break;
            default:
                $this->logger->info($message);
                break;
        }
    }

    /**
     * @return string
     */
    public function guid(): string
    {
        return sprintf(
            '%04X%04X-%04X-%04X-%04X-%04X%04X%04X',
            random_int(0, 65535),
            random_int(0, 65535),
            random_int(0, 65535),
            random_int(16384, 20479),
            random_int(32768, 49151),
            random_int(0, 65535),
            random_int(0, 65535),
            random_int(0, 65535)
        );
    }

    /**
     * Create Order On Your Store
     *
     * @param array $orderData
     * @return array
     *
     */
    public function createOrder($cartId, $reference, $orderData)
    {
        $store = $this->_storeManager->getStore();
        $websiteId = $this->_storeManager->getStore()->getWebsiteId();

        $quoteIdMask = $this->quoteIdMaskFactory->create()->load($cartId, 'masked_id');

        $quote = $this->cartRepositoryInterface->get($quoteIdMask->getQuoteId());

        // $quote->setStore($store);
        $quote->setCurrency();

        $customer = $this->customerFactory->create();
        $customer->setWebsiteId($websiteId);

        $customer->loadByEmail($orderData['email']); // load customer by email address

        if (!$customer->getEntityId()) {
            $names = explode(" ", $orderData['name']);

            //If not available then create this customer
            $customer->setWebsiteId($websiteId)
                ->setStore($store)
                ->setFirstname((isset($names[0])) ? $names[0] : '')
                ->setLastname((isset($names[1])) ? $names[1] : '')
                ->setEmail($orderData['email'])
                ->setPassword($orderData['email']);
            $customer->save();
        }

        // if you have already buyer id then you can load customer directly
        $customer = $this->customerRepository->getById($customer->getEntityId());
        $quote->assignCustomer($customer); //Assign quote to customer

        //Set Address to quote
        if (isset($orderData['address'])) {

            $names = explode(" ", $orderData['name']);

            $address = [
                'firstname' => (isset($names[0])) ? $names[0] : '',
                'lastname' => (isset($names[1])) ? $names[1] : '',
                'email'      => $orderData['email'],
                'telephone'      => $orderData['userMobile'],
                'street'  => $orderData['address'],
                'town'       => $orderData['townName'],
                'city'       => $orderData['cityName'],
                'region'      => $orderData['state'],
                'postcode' => '00000',
                'country_id' => 'NG',
                'save_in_address_book' => 1
            ];


            $quote->getBillingAddress()->addData($address);
            $quote->getShippingAddress()->addData($address);
        }

        //CREATE SHIPPING METHOD AND ADD TO QUOTE
        $shippingQuoteRate = ObjectManager::getInstance()->get('\Magento\Quote\Model\Quote\Address\Rate');
        $shippingRateCarrier = 'freeshipping';
        $shippingRateCarrierTitle = 'Freeshipping';
        $shippingRateCode = 'freeshipping_freeshipping';
        $shippingRateMethod = 'freeshipping';
        $shippingRatePrice = '0';
        $shippingRateMethodTitle = 'Free shipping';

        $shippingAddress = $quote->getShippingAddress();
        $shippingQuoteRate->setCarrier($shippingRateCarrier);
        $shippingQuoteRate->setCarrierTitle($shippingRateCarrierTitle);
        $shippingQuoteRate->setCode($shippingRateCode);
        $shippingQuoteRate->setMethod($shippingRateMethod);
        $shippingQuoteRate->setPrice($shippingRatePrice);
        $shippingQuoteRate->setMethodTitle($shippingRateMethodTitle);
        $shippingAddress->setCollectShippingRates(false)
            ->collectShippingRates()
            ->setShippingMethod($shippingRateCode); //shipping method
        $quote->getShippingAddress()->addShippingRate($shippingQuoteRate);
        //=CREATE SHIPPING METHOD AND ADD TO QUOTE


        $quote->setPaymentMethod('ourpass');
        $quote->setInventoryProcessed(false);
        // Set Sales Order Payment
        $quote->getPayment()->importData(['method' => 'ourpass']);
        // Collect Totals & Save Quote
        $quote->collectTotals()->save();


        // Create Order From Quote
        $order = $this->quoteManagement->submit($quote);
        $order->setData('ourpass_order_id', $reference);
        $order->save();

        $order->setEmailSent(0);
        $this->deleteQuoteCart($quote);

        return ($order->getEntityId()) ? $order->getRealOrderId() : null;
    }

    public function referenceIsUnique($reference)
    {
        $loadorder=$this->salesorder->addFieldToFilter('ourpass_order_id', $reference);

        return $loadorder->getSize() < 1;
    }

    protected function deleteQuoteCart($quote)
    {
        $quoteId = $quote->getId();

        if ($quoteId) {
            $cart = $this->cartRepositoryInterface->get($quoteId);
            $cart->delete();
        }
    }
}
