# Summon API

**BASE URL:** `https://api.ennead.cc/guraburu/`

### Get Summon
Get a summon information.

Due to limitations of the API, summon information above level 100 are not available.

> [https://api.ennead.cc/guraburu/summon/2040244000?id=true](https://api.ennead.cc/guraburu/summon/2040244000?id=true)

> GET `summon/:summon`

> GET `summon/2040244000?id=true` You need to pass `?id=true` to get summon by ID

> Returns: `Summon Object`
<details>
<summary>View Payload Example</summary>

```json
{
  "id": 2040244000,
  "name": "The Sun",
  "series": "[Arcarum Series]",
  "maxLevel": 200,
  "rarity": "SS Rare",
  "hp": 1090,
  "atk": 2837,
  "element": "Fire",
  "call": {
    "name": "Coronal Ejection",
    "description": "400% fire DMG to all foes / Fire allies in first and second positions attack twice each turn (Can't be included in other players' combo calls)",
    "readyIn": 5,
    "cooldown": "9"
  },
  "aura": {
    "main": {
      "name": "The Sun's Aura",
      "description": "Boost to fire allies' multiattack rate (Boost rises based on turns passed)"
    },
    "sub": {
      "name": "The Sun's Aura",
      "description": "Amplify fire allies' DMG against wind foes by 7%"
    },
    "transcended": null
  },
  "voiceActor": "Naomi Ohzora"
}
```
</details>