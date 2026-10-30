This is the documentation for all options.


# Table of Contents
- [PlayerOptions](#PlayerOptions)
- [PlayerManagerOptions](#PlayerManagerOptions)
- [GameOptions](#GameOptions)
- [BigTwoOptions](#BigTwoOptions)
- [BullsAndCowsOptions](#BullsAndCowsOptions)
- [FinalCodeOptions](#FinalCodeOptions)
- [FlipTripOptions](#FlipTripOptions)
- [GomokuOptions](#GomokuOptions)
- [LightsUpOptions](#LightsUpOptions)
- [TicTacToeOptions](#TicTacToeOptions)
- [TofeOptions](#TofeOptions)


# PlayerOptions
| parameter | type             | default    | description                 |
|-----------|------------------|------------|-----------------------------|
| bot       | boolean          | `false`    | Whether the player is a bot |
| id        | number \| string | *required* | The id of the player        |
| symbol    | string \| null   | `null`     | The symbol of the player    |
| username  | string           | `"Player"` | The username of the player  |


# PlayerManagerOptions
| parameter        | type                                | default                  | description                                |
|------------------|-------------------------------------|--------------------------|--------------------------------------------|
| firstPlayerIndex | number                              | `1`                      | The index of the first player              |
| players          | [PlayerOptions](#PlayerOptions)[]   | *required*               | All players' data                          |
| playerCountRange | [Range](./classes/struct.md/#Range) | `new Range(1, Infinity)` | To restrict the number of players          |
| requireSymbol    | boolean                             | `false`                  | Whether all players need their own symbols |


# GameOptions
| parameter            | type                                          | default    | description                        |
|----------------------|-----------------------------------------------|------------|------------------------------------|
| gameStatus           | string[]                                      | `[]`       | The possible game statuses         |
| playerManagerOptions | [PlayerManagerOptions](#PlayerManagerOptions) | *required* | The options for the player manager |

# StatusManagerOptions
| parameter | type     | default     | description                |
|-----------|----------|-------------|----------------------------|
| initial   | string   | `status[0]` | The initial status         |
| status    | string[] | `[]`        | The possible game statuses |


# BigTwoOptions 
| parameter    | type                              | default    | description       |
|--------------|-----------------------------------|------------|-------------------|
| players      | [PlayerOptions](#PlayerOptions)[] | *required* | All players' data |


# BullsAndCowsOptions
| parameter    | type                              | default    | description              |
|--------------|-----------------------------------|------------|--------------------------|
| answerLength | number                            | `4`        | The length of the answer |
| players      | [PlayerOptions](#PlayerOptions)[] | *required* | All players' data        |


# FinalCodeOptions
| parameter | type                                | default              | description             |
|-----------|-------------------------------------|----------------------|-------------------------|
| players   | [PlayerOptions](#PlayerOptions)[]   | *required*           | All players' data       |
| range     | [Range](./classes/struct.md/#Range) | `new Range(1, 1000)` | The range of the answer |


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


# TofeOptions
| parameter | type                              | default    | description                 |
|-----------|-----------------------------------|------------|-----------------------------|
| hardMode  | boolean                           | `false`    | Whether to enable hard mode |
| players   | [PlayerOptions](#PlayerOptions)[] | *required* | All players' data           |
