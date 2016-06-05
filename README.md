Smile Shot
============

Smile Shot takes a picture from your camera and analyze the camera image.
if the image has some smiles ( :D ) you can get the smiles from slack.

In my case, I would like to see my daughter face when she smiles.

![haruka](https://cloud.githubusercontent.com/assets/555645/15806272/d51bd222-2b7a-11e6-9e12-4099f990eaee.jpeg)

# how to use

- install

```
$ git clone https://github.com/yosuke-furukawa/smile_shot
$ npm install
```

- write config files

```javascript
// conf/key.json
// download from google cloud
{
  "type": "foobarbuz",
  "project_id": "foo",
  "private_key_id": "keyid",
  "private_key": "key",
  ...
}
```

```javascript
// conf/gcloud.json
{
  "projectId": "xxxxxxxxxxx",
  "keyFilename": "./conf/key.json"
}
```

```javascript
// conf/slack.json
{
  "api_token": "xoxp-xxxxxxxxxxxxxxxxxxxxxxxx",
  "channels": ["general"]
}
```
