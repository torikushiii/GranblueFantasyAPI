# Player API

**BASE URL:** `https://api.ennead.cc/guraburu/`

## Get Player Data
Display a player's data. This includes their summon levels, starred character, and crew.

> [https://api.ennead.cc/guraburu/player/24064772?id=true](https://api.ennead.cc/guraburu/player/24064772?id=true)

> Returns : `Player Object`
<details>
<summary>View Payload Example</summary>

```json
{
  "id": 24064772,
  "nickname": "Henz",
  "rank": 308,
  "isRestricted": false,
  "crew": {
    "id": "981625",
    "name": "TwinHeaven",
    "url": "https://game.granbluefantasy.jp/#981625"
  },
  "star": {
    "name": "Threo",
    "level": 100,
    "isRinged": false,
    "comment": null
  },
  "summons": {
    "misc": [
      {
        "name": "Huanglong",
        "level": 100
      },
      {
        "name": "Qilin",
        "level": 100
      }
    ],
    "fire": [
      {
        "name": "Agni",
        "level": 200
      },
      {
        "name": "Colossus Omega",
        "level": 200
      }
    ],
    "water": [
      {
        "name": "Varuna",
        "level": 200
      },
      {
        "name": "Europa",
        "level": 100
      }
    ],
    "earth": [
      {
        "name": "Titan",
        "level": 200
      },
      {
        "name": "Gorilla",
        "level": 150
      }
    ],
    "wind": [
      {
        "name": "Tiamat Omega",
        "level": 200
      },
      {
        "name": "Freyr",
        "level": 1
      }
    ],
    "light": [
      {
        "name": "Lucifer",
        "level": 200
      },
      {
        "name": "Zeus",
        "level": 200
      }
    ],
    "dark": [
      {
        "name": "Hades",
        "level": 200
      },
      {
        "name": "Bahamut",
        "level": 250
      }
    ]
  }
}
```
</details>