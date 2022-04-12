import { Text } from "@chakra-ui/react";
import { Card, Page, Layout, Image, Stack } from "@shopify/polaris";

import trophyImgUrl from "../assets/home-trophy.png";
import CollectionInputForm from "./CollectionInputForm";
import { ExistingDiscounts } from "./ExistingDiscounts";

import { ProductsCard } from "./ProductsCard";

export function HomePage() {
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <Text fontSize={"3xl"} fontWeight="bold" marginBottom={4}>
                  {"Welcome to WAGMI Benefits"}
                </Text>
                <Text>
                  {
                    "You can now give discounts to people who hold NFT collections. Just post the URL of the OpenSea collection and how much of a discount you want to give to holders"
                  }
                </Text>
                <br />
                <CollectionInputForm />
              </Stack.Item>
              <Stack.Item>
                <div style={{ padding: "0 20px" }}>
                  <Image
                    source={trophyImgUrl}
                    alt="Nice work on building a Shopify app"
                    width={120}
                  />
                </div>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <ExistingDiscounts />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
