# Events API

**BASE URL:** `https://api.ennead.cc/guraburu/`

## Get Current Event List
Displays a list of current events.
> [https://api.ennead.cc/guraburu/events](https://api.ennead.cc/guraburu/events)

> Returns : `Event Object`
<details>
<summary>View Payload Example</summary>

```json
{
  "events": [
    {
      "name": "Special Collab Pass",
      "start": 1675238400000,
      "end": 1676620740000
    },
    {
      "name": "Proving Grounds",
      "start": 1675756800000,
      "end": 1676275140000
    },
    {
      "name": "Persona 5: Thievery in Blue",
      "start": 1675929600000,
      "end": 1676620740000
    },
    {
      "name": "Rise of the Beasts",
      "start": 1676109600000,
      "end": 1676714340000
    }
  ],
  "campaigns": [
    {
      "name": "Special Collab Fever Event campaign",
      "start": 1675195200000,
      "end": 1676577540000
    },
    {
      "name": "Half AP etc.",
      "start": 1675238400000,
      "end": 1676620740000
    },
    {
      "name": "Pendant Boosts",
      "start": 1675238400000,
      "end": 1676620740000
    }
  ]
}
```
</details>