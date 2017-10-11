// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase : {
    apiKey: "AIzaSyCVm73q0olgVZN-CUDYnyBKoE8OsGS4QPE",
    authDomain: "trellobase.firebaseapp.com",
    databaseURL: "https://trellobase.firebaseio.com",
    projectId: "trellobase",
    storageBucket: "",
    messagingSenderId: "538807417719"
  }
};
