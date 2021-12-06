<?php

namespace OurPass\Checkout\Model\Config;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;

class OurPassIntegrationConfig
{
    const ENVIRONMENT = "sandbox"; //production | sandbox
    const PRODUCTION_BASE_URL = "https://beta-api.ourpass.co";
    const SANDBOX_BASE_URL = "https://user-api-staging.ourpass.co";
    const ORDER_PREFIX = "OURPASS_ORDER_"; //production | sandbox
    const XPATH_ENABLE = 'ourpass_integration/ourpass/enable';
    const XPATH_ENABLE_TEST_MODE = 'ourpass_integration/ourpass/test_mode';
    const XPATH_ENABLE_DEBUG_LOGGING = 'ourpass_integration/ourpass/debug';
    const XPATH_TEST_SECRET_KEY = 'ourpass_integration/ourpass/test_secret_key';
    const XPATH_TEST_PUBLIC_KEY = 'ourpass_integration/ourpass/test_public_key';
    const XPATH_LIVE_SECRET_KEY = 'ourpass_integration/ourpass/live_secret_key';
    const XPATH_LIVE_PUBLIC_KEY = 'ourpass_integration/ourpass/live_public_key';
    const XPATH_BUTTON_SIZE = 'ourpass_integration/ourpass/button_size';

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * OurPassIntegrationConfig constructor.
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(ScopeConfigInterface $scopeConfig)
    {
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * @return string
     */
    public function getEnvironment(): string
    {
        return self::ENVIRONMENT;
    }

    /**
     * @return array
     */
    public function getProcessableProductType(): array
    {
        return [
            // \Magento\Bundle\Model\Product\Type::TYPE_CODE,
            // \Magento\Downloadable\Model\Product\Type::TYPE_CODE,
            \Magento\Catalog\Model\Product\Type::TYPE_SIMPLE,
            \Magento\ConfigurableProduct\Model\Product\Type\Configurable::TYPE_CODE,
            \Magento\GroupedProduct\Model\Product\Type\Grouped::TYPE_CODE,
            \Magento\Catalog\Model\Product\Type::TYPE_VIRTUAL
        ];
        // if (
        //     $cartItem->getProductType() === 'bundle' ||
        //     $cartItem->getProductType() === 'downloadable'
        // ) {
        //     $cartIsOurPass = false;
        // }
    }

    /**
     * @return string
     */
    public function getOrderPrefix(): string
    {
        return self::ORDER_PREFIX;
    }

    /**
     * @return bool
     */
    public function isDisabled(): bool
    {
        return !$this->isEnabled();
    }

    /**
     * @return bool
     */
    public function isEnabled(): bool
    {
        return $this->scopeConfig->isSetFlag(static::XPATH_ENABLE, ScopeInterface::SCOPE_STORE);
    }

    /**
     * @return bool
     */
    public function isProduction(): bool
    {
        return ! $this->isTest();
    }

    /**
     * @return bool
     */
    public function isTest(): bool
    {
        return $this->scopeConfig->isSetFlag(static::XPATH_ENABLE_TEST_MODE, ScopeInterface::SCOPE_STORE);
    }

    /**
     * @return bool
     */
    public function isDebugLoggingEnabled(): bool
    {
        return $this->scopeConfig->isSetFlag(static::XPATH_ENABLE_DEBUG_LOGGING);
    }

    /**
     * @return string
     */
    public function getSecretKey(): string
    {
        if ($this->isProduction()) {
            return $this->scopeConfig->getValue(static::XPATH_LIVE_SECRET_KEY);
        }
        return $this->scopeConfig->getValue(static::XPATH_TEST_SECRET_KEY);
    }

    /**
     * @return string
     */
    public function getPublicKey(): string
    {
        if ($this->isProduction()) {
            return $this->scopeConfig->getValue(static::XPATH_LIVE_PUBLIC_KEY);
        }
        return $this->scopeConfig->getValue(static::XPATH_TEST_PUBLIC_KEY);
    }

    /**
     * @return string
     */
    public function getApiBaseUrl(): string
    {
        if ($this->getEnvironment() === 'production') {
            return static::PRODUCTION_BASE_URL;
        }
        return static::SANDBOX_BASE_URL;
    }

    /**
     * @return string
     */
    public function getButtonSize(): string
    {
        return $this->scopeConfig->getValue(static::XPATH_BUTTON_SIZE);
    }
}
