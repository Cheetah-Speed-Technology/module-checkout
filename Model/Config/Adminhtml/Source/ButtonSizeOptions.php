<?php

namespace OurPass\Checkout\Model\Config\Adminhtml\Source;

use Magento\Framework\Data\OptionSourceInterface;


/**
 * Class ButtonSizeOptions
 */
class ButtonSizeOptions implements OptionSourceInterface
{
    /**
     * Possible actions on order place
     *
     * @return array
     */
    public function toOptionArray()
    {
        return [
            [
                'value' => 'default',
                'label' => __('Default'),
            ],
            [
                'value' => 'compact',
                'label' => __('Compact'),
            ],
            [
                'value' => 'large',
                'label' => __('Large'),
            ]
        ];
    }
}
