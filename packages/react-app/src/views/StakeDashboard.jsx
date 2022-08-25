import React, { useEffect, useState } from "react";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import { Button, Divider, Select, Modal } from "antd";
import axios from "axios";
import { Rounds, Navbar } from "../components";
import { STARTING_GRANTS_ROUND } from "../components/Rounds";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const zero = ethers.BigNumber.from("0");

function StakeDashboard({
  tx,
  readContracts,
  address,
  writeContracts,
  mainnetProvider,
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
  price,
  web3Modal,
  loadWeb3Modal,
  blockExplorer,
}) {
  const [roundInView, setRoundInView] = useState(1);
  const navigate = useNavigate();
  // Route user to dashboard when wallet is connected
  useEffect(() => {
    if (!web3Modal?.cachedProvider) {
      navigate("/");
    }
  }, [web3Modal?.cachedProvider]);

  const [start, duration, tvl] = useContractReader(readContracts, "IDStaking", "fetchRoundMeta", [roundInView]) || [];

  const tokenBalance = ethers.utils.formatUnits(
    useContractReader(readContracts, "Token", "balanceOf", [address]) || zero,
  );
  const tokenSymbol = useContractReader(readContracts, "Token", "symbol");
  const latestRound = (useContractReader(readContracts, "IDStaking", "latestRound", []) || zero).toNumber();

  const rounds = [...Array(latestRound).keys()].map(i => i + 1).reverse();

  const mintToken = async () => {
    tx(writeContracts.Token.mintAmount(ethers.utils.parseUnits("1000")));
  };

  const approve = async () => {
    tx(writeContracts.Token.approve(readContracts.IDStaking.address, ethers.utils.parseUnits("10000000")));
  };

  const stake = async (id, amount) => {
    tx(writeContracts.IDStaking.stake(id + "", ethers.utils.parseUnits(amount)));
  };

  const stakeUsers = async (id, users, amounts) => {
    let data = {};

    try {
      const res = await axios({
        method: "POST",
        url: "https://id-staking-passport-api.vercel.app/api/passport/reader",
        data: {
          address,
          domainChainId: targetNetwork.chainId,
        },
      });

      data = res.data;
    } catch (error) {
      // TODO : Throw notification error
      return null;
    }

    tx(writeContracts.IDStaking.stakeUsers(data.signature, data.nonce, data.timestamp, id + "", users, amounts));
  };

  const unstake = async (id, amount) => {
    tx(writeContracts.IDStaking.unstake(id + "", ethers.utils.parseUnits(amount)));
  };

  const unstakeUsers = async (id, users) => {
    tx(writeContracts.IDStaking.unstakeUsers(id + "", users));
  };

  const migrate = async id => {
    tx(writeContracts.IDStaking.migrateStake(id + ""));
  };

  const handleChange = value => {
    console.log(`selected ${value}`);
    setRoundInView(value);
  };

  return (
    <>
      <Navbar
        networkOptions={networkOptions}
        selectedNetwork={selectedNetwork}
        setSelectedNetwork={setSelectedNetwork}
        yourLocalBalance={yourLocalBalance}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
        localProvider={localProvider}
        address={address}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        selectedChainId={selectedChainId}
        localChainId={localChainId}
        NETWORKCHECK={NETWORKCHECK}
        passport={passport}
        userSigner={userSigner}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        blockExplorer={blockExplorer}
      />

      {/*  Mint Tokens to be removed. These are here for examples */}
      {/* <div
        style={{
          paddingBottom: "10px",
          maxWidth: "600px",
          margin: "6px auto 2px auto",
        }}
      >
        <div style={{ marginTop: "30px" }}>
          <Divider>GTC Token</Divider>
          <div style={{ marginBottom: "10px" }}>
            Token Balance: {tokenBalance} {tokenSymbol}
          </div>

          <div style={{ width: "100%" }}>
            <Button style={{ marginRight: "10px" }} onClick={mintToken}>
              Mint 1000 {tokenSymbol}
            </Button>
            <Button style={{ marginRight: "10px" }} onClick={approve}>
              Approve Stake contract for GTC
            </Button>
          </div>
        </div>
      </div> */}

      {/* Toggle through rounds. This is something we can use after GR15 to switch between grants rounds  */}
      {/* <div className="flex flex-row p-10">
        <p className="ml-10">Choose a round (placeholder to toggle through rounds)</p>
        <Select
          defaultValue={"Round..."}
          style={{
            width: 120,
          }}
          onChange={handleChange}
        >
          {rounds.map(r => (
            <Option value={r}>{`Round: ${r + STARTING_GRANTS_ROUND}`}</Option>
          ))}
        </Select>
      </div> */}

      {/* Grants Round Header */}
      <div className="border-b-2 px-10">
        <p className="font-miriam-libre text-3xl text-left">
          Gitcoin Round {roundInView ? STARTING_GRANTS_ROUND + roundInView : "Not Found"} {/*{round} of {latestRound}*/}
        </p>
        {roundInView ? (
          <p className="font-miriam-libre text-base text-left mb-4">
            {moment.unix((start || zero).toString()).format("MMMM Do YYYY (h:mm:ss a)")} {" - "}
            {moment.unix((start || zero).add(duration || zero).toString()).format("MMMM Do YYYY (h:mm:ss a)")}
          </p>
        ) : (
          <></>
        )}
      </div>
      <div className="pt-2 pb-2 w-full flex flex-row">
        <div className="text-gray-600 body-font w-full">
          {roundInView && (
            <Rounds
              tx={tx}
              key={roundInView}
              round={roundInView}
              stake={stake}
              unstake={unstake}
              address={address}
              migrate={migrate}
              stakeUsers={stakeUsers}
              latestRound={latestRound}
              tokenSymbol={tokenSymbol}
              unstakeUsers={unstakeUsers}
              readContracts={readContracts}
              writeContracts={writeContracts}
              mainnetProvider={mainnetProvider}
            />
          )}
        </div>
        {/* Passport Windows on the  side. This could be moved into its own component */}
        <div className="p-4 w-1/3 flex flex-col">
          <div className="border-2 border-gray-200 px-4 py-6 rounded-lg bg-purple-200">
            <div className="flex flex-row items-center">
              <div className="ml-2 w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h2 className="text-gray-900 text-md text-left ml-6">
                Get staked and receive the Community Staking stamp
              </h2>
            </div>

            <div className="flex-grow pl-6 mt-4">
              <p className="leading-relaxed text-base text-left border-b-2">
                Looks like no one has staked on you yet. Get people you know to stake on you and receive the community
                staking stamp on Gitcoin Passport.
              </p>
              <a className="mt-3 text-indigo-500 inline-flex items-center">More Info</a>
            </div>
          </div>
          <div className="border-2 border-gray-200 px-4 py-6 rounded-lg mt-6 bg-purple-200">
            <div className="flex flex-row items-center">
              <div className="ml-2 w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h2 className="text-gray-900 text-md text-left ml-6">Useful Info 1</h2>
            </div>

            <div className="flex-grow pl-6 mt-4">
              <p className="leading-relaxed text-base text-left border-b-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              </p>
              <a className="mt-3 text-indigo-500 inline-flex items-center">More Info</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StakeDashboard;
