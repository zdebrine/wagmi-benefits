import React, { useState, useCallback, useEffect } from "react";
import { Button, Form, FormLayout, TextField, Stack } from "@shopify/polaris";
import { Text } from "@chakra-ui/react";
import { gql, useMutation, useQuery } from "@apollo/client";

const CollectionInputForm = ({ ...props }) => {
  const [url, setUrl] = useState("");
  const [discount, setDiscount] = useState("");
  const [isPercent, setIsPercent] = useState(true);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState("");
  const [code, setCode] = useState("");

  const STORE_QUERY = gql`
    {
      shop {
        id
        name
        currencyCode
        checkoutApiSupported
        taxesIncluded
        primaryDomain {
          url
        }
      }
    }
  `;
  const { data } = useQuery(STORE_QUERY);

  console.log(data);

  useEffect(() => {
    const generateSlug = () => {
      let arr = url.split("/");
      return arr[arr.length - 1];
    };
    setSlug(generateSlug());
    setCode(`WAGMI${Math.random().toFixed(4)}`);
  }, [url]);

  const DISCOUNT_QUERY = gql`
  mutation {
    discountCodeBasicCreate(
      basicCodeDiscount: {
        title: "${slug}"
        endsAt: "2023-01-01"
        startsAt: "2022-04-01"
        usageLimit: 1000
        appliesOncePerCustomer: true
        customerSelection: { all: true }
        code: "${code}"
        customerGets: { value: { percentage: ${Number(
          discount * 0.01
        )} }, items: { all: true } }
      }
    ) {
      userErrors {
        field
        message
        code
      }
      codeDiscountNode {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            summary
            status
            codes(first: 10) {
              edges {
                node {
                  code
                }
              }
            }
          }
        }
      }
    }
  }
`;

  const [createDiscountCodeMutation, { data: discountData }] =
    useMutation(DISCOUNT_QUERY);

  const handleSubmit = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const shop = urlParams.get("shop");
    const storeUrl = "https://" + shop + "/shop.json";
    setLoading(true);
    await createDiscountCodeMutation();
    fetch("http://localhost:3002/create-discount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        discount: discount,
        isPercent: isPercent,
        collectionUrl: url,
        id: data.shop.id,
        domain: data.shop.primaryDomain.url,
        code:
          discountData?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount
            ?.codes?.edges?.[0].node.code || code,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setLoading(false);
  };

  const handleUrlChange = useCallback((value) => setUrl(value), []);
  const handleDiscountChange = useCallback((value) => setDiscount(value), []);

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <FormLayout>
        <Text fontWeight="semibold">{"OpenSea Collection URL"}</Text>
        <TextField
          value={url}
          onChange={handleUrlChange}
          type="url"
          autoComplete="off"
        />
        <Text fontWeight="semibold">{"Discount amount"}</Text>
        <Stack alignment="center">
          <TextField
            value={discount}
            onChange={handleDiscountChange}
            type="number"
            autoComplete="off"
          />
          <Button
            primary={isPercent}
            onClick={() => {
              setIsPercent(true);
              setDiscount(Number(discount).toFixed(0));
            }}
          >
            {"%"}
          </Button>
          {/* <Button
            primary={!isPercent}
            onClick={() => {
              setIsPercent(false);
              setDiscount(Number(discount).toFixed(2));
            }}
          >
            {"$"}
          </Button> */}
        </Stack>
        <Button onClick={() => handleSubmit()} loading={loading}>
          Submit
        </Button>
      </FormLayout>
    </Form>
  );
};

export default CollectionInputForm;
