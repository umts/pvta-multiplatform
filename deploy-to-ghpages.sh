#!/bin/bash
cd ../
mkdir multiplatform-deploy-tmp
echo Making a copy of pvta-multiplatform to be safe
cp -r pvta-multiplatform multiplatform-deploy-tmp
echo Done copying!
cd multiplatform-deploy-tmp/pvta-multiplatform
echo Type the branch you want to deploy to gh-pages and press RETURN.
read branch
git checkout $branch
git branch -D gh-pages
git checkout -b gh-pages
mv www/* .
rm -rf www
git add -A
commit="Deploying $branch to gh-pages"
echo If you would like to include a commit message, add one and press RETURN.
read personalized
if [ -z "$personalized" ]; then
  $commit = "$commit: $personalized"
fi
git commit -m "$commit"
echo Done committing.
echo Ready to push? Caution: your changes will be live on the internet! [y/n]
read confirm
if ["$confirm"="y"]; then
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
