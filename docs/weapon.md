# Weapon API

**BASE URL:** `https://api.ennead.cc/guraburu/`

### Get Weapon
Get a weapon information.

Due to limitations of the API, summon information above level 100 are not available.

> [https://api.ennead.cc/guraburu/weapon/1040911100?id=true](https://api.ennead.cc/guraburu/weapon/1040911100?id=true)

> GET `weapon/:weapon`

> GET `weapon/1040911100?id=true` You need to pass `?id=true` to get weapon by ID

> Returns: `Weapon Object`
<details>
<summary>View Payload Example</summary>

```json
{
  "id": 1040911100,
  "name": "Katana of Renunciation",
  "series": "[Dark Opus Weapons]",
  "maxLevel": 200,
  "rarity": "SS Rare",
  "hp": 269,
  "atk": 3915,
  "element": "Dark",
  "chargeAttack": {
    "name": "Apocalyptic Pain +",
    "description": "Massive dark DMG to a foe / Oblivion Crest to all allies / Additional effect based on the skill"
  },
  "skills": [
    {
      "name": "Mistfall's Majesty III",
      "description": "Big boost to dark allies' ATK and max HP"
    },
    {
      "name": "Guiding Revelation",
      "description": "A symbol of apocalyptic corruption. Empowered by a chosen pendulum."
    },
    {
      "name": "Guiding Gospel",
      "description": "A symbol of evolution's holy outcome. Empowered by a chosen pendulum or chain."
    }
  ]
}
```
</details>