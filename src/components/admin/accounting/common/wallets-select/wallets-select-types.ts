import { FieldRenderProps } from 'react-final-form';

type CustomWalletsSelectProps = {
    hasExternalCardWallets?: boolean;
    onlyCustomInternalWallets?: boolean;
    showSelectedWalletDetails?: boolean;
};

export type WalletsSelectProps = FieldRenderProps<string> & CustomWalletsSelectProps;
