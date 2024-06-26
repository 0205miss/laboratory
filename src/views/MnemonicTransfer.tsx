import { useDispatch } from "react-redux";
import {
  transfermnemonic,
  updateMnemonicInput,
} from "actions/accountCreator.js";
import PubKeyPicker from "components/FormComponents/PubKeyPicker";
import { useRedux } from "hooks/useRedux";

const mnemonicLabel = {
  mnemonicPublicAddress: "Public Address G Address",
  mnemonicSecretAddress: "Secret Key S...",
  MnemonicAddress: "Mnemonic Address",
};

export const MnemonicTransfer = () => {
  const { accountCreator } = useRedux("accountCreator");
  const { mnemonicGenerated } = accountCreator;
  const dispatch = useDispatch();

  return (
    <div
      className="so-back AccountCreator__section"
      data-testid="page-muxed-account"
    >
      <div className="so-chunk">
        <h3>Mnemonic Transfer</h3>

        <p className="AccountCreator__note--alert">
          Due to the security reason. If you afraid or untrust the website. You
          can disconnect the internet, or just don't use it.
        </p>

        <div className="AccountCreator__spaceTop">

          <div className="picker--spaceBottom">
            <p className="AccountCreator__label">
              {mnemonicLabel.MnemonicAddress}:
            </p>

            <PubKeyPicker
              value={mnemonicGenerated.gAddress}
              placeholder="Example: climb ring climb xxxx ...."
              onUpdate={(gAddress: string) => {
                dispatch(updateMnemonicInput({ gAddress }));
              }}
              data-testid="mnemonic-create-g-address"
              mnemonic={true}
            />
          </div>

          <button
            className="s-button"
            disabled={!mnemonicGenerated.gAddress}
            onClick={() => {
              dispatch(transfermnemonic(mnemonicGenerated.gAddress));
            }}
            data-testid="mnemonic-create-button"
          >
            Transfer
          </button>

          {mnemonicGenerated.errorMessage ? (
            <p className="picker__errorMessage">
              {mnemonicGenerated.errorMessage}
            </p>
          ) : null}

          {mnemonicGenerated.publicAddress ? (
            <div className="simpleTable AccountCreator__generator__table">
              <div className="simpleTable__row">
                <div className="simpleTable__row__label">
                  {mnemonicLabel.mnemonicPublicAddress}
                </div>
                <div className="simpleTable__row__content">
                  {mnemonicGenerated.publicAddress}
                </div>
              </div>
              <div className="simpleTable__row">
                <div className="simpleTable__row__label">
                  {mnemonicLabel.mnemonicSecretAddress}
                </div>
                <div className="simpleTable__row__content">
                  {mnemonicGenerated.secretAddress}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
