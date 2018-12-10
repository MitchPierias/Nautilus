# Nautilus
> Simple EOS Environment Manager

## Features
1. Environment
Setup environment to manage development, staging and production across local and remote networks.

2. Key Management
Track public keys and their associate

3. Account Managment
Create and manage accounts across

## Similar Projects
Other great EOS management libraries:
* [Tokenika's eosfactory](https://github.com/tokenika/eosfactory)

## Contribution
Despite my lack of unit tests and a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using jslint.

## Usage

### Install Dependencies
```
npm install
```

### Building from Source
Nautilus uses [electron-builder](https://www.electron.build/) to compile executables for Mac, Windows and Linux. Configuration can be found under the `build` tree in the root `package.json`. Once compiled, the executables are located in the `./dist` folder within the root directory.
```
npm run-script dist
```

### Running Locally, for Development Purposes
> You will need to open two command line windows. One for webpack with React and the other for Electron.

First let's start React so Electron has a build source to display.
```
npm start
```

Once webpack has finished compiling our React application, we can start electron.
```
npm run-script electron
```

### Environment Variables
Please use the `.env` file located in the root directory of this project to configure environment variables.

## License
Copyright (c) 2018 Mitch Pierias
Licensed under the MIT license.