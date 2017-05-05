export var gaNewElem: any = {};
export var gaElems: any = {};

export function gaInit() {
  var currdate: any = new Date();

  /* tslint:disable:no-string-literal semicolon whitespace no-unused-expression */
  // This code is from Google, so let's not modify it too much, just add gaNewElem and gaElems:
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*currdate;a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga', gaNewElem, gaElems);
  /* tslint:enable:no-string-literal semicolon whitespace no-unused-expression */

}
