# Coconut GL
A [**three.js**](https://threejs.org) and [**oimo.js**](https://lo-th.github.io/Oimo.js/) sandbox based on Sinan Mutlu's [**vwebpack-simple-starter project**](https://github.com/SinanMtl/webpack-simple-starter)

## Getting Started
First, install the modules that the project needs.
```bash
$ npm install
```

Now, let's start developing.
```bash
$ npm run dev
```

Finally development process done. Let's export for production.
```bash
$ npm run build
```

That's it!. Files are ready to under the `dist/` directory for production.

## What's in this project?

### Directories
There are four main directories in project. This directories like below:
```
build/		# Webpack configurations
config/		# Dev and prod configurations
src/ 		# Project development files
|_ scripts/	# Javascript files
|_ styles/	# Style files (scss)
|_ views/	# HTML templates (pug)
static/		# Static files (Like fonts, images)
```

### Used Frameworks
- Babel.js for ES6 compile
- Sass for CSS
- Pug for HTML template

Also, this project supports hot reload and includes full linting via **eslint**

## License
This project is under the MIT license.
