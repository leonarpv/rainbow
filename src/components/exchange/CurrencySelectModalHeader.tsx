import { ThemeContextProps } from '@rainbow-me/theme';
import { useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { delayNext } from '../../hooks/useMagicAutofocus';
import { CoinIcon } from '../coin-icon';
import { BackButton } from '../header';
import { Centered } from '../layout';
import { SheetHandleFixedToTop } from '../sheet';
import { TruncatedText } from '../text';
import { Inset } from '@rainbow-me/design-system';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import styled from '@rainbow-me/styled-components';
import { borders, padding } from '@rainbow-me/styles';

const BackButtonWrapper = styled(Centered)({
  bottom: 0,
  left: 0,
  position: 'absolute',
  top: 3,
});

export const CurrencySelectModalHeaderHeight = 59;
const HeaderContainer = styled(Centered)({
  ...borders.buildRadiusAsObject('top', 12),
  backgroundColor: ({ theme: { colors } }: { theme: ThemeContextProps }) =>
    colors.white,
  height: CurrencySelectModalHeaderHeight,
  width: '100%',
});

const Title = styled(TruncatedText).attrs({
  align: 'center',
  lineHeight: 'loose',
  size: 'large',
  weight: 'heavy',
})({
  ...padding.object(1, 0, 0),
  height: 21,
});

export default function CurrencySelectModalHeader({
  handleBackButton,
  showBackButton,
  showHandle,
  testID,
}: {
  handleBackButton: () => void;
  showBackButton: boolean;
  showHandle: boolean;
  testID: string;
}) {
  const { navigate, dangerouslyGetState } = useNavigation();
  const {
    params: { defaultOutputAsset, setPointerEvents, title, showCoinIcon },
  } = useRoute<any>();

  const handlePressBack = useCallback(() => {
    // @ts-expect-error – updating read-only property
    dangerouslyGetState().index = 1;
    setPointerEvents(false);
    delayNext();
    handleBackButton();
    navigate(Routes.MAIN_EXCHANGE_SCREEN);
  }, [dangerouslyGetState, handleBackButton, navigate, setPointerEvents]);

  return (
    <HeaderContainer>
      {/** @ts-expect-error JavaScript component */}
      {showHandle && <SheetHandleFixedToTop />}
      {showBackButton && (
        <BackButtonWrapper>
          {/** @ts-expect-error JavaScript component */}
          <BackButton
            direction="left"
            height={CurrencySelectModalHeaderHeight}
            onPress={handlePressBack}
            testID={testID}
            textChevron={android}
            throttle
          />
        </BackButtonWrapper>
      )}
      {showCoinIcon && (
        <Inset right="4px" top="3px">
          <CoinIcon size={20} {...defaultOutputAsset} />
        </Inset>
      )}
      <Title>{title}</Title>
    </HeaderContainer>
  );
}
