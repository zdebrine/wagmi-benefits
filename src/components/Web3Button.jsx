import React, { useEffect } from "react";
import { Button } from "@shopify/polaris";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const Web3Button = ({ ...props }) => {
  const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 137, 80001],
  });
  const { active, account, library, activate } = useWeb3React();

  useEffect(() => {
    const loadData = async () => {
      const web3 = window.web3;
      const networkId = await web3?.eth.net.getId();
    };
    loadData();
  }, []);

  const connectToWallet = async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log("BOOGIE", ex);
    }
  };

  return (
    <Button
      onClick={() => connectToWallet()}
      borderRadius={50}
      color="white"
      size="sm"
      paddingX={4}
      _hover={{ color: "white" }}
      {...props}
    >
      {"Connect Wallet"}
    </Button>
  );
};

export default Web3Button;
