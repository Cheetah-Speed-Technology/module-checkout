<?php

namespace OurPass\Checkout\Controller\Product;

use Magento\Framework\App\ObjectManager;
use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Customer\Model\Session as CustomerSession;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\JsonFactory as ResultJsonFactory;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Api\GuestCartManagementInterface;
use Magento\Quote\Model\MaskedQuoteIdToQuoteId;
use Magento\Quote\Model\Quote;
use Magento\Quote\Model\QuoteFactory;
use Magento\Quote\Model\QuoteIdMaskFactory;
use Magento\Quote\Model\QuoteIdToMaskedQuoteIdInterface;


class Data implements \Magento\Framework\App\Action\HttpGetActionInterface
{

    protected $resultJsonFactory;
    protected $customerSession;
    protected $checkoutSession;
    protected $quoteRepository;
    protected $quoteIdMaskFactory;
    protected $cartManagement;
    protected $maskedQuoteIdToQuoteId;
    protected $quoteFactory;
    protected $urlInterface;

    /**@var \Magento\Framework\App\Request\Http $request */
    protected $request;
    /**@var \Magento\Catalog\Model\Product $product */
    protected $product;
    /** @var \Magento\Catalog\Api\ProductRepositoryInterface */
    private $productRepository;
    /** @var \Magento\ConfigurableProduct\Model\Product\Type\Configurable */
    private $configurableType;
    /**
     * @var QuoteIdToMaskedQuoteIdInterface
     */
    private $quoteIdToMaskedQuoteId;

    protected $ourPassIntegrationConfig;
    protected $ourpassCheckoutHelper;

    public function __construct(
        Context $context,
        ResultJsonFactory $resultJsonFactory,
        CheckoutSession $checkoutSession,
        CustomerSession $customerSession,
        CartRepositoryInterface $quoteRepository,
        GuestCartManagementInterface $cartManagement,
        MaskedQuoteIdToQuoteId $maskedQuoteIdToQuoteId,
        QuoteFactory $quoteFactory,
        QuoteIdMaskFactory $quoteIdMaskFactory,
        QuoteIdToMaskedQuoteIdInterface $quoteIdToMaskedQuoteId,
        \Magento\Framework\UrlInterface $urlInterface,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Catalog\Model\Product $product,

        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository,
        \Magento\ConfigurableProduct\Model\Product\Type\Configurable $configurableType,

        \OurPass\Checkout\Model\Config\OurPassIntegrationConfig $ourPassIntegrationConfig,
        \OurPass\Checkout\Helper\OurPassCheckout $ourpassCheckoutHelper
    ) {
        $this->resultJsonFactory = $resultJsonFactory;
        $this->checkoutSession = $checkoutSession;
        $this->customerSession = $customerSession;
        $this->quoteRepository = $quoteRepository;
        $this->cartManagement = $cartManagement;
        $this->maskedQuoteIdToQuoteId = $maskedQuoteIdToQuoteId;
        $this->quoteFactory = $quoteFactory;
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
        $this->quoteIdToMaskedQuoteId = $quoteIdToMaskedQuoteId;
        $this->urlInterface = $urlInterface;
        $this->request = $request;
        $this->product = $product;
        $this->productRepository = $productRepository;
        $this->configurableType = $configurableType;
        $this->ourPassIntegrationConfig = $ourPassIntegrationConfig;
        $this->ourpassCheckoutHelper = $ourpassCheckoutHelper;
    }

    public function execute()
    {
        try {
            $cart = $this->getInvisibleCartFromCart();
            $cartId = $this->quoteIdToMaskedQuoteId->execute($cart->getId());
            

            //Getting the items;
            $items = array();
            $totalAmount = 0;

            foreach ($cart->getAllVisibleItems() as  $cartItem) {
                $product = $cartItem->getProduct();

                $item_data = array(
                    'name' =>  $product->getName(),
                    'description' => $product->getName(),
                    'amount' => floatval($cartItem->getPrice()),
                    'qty' => intval($cartItem->getQty()),
                    'src' => ObjectManager::getInstance()
                        ->get('\Magento\Catalog\Helper\Image')
                        ->init($product, 'product_page_image_small')
                        ->setImageFile($product->getSmallImage()) // image,small_image,thumbnail
                        ->resize(380)
                        ->getUrl(),
                    'url' => $this->urlInterface->getBaseUrl(),
                    'email' => ''
                );

                $items[] = $item_data;
                $totalAmount = $totalAmount + ($item_data['amount'] * $item_data['qty']);
            }

            if (!isset($items[0]) && empty($items[0])) {
                throw new \Exception('Cart is empty');
            }

            $referenceCode = $this->ourPassIntegrationConfig->getOrderPrefix() . '' . md5(uniqid($cartId, true));

            $ourpass_data = array();

            $ourpass_data['env'] = $this->ourPassIntegrationConfig->getEnvironment();
            $ourpass_data['api_key'] = $this->ourPassIntegrationConfig->getSecretKey();
            $ourpass_data['sub_account_key'] = $this->ourPassIntegrationConfig->getSubAccountKey();
            $ourpass_data['reference'] = $referenceCode;
            $ourpass_data['amount'] = $totalAmount;
            $ourpass_data['qty'] = 1;
            $ourpass_data['name'] = $items[0]['name'];
            $ourpass_data['description'] = $items[0]['description'];
            $ourpass_data['email'] = '';
            $ourpass_data['src'] = $items[0]['src'];
            $ourpass_data['url'] = $items[0]['url'];
            $ourpass_data['items'] = $items;
            $ourpass_data['metadata'] = [
                'platform' => 'magento',
                'cartId' => $cartId
            ];

            $result = $this->resultJsonFactory->create();
            return $result->setStatusHeader(200)->setData([
                'success' => true,
                'message' => 'checkout detail fetch',
                'data' => $ourpass_data
            ]);
        } catch (\Exception $error) {
            throw $error;
            $result = $this->resultJsonFactory->create();
            return $result->setStatusHeader(400)->setData([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    public function getInvisibleCartFromCart()
    {
        $products = $this->request->getParam('products');

        if(!$products) {
            throw new \Exception('Invalid request');
        }

        $maskedId = $this->cartManagement->createEmptyCart();

        $this->ourpassCheckoutHelper->log($maskedId);

        $newCartId = $this->maskedQuoteIdToQuoteId->execute($maskedId);

        /** @var Quote $newCart */
        $newCart = $this->quoteFactory->create()->load($newCartId, 'entity_id');

        $newCart->setActive(0);

        foreach($products as $product) {
            $productId = isset($product['id']) ? $product['id'] : null;
            $quantity = intval(isset($product['quantity'])? $product['quantity'] : 1);
            $options = (array) (isset($product['options']) ? $product['options'] : null);
    
            $product = $this->productRepository->getById($productId);

            $params = [
                'qty' => $quantity,
            ];
    
            if(count($options) > 0) {
                $super_attribute = [];
                foreach($options as $option) {
                    $super_attribute[$option['id']] = $option['value'];
                }
                $params['super_attribute'] = $super_attribute;
            }

            $buyRequest = new \Magento\Framework\DataObject($params);
    
            $newCart->addProduct($product, $buyRequest);
        }

        /**
         * Init shipping and billing address if quote is new
         */
        if (!$newCart->getId()) {
            $newCart->getShippingAddress();
            $newCart->getBillingAddress();
        }

        $newCart->setId($newCartId);
        $newCart->save();
        
        return $newCart;
    }
}
