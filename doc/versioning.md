which is (currently) a 4 digit integer, as follows:

 - Round up to the nearest thousand for a major release (i.e. 1010 -> 2000, or in Semantic Versioning terms, this would be represented as 1.0.1 -> 2.0.0).

 - Round up to the nearest 100 for a minor release that may include bugfixes and features, but nothing crazy (i.e. 1120 -> 1200 or in Semantic Versioning terms, this would be represented as 1.1.2 -> 1.2.0).

 - Round up to the nearest 10 for a release that ONLY includes bugfixes, large or small (i.e. 1120 -> 1130 or in Semantic Versioning terms, this would be represented as 1.1.2 -> 1.1.3).

 - **INCREMENT** by one for a miniscule bugfix release. In Semantic Versioning terms, a change this small would not warrant a new version number.  Use at your own discretion.
