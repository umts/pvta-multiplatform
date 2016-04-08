#!/bin/bash
cd ../
mkdir multiplatform-deploy-tmp
cp -r pvta-multiplatform multiplatform-deploy-tmp
cd multiplatform-deploy-tmp/pvta-multiplatform
echo Type the branch you want to deploy to gh-pages and press RETURN.
read branch
git checkout $branch
git branch -D gh-pages
git checkout -b gh-pages
mv www/* .
rm -rf www
git add -A
commit = "Deploying $branch to gh-pages"
echo If you would like to include a commit message, add one and press RETURN
read personalized
if [ -z "$personalized" ]; then
  $commit = "$commit: $personalized"
fi
git commit -m "$commit"
echo Done
