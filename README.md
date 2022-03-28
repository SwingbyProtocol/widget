Swingby's swap widget. (for only BTC-BSC network)

## Getting started

The easiest way to integrate the widget into your app is
[our dedicated SDK](https://github.com/SwingbyProtocol/widget-sdk).

### Minimum sizes

⚠️ Note that both the widget uses `rem` units.

|        |           |
| ------ | --------- |
| Banner | 320x76px  |
| Small  | 320x375px |
| Big    | 320x510px |

## Passing in default values

You may use the following query params to populate the widget’s form for the user.

| Parameter                  | Description                                                         |
| -------------------------- | ------------------------------------------------------------------- |
| `defaultCurrencyDeposit`   | Currency that the user will send to Skybridge.                      |
| `defaultCurrencyReceiving` | Currency that the user will receive from Skybridge.                 |
| `defaultAmountDesired`     | Amount of the chosen “currency in” that the user wants to swap.     |
| `defaultAddressReceiving`  | The user’s address that Skybridge should send the swapped funds to. |
| `aff`                      | Affiliate code from Swingby's affiliate program.                    |
