import lang from 'i18n-js';
import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import SheetActionButton from './SheetActionButton';
import {
  CurrencySelectionTypes,
  ExchangeModalTypes,
} from '@rainbow-me/helpers';
import AssetInputTypes from '@rainbow-me/helpers/assetInputTypes';
import {
  useExpandedStateNavigation,
  useSwapCurrencyHandlers,
} from '@rainbow-me/hooks';
import Routes from '@rainbow-me/routes';
import { ethereumUtils } from '@rainbow-me/utils';

function SwapActionButton({
  asset,
  color: givenColor,
  inputType,
  label,
  requireVerification,
  verified,
  weight = 'heavy',
  ...props
}) {
  const { colors } = useTheme();
  const color = givenColor || colors.swapPurple;

  const { updateInputCurrency, updateOutputCurrency } = useSwapCurrencyHandlers(
    {
      defaultInputAsset: inputType === AssetInputTypes.in ? asset : null,
      defaultOutputAsset: inputType === AssetInputTypes.out ? asset : null,
      shouldUpdate: true,
      type: ExchangeModalTypes.swap,
    }
  );

  const navigate = useExpandedStateNavigation(inputType);
  const goToSwap = useCallback(() => {
    navigate(Routes.EXCHANGE_MODAL, params => {
      if (params.outputAsset) {
        return {
          params: {
            chainId: ethereumUtils.getChainIdFromType(asset.type),
            defaultOutputAsset: asset,
            fromDiscover: true,
            onSelectCurrency: updateInputCurrency,
            params: {
              ...params,
              ignoreInitialTypeCheck: true,
            },
            title: lang.t('swap.modal_types.get_symbol_with', {
              symbol: params.outputAsset.symbol,
            }),
            type: CurrencySelectionTypes.input,
          },
          screen: Routes.CURRENCY_SELECT_SCREEN,
        };
      } else {
        return {
          params: {
            chainId: ethereumUtils.getChainIdFromType(asset.type),
            defaultInputAsset: asset,
            fromDiscover: true,
            onSelectCurrency: updateOutputCurrency,
            params: {
              ...params,
              ignoreInitialTypeCheck: true,
            },
            title: lang.t('swap.modal_types.swap'),
            type: CurrencySelectionTypes.output,
          },
          screen: Routes.CURRENCY_SELECT_SCREEN,
        };
      }
    });
  }, [asset, navigate, updateInputCurrency, updateOutputCurrency]);
  const handlePress = useCallback(() => {
    if (requireVerification && !verified) {
      Alert.alert(
        lang.t('exchange.unverified_token.unverified_token_title'),
        lang.t('exchange.unverified_token.token_not_verified'),
        [
          {
            onPress: goToSwap,
            text: lang.t('button.proceed_anyway'),
          },
          {
            style: 'cancel',
            text: lang.t('exchange.unverified_token.go_back'),
          },
        ]
      );
    } else {
      goToSwap();
    }
  }, [goToSwap, requireVerification, verified]);

  return (
    <SheetActionButton
      {...props}
      color={color}
      label={label || `􀖅 ${lang.t('button.swap')}`}
      onPress={handlePress}
      testID="swap"
      weight={weight}
    />
  );
}

export default React.memo(SwapActionButton);
