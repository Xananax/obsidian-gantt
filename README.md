# Gantt Chart

A plugin that adds some project management utilities.

## How to use

Make a code block and use `gantt` as the style.
In the block, write your Dataview query

```sh
\```gantt
#project/tasks
\```
```

## Notes

Plugins that were considered:

- [obsidian-react-components: Write and use React (Jsx) components in your Obsidian notes.](https://github.com/elias-sundqvist/obsidian-react-components)
- [obsidian-custom-js: An Obsidian plugin to allow users to reuse code blocks across all devices and OSes](https://github.com/saml-dev/obsidian-custom-js)
- [obsidian-requirejs: Write reusable JavaScript functions using Asynchronous Module Definitions](https://github.com/cstrahan/obsidian-requirejs/tree/main)

Tips & Tricks found at:

- [Obsidian Hub](https://publish.obsidian.md/hub/00+-+Start+here)
- [Obsidian Plugin Dev Docs](https://marcus.se.net/obsidian-plugin-docs)


## How to Dev

- Clone your repo to a local development folder. For convenience, you can place this folder in your `.obsidian/plugins/your-plugin-name` folder in your vault.
- Install NodeJS, then run `npm i` in the command line under your repo folder.
- Run `npm run dev` to compile your plugin from `main.ts` to `main.js`.
- Make changes to `main.ts` (or create new `.ts` files). Those changes should be automatically compiled into `main.js`.
- Reload Obsidian to load the new version of your plugin.
- Enable plugin in settings window.
- For updates to the Obsidian API run `npm update` in the command line under your repo folder.

## API Documentation

See https://github.com/obsidianmd/obsidian-api
