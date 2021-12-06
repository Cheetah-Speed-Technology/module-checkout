<?php

namespace OurPass\Checkout\Controller\Order;

class Create implements \Magento\Framework\App\Action\HttpPostActionInterface
{
    protected $resultPageFactory;

    /**
     *
     * @var \Magento\Framework\Controller\Result\JsonFactory
     */
    protected $resultJsonFactory;

    /**
     *
     * @var \Magento\Sales\Api\OrderRepositoryInterface
     */
    protected $orderRepository;

    /**
     *
     * @var \Magento\Sales\Api\Data\OrderInterface
     */
    protected $orderInterface;
    protected $checkoutSession;
    protected $messageManager;

    /**
     *
     * @var \OurPass\Checkout\Model\Config\OurPassIntegrationConfig
     */
    protected $ourPassIntegrationConfig;

    /**
     *
     * @var \Magento\Framework\App\Action\Context
     */
    protected $context;

    /**
     * @var \Magento\Framework\Event\Manager
     */
    protected $eventManager;

    /**
     *
     * @var \Psr\Log\LoggerInterface
     */
    protected $logger;

    /**
     *
     * @var \Magento\Framework\UrlInterface
     */
    protected $urlInterface;

    /**
     *
     * @var \Magento\Framework\App\Request\Http
     */
    protected $request;


    /**
     *
     * @var \Magento\Framework\HTTP\Client\Curl
     */
    protected $curl;

    /**
     *
     * @var \OurPass\Checkout\Helper\OurPassCheckout
     */
    protected $ourpassCheckoutHelper;

    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory,
        \Magento\Sales\Api\OrderRepositoryInterface $orderRepository,
        \Magento\Sales\Api\Data\OrderInterface $orderInterface,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Framework\Message\ManagerInterface $messageManager,
        \OurPass\Checkout\Model\Config\OurPassIntegrationConfig $ourPassIntegrationConfig,
        \OurPass\Checkout\Helper\OurPassCheckout $ourpassCheckoutHelper,
        \Magento\Framework\Event\Manager $eventManager,
        \Magento\Framework\App\Request\Http $request,
        \Magento\Framework\UrlInterface $urlInterface,
        \Psr\Log\LoggerInterface $logger,
        \Magento\Framework\HTTP\Client\Curl $curl
    ) {
        $this->context = $context;
        $this->resultPageFactory = $resultPageFactory;
        $this->resultJsonFactory = $resultJsonFactory;
        $this->orderRepository = $orderRepository;
        $this->orderInterface = $orderInterface;
        $this->checkoutSession = $checkoutSession;
        $this->messageManager = $messageManager;
        $this->ourPassIntegrationConfig = $ourPassIntegrationConfig;
        $this->ourpassCheckoutHelper = $ourpassCheckoutHelper;
        $this->eventManager = $eventManager;
        $this->urlInterface = $urlInterface;
        $this->request = $request;
        $this->logger = $logger;
        $this->curl = $curl;
    }



    public function execute()
    {
        try {
            $request = $_POST;

            $reference = trim(isset($request['reference'])? $request['reference']: '');

            if (empty($reference)) {
                throw new \Exception("Checkout reference code is required");
            }

            if (!$this->validateReference($reference)) {
                throw new \Exception("Invalid Checkout reference code");
            }

            if (!$this->ourpassCheckoutHelper->referenceIsUnique($reference)) {
                throw new \Exception("Checkout reference already inserted");
            }

            $data = $this->getOurPassReferenceData($reference);

            if (!$data['status']) {
                throw new \Exception("Checkout wasn't successful");
            }

            $metadata = isset($data['data']['metadata']) ? $data['data']['metadata'] : array();

            $metadata = is_array($metadata) ? $metadata : json_decode($data['data']['metadata'], true);

            if(empty($metadata)) {
                throw new \Exception("Invalid checkout order, metadata not available");
            }

            if (!isset($metadata['cartId']) && empty($metadata['cartId'])) {
                throw new \Exception("Invalid checkout order, cartId not available");
            }

            $data['data']['metadata'] = $metadata;

            $result = $this->ourpassCheckoutHelper->createOrder($data['data']['metadata']['cartId'], $reference, $data['data']);

            $result = $this->resultJsonFactory->create();
            return $result->setStatusHeader(200)->setData([
                'success' => true,
                'message' => 'order created successfully',
            ]);
        } catch (\Exception $error) {
            $result = $this->resultJsonFactory->create();
            return $result->setStatusHeader(400)->setData([
                'success' => false,
                'message' => $error->getMessage(),
            ]);
        }
    }

    protected function getOurPassReferenceData($reference)
    {

        // Create a new cURL resource
        $ch = curl_init($this->ourPassIntegrationConfig->getApiBaseUrl() . '/business/seller-user-check');

        // Setup request to send json via POST
        $payload = json_encode(array(
            "ref" => $reference,
            "api_key" => $this->ourPassIntegrationConfig->getSecretKey()
        ));

        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Execute the POST request
        $result = curl_exec($ch);

        // Close cURL resource
        curl_close($ch);


        return json_decode($result, true);
    }

    protected function validateReference($reference)
    {
        $len = strlen($this->ourPassIntegrationConfig->getOrderPrefix());
        return (substr($reference, 0, $len) === $this->ourPassIntegrationConfig->getOrderPrefix());
    }
}
