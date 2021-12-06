<?php

declare(strict_types=1);

namespace OurPass\Checkout\Model\Payment;

use OurPass\Checkout\Helper\OurPassCheckout as OurPassCheckoutHelper;
use OurPass\Checkout\Model\Config\OurPassIntegrationConfig as OurPassConfig;
use OurPass\Checkout\Service\DoRequest;
use Magento\Framework\Api\AttributeValueFactory;
use Magento\Framework\Api\ExtensionAttributesFactory;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Data\Collection\AbstractDb;
use Magento\Framework\Model\Context;
use Magento\Framework\Model\ResourceModel\AbstractResource;
use Magento\Framework\Registry;
use Magento\Framework\Validator\Exception;
use Magento\Payment\Helper\Data as PaymentHelper;
use Magento\Payment\Model\InfoInterface;
use Magento\Payment\Model\Method\AbstractMethod;
use Magento\Payment\Model\Method\Logger as PaymentLogger;
use Magento\Quote\Api\Data\CartInterface;
use Magento\Sales\Api\OrderItemRepositoryInterface;

/**
 * OurPassPayment Initialization
 * @SuppressWarnings(PHPMD.CamelCasePropertyName)
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 * @SuppressWarnings(PHPMD.LongVariable)
 */
class OurPassPayment extends AbstractMethod
{
    /**
     * @var string
     */
    const CODE = 'ourpass';

    /**
     * @var string
     */
    protected $_code = self::CODE;
    /**
     * @var bool
     */
    protected $_isOffline = false;
    /**
     * @var
     */
    protected $_custompayments;
    /**
     * @var bool
     */
    protected $_isGateway = true;
    /**
     * @var bool
     */
    protected $_canCapture = true;
    /**
     * @var bool
     */
    protected $_canCapturePartial = true;
    /**
     * @var bool
     */
    protected $_canAuthorize = true;
    /**
     * @var bool
     */
    protected $_canRefund = true;
    /**
     * @var bool
     */
    protected $_canRefundInvoicePartial = true;

    /**
     * @var array
     */
    protected $_supportedCurrencyCodes = ['NGN'];

    /**
     * @var bool
     */
    protected $_canFetchTransactionInfo = true;

    /**
     * @var OurPassCheckoutHelper
     */
    protected $ourpassCheckoutHelper;

    /**
     * @var OurPassConfig
     */
    protected $ourpassConfig;

    /**
     * @var OrderItemRepositoryInterface
     */
    protected $orderItemRepository;

    /**
     * OurPassPayment constructor.
     * @param Context $context
     * @param Registry $registry
     * @param ExtensionAttributesFactory $extensionFactory
     * @param AttributeValueFactory $customAttributeFactory
     * @param PaymentHelper $paymentData
     * @param ScopeConfigInterface $scopeConfig
     * @param PaymentLogger $logger
     * @param OurPassCheckoutHelper $ourpassCheckoutHelper
     * @param DoRequest $doRequest
     * @param OurPassConfig $ourpassConfig
     * @param OrderItemRepositoryInterface $orderItemRepository
     * @param AbstractResource|null $resource
     * @param AbstractDb|null $resourceCollection
     * @param array $data
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        Context $context,
        Registry $registry,
        ExtensionAttributesFactory $extensionFactory,
        AttributeValueFactory $customAttributeFactory,
        PaymentHelper $paymentData,
        ScopeConfigInterface $scopeConfig,
        PaymentLogger $logger,
        OurPassCheckoutHelper $ourpassCheckoutHelper,
        OurPassConfig $ourpassConfig,
        OrderItemRepositoryInterface $orderItemRepository,
        AbstractResource $resource = null,
        AbstractDb $resourceCollection = null,
        array $data = []
    ) {
        $this->ourpassCheckoutHelper = $ourpassCheckoutHelper;
        $this->ourpassConfig = $ourpassConfig;
        $this->orderItemRepository = $orderItemRepository;
        parent::__construct(
            $context,
            $registry,
            $extensionFactory,
            $customAttributeFactory,
            $paymentData,
            $scopeConfig,
            $logger,
            $resource,
            $resourceCollection,
            $data,
            null
        );
    }

    /**
     * @param string $currencyCode
     * @return bool
     */
    public function canUseForCurrency($currencyCode)
    {
        if (!in_array($currencyCode, $this->_supportedCurrencyCodes)) {
            return false;
        }
        return true;
    }

    /**
     * @param CartInterface|null $quote
     * @return bool
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
    public function isAvailable(CartInterface $quote = null)
    {
        return parent::isAvailable($quote);
    }
}
