import { useEffect, useState } from "react";
import { Card } from "@shopify/polaris";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { gql, useMutation, useQuery } from "@apollo/client";

import { userLoggedInFetch } from "../App";
import { Button, Flex, Text } from "@chakra-ui/react";

const PRODUCTS_QUERY = gql`
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        title
      }
    }
  }
`;

const WIDGET_QUERY = gql`
  mutation {
    scriptTagCreate(
      input: {
        cache: false
        displayScope: ONLINE_STORE
        src: "https://1079b5354412.ngrok.io/script-tag.js"
      }
    ) {
      scriptTag {
        id
        src
        displayScope
      }
    }
  }
`;

const dummyDiscounts = [
  {
    collectionName: "Bored Ape Yacht Club",
    collectionUrl: "https://opensea.io/collection/boredapeyachtclub",
    discount: 5,
    isPercent: true,
  },
  {
    collectionName: "AstroKids",
    collectionUrl: "https://opensea.io/collection/astrokids",
    discount: 7,
    isPercent: true,
  },
  {
    collectionName: "CryptoPunks",
    collectionUrl: "https://opensea.io/collection/cryptopunks",
    discount: 3,
    isPercent: true,
  },
  {
    collectionName: "Culture Cubs by Snobiety",
    collectionUrl: "https://opensea.io/collection/culturecubs",
    discount: 5,
    isPercent: true,
  },
];

export function ExistingDiscounts() {
  const [populateProduct, { loading }] = useMutation(PRODUCTS_QUERY);
  const [createWidgetQueryMutation, { data }] = useMutation(WIDGET_QUERY);
  const [productCount, setProductCount] = useState(0);
  const [hasResults, setHasResults] = useState(false);
  const [exisitingDiscounts, setExisitingDiscounts] = useState([]);

  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  async function updateProductCount() {
    const { count } = await fetch("/products-count").then((res) => res.json());
    setProductCount(count);
  }

  const STORE_QUERY = gql`
    {
      shop {
        id
      }
    }
  `;
  const { data: storeData } = useQuery(STORE_QUERY);

  useEffect(() => {
    updateProductCount();
    createWidgetQueryMutation();
  }, []);

  useEffect(() => {
    if (storeData?.shop?.id) {
      fetch(`http://localhost:3002/discounts?shopId=${storeData?.shop?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setExisitingDiscounts(data);
        });
    }
  }, [storeData]);

  const onDeleteDiscount = (id) => {
    fetch(`http://localhost:3002/discounts?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => console.log("SUCCESS", data))
      .catch((error) => console.log("ERROR", error));
  };

  if (!storeData?.shop?.id || !exisitingDiscounts) {
    return <></>;
  }

  console.log(exisitingDiscounts);

  return (
    <>
      <Card title="Existing Discounts" sectioned>
        {exisitingDiscounts.map((collection) => (
          <Flex
            key={collection.collection_name}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Text
              as="button"
              textAlign={"left"}
              fontWeight="bold"
              width="150px"
              isTruncated
              _hover={{ textDecoration: "underline", color: "gray.400" }}
            >
              {collection.collection_name}
            </Text>
            <Flex justifyContent={"left"} width="100px">
              <Text fontWeight="bold" color="green.400">
                {collection.is_percent
                  ? `${collection.discount}%`
                  : `$${collection.discount.toFixed(2)}`}
              </Text>
            </Flex>
            <Flex>
              <Button
                onClick={() => onDeleteDiscount(collection.discount_id)}
                backgroundColor="transparent"
              >
                {"❌"}
              </Button>
            </Flex>
          </Flex>
        ))}
      </Card>
    </>
  );
}
