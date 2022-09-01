import React from "react";
import { Button, Empty, Form, InputNumber, Modal, Select } from "antd";
import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import { useState } from "react";
import Address from "./Address";
import AddressInput from "./AddressInput";
import StakeItem from "./StakeItem";
import StakingModal from "./StakingModal/StakingModal";
import { gql, useQuery } from "@apollo/client";

import { getSelfStakeAmount, getCommunityStakeAmount } from "./StakingModal/utils";

const zero = ethers.BigNumber.from("0");

export const STARTING_GRANTS_ROUND = 11;

const Rounds = ({
  tx,
  tokenSymbol,
  address,
  readContracts,
  writeContracts,
  stake,
  unstake,
  migrate,
  round,
  latestRound,
  mainnetProvider,
  stakeUsers,
  unstakeUsers,
  userSigner,
  targetNetwork,
}) => {
  const [form] = Form.useForm();
  // Set to visibility of Staking Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stakingType, setStakingType] = useState("self");
  const [usersToUnstake, setUsersToUnstake] = useState([]);

  const query = gql(`
    query User($address: String!, $round: BigInt!) {
      user(id: $address) {
        xstakeAggregates (where: { round: $round }) {
          id
          total
        },
        stakes(where: { round: $round }) {
          stake
          round {
            id
          }
        }
      }
    }
  `);

  const { loading, data, error } = useQuery(query, {
    pollInterval: 2500,
    variables: {
      address: address.toLowerCase(),
      round: round,
    },
  });

  console.log("view new data ", data, error);

  return (
    <>
      <div className="text-gray-600 body-font">
        <StakeItem
          icon={
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
          }
          title="Stake on yourself"
          description="Some explanation on what this means"
          amount="0"
          buttonText="Stake"
          buttonHandler={() => {
            setStakingType("community");
            setIsModalVisible(true);
          }}
        />

        <StakeItem
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              className="w-4 h-4"
              viewBox="0 0 24 24"
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          }
          title="Stake on other people"
          description="Some explanation on what this means"
          amount="0"
          buttonText="Stake"
          buttonHandler={() => {
            setStakingType("self");
            setIsModalVisible(true);
          }}
        />
      </div>

      {/* I commented this out so we have this example for reference. This will be removed.  */}
      {/* <Menu
        mode="horizontal"
        defaultSelectedKeys={["self"]}
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        onSelect={({ key }) => setOpenView(key)}
      >
        <Menu.Item key="self">Self Staking</Menu.Item>
        <Menu.Item key="community">Community Staking</Menu.Item>
      </Menu>

      <div style={{ padding: "5px", marginTop: "10px" }}>
        {openView === "self" && (
          <div style={{ width: "100%", marginTop: "5px" }}>
            <Button style={{ marginRight: "10px" }} onClick={() => stake(round, "100")}>
              Stake 100 {tokenSymbol}
            </Button>
            <Button style={{ marginRight: "10px" }} onClick={() => unstake(round, "100")}>
              Unstake 100 {tokenSymbol}
            </Button>
            {round !== latestRound && stakedBalance !== "0.0" && (
              <Button style={{ marginRight: "10px" }} onClick={() => migrate(round)}>
                Migrate Stake {tokenSymbol}
              </Button>
            )}
          </div>
        )}

        {openView === "community" && (
          <div style={{ width: "100%", marginTop: "5px" }}>
            <Typography.Title level={5} style={{ marginBottom: "10px" }}>
              Stake on other user
            </Typography.Title>
            <Form
              form={form}
              style={{
                margin: "0px auto",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: "0px 10px",
              }}
              initialValues={{ amount: "10" }}
              name="stakeUsers"
              layout="inline"
              onFinish={handleStakeUsers}
            >
              <Form.Item name="address" required>
                <AddressInput ensProvider={mainnetProvider} placeholder="Address of user" />
              </Form.Item>
              <Form.Item name="amount" required>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item>
                <Button style={{ marginRight: "10px" }} htmlType="submit">
                  Stake on User
                </Button>
              </Form.Item>
            </Form>

            {!loading && (data?.user?.xstakeTo || []).length > 0 ? (
              <div style={{ marginTop: "20px" }}>
                <Table
                  rowSelection={{ type: "checkbox", onChange: keys => setUsersToUnstake(keys) }}
                  rowKey={x => x.to.address}
                  columns={columns}
                  dataSource={data?.user?.xstakeTo || []}
                />
                {usersToUnstake.length > 0 && (
                  <Button
                    onClick={async () => {
                      await unstakeUsers(round, usersToUnstake);
                    }}
                  >
                    Unstake {usersToUnstake.length} users
                  </Button>
                )}
              </div>
            ) : (
              <div style={{ marginTop: "30px" }}>
                <Empty description="You haven't staked on anyone in the community... yet" />
              </div>
            )}
          </div>
        )}
      </div> */}
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
