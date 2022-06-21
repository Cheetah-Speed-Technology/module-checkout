<?php

namespace OurPass\Checkout\Controller\Cart;

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
        \Magento\Framework\UrlInterface $urlInterface,
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
        $this->urlInterface = $urlInterface;
        $this->ourPassIntegrationConfig = $ourPassIntegrationConfig;
        $this->ourpassCheckoutHelper = $ourpassCheckoutHelper;
    }

    public function execute()
    {
        try {
            $quote = $this->checkoutSession->getQuote();

            $cartId = $this->getInvisibleCartFromCart($quote);

            //Getting the items;
            $items = array();

            foreach ($this->checkoutSession->getQuote()->getAllVisibleItems() as  $cartItem) {
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
            }

            if (!isset($items[0]) && empty($items[0])) {
                throw new \Exception('Cart is empty');
            }

            $referenceCode = $this->ourPassIntegrationConfig->getOrderPrefix() . '' . md5(uniqid(bin2hex(random_bytes(20)), true)). ''. $cartId;

            $ourpass_data = array();

            $ourpass_data['env'] = $this->ourPassIntegrationConfig->getEnvironment();
            $ourpass_data['api_key'] = $this->ourPassIntegrationConfig->getSecretKey();
            $ourpass_data['sub_account_key'] = $this->ourPassIntegrationConfig->getSubAccountKey();
            $ourpass_data['reference'] = $referenceCode;
            $ourpass_data['amount'] = floatval($this->checkoutSession->getQuote()->getSubtotal());
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
            $result = $this->resultJsonFactory->create();
            return $result->setStatusHeader(400)->setData([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }


    public function getInvisibleCartFromCart(Quote $quote): string
    {
        //Get cart from cart ID
        /** @var Quote $currentCart */
        $currentCart = $this->quoteRepository->get($quote->getEntityId());

        $maskedId = $this->cartManagement->createEmptyCart();

        $this->ourpassCheckoutHelper->log($maskedId);

        $newCartId = $this->maskedQuoteIdToQuoteId->execute($maskedId);
        /** @var Quote $newCart */
        $newCart = $this->quoteFactory->create()->load($newCartId, 'entity_id');

        //$newCart->setData($currentCart->getData());
        $newCart->setActive(0);

        $newCart->setCouponCode($currentCart->getCouponCode());

        //$newCart->removeAllItems();

        foreach ($currentCart->getAllVisibleItems() as $item) {
            $this->ourpassCheckoutHelper->log('item ' . $item->getName());
            $newItem = clone $item;
            $newCart->addItem($newItem);
            if ($item->getHasChildren()) {
                foreach ($item->getChildren() as $child) {
                    $newChild = clone $child;
                    $newChild->setParentItem($newItem);
                    $newCart->addItem($newChild);
                }
            }
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
        $this->ourpassCheckoutHelper->log(json_encode($newCart->getData()));
        foreach ($newCart->getAllVisibleItems() as $item) {
            $this->ourpassCheckoutHelper->log($item->getName());
        }
        return $maskedId;
    }
}
