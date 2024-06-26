import NETWORK from "constants/network.js";
import { useRedux } from "hooks/useRedux";

export const useIsSoroban = () => {
  const { network } = useRedux("network");
  const { horizonURL, networkPassphrase } = network.current;
  const url = new URL(horizonURL);

  let isOnFuturenet = false;
  if (
    (url.origin === NETWORK.available.TestNet.horizonURL &&
      networkPassphrase === NETWORK.available.TestNet.networkPassphrase) ||
    (url.origin === NETWORK.available.TestNet2.horizonURL &&
      networkPassphrase === NETWORK.available.TestNet2.networkPassphrase)
  ) {
    isOnFuturenet = true;
  }
  return isOnFuturenet;
};
