
# Sonora

Sonora is an AI-powered music idea generator and sample library designed to eliminate writer's block for music producers. With Sonora, users can instantly generate musical ideas, known as sets, in their preferred genre. These sets can be downloaded as individual sounds for use in personal projects or saved for future editing and exploration.

The primary goal of Sonora is to address the common issue of writer's block among music producers. This creative barrier often hinders producers from exploring new genres and experimenting with fresh ideas. As a music producer myself, I have personally faced these challenges, which inspired the development of Sonora.



## Features

- Genre selection prompt on the landing page.
- Integration with OpenAI's API to determine key instrumentation for the chosen genre.
- Pre-defined collection of genres for quick creation.
- Dynamic set generation based on genre selection.
- Global audio controls, including the ability to mute and unmute individual sounds for performance.
- A new set of sounds can be randomly generated with the shuffle button
- Like functionality to save sounds to the user's collection.
- A user's liked sounds can be auditioned on the sounds page.
- Download option for individual samples.
- Set saving feature for easy access to previously generated sets.
- Saved sets can be renamed as required.



## Walkthrough

#### Demo

Demo video here - https://www.loom.com/share/ab2430ac331a476b9fa356662969f9a8

#### Home Page

- Type a genre of choice into input and press play button to generate a set using the AI functionality.
- Alternative choose from one of the predefined styled below to generate a set using Sonora's custom database.

#### Set Page(s)

- Audio will be played automatically. This can staggered, particuarly when generating an AI set. If audio is out of sync, click the skip-back button to reset audio playback.
- The shuffle button will generate a new set of sounds.
- The save icon can be used to save a set to the user's profile (predefined styles only currently)
- The like icon can be used to save a sound to the user's profile (predefined styles only currently)

#### User Sets Page

- Navigate to this page using the person icon.
- Here users saved sets can be loaded, renamed, or deleted

#### User Sounds Page

- Navigate to this page using the like icon.
- Here users saved sounds can be auditions, downloaded, or deleted

## Tech Stack

**Client:** HTML, CSS, SASS, JavaScript, React, Web APIs, LLMs

**Server:** Node, Express, Knex, MySQL


## Installation

Clone the project

```bash
  git clone git@github.com:j-sinks/sonora.git
  git clone git@github.com:j-sinks/sonora-api.git
```

Go to the project directory

```bash
  cd sonora
  cd sonora-api
```

Install dependencies

```bash
  npm install
```

Run migrations & seed database (server only)

```bash
  npm run db:migrate
  npm run db:seed
```

Rollback migration (server only)

```bash
  npm run db:rollback
```

Start the app/server

```bash
  npm start
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file (An .env.example file is also provided in each repo)

#### Front-End

`REACT_APP_API_URL`

`REACT_APP_OPENAI_API_KEY`

`REACT_APP_OPENAI_API_URL_A`

`REACT_APP_OPENAI_API_URL_B`

`REACT_APP_FS_API_KEY`

`REACT_APP_FS_API_URL`

`REACT_APP_USER_ID`

#### Back-End

`PORT`

`DB_HOST`

`DB_LOCAL_NAME`

`DB_LOCAL_USER`

`DB_LOCAL_PASSWORD`

## API Reference

#### Get all user details

```http
  GET /api/profile
```

```
[
    {
        id: "1"
        username: "john-doe",
        email: "johndoe@gmail.com"
    },

    {
        id: "2"
        username: "jane-doe",
        email: "janedoe@gmail.com"
    },
]
```

#### Add new user, returns new user details

```http
  POST /api/profile
```

```
[
    {
        name: "John Doe",
        username: "j-doe",
        email: "johndoe@gmail.com",
    },
]
```

#### GET a user

```http
  POST /api/profile/:userId
```

```
[
    {
        username: "j-doe",
        email: "johndoe@gmail.com",
        "password": "1234"
    },
]
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `integer` | **Required**. Id of user to fetch |

#### DELETE a user, returns nothing

```http
  POST /api/profile/:userId
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `integer` | **Required**. Id of user to fetch |

#### GET a user's sets

```http
  POST /api/profile/:userId/sets
```

```
[
     {
        "id": 1,
        "name": "Project One",
        "genre": "raw_deep",
        "updated_at": "2023-06-26T11:19:24.000Z"
    },
    {
        "id": 3,
        "name": "Project Three",
        "genre": "dub_techno",
        "updated_at": "2023-06-26T11:19:24.000Z"
    },
]
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `integer` | **Required**. Id of user to fetch |

#### POST a new set

```http
  POST /api/profile/:userId/sets
```

```
[
    {
    "user_id": "1",
    "name": "Jazzy 4",
    "genre": "Jazz House",
    "sounds": ["41", "61", "51", "71"]
    }
]
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `integer` | **Required**. Id of user to fetch |

#### GET a set, returns sounds in set

```http
  POST /api/profile/:userId/sets/:setId
```

```
[
    {
    "user_id": "1",
    "name": "Jazzy 4",
    "genre": "Jazz House",
    "sounds": ["41", "61", "51", "71"]
    }
]
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `integer` | **Required**. Id of user to fetch
| `setId`      | `integer` | **Required**. Id of set to fetch


#### DELETE a set, returns nothing

```http
  DELETE /api/profile/:userId/sets/:setId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `integer` | **Required**. Id of user to fetch
| `setId`      | `integer` | **Required**. Id of set to fetch

#### GET a user's liked sounds

```http
  GET /api/profile/:userId/sounds
```

```
[
    {
        "id": 5,
        "name": "US_RD_121_Bass_barcelona_Am",
        "type": "bass",
        "genre": "house",
        "subgenre": "raw_deep",
        "key_scale": "Fm",
        "rel_key_scale": "G%23",
        "bpm": 121,
        "length": 4,
        "url": "http://localhost:8080/audio/US_RD_121_Bass_barcelona_Am.wav"
    },
    {
        "id": 88,
        "name": "US_DDT_Drm_114_Blues_full",
        "type": "drums",
        "genre": "techno",
        "subgenre": "dub_techno",
        "key_scale": "",
        "rel_key_scale": "",
        "bpm": 114,
        "length": 4,
        "url": "http://localhost:8080/audio/US_DDT_Drm_114_Blues_full.wav"
    },
]
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `integer` | **Required**. Id of user to fetch

#### POST a liked sound

```http
  POST /api/profile/:userId/sounds
```

```
[
    {
    "sound_id": "20"
    }
]
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `integer` | **Required**. Id of user to fetch

#### DELETE a liked sound, returns nothing

```http
  DELETE /api/profile/:userId/sounds/:soundId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userId`      | `integer` | **Required**. Id of user to fetch
| `soundId`      | `integer` | **Required**. Id of sound to fetch

#### GET sounds

```http
  GET /api/sounds
```

```
[
    {
        "id": 1,
        "name": "US_RD_121_Bass_3AM_Fm",
        "type": "bass",
        "genre": "house",
        "subgenre": "raw_deep",
        "key_scale": "Fm",
        "rel_key_scale": "A",
        "bpm": 121,
        "length": 4,
        "url": "http://localhost:8080/audio/US_RD_121_Bass_3AM_Fm.wav"
    },
    {
        "id": 2,
        "name": "US_RD_121_Bass_90s_Dm",
        "type": "bass",
        "genre": "house",
        "subgenre": "raw_deep",
        "key_scale": "Dm",
        "rel_key_scale": "F",
        "bpm": 121,
        "length": 4,
        "url": "http://localhost:8080/audio/US_RD_121_Bass_90s_Dm.wav"
    },
]
```

#### GET a sound

```http
  GET /api/sounds/:soundId
```

```
[
    {
        "id": 1,
        "name": "US_RD_121_Bass_3AM_Fm",
        "type": "bass",
        "genre": "house",
        "subgenre": "raw_deep",
        "key_scale": "Fm",
        "rel_key_scale": "A",
        "bpm": 121,
        "length": 4,
        "url": "http://localhost:8080/audio/US_RD_121_Bass_3AM_Fm.wav"
    }
]
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `soundId`      | `integer` | **Required**. Id of sound to fetch

## Roadmap

#### Next steps

- Bug fixes
- Batch sample download for set
- Restructure components to optimise renders
- Seed more custom database sounds
- Integrate Freesound samples into the database
- Functionality to randomise individual sounds in set
- Functionality to add/remove sounds in set
- Playhead animation
- Random name generator for sets
- Auth

#### Further down the line

- Hosting & deployment
- Add further audio manipulation functionality (i.e. timestretching and mixing controls)




## Authors

- [@joshuasinkinson](https://github.com/j-sinks)