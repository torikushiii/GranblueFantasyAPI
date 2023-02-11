# Character API

**BASE URL:** `https://api.ennead.cc/guraburu/`

### Get Character
Get character information.

Due to limitations of the API, characters information above level 80 are not available.

> [https://api.ennead.cc/guraburu/character/3040446000?id=true](https://api.ennead.cc/guraburu/character/3040446000?id=true)

> GET `character/:character` | `character/Orchid` TBA

> GET `character/3040446000?id=true` You need to pass `?id=true` to get character by ID

> Returns: `Character Object`
<details>
<summary>View Payload Example</summary>

```json
{
  "id": 3040446000,
  "name": "Orchid",
  "maxLevel": 80,
  "rarity": "SS Rare",
  "hp": 1968,
  "atk": 6960,
  "element": "Earth",
  "race": "Other",
  "weaponTypes": [
    "Dagger",
    "Melee"
  ],
  "ultimate": [
    {
      "name": "Twilight Bringer",
      "description": "Massive earth DMG to a foe / 1-turn cut to Orchid's skill cooldowns"
    }
  ],
  "abilities": [
    {
      "name": "Here's To You",
      "description": "Earth DMG to a foe / Hit to water ATK and accuracy",
      "cooldown": 7,
      "readyIn": 0,
      "details": [
        {
          "type": "Debuff",
          "detail": "Water ATK is lowered",
          "effect": "180 sec"
        },
        {
          "type": "Debuff",
          "detail": "Attacks and special attacks have a chance to miss",
          "effect": "2 turns"
        }
      ]
    },
    {
      "name": "Hopeful Pledge",
      "description": "Sharp boost to caster's stats (Ends upon taking DMG 3 times)",
      "cooldown": 18,
      "readyIn": 0,
      "details": [
        {
          "type": "Buff",
          "detail": "ATK, triple attack rate, DMG cap, and critical hit rate are boosted / Bonus Earth DMG effect (Can't be removed / Ends upon taking DMG 3 times)",
          "effect": null
        }
      ]
    },
    {
      "name": "Possession",
      "description": "Entwined effect to all foes / Caster dodges all attacks from foes (2 times)",
      "cooldown": 12,
      "readyIn": 0,
      "details": [
        {
          "type": "Buff",
          "detail": "Takes no DMG or debuffs while in effect for a set period",
          "effect": null
        },
        {
          "type": "Debuff",
          "detail": "Can't use charge-diamond attacks / Can't deal normal attacks",
          "effect": "1 turn"
        }
      ]
    }
  ],
  "passives": [
    {
      "name": "Pure of Heart",
      "description": "Low HP / Bonus Earth DMG effect to earth allies"
    },
    {
      "name": "Garland of Gratitude",
      "description": "While Hopeful Pledge is in effect: Debuff immunity / Buffs can't be removed"
    }
  ],
  "voiceActor": "Minori Chihara"
}
```
</details>