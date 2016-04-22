#!/bin/sh
my_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $my_dir
git checkout master
git branch -D gh-pages
git checkout -B gh-pages
npm install
bower install
shopt -s dotglob && git rm -rf --ignore-unmatch *
git checkout master www/
mv www/* ./
rm -rf www
git checkout master scss
git add -A
git commit -m "Deploy to gh-pages"
git push origin gh-pages
git checkout master
