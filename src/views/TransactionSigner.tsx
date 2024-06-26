import { useDispatch } from "react-redux";
import * as StellarSdk from "@stellar/stellar-sdk";
import isUndefined from "lodash/isUndefined";
import map from "lodash/map";
import {
  importFromXdr,
  clearTransaction,
  setSecrets,
} from "actions/transactionSigner.js";
import TransactionImporter from "components/TransactionImporter.js";
import { EasySelect } from "components/EasySelect";
import OptionsTablePair from "components/OptionsTable/Pair.js";
import SecretKeyPicker from "components/FormComponents/SecretKeyPicker.js";
import { MultiPicker } from "components/FormComponents/MultiPicker";
import HelpMark from "components/HelpMark.js";
import { txPostLink, xdrViewer, feeBumpTxLink } from "helpers/linkBuilder.js";
import { useRedux } from "hooks/useRedux";
import { clickToSelect } from "helpers/clickToSelect";
import scrollOnAnchorOpen from "helpers/scrollOnAnchorOpen.js";
import { validateTxXdr } from "helpers/validateTxXdr";
import Libify from "helpers/Libify.js";
import { addEventHandler } from "helpers/metrics.js";
import transactionSignerMetrics from "metricsHandlers/transactionSigner.js";
import { useIsSoroban } from "hooks/useIsSoroban";

const { signTransaction } = Libify;

addEventHandler(transactionSignerMetrics);

export const TransactionSigner = () => {
  const dispatch = useDispatch();
  const { transactionSigner, network } = useRedux(
    "transactionSigner",
    "network",
  );
  const networkPassphrase = network.current.networkPassphrase;
  const isSoroban = useIsSoroban();

  let TransactionBuilder: any;
  TransactionBuilder = StellarSdk.TransactionBuilder;

  const {
    xdr,
    signers,
    hardwarewalletStatus,
    freighterwalletStatus,
    albedowalletStatus,
  } = transactionSigner;
  let content;

  if (validateTxXdr(xdr).result !== "success") {
    content = (
      <div className="so-back">
        <div className="so-chunk">
          <div className="TxSignerImport TransactionSigner__import">
            <p className="TxSignerImport__title">
              Import a transaction envelope in XDR format:
            </p>
            <TransactionImporter
              networkPassphrase={networkPassphrase}
              onImport={(xdr: string) => dispatch(importFromXdr(xdr))}
            />
          </div>
        </div>
      </div>
    );
  } else {
    let walletSigs = hardwarewalletStatus.signatures;
    let result = signTransaction(
      xdr,
      signers,
      networkPassphrase,
      walletSigs,
      isSoroban,
    );
    let transaction = TransactionBuilder.fromXDR(xdr, networkPassphrase);

    let infoTable = {
      "Signing for": (
        <pre
          className="so-code so-code__wrap"
          data-testid="transaction-signer-network"
        >
          <code>{networkPassphrase}</code>
        </pre>
      ),
      "Transaction Envelope XDR": (
        <EasySelect plain={true}>
          <pre
            className="so-code so-code__wrap"
            data-testid="transaction-signer-xdr"
          >
            <code>{xdr}</code>
          </pre>
        </EasySelect>
      ),
      "Transaction Hash": (
        <EasySelect plain={true}>
          <pre
            className="so-code so-code__wrap"
            data-testid="transaction-signer-hash"
          >
            <code>{transaction.hash().toString("hex")}</code>
          </pre>
        </EasySelect>
      ),
    };

    let codeResult,
      submitLink,
      xdrLink,
      resultTitle,
      submitInstructions,
      feeBumpLink;
    const signedXdr =
      freighterwalletStatus.signedTx ||
      albedowalletStatus.signedTx ||
      result.xdr;

    if (!isUndefined(signedXdr)) {
      codeResult = (
        <pre
          className="TxSignerResult__xdr so-code so-code__wrap"
          data-testid="transaction-signer-result"
          onClick={clickToSelect}
        >
          <code>{signedXdr}</code>
        </pre>
      );
      submitLink = (
        <a
          className="s-button TxSignerResult__submit"
          href={txPostLink(signedXdr)}
          onClick={scrollOnAnchorOpen}
        >
          Submit in Transaction Submitter
        </a>
      );
      xdrLink = (
        <a
          className="s-button TxSignerResult__submit"
          href={xdrViewer(signedXdr, "TransactionEnvelope")}
          onClick={scrollOnAnchorOpen}
        >
          View in XDR Viewer
        </a>
      );
      feeBumpLink = (
        <a
          className="s-button TxSignerResult__submit"
          href={feeBumpTxLink(signedXdr)}
          onClick={scrollOnAnchorOpen}
        >
          Wrap with Fee Bump
        </a>
      );
      resultTitle = (
        <h3 className="TxSignerResult__title">Transaction signed!</h3>
      );
      submitInstructions = (
        <p className="TxSignerResult__instructions">
          Now that this transaction is signed, you can submit it to the network.
          Horizon provides an endpoint called Post Transaction that will relay
          your transaction to the network and inform you of the result.
        </p>
      );
    }

    content = (
      <div>
        <div className="so-back">
          <div className="so-chunk">
            <div className="TxSignerOverview TransactionSigner__overview">
              <div className="TxSignerOverview__titleBar">
                <p className="TxSignerOverview__titleBar__title">
                  Transaction overview
                </p>
                <a
                  className="TxSignerOverview__titleBar__reset"
                  onClick={() => dispatch(clearTransaction())}
                >
                  Clear and import new transaction
                </a>
              </div>
              <div
                className="simpleTable"
                data-testid="transaction-signer-transaction-overview"
              >
                {map(infoTable, (content, label) => {
                  return (
                    <div className="simpleTable__row" key={label}>
                      <div className="simpleTable__row__label">{label}</div>
                      <div className="simpleTable__row__content">{content}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="so-chunk">
            <div
              className="TxSignerKeys TransactionSigner__keys"
              data-testid="transaction-signer-signatures"
            >
              <p className="TxSignerKeys__title">
                Signatures{" "}
                <HelpMark href="https://developers.stellar.org/docs/encyclopedia/signatures-multisig" />
              </p>
              <div className="optionsTable">
                <OptionsTablePair label="Add Signer">
                  <MultiPicker
                    component={SecretKeyPicker}
                    value={signers}
                    onUpdate={(value) => dispatch(setSecrets(value))}
                  />
                </OptionsTablePair>
              </div>
            </div>
          </div>
        </div>
        <div className="so-back TxSignerResult TransactionSigner__result">
          <div className="so-chunk">
            {resultTitle}
            <p className="TxSignerResult__summary">{result.message}</p>
            {codeResult}
            {submitInstructions}
            {submitLink} {xdrLink} {feeBumpLink}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="TransactionSigner" data-testid="page-transaction-signer">
      <div className="so-back">
        <div className="so-chunk">
          <div className="pageIntro">
            <p>
              The transaction signer lets you add signatures to a Stellar
              transaction. Signatures are used in the network to prove that the
              account is authorized to perform the operations in the
              transaction.
            </p>
            <p>
              For simple transactions, you only need one signature from the
              correct account. Some advanced transactions may require more than
              one signature if there are multiple source accounts or signing
              keys.
            </p>
            <p>
              <a
                href="https://developers.stellar.org/docs/encyclopedia/signatures-multisig"
                rel="noreferrer"
                target="_blank"
              >
                Read more about signatures on the developer's site.
              </a>
            </p>
          </div>
        </div>
      </div>
      {content}
    </div>
  );
};
