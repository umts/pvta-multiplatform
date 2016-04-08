cd ../
mkdir multiplatform-deploy-tmp
cp -r pvta-multiplatform multiplatform-deploy-tmp
cd multiplatform-deploy-tmp
git checkout gh-pages
npm install
bower install
mv www/* .
rm -rf www
