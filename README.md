Swingby's swap widget.

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

| Parameter              | Description                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| `defaultCurrencyIn`    | Currency that the user will send to Skybridge.                      |
| `defaultCurrencyOut`   | Currency that the user will receive from Skybridge.                 |
| `defaultAmountUser`    | Amount of the chosen “currency in” that the user wants to swap.     |
| `defaultAddressUserIn` | The user’s address that Skybridge should send the swapped funds to. |
