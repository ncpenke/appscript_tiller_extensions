# appscript_tiller_money_utils

## Introduction

This contains my custom utility methods for Tiller Money. It is intended to be imported as a package into an AppScript project.

## AppsScript Library Setup

1. Run `npm install` to install all the dependencies.
2. Create the AppScript project by running: `npx clasp create`. The project should be called "TillerExtensions".
3. Push the sources by running:`npx clasp push`.

## Spreadsheet Setup

1. Add previously created AppScript library to your spreadsheet Apps Script project.
2. In the `onOpen` method call the `TillerExtensions.init()` function passing in the required arguments.
3. Define the necessary callback functions for each of the menu items.

## References

- [Google TypeScript Guide for developing Apps Script](https://developers.google.com/apps-script/guides/typescript)
