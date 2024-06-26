import { addEventHandler } from "helpers/metrics.js";
import accountCreatorMetrics from "metricsHandlers/accountCreator.js";
import { KeypairGenerator } from "views/KeypairGenerator";
import { MuxedAccount } from "views/MuxedAccount";
import { MnemonicTransfer } from "./MnemonicTransfer";

addEventHandler(accountCreatorMetrics);

export const AccountCreator = () => {
  return (
    <div className="AccountCreator" data-testid="page-account-creator">
      <KeypairGenerator />
      <div className="so-back AccountCreator__separator"></div>
      <MnemonicTransfer />
      <div className="so-back AccountCreator__separator"></div>
      <MuxedAccount />
    </div>
  );
};
