# FURMUR

![hanabi](https://github.com/TNTKien/fumi/assets/95180188/83b17607-802b-49a3-83a4-fdbf8afe85ea)

a simple discord app (bot) using cloudflare workers for hosting.
---


## Getting started

- Create a [Discord app](https://discord.com/developers/applications).
- Create a [Cloudflare Worker](https://dash.cloudflare.com/).


## Running locally

Clone this repo and  install dependencies:

```
git clone https://github.com/TNTKien/fumi.git
cd fumi
npm install
```

> ⚙️ The dependencies in this project require at least v18 of [Node.js](https://nodejs.org/en/)

### Local configuration

- Rename `example.dev.vars` to `.dev.vars` and each variables.
- Rename `example.wrangler.toml` to `wrangler.toml` and set variables.

### Register commands

```
$ npm run register
```

### Run app

```
$ npm start
```

### Setting up ngrok

When a user types a slash command, Discord will send an HTTP request to a given endpoint. During local development this can be a little challenging, so we're going to use a tool called `ngrok` to create an HTTP tunnel.

```
$ npm run ngrok
```

This is going to bounce requests off of an external endpoint, and forward them to your machine. Copy the HTTPS link provided by the tool. Now head back to the Discord Developer Dashboard, and update the "Interactions Endpoint URL" for your bot:

![image](https://github.com/TNTKien/fumi/assets/95180188/374074fe-0456-4163-b5af-e73794620bfc)

This is the process we'll use for local testing and development. When you've published your bot to Cloudflare, you will _want to update this field to use your Cloudflare Worker URL._
![image](https://github.com/TNTKien/fumi/assets/95180188/1bb26b04-b726-4f36-8f4d-8f754e3d773f)

## Deployment
- It will be deployed automatically when you push to the `main` branch.
> ⚠️ Make sure to set up Repository Secrets before deploying. See how to find your API token and Account ID [here](https://developers.cloudflare.com/workers/wrangler/ci-cd/).

```yaml
release:
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  needs: [test, lint]
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - run: npm install
    - run: npm run publish
      env:
        CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```
- Deploy manually:

```
  wrangler publish
```

### Storing secrets

The credentials in `.dev.vars` are only applied locally. The production service needs access to credentials from your app:

```
$ wrangler secret put DISCORD_TOKEN
$ wrangler secret put DISCORD_PUBLIC_KEY
$ wrangler secret put DISCORD_APPLICATION_ID
```

