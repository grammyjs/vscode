> 🚧 Work in progress

# VS code for grammy


This is a extension for Visual studio code editor for extended editor support for [grammy](https://grammy.dev/).

## Features

### Snippets

The extension features some of the most used code snippets for the grammy library to save users time and effort in developing telegram bots.


### Bot Updates Explorer

We all need to go and check for the full update json tree sometimes, right!!! `Typescript` users have types but still we sometimes need to have a look on what we are working with.

The extension features `a real-time` updates explorer in the sidebar and it will show all the updates that your bot will receive.


<div align="center">
    <img src="media/updates-2.png" alt="Updates Explorer">
</div>

### Filter Query Explorer

One of the many cool features of `grammy` is it's [Filter Queries](https://grammy.dev/guide/filter-queries.html) and there are lots of them (like 800+ of em) and you may want to know a bit more about what exactly do they filter and how to access them.

And the the explorer does exactly that you get a complete list of all the `Filter Queries` with their description right in your editor.


<div align="center">
    <img src="media/filter-query.png" alt="Filter Query">
</div>


## Contributing 

Bug reports and pull requests are welcome and if you wish to have some features you can go to discussions.

### Commit rules 

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).


## Development

1. Fork this repository to your own Github account and then clone it your local device.

```sh
git clone https://github.com/grammyjs/vscode.git
```
2. Install the dependencies using [yarn](https://yarnpkg.com/).

```sh
yarn install
```

3. To run and debug the code press `F5` or the default key in your VS code  to start debugging and launch the specified tasks.