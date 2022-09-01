import React, { useContext } from "react";
import { Account } from "../components";

import { Web3Context } from "../helpers/Web3Context";

export default function Navbar({
  networkOptions,
  selectedNetwork,
  setSelectedNetwork,
  yourLocalBalance,
  USE_NETWORK_SELECTOR,
  localProvider,
  targetNetwork,
  logoutOfWeb3Modal,
  selectedChainId,
  localChainId,
  NETWORKCHECK,
  passport,
  userSigner,
  mainnetProvider,
  price,
  web3Modal,
  loadWeb3Modal,
  blockExplorer,
}) {
  const { address, setAddress, currentNetwork } = useContext(Web3Context);
  return (
    <nav className="App md:pb-4 sm:pb-20 flex flex-col">
      <div className="p-4 mx-auto flex flex-wrap items-center w-full">
        <div className="invisible flex flex-wrap p-5 md:visible md:flex-row">
          <div className="float-right mb-4 flex flex-row items-center font-medium text-gray-900 md:mb-0">
            <img src="/gitcoinLogoDark.svg" alt="Gitcoin Logo" />
            <img className="ml-6 mr-6" src="/logoLine.svg" alt="Logo Line" />
            <img src="/greyEllipse.svg" alt="pPassport Logo" />
            <span className="ml-6 text-grey-500 font-bold text-lg">IDENTITY STAKING</span>
          </div>
        </div>
        <div className="ml-auto">
          <Account
            passport={passport}
            address={address}
            localProvider={localProvider}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            price={price}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={blockExplorer}
            minimized={undefined}
            isContract={undefined}
            networkOptions={networkOptions}
          />
        </div>
      </div>
    </nav>
  );
}
