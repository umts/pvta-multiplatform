#!/bin/bash

function doEverythingElse() {
  commit="Deploying master to gh-pages by $USER"
  echo If you would like to include a commit message, add one and press RETURN.
  read personalized
  commit = "${commit}: $personalized"
  git commit -m "$commit"
  echo Done committing.

  echo Ready to push? Caution: your changes will be live on the internet! [y/n]
  read confirm
  if [ "$confirm" = "y" ]; then
    git push origin gh-pages
    echo Done pushing.
  else
    echo Oh well. Run this script again later when ready.
  fi
  cd ../../
  echo --------------------
  echo Deleting the temporary repo copy.
  rm -rf multiplatform-deploy-tmp
  echo Done deleting.
  cd pvta-multiplatform
}

cd $1
mkdir multiplatform-deploy-tmp
echo Downloading a copy of pvta-multiplatform to be safe
cd multiplatform-deploy-tmp
echo Do you use https or ssh [1 or 2]?
read cloneMethod
if [ "$cloneMethod" = "1" ]; then
  git clone https://github.com/umts/pvta-multiplatform.git
else
  git clone git@github.com:umts/pvta-multiplatform.git
fi
echo Done downloading!
cd pvta-multiplatform
echo Preparing to deploy master to gh-pages.
git checkout gh-pages
git pull origin master
mv www/* .
rm -rf www
bower install
mv www/bower_components .
rm -rf www
git add -A
echo "-------------------------------------------------------------------------------------------------------"
echo Before we commit and push, open a new tab in your terminal.
echo ""
echo Navigate to $0/multiplatform-deploy-tmp/pvta-multiplatform
echo
echo Open index.html and ensure that the HEAD tag contains a google analytics script
echo AND the import statements include a Google API key.
echo
echo If not, make those changes.  Is it all good? [y/n]
read readyToCommit
if [ "$readyToCommit" = "y" ]; then
  doEverythingElse
else
  echo Oh well. Run this script again later when ready.
fi
