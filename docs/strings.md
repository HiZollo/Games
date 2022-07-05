This is the documentation for all display strings in games implemented with discord.js.


# Table of Contents
- [Main Strings](#Main-Strings)
  - [GameStrings](#GameStrings)
  - [BullsAndCowsStrings](#BullsAndCowsStrings)
  - [FinalCodeStrings](#FinalCodeStrings)
  - [FlipTripStrings](#FlipTripStrings)
  - [GomokuStrings](#GomokuStrings)
  - [LightsUpStrings](#LightsUpStrings)
  - [TicTacToeStrings](#TicTacToeStrings)
  - [TofeStrings](#TofeStrings)
- [Controller Strings](#Controller-Strings)
  - [ControllerStrings](#ControllerStrings)
  - [LightsUpControllerStrings](#LightsUpControllerStrings)
  - [TofeControllerStrings](#TofeControllerStrings)
- [End Message Strings](#End-Message-Strings)
  - [EndMessageStrings](#EndMessageStrings)
  - [FlipTripEndMessageStrings](#FlipTripEndMessageStrings)
  - [GomokuEndMessageStrings](#GomokuEndMessageStrings)
  - [LightsUpEndMessageStrings](#LightsUpEndMessageStrings)
  - [TicTacToeEndMessageStrings](#TicTacToeEndMessageStrings)
  - [TofeEndMessageStrings](#TofeEndMessageStrings)
- [Previous Strings](#Previous-Strings)
  - [FinalCodePreviousStrings](#FinalCodePreviousStrings)
  - [GomokuPreviousStrings](#GomokuPreviousStrings)
  - [TicTacToePreviousStrings](#TicTacToePreviousStrings)

# Main Strings
## GameStrings
| parameter   | type                                    | description                                         |
|-------------|-----------------------------------------|-----------------------------------------------------|
| controller  | [ControllerStrings](#ControllerStrings) | The controller buttons' labels                      |
| endMessages | [EndMessageStrings](#EndMessageStrings) | The messages that shows when `conclude()` is called |
| name        | string                                  | The name of the game                                |

## BullsAndCowsStrings
> extends [GameStrings](#GameStrings)

| parameter | type   | description                                        |
|-----------|--------|----------------------------------------------------|
| initial   | string | The initial message                                |
| query     | string | The message that shows when a player makes a query |

## FinalCodeStrings
> extends [GameStrings](#GameStrings)

| parameter | type                                                  | description                               |
|-----------|-------------------------------------------------------|-------------------------------------------|
| interval  | string                                                | The message about the current interval    |
| nowPlayer | string                                                | The message that shows the current player |
| previous  | [FinalCodePreviousStrings](#FinalCodePreviousStrings) | The message about the previous query      |

## FlipTripStrings
> extends [GameStrings](#GameStrings)

| parameter   | type                                                    | description                                         |
|-------------|---------------------------------------------------------|-----------------------------------------------------|
| endMessages | [FlipTripEndMessageStrings](#FlipTripEndMessageStrings) | The messages that shows when `conclude()` is called |
| numbers     | string[]                                                | The indicators for the index of pieces              |
| pieces      | string[] (with length of 2)                             | The upward piece and downward piece                 |

## GomokuStrings
> extends [GameStrings](#GameStrings)

| parameter   | type                                                | description                                          |
|-------------|-----------------------------------------------------|------------------------------------------------------|
| columns     | string[]                                            | The indicators for the row index                     |
| corner      | string                                              | The symbol of the top left corner                    |
| endMessages | [GomokuEndMessageStrings](#GomokuEndMessageStrings) | The messages that shows when `conclude()` is called  |
| grids       | string                                              | The symbol of empty grids                            |
| nowPlayer   | string                                              | The message that shows the current player and symbol |
| rows        | string[]                                            | The indicators for the row index                     |
| pieces      | string[] (with length of 2)                         | The upward side and downward side                    |
| previous    | [GomokuPreviousStrings](#GomokuPreviousStrings)     | The message about the previous step                  |

# LightsUpStrings
> extends [GameStrings](#GameStrings)

| parameter     | type                                                    | description                                          |
|---------------|---------------------------------------------------------|------------------------------------------------------|
| answerSymbols | string[] (with length of 2)                             | The symbol represents "not to flip" or "to flip"     |
| controller    | [LightsUpControllerStrings](#LightsUpControllerStrings) | The controller buttons' labels                       |
| currentAnswer | string                                                  | The symbol of the top left corner                    |
| endMessages   | [LightsUpEndMessageStrings](#LightsUpEndMessageStrings) | The messages that shows when `conclude()` is called  |

# TicTacToeStrings
> extends [GameStrings](#GameStrings)

| parameter   | type                                                      | description                                          |
|-------------|-----------------------------------------------------------|------------------------------------------------------|
| endMessages | [TicTacToeEndMessageStrings](#TicTacToeEndMessageStrings) | The messages that shows when `conclude()` is called  |
| labels      | string[][]                                                | The labels of the board's buttons                    |
| nowPlayer   | string                                                    | The message that shows the current player and symbol |
| previous    | [TicTacToePreviousStrings](#TicTacToePreviousStrings)     | The message about the previous step                  |

# TofeStrings
> extends [GameStrings](#GameStrings)

| parameter   | type                                            | description                                         |
|-------------|-------------------------------------------------|-----------------------------------------------------|
| controller  | [TofeControllerStrings](#TofeControllerStrings) | The controller buttons' labels                      |
| endMessages | [TofeEndMessageStrings](#TofeEndMessageStrings) | The messages that shows when `conclude()` is called |
| score       | string                                          | The score message of the game                       |


# Controller Strings
## ControllerStrings
| parameter | type   | description                   |
|-----------|--------|-------------------------------|
| stop      | string | The label on the stop buttton |

## LightsUpControllerStrings
> extends [ControllerStrings](#ControllerStrings)

| parameter | type   | description                          |
|-----------|--------|--------------------------------------|
| answer    | string | The label on the show answer buttton |

## TofeControllerStrings
> extends [ControllerStrings](#ControllerStrings)

| parameter | type   | description                          |
|-----------|--------|--------------------------------------|
| up        | string | The label on the move up buttton     |
| down      | string | The label on the move down buttton   |
| left      | string | The label on the move left buttton   |
| right     | string | The label on the move right buttton  |


# End Message Strings
## EndMessageStrings
| parameter   | type                                | description                                                                      |
|-------------|-------------------------------------|----------------------------------------------------------------------------------|
| deleted     | string                              | The strings that shows when the game ends because of the main message is deleted |
| gameStats   | { header: string, message: string } | The statistics about the game that shows in the conclusion embed                 |
| idle        | string                              | The strings that shows when the game ends because of idleness                    |
| playerStats | { message: string }                 | The statistics about the players that shows in the conclusion embed              |
| stopped     | string                              | The strings that shows when the game ends because the players wants to stop it   |
| win         | string                              | The strings that shows when a player wins                                        |

## FlipTripEndMessageStrings
> extends [EndMessageStrings](#EndMessageStrings)

| parameter | type   | description                                |
|-----------|--------|--------------------------------------------|
| lose      | string | The strings that shows when a player loses |

## GomokuEndMessageStrings
> extends [EndMessageStrings](#EndMessageStrings)

| parameter | type   | description                                           |
|-----------|--------|-------------------------------------------------------|
| draw      | string | The strings that shows when the game ends with a draw |

## LightsUpEndMessageStrings
> extends [EndMessageStrings](#EndMessageStrings)

| parameter     | type   | description                                                                    |
|---------------|--------|--------------------------------------------------------------------------------|
| jackpot       | string | The strings that shows when the board are all lighted up in the first hand     |
| unansweredWin | string | The strings that shows when a player wins the game without checking the answer |

## TicTacToeEndMessageStrings
> extends [EndMessageStrings](#EndMessageStrings)

| parameter | type   | description                                           |
|-----------|--------|-------------------------------------------------------|
| draw      | string | The strings that shows when the game ends with a draw |

## TofeEndMessageStrings
> extends [EndMessageStrings](#EndMessageStrings)

| parameter | type   | description                                |
|-----------|--------|--------------------------------------------|
| lose      | string | The strings that shows when a player loses |


# Previous Strings
## FinalCodePreviousStrings
| parameter | type   | description                                                           |
|-----------|--------|-----------------------------------------------------------------------|
| idle      | string | The strings that shows if the previous player runs out of their time  |
| left      | string | The strings that shows if the previous player has left the game       |
| tooLarge  | string | The strings that shows if the previous query is too large             |
| tooSmall  | string | The strings that shows if the previous query is too small             |

## GomokuPreviousStrings
| parameter | type   | description                                                           |
|-----------|--------|-----------------------------------------------------------------------|
| idle      | string | The strings that shows if the previous player runs out of their time  |
| left      | string | The strings that shows if the previous player has left the game       |
| move      | string | The strings that shows if the previous successfully placed a piece    |

## TicTacToePreviousStrings
| parameter | type   | description                                                           |
|-----------|--------|-----------------------------------------------------------------------|
| idle      | string | The strings that shows if the previous player runs out of their time  |
| left      | string | The strings that shows if the previous player has left the game       |