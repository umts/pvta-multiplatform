#!/bin/bash
my_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $my_dir
echo $my_dir
if [[ ! "$(git status -sb | head -1 )" == "## master"* ]]
then
  echo "Not currently on master branch"
  exit 1
fi
#Are there uncommited changes to the branch?
if [[ -n "$(git status -s)" ]]
then
  echo "There are un-commited changes to master"
  exit 1
fi
git branch -D gh-pages
git checkout -B gh-pages
npm install
rm .bowerrc
touch .bowerrc
echo {\"directory\": \"bower_components\"} >> .bowerrc
bower install
shopt -s dotglob && git rm -rf --ignore-unmatch *
git checkout master www/
mv www/* ./
rm -rf www
git checkout master scss
git add -A
git commit -m "Deploy to gh-pages"
git push -f origin gh-pages
git checkout master
