This is the documentation for all options.


# Table of Contents
- [PlayerOptions](#PlayerOptions)
- [PlayerManagerOptions](#PlayerManagerOptions)
- [GameOptions](#GameOptions)
- [BullsAndCowsOptions](#BullsAndCowsOptions)
- [FinalCodeOptions](#FinalCodeOptions)
- [FlipTripOptions](#FlipTripOptions)
- [GomokuOptions](#GomokuOptions)
- [LightsUpOptions](#LightsUpOptions)
- [TicTacToeOptions](#TicTacToeOptions)
- [DjsGameWrapperOptions](#DjsGameWrapperOptions)
- [DjsBullsAndCowsOptions](#DjsBullsAndCowsOptions)
- [DjsFinalCodeOptions](#DjsFinalCodeOptions)
- [DjsFlipTripOptions](#DjsFlipTripOptions)
- [DjsGomokuOptions](#DjsGomokuOptions)
- [DjsLightsUpOptions](#DjsLightsUpOptions)
- [DjsTicTacToeOptions](#DjsTicTacToeOptions)


# PlayerOptions
| parameter | type            | default    | description                 |
|-----------|-----------------|------------|-----------------------------|
| bot       | boolean         | `false`    | Whether the player is a bot |
| id        | \*              | *required* | The id of the player        |
| symbol    | string \| null  | `null`     | The symbol of the player    |
| username  | string          | `"Player"` | The username of the player  |


# PlayerManagerOptions
| parameter        | type                              | default         | description                                |
|------------------|-----------------------------------|-----------------|--------------------------------------------|
| firstPlayerIndex | number                            | `1`             | The index of the first player              |
| players          | [PlayerOptions](#PlayerOptions)[] | *required*      | All players' data                          |
| playerCountRange | number[]                          | `[1, Infinity]` | The range that the player count can be in  |
| requireSymbol    | boolean                           | `false`         | Whether all players need their own symbols |


# GameOptions
| parameter            | type                                          | default    | description                        |
|----------------------|-----------------------------------------------|------------|------------------------------------|
| gameStatus           | string[]                                      | `[]`       | The possible game statuses         |
| playerManagerOptions | [PlayerManagerOptions](#PlayerManagerOptions) | *required* | The options for the player manager |


# BullsAndCowsOptions
| parameter    | type                              | default    | description              |
|--------------|-----------------------------------|------------|--------------------------|
| answerLength | number                            | `4`        | The length of the answer |
| players      | [PlayerOptions](#PlayerOptions)[] | *required* | All players' data        |


# FinalCodeOptions
| parameter | type                              | default              | description             |
|-----------|-----------------------------------|----------------------|-------------------------|
| players   | [PlayerOptions](#PlayerOptions)[] | *required*           | All players' data       |
| range     | number                            | `new Range(1, 1000)` | The range of the answer |


# FlipTripOptions
| parameter | type                              | default    | description              |
|-----------|-----------------------------------|------------|--------------------------|
| boardSize | number                            | `3`        | The number of the pieces |
| players   | [PlayerOptions](#PlayerOptions)[] | *required* | All players' data        |


# GomokuOptions
| parameter | type                              | default    | description                 |
|-----------|-----------------------------------|------------|-----------------------------|
| boardSize | number                            | `19`       | The dimensions of the board |
| players   | [PlayerOptions](#PlayerOptions)[] | *required* | All players' data           |


# LightsUpOptions
| parameter | type                              | default    | description                 |
|-----------|-----------------------------------|------------|-----------------------------|
| boardSize | number                            | `5`        | The dimensions of the board |
| players   | [PlayerOptions](#PlayerOptions)[] | *required* | All players' data           |


# TicTacToeOptions
| parameter | type                              | default    | description                 |
|-----------|-----------------------------------|------------|-----------------------------|
| boardSize | number                            | `3`        | The dimensions of the board |
| players   | [PlayerOptions](#PlayerOptions)[] | *required* | All players' data           |


# DjsGameWrapperOptions
| parameter | type                                                                                                                                                           | default    | description                        |
|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|------------------------------------|
| source    | [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) \| [Message](https://discord.js.org/#/docs/main/stable/class/Message) | *required* | The source to instantiate the game |
| time      | number                                                                                                                                                         | `60e3`     | How long to consider a player idle |


# DjsBullsAndCowsOptions
> extends [DjsGameWrapperOptions](#DjsGameWrapperOptions), [BullsAndCowsOptions](#BullsAndCowsOptions)

| parameter    | type                                                     | default                                               | description                 |
|--------------|----------------------------------------------------------|-------------------------------------------------------|-----------------------------|
| hardmode     | boolean                                                  | *none*                                                | Whether to enable hard mode |
| strings      | [BullsAndCowsStrings](./strings.md/#BullsAndCowsStrings) | [strings.json#bullsAndCows](../src/util/strings.json) | The display strings         |


# DjsFinalCodeOptions
> extends [DjsGameWrapperOptions](#DjsGameWrapperOptions), [FinalCodeOptions](#FinalCodeOptions)

| parameter    | type                                               | default                                            | description         |
|--------------|----------------------------------------------------|----------------------------------------------------|---------------------|
| strings      | [FinalCodeStrings](./strings.md/#FinalCodeStrings) | [strings.json#finalCode](../src/util/strings.json) | The display strings |


# DjsFlipTripOptions
> extends [DjsGameWrapperOptions](#DjsGameWrapperOptions), [FlipTripOptions](#FlipTripOptions)

| parameter    | type                                             | default                                           | description         |
|--------------|--------------------------------------------------|---------------------------------------------------|---------------------|
| strings      | [FlipTripStrings](./strings.md/#FlipTripStrings) | [strings.json#flipTrip](../src/util/strings.json) | The display strings |


# DjsGomokuOptions
> extends [DjsGameWrapperOptions](#DjsGameWrapperOptions), [GomokuOptions](#GomokuOptions)

| parameter    | type                                         | default                                         | description         |
|--------------|----------------------------------------------|-------------------------------------------------|---------------------|
| strings      | [GomokuStrings](./strings.md/#GomokuStrings) | [strings.json#gomoku](../src/util/strings.json) | The display strings |


# DjsLightsUpOptions
> extends [DjsGameWrapperOptions](#DjsGameWrapperOptions), [LightsUpOptions](#LightsUpOptions)

| parameter    | type                                             | default                                           | description         |
|--------------|--------------------------------------------------|---------------------------------------------------|---------------------|
| strings      | [LightsUpStrings](./strings.md/#LightsUpStrings) | [strings.json#lightsUp](../src/util/strings.json) | The display strings |



# DjsTicTacToeOptions
> extends [DjsGameWrapperOptions](#DjsGameWrapperOptions), [TicTacToeOptions](#TicTacToeOptions)

| parameter    | type                                               | default                                            | description         |
|--------------|----------------------------------------------------|----------------------------------------------------|---------------------|
| strings      | [TicTacToeStrings](./strings.md/#TicTacToeStrings) | [strings.json#ticTacToe](../src/util/strings.json) | The display strings |
