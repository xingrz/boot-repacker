[Boot Repacker by MoKee](https://boot.mokeedev.com/) [![Auto deploy](https://github.com/MoKee/boot-repacker/actions/workflows/deploy.yml/badge.svg)](https://github.com/MoKee/boot-repacker/actions/workflows/deploy.yml)
==========

Unpacking and repacking Android bootable images in your browser.

## Develop

```
npm install
npm run serve
```

## Build

```
npm run build
```

## Contribute

As part of the MoKee Open Source Project, this repository accepts commits
from our [Gerrit Code Review](https://mokeedev.review/) platform.

```sh
# setup
scp -p -P 29418 YOURNAME@mokeedev.review:hooks/commit-msg $(git rev-parse --git-dir)/hooks/
git remote add review ssh://YOURNAME@mokeedev.review:29418/MoKee/boot-repacker

# submit
git push review HEAD:refs/for/master
```

## Libraries used

* [Vue.js](https://vuejs.org/)
* [Vuetify](https://vuetifyjs.com/)

## License

Apache License 2.0
