curl https://connect.squareup.com/v2/locations/PR4NVQPCRMEYP/checkouts \
  -X POST \
  -H 'Square-Version: 2020-07-22' \
  -H 'Authorization: Bearer EAAAEM258AC31Bsjmqof2qcdEeohSzhJEuWbFcyiFp3Z1JVbyqPrCmKruAMuLbAZ' \
  -H 'Content-Type: application/json' \
  -d '{
    "idempotency_key": "86ae1696-b1e3-4328-af6d-f1e04d947ad6",
    "redirect_url": "https://merchant.website.com/order-confirm",
    "order": {
      "idempotency_key": "12ae1696-z1e3-4328-af6d-f1e04d947gd4",
      "order": {
        "location_id": "PR4NVQPCRMEYP",
        "line_items": [
          {
            "name": "Printed T Shirt",
            "quantity": "2",
            "base_price_money": {
              "amount": 1500,
              "currency": "USD"
            },
          },
          {
            "name": "Slim Jeans",
            "quantity": "1",
            "base_price_money": {
              "amount": 2500,
              "currency": "USD"
            }
          },
          {
            "name": "Woven Sweater",
            "quantity": "3",
            "base_price_money": {
              "amount": 3500,
              "currency": "USD"
            }
          }
        ]
      }
    },
    "ask_for_shipping_address": true,
    "merchant_support_email": "merchant+support@website.com",
    "pre_populate_buyer_email": "example@email.com",
    "pre_populate_shipping_address": {
      "address_line_1": "1455 Market St.",
      "address_line_2": "Suite 600",
      "locality": "San Francisco",
      "administrative_district_level_1": "CA",
      "postal_code": "94103",
      "country": "US",
      "first_name": "Jane",
      "last_name": "Doe"
    }
  }'
