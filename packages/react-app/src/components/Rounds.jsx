import React from "react";
import { Form } from "antd";
import { ethers } from "ethers";
import { useState } from "react";
import StakeItem from "./StakeItem";
import StakeItemCommunity from "./StakeItemCommunity";
import StakingModal from "./StakingModal/StakingModal";
import { UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";

import { getSelfStakeAmount, getCommunityStakeAmount } from "./StakingModal/utils";

const zero = ethers.BigNumber.from("0");

export const STARTING_GRANTS_ROUND = 14;

const Rounds = ({
  tx,
  tokenSymbol,
  address,
  readContracts,
  writeContracts,
  migrate,
  round,
  latestRound,
  roundEnded,
  mainnetProvider,
  userSigner,
  targetNetwork,
  roundData,
}) => {
  const [form] = Form.useForm();
  // Set to visibility of Staking Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stakingType, setStakingType] = useState("self");

  const unstake = async amount => {
    tx(writeContracts.IDStaking.unstake(round + "", ethers.utils.parseUnits(amount)));
  };

  const unstakeUsers = async users => {
    tx(writeContracts.IDStaking.unstakeUsers(round + "", users));
  };

  return (
    <>
      <div className="text-gray-600 body-font">
        <StakeItem
          icon={<UserOutlined style={{ fontSize: "25px" }} />}
          title="Self Staking"
          roundEnded={roundEnded}
          unstake={unstake}
          description="Stake GTC on yourself"
          amount={getSelfStakeAmount(roundData)}
          buttonText={getSelfStakeAmount(roundData) ? "Modify Stake" : "Stake"}
          buttonHandler={() => {
            setStakingType("self");
            setIsModalVisible(true);
          }}
        />

        <StakeItemCommunity
          icon={<UsergroupAddOutlined style={{ fontSize: "25px" }} />}
          roundEnded={roundEnded}
          unstakeUsers={unstakeUsers}
          title="Community Staking"
          description="Stake GTC on other people"
          amount={getCommunityStakeAmount(roundData)}
          buttonText={getCommunityStakeAmount(roundData) ? "Modify Stake" : "Stake"}
          buttonHandler={() => {
            setStakingType("community");
            setIsModalVisible(true);
          }}
          roundData={roundData?.user?.xstakeTo}
          mainnetProvider={mainnetProvider}
        />
      </div>

      <StakingModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        stakingType={stakingType}
        readContracts={readContracts}
        writeContracts={writeContracts}
        tx={tx}
        address={address}
        userSigner={userSigner}
        round={round}
        targetNetwork={targetNetwork}
        mainnetProvider={mainnetProvider}
      />
    </>
  );
};

export default Rounds;
