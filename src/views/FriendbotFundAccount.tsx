import { useDispatch } from "react-redux";
import {
  updateFriendbotTarget,
  startFriendbotRequest,
} from "actions/accountCreator.js";
import { CodeBlock } from "components/CodeBlock";
import PubKeyPicker from "components/FormComponents/PubKeyPicker";
import NETWORK from "constants/network.js";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "types/types";

export const FriendbotFundAccount = () => {
  const { accountCreator, network } = useRedux("accountCreator", "network");
  const { friendbotStatus, friendbotTarget } = accountCreator;
  const baseURL = network.current.horizonURL;
  const IS_TESTNET2 = baseURL === NETWORK.available.TestNet2.horizonURL;
  const IS_TESTNET = baseURL === NETWORK.available.TestNet.horizonURL;

  const dispatch = useDispatch();

  const getMessageAlertType = (status: ActionStatus) => {
    switch (status) {
      case ActionStatus.LOADING:
        return "s-alert--info";
      case ActionStatus.SUCCESS:
        return "s-alert--success";
      case ActionStatus.FAILURE:
        return "s-alert--alert";
      default:
        return "";
    }
  };

  const renderFriendbotResultCodeblock = () => {
    if (friendbotStatus.code) {
      <CodeBlock
        className="AccountCreator__spaceTop"
        code={friendbotStatus.code}
        language="json"
      />;
    }

    return null;
  };

  const renderFriendbotMessage = () => {
    if (friendbotStatus.message) {
      return (
        <div
          className={`s-alert AccountCreator__friendbot__alert ${getMessageAlertType(
            friendbotStatus.status,
          )}`}
        >
          {friendbotStatus.message}
        </div>
      );
    }

    return null;
  };

  if (IS_TESTNET || IS_TESTNET2) {
    return (
      <div
        className="so-back AccountCreator__section"
        data-testid="page-friendbot"
      >
        <div className="so-chunk">
          <h3>
            Friendbot: Fund a {IS_TESTNET ? "TESTNET" : "TESTNET2"} network
            account
          </h3>
          <p>
            The friendbot is a horizon API endpoint that will fund an account
            with 10,000 lumens on the {IS_TESTNET ? "TESTNET " : "TESTNET2"}{" "}
            network.
          </p>

          <PubKeyPicker
            className="picker--spaceBottom"
            value={friendbotTarget}
            onUpdate={(accountId: string) => {
              dispatch(updateFriendbotTarget(accountId));
            }}
            data-testid="friendbot-test-account"
          />

          <button
            className="s-button"
            disabled={friendbotTarget.length === 0}
            onClick={() =>
              dispatch(startFriendbotRequest(friendbotTarget, IS_TESTNET))
            }
          >
            Get test network lumens
          </button>

          {renderFriendbotMessage()}
          {renderFriendbotResultCodeblock()}
        </div>
      </div>
    );
  }

  return null;
};
