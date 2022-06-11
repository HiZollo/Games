This is the documentations for all options.


# Table of Contents
- [GameOptions](#GameOptions)
- [PlayerOptions](#PlayerOptions)
- [PlayerManagerOptions](#PlayerManagerOptions)
- [BullsAndCowsOptions](#BullsAndCowsOptions)
- [FinalCodeOptions](#FinalCodeOptions)
- [FlipTripOptions](#FlipTripOptions)
- [GomokuOptions](#GomokuOptions)
- [LightsUpOptions](#LightsUpOptions)
- [TicTacToeOptions](#TicTacToeOptions)
- [DjsBullsAndCowsOptions](#DjsBullsAndCowsOptions)
- [DjsFinalCodeOptions](#DjsFinalCodeOptions)
- [DjsFlipTripOptions](#DjsFlipTripOptions)
- [DjsGomokuOptions](#DjsGomokuOptions)
- [DjsLightsUpOptions](#DjsLightsUpOptions)
- [DjsTicTacToeOptions](#DjsTicTacToeOptions)


# GameOptions
| parameter            | type                                          | default    | description                |
|----------------------|-----------------------------------------------|------------|----------------------------|
| gameStatus           | Array\<string>                                | `[]`       | Extra statuses of the game |
| playerManagerOptions | [PlayerManagerOptions](#PlayerManagerOptions) | *required* | Options for players        |


# PlayerOptions
| parameter | type    | default    | description                 |
|-----------|---------|------------|-----------------------------|
| bot       | boolean | `false`    | Whether the player is a bot |
| id        | \*      | *required* | The id of the player        |
| symbol    | string  | `null`     | The symbol of the player    |
| username  | string  | `"Player"` | The username of the player  |


# PlayerManagerOptions
| parameter        | type                                    | default         | description                                |
|------------------|-----------------------------------------|-----------------|--------------------------------------------|
| firstPlayerIndex | number                                  | `1`             | The index of the first player              |
| players          | Array\<[PlayerOptions](#PlayerOptions)> | *required*      | All players' data                          |
| playerCountRange | Array\<number>                          | `[1, Infinity]` | The range that the player count can be in  |
| requireSymbol    | boolean                                 | `false`         | Whether all players need their own symbols |


# BullsAndCowsOptions
| parameter    | type                                    | default    | description              |
|--------------|-----------------------------------------|------------|--------------------------|
| answerLength | number                                  | `4`        | The length of the answer |
| hardmode     | boolean                                 | `false`    | Options for players      |
| players      | Array\<[PlayerOptions](#PlayerOptions)> | *required* | All players' data        |


# FinalCodeOptions
| parameter | type                                    | default    | description                   |
|-----------|-----------------------------------------|------------|-------------------------------|
| min       | number                                  | `1`        | The lower bound of the answer |
| max       | number                                  | `1000`     | The upper bound of the answer |
| players   | Array\<[PlayerOptions](#PlayerOptions)> | *required* | All players' data             |


# FlipTripOptions
| parameter | type                                    | default    | description              |
|-----------|-----------------------------------------|------------|--------------------------|
| boardSize | number                                  | `3`        | The number of the pieces |
| players   | Array\<[PlayerOptions](#PlayerOptions)> | *required* | All players' data        |


# GomokuOptions
| parameter | type                                    | default    | description                 |
|-----------|-----------------------------------------|------------|-----------------------------|
| boardSize | number                                  | `19`       | The dimensions of the board |
| players   | Array\<[PlayerOptions](#PlayerOptions)> | *required* | All players' data           |


# LightsUpOptions
| parameter | type                                    | default    | description                 |
|-----------|-----------------------------------------|------------|-----------------------------|
| boardSize | number                                  | `5`        | The dimensions of the board |
| players   | Array\<[PlayerOptions](#PlayerOptions)> | *required* | All players' data           |


# TicTacToeOptions
| parameter | type                                    | default    | description                 |
|-----------|-----------------------------------------|------------|-----------------------------|
| boardSize | number                                  | `3`        | The dimensions of the board |
| players   | Array\<[PlayerOptions](#PlayerOptions)> | *required* | All players' data           |


# DjsBullsAndCowsOptions
| parameter    | type                                    | default                         | description                        |
|--------------|-----------------------------------------|---------------------------------|------------------------------------|
| answerLength | number                                  | *none*                          | The length of the answer           |
| hardmode     | boolean                                 | *none*                          | Options for players                |
| players      | Array\<[PlayerOptions](#PlayerOptions)> | *required*                      | All players' data                  |
| strings      | Object                                  | [strings.json](../strings.json) | The display strings                |
| time         | number                                  | `60e3`                          | How long to consider a player idle |


# DjsFinalCodeOptions
| parameter | type                                    | default                              | description                        |
|-----------|-----------------------------------------|--------------------------------------|------------------------------------|
| min       | number                                  | `1`                                  | The lower bound of the answer      |
| max       | number                                  | `1000`                               | The upper bound of the answer      |
| players   | Array\<[PlayerOptions](#PlayerOptions)> | *required*                           | All players' data                  |
| strings   | Object                                  | [strings.json](../util/strings.json) | The display strings                |
| time      | number                                  | `60e3`                               | How long to consider a player idle |


# DjsFlipTripOptions
| parameter | type                                    | default                              | description                        |
|-----------|-----------------------------------------|--------------------------------------|------------------------------------|
| boardSize | number                                  | `3`                                  | The number of the pieces           |
| players   | Array\<[PlayerOptions](#PlayerOptions)> | *required*                           | All players' data                  |
| strings   | Object                                  | [strings.json](../util/strings.json) | The display strings                |
| time      | number                                  | `60e3`                               | How long to consider a player idle |


# DjsGomokuOptions
| parameter | type                                    | default                              | description                        |
|-----------|-----------------------------------------|--------------------------------------|------------------------------------|
| boardSize | number                                  | `9`                                  | The dimensions of the board        |
| players   | Array\<[PlayerOptions](#PlayerOptions)> | *required*                           | All players' data                  |
| strings   | Object                                  | [strings.json](../util/strings.json) | The display strings                |
| time      | number                                  | `60e3`                               | How long to consider a player idle |


# DjsLightsUpOptions
| parameter | type                                    | default                              | description                        |
|-----------|-----------------------------------------|--------------------------------------|------------------------------------|
| boardSize | number                                  | `5`                                  | The dimensions of the board        |
| players   | Array\<[PlayerOptions](#PlayerOptions)> | *required*                           | All players' data                  |
| strings   | Object                                  | [strings.json](../util/strings.json) | The display strings                |
| time      | number                                  | `60e3`                               | How long to consider a player idle |


# DjsTicTacToeOptions
| parameter | type                                    | default                              | description                        |
|-----------|-----------------------------------------|--------------------------------------|------------------------------------|
| boardSize | number                                  | `3`                                  | The dimensions of the board        |
| players   | Array\<[PlayerOptions](#PlayerOptions)> | *required*                           | All players' data                  |
| strings   | Object                                  | [strings.json](../util/strings.json) | The display strings                |
| time      | number                                  | `60e3`                               | How long to consider a player idle |
